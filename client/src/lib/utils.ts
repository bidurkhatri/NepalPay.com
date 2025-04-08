import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge multiple class names with tailwind classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a number as currency
 */
export function formatCurrency(amount: number, currency: string = "NPR", locale: string = "en-NP") {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(amount);
}

/**
 * Format a number with commas
 */
export function formatNumber(num: number, decimals: number = 2): string {
  return new Intl.NumberFormat("en-NP", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num);
}

/**
 * Truncate an Ethereum address for display
 */
export function truncateAddress(address: string, front: number = 6, back: number = 4): string {
  if (!address) return "";
  if (address.length <= front + back) return address;
  
  const start = address.slice(0, front);
  const end = address.slice(-back);
  
  return `${start}...${end}`;
}

/**
 * Format a date for display
 */
export function formatDate(date: Date | string, options: Intl.DateTimeFormatOptions = {}): string {
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    ...options,
  };
  
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("en-NP", defaultOptions).format(dateObj);
}

/**
 * Convert timestamp to date object
 */
export function timestampToDate(timestamp: number): Date {
  return new Date(timestamp * 1000);
}

/**
 * Format timestamp for display
 */
export function formatTimestamp(timestamp: number, options: Intl.DateTimeFormatOptions = {}): string {
  return formatDate(timestampToDate(timestamp), options);
}

/**
 * Detect the current blockchain network
 */
export function detectNetwork(chainId: number | string): string {
  const id = typeof chainId === "string" ? parseInt(chainId) : chainId;
  
  switch(id) {
    case 1:
      return "Ethereum Mainnet";
    case 56:
      return "Binance Smart Chain";
    case 97:
      return "Binance Smart Chain Testnet";
    default:
      return "Unknown Network";
  }
}

/**
 * Delay execution for a specified time
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Check if the current device is mobile
 */
export function isMobile(): boolean {
  return window.innerWidth <= 768;
}

/**
 * Generate a gradient CSS string
 */
export function generateGradient(
  startColor: string = "#3b82f6", 
  endColor: string = "#10b981",
  angle: number = 45
): string {
  return `linear-gradient(${angle}deg, ${startColor}, ${endColor})`;
}

/**
 * Generate a glass effect CSS string
 */
export function glassEffect(
  opacity: number = 0.2,
  blur: number = 10,
  border: string = "1px solid rgba(255, 255, 255, 0.2)"
): Record<string, string> {
  return {
    backgroundColor: `rgba(255, 255, 255, ${opacity})`,
    backdropFilter: `blur(${blur}px)`,
    WebkitBackdropFilter: `blur(${blur}px)`,
    border,
    boxShadow: "0 8px 32px rgba(31, 38, 135, 0.15)"
  };
}

/**
 * Determine text color based on background brightness
 */
export function getTextColorForBackground(backgroundColor: string): "white" | "black" {
  // Remove # if present
  const hex = backgroundColor.replace("#", "");
  
  // Convert to RGB
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  
  // Calculate brightness
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  
  // Return white for dark backgrounds, black for light
  return brightness < 128 ? "white" : "black";
}

/**
 * Convert wei to ether
 */
export function weiToEther(wei: string | number): number {
  const weiValue = typeof wei === "string" ? wei : wei.toString();
  return parseFloat(weiValue) / 1e18;
}

/**
 * Convert ether to wei
 */
export function etherToWei(ether: number | string): string {
  const etherValue = typeof ether === "string" ? parseFloat(ether) : ether;
  return (etherValue * 1e18).toString();
}

/**
 * Calculate gas cost in USD
 */
export function calculateGasCost(gasLimit: number, gasPrice: number, ethPrice: number): number {
  const gasInEth = (gasLimit * gasPrice) / 1e18;
  return gasInEth * ethPrice;
}

/**
 * Format file size
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  
  return `${parseFloat((bytes / Math.pow(1024, i)).toFixed(2))} ${sizes[i]}`;
}