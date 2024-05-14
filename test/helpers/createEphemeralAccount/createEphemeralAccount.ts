import { connect, keyStores, utils, KeyPair, Near, Account } from 'near-api-js';
import { randomBytes } from 'node:crypto';

// configs
import { localnet } from '@app/configs';

// credentials
import {
  account_id as faucetAccountId,
  secret_key as faucetSecretKey,
} from '@test/credentials/localnet/test.near.json';

// types
import type { IResult } from './types';

/**
 * Creates an ephemeral account with a randomised account ID of 8 lower case hexadecimal characters.
 * @param {string} initialBalanceInAtomicUnits - [optional] the initial balance of the account in account units.
 * Defaults to zero.
 * @returns {Promise<IResult>} a promise that resolves to the account and the account's access key pair.
 */
export default async function createEphemeralAccount(
  initialBalanceInAtomicUnits?: string
): Promise<IResult> {
  const accountId: string = `${randomBytes(8).toString('hex').toLowerCase()}.test.near`;
  const faucetKeyPair = KeyPair.fromString(faucetSecretKey); // get the faucet key pair
  const keyPair = utils.KeyPairEd25519.fromRandom(); // create the new access key to be used
  const keyStore = new keyStores.InMemoryKeyStore();
  let faucetAccount: Account;
  let near: Near;

  // set the keys to the in-memory keystore
  await keyStore.setKey(localnet.networkId, faucetAccountId, faucetKeyPair);
  await keyStore.setKey(localnet.networkId, accountId, keyPair);

  near = await connect({
    networkId: localnet.networkId,
    nodeUrl: localnet.nodeUrl,
    keyStore,
  });
  faucetAccount = await near.account(faucetAccountId);

  // create the new account with the initial balance
  await faucetAccount.createAccount(
    accountId,
    keyPair.publicKey,
    initialBalanceInAtomicUnits
      ? BigInt(initialBalanceInAtomicUnits)
      : BigInt('0')
  );

  return {
    account: await near.account(accountId),
    keyPair,
  };
}
