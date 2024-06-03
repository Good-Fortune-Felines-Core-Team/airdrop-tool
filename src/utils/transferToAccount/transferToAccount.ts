import { providers, transactions, utils } from 'near-api-js';
import { clearInterval, setInterval } from 'node:timers';

// constants
import {
  GAS_FEE_IN_ATOMIC_UNITS,
  MAX_RETRIES,
  RETRY_DELAY_IN_MILLISECONDS,
  STORAGE_FEE_IN_ATOMIC_UNITS,
} from '@app/constants';

// types
import type { IOptions, IResult } from './types';

/**
 * Convenience function that transfers the tokens to the account. This function will retry if the account transaction
 * fails and the failure is not a recoverable error, i.e. errors that are runtime errors or contract execution errors.
 * @param {IOptions} options - the sender & receiver accounts, the maximum retries for failed transactions, the amount,
 * and the nonce (the nonce MUST be greater than the sender's access key nonce).
 * @returns {Promise<IResult>} a promise that resolves to the transaction ID (if the transfer was ultimately
 * unsuccessful, including retries, this will be null) and the incremented nonce, including the success transaction and
 * all the retries.
 */
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
}: IOptions): Promise<IResult> {
  let _nonce = nonce;
  let retries = 0;

  return new Promise<IResult>((resolve) => {
    const timer = setInterval(async () => {
      const gasFee = BigInt(GAS_FEE_IN_ATOMIC_UNITS);
      let actions: transactions.Action[] = [];
      let transaction: transactions.Transaction;

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
              BigInt(STORAGE_FEE_IN_ATOMIC_UNITS!)
            )
          );
        }

        // add action for the transfer of the token
        actions.push(
          transactions.functionCall(
            'ft_transfer',
            {
              receiver_id: receiverAccountId,
              amount,
            },
            gasFee,
            BigInt('1')
          )
        );
        _nonce = _nonce + retries + 1; // increment the nonce as the access key may have been used
        transaction = transactions.createTransaction(
          signerAccount.accountId,
          signerPublicKey,
          contract.contractId,
          _nonce,
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

        const { status, transaction_outcome } =
          await signerAccount.connection.provider.sendTransaction(
            signedTransaction
          );
        const failure =
          (status as providers.FinalExecutionStatus)?.Failure || null;

        if (failure) {
          // for errors that are unrecoverable, do not retry
          if (
            failure.error_type === 'RuntimeError' ||
            failure.error_type === 'TxExecutionError'
          ) {
            logger.error(`${failure.error_type}: ${failure.error_message}`);

            return resolve({
              nonce: _nonce,
              transactionID: null,
            });
          }

          throw new Error(`${failure.error_type}: ${failure.error_message}`);
        }

        // clear the interval
        clearInterval(timer);

        return resolve({
          nonce: _nonce,
          transactionID: transaction_outcome.id,
        });
      } catch (error) {
        logger.error('failed to send transfer:', error);

        if (retries >= maxRetries) {
          logger.error(
            `maximum transfer retries reached, skipping transfer to account "${receiverAccountId}"`
          );

          // clear the interval
          clearInterval(timer);

          return resolve({
            nonce: _nonce,
            transactionID: null,
          });
        }

        logger.debug(
          `retrying transfer to "${receiverAccountId}" in ${RETRY_DELAY_IN_MILLISECONDS * 1000} seconds`
        );

        retries++;
      }
    }, RETRY_DELAY_IN_MILLISECONDS);
  });
}
