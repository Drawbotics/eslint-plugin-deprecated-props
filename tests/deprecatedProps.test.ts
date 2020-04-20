import { RuleTester } from 'eslint';

import rule from '../src/rules/deprecatedProps';

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 2019,
    ecmaFeatures: {
      jsx: true,
    },
  },
});

ruleTester.run('deprecated-prop', rule, {
  valid: [
    {
      code: 'class HelloWorld extends Component { render() { return ( <h1>hello world!</h1> ) }}',
    },
    {
      code: 'class HelloWorldHi extends Component { render() { return ( <h1>hello world!</h1> ) }}',
    },
  ],
  invalid: [
    {
      code: 'class Hello extends Component { render() { return ( <h1>hello world!</h1> ) }}',
      errors: [
        {
          message: 'class name is too short',
          type: 'ClassDeclaration',
        },
      ],
    },
  ],
});
