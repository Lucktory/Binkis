export type CodeStatus = "available" | "claimed";

export interface CodeRecord {
  code: string;
  generatedAt: string;
  claimed: boolean;
  claimedAt: string | null;
  winnerName: string | null;
  winnerEmail: string | null;
  winnerPhone: string | null;
  winnerAddress: string | null;
}

export interface CodeMetrics {
  totalGenerated: number;
  totalClaimed: number;
  totalAvailable: number;
  claimRate: number;
  latestGeneratedAt: string | null;
}

export interface GenerateBatchResult {
  generated: number;
  totalAfter: number;
  codes: string[];
}

export interface ValidationResult {
  state: "valid" | "claimed" | "invalid";
  code: string;
  claimedAt?: string | null;
}

export interface WinnerSubmission {
  name: string;
  email: string;
  phone: string;
  address: string;
}
