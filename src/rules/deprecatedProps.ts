import * as util from 'util';

import { getSourceFileOfNode } from '@typescript-eslint/eslint-plugin/dist/util';
import {
  ESLintUtils,
  ParserServices,
  TSESLint,
  TSESTree,
} from '@typescript-eslint/experimental-utils';
import * as ESLint from 'eslint';
import * as ESTtree from 'estree';
import { canHaveJsDoc, convertAst, getJsDoc } from 'tsutils';
import * as ts from 'typescript';

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

const meta: TSESLint.RuleMetaData<'avoidDeprecated'> = {
  type: 'problem',
  messages: {
    avoidDeprecated: `Avoid using '{{ name }}' since it's deprecated. '{{ reason }}'`,
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
        const parent = node.parent as TSESTree.Node;
        const tsNode = services.esTreeNodeToTSNodeMap.get(node) as ts.Node;
        // const signature = tc?.getResolvedSignature(tsNode as ts.CallLikeExpression);
        const tc = services.program.getTypeChecker();
        const symbol = getSymbol(node as TSESTree.Identifier, services, tc);
        // console.log(util.inspect(symbol, { depth: 2 }));
        const withJsDoc = canHaveJsDoc(tsNode);
        // Interface Declaration = 246
        const parentSymbol = (symbol as any).parent as ts.Symbol;
        const declarations = parentSymbol.getDeclarations();
        const sourceFileDeclaration = declarations?.find(
          (declaration) => declaration.kind === ts.SyntaxKind.SourceFile,
        ) as ts.SourceFile;

        if (sourceFileDeclaration == null) {
          return {};
        }

        const interfaceDeclarations = sourceFileDeclaration.statements.filter(
          (statement: ts.Statement) => statement.kind === ts.SyntaxKind.InterfaceDeclaration,
        ) as Array<ts.InterfaceDeclaration>;

        for (const interfaceDeclaration of interfaceDeclarations) {
          // const callSignatures = interfaceDeclaration.members.map(
          //   (node) => node as ts.CallSignatureDeclaration,
          // );
          // const signatures = callSignatures.map((signature) => signature
          // const propsWithDoc = interfaceDeclaration.members.map((node) => ({ name:  }) );

          const symbols = interfaceDeclaration.members.map(
            (member) => (member as any).symbol as ts.Symbol,
          );
          const properties = symbols
            .filter((symbol) => symbol.getJsDocTags().length > 0)
            .map((symbol) => ({
              name: symbol.getName(),
              doc: symbol.getJsDocTags(),
            }));

          const deprecatedProps = properties.filter((property) =>
            property.doc.some((doc) => doc.name === 'deprecated'),
          );

          console.log(util.inspect(deprecatedProps, { depth: 4 }));
        }
      },
    };
  },
} as TSESLint.RuleModule<'avoidDeprecated', []>;
