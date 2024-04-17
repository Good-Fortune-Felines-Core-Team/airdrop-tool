// types
import type IBaseOptions from './IBaseOptions';
import type TNetworkIDs from './TNetworkIDs';

interface IActionOptions extends IBaseOptions {
  accountId: string;
  amount: string;
  credentials: string;
  maxRetries?: number;
  network: TNetworkIDs;
  token: string;
  transfersFilePath: string;
}

export default IActionOptions;
