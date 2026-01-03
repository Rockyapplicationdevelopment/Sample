export type CommissionStatus = 'PENDING' | 'PROCESSING' | 'PAID' | 'FAILED' | 'CANCELLED';
export type TransactionType = 'MOTOR_REGISTRATION' | 'CERTIFICATE_RENEWAL' | 'OTHER';
export type PayoutMethod = 'BANK_TRANSFER' | 'UPI' | 'CASH' | 'CHEQUE';

export interface CommissionSplits {
  franchiseCommission: number;
  agentCommission: number;
  adminShare: number;
  platformFee: number;
  taxDeducted: number;
  tdsPercentage?: number;
}

export interface PayoutDetails {
  payoutDate: string;
  payoutMethod: PayoutMethod;
  utrNumber?: string;
  transactionReference?: string;
  bankDetails?: {
    accountNumber: string;
    ifscCode: string;
    bankName: string;
  };
  processedBy?: string;
  notes?: string;
}

export interface Commission {
  id: string;
  transactionId: string;
  franchiseId?: string;
  franchiseIdRef?: string;
  franchiseName?: string;
  agentId: string;
  agentIdRef: string;
  agentName?: string;
  customerId?: string;
  customerName?: string;
  motorId?: string;
  registrationNumber?: string;
  paymentId: string;
  transactionType: TransactionType;
  totalAmount: number;
  commissionPercentage: number;
  commissionAmount: number;
  splits: CommissionSplits;
  tierApplied: string;
  status: CommissionStatus;
  payoutDetails?: PayoutDetails;
  remarks?: string;
  createdAt: string;
  updatedAt?: string;
  processedAt?: string;
  dueDate?: string;
  month: string;
  year: number;
}

export interface CommissionSummary {
  totalCommission: number;
  pendingCommission: number;
  paidCommission: number;
  processingCommission: number;
  failedCommission: number;
  transactionCount: number;
  lastPayoutDate?: string;
  nextPayoutDate?: string;
}
