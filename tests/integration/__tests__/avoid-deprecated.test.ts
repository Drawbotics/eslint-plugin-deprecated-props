import path from 'path';
import util from 'util';

import { CLIEngine } from 'eslint';

const engineConfig = {
  useEslintrc: false,
  configFile: path.resolve(__dirname, '../.eslintrc.js'),
};

const cli = new CLIEngine(engineConfig);

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

    it('generates the right warning', () => {
      const { messages } = res.results[0]!;

      const text = messages[0].message;
      expect(text).toMatch(/Avoid using '\w+' since it's deprecated\. .+$/);
    });

    it('generates exactly the right warning', () => {
      const { messages } = res.results[0]!;

      const text = messages[0].message;
      expect(text).toMatch(`Avoid using 'category' since it's deprecated. use color instead`);
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

    it('generates the right warnings', () => {
      const { messages } = res.results[0]!;

      const text1 = messages[0].message;
      expect(text1).toMatch(/Avoid using '\w+' since it's deprecated\. .+$/);

      const text2 = messages[1].message;
      expect(text2).toMatch(/Avoid using '\w+' since it's deprecated\. .+$/);
    });

    it('generates exactly the right warnings', () => {
      const { messages } = res.results[0]!;

      const text1 = messages[0].message;
      expect(text1).toMatch(`Avoid using 'someProp' since it's deprecated. reason`);

      const text2 = messages[1].message;
      expect(text2).toMatch(`Avoid using 'someProp2' since it's deprecated. reason2`);
    });
  });

  describe('when the component interface extends from another file', () => {
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

    it('generates the right warning', () => {
      const { messages } = res.results[0]!;

      const text = messages[0].message;
      expect(text).toMatch(/Avoid using '\w+' since it's deprecated\. .+$/);
    });

    it('generates exactly the right warning', () => {
      const { messages } = res.results[0]!;

      const text = messages[0].message;
      expect(text).toMatch(`Avoid using 'deprecatedProp' since it's deprecated. `);
    });
  });
});
