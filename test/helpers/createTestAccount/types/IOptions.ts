import { Account, Near, utils } from 'near-api-js';

interface IOptions {
  connection: Near;
  creatorAccount: Account;
  initialBalanceInAtomicUnits?: string;
  newAccountID: string;
  newAccountPublicKey: utils.PublicKey;
}

export default IOptions;
