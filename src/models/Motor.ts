import { Location } from './Location';
import { PaymentInfo } from './Payment';

export type MotorType = 'Submersible' | 'Open Well' | 'Other';
export type BoreUsage = 'Temple' | 'Farmer' | 'Residential' | 'Commercial';

export interface Motor {
  id: string;
  motorName: string;
  boreDepth: string;
  motorType: MotorType;
  motorPower: string;
  boreUsage: BoreUsage;
  motorInstallationYear: string;
  motorAge: string;
  motorPhotos: string[];
  price: number;
  approved: boolean;
  isEditRequired: boolean;
  customerId: string;
  certificate: string;
  registrationNumber: string;
  comments: string;
  certificate_start_date: string;
  certificate_end_date: string;
  location: Location;
  payment: PaymentInfo;
  updatedAt?: string;
  createdAt: string;
}
