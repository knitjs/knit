/* @flow */
/* eslint flowtype/no-weak-types: 0 */

import execa from 'execa';

export type TIsInstalled = () => Promise<string>;
export const isInstalled = () => execa('yarn', ['--version'], { stdio: 'ignore' });

export type TInit = (opts: Object) => Promise<*>;
const yarnInit: TInit = opts => execa('yarn', ['init', '--yes'], opts);
const npmInit: TInit = opts => execa('npm', ['init', '--yes'], opts);
export const init: TInit = opts => isInstalled()
  .then(() => yarnInit(opts))
  .catch(() => npmInit(opts));

export type TAdd = (argv: Array<string>, opts: Object) => Promise<*>;
const yarnAddDev: TAdd = (argv, opts) => execa('yarn', ['add', '--dev', ...argv], opts);
const npmInstallDev: TAdd = (argv, opts) => execa('npm', ['install', '--save-dev', ...argv], opts);
export const addDev: TAdd = (argv, opts) => isInstalled()
  .then(() => yarnAddDev(argv, opts))
  .catch(() => npmInstallDev(argv, opts));

const yarnAdd: TAdd = (argv, opts) => execa('yarn', ['add', ...argv], opts);
const npmInstall: TAdd = (argv, opts) => execa('npm', ['install', '--save', ...argv], opts);
export const add: TAdd = (argv, opts) => isInstalled()
  .then(() => yarnAdd(argv, opts))
  .catch(() => npmInstall(argv, opts));

export type TInfo = (module: string, argv: Array<string>, opts?: Object) => Promise<*>;
const yarnInfo: TInfo = (module, argv, opts) => execa.stdout('yarn', ['info', module, ...argv], opts);
const npmInfo: TInfo = (module, argv, opts) => execa.stdout('npm', ['info', module, ...argv, '--json'], opts);
export const info: TInfo = (module, argv = [], opts) => isInstalled()
  .then(() => yarnInfo(module, argv, opts))
  .catch(() => npmInfo(module, argv, opts));

export type TPublishedVersion = (module: string, opts?: Object) => Promise<string>;
export const publishedVersion: TPublishedVersion = (module, opts) => info(module, ['dist-tag', 'latest'], opts);

export type TPublishedVersions = (module: string, opts?: Object) => Promise<string>;
export const publishedVersions: TPublishedVersions = (module, opts) => info(module, ['versions'], opts);

export type TVersion = (v: string) => Promise<*>;
const yarnVersion: TVersion = v => execa('yarn', ['version', '--new-version', v]);
const npmVersion: TVersion = v => execa('npm', ['version', v]);
export const version: TVersion = v => isInstalled()
  .then(() => yarnVersion(v))
  .catch(() => npmVersion(v));

export type TPublish = (opts: Object) => Promise<*>;
export const yarnPublish: TPublish = opts => execa('yarn', ['publish'], opts);
export const npmPublish: TPublish = opts => execa('npm', ['publish'], opts);
export const publish: TPublish = opts => isInstalled()
  .then(() => yarnPublish(opts))
  .catch(() => npmPublish(opts));

export type TRun = (script: string, args: Array<string>, opts: Object) => Promise<*>;
export const yarnRun: TRun = (script, args, opts) => execa('yarn', ['run', script, ...args], opts);
export const npmRun: TRun = (script, args, opts) => execa('npm', ['run', script, ...args], opts);
export const run: TRun = (script, args, opts) => isInstalled()
  .then(() => yarnRun(script, args, opts))
  .catch(() => npmRun(script, args, opts));

export default {
  isInstalled,
  init,
  info,
  run,
  addDev,
  add,
  publishedVersion,
  publishedVersions,
  version,
  publish,
};
