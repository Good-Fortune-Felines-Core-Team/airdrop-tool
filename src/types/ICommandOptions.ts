// types
import TNetworkIDs from './TNetworkIDs';

interface ICommandOptions {
  accountId: string;
  accounts: string;
  amount: string;
  credentials: string;
  network: TNetworkIDs;
  output: string;
  token: string;
  verbose: boolean;
}

export default ICommandOptions;
