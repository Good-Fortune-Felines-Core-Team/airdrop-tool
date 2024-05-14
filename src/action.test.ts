import { resolve } from 'node:path';
import { cwd } from 'node:process';

// actions
import action from './action';

// configs
import { localnet } from '@app/configs';

// enums
import { ExitCodeEnum } from '@app/enums';

// helpers
import createTestAccount from '@test/helpers/createTestAccount';

// types
import type { IActionResponse, IActionOptions } from '@app/types';

// utils
import createLogger from '@app/utils/createLogger';
import { Account, connect, keyStores, Near } from 'near-api-js';

describe('when running the cli action', () => {
  const creatorAccountID: string = 'test.near';
  const credentials = resolve(cwd(), 'test', 'credentials');
  const tokenAccountID: string = 'token.test.near';
  let creatorAccount: Account;
  let defaultOptions: IActionOptions = {
    amount: '1',
    accountId: creatorAccountID,
    credentials,
    logger: createLogger('error'),
    maxRetries: 0,
    network: localnet.networkId,
    token: tokenAccountID,
    transfersFilePath: resolve(cwd(), 'test', 'data', 'success.json'),
  };
  let near: Near;

  beforeAll(async () => {
    near = await connect({
      networkId: localnet.networkId,
      nodeUrl: localnet.nodeUrl,
      keyStore: new keyStores.UnencryptedFileSystemKeyStore(credentials),
    });
    creatorAccount = await near.account(creatorAccountID);
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
    const accountId = 'account1.test.near';
    const account = await createTestAccount({
      connection: near,
      creatorAccount,
      newAccountID: accountId,
      newAccountPublicKey: await near.connection.signer.getPublicKey(
        accountId,
        localnet.networkId
      ),
    });
    // act
    const response: IActionResponse = await action({
      ...defaultOptions,
      accountId: account.accountId,
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
