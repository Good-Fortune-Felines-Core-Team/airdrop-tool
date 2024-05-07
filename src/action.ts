import BN from 'bn.js';
import { Account, Contract, Near } from 'near-api-js';
import type { AccountBalance } from 'near-api-js/lib/account';
import type { PublicKey } from 'near-api-js/lib/utils';
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { extname } from 'node:path';

// configs
import { localnet, mainnet, testnet } from '@app/configs';

// constants
import {
  GAS_FEE_IN_ATOMIC_UNITS,
  STORAGE_FEE_IN_ATOMIC_UNITS,
} from '@app/constants';

// enums
import { ExitCodeEnum } from '@app/enums';

// types
import type {
  IAccessKeyResponse,
  IActionOptions,
  IActionResponse,
  IConfiguration,
  ITokenContract,
} from '@app/types';

// utils
import accountAccessKey from '@app/utils/accountAccessKey';
import convertYoctoNEARToNEAR from '@app/utils/convertYoctoNEARToNEAR';
import createNearConnection from '@app/utils/createNearConnection';
import transferToAccount from '@app/utils/transferToAccount';
import validateAccountID from '@app/utils/validateAccountID';

export default async function action({
  accountId,
  amount,
  credentials,
  logger,
  maxRetries,
  network,
  token,
  transfersFilePath,
}: IActionOptions): Promise<IActionResponse> {
  const completedTransfers: Record<string, string> = {};
  const failedTransfers: Record<string, string> = {};
  let accountBalance: AccountBalance;
  let configuration: IConfiguration;
  let contract: ITokenContract;
  let nearConnection: Near;
  let signer: Account;
  let signerAccessKey: IAccessKeyResponse;
  let signerPublicKey: PublicKey | null;
  let totalFeesInAtomicUnits: BN;
  let transactionID: string | null;
  let transfers: Record<string, string>;

  switch (network) {
    case 'localnet':
      configuration = localnet;
      break;
    case 'testnet':
      configuration = testnet;
      break;
    case 'mainnet':
    default:
      configuration = mainnet;
      break;
  }

  // check if the sender account id is valid
  if (!validateAccountID(accountId)) {
    logger.error(`account "${accountId}" is not a valid account id`);

    return {
      completedTransfers,
      exitCode: ExitCodeEnum.InvalidAccountID,
      failedTransfers,
    };
  }

  // check if the credentials directory exists
  if (!existsSync(credentials)) {
    logger.error(`credentials directory at "${credentials}" does not exist`);

    return {
      completedTransfers,
      exitCode: ExitCodeEnum.DirectoryReadError,
      failedTransfers,
    };
  }

  // check if the list of accounts exists
  if (!existsSync(transfersFilePath)) {
    logger.error(`accounts file at "${transfersFilePath}" does not exist`);

    return {
      completedTransfers,
      exitCode: ExitCodeEnum.FileReadError,
      failedTransfers,
    };
  }

  // throw an error if it is not a json file
  if (extname(transfersFilePath) !== '.json') {
    logger.error(
      `expected the accounts file "${transfersFilePath}" to be a json file`
    );
    return {
      completedTransfers,
      exitCode: ExitCodeEnum.FileReadError,
      failedTransfers,
    };
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
    logger.error(`account "${accountId}" doesn't exist in "${credentials}"`);

    return {
      completedTransfers,
      exitCode: ExitCodeEnum.AccountNotKnown,
      failedTransfers,
    };
  }

  signerAccessKey = await accountAccessKey(signer, signerPublicKey);
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

    return {
      completedTransfers,
      exitCode: ExitCodeEnum.FileReadError,
      failedTransfers,
    };
  }

  accountBalance = await signer.getAccountBalance();
  totalFeesInAtomicUnits = new BN(GAS_FEE_IN_ATOMIC_UNITS)
    .add(new BN(STORAGE_FEE_IN_ATOMIC_UNITS))
    .mul(new BN(Object.entries(transfers).length));

  // if the signer does not have funds tio cover the fees, error
  if (totalFeesInAtomicUnits.gt(new BN(accountBalance.available))) {
    logger.error(
      `there are insufficient funds in account "${signer.accountId}" to cover the fees, you need at least "${convertYoctoNEARToNEAR(totalFeesInAtomicUnits.toString())}", you have "${convertYoctoNEARToNEAR(accountBalance.available)}" available`
    );

    return {
      completedTransfers,
      exitCode: ExitCodeEnum.InsufficientFundsError,
      failedTransfers,
    };
  }

  logger.info(
    `starting transfers for ${Object.entries(transfers).length} accounts`
  );

  for (let index = 0; index < Object.entries(transfers).length; index++) {
    const [receiverAccountId, receiverMultiplier] =
      Object.entries(transfers)[index];
    const multipler = new BN(receiverMultiplier);
    const transferAmount = multipler.mul(new BN(amount));

    // check if the receiver account id is valid
    if (!validateAccountID(receiverAccountId)) {
      logger.error(`account "${receiverAccountId}" invalid`);

      failedTransfers[receiverAccountId] = multipler.toString();

      continue;
    }

    logger.info(
      `transferring "${transferAmount.toString()}" to account "${receiverAccountId}"`
    );

    // get the signer's access key, as it has been used
    signerAccessKey = await accountAccessKey(signer, signerPublicKey);
    transactionID = await transferToAccount({
      amount: transferAmount,
      blockHash: signerAccessKey.block_hash,
      contract,
      logger,
      maxRetries,
      nearConnection,
      nonce: signerAccessKey.nonce + 1, // increment the nonce as it has been used
      receiverAccountId,
      signerPublicKey,
      signerAccount: signer,
    });

    // if we have no transaction id, the transfer has failed
    if (!transactionID) {
      logger.debug(
        `transfer of "${transferAmount.toString()}" to account "${receiverAccountId}" failed`
      );

      failedTransfers[receiverAccountId] = multipler.toString();

      continue;
    }

    completedTransfers[receiverAccountId] = multipler.toString();

    logger.info(
      `transfer of "${transferAmount.toString()}" to account "${receiverAccountId}" successful:`,
      transactionID
    );
  }

  logger.info(
    `${Object.entries(completedTransfers).length} transfers successful`
  );
  logger.info(`${Object.entries(failedTransfers).length} transfers failed`);

  return {
    completedTransfers,
    exitCode: ExitCodeEnum.Success,
    failedTransfers,
  };
}
