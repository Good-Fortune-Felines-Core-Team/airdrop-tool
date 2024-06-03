import { Account, Near } from 'near-api-js';
import { PublicKey } from 'near-api-js/lib/utils';

// types
import type { IBaseOptions, ITokenContract } from '@app/types';

interface IOptions extends IBaseOptions {
  amount: string;
  blockHash: string;
  contract: ITokenContract;
  maxRetries?: number;
  nearConnection: Near;
  nonce: number;
  receiverAccountId: string;
  signerAccount: Account;
  signerPublicKey: PublicKey;
}

export default IOptions;
