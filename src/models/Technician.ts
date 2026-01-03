import { Agent } from './Agent';

export interface ShopDetails {
  name: string;
  address: string;
}

export interface BankDetails {
  accountNumber: string;
  ifscCode: string;
  bankName: string;
}

export interface Technician {
  id: string;
  profilePhoto?: string;
  technicianId: string;
  role: string;
  name: string;
  email: string;
  phone: string;
  experience: number;
  state: string;
  district: string;
  mandal: string;
  village: string;
  pincode: string;
  shopDetails: ShopDetails;
  bankDetails: BankDetails;
  aadharNumber: string;
  panNumber: string;
  agentId: string;
  agentIdRef: string;
  approved: boolean;
  agent: Agent | null;
  isActive: boolean;
  createdAt: string;
}
