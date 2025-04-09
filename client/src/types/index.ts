// User types
export interface User {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  createdAt: string;
}

// Wallet types
export interface Wallet {
  id: number;
  userId: number;
  balance: string;
  currency: string;
  lastUpdated: string;
  nptBalance?: string;
  ethBalance?: string;
  bnbBalance?: string;
  btcBalance?: string;
}

// Transaction types
export interface Transaction {
  id: number;
  senderId?: number;
  receiverId?: number;
  amount: string;
  currency?: string;
  type: TransactionType;
  status: TransactionStatus;
  note?: string;
  description?: string;
  createdAt: string;
  sender?: User;
  receiver?: User;
  stripePaymentId?: string;
}

export type TransactionType = 'TRANSFER' | 'TOPUP' | 'UTILITY' | 'PURCHASE' | 'LOAN_REPAYMENT';
export type TransactionStatus = 'PENDING' | 'COMPLETED' | 'FAILED';

// Activity types
export interface Activity {
  id: number;
  userId: number;
  action: string;
  description?: string;
  details?: string;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
}

// Collateral types
export interface Collateral {
  id: number;
  userId: number;
  assetType: 'BNB' | 'ETH' | 'BTC';
  amount: string;
  value: string;
  status: 'ACTIVE' | 'LOCKED' | 'RELEASED';
  createdAt: string;
  lockedAt?: string;
  releasedAt?: string;
}

// Loan types
export interface Loan {
  id: number;
  userId: number;
  collateralId: number;
  amount: string;
  interest: string;
  duration: number; // In days
  startDate: string;
  endDate: string;
  status: 'PENDING' | 'ACTIVE' | 'REPAID' | 'DEFAULTED';
  collateral?: Collateral;
}

// Ad types
export interface Ad {
  id: number;
  userId: number;
  title: string;
  description: string;
  imageUrl?: string;
  url?: string;
  budget: string;
  spent: string;
  impressions: number;
  clicks: number;
  startDate: string;
  endDate?: string;
  status: 'PENDING' | 'ACTIVE' | 'PAUSED' | 'COMPLETED';
}

// Auth types
export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  walletAddress?: string;
}

// Form types
export interface TransferFormData {
  receiverId: number | string;
  amount: string;
  note?: string;
}

export interface TopupFormData {
  amount: string;
  note?: string;
}

export interface UtilityPaymentFormData {
  amount: string;
  type: string;
  accountNumber: string;
  note?: string;
}

export interface TokenPurchaseFormData {
  amount: string;
  paymentMethod: 'STRIPE' | 'CRYPTO';
  wallet?: string;
}

export interface CollateralFormData {
  assetType: 'BNB' | 'ETH' | 'BTC';
  amount: string;
}

export interface LoanFormData {
  collateralId: number;
  amount: string;
  duration: number;
}
