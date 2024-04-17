import { Account } from 'near-api-js';

interface IOptions {
  creatorAccount: Account;
  decimals?: number;
  name: string;
  symbol: string;
  tokenAccount: Account;
  totalSupply: string;
}

export default IOptions;
