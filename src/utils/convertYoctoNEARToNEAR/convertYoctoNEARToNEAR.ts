import BigNumber from 'bignumber.js';
import { utils } from 'near-api-js';

/**
 * Convenience function that converts a yoctoNEAR amount (atomic unit) to the NEAR amount (standard unit).
 * @param {BigNumber} atomicAmount - the yoctoNEAR amount to convert.
 * @returns {BigNumber} the NEAR amount.
 */
export default function convertYoctoNEARToNEAR(atomicAmount: string): string {
  BigNumber.config({
    ROUNDING_MODE: 0,
  });

  return new BigNumber(atomicAmount)
    .dividedBy(new BigNumber(10).pow(utils.format.NEAR_NOMINATION_EXP))
    .toFixed();
}
