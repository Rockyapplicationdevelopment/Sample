import { Motor } from './Motor';

export type PaymentStatus = 'success' | 'failed' | 'pending';
export type PaymentMethod = 'Online' | 'upi_qr' | 'cash' | 'card';

export interface PaymentInfo {
  razorpay_signature: string;
  razorpay_order_id: string;
  razorpay_payment_id: string;
  paymentId: string;
  amount: number;
  status: PaymentStatus;
  status_id: string;
  method: PaymentMethod;
  timestamp: number;
  createdAt: string;
  agentId: string;
  agentIdRef: string;
  customerId?: string;
  customerUid?: string;
  customerName?: string;
  customerPhone?: string;
  entity?: string;
  name?: string;
  tax_invoice?: [];
  customer_id?: string;
  transactionId?: string;
  fixed_amount?: boolean;
  id?: string;
  close_reason?: string;
  image_url?: string;
  payment_amount?: number;
  usage?: string;
  payments_amount_received?: number;
  close_by?: number;
  closed_at?: number;
  type?: string;
  created_at?: number;
  payments_count_received?: number;
  paymentStatus?: string;
  notes?: {
    contact: string;
  };
  description?: string;
  date?: string;
  motorInfo?: Motor;
  // Franchise model additions
  franchiseId?: string;
  franchiseIdRef?: string;
  commissionCalculated?: boolean;
  commissionTransactionId?: string;
  tierApplied?: string;
}
