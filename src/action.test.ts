import BN from 'bn.js';
import { Account, Near, utils } from 'near-api-js';
import { resolve } from 'node:path';
import { cwd } from 'node:process';

// actions
import action from './action';

// configs
import { localnet } from '@app/configs';

// enums
import { ExitCodeEnum } from '@app/enums';

// helpers
import convertNearToYoctoNear from '@test/utils/convertNearToYoctoNear';
import createTestAccount from '@test/utils/createTestAccount';
import deployToken, { ITokenMetadata } from '@test/utils/deployToken';

// types
import { ICommandOptions, TNetworkIDs } from '@app/types';

// utils
import createNearConnection from '@app/utils/createNearConnection';

describe('when running the cli action', () => {
  const creatorAccountID: string = 'test.near';
  const networkID: TNetworkIDs = 'localnet';
  const tokenAccountID: string = 'token.test.near';
  let defaultOptions: ICommandOptions;
  let creatorAccount: Account;
  let tokenAccount: Account;
  let tokenMetadata: ITokenMetadata;

  beforeAll(async () => {
    const totalSupplyInAtomicUnits: BN = new BN('10').pow(new BN('34')); // 10^34 == 10,000,000,000,000,000,000,000,000,000,000,000
    let connection: Near;
    let tokenPublicKey: utils.PublicKey;

    defaultOptions = {
      amount: '1',
      accounts: resolve(cwd(), 'test', 'data', 'accounts.json'),
      accountId: creatorAccountID,
      credentials: resolve(cwd(), 'test', 'credentials'),
      network: networkID,
      output: resolve(cwd(), '.jumpdex'),
      token: '',
      verbose: false,
    };
    connection = await createNearConnection({
      ...localnet,
      credentialsDir: defaultOptions.credentials,
    });
    creatorAccount = await connection.account(defaultOptions.accountId);
    tokenPublicKey = await connection.connection.signer.getPublicKey(
      tokenAccountID,
      networkID
    );
    // create the token account
    tokenAccount = await createTestAccount({
      creatorAccount,
      connection,
      initialBalanceInAtomicUnits: convertNearToYoctoNear(new BN('10')),
      newAccountID: tokenAccountID,
      newAccountPublicKey: tokenPublicKey,
    });
    tokenMetadata = await deployToken({
      creatorAccount,
      name: 'Awesome Token',
      symbol: 'AWST',
      tokenAccount,
      totalSupply: totalSupplyInAtomicUnits.toString(), // 10B in yoctoNEAR
    });
  });

  it('should fail if no credentials exist at the specified path', async () => {
    // arrange
    // act
    const exitCode: ExitCodeEnum = await action({
      ...defaultOptions,
      credentials: resolve(cwd(), 'test', 'unknown-dir'),
    });

    // assert
    expect(exitCode).toBe(ExitCodeEnum.DirectoryReadError);
  });

  it('should fail if no accounts file does not exist', async () => {
    // arrange
    // act
    const exitCode: ExitCodeEnum = await action({
      ...defaultOptions,
      accounts: resolve(cwd(), 'test', 'data', 'unknown.json'),
    });

    // assert
    expect(exitCode).toBe(ExitCodeEnum.FileReadError);
  });

  it('should fail if the accounts file is not a json', async () => {
    // arrange
    // act
    const exitCode: ExitCodeEnum = await action({
      ...defaultOptions,
      accounts: resolve(cwd(), 'test', 'data', 'accounts.txt'),
    });

    // assert
    expect(exitCode).toBe(ExitCodeEnum.FileReadError);
  });

  it('should fail if the account does not exist', async () => {
    // arrange
    // act
    const exitCode: ExitCodeEnum = await action({
      ...defaultOptions,
      accountId: 'unknown',
    });

    // assert
    expect(exitCode).toBe(ExitCodeEnum.InvalidAccountID);
  });

  it('should fail if the accounts JSON file is malformed', async () => {
    // arrange
    // act
    const exitCode: ExitCodeEnum = await action({
      ...defaultOptions,
      accounts: resolve(cwd(), 'test', 'data', 'malformed.json'),
    });

    // assert
    expect(exitCode).toBe(ExitCodeEnum.FileReadError);
  });
});
