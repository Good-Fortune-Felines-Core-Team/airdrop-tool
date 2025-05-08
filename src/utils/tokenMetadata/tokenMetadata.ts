import { providers } from 'near-api-js';
import { ExecutionError } from 'near-api-js/lib/providers/provider';

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
  const metadataOutcome: providers.FinalExecutionOutcome =
    await viewAccount.functionCall({
      contractId: tokenAccountID,
      methodName: 'ft_metadata',
      args: {},
    });
  let encodedMetadataSuccessResult: string | null;
  let metadataErrorResult: ExecutionError | null;
  let decodedMetadataResult: Buffer;

  metadataErrorResult =
    (metadataOutcome.status as providers.FinalExecutionStatus).Failure || null;
  encodedMetadataSuccessResult =
    (metadataOutcome.status as providers.FinalExecutionStatus).SuccessValue ||
    null;

  // if we don't have a success, we have an error
  if (!encodedMetadataSuccessResult) {
    throw new Error(
      metadataErrorResult?.error_message ||
        `failed to get metadata for token "${tokenAccountID}"`
    );
  }

  // decode the result from base64
  decodedMetadataResult = Buffer.from(encodedMetadataSuccessResult, 'base64');

  // encode in ut8 and then parse to a json
  return JSON.parse(decodedMetadataResult.toString('utf8'));
}
