/* eslint-disable @typescript-eslint/no-explicit-any */
import chalk from 'chalk';

// types
import type { ILogger, TLogLevel } from './types';

/**
 * Creates a logger that can set whether the logs appear based on the level
 * @param {TLogLevel} level - the base level of logging
 * @returns {ILogger} a logger that can be used to create logs based on the level
 */
export default function createLogger(level: TLogLevel = 'error'): ILogger {
  const canLog: (allowedLevel: TLogLevel) => boolean = (
    allowedLevel
  ): boolean => {
    switch (level) {
      case 'error':
        return allowedLevel === 'error';
      case 'warn':
        return allowedLevel === 'error' || allowedLevel === 'warn';
      case 'info':
        return (
          allowedLevel === 'error' ||
          allowedLevel === 'warn' ||
          allowedLevel === 'info'
        );
      case 'debug':
        return true;
      default:
        return false;
    }
  };

  return {
    debug: (message?: any, ...optionalParams: any[]) =>
      canLog('debug') &&
      console.log(`${chalk.green('[DEBUG]')} ${message}`, ...optionalParams),
    error: (message?: any, ...optionalParams: any[]) =>
      canLog('error') &&
      console.log(`${chalk.red('[ERROR]')} ${message}`, ...optionalParams),
    info: (message?: any, ...optionalParams: any[]) =>
      canLog('info') &&
      console.log(`${chalk.white('[INFO]')} ${message}`, ...optionalParams),
    warn: (message?: any, ...optionalParams: any[]) =>
      canLog('warn') &&
      console.log(`${chalk.yellow('[WARN]')} ${message}`, ...optionalParams),
  };
}
