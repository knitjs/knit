/* @flow weak */

import path from "path";

import depcheck from "depcheck";
import pify from "pify";
import needle from "@knit/needle";

import specialEslint from "./specials/eslint";

export type TParser = (
  content: string,
  filePath: string,
  deps: Array<string>,
  rootDir: string
) => Array<string>;

export type TOptions = {|
  ignoreBinPackage: boolean,
  ignoreDirs: Array<string>,
  ignoreMatches: Array<string>,
  parsers: {
    [k: string]: mixed
  },
  detectors: Array<mixed>,
  specials: Array<mixed>
|};

export type TResults = {|
  dependencies: Array<string>,
  devDependencies: Array<string>,
  missing: { [k: string]: Array<string> },
  using: { [k: string]: Array<string> },
  unused: { [k: string]: Array<string> },
  invalidFiles: { [k: string]: string },
  invalidDirs: { [k: string]: string }
|};

export type TDepcheck = (dir: string) => Promise<TResults>;

const options: TOptions = {
  ignoreBinPackage: false, // ignore the packages with bin entry
  ignoreDirs: [needle.paths.outputDir, needle.paths.testDirPattern],
  ignoreMatches: [],
  parsers: {
    "*.js": depcheck.parser.es7,
    "*.jsx": depcheck.parser.jsx,
    "*.ts": depcheck.parser.typescript,
    "*.tsx": depcheck.parser.typescript
  },
  detectors: [
    depcheck.detector.requireResolveCallExpression,
    depcheck.detector.requireCallExpression,
    depcheck.detector.importCallExpression,
    depcheck.detector.importDeclaration,
    depcheck.detector.exportDeclaration,
    depcheck.detector.typescriptImportEqualsDeclaration,
    depcheck.detector.typescriptImportType
  ],
  specials: [
    depcheck.special.babel,
    specialEslint,
    depcheck.special.jest,
    depcheck.special.prettier,
    depcheck.special.ttypescript,
    depcheck.special.webpack
  ]
};

const dc: TDepcheck = d => {
  // depcheck needs an absolute path
  const dir = path.isAbsolute(d) ? d : path.join(needle.paths.rootDir, d);
  return (
    // a lookup indicating each dependency is used by which files
    pify(depcheck)(dir, options)
      .then({
        dependencies: [],
        devDependencies: [],
        missing: {},
        using: {},
        unused: {},
        invalidFiles: {},
        invalidDirs: {}
      })
      .catch(res => {
        // weird library that only returns errors
        if (res.code) throw new Error(res);
        return res;
      })
  );
};

export default dc;
