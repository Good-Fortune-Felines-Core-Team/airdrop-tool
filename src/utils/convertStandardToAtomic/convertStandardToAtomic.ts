import BigNumber from 'bignumber.js';

/**
 * Converts an amount from standard units to atomic units based on the specified decimals.
 * @param {string} standardAmount - The amount in standard units.
 * @param {number} decimals - The number of decimal places for the token.
 * @returns {string} The amount in atomic units.
 */
export default function convertStandardToAtomic(
  standardAmount: string,
  decimals: number
): string {
  BigNumber.config({
    ROUNDING_MODE: 0,
  });

  return new BigNumber(standardAmount)
    .multipliedBy(new BigNumber(10).pow(decimals))
    .toFixed();
}
