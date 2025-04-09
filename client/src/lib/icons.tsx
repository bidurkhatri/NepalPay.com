import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  Smartphone, 
  Zap,
  RefreshCcw,
  DollarSign,
  ShieldCheck,
  BadgePercent,
  ReceiptText,
  Wallet,
  CreditCard,
  Bell,
  Search,
  ShoppingBag,
  Shield,
  ArrowUp,
  MoreHorizontal
} from 'lucide-react';

// Utility function to get user initials from their name
export const getInitials = (firstName: string | null | undefined, lastName: string | null | undefined): string => {
  return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`;
};

// Outgoing payment icon
export const SendIcon = ArrowUpRight;

// Incoming payment icon
export const ReceiveIcon = ArrowDownLeft;

// Mobile/utility payment icon
export const MobileIcon = Smartphone;

// Energy/electricity icon 
export const ElectricityIcon = Zap;

// Refresh/sync icon
export const RefreshIcon = RefreshCcw;

// Payment/transaction icon
export const PaymentIcon = DollarSign;

// Security/collateral icon
export const SecurityIcon = ShieldCheck;

// Interest/reward icon
export const RewardIcon = BadgePercent;

// Invoice/bill icon
export const InvoiceIcon = ReceiptText;

// Wallet/crypto icon
export const WalletIcon = Wallet;

// Purchase/card payment icon
export const CardIcon = CreditCard;

// Notification icon
export const NotificationIcon = Bell;

// Search icon
export const SearchIcon = Search;

// Shopping/purchase icon
export const ShoppingIcon = ShoppingBag;

// Funds/savings icon
export const FundsIcon = DollarSign;

// Safe/secure icon
export const SafeIcon = Shield;

// Up arrow icon
export const ArrowUpIcon = ArrowUp;

// More options icon
export const MoreIcon = MoreHorizontal;