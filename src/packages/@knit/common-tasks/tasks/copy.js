/* @flow */

const needle = require("@knit/needle");
const fs = require("fs-extra");
const multimatch = require("multimatch");

type TCtx = {
  workspace: string,
  outputDir: string,
  ignorePath: Array<string>
};

const tasks = [
  {
    title: "copying src files",
    task: (ctx: TCtx) => {
      const packageDir = ctx.workspace || needle.paths.workspace;
      fs.copySync(packageDir, ctx.outputDir || needle.paths.outputDir, {
        filter: src => {
          const stub = src.replace(new RegExp(`^${packageDir}/?`), "");

          if (
            !stub.length ||
            (stub.split("/").length === 1 && stub[0] === "@")
          ) {
            return true;
          }

          const drop = ctx.ignorePath
            ? multimatch([stub], ctx.ignorePath).length
            : false;

          return !drop;
        }
      });

      return ctx;
    }
  }
];

module.exports = tasks;
