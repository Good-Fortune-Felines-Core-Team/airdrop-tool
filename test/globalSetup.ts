import BigNumber from 'bignumber.js';
import { Account, connect, keyStores, utils } from 'near-api-js';
import { resolve } from 'node:path';
import { cwd } from 'node:process';

// configs
import { localnet } from '@app/configs';

// credentials
import { account_id as genesisAccountId } from './credentials/localnet/test.near.json';
import { account_id as tokenContractAccountId } from './credentials/localnet/token.test.near.json';

// helpers
import createTestAccount from './helpers/createTestAccount';
import deployToken from './helpers/deployToken';

// utils
import convertNEARToYoctoNEAR from '../src/utils/convertNEARToYoctoNEAR';

/**
 * Adds and funds the token contract account and deploys and initializes a FT token to the account.
 */
export default async function globalSetup() {
  const near = await connect({
    networkId: localnet.networkId,
    nodeUrl: localnet.nodeUrl,
    keyStore: new keyStores.UnencryptedFileSystemKeyStore(
      resolve(cwd(), 'test', 'credentials')
    ),
  });
  const totalSupplyInAtomicUnits: BigNumber = new BigNumber('10').pow(
    new BigNumber('34')
  ); // 10^34 == 10,000,000,000,000,000,000,000,000,000,000,000
  let genesisAccount: Account;
  let tokenAccountPublicKey: utils.PublicKey;
  let tokenAccount: Account;

  genesisAccount = await near.account(genesisAccountId);
  tokenAccountPublicKey = await near.connection.signer.getPublicKey(
    tokenContractAccountId,
    localnet.networkId
  );

  // create the contract account
  tokenAccount = await createTestAccount({
    creatorAccount: genesisAccount,
    initialBalanceInAtomicUnits: convertNEARToYoctoNEAR('10'),
    newAccountID: tokenContractAccountId,
    newAccountPublicKey: tokenAccountPublicKey,
    connection: near,
  });

  // deploy token contract
  await deployToken({
    creatorAccount: genesisAccount,
    name: 'Awesome Token',
    symbol: 'AWST',
    tokenAccount: tokenAccount,
    totalSupply: totalSupplyInAtomicUnits.toFixed(), // 10B in yoctoNEAR
  });
}
