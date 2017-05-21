/* @flow */

import Listr from "listr";
import chalk from "chalk";

import {
  findDependencies,
  findMissingDependencies
} from "@knit/find-dependencies";

import type { TModules } from "@knit/knit-core";

type TOptions = {
  scope: string,
  include: Array<string>,
  exclude: Array<string>,
  workingDir: string
};

const log = require("@knit/logger");
const errors = require("@knit/nice-errors");
const tasks = require("@knit/common-tasks");
const needle = require("@knit/needle");

type TArgv = {
  modules: TModules,
  "show-dependencies": boolean
} & TOptions;

module.exports = (argv: TArgv) => {
  new Listr([...tasks.modules, ...tasks.readPackages], {
    renderer: log.getRenderer(argv)
  })
    .run(argv)
    .then(ctx => {
      console.log();
      log.info(
        chalk.white(
          `showing ${ctx["show-dependencies"] ? "dependencies for " : ""}${[ctx.modules.length, argv.scope, "packages"].join(" ")}`
        )
      );
      console.log();
      Promise.all(
        ctx.modules.map(m =>
          findDependencies(ctx.workingDir || needle.paths.modules, m)
            .then(using => {
              const missing = findMissingDependencies(
                using,
                ctx.public,
                needle.pkg.dependencies
              );

              console.log(
                chalk.white(`- ${m}`),
                chalk.white(`(${ctx.pkgs[m].version})`),
                chalk.grey(
                  [
                    `[${using.length} dependencies`,
                    missing.length
                      ? `, ${chalk.red(`${missing.length} missing`)}]`
                      : "]"
                  ].join("")
                )
              );

              if (argv["show-dependencies"]) {
                if (using.length) {
                  log.subtree(using.join(" "));
                }
                if (missing.length > 0) {
                  log.missing();
                  log.subtree(chalk.white(missing.join(" ")));
                }
                console.log();
              }
            })
            .catch(errors.catchErrors)
        )
      );
    })
    .catch(errors.catchErrors);
};