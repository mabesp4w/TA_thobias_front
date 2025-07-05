/** @format */

// utils/formatters.ts

/**
 * Format file size from bytes to human readable format
 * @param bytes - File size in bytes
 * @returns Formatted file size string
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

/**
 * Format date string to readable format
 * @param dateString - ISO date string
 * @returns Formatted date string
 */
export const formatDate = (dateString: string): string => {
  if (!dateString) return "-";

  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };

  return date.toLocaleDateString("id-ID", options);
};

/**
 * Format date to short format (date only)
 * @param dateString - ISO date string
 * @returns Formatted date string
 */
export const formatDateOnly = (dateString: string): string => {
  if (!dateString) return "-";

  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };

  return date.toLocaleDateString("id-ID", options);
};

/**
 * Format currency to Indonesian Rupiah
 * @param amount - Amount in number
 * @returns Formatted currency string
 */
export const formatCurrency = (amount: number): string => {
  if (amount === 0 || amount === null || amount === undefined) return "Rp 0";

  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Format number with thousand separator
 * @param num - Number to format
 * @returns Formatted number string
 */
export const formatNumber = (num: number): string => {
  if (num === 0 || num === null || num === undefined) return "0";

  return new Intl.NumberFormat("id-ID").format(num);
};

/**
 * Format phone number to Indonesian format
 * @param phone - Phone number string
 * @returns Formatted phone number
 */
export const formatPhone = (phone: string): string => {
  if (!phone) return "-";

  // Remove all non-numeric characters
  const cleaned = phone.replace(/\D/g, "");

  // Check if it starts with country code
  if (cleaned.startsWith("62")) {
    return (
      "+62 " + cleaned.slice(2).replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3")
    );
  } else if (cleaned.startsWith("0")) {
    return cleaned.replace(/(\d{4})(\d{4})(\d{4})/, "$1-$2-$3");
  }

  return phone;
};

/**
 * Truncate text with ellipsis
 * @param text - Text to truncate
 * @param maxLength - Maximum length before truncation
 * @returns Truncated text
 */
export const truncateText = (text: string, maxLength: number = 50): string => {
  if (!text) return "-";

  if (text.length <= maxLength) return text;

  return text.substring(0, maxLength) + "...";
};

/**
 * Format boolean to Yes/No
 * @param value - Boolean value
 * @returns "Ya" or "Tidak"
 */
export const formatBoolean = (value: boolean): string => {
  return value ? "Ya" : "Tidak";
};

/**
 * Format status badge class based on status
 * @param status - Status string
 * @returns CSS class for badge
 */
export const getStatusBadgeClass = (status: string): string => {
  const statusLower = status.toLowerCase();

  switch (statusLower) {
    case "aktif":
    case "active":
    case "success":
      return "badge badge-success";
    case "tidak aktif":
    case "inactive":
    case "pending":
      return "badge badge-warning";
    case "error":
    case "failed":
    case "rejected":
      return "badge badge-error";
    default:
      return "badge badge-neutral";
  }
};
