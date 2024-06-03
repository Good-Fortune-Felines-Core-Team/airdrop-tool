import BigNumber from 'bignumber.js';
import { Account, Contract, Near, utils } from 'near-api-js';
import type { AccountBalance } from 'near-api-js/lib/account';
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
import transferToAccount, {
  type IResult as ITransferAccountResult,
} from '@app/utils/transferToAccount';
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
  let nonce: number;
  let signer: Account;
  let signerAccessKey: IAccessKeyResponse;
  let signerPublicKey: utils.PublicKey | null;
  let accountTokenBalance: BigNumber;
  let totalFeesInAtomicUnits: BigNumber;
  let totalTokensInAtomicUnits: BigNumber;
  let transferAccountResult: ITransferAccountResult;
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
  contract = new Contract(signer.connection, token, {
    useLocalViewExecution: false,
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
  totalFeesInAtomicUnits = new BigNumber(GAS_FEE_IN_ATOMIC_UNITS)
    .plus(new BigNumber(STORAGE_FEE_IN_ATOMIC_UNITS))
    .multipliedBy(new BigNumber(Object.entries(transfers).length));

  // if the signer does not have funds to cover the fees, error
  if (totalFeesInAtomicUnits.gt(new BigNumber(accountBalance.available))) {
    logger.error(
      `there are insufficient funds in the account "${signer.accountId}" to cover the fees, the account needs at least "${convertYoctoNEARToNEAR(totalFeesInAtomicUnits.toFixed())}", the account only has "${convertYoctoNEARToNEAR(accountBalance.available)}" available`
    );

    return {
      completedTransfers,
      exitCode: ExitCodeEnum.InsufficientFundsError,
      failedTransfers,
    };
  }

  accountTokenBalance = new BigNumber(
    await contract.ft_balance_of({ account_id: accountId })
  );
  totalTokensInAtomicUnits = Object.values(transfers).reduce<BigNumber>(
    (acc, currentValue) =>
      acc.plus(new BigNumber(currentValue).multipliedBy(new BigNumber(amount))),
    new BigNumber('0')
  );

  // if the signer does not have enough tokens, error
  if (totalTokensInAtomicUnits.gt(accountTokenBalance)) {
    logger.error(
      `there are insufficient tokens in the account "${signer.accountId}" to cover the total amount of "${convertYoctoNEARToNEAR(totalTokensInAtomicUnits.toFixed())}" required, the account only has "${convertYoctoNEARToNEAR(accountTokenBalance.toFixed())}" available`
    );

    return {
      completedTransfers,
      exitCode: ExitCodeEnum.InsufficientTokensError,
      failedTransfers,
    };
  }

  logger.info(
    `starting transfers for ${Object.entries(transfers).length} accounts`
  );

  // get the signer's access key
  signerAccessKey = await accountAccessKey(signer, signerPublicKey);

  // increase the nonce +1 of the signer's access key nonce
  nonce = signerAccessKey.nonce + 1;

  for (let index = 0; index < Object.entries(transfers).length; index++) {
    const [receiverAccountId, receiverMultiplier] =
      Object.entries(transfers)[index];
    const multipler = new BigNumber(receiverMultiplier);
    const transferAmount = multipler.multipliedBy(new BigNumber(amount));

    // check if the receiver account id is valid
    if (!validateAccountID(receiverAccountId)) {
      logger.error(`account "${receiverAccountId}" invalid`);

      failedTransfers[receiverAccountId] = multipler.toFixed();

      continue;
    }

    logger.info(
      `transferring "${transferAmount.toFixed()}" to account "${receiverAccountId}"`
    );

    transferAccountResult = await transferToAccount({
      amount: transferAmount.toFixed(),
      blockHash: signerAccessKey.block_hash,
      contract,
      logger,
      maxRetries,
      nearConnection,
      nonce,
      receiverAccountId,
      signerPublicKey,
      signerAccount: signer,
    });
    nonce = transferAccountResult.nonce; // update the nonce with the once from the transfer, this will include the retried transactions

    // if we have no transaction id, the transfer has failed
    if (!transferAccountResult.transactionID) {
      logger.debug(
        `transfer of "${transferAmount.toFixed()}" to account "${receiverAccountId}" failed`
      );

      failedTransfers[receiverAccountId] = multipler.toFixed();

      continue;
    }

    completedTransfers[receiverAccountId] = multipler.toFixed();

    logger.info(
      `transfer of "${transferAmount.toFixed()}" to account "${receiverAccountId}" successful:`,
      transferAccountResult.transactionID
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
