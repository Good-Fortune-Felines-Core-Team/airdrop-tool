import BN from 'bn.js';
import { transactions, utils } from 'near-api-js';
import { Action, Transaction } from 'near-api-js/lib/transaction';
import { clearInterval, setInterval } from 'node:timers';

// constants
import {
  GAS_FEE_IN_ATOMIC_UNITS,
  MAX_RETRIES,
  RETRY_DELAY_IN_MILLISECONDS,
  STORAGE_FEE_IN_STANDARD_UNITS,
} from '@app/constants';

// types
import type { IOptions } from './types';

export default async function transferToAccount({
  amount,
  blockHash,
  contract,
  logger,
  nearConnection,
  nonce,
  receiverAccountId,
  maxRetries = MAX_RETRIES,
  signerAccount,
  signerPublicKey,
}: IOptions): Promise<string | null> {
  return new Promise<string | null>((resolve) => {
    const timer = setInterval(async () => {
      const gasFee = new BN(GAS_FEE_IN_ATOMIC_UNITS);
      let actions: Action[] = [];
      let retries = 0;
      let transaction: Transaction;

      try {
        logger.debug(`checking storage balance for "${receiverAccountId}"`);

        // if there is no storage add an action to register storage
        if (
          !(await contract.storage_balance_of({
            account_id: receiverAccountId,
          }))
        ) {
          logger.debug(
            `no storage found for account "${receiverAccountId}", add action to register new storage`
          );

          actions.push(
            transactions.functionCall(
              'storage_deposit',
              {
                account_id: receiverAccountId,
                registration_only: true,
              },
              gasFee,
              new BN(
                utils.format.parseNearAmount(STORAGE_FEE_IN_STANDARD_UNITS)!
              )
            )
          );
        }

        // add action for the transfer of the token
        actions.push(
          transactions.functionCall(
            'ft_transfer',
            {
              receiver_id: receiverAccountId,
              amount: amount.toString(),
            },
            gasFee,
            new BN('1')
          )
        );

        transaction = transactions.createTransaction(
          signerAccount.accountId,
          signerPublicKey,
          contract.contractId,
          nonce,
          actions,
          utils.serialize.base_decode(blockHash) as Uint8Array
        );
        /* eslint-disable @typescript-eslint/no-unused-vars */
        const [_, signedTransaction] = await transactions.signTransaction(
          transaction,
          signerAccount.connection.signer,
          signerAccount.accountId,
          nearConnection.connection.networkId
        );
        /* eslint-enable @typescript-eslint/no-unused-vars */

        const { transaction_outcome } =
          await signerAccount.connection.provider.sendTransaction(
            signedTransaction
          );

        // clear the interval
        clearInterval(timer);

        return resolve(transaction_outcome.id);
      } catch (error) {
        logger.error('failed to send transfer:', error);

        if (retries >= maxRetries) {
          logger.error(
            `maximum transfer retries reached, skipping transfer to account "${receiverAccountId}"`
          );

          // clear the interval
          clearInterval(timer);

          return resolve(null);
        }

        logger.debug(
          `retrying transfer to "${receiverAccountId}" in ${RETRY_DELAY_IN_MILLISECONDS * 1000} seconds`
        );

        retries++;
      }
    }, RETRY_DELAY_IN_MILLISECONDS);
  });
}
