import BigNumber from 'bignumber.js';

/**
 * Converts an amount from atomic units to standard units based on the specified decimals.
 * @param {string} atomicAmount - The amount in atomic units.
 * @param {number} decimals - The number of decimal places for the token.
 * @returns {string} The amount in standard units.
 */
export default function convertAtomicToStandard(atomicAmount: string, decimals: number): string {
  BigNumber.config({
    ROUNDING_MODE: 0,
  });

  return new BigNumber(atomicAmount)
    .dividedBy(new BigNumber(10).pow(decimals))
    .toFixed();
}
