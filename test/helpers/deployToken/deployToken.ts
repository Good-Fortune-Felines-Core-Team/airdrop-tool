import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { cwd } from 'node:process';

// types
import type { ITokenMetadata } from '@app/types';
import type { IOptions } from './types';

// utils
import tokenMetadata from '../tokenMetadata';

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

  try {
    return await tokenMetadata({
      tokenAccountID: tokenAccount.accountId,
      viewAccount: creatorAccount,
    });
  } catch (error) {
    // no token found, deploy a new one
  }

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

  return tokenMetadata({
    tokenAccountID: tokenAccount.accountId,
    viewAccount: creatorAccount,
  });
}
