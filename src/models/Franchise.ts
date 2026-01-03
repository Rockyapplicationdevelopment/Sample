import { Location } from './Location';

export type FranchiseTier = 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM';
export type TerritoryType = 'STATE' | 'DISTRICT' | 'MANDAL' | 'MULTI_DISTRICT';

export interface Territory {
  type: TerritoryType;
  state: string;
  districts: string[];
  mandals?: string[];
  exclusiveRights: boolean;
}

export interface CommissionStructure {
  motorRegistrationCommission: number;
  certificateRenewalCommission: number;
  currentTier: FranchiseTier;
  platformFee: number;
}

export interface MonthlyRevenue {
  month: string;
  year: number;
  revenue: number;
  commissionEarned: number;
  transactionCount: number;
}

export interface Statistics {
  totalRevenue: number;
  totalCommission: number;
  pendingCommission: number;
  paidCommission: number;
  monthlyRevenue: MonthlyRevenue[];
  totalAgents: number;
  activeAgents: number;
  totalCustomers: number;
  totalMotors: number;
  totalTechnicians: number;
}

export interface BankDetails {
  accountNumber: string;
  ifscCode: string;
  bankName: string;
  accountHolderName: string;
  branchName?: string;
}

export interface Documents {
  registrationCertificate?: string;
  gstCertificate?: string;
  panCard: string;
  addressProof?: string;
  ownerIdProof: string;
}

export interface Franchise {
  id: string;
  franchiseId: string;
  role: 'FRANCHISE';
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
  ownerAadharNumber?: string;
  franchiseName: string;
  businessType?: string;
  territory: Territory;
  commissionStructure: CommissionStructure;
  agents: string[];
  statistics: Statistics;
  bankDetails: BankDetails;
  documents: Documents;
  location?: Location;
  address?: string;
  isActive: boolean;
  isApproved: boolean;
  approvedBy?: string;
  approvedAt?: string;
  rejectionReason?: string;
  profilePhoto?: string;
  password?: string;
  fcmToken?: string;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
  notes?: string;
}

export interface FranchiseRegistrationData {
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
  ownerAadharNumber?: string;
  franchiseName: string;
  businessType?: string;
  territory: Territory;
  bankDetails: BankDetails;
  location?: Location;
  address?: string;
  password: string;
}
