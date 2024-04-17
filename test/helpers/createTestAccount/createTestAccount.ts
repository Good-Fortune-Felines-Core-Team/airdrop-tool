import BN from 'bn.js';
import { Account } from 'near-api-js';

// types
import type { IOptions } from './types';

/**
 * Creates a test account with an optional initial balance.
 * @param {IOptions} options - the options needed to create the new account.
 * @returns {Promise<Account>} a promise that resolves to the new account.
 */
export default async function createTestAccount({
  creatorAccount,
  connection,
  initialBalanceInAtomicUnits = new BN('0'),
  newAccountID,
  newAccountPublicKey,
}: IOptions): Promise<Account> {
  let newAccount = await connection.account(newAccountID);

  try {
    // this will error if the account doesn't exist
    await newAccount.getAccountBalance();

    // if the new account exists, return it
    return newAccount;
  } catch (error) {}

  // create the new account
  await creatorAccount.createAccount(
    newAccountID,
    newAccountPublicKey,
    initialBalanceInAtomicUnits
  );

  return await connection.account(newAccountID);
}
