import { Rule } from 'eslint';
import { Node } from 'estree';

const testClassName = (context: Rule.RuleContext, node: Node) => {
  if (node.type !== 'ClassDeclaration') {
    return false;
  }

  const name = context.getDeclaredVariables(node)[0].name;
  const nameVariables = name.split(/(?=[A-Z])/);

  const minNoOfWords = 2;

  if (nameVariables.length >= minNoOfWords) {
    return false;
  }

  context.report({
    message: 'class name is too short',
    node,
  });

  return true;
};

export default {
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow deprecated properties',
      category: 'Possible Errors',
    },
    schema: [], // no options
  },
  create: function (context: Rule.RuleContext) {
    return {
      ClassDeclaration(node: Node) {
        testClassName(context, node);
      },
    };
  },
} as Rule.RuleModule;
