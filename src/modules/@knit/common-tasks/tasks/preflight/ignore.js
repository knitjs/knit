/* @flow weak */

const path = require('path');
const fs = require('fs-extra');

const needle = require('@knit/needle');

const tasks = [
  {
    title: 'looking for `node_modules` in .*ignore files',
    skip: ctx => ctx.skipPreflight,
    task: () => {
      const files = ['.gitignore', '.eslintignore'];
      files.forEach(f => {
        const fPath = path.join(needle.paths.rootDir, f);
        try {
          if (fs.statSync(fPath).isFile()) {
            const lines = fs.readFileSync(path.join(needle.paths.rootDir, f), 'utf8').split(/\n/);

            lines.forEach(l => {
              if (l.indexOf('node_modules') !== -1 && l.indexOf('/') !== 0) {
                throw {
                  message: `found \`node_modules\` in ${f}`,
                  stderr: '`node_modules` without a leading `/` will ignore all node_modules folders everywhere in the project. Instead use `/node_modules` to only ignore the root level node_modules folder where 3rd packages are installed.',
                };
              }
            });
          }
        } catch (err) {
          if (err.code !== 'ENOENT') {
            throw err;
          }
        }
      });
    },
  },
];

module.exports = tasks;
