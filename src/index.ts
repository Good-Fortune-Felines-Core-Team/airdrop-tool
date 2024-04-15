#! /usr/bin/env node
import { program } from 'commander';
import { homedir } from 'node:os';
import { join } from 'node:path';
import process from 'node:process';

// actions
import action from './action';
import { ICommandOptions } from '@app/types';

program
  .description(
    'An airdrop tool for NEP-141 tokens that is designed to shoot a number of tokens to an NFT allowlist (or any list), with the ability to shoot multiple allocations to specific addresses.'
  )
  .version(
    require('../package.json').version,
    '-v, --version',
    'output the current version'
  )
  .requiredOption(
    '--accountId <account>',
    'the account ID that will authorize the tokens to airdrop'
  )
  .requiredOption(
    '--accounts <path>',
    'the path to the JSON file that contains a list of accounts and token amounts'
  )
  .requiredOption(
    '--amount <number>',
    'the amount of tokens (in atomic units, i.e. if the token has 6 decimals, and you want to send 1 token, you should use 1000000) to airdrop'
  )
  .option(
    '--credentials <path>',
    'the path to the directory that contains the credentials for the account specified in "accountId"',
    join(homedir(), '.near-credentials')
  )
  .option('--network <network>', 'the target network', 'mainnet')
  .option(
    '-o, --output',
    'the directory to output the completed transfers',
    join(homedir(), '.jumpdex')
  )
  .option('--verbose', 'logs extra information', false)
  .requiredOption('--token <token>', 'the address of the token to airdrop')
  .action(async (options: ICommandOptions) =>
    process.exit(await action(options))
  )
  .parse();
