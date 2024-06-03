import type { AccessKeyView } from '@near-js/types';
import type { Account, utils } from 'near-api-js';

/**
 * Convenience function to get an account's access key details.
 * @param {Account} account - the account.
 * @param {utils.PublicKey} publicKey - the public key of the account.
 * @returns {Promise<AccessKeyView>} a promise that resolves to the account's access key view.
 */
export default async function accountAccessKeyView(
  account: Account,
  publicKey: utils.PublicKey
): Promise<AccessKeyView | null> {
  const accessKeys = await account.getAccessKeys();

  return (
    accessKeys.find((value) => value.public_key === publicKey.toString())
      ?.access_key || null
  );
}
