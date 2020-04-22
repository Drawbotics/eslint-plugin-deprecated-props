# ESLint-plugin-deprecated-props

Plugin to report usage of deprecated typescript `interface` properties in React components props. The keyword here is "usage", if the property is not used then the linter does not throw a warning.

**Example:**
```tsx
interface ComponentProps {
  /**
   * Some prop that is going to be removed in the future
   * @deprecated Use someOtherProp instead
   */
  someProp?: string;

  someOtherProp: string;
}

/**
 * Note that the @deprecated prop is used in the implementation
 * since it should still work. This does not throw a warning per se.
 */
const Component = ({ someProp, someOtherProp }: ComponentProps) => {
  const usedValue = someOtherProp != null ? someOtherProp : someProp;
  return <div>{someProp}</div>;
};

export const Test = () => {
  return (
    <React.Fragment>
      {/* Eslint will complain */}
      <Component someProp="" someOtherProp="" /> 
      {/* Eslint will NOT complain */}
      <Component someOtherProp="" />
    </React.Fragment>
  );
};
```

### Note
This plugin was created _specifically_ for a use case we needed at Drawbotics, and is as such not intended as a generic plugin to report deprecation. If the use case described below is not the same that you are encountering, you can check out any of the following plugins:
- [eslint-plugin-deprecate](https://github.com/AlexMost/eslint-plugin-deprecate)
- [eslint-plugin-import/no-deprecated](https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/no-deprecated.md)
- [eslint-plugin-deprecation](https://github.com/gund/eslint-plugin-deprecation)


## Installation
Make sure the project already has eslint installed. Note that this plugin works with `@typescript-eslint/parser`, so you need to have that installed as well.
```bash
$ npm install @drawbotics/eslint-plugin-deprecated-props --save-dev
```

## Configuration
To configure this plugin to work properly, you need to set the following fields in your `.eslintrc.js`
```js
module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['@drawbotics/eslint-plugin-deprecated-props'],
  parserOptions: {
    sourceType: 'module',
    project: './tsconfig.json',
  },
  rules: {
    '@drawbotics/deprecated-props/deprecated-props': ['warn'],  // Or 'error'
  },
};
```
Note that this is simply the most minimal config for the plugin to work, you would normally already have other settings and rules in place for your project, but this is the bare minimum.

## Testing
To run the integration tests simply run
```bash
$ npm run test
```

## Todo list
As mentioned above, this plugin was created for a very specific use case. If you would like to use it and/or contribute to make it better, feel free to submit a PR.

- [x] Warn when interface and component are defined in the same location as usage
- [x] Warn when interface and component are defined in an external file
- [x] Warn when interface extends other locally defined interface with deprecated props
- [ ] Warn when the interface with deprecated props is not in the same location as the component definition
- [ ] Warn when interface extends an externally defined interface with deprecated props
- [ ] Warn when the component is created through `React.createElement` or `React.cloneElement`