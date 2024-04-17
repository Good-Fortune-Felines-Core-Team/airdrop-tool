import { utils } from 'near-api-js';
import BN from 'bn.js';

/**
 * Convenience function that converts the Near amount (standard unit) to the yoctoNear amount (atomic unit).
 * @param {BN} standardAmount - the Near amount to convert.
 * @returns {BN} the yoctoNear amount.
 */
export default function convertNearToYoctoNear(standardAmount: BN): BN {
  return standardAmount.mul(
    new BN('10').pow(new BN(utils.format.NEAR_NOMINATION_EXP))
  );
}
