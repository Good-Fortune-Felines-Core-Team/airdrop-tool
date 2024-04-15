import { resolve } from 'node:path';
import { cwd } from 'node:process';

// actions
import action from './action';

// enums
import { ExitCodeEnum } from '@app/enums';

// types
import { ICommandOptions } from '@app/types';

describe('when running the cli action', () => {
  const defaultOptions: ICommandOptions = {
    amount: '1',
    accounts: resolve(cwd(), 'test', 'data', 'accounts.json'),
    accountId: 'jumpdex.near',
    credentials: resolve(cwd(), 'test', 'credentials'),
    network: 'local',
    output: resolve(cwd(), '.jumpdex'),
    token: '',
    verbose: false,
  };

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
