# Knit

Knit is a set of tools to help simplify development and publishing of JS [multi-package repositories](https://github.com/babel/babel/blob/master/doc/design/monorepo.md). Its core tenets are that it is:

**fast**: uses Yarn package manager to install dependencies and only needs to install once rather than in each module.

**simple**: Uses built-in node package resolution so the developer doesn't have to think about the project being a "monorepo".

**compatible**: Using a single `package.json` for dependencies means Knit repos behave like any other repo and are compatible with external tools.

- [Features](#features)
- [Install Knit](#install-knit)
- [Usage](#usage)
- [CLI Commands](#cli-commands)
- [Node API](#node-api)
- [Prior Art](#prior-art)

## Features

- Reduced overhead when working with Monorepos
- Uses a single root level `package.json` for package management meaning Knit works with tools like [Yarn](https://yarnpkg.com/), [flow-typed](https://github.com/flowtype/flow-typed), [Greenkeeper](https://greenkeeper.io/).
- Meta data is stored in the root `package.json` rather than duplicated in each module.
- No bootstrap step needed to link modules
- Dependency versions are defined globally and so stay in sync across modules
- Auto discovery of missing and unused dependencies
- Simple [core](https://github.com/knitjs/knit/tree/master/modules/node_modules/%40knit/knit-core) library for building tools around
- Powerful (but optional) tools for developing and publishing apps or libraries
- Supports commonjs, es6 modules and umd as build targets

## Install Knit

Knit assumes you have the following programs installed before starting:

 - [git](https://git-scm.com/)
 - [yarn](https://yarnpkg.com/)

It is recommended that Knit be installed globally but it can also work as a local package using npm scripts.

```
yarn global add knit
```

## Usage

Starting by creating a new git repo for your project and initialize it using yarn:

```
❯ git init lets-start-knitting
❯ cd lets-start-knitting
❯ yarn init
```

Knit assumes the following folder structure

```
modules/
 └─ node_modules/ <-- your work goes under here
     └─ @myscope/
     |   └─ moduleA
     |       └─ index.js
     |       └─ package.json <-- just needs name and version
     └─ moduleB
         └─ index.js
         └─ package.json
node_modules/ <-- external dependencies stay in top level node_modules
package.json <-- dependencies listed here
```

Now you can list your modules and their dependencies:

```
❯ knit ls
✔ discovering modules
✔ reading package.json of modules

info showing dependencies for 2 modules

- @myscope/moduleA (0.0.0) [0 dependencies]
- moduleB (0.0.0) [0 dependencies]
```

To see how dependency resolution works require `@myscope/moduleA` from `moduleB`:

```
# moduleB
require('@myscope/moduleA')
```

now run `knit ls -d`:

```
❯ knit ls -d
✔ discovering modules
✔ reading package.json of modules

info showing dependencies for 2 modules

- @myscope/moduleA (0.0.0) [0 dependencies]

- moduleB (0.0.0) [1 dependencies]
└─ @myscope/moduleA
```

Knit scans your modules for required packages to build a list of dependencies for each module. This list can then be used to determine if you have missing or unused dependencies. Add a new dependency to `@myscope/moduleA` without adding it to your root `package.json`

```
# @myscope/moduleA
require('lodash')
```

Now when we run `knit ls -d` it will show the missing dependency:

```
❯ knit ls -d
✔ discovering modules
✔ reading package.json of modules

info showing dependencies for 2 modules

- @myscope/moduleA (0.0.0) [1 dependencies, 1 missing]
missing
└─ lodash

- moduleB (0.0.0) [1 dependencies]
└─ @myscope/moduleA
```

Now lets try running `knit validate` which will scan the project for issues and give you an early warning. Note that `validate` reforms many checks, learn more [here]().

```
❯ knit validate
  ...
  ✖ check for missing dependencies
  check for unused dependencies

error found 1 missing package
└─ lodash
```

We can fix thing by installing `lodash` with Yarn:

```
❯ yarn add lodash
...

❯ knit validate
  ...
  ✔ check for missing dependencies
  ✔ check for unused dependencies
```

Now that we have things working lets break them again. Go back into `@myscope/moduleA` and remove `require('lodash')` and then re-run `validate`:

```
❯ knit validate
  ...
  ✔ check for missing dependencies
  ✖ check for unused dependencies

error found 1 unused package
└─ lodash
```

Knit is comparing the comparing the dependencies found in your modules with the `dependencies` saved in your root `package.json` and can warn you if you have missing or unused packages!

## CLI

For a full list of commands see the cli documentation [here](https://github.com/knitjs/knit/tree/master/modules/node_modules/%40knit/knit)

## Node API

For a full list of methods see the Node API documentation [here](https://github.com/knitjs/knit/tree/master/modules/node_modules/%40knit/knit-core)

## Prior Art

Of course Knit wasn't created in a vacuum and is inspired by and make use of many amazing tools:

- [Yarn](https://yarnpkg.com/) - awesomely fast new package manager for node. monorepo build tool that could work with yarn was the reason this project was started.
- [Lerna](https://lernajs.io/) - inspiration for the idea that monorepos could be a thing
- [Alle](https://github.com/boennemann/alle) - amazing set of ideas that resonated with our experiences on how to make monorepo development better and easier.
- [Depchek](https://github.com/depcheck/depcheck) - at the heart of the dependency resolution. Great library and extremely easy to [extend](https://github.com/knitjs/knit/tree/master/modules/node_modules/%40knit/depcheck)
