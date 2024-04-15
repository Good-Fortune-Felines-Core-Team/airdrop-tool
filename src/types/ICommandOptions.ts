// types
import TNetworkIDs from './TNetworkIDs';

interface ICommandOptions {
  accountId: string;
  amount: string;
  credentials: string;
  network: TNetworkIDs;
  token: string;
}

export default ICommandOptions;
