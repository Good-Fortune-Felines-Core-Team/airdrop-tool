import type { Account } from 'near-api-js';
import type { PublicKey } from 'near-api-js/lib/utils';

// types
import type { IAccessKeyResponse } from '@app/types';

/**
 * Convenience function to get an account's access key details.
 * @param {Account} account - the account.
 * @param {PublicKey} publicKey - the public key of the account.
 * @returns {Promise<IAccessKeyResponse>} a promise that resolves to the account's access key.
 */
export default async function accountAccessKey(
  account: Account,
  publicKey: PublicKey
): Promise<IAccessKeyResponse> {
  return await account.connection.provider.query<IAccessKeyResponse>(
    `access_key/${account.accountId}/${publicKey.toString()}`,
    ''
  );
}
