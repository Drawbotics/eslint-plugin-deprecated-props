import path from 'path';
import util from 'util';

import { CLIEngine } from 'eslint';

const cli = new CLIEngine({
  useEslintrc: false,
  configFile: path.resolve(__dirname, '../.eslintrc.js'),
});

describe('avoidDeprecated', () => {
  describe('generates the correct eslint output when', () => {
    it('the component interface is from an external library', async () => {
      const file = path.resolve(__dirname, '../external-definition.tsx');
      const res = await cli.executeOnFiles([file]);
      console.log(util.inspect(res, { depth: 2 }));
    });

    it('the component interface is in the same file', () => {});

    it('the component interface is in another file', () => {});
  });
});
