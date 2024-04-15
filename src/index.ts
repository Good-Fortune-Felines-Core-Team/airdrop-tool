#! /usr/bin/env node
import chalk from 'chalk';
import { program } from 'commander';
import { Account, Near } from 'near-api-js';
import { homedir } from 'node:os';
import { join } from 'node:path';

// configs
import { local, mainnet, testnet } from '@app/configs';

// types
import type { ICommandOptions, IConfiguration } from '@app/types';

// utils
import createNearConnection from '@app/utils/createNearConnection';
import * as console from 'console';

program
  .description(
    'An airdrop tool for NEP-141 tokens that is designed to shoot a number of tokens to an NFT allowlist (or any list), with the ability to shoot multiple allocations to specific addresses.'
  )
  .version(
    require('../package.json').version,
    '-v, --vers',
    'output the current version'
  )
  .requiredOption(
    '--accountId <account>',
    'the account ID that will authorize the tokens to airdrop'
  )
  .requiredOption('--amount <number>', 'the amount of token per NFT to airdrop')
  .option(
    '--credentials <path>',
    'the directory that contains the credentials for the account',
    join(homedir(), '.near-credentials')
  )
  .option('--network <network>', 'the network to target', 'mainnet')
  .requiredOption('--token <token>', 'the address of the token to airdrop')
  .action(async ({ accountId, network, credentials }: ICommandOptions) => {
    let account: Account;
    let configuration: IConfiguration;
    let nearConnection: Near;

    switch (network) {
      case 'local':
        configuration = local;
        break;
      case 'testnet':
        configuration = testnet;
        break;
      case 'mainnet':
      default:
        configuration = mainnet;
        break;
    }

    nearConnection = await createNearConnection({
      ...configuration,
      credentialsDir: credentials,
    });

    try {
      account = await nearConnection.account(accountId);

      console.log('account: ', account);
    } catch (error) {
      console.log(chalk.red(error));
    }
  })
  .parse();
