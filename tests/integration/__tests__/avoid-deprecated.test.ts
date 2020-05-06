import path from 'path';

import { CLIEngine } from 'eslint';

const engineConfig = {
  useEslintrc: false,
  configFile: path.resolve(__dirname, '../.eslintrc.js'),
};

const cli = new CLIEngine(engineConfig);

const stringPattern = /Avoid using '\w+' since it's deprecated\. .*?$/;

describe('avoidDeprecated', () => {
  describe('when the component interface is from an external library', () => {
    let res: CLIEngine.LintReport;

    beforeEach(() => {
      const file = path.resolve(__dirname, '../external-definition.tsx');
      res = cli.executeOnFiles([file]);
    });

    it('generates the right amount of warnings and errors', () => {
      const { warningCount, errorCount } = res.results[0]!;

      expect(warningCount).toEqual(1);
      expect(errorCount).toEqual(0);
    });

    it('matches the message pattern', () => {
      const { messages } = res.results[0]!;
      const text = messages[0].message;

      expect(text).toMatch(stringPattern);
    });

    it('generates exactly the right warning', () => {
      const { messages } = res.results[0]!;
      const text = messages[0].message;

      expect(text).toMatch(`Avoid using 'category' since it's deprecated. use color instead`);
    });

    it('the warning is at the right position', () => {
      const { messages } = res.results[0]!;
      const { column, line, endColumn } = messages[0];

      expect(line).toEqual(7);
      expect(column).toEqual(31);
      expect(endColumn).toEqual(39);
    });
  });

  describe('when the component has a prop with the same name as a deprecated prop of one of its prop components', () => {
    let res: CLIEngine.LintReport;

    beforeEach(() => {
      const file = path.resolve(__dirname, '../external-definition-false-positive.tsx');
      res = cli.executeOnFiles([file]);
    });

    it('generates no warnings and errors', () => {
      const { warningCount, errorCount } = res.results[0]!;

      expect(warningCount).toEqual(0);
      expect(errorCount).toEqual(0);
    });
  });

  describe('when the component interface is in the same file', () => {
    let res: CLIEngine.LintReport;

    beforeEach(() => {
      const file = path.resolve(__dirname, '../local-definition.tsx');
      res = cli.executeOnFiles([file]);
    });

    it('generates the right amount of warnings and errors', () => {
      const { warningCount, errorCount } = res.results[0]!;

      expect(warningCount).toEqual(2);
      expect(errorCount).toEqual(0);
    });

    it('matches the message pattern', () => {
      const { messages } = res.results[0]!;

      const text1 = messages[0].message;
      expect(text1).toMatch(stringPattern);

      const text2 = messages[1].message;
      expect(text2).toMatch(stringPattern);
    });

    it('generates exactly the right warnings', () => {
      const { messages } = res.results[0]!;

      const text1 = messages[0].message;
      expect(text1).toMatch(`Avoid using 'someProp' since it's deprecated. reason`);

      const text2 = messages[1].message;
      expect(text2).toMatch(`Avoid using 'someProp2' since it's deprecated. reason2`);
    });

    it('the warnings are at the right position', () => {
      const { messages } = res.results[0]!;

      expect(messages[0].line).toEqual(27);
      expect(messages[0].column).toEqual(18);
      expect(messages[0].endColumn).toEqual(26);

      expect(messages[1].line).toEqual(27);
      expect(messages[1].column).toEqual(30);
      expect(messages[1].endColumn).toEqual(39);
    });
  });

  describe('when the component interface extends from another interface', () => {
    let res: CLIEngine.LintReport;

    beforeEach(() => {
      const file = path.resolve(__dirname, '../local-definition-extends.tsx');
      res = cli.executeOnFiles([file]);
    });

    it('generates the right amount of warnings and errors', () => {
      const { warningCount, errorCount } = res.results[0]!;

      expect(warningCount).toEqual(1);
      expect(errorCount).toEqual(0);
    });

    it('matches the message pattern', () => {
      const { messages } = res.results[0]!;

      const text = messages[0].message;
      expect(text).toMatch(stringPattern);
    });

    it('generates exactly the right warning', () => {
      const { messages } = res.results[0]!;

      const text = messages[0].message;
      expect(text).toMatch(`Avoid using 'deprecatedProp' since it's deprecated. `);
    });
  });

  // TODO when the component interface extends from an external interface
});
