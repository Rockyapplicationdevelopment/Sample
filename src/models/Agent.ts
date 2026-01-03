import { Location } from './Location';

export interface PerformanceMetrics {
  monthlyTarget: number;
  currentMonthRevenue: number;
  totalRevenue: number;
  totalCommission: number;
}

export interface CommissionSettings {
  motorRegistrationShare: number;
  certificateRenewalShare: number;
}

export interface Agent {
  id: string;
  role: string;
  name: string;
  email: string;
  phone: string;
  isAdmin: boolean;
  isActive: boolean;
  isSuperAdmin: boolean;
  isMobileAccess: boolean;
  isExecutive: boolean;
  executiveTaggedDistrict: string;
  isAdminScriptEnabled: boolean;
  location: Location;
  state?: string;
  district?: string;
  mandal?: string;
  village?: string;
  pincode?: string;
  identityPhotos?: {
    front: string;
    back: string;
  };
  profilePhoto: string;
  accountNumber: string;
  ifscCode: string;
  bankName: string;
  panNumber: string;
  agentId: string;
  aadharNumber: string;
  bloodGroup?: string;
  password: string;
  createdAt: string;
  fcmToken?: string;
  customerCount?: number;
  technicianCount?: number;
  // Franchise model additions
  franchiseId?: string;
  franchiseIdRef?: string;
  isFranchiseAgent: boolean;
  commissionSettings?: CommissionSettings;
  performanceMetrics?: PerformanceMetrics;
}
