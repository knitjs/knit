/* @flow */
/* eslint flowtype/no-weak-types: 0 */

// $FlowIgnore
const webpackConfig: TConfig = process.env.NODE_ENV === 'production'
  ? require('./production')
  : require('./stage');

export default webpackConfig;
