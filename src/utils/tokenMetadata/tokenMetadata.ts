// types
import type { ITokenMetadata } from '@app/types';
import type { IOptions } from './types';

/**
 * Convenience function that gets the token metadata.
 * @param {IOptions} options - the token account ID and the account used to make the view calls to the token contract.
 * @returns {Promise<ITokenMetadata>} a promise that resolves to the token's metadata.
 * @throws {Error} if the contract doesn't exist.
 */
export default async function tokenMetadata({
  tokenAccountID,
  viewAccount,
}: IOptions): Promise<ITokenMetadata> {
  try {
    const metadata = await viewAccount.viewFunction({
      contractId: tokenAccountID,
      methodName: 'ft_metadata',
      args: {},
    });

    return metadata as ITokenMetadata;
  } catch (error) {
    throw new Error(
      (error as Error).message ||
        `failed to get metadata for token "${tokenAccountID}"`
    );
  }
}
