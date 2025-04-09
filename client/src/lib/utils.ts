import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Utility function to merge Tailwind CSS classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format currency with symbol
export function formatCurrency(amount: number, currency = "NPT") {
  return `${amount.toLocaleString()} ${currency}`;
}

// Format date to a human-readable string
export function formatDate(date: Date | string) {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// Format date to include time
export function formatDateTime(date: Date | string) {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Shorten a string (e.g., for wallet addresses)
export function shortenString(str: string, start = 6, end = 4) {
  if (!str || str.length <= start + end) return str;
  return `${str.slice(0, start)}...${str.slice(-end)}`;
}

// Truncate text with ellipsis
export function truncateText(text: string, maxLength: number) {
  if (!text || text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
}

// Convert seconds to a human-readable time format (e.g., "2h 30m")
export function formatTime(seconds: number) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  
  const secs = Math.floor(seconds % 60);
  return minutes > 0 ? `${minutes}m ${secs}s` : `${secs}s`;
}

// Format large numbers with K, M, B suffixes
export function formatLargeNumber(num: number) {
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

// Get status color based on value
export function getStatusColor(status: string) {
  switch (status.toLowerCase()) {
    case "completed":
    case "approved":
    case "active":
    case "success":
      return "text-green-500";
    case "pending":
    case "processing":
      return "text-yellow-500";
    case "failed":
    case "rejected":
    case "error":
      return "text-red-500";
    default:
      return "text-gray-500";
  }
}

// Get transaction type icon name
export function getTransactionTypeIcon(type: string) {
  switch (type.toLowerCase()) {
    case "deposit":
      return "arrow-down-circle";
    case "withdrawal":
      return "arrow-up-circle";
    case "transfer":
      return "repeat";
    case "fee":
      return "ticket";
    case "loan":
      return "credit-card";
    case "repayment":
      return "refresh-ccw";
    default:
      return "circle";
  }
}

// Calculate percent change between two values
export function percentChange(current: number, previous: number) {
  if (previous === 0) return 0;
  return ((current - previous) / previous) * 100;
}