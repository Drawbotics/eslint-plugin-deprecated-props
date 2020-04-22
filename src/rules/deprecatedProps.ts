import { ParserServices, TSESLint, TSESTree } from '@typescript-eslint/experimental-utils';
import ts from 'typescript';

interface JSDocProperty {
  name: string;
  tag: string;
  description?: string;
}

type RequiredParserServices = {
  [k in keyof ParserServices]: Exclude<ParserServices[k], undefined>;
};

function isPropertyAssignment(node: ts.Node): node is ts.PropertyAssignment {
  return node.kind === ts.SyntaxKind.PropertyAssignment;
}

function isShorthandPropertyAssignment(node: ts.Node): node is ts.ShorthandPropertyAssignment {
  return node.kind === ts.SyntaxKind.ShorthandPropertyAssignment;
}

function getSymbol(id: TSESTree.Identifier, services: RequiredParserServices, tc: ts.TypeChecker) {
  let symbol: ts.Symbol | undefined;
  const tsId = services.esTreeNodeToTSNodeMap.get(id as TSESTree.Node) as ts.Identifier;
  const parent = services.esTreeNodeToTSNodeMap.get(id.parent as TSESTree.Node) as ts.Node;
  if (parent.kind === ts.SyntaxKind.BindingElement) {
    symbol = tc.getTypeAtLocation(parent.parent).getProperty(tsId.text);
  } else if (
    (isPropertyAssignment(parent) && parent.name === tsId) ||
    (isShorthandPropertyAssignment(parent) && parent.name === tsId)
  ) {
    try {
      symbol = tc.getPropertySymbolOfDestructuringAssignment(tsId);
    } catch (e) {
      // do nothing, we are in object literal, not destructuring
      // no obvious easy way to check that in advance
    }
  } else {
    symbol = tc.getSymbolAtLocation(tsId);
  }

  if (symbol && (symbol.flags & ts.SymbolFlags.Alias) !== 0) {
    return tc.getAliasedSymbol(symbol);
  }
  return symbol;
}

function getOpeningElement(nodes: Array<TSESTree.Node>): TSESTree.JSXOpeningElement | undefined {
  return nodes.find((node) => node.type === 'JSXOpeningElement') as TSESTree.JSXOpeningElement;
}

function getSourceFileParent(node: ts.Node): ts.SourceFile | undefined {
  if (ts.isSourceFile(node)) {
    return node;
  }
  if (node.parent == null) {
    return;
  }
  return getSourceFileParent(node.parent);
}

const meta: TSESLint.RuleMetaData<'avoidDeprecated'> = {
  type: 'problem',
  messages: {
    avoidDeprecated: `Avoid using '{{ name }}' since it's deprecated. {{ reason }}`,
  },
  schema: [],
};

export default {
  meta,
  create: function (context: TSESLint.RuleContext<'avoidDeprecated', []>) {
    if (context.parserServices == null) {
      return {};
    }
    const services = context.parserServices as RequiredParserServices;
    return {
      JSXIdentifier(node: TSESTree.Node) {
        const tc = services.program.getTypeChecker();
        const symbol = getSymbol(node as TSESTree.Identifier, services, tc);
        const declaration = symbol?.valueDeclaration;

        // If it's not a VariableDeclaration, stop looking
        if (declaration == null || declaration.kind !== ts.SyntaxKind.VariableDeclaration) {
          return false;
        }

        const ancestors = context.getAncestors();
        const openingJsxElement = getOpeningElement(ancestors);
        const attributeNames =
          openingJsxElement?.attributes
            .filter((attribute) => attribute.type === 'JSXAttribute')
            .map((attribute) => attribute.name.name) ?? [];

        // If the JSX element has no props
        if (attributeNames.length === 0) {
          return false;
        }

        // Get JSDoc from parent def (source file)
        const sourceFileDeclaration =
          symbol != null ? getSourceFileParent(symbol.valueDeclaration) : null; // Need parent

        // If there is no declaration file, stop looking
        if (sourceFileDeclaration == null) {
          return false;
        }

        const interfaceDeclarations = sourceFileDeclaration.statements.filter(
          (statement: ts.Statement) => statement.kind === ts.SyntaxKind.InterfaceDeclaration,
        ) as Array<ts.InterfaceDeclaration>;

        let deprecatedPropReports: Array<JSDocProperty> = [];

        for (const interfaceDeclaration of interfaceDeclarations) {
          const symbols = interfaceDeclaration.members.map(
            (member) => (member as any).symbol as ts.Symbol,
          );
          const properties = symbols
            .filter((symbol) => symbol.getJsDocTags().length > 0)
            .map((symbol) => ({
              name: symbol.getName(),
              doc: symbol.getJsDocTags(),
            }));

          const propertiesForCurrentInterface: Array<JSDocProperty> = properties
            .filter(
              (property) =>
                property.doc.some((tag) => tag.name === 'deprecated') &&
                attributeNames.includes(property.name),
            )
            .map((property) => {
              const deprecated = property.doc.find((tag) => tag.name === 'deprecated');
              return {
                name: property.name,
                tag: deprecated!.name,
                description: deprecated?.text,
              };
            });

          deprecatedPropReports.push(...propertiesForCurrentInterface);
        }

        for (const report of deprecatedPropReports) {
          context.report({
            node,
            messageId: 'avoidDeprecated',
            data: {
              name: report.name,
              reason: report.description,
            },
          });
        }
      },
    };
  },
} as TSESLint.RuleModule<'avoidDeprecated', []>;
