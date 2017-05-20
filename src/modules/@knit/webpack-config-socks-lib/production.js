/* @flow */

import merge from 'webpack-merge';

import type { TConfig } from '@knit/webpack-config-socks';

import webpackConfig from './stage';

const prodWebpackConfig: TConfig = merge(webpackConfig, {});

export default prodWebpackConfig;
