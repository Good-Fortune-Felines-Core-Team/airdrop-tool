#! /usr/bin/env node
import { program } from 'commander';
import { existsSync } from 'node:fs';
import { mkdir, writeFile } from 'node:fs/promises';
import { homedir } from 'node:os';
import { join, parse, ParsedPath } from 'node:path';
import process from 'node:process';

// actions
import action from './action';

// enums
import { ExitCodeEnum } from '@app/enums';

// types
import type { ICommandOptions } from '@app/types';
import type { ILogger } from '@app/utils/createLogger';

// utils
import createLogger from '@app/utils/createLogger';

program
  .description(
    'An airdrop tool for NEP-141 tokens that is designed to shoot a number of tokens to an NFT allowlist (or any list), with the ability to shoot multiple allocations to specific addresses.'
  )
  .version(
    /* eslint-disable @typescript-eslint/no-var-requires */
    require('../package.json').version,
    /* eslint-disable @typescript-eslint/no-var-requires */
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
    join(homedir(), '.jumpdefi')
  )
  .option('--verbose', 'logs extra information', false)
  .requiredOption('--token <token>', 'the address of the token to airdrop')
  .action(
    async ({
      accountId,
      accounts,
      amount,
      credentials,
      network,
      output,
      token,
      verbose,
    }: ICommandOptions) => {
      const date: Date = new Date();
      const logger: ILogger = createLogger(verbose ? 'debug' : 'error');
      let transfersParsedPath: ParsedPath;

      // if the output directory doesn't exist, create it
      if (!existsSync(output)) {
        logger.debug(`"${output}" directory does not exist, creating it`);

        try {
          await mkdir(output);
        } catch (error) {
          logger.error(error);

          return process.exit(ExitCodeEnum.DirectoryWriteError);
        }
      }

      const { completedTransfers, exitCode, failedTransfers } = await action({
        accountId,
        amount,
        credentials,
        logger,
        network,
        token,
        transfersFilePath: accounts,
      });
      transfersParsedPath = parse(accounts);

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

      return process.exit(exitCode);
    }
  )
  .parse();
