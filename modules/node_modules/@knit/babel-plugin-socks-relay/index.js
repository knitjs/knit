/* @flow */

const path = require('path');
const chalk = require('chalk');
const babelRelayPlugin = require('babel-relay-plugin');
const needle = require('@knit/needle');

try {
  // $FlowIgnore
  const schema = require(path.join(needle.paths.data, 'schema.json')); // eslint-disable-line import/no-dynamic-require
  console.log(`\n⇅  Loading ${chalk.white('GraphQL schema')} into ${chalk.white('Relay')}`);
  module.exports = babelRelayPlugin(schema.data, {
    abortOnError: needle.env['process.env'].TEST_ENV === 'single',
  });
} catch (e) {
  console.log(`${chalk.red('✗')}  Failed to find schema`);
  console.log(`➾  Start the ${chalk.white('GraphQL')} server and run ${chalk.cyan('`make schema`')}`);
}
