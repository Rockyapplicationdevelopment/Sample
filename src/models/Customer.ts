import { Motor } from './Motor';
import { Location } from './Location';
import { Agent } from './Agent';

export interface Customer {
  id: string;
  profilePhoto?: string;
  role: string;
  name: string;
  phone: string;
  aadharNumber: string;
  state: string;
  district: string;
  mandal: string;
  village: string;
  pincode: string;
  agentId: string;
  agentIdRef: string;
  motorInfo: Motor[];
  location: Location;
  customerId: string;
  createdAt: string;
  timeStamp: number;
  isActive: boolean;
  agent: Agent | null;
}
