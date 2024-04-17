interface ITokenMetadata {
  decimals: number;
  icon: string | null;
  name: string;
  spec: string;
  symbol: string;
  reference: string | null;
  reference_hash: string | null;
}

export default ITokenMetadata;
