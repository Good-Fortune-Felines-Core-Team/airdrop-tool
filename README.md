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

| Command               | Description                                                                        |
|-----------------------|------------------------------------------------------------------------------------|
| `npm run build`       | Builds the source code into the `dist/` directory.                                 |
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







# airdrop-tool
Airdrop tool for nep-141 tokens designed to shoot a number of tokens to an NFT whitelist (or any list) with the ability to shoot multiple allocations to specific addresses.

1. Install Visual studio

- https://code.visualstudio.com/

2. Install Near CLI

- Run npm install -g near-cli

3. Make sure you are on mainnet

- Run the Export to mainnet command
- Windows: Run  set NEAR_NETWORK=mainnet
- Mac: Run export NEAR_ENV=mainnet

4. Log into the Near wallet you will wish to airdrop tokens from to store private key on computer (this allows you to run calls, make sure you understand security risks).

- Make sure you have the token you wish to send on this account.

- Run **near login**

- Run **near login --walletUrl https://app.mynearwallet.com/**

- Can login with meteor wallet if you prefer

- Run **near login --walletUrl https://wallet.meteorwallet.app/**

5. Download the zip from this github repository and unzip.

- Select the airdrop-tool-windows folder for windows or the airdrop-tool-mac folder for Mac then place it in a location you can easily navigate to.

6. To change token that the airdrop tool sends, navigate to:

- airdrop-tool>Src

- Open the index.ts file with vscode.

- Go to line 58 and input token address of the token you wish to send (it's set to JUMP token currently)

7. Create a new text file to compose the list the tool will airdrop tokens to and, place into data folder.

- Make sure the parsing of the list is named appropriately, and looks like this:

- {"test.near":1,"test2.near":1}

- The 1 denotes how many airdrops they get, if you put 2 and in the token amount later, it will send them 2 X TOKEN AMOUNT

- When you run the name of the list, it will move to the finished folder, send to all addresses and record errors in the error folder.

- List needs to be less than 500-1000 names. It could possibly error if transaction is too big.

8. Cd into airdrop-tool or airdrop-tool-mac folder we just unzipped (put in desktop for easy access)

- **cd desktop** (cd .. to go back)

- **cd airdrop-tool-mac** (or whatever the folder name is)

9. Once successfully navigated to folder, run the following code into terminal to download node modules, and start the script which deploys token and sets the meta data:

- Run **npm install**

- Then

- Run **npm run dev**

10. Follow the prompts, when you enter the token amount, MAKE SURE YOU USE PROPER DECIMAL AMOUNTS

- If JUMP token has 18 decimals, then 1 Jump is inputted as 1000000000000000000

- This rule applies for whatever token you are using as long as you use correct decimals for that token

NOTE: MAKE SURE TOKENS ARE ENTERED CORRECTLY.
