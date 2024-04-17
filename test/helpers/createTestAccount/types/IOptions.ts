import BN from 'bn.js';
import { Account, Near, utils } from 'near-api-js';

interface IOptions {
  creatorAccount: Account;
  connection: Near;
  initialBalanceInAtomicUnits?: BN;
  newAccountID: string;
  newAccountPublicKey: utils.PublicKey;
}

export default IOptions;
