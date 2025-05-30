import type { AccessKeyView, NodeStatusResult } from '@near-js/types';
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
  IActionOptions,
  IActionResponse,
  IConfiguration,
  ITokenContract,
} from '@app/types';

// utils
import accountAccessKeyView from '@app/utils/accountAccessKeyView';
import convertAtomicToStandard from '@app/utils/convertAtomicToStandard';
import convertStandardToAtomic from '@app/utils/convertStandardToAtomic';
import convertYoctoNEARToNEAR from '@app/utils/convertYoctoNEARToNEAR';
import createNearConnection from '@app/utils/createNearConnection';
import tokenMetadata from '@app/utils/tokenMetadata';
import transferToAccount, {
  type IResult as ITransferAccountResult,
} from '@app/utils/transferToAccount';
import validateAccountID from '@app/utils/validateAccountID';
import console from 'console';

export default async function action({
  accountId,
  amount,
  credentials,
  dryRun = false,
  logger,
  manual = false,
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
  let nodeStatus: NodeStatusResult;
  let nonce: number;
  let signer: Account;
  let signerAccessKeyView: AccessKeyView | null;
  let signerPublicKey: utils.PublicKey | null;
  let accountTokenBalance: BigNumber;
  let totalFeesInAtomicUnits: BigNumber;
  let totalTokensInAtomicUnits: BigNumber;
  let transferAccountResult: ITransferAccountResult;
  let transfers: Record<string, string>;
  let tokenDecimals: number;

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
  nodeStatus = await nearConnection.connection.provider.status();
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

  contract = new Contract(signer.connection, token, {
    useLocalViewExecution: false,
    viewMethods: ['ft_balance_of', 'storage_balance_of', 'ft_metadata'],
    changeMethods: ['ft_transfer', 'storage_deposit'],
  }) as ITokenContract;

  // Get token metadata to determine decimals
  try {
    const metadata = await tokenMetadata({
      tokenAccountID: token,
      viewAccount: signer,
    });
    tokenDecimals = metadata.decimals;
    logger.info(`Token decimals: ${tokenDecimals}`);
  } catch (error) {
    logger.error(`Failed to get token metadata: ${error}`);

    return {
      completedTransfers,
      exitCode: ExitCodeEnum.InvalidArguments,
      failedTransfers,
    };
  }

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

  // Calculate total tokens based on mode (manual or multiplier)
  if (manual) {
    // In manual mode, the values in the JSON are standard units that need to be converted to atomic units
    totalTokensInAtomicUnits = Object.values(transfers).reduce<BigNumber>(
      (acc, currentValue) => {
        // Convert from standard units to atomic units
        const atomicValue = convertStandardToAtomic(
          currentValue,
          tokenDecimals
        );
        return acc.plus(new BigNumber(atomicValue));
      },
      new BigNumber('0')
    );
    logger.info(
      'Using manual mode: JSON values are standard token amounts (will be converted to atomic units)'
    );
  } else {
    // In multiplier mode, the values in the JSON are multipliers for the global amount
    if (!amount) {
      logger.error('Amount is required when not in manual mode');
      return {
        completedTransfers,
        exitCode: ExitCodeEnum.InvalidArguments,
        failedTransfers,
      };
    }

    // Convert the amount from standard units to atomic units
    const atomicAmount = convertStandardToAtomic(amount, tokenDecimals);
    logger.info(`Converting amount ${amount} to atomic units: ${atomicAmount}`);

    totalTokensInAtomicUnits = Object.values(transfers).reduce<BigNumber>(
      (acc, currentValue) =>
        acc.plus(
          new BigNumber(currentValue).multipliedBy(new BigNumber(atomicAmount))
        ),
      new BigNumber('0')
    );
    logger.info(
      `Using multiplier mode: JSON values are multipliers for amount ${amount} (${atomicAmount} atomic units)`
    );
  }

  // if the signer does not have enough tokens, error
  if (totalTokensInAtomicUnits.gt(accountTokenBalance)) {
    logger.error(
      `there are insufficient tokens in the account "${signer.accountId}" to cover the total amount of "${convertAtomicToStandard(totalTokensInAtomicUnits.toFixed(), tokenDecimals)}" required, the account only has "${convertAtomicToStandard(accountTokenBalance.toFixed(), tokenDecimals)}" available`
    );

    return {
      completedTransfers,
      exitCode: ExitCodeEnum.InsufficientTokensError,
      failedTransfers,
    };
  }

  if (dryRun) {
    logger.info('DRY RUN MODE: No tokens will be transferred');
    logger.info(
      `Would transfer a total of ${convertAtomicToStandard(totalTokensInAtomicUnits.toFixed(), tokenDecimals)} tokens to ${Object.entries(transfers).length} accounts`
    );
    logger.info(
      `Estimated fees: ${convertYoctoNEARToNEAR(totalFeesInAtomicUnits.toFixed())} NEAR`
    );

    // Log the details of each transfer
    logger.info('Transfer details:');
    for (const [receiverAccountId, value] of Object.entries(transfers)) {
      if (!validateAccountID(receiverAccountId)) {
        logger.info(`WOULD SKIP: Invalid account "${receiverAccountId}"`);
        continue;
      }

      let transferAmount: BigNumber;
      if (manual) {
        // Convert from standard units to atomic units
        const atomicValue = convertStandardToAtomic(value, tokenDecimals);
        transferAmount = new BigNumber(atomicValue);
        logger.info(
          `WOULD TRANSFER: ${value} tokens to ${receiverAccountId} (standard amount)`
        );
      } else {
        // amount is already converted to atomic units above
        const atomicAmount = convertStandardToAtomic(amount!, tokenDecimals);
        transferAmount = new BigNumber(value).multipliedBy(
          new BigNumber(atomicAmount)
        );
        const standardAmount = convertAtomicToStandard(
          transferAmount.toFixed(),
          tokenDecimals
        );
        logger.info(
          `WOULD TRANSFER: ${standardAmount} tokens to ${receiverAccountId} (multiplier: ${value})`
        );
      }
    }

    return {
      completedTransfers: {},
      exitCode: ExitCodeEnum.Success,
      failedTransfers: {},
    };
  }

  logger.info(
    `starting transfers for ${Object.entries(transfers).length} accounts`
  );

  // get the signer's access key
  signerAccessKeyView = await accountAccessKeyView(signer, signerPublicKey);

  if (!signerAccessKeyView) {
    logger.error(
      `access key for "${accountId}" doesn't exist in "${credentials}"`
    );

    return {
      completedTransfers,
      exitCode: ExitCodeEnum.AccountNotKnown,
      failedTransfers,
    };
  }

  // increase the nonce +1 of the signer's access key nonce
  nonce = new BigNumber(String(signerAccessKeyView.nonce)).plus(1).toNumber();

  console.log(`fetched nonce ${String(signerAccessKeyView.nonce)}`);

  for (let index = 0; index < Object.entries(transfers).length; index++) {
    const [receiverAccountId, receiverValue] = Object.entries(transfers)[index];

    let transferAmount: BigNumber;

    // Calculate transfer amount based on mode
    if (manual) {
      // In manual mode, the value is in standard units and needs to be converted to atomic units
      const atomicValue = convertStandardToAtomic(receiverValue, tokenDecimals);
      transferAmount = new BigNumber(atomicValue);
    } else {
      // In multiplier mode, the value is a multiplier for the global amount
      // We've already validated that amount exists in the manual check above
      const atomicAmount = convertStandardToAtomic(amount!, tokenDecimals);
      transferAmount = new BigNumber(receiverValue).multipliedBy(
        new BigNumber(atomicAmount)
      );
    }

    // check if the receiver account id is valid
    if (!validateAccountID(receiverAccountId)) {
      logger.error(`account "${receiverAccountId}" invalid`);

      failedTransfers[receiverAccountId] = receiverValue;

      continue;
    }

    logger.info(
      `transferring "${convertAtomicToStandard(transferAmount.toFixed(), tokenDecimals)}" tokens to account "${receiverAccountId}"`
    );

    console.log(`using initial nonce for "${receiverAccountId}" ${nonce}`);
    transferAccountResult = await transferToAccount({
      amount: transferAmount.toFixed(),
      blockHash: nodeStatus.sync_info.latest_block_hash,
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
    console.log(`returned nonce for "${receiverAccountId}" ${nonce}`);

    // if we have no transaction id, the transfer has failed
    if (!transferAccountResult.transactionID) {
      logger.debug(
        `transfer of "${convertAtomicToStandard(transferAmount.toFixed(), tokenDecimals)}" tokens to account "${receiverAccountId}" failed`
      );

      failedTransfers[receiverAccountId] = receiverValue;

      continue;
    }

    completedTransfers[receiverAccountId] = receiverValue;

    logger.info(
      `transfer of "${convertAtomicToStandard(transferAmount.toFixed(), tokenDecimals)}" tokens to account "${receiverAccountId}" successful:`,
      transferAccountResult.transactionID
    );
  }

  console.log(`final nonce ${nonce}`);

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
