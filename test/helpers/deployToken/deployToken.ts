import { providers } from 'near-api-js';
import { ExecutionError } from 'near-api-js/lib/providers/provider';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { cwd } from 'node:process';

// types
import type { IOptions, ITokenMetadata } from './types';

/**
 * Deploys the token factory contract to the token account and initializes the token.
 * @param {IOptions} options - the options needed to deploy and initialize the token at the account.
 * @returns {Promise<ITokenMetadata>} a promise that resolves to the token's metadata.
 */
export default async function deployToken({
  creatorAccount,
  decimals = 24,
  name,
  symbol,
  tokenAccount,
  totalSupply,
}: IOptions): Promise<ITokenMetadata> {
  const contract = await readFile(
    resolve(cwd(), 'test', 'contracts', 'fungible_token_factory.wasm')
  );
  let encodedMetadataSuccessResult: string | null;
  let metadataErrorResult: ExecutionError | null;
  let decodedMetadataResult: Buffer;
  let metadataOutcome: providers.FinalExecutionOutcome;

  // deploy the account
  await tokenAccount.deployContract(contract);

  // initialize the contract
  await creatorAccount.functionCall({
    contractId: tokenAccount.accountId,
    methodName: 'new',
    args: {
      owner_id: creatorAccount.accountId,
      total_supply: totalSupply,
      metadata: {
        decimals,
        name,
        spec: 'ft-1.0.0',
        symbol,
      },
    },
  });

  // view the metadata
  metadataOutcome = await creatorAccount.functionCall({
    contractId: tokenAccount.accountId,
    methodName: 'ft_metadata',
    args: {},
  });
  metadataErrorResult =
    (metadataOutcome.status as providers.FinalExecutionStatus).Failure || null;
  encodedMetadataSuccessResult =
    (metadataOutcome.status as providers.FinalExecutionStatus).SuccessValue ||
    null;

  // if we don't have a success, we have an error
  if (!encodedMetadataSuccessResult) {
    throw new Error(
      metadataErrorResult?.error_message ||
        `failed to get metadata for token "${tokenAccount.accountId}"`
    );
  }

  // decode the result from base64
  decodedMetadataResult = Buffer.from(encodedMetadataSuccessResult, 'base64');

  // encode in ut8 and then parse to a json
  return JSON.parse(decodedMetadataResult.toString('utf8'));
}
