/* @flow */

import webpack from 'webpack';
import merge from 'webpack-merge';
import CompressionPlugin from 'compression-webpack-plugin';

import stageWebpackConfig from './stage';

import type { TConfig } from './';

const newConfig: TConfig = {
  bail: true,
  profile: false,
  output: {
    pathinfo: false,
    filename: '[name].[hash].min.js',
  },
  plugins: [
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false,
    }),
    new webpack.optimize.UglifyJsPlugin({
      beautify: false,
      compress: {
        screw_ie8: true,
        warnings: false,
      },
      mangle: {
        screw_ie8: true,
      },
      output: {
        comments: false,
        screw_ie8: true,
      },
      sourceMap: true,
    }),
    new CompressionPlugin({
      asset: '[path].gz[query]',
      algorithm: 'zopfli',
      test: /\.(js|html)$/,
      threshold: 10240,
      minRatio: 0.8,
    }),
  ],
};

const prodWebpackConfig: TConfig = merge(
  stageWebpackConfig,
  newConfig
);

export default prodWebpackConfig;
