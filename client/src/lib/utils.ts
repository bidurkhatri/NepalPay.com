import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines multiple class names and applies Tailwind merge
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a number as currency
 */
export function formatCurrency(amount: number | string, currency = "NPT", options = {}): string {
  const numAmount = typeof amount === "string" ? parseFloat(amount) : amount;
  
  const defaultOptions = {
    minimumFractionDigits: 2,
    maximumFractionDigits: 6,
  };
  
  const mergedOptions = { ...defaultOptions, ...options };
  
  return `${numAmount.toLocaleString(undefined, mergedOptions)} ${currency}`;
}

/**
 * Truncates a string (typically an address) to a shorter form
 */
export function truncateAddress(address: string, startLength = 6, endLength = 4): string {
  if (!address) return "";
  if (address.length <= startLength + endLength) return address;
  
  return `${address.slice(0, startLength)}...${address.slice(-endLength)}`;
}

/**
 * Formats a date to a readable string
 */
export function formatDate(date: Date | string, options = {}): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };
  
  const mergedOptions = { ...defaultOptions, ...options };
  
  return dateObj.toLocaleDateString(undefined, mergedOptions);
}

/**
 * Validates if a string is a valid Ethereum address
 */
export function isValidEthereumAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

/**
 * Convert a timestamp to a relative time string (e.g., "2 hours ago")
 */
export function timeAgo(timestamp: Date | string | number): string {
  const date = timestamp instanceof Date ? timestamp : new Date(timestamp);
  const now = new Date();
  
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  let interval = Math.floor(seconds / 31536000);
  if (interval >= 1) {
    return interval === 1 ? "1 year ago" : `${interval} years ago`;
  }
  
  interval = Math.floor(seconds / 2592000);
  if (interval >= 1) {
    return interval === 1 ? "1 month ago" : `${interval} months ago`;
  }
  
  interval = Math.floor(seconds / 86400);
  if (interval >= 1) {
    return interval === 1 ? "1 day ago" : `${interval} days ago`;
  }
  
  interval = Math.floor(seconds / 3600);
  if (interval >= 1) {
    return interval === 1 ? "1 hour ago" : `${interval} hours ago`;
  }
  
  interval = Math.floor(seconds / 60);
  if (interval >= 1) {
    return interval === 1 ? "1 minute ago" : `${interval} minutes ago`;
  }
  
  return seconds < 10 ? "just now" : `${Math.floor(seconds)} seconds ago`;
}

/**
 * Parse a blockchain transaction error message to make it more user-friendly
 */
export function parseBlockchainError(error: any): string {
  if (!error) return "Unknown error";
  
  const message = error.message || error.toString();
  
  // Handle common MetaMask errors
  if (message.includes("User rejected the request")) {
    return "Transaction was rejected by the user";
  }
  
  if (message.includes("insufficient funds")) {
    return "Insufficient funds for this transaction";
  }
  
  if (message.includes("gas required exceeds allowance")) {
    return "Transaction would exceed gas limit";
  }
  
  if (message.includes("nonce")) {
    return "Transaction nonce error. Please refresh the page and try again";
  }
  
  if (message.includes("intrinsic gas too low")) {
    return "Gas limit too low for this transaction";
  }
  
  // Generic fallback
  return message;
}

/**
 * Format a large number with a suffix (K, M, B)
 */
export function formatLargeNumber(num: number): string {
  if (num >= 1e9) {
    return (num / 1e9).toFixed(1) + "B";
  }
  if (num >= 1e6) {
    return (num / 1e6).toFixed(1) + "M";
  }
  if (num >= 1e3) {
    return (num / 1e3).toFixed(1) + "K";
  }
  return num.toString();
}

/**
 * Check if the device is mobile
 */
export function isMobile(): boolean {
  return window.innerWidth <= 768;
}

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error("Failed to copy text:", err);
    return false;
  }
}