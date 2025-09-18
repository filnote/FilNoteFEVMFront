export interface Note {
  id: bigint;
  targetAmount: bigint;
  creator: string;
  borrowingDays: number;
  interestRateBps: number;
  status: number;
}

export type ContractArg = string | number | bigint | boolean;

export interface WriteArgs {
  functionName: string;
  args: ContractArg[];
  value?: bigint;
  gasLimit?: bigint;
}

export interface WriteContractResult {
  hash: string;
}
