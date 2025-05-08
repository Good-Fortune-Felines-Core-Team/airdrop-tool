// types
import TNetworkIDs from './TNetworkIDs';

interface ICommandOptions {
  accountId: string;
  accounts: string;
  amount?: string;
  credentials: string;
  dryRun?: boolean;
  manual?: boolean;
  network: TNetworkIDs;
  output: string;
  token: string;
  verbose: boolean;
}

export default ICommandOptions;
