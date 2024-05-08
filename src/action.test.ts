import BigNumber from 'bignumber.js';
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
import createTestAccount from '@test/utils/createTestAccount';
import deployToken from '@test/utils/deployToken';

// types
import type { IActionResponse, IActionOptions, TNetworkIDs } from '@app/types';

// utils
import convertNEARToYoctoNEAR from '@app/utils/convertNEARToYoctoNEAR';
import createLogger from '@app/utils/createLogger';
import createNearConnection from '@app/utils/createNearConnection';

describe('when running the cli action', () => {
  const account1AccountID: string = 'account1.test.near';
  const account2AccountID: string = 'account2.test.near';
  const creatorAccountID: string = 'test.near';
  const networkID: TNetworkIDs = 'localnet';
  const tokenAccountID: string = 'token.test.near';
  let defaultOptions: IActionOptions;
  let creatorAccount: Account;
  let nearConnection: Near;
  let tokenAccount: Account;

  beforeAll(async () => {
    const totalSupplyInAtomicUnits: BigNumber = new BigNumber('10').pow(
      new BigNumber('34')
    ); // 10^34 == 10,000,000,000,000,000,000,000,000,000,000,000
    let tokenPublicKey: utils.PublicKey;

    defaultOptions = {
      amount: '1',
      accountId: creatorAccountID,
      credentials: resolve(cwd(), 'test', 'credentials'),
      logger: createLogger('error'),
      maxRetries: 0,
      network: networkID,
      token: tokenAccountID,
      transfersFilePath: resolve(cwd(), 'test', 'data', 'success.json'),
    };
    nearConnection = await createNearConnection({
      ...localnet,
      credentialsDir: defaultOptions.credentials,
    });
    creatorAccount = await nearConnection.account(defaultOptions.accountId);
    tokenPublicKey = await nearConnection.connection.signer.getPublicKey(
      tokenAccountID,
      networkID
    );
    // create the token account
    tokenAccount = await createTestAccount({
      creatorAccount,
      initialBalanceInAtomicUnits: convertNEARToYoctoNEAR('10'),
      newAccountID: tokenAccountID,
      newAccountPublicKey: tokenPublicKey,
      nearConnection,
    });

    // deploy contract
    await deployToken({
      creatorAccount,
      name: 'Awesome Token',
      symbol: 'AWST',
      tokenAccount,
      totalSupply: totalSupplyInAtomicUnits.toFixed(), // 10B in yoctoNEAR
    });
    // create known accounts
    await createTestAccount({
      creatorAccount,
      newAccountID: account1AccountID,
      newAccountPublicKey: await nearConnection.connection.signer.getPublicKey(
        account1AccountID,
        networkID
      ),
      nearConnection,
    });
    await createTestAccount({
      creatorAccount,
      newAccountID: account2AccountID,
      newAccountPublicKey: await nearConnection.connection.signer.getPublicKey(
        account2AccountID,
        networkID
      ),
      nearConnection,
    });
  });

  it('should fail if the supplied account id is invalid', async () => {
    // arrange
    // act
    const response: IActionResponse = await action({
      ...defaultOptions,
      accountId: '$$%^^)(.near',
    });

    // assert
    expect(response.exitCode).toBe(ExitCodeEnum.InvalidAccountID);
  });

  it('should fail if no credentials exist at the specified path', async () => {
    // arrange
    // act
    const response: IActionResponse = await action({
      ...defaultOptions,
      credentials: resolve(cwd(), 'test', 'unknown-dir'),
    });

    // assert
    expect(response.exitCode).toBe(ExitCodeEnum.DirectoryReadError);
  });

  it('should fail if no accounts file does not exist', async () => {
    // arrange
    // act
    const response: IActionResponse = await action({
      ...defaultOptions,
      transfersFilePath: resolve(cwd(), 'test', 'data', 'unknown.json'),
    });

    // assert
    expect(response.exitCode).toBe(ExitCodeEnum.FileReadError);
  });

  it('should fail if the accounts file is not a json', async () => {
    // arrange
    // act
    const response: IActionResponse = await action({
      ...defaultOptions,
      transfersFilePath: resolve(cwd(), 'test', 'data', 'invalid.txt'),
    });

    // assert
    expect(response.exitCode).toBe(ExitCodeEnum.FileReadError);
  });

  it('should fail if the sender account does not exist in the credentials', async () => {
    // arrange
    // act
    const response: IActionResponse = await action({
      ...defaultOptions,
      accountId: 'unknown',
    });

    // assert
    expect(response.exitCode).toBe(ExitCodeEnum.AccountNotKnown);
  });

  it('should fail if the accounts JSON file is malformed', async () => {
    // arrange
    // act
    const response: IActionResponse = await action({
      ...defaultOptions,
      transfersFilePath: resolve(cwd(), 'test', 'data', 'malformed.json'),
    });

    // assert
    expect(response.exitCode).toBe(ExitCodeEnum.FileReadError);
  });

  it('should fail if there is not enough funds in the account', async () => {
    // arrange
    // act
    const response: IActionResponse = await action({
      ...defaultOptions,
      accountId: account1AccountID,
    });

    // assert
    expect(response.exitCode).toBe(ExitCodeEnum.InsufficientFundsError);
  });

  it('should record failed transfers', async () => {
    // arrange
    // act
    const response: IActionResponse = await action({
      ...defaultOptions,
      transfersFilePath: resolve(cwd(), 'test', 'data', 'failure.json'),
    });

    // assert
    expect(response.exitCode).toBe(ExitCodeEnum.Success);
    expect(
      Object.entries(response.completedTransfers).length
    ).toBeLessThanOrEqual(0);
    expect(Object.entries(response.failedTransfers).length).toBe(1); // ["'$$%^^)(.test.near"]
  });

  it('should record success transfers', async () => {
    // arrange
    // act
    const response: IActionResponse = await action(defaultOptions);

    // assert
    expect(response.exitCode).toBe(ExitCodeEnum.Success);
    expect(Object.entries(response.completedTransfers).length).toBe(10);
    expect(Object.entries(response.failedTransfers).length).toBeLessThanOrEqual(
      0
    );
  });

  it('should record both success and failed transfers', async () => {
    // arrange
    // act
    const response: IActionResponse = await action({
      ...defaultOptions,
      transfersFilePath: resolve(cwd(), 'test', 'data', 'mixed.json'),
    });

    // assert
    expect(response.exitCode).toBe(ExitCodeEnum.Success);
    expect(Object.entries(response.completedTransfers).length).toBe(1); // ["account1.test.near"]
    expect(Object.entries(response.failedTransfers).length).toBe(1); // ["'$$%^^)(.test.near"]
  });
});
