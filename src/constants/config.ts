export const FIREBASE_CONFIG = {
  apiKey: process.env.FIREBASE_API_KEY || '',
  authDomain: process.env.FIREBASE_AUTH_DOMAIN || '',
  projectId: process.env.FIREBASE_PROJECT_ID || '',
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || '',
  appId: process.env.FIREBASE_APP_ID || '',
};

export const RAZORPAY_CONFIG = {
  keyId: process.env.RAZORPAY_KEY_ID || '',
  keySecret: process.env.RAZORPAY_KEY_SECRET || '',
};

export const APP_CONFIG = {
  appName: 'Borumithra Mobile',
  version: '1.0.0',
  environment: process.env.NODE_ENV || 'development',
};

export const COMMISSION_TIERS = {
  BRONZE: {
    name: 'BRONZE',
    minRevenue: 0,
    maxRevenue: 50000,
    franchiseCommission: 15,
    agentCommission: 75,
    platformFee: 10,
  },
  SILVER: {
    name: 'SILVER',
    minRevenue: 50001,
    maxRevenue: 100000,
    franchiseCommission: 20,
    agentCommission: 70,
    platformFee: 10,
  },
  GOLD: {
    name: 'GOLD',
    minRevenue: 100001,
    maxRevenue: 250000,
    franchiseCommission: 25,
    agentCommission: 65,
    platformFee: 10,
  },
  PLATINUM: {
    name: 'PLATINUM',
    minRevenue: 250001,
    maxRevenue: Infinity,
    franchiseCommission: 30,
    agentCommission: 60,
    platformFee: 10,
  },
};

export const MOTOR_PRICES = {
  '0-50': 500,
  '51-100': 750,
  '101-200': 1000,
  '201-300': 1500,
  '301+': 2000,
};
