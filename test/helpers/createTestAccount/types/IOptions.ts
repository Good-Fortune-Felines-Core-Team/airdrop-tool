import BN from 'bn.js';
import { Account, Near, utils } from 'near-api-js';

interface IOptions {
  creatorAccount: Account;
  initialBalanceInAtomicUnits?: BN;
  nearConnection: Near;
  newAccountID: string;
  newAccountPublicKey: utils.PublicKey;
}

export default IOptions;
