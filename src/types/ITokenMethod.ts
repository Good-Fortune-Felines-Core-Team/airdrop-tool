interface ITokenMethod {
  ft_balance_of: (args: { account_id: string }) => Promise<string>;
  /* eslint-disable @typescript-eslint/no-explicit-any */
  storage_balance_of: (args: { account_id: string }) => Promise<any>;
  /* eslint-enable @typescript-eslint/no-explicit-any */
  ft_transfer: (args: {
    args: { receiver_id: string; amount: string };
    amount: string;
  }) => Promise<void>;
  storage_deposit: (args: {
    args: { account_id: string; registration_only: boolean };
    amount: string;
  }) => Promise<string>;
  ft_metadata: () => Promise<{
    decimals: number;
    icon: string | null;
    name: string;
    spec: string;
    symbol: string;
    reference: string | null;
    reference_hash: string | null;
  }>;
}

export default ITokenMethod;
