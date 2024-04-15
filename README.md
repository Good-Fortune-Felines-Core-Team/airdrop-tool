<h1 align="center">
  Airdrop Tool
</h1>

<p align="center">
  <a href="https://github.com/Jump-Dex/airdrop-tool/releases/latest">
    <img alt="GitHub Release" src="https://img.shields.io/github/v/release/Jump-Dex/airdrop-tool?&logo=github">
  </a>
  <a href="https://github.com/Jump-Dex/airdrop-tool/releases/latest">
    <img alt="GitHub Release Date - Published At" src="https://img.shields.io/github/release-date/Jump-Dex/airdrop-tool?logo=github">
  </a>
</p>

<p align="center">
  <a href="https://github.com/Jump-Dex/airdrop-tool/releases">
    <img alt="GitHub Pre-release" src="https://img.shields.io/github/v/release/Jump-Dex/airdrop-tool?include_prereleases&label=pre-release&logo=github">
  </a>
  <a href="https://github.com/Jump-Dex/airdrop-tool/releases">
    <img alt="GitHub Pre-release Date - Published At" src="https://img.shields.io/github/release-date-pre/Jump-Dex/airdrop-tool?label=pre-release date&logo=github">
  </a>
</p>

<p align="center">
  <a href="https://github.com/Jump-Dex/airdrop-tool/blob/main/LICENSE">
    <img alt="GitHub License" src="https://img.shields.io/github/license/Jump-Dex/airdrop-tool">
  </a>
</p>

<p align="center">
  <a href="https://npmjs.com/package/@jumpdex/airdrop-tool" target="_blank">
    <img src="https://img.shields.io/npm/v/@jumpdex/airdrop-tool" alt="npm" />
  </a>
</p>

<p align="center">
  An airdrop tool for NEP-141 tokens that is designed to shoot a number of tokens to an NFT allowlist (or any list), with the ability to shoot multiple allocations to specific addresses.
</p>

### Table of contents

* [1. Installation](#-1-installation)
* [2. Documentation](#-2-documentation)
* [3. Development](#-3-development)
    * [3.1. Requirements](#31-requirements)
    * [3.2. Setup](#32-setup)
    * [3.3. Build](#33-build)
* [4. Appendix](#-4-appendix)
    * [4.1. Useful Commands](#41-useful-commands)
* [5. How To Contribute](#-5-how-to-contribute)
* [6. License](#-6-license)

## 📦 1. Installation

* Using npm:
```shell
npm install @jumpdex/airdrop-tool
```

* Using yarn:
```shell
yarn add @jumpdex/airdrop-tool
```

## 📚 2. Documentation

For full documentation, please see [here][documentation].

<sup>[Back to top ^][table-of-contents]</sup>

## 🛠 3. Development

### 3.1. Requirements

* Install [Node v20.9.0+][node]

<sup>[Back to top ^][table-of-contents]</sup>

### 3.2. Setup

1. Install the dependencies:
```bash
$ npm install
```

<sup>[Back to top ^][table-of-contents]</sup>

### 3.3. Build

* To build simply run:
```bash
$ npm build
```

This will compile the Typescript source code into a `dist/` directory.

<sup>[Back to top ^][table-of-contents]</sup>

## 📑 4. Appendix

### 4.1. Useful Commands

| Command              | Description                                                                        |
|----------------------|------------------------------------------------------------------------------------|
| `npm run build`      | Builds the source code into the `dist/` directory.                                 |
| `npm run docs:build` | Builds the documentation into the `.docusaurus/` directory.                        |
| `npm run docs:serve` | Serves the built documentation from the `.docusaurus/` directory.                  |
| `npm run docs:start` | Builds and runs the documentation in a development environment with hot reloading. |
| `npm run lint`       | Runs the linter on `.js` and `.ts` files.                                          |
| `npm run prettier`   | Runs the prettier on `.js` and `.ts` files.                                        |
| `npm run start`      | Runs the CLI in development mode.                                                  |
| `npm test`           | Runs the tests.                                                                    |

<sup>[Back to top ^][table-of-contents]</sup>

## 👏 5. How To Contribute

Please read the [**Contributing Guide**][contribute] to learn about the development process.

<sup>[Back to top ^][table-of-contents]</sup>

## 📄 6. License

Please refer to the [LICENSE][license] file.

<sup>[Back to top ^][table-of-contents]</sup>

<!-- Links -->
[contribute]: ./CONTRIBUTING.md
[documentation]: http://jump-dex.github.io/airdrop-tool
[license]: ./LICENSE
[node]: https://nodejs.org/en/
[table-of-contents]: #table-of-contents
