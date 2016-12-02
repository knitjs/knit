![KnitJS](docs/knitjs_header.png "KnitJS Logo")

---

KnitJS is a set of tools to help simplify development and publishing of JS [multi-package repositories](https://github.com/babel/babel/blob/master/doc/design/monorepo.md).

**Fast:** Uses Yarn to install dependencies and only needs to install once rather than in each module.

**Simple:** Uses built-in node package resolution so there doesn't have to be a bootstrap step.  

**Compatible** Uses a single `package.json` for dependencies so knit repos are compatible with external tools.

- [Features](#features)
- [Install](#install-knit)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [CLI Commands](#cli-commands)
- [FAQ](#faq)
- [Compared to](#compared-to)
- [Prior Art](#prior-art)

## Features

- Reduced overhead when working with Monorepos
- Uses a single root level `package.json` for package management meaning Knit works with tools like [Yarn](https://yarnpkg.com/), [flow-typed](https://github.com/flowtype/flow-typed), [Greenkeeper](https://greenkeeper.io/).
- Meta data is stored in the root `package.json` rather than duplicated in each module.
- No bootstrap step needed to link modules
- Dependency versions are defined globally and so stay in sync across modules
- Auto discovery of missing and unused dependencies
- Exposed internal that offer a simple [core](https://github.com/knitjs/knit/tree/master/modules/node_modules/%40knit/knit-core) api for building tools around
- Optional, flexible and extendable workflow for publishing apps or libraries
- Supports commonjs, es6 modules and umd as build targets

## Install

You should have the following programs installed before starting:

 - [git](https://git-scm.com/)
 - [yarn](https://yarnpkg.com/)

It is recommended that knit be installed as a local package using npm scripts but it can also work as a global package.

#### Global

```
yarn global add @knit/knit
```

#### Local

```
yarn add @knit/knit
```

```
// package.json
{
  ...
  "scripts": {
    ...
    "knit": "knit"
  }
}
```

![help](docs/help.png "KnitJS Help")

## Getting Started

See our [create-knit-app](https://github.com/knitjs/knit/tree/master/modules/node_modules/create-knit-app) for instructions on getting started.

## CLI

For a full list of commands see the cli documentation [here](https://github.com/knitjs/knit/tree/master/modules/node_modules/%40knit/knit)

##FAQ

#### When would I want to use knit?

Knit excels at managing a large JS multi-package repositories so the more modules you have in your repo the more time Knit will save you trying to manage dependencies and publishing new versions.

#### What kind of projects are supported?

Knit supports node libraries, browser facing libraries and browser applications. By default knit can build modules targeting `commonjs`, `es6 modules` using [babel](https://babeljs.io/) and `umd` using [webpack](https://webpack.js.org/) as well as publish to npm.  For applications knit uses `webpack` to bundle all your assets together for easy deployment.
These built-in build steps are optional and replaceable but cover the common use case of just using `babel` and `webpack` with a custom config.

#### How does the package resolution work?

We use [depchek](https://github.com/depcheck/depcheck) to generate a list of required packages per module. We can compare these to the dependencies found in your root `package.json` and show missing or unused packages for your modules.

#### How can I add an extra step before releasing?

All individual step in a multi step convenience command are exposed as their own action. The [release](https://github.com/knitjs/knit/tree/master/modules/node_modules/%40knit/knit#release) command can be recreated by calling each step individually and adding your custom step where needed:

```
knit version <version>
node make_changelog.js
knit build
knit stitch
knit publish
```

#### How can I replace a release step with my own?

Taking the previous example to the next level you can make your own task that uses the same data and workflow that built-in knit commands use. The built-in commands are all based on [@knit/common-tasks](https://github.com/knitjs/knit/tree/master/modules/node_modules/%40knit/common-tasks) which itself uses [@knit/knit-core](https://github.com/knitjs/knit/tree/master/modules/node_modules/%40knit/knit-core).
You could easily write your own build steps using [Listr](https://github.com/SamVerschueren/listr) and `@knit/common-tasks`:

```
// build.js
const Listr = require('listr');
const tasks = require('@knit/common-tasks');

new Listr([
  ...tasks.modules,
  ...tasks.packages,
  ...tasks.updated,
 {
  title: 'my custom build step',
  task: ctx => {
    // ctx.modules has a list of all modules
    // ctx.packages has a mapping of all module package.json data
    // ctx.updated is a list of updated modules
    // do custom build stuff using module lists
  }
}
]).run();
```

and then you can use your custom build step that will only build updated modules:

```
knit version <version>
node build.js
knit stitch
knit publish
```

If you don't want to use `Listr` for some reason - you can access the `@knit/knit-core` api directly:

```
// build.js

const knit = require('@knit/knit-core');

const modules = knit.findPublicModules();
knit.findUpdatedSince(modules, SOME_GIT_TAG).then(updated => {
  // do custom build stuff using module lists  
})
```

#### What if I want don't want to use knit at all for releasing?

You can still use knit even if you have your own build or publishing workflow. The build step that [stitches](https://github.com/knitjs/knit/tree/master/modules/node_modules/%40knit/knit#stitch) together your modules' dependencies and populates your modules' `package.json` is a separate command that can run independently or be integrated into your workflow.

#### How do I make knit see a CLI tool like babel-cli?

Knit can only find a dependency if you use `require()`, `require.resolve()` or `import`. If you need to include a package that knit cannot see you can add it as a dependency in the module `package.json`.

The knit-cli does this by setting `babel-cli` as a dependency in its [package.json](https://github.com/knitjs/knit/blob/master/modules/node_modules/%40knit/knit/package.json#L9)

Notice that no version is set, just a `*`, this is because the version will be replaced later when the module is released using the version in the project's `package.json`

#### How does knit treat dependencies and devDependencies

The split between dependencies and devDependencies is based entirely on what is getting published to an npm registry. Any dependencies found in your modules' source `.js` will be considered as `dependencies` and everything else, test dependencies and anything found in `"private": true` modules, will be considered as devDependencies.

DevDependencies are left up to the Developer to manage.

#### But is it treating ReactDOM as a devDependency! I need that for my app!

You can build your app in whatever way you want - but if you aren't pushing a module with ReactDOM to npm it should go under devDependencies.

## Compared To

#### Lerna

https://lernajs.io/

Lerna is the obvious comparison here and while the over lap between the two tools is considerable they currently take a very different approach to dealing with modules.

Some advantaged over Lerna:

 - Compatible with Yarn so can take advantage of yarn's install speed up
 - No bootstrap step
   - only needs to install dependencies once instead of for each module
 - Installs are much faster
 - Keeps all dependencies in one root level package.json
   - simplified version management
   - compatible with tools like [flow-typed](https://github.com/flowtype/flow-typed) or [Greenkeeper](https://greenkeeper.io/)
- Keeps all metadata in root level package.json
- Knit has cool features like [listing out your modules dependencies](https://github.com/knitjs/knit/tree/master/modules/node_modules/%40knit/knit#list--d---dependencies) and [checking for missing or unused packages](https://github.com/knitjs/knit/tree/master/modules/node_modules/%40knit/knit#validate).
- Compatible with node's built-in module resolution
- Very flexible publishing step, no forced compound actions

Some disadvantages:

  - Lerna has some cool features like [importing git repos into your monorepo](https://github.com/lerna/lerna#import)
  - Lerna has been around a lot longer and is better tested and documented
  - Lerna has a more flexible versioning options, Knit only supports the equivalent of Lerna's [Fixed/Locked mode](https://github.com/lerna/lerna#fixedlocked-mode-default)
  - Since each package has its own dependencies using npm actions (like prepublish) can be easier.

## Prior Art

Of course Knit wasn't created in a vacuum and is inspired by and makes use of many amazing tools:

- [Yarn](https://yarnpkg.com/) - awesomely fast new package manager for node. Creating a monorepo build tool that could work with yarn was the reason this project was started.
- [Lerna](https://lernajs.io/) - inspiration for the idea that monorepos could be a thing
- [Alle](https://github.com/boennemann/alle) - amazing set of ideas that resonated with our experiences on how to make monorepo development better and easier.
- [Depchek](https://github.com/depcheck/depcheck) - at the heart of the dependency resolution. Great library and extremely easy to [extend](https://github.com/knitjs/knit/tree/master/modules/node_modules/%40knit/depcheck)
