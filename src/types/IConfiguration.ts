// types
import TNetworkIDs from './TNetworkIDs';

interface IConfiguration {
  explorerUrl?: string;
  helperUrl?: string;
  networkId: TNetworkIDs;
  nodeUrl: string;
  walletUrl: string;
}

export default IConfiguration;
