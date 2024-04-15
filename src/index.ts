#! /usr/bin/env node
import BN from 'bn.js';
import { program } from 'commander';
import { Account, Contract, Near } from 'near-api-js';
import { PublicKey } from 'near-api-js/lib/utils';
import { existsSync } from 'node:fs';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { homedir } from 'node:os';
import { extname, join, parse, ParsedPath } from 'node:path';
import process from 'node:process';

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
import transferToAccount from '@app/utils/transferToAccount';

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
  .option('--network <network>', 'the target network', 'mainnet')
  .option(
    '-o, --output',
    'the directory to output the completed transfers',
    join(homedir(), '.jumpdex')
  )
  .option('--verbose', 'logs extra information', false)
  .requiredOption('--token <token>', 'the address of the token to airdrop')
  .action(
    async ({
      accountId,
      accounts: transfersFilePath,
      amount,
      network,
      credentials,
      output,
      token,
      verbose,
    }: ICommandOptions) => {
      const date: Date = new Date();
      const logger: ILogger = createLogger(verbose ? 'debug' : 'error');
      let completedTransfers: Record<string, string>;
      let configuration: IConfiguration;
      let contract: ITokenContract;
      let failedTransfers: Record<string, string>;
      let nearConnection: Near;
      let nonce: number;
      let signer: Account;
      let signerAccessKey: IAccessKeyResponse;
      let signerPublicKey: PublicKey | null;
      let transfers: Record<string, string>;
      let transfersParsedPath: ParsedPath;

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

      // check if the credentials directory exists
      if (!existsSync(credentials)) {
        logger.error(
          `credentials directory at "${credentials}" does not exist`
        );

        return process.exit(1);
      }

      // check if the list of accounts exists
      if (!existsSync(transfersFilePath)) {
        logger.error(`accounts file at "${transfersFilePath}" does not exist`);

        return process.exit(1);
      }

      // throw an error if it is not a json file
      if (extname(transfersFilePath) !== '.json') {
        logger.error(
          `expected the accounts file "${transfersFilePath}" to be a json file`
        );

        return process.exit(1);
      }

      // if the output directory doesn't exist, create it
      if (!existsSync(output)) {
        logger.debug(`"${output}" directory does not exist, creating it`);

        try {
          await mkdir(output);
        } catch (error) {
          logger.error(error);

          return process.exit(1);
        }
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
        transfers = JSON.parse(await readFile(transfersFilePath, 'utf8'));
      } catch (error) {
        logger.error(
          `failed to parse the accounts file "${transfersFilePath}":`,
          error
        );

        return process.exit(1);
      }

      completedTransfers = {};
      failedTransfers = {};
      nonce = ++signerAccessKey.nonce;

      logger.info(
        `starting transfers for ${Object.entries(transfers).length} accounts`
      );

      for (let index = 0; index < Object.entries(transfers).length; index++) {
        const [receiverAccountId, receiverHoldAmount] =
          Object.entries(transfers)[index];
        const holdAmount = new BN(receiverHoldAmount);
        const transferAmount = holdAmount.mul(new BN(amount));
        let transactionID: string | null;

        logger.info(
          `transferring "${transferAmount.toString()}" to account "${receiverAccountId}"`
        );

        transactionID = await transferToAccount({
          amount: transferAmount,
          blockHash: signerAccessKey.block_hash,
          contract,
          logger,
          nearConnection,
          nonce,
          receiverAccountId,
          signerPublicKey,
          signerAccount: signer,
        });

        // if we have no transaction id, the transfer has failed
        if (!transactionID) {
          logger.debug(
            `transfer of "${transferAmount.toString()}" to account "${receiverAccountId}" failed`
          );

          failedTransfers[receiverAccountId] = holdAmount.toString();

          continue;
        }

        completedTransfers[receiverAccountId] = holdAmount.toString();
        nonce++;

        logger.info(
          `transfer of "${transferAmount.toString()}" to account "${receiverAccountId}" successful:`,
          transactionID
        );
      }

      transfersParsedPath = parse(transfersFilePath);

      // write the completed transfers to an output file
      if (Object.entries(completedTransfers).length > 0) {
        logger.debug(
          `writing completed transfers to "${join(output, `${date.getTime()}-${transfersParsedPath.name}-completed.json`)}"`
        );

        await writeFile(
          join(
            output,
            `${date.getTime()}-${transfersParsedPath.name}-completed.json`
          ),
          JSON.stringify(completedTransfers)
        );
      }

      // write the failed transfers to an output file
      if (Object.entries(failedTransfers).length > 0) {
        logger.debug(
          `writing failed transfers to "${join(output, `${date.getTime()}-${transfersParsedPath.name}-failed.json`)}"`
        );

        await writeFile(
          join(
            output,
            `${date.getTime()}-${transfersParsedPath.name}-failed.json`
          ),
          JSON.stringify(failedTransfers)
        );
      }

      logger.info(
        `${Object.entries(completedTransfers).length} transfers successful`
      );
      logger.info(`${Object.entries(failedTransfers).length} transfers failed`);

      return process.exit(0);
    }
  )
  .parse();
