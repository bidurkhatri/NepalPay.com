import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges class names with Tailwind CSS classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a number as currency
 */
export function formatCurrency(
  amount: number,
  currency = "NPR",
  locale = "en-US"
) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(amount);
}

/**
 * Format a date
 */
export function formatDate(
  date: Date | string,
  options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  }
) {
  if (typeof date === "string") {
    date = new Date(date);
  }
  return new Intl.DateTimeFormat("en-US", options).format(date);
}

/**
 * Truncate a string
 */
export function truncateString(str: string, maxLength: number) {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength) + "...";
}

/**
 * Truncate an Ethereum address
 */
export function truncateAddress(address: string) {
  if (!address) return "";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

/**
 * Sleep for specified milliseconds
 */
export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Get readable Blockchain network name from chain ID
 */
export function getNetworkName(chainId: number | null): string {
  if (!chainId) return "Unknown Network";
  
  switch (chainId) {
    case 1:
      return "Ethereum Mainnet";
    case 56:
      return "BSC Mainnet";
    case 97:
      return "BSC Testnet";
    case 137:
      return "Polygon Mainnet";
    case 80001:
      return "Polygon Mumbai";
    default:
      return `Chain ID: ${chainId}`;
  }
}

/**
 * Add glass morphism effect to an element
 */
export function addGlassMorphism(baseClasses: string) {
  return `${baseClasses} glass`;
}