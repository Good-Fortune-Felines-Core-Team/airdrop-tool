import BN from "bn.js";
import { Account, Near, transactions, utils } from "near-api-js";
import { Action, Transaction } from 'near-api-js/lib/transaction';
import { PublicKey } from "near-api-js/lib/utils";
import { clearInterval, setInterval } from "node:timers";

import type { TokenContract } from '@app/types';
import { GAS_FEE_IN_ATOMIC_UNITS, MAX_RETRIES, RETRY_DELAY_IN_MILLISECONDS, STORAGE_FEE_IN_STANDARD_UNITS } from '@app/constants';

interface Options {
  blockHash: string;
  contract: TokenContract;
  holdAmount: BN;
  nearConnection: Near;
  nekoAmount: BN;
  nonce: number;
  signerAccount: Account;
  signerPublicKey: PublicKey;
}

export default async function transferToAccount(receiverAccountId: string, {
  blockHash,
  contract,
  holdAmount,
  nearConnection,
  nekoAmount,
  nonce,
  signerAccount,
  signerPublicKey,
}: Options): Promise<boolean> {
  let retries = 0;

  return new Promise<boolean>((resolve) => {
    const timer = setInterval(async () => {
      const transferAmount = holdAmount.mul(nekoAmount);
      let actions: Action[] = [];
      let transaction: Transaction;

      try {
        console.log("Checking storage balance");

        // add an action to register storage
        if (!(await contract.storage_balance_of({ account_id: receiverAccountId }))) {
          console.log(`Registering Storage for account ${receiverAccountId}`);

          actions.push(
            transactions.functionCall(
              "storage_deposit",
              {
                account_id: receiverAccountId,
                registration_only: true,
              },
              new BN(GAS_FEE_IN_ATOMIC_UNITS),
              new BN(utils.format.parseNearAmount(STORAGE_FEE_IN_STANDARD_UNITS)!),
            )
          );
        }

        // add action to transfer token
        actions.push(
          transactions.functionCall(
            "ft_transfer",
            {
              receiver_id: receiverAccountId,
              amount: transferAmount.toString(),
            },
            new BN(GAS_FEE_IN_ATOMIC_UNITS),
            new BN("1")
          )
        );

        transaction = transactions.createTransaction(
          signerAccount.accountId,
          signerPublicKey,
          contract.contractId,
          nonce,
          actions,
          utils.serialize.base_decode(blockHash) as Uint8Array,
        );
        const [_, signedTransaction] = await transactions.signTransaction(
          transaction,
          signerAccount.connection.signer,
          signerAccount.accountId,
          nearConnection.connection.networkId,
        );

        console.log(`Transferring to account ${receiverAccountId}`);

        const { transaction_outcome } = await signerAccount.connection.provider.sendTransaction(signedTransaction);

        console.log(`Successfully transferred to ${receiverAccountId}: `, transaction_outcome.id);

        // clear the interval
        clearInterval(timer);

        return resolve(true);
      } catch (error) {
        console.error("Failed to send transfer :", error);

        if (retries >= MAX_RETRIES) {
          console.error(`Maximum transfer retries reached, skipping transfer to account ${receiverAccountId}`);

          return resolve(false);
        }

        console.log(`Retrying transfer to ${receiverAccountId} in ${RETRY_DELAY_IN_MILLISECONDS * 1000} seconds`);

        retries++;
      }
    }, RETRY_DELAY_IN_MILLISECONDS);
  });
}
