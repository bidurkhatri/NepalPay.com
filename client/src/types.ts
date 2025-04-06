// User
export interface UserProfile {
  id: number;
  username: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  walletAddress?: string;
  balance?: string;
  role: 'user' | 'admin' | 'superadmin';
  joinedAt: string;
  avatar?: string;
}

// Wallet
export interface WalletBalance {
  bnb: string;
  npt: string;
}

export interface Transaction {
  id: number;
  hash: string;
  from: string;
  to: string;
  amount: string;
  token: string;
  fee: string;
  status: 'pending' | 'completed' | 'failed';
  timestamp: string;
  type: 'send' | 'receive' | 'deposit' | 'withdraw' | 'loan' | 'repayment' | 'collateral' | 'purchase';
  description?: string;
}

// Collateral and Loans
export interface Collateral {
  id: number;
  userId: number;
  type: 'BNB' | 'ETH' | 'BTC';
  amount: string;
  value: string;
  locked: boolean;
  createdAt: string;
}

export interface Loan {
  id: number;
  userId: number;
  collateralId: number;
  amount: string;
  interest: string;
  dueDate: string;
  repaid: boolean;
  createdAt: string;
}

// Stats
export interface TokenPriceData {
  timestamp: string;
  price: number;
}

export interface DashboardStats {
  totalUsers: number;
  totalTransactions: number;
  totalTokensInCirculation: string;
  averageDailyTransactions: number;
}

// Stripe
export interface StripePaymentIntent {
  clientSecret: string;
  amount: string;
  currency: string;
  status: string;
}

export interface TokenPurchase {
  id: number;
  userId: number;
  amount: string;
  pricePerToken: string;
  totalAmount: string;
  paymentId: string;
  walletAddress: string;
  status: 'pending' | 'completed' | 'failed';
  createdAt: string;
}

// System
export interface Notification {
  id: number;
  userId: number;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: string;
}

export interface ApiResponse<T> {
  data?: T;
  success: boolean;
  message?: string;
  error?: string;
}