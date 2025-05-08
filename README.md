<h1 align="center">
  Airdrop Tool
</h1>

<p align="center">
  <a href="https://github.com/Good-Fortune-Felines-Core-Team/airdrop-tool/releases/latest">
    <img alt="GitHub Release" src="https://img.shields.io/github/v/release/Good-Fortune-Felines-Core-Team/airdrop-tool?&logo=github">
  </a>
  <a href="https://github.com/Good-Fortune-Felines-Core-Team/airdrop-tool/releases/latest">
    <img alt="GitHub Release Date - Published At" src="https://img.shields.io/github/release-date/Good-Fortune-Felines-Core-Team/airdrop-tool?logo=github">
  </a>
</p>

<p align="center">
  <a href="https://github.com/Good-Fortune-Felines-Core-Team/airdrop-tool/releases">
    <img alt="GitHub Pre-release" src="https://img.shields.io/github/v/release/Good-Fortune-Felines-Core-Team/airdrop-tool?include_prereleases&label=pre-release&logo=github">
  </a>
  <a href="https://github.com/Good-Fortune-Felines-Core-Team/airdrop-tool/releases">
    <img alt="GitHub Pre-release Date - Published At" src="https://img.shields.io/github/release-date-pre/Good-Fortune-Felines-Core-Team/airdrop-tool?label=pre-release date&logo=github">
  </a>
</p>

<p align="center">
  <a href="https://github.com/Good-Fortune-Felines-Core-Team/airdrop-tool/blob/main/LICENSE">
    <img alt="GitHub License" src="https://img.shields.io/github/license/Good-Fortune-Felines-Core-Team/airdrop-tool">
  </a>
</p>

<p align="center">
  <a href="https://npmjs.com/package/@jumpdefi/airdrop-tool" target="_blank">
    <img src="https://img.shields.io/npm/v/@jumpdefi/airdrop-tool" alt="npm" />
  </a>
</p>

<p align="center">
  An airdrop tool for NEP-141 tokens that is designed to shoot a number of tokens to an NFT allowlist (or any list), with the ability to shoot multiple allocations to specific addresses. Supports both uniform distribution with multipliers and specific amounts for each recipient.
</p>

### Table of contents

* [1. Installation](#-1-installation)
* [2. Documentation](#-2-documentation)
* [3. CLI Usage](#-3-cli-usage)
    * [3.1. Basic Usage](#31-basic-usage)
    * [3.2. Distribution Modes](#32-distribution-modes)
    * [3.3. Dry Run Mode](#33-dry-run-mode)
    * [3.4. JSON File Format](#34-json-file-format)
* [4. Development](#-4-development)
    * [4.1. Requirements](#41-requirements)
    * [4.2. Setup](#42-setup)
    * [4.3. Running In Development Mode](#43-running-in-development-mode)
* [5. Testing](#-5-testing)
    * [5.1. Requirements](#51-requirements)
    * [5.2. Running Tests](#52-running-tests)
* [6. Appendix](#-6-appendix)
    * [6.1. Useful Commands](#61-useful-commands)
* [7. How To Contribute](#-7-how-to-contribute)
* [8. License](#-8-license)

## 📦 1. Installation

* Using npm:
```shell
npm install @jumpdefi/airdrop-tool
```

* Using yarn:
```shell
yarn add @jumpdefi/airdrop-tool
```

## 📚 2. Documentation

For full documentation, please see [here][documentation].

<sup>[Back to top ^][table-of-contents]</sup>

## 🖥️ 3. CLI Usage

### 3.1. Basic Usage

The airdrop tool provides a command-line interface for distributing NEP-141 tokens to multiple accounts. Here's the basic usage:

```bash
$ airdrop-tool --accountId <sender-account> --token <token-contract-address> --accounts <path-to-json-file> [options]
```

Required arguments:
- `--accountId`: The account ID that will authorize the tokens to airdrop
- `--token`: The address of the token to airdrop
- `--accounts`: The path to the JSON file that contains a list of accounts and token amounts

Optional arguments:
- `--credentials`: The path to the directory that contains the credentials for the account (default: ~/.near-credentials)
- `--network`: The target network (default: mainnet)
- `--verbose`: Logs extra information (default: false)

### 3.2. Distribution Modes

The tool supports two distribution modes:

#### Multiplier Mode (Default)

In this mode, you specify a base amount and each recipient receives a multiple of that amount.

```bash
$ airdrop-tool --accountId <sender-account> --token <token-contract-address> --accounts <path-to-json-file> --amount <base-amount>
```

- `--amount`: The base amount of tokens (in standard units) to airdrop
- The JSON file contains account IDs as keys and multipliers as values

#### Manual Mode

In this mode, you specify the exact amount for each recipient directly in the JSON file.

```bash
$ airdrop-tool --accountId <sender-account> --token <token-contract-address> --accounts <path-to-json-file> --manual
```

- `--manual`: Enables manual mode where JSON values are standard (human-readable) token amounts
- The JSON file contains account IDs as keys and specific token amounts in standard units as values
- The tool automatically converts standard amounts to atomic units based on the token's decimals
- `--amount` should NOT be used with `--manual`

### 3.3. Dry Run Mode

The tool provides a dry run mode that simulates the airdrop without actually transferring tokens:

```bash
$ airdrop-tool --accountId <sender-account> --token <token-contract-address> --accounts <path-to-json-file> --dry-run [--amount <base-amount> | --manual]
```

- `--dry-run`: Simulates the airdrop without executing transfers
- Works with both multiplier and manual modes
- Outputs detailed information about what would happen during an actual airdrop

### 3.4. JSON File Format

The JSON file format depends on the distribution mode:

#### Multiplier Mode Format

```json
{
  "account1.near": "1",
  "account2.near": "0.5",
  "account3.near": "2"
}
```

In this example:
- `account1.near` would receive 1 × `--amount` tokens
- `account2.near` would receive 0.5 × `--amount` tokens
- `account3.near` would receive 2 × `--amount` tokens

#### Manual Mode Format

```json
{
  "account1.near": "1",
  "account2.near": "0.5",
  "account3.near": "2"
}
```

In this example:
- `account1.near` would receive exactly 1 token in standard units
- `account2.near` would receive exactly 0.5 tokens in standard units
- `account3.near` would receive exactly 2 tokens in standard units

The tool automatically converts these standard amounts to the appropriate atomic units based on the token's decimals.

<sup>[Back to top ^][table-of-contents]</sup>

## 🛠 4. Development

### 4.1. Requirements

* Install [Node v20.9.0+][node]

<sup>[Back to top ^][table-of-contents]</sup>

### 4.2. Setup

Install the dependencies:
```bash
$ npm install
```

<sup>[Back to top ^][table-of-contents]</sup>

### 4.3. Running In Development Mode

* To run the CLI in development mode, simply run the npm script:
```bash
$ npm start -- --help
```

> ⚠️ **NOTE:** In order to not conflict with npm's arguments, you must use the `--` between `start` and CLI flags.

<sup>[Back to top ^][table-of-contents]</sup>

## 🧪 5. Testing

### 5.1. Requirements

* Install [Docker][docker]
* Install [Docker Compose v2.5.0+][docker-compose]

<sup>[Back to top ^][table-of-contents]</sup>

### 5.2. Running Tests

The test script begins by building and starting a local Near network using the credentials in [`.near`](./.near). Once this has started, the tests are run against this local validator node.

> ⚠️ **NOTE:** As the local network contains one validator node, all blocks are handled by this validator.

Within this local network, account IDs will fave the suffix of `.test.near`, i.e. `myaccount.test.near`.

The main account (`.test.near`), whose credentials are stored at [`./test/credentials`](./test/credentials), can be used as a faucet or to deploy contracts.

<sup>[Back to top ^][table-of-contents]</sup>

## 📑 6. Appendix

### 6.1. Useful Commands

| Command              | Description                                                                        |
|----------------------|------------------------------------------------------------------------------------|
| `npm run build`      | Builds the source code into the `dist/` directory.                                 |
| `npm run docs:build` | Builds the documentation into the `.docusaurus/` directory.                        |
| `npm run docs:serve` | Serves the built documentation from the `.docusaurus/` directory.                  |
| `npm run docs:start` | Builds and runs the documentation in a development environment with hot reloading. |
| `npm run lint`       | Runs the linter on `.js` and `.ts` files.                                          |
| `npm run prettier`   | Runs the prettier on `.js` and `.ts` files.                                        |
| `npm start`          | Runs the CLI in development mode.                                                  |
| `npm test`           | Spins up a local Near node and runs tests against it.                              |

<sup>[Back to top ^][table-of-contents]</sup>

## 👏 7. How To Contribute

Please read the [**Contributing Guide**][contribute] to learn about the development process.

<sup>[Back to top ^][table-of-contents]</sup>

## 📄 8. License

Please refer to the [LICENSE][license] file.

<sup>[Back to top ^][table-of-contents]</sup>

<!-- Links -->
[contribute]: ./CONTRIBUTING.md
[docker]: https://docs.docker.com/get-docker/
[docker-compose]: https://docs.docker.com/compose/install/
[documentation]: https://good-fortune-felines-core-team.github.io/airdrop-tool
[git-large-file-storage]: https://git-lfs.com/
[license]: ./LICENSE
[node]: https://nodejs.org/en/
[table-of-contents]: #table-of-contents
