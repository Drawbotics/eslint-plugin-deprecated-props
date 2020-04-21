import { RuleTester } from 'eslint';

import rule from '../src/rules/deprecatedProps';

const ruleTester = new RuleTester({
  parserOptions: {
    parser: '@typescript-eslint/parser',
    ecmaVersion: 2019,
    ecmaFeatures: {
      jsx: true,
    },
  },
});

ruleTester.run('deprecated-prop', rule, {
  valid: [
    {
      code: `
        interface ComponentProps {
          /** @deprecated reason */
          someProp?: string;

          someOtherProp: number;
        }

        const Component = ({ someProp, someOtherProp }: ComponentProps) => {
          return <div>{someProp}{someOtherProp}</div>;
        }

        const Test = () => {
          return <Component someOtherProp={1} />
        };
      `,
    },
  ],
  invalid: [
    {
      code: `
        interface ComponentProps {
          /** @deprecated reason */
          someProp?: string;

          someOtherProp: number;
        }

        const Component = ({ someProp, someOtherProp }: ComponentProps) => {
          return <div>{someProp}{someOtherProp}</div>;
        }

        const Test = () => {
          return <Component someProp="sdf" someOtherProp={1} />
        };
      `,
      errors: [
        {
          message: 'class name is too short',
          type: 'ClassDeclaration',
        },
      ],
    },
  ],
});
