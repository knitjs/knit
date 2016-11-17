# Jest Config

Jest config used by KnitJS.

## Install

```
yarn add @knit/jest-config-socks
```

## Usage

```
const jestConfig = require('@knit/jest-config-socks');
const jest = require('jest');

const opts = ['--config', JSON.stringify(jestConfig())];
jest.run(opts);
```
