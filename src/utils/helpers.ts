import { FranchiseTier } from '@models/Franchise';
import { COMMISSION_TIERS } from '@constants/config';

export const calculateTierFromRevenue = (monthlyRevenue: number): FranchiseTier => {
  if (monthlyRevenue >= COMMISSION_TIERS.PLATINUM.minRevenue) {
    return 'PLATINUM';
  } else if (monthlyRevenue >= COMMISSION_TIERS.GOLD.minRevenue) {
    return 'GOLD';
  } else if (monthlyRevenue >= COMMISSION_TIERS.SILVER.minRevenue) {
    return 'SILVER';
  }
  return 'BRONZE';
};

export const formatCurrency = (amount: number): string => {
  return `₹${amount.toLocaleString('en-IN')}`;
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^\d{10}$/;
  return phoneRegex.test(phone);
};

export const validateAadhar = (aadhar: string): boolean => {
  const aadharRegex = /^\d{12}$/;
  return aadharRegex.test(aadhar);
};

export const validatePAN = (pan: string): boolean => {
  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
  return panRegex.test(pan);
};

export const validateIFSC = (ifsc: string): boolean => {
  const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
  return ifscRegex.test(ifsc);
};

export const generateRegistrationNumber = (
  state: string,
  year: number,
  sequence: number
): string => {
  const stateCode = state.substring(0, 2).toUpperCase();
  const yearStr = year.toString();
  const month = new Date().getMonth() + 1;
  const monthStr = month.toString().padStart(2, '0');
  const seqStr = sequence.toString().padStart(6, '0');
  
  return `BM${stateCode}${yearStr}${monthStr}-${seqStr}`;
};

export const calculateMotorAge = (installationYear: string): string => {
  const currentYear = new Date().getFullYear();
  const instYear = parseInt(installationYear, 10);
  const age = currentYear - instYear;
  
  if (age === 0) {
    return 'New';
  } else if (age === 1) {
    return '1 year';
  } else {
    return `${age} years`;
  }
};

export const getMotorPriceByDepth = (depth: string): number => {
  const depthNum = parseInt(depth, 10);
  
  if (depthNum <= 50) {
    return 500;
  } else if (depthNum <= 100) {
    return 750;
  } else if (depthNum <= 200) {
    return 1000;
  } else if (depthNum <= 300) {
    return 1500;
  } else {
    return 2000;
  }
};

export const calculateCertificateEndDate = (
  startDate: string,
  durationInYears: number = 1
): string => {
  const start = new Date(startDate);
  start.setFullYear(start.getFullYear() + durationInYears);
  return start.toISOString();
};

export const isValidPassword = (password: string): { valid: boolean; message: string } => {
  if (password.length < 6) {
    return { valid: false, message: 'Password must be at least 6 characters' };
  }
  
  if (password.length > 20) {
    return { valid: false, message: 'Password must not exceed 20 characters' };
  }
  
  return { valid: true, message: '' };
};

export const maskPhone = (phone: string): string => {
  if (phone.length < 10) return phone;
  return `${phone.substring(0, 2)}${'*'.repeat(6)}${phone.substring(8)}`;
};

export const maskEmail = (email: string): string => {
  const [local, domain] = email.split('@');
  if (!domain) return email;
  
  const maskedLocal = local.length > 2
    ? `${local[0]}${'*'.repeat(local.length - 2)}${local[local.length - 1]}`
    : local;
  
  return `${maskedLocal}@${domain}`;
};

export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
};
