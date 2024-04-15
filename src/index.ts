#! /usr/bin/env node
import { program } from 'commander';
import { Account, Contract, Near } from 'near-api-js';
import { PublicKey } from 'near-api-js/lib/utils';
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { homedir } from 'node:os';
import { extname, join } from 'node:path';

// configs
import { local, mainnet, testnet } from '@app/configs';

// types
import type {
  IAccessKeyResponse,
  ICommandOptions,
  IConfiguration,
  ITokenContract,
} from '@app/types';

// utils
import createLogger, { ILogger } from '@app/utils/createLogger';
import createNearConnection from '@app/utils/createNearConnection';
import process from 'node:process';

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
  .requiredOption('--amount <number>', 'the amount of token per NFT to airdrop')
  .option(
    '--credentials <path>',
    'the path to the directory that contains the credentials for the account specified in "accountId"',
    join(homedir(), '.near-credentials')
  )
  .option('--network <network>', 'the network to target', 'mainnet')
  .requiredOption('--token <token>', 'the address of the token to airdrop')
  .action(
    async ({
      accountId,
      accounts: accountsFile,
      network,
      credentials,
      token,
    }: ICommandOptions) => {
      const logger: ILogger = createLogger();
      let accounts: Record<string, string>;
      let configuration: IConfiguration;
      let contract: ITokenContract;
      let nearConnection: Near;
      let signer: Account;
      let signerAccessKey: IAccessKeyResponse;
      let signerPublicKey: PublicKey | null;

      // check if the credentials directory exists
      if (!existsSync(credentials)) {
        logger.error(
          `credentials directory at "${credentials}" does not exist`
        );

        return process.exit(1);
      }

      // check if the list of accounts exists
      if (!existsSync(accountsFile)) {
        logger.error(`accounts file at "${accountsFile}" does not exist`);

        return process.exit(1);
      }

      if (extname(accountsFile) !== '.json') {
        logger.error(
          `expected the accounts file "${accountsFile}" to be a json file`
        );

        return process.exit(1);
      }

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
      signer = await nearConnection.account(accountId);
      signerPublicKey = await signer.connection.signer.getPublicKey(
        accountId,
        configuration.networkId
      );

      // if no public key can be found, the account is invalid
      if (!signerPublicKey) {
        logger.error(`invalid account "${accountId}"`);

        return process.exit(1);
      }

      signerAccessKey =
        await signer.connection.provider.query<IAccessKeyResponse>(
          `access_key/${signer.accountId}/${signerPublicKey.toString()}`,
          ''
        );
      contract = new Contract(signer, token, {
        viewMethods: ['ft_balance_of', 'storage_balance_of'],
        changeMethods: ['ft_transfer', 'storage_deposit'],
      }) as ITokenContract;

      // attempt to get the contents of the accounts file
      try {
        accounts = JSON.parse(await readFile(accountsFile, 'utf8'));
      } catch (error) {
        logger.error(`failed to parse the accounts file "${accountsFile}"`);

        return process.exit(1);
      }

      return process.exit(0);
    }
  )
  .parse();
