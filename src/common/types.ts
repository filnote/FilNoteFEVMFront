interface Note {
  id: bigint;
  targetAmount: bigint;
  creator: string;
  borrowingDays: number;
  interestRateBps: number;
  status: number;
}

export type { Note };
