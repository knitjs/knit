/* @flow */
/* eslint flowtype/no-weak-types:0 */

module.exports = (context: any, opts: Object) => {
  const options = Object.assign(
    {
      loose: true,
      targets: {
        browsers: ['last 2 versions'],
      },
    },
    opts,
    { modules: process.env.JS_NEXT ? false : 'commonjs' }
  );
  const presets: Array<string | [string, Object]> = [
    require.resolve('babel-preset-react'),
    [require.resolve('babel-preset-env'), options],
  ];
  const buildPlugins: Array<string | [string, Object]> = [
    require.resolve('babel-plugin-transform-class-properties'),
    [require.resolve('babel-plugin-transform-object-rest-spread'), {
      useBuiltIns: true,
    }],
  ];
  const devPlugins = [
    // Adds component stack to warning messages
    require.resolve('babel-plugin-transform-react-jsx-source'),
    // Adds __self attribute to JSX which React will use for some warnings
    require.resolve('babel-plugin-transform-react-jsx-self'),
  ];

  const env = process.env.BABEL_ENV || process.env.NODE_ENV;

  const plugins = env === 'development'
    ? [...buildPlugins, ...devPlugins]
    : buildPlugins;

  return {
    presets,
    plugins,
  };
};
