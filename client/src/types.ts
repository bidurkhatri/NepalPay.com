// User Types
export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  password?: string;
  role: string;
  createdAt: string;
  updatedAt?: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

// Wallet Types
export interface Wallet {
  id: number;
  userId: number;
  balance: string | number;
  currency: string;
  createdAt?: string;
  updatedAt?: string;
}

// Transaction Types
export interface Transaction {
  id: number;
  senderId?: number;
  receiverId?: number;
  amount: string | number;
  type: 'TRANSFER' | 'TOPUP' | 'UTILITY' | 'DEPOSIT' | 'WITHDRAWAL';
  note?: string;
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
  createdAt: string;
  updatedAt?: string;
  sender?: Omit<User, 'password'>;
  receiver?: Omit<User, 'password'>;
}

export interface TransferFormData {
  receiverId: number;
  amount: string;
  note?: string;
}

// Activity Types
export interface Activity {
  id: number;
  userId: number;
  action: string;
  details: string;
  ipAddress?: string;
  createdAt: string;
  updatedAt?: string;
}

// Blockchain Types
export interface Collateral {
  id?: number;
  userId: number;
  type: 'BNB' | 'ETH' | 'BTC';
  amount: string;
  valueInNPT: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Loan {
  id?: number;
  userId: number;
  amount: string;
  collateralId: number;
  interestRate: string;
  startDate: string;
  endDate?: string;
  status: 'ACTIVE' | 'REPAID' | 'DEFAULTED';
  createdAt?: string;
  updatedAt?: string;
}

// Ad Types
export interface Ad {
  id?: number;
  userId: number;
  title: string;
  description: string;
  bidAmount: string;
  tier: 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM';
  startDate: string;
  endDate: string;
  status: 'ACTIVE' | 'EXPIRED' | 'PENDING';
  createdAt?: string;
  updatedAt?: string;
}