import { type Account, connect, keyStores, type Near } from 'near-api-js';
import { resolve } from 'node:path';
import { cwd } from 'node:process';

// actions
import action from './action';

// configs
import { localnet } from '@app/configs';

// credentials
import { account_id as notEnoughFundsAccountId } from '@test/credentials/localnet/notenoughfunds.test.near.json';
import { account_id as notEnoughTokensAccountId } from '@test/credentials/localnet/notenoughtokens.test.near.json';

// enums
import { ExitCodeEnum } from '@app/enums';

// helpers
import createTestAccount from '@test/helpers/createTestAccount';

// types
import type {
  IActionOptions,
  IActionResponse
} from '@app/types';

// utils
import convertNEARToYoctoNEAR from '@app/utils/convertNEARToYoctoNEAR';
import createLogger from '@app/utils/createLogger';

describe('when running the cli action', () => {
  const creatorAccountID = 'test.near';
  const credentials = resolve(cwd(), 'test', 'credentials');
  const tokenAccountID = 'token.test.near';
  let creatorAccount: Account;
  let defaultOptions: IActionOptions;
  let near: Near;

  beforeAll(async () => {

    near = await connect({
      networkId: localnet.networkId,
      nodeUrl: localnet.nodeUrl,
      keyStore: new keyStores.UnencryptedFileSystemKeyStore(credentials),
    });
    creatorAccount = await near.account(creatorAccountID);
    defaultOptions = {
      amount: '1',
      accountId: creatorAccountID,
      credentials,
      logger: createLogger('error'),
      maxRetries: 0,
      network: localnet.networkId,
      token: tokenAccountID,
      transfersFilePath: resolve(cwd(), 'test', 'data', 'success.json'),
    };

    // setup the test accounts
    await createTestAccount({
      connection: near,
      creatorAccount,
      initialBalanceInAtomicUnits: convertNEARToYoctoNEAR('0.01'), // Just enough to call token metadata, but not enough for transfers
      newAccountID: notEnoughFundsAccountId,
      newAccountPublicKey: await near.connection.signer.getPublicKey(
        notEnoughFundsAccountId,
        localnet.networkId
      ),
    });
    await createTestAccount({
      connection: near,
      creatorAccount,
      initialBalanceInAtomicUnits: convertNEARToYoctoNEAR('100'),
      newAccountID: notEnoughTokensAccountId,
      newAccountPublicKey: await near.connection.signer.getPublicKey(
        notEnoughTokensAccountId,
        localnet.networkId
      ),
    });
  });

  describe('when the configuration is incorrect', () => {
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
        accountId: notEnoughFundsAccountId,
      });

      // assert
      expect(response.exitCode).toBe(ExitCodeEnum.InsufficientFundsError);
    });

    it('should fail if there is not enough tokens in the account', async () => {
      // arrange
      // act
      const response: IActionResponse = await action({
        ...defaultOptions,
        accountId: notEnoughTokensAccountId,
      });

      // assert
      expect(response.exitCode).toBe(ExitCodeEnum.InsufficientTokensError);
    });

    it('should fail if token metadata cannot be retrieved', async () => {
      // arrange
      // Create a mock token contract without ft_metadata method
      const invalidTokenId = 'invalid-token.test.near';

      // act
      const response: IActionResponse = await action({
        ...defaultOptions,
        token: invalidTokenId,
      });

      // assert
      expect(response.exitCode).toBe(ExitCodeEnum.InvalidArguments);
    });
  });

  describe('when there are failed and successful transfers', () => {
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

  describe('when there are failed transfers', () => {
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
  });

  describe('when there are successful transfers', () => {
    it('should record success transfers', async () => {
      // arrange
      // act
      const response: IActionResponse = await action(defaultOptions);

      // assert
      expect(response.exitCode).toBe(ExitCodeEnum.Success);
      expect(Object.entries(response.completedTransfers).length).toBe(10);
      expect(
        Object.entries(response.failedTransfers).length
      ).toBeLessThanOrEqual(0);
    });
  });
});
