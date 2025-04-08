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
}

// Transaction types
export interface Transaction {
  id: number;
  senderId?: number;
  receiverId?: number;
  amount: string;
  type: TransactionType;
  status: TransactionStatus;
  note?: string;
  createdAt: string;
  sender?: User;
  receiver?: User;
}

export type TransactionType = 'TRANSFER' | 'TOPUP' | 'UTILITY';
export type TransactionStatus = 'PENDING' | 'COMPLETED' | 'FAILED';

// Activity types
export interface Activity {
  id: number;
  userId: number;
  action: string;
  details?: string;
  ipAddress?: string;
  createdAt: string;
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
