/* @flow */

import path from 'path';
import webpack from 'webpack';
import merge from 'webpack-merge';
import HtmlWebpackPlugin from 'html-webpack-plugin';

import needle from '@knit/needle';
import webpackConfig from '@knit/webpack-config-socks';

import type { TConfig } from '@knit/webpack-config-socks';

const LIBS_BUNDLE = 'libs';

const newConfig: TConfig = {
  target: 'web',
  entry: {
    bundle: [path.join(needle.paths.src, 'index.js')],
    [LIBS_BUNDLE]: Object.keys(needle.pkg.dependencies || {}),
  },
  output: {
    path: path.join(needle.paths.dist, (typeof needle.env.__BASE__ === 'string' ? needle.env.__BASE__ : ''), 'js'),
    pathinfo: true,
    publicPath: path.join('/', (typeof needle.env.__BASE__ === 'string' ? needle.env.__BASE__ : ''), 'js/'),
    filename: '[name].[hash].js',
    chunkFilename: '[id].js',
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin(LIBS_BUNDLE),
    new HtmlWebpackPlugin({
      inject: true,
      template: path.join(needle.paths.src, 'index.html'),
      filename: '../index.html',
      minify: {
        collapseWhitespace: true,
      },
    }),
  ],
};

const stageWebpackConfig: TConfig = merge(
  webpackConfig,
  newConfig
);

export default stageWebpackConfig;
