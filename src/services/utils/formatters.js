import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility to merge class names respecting Tailwind precedence.
 */
export const cn = (...inputs) => twMerge(clsx(inputs));

const currencyFormatter = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  maximumFractionDigits: 0
});

const numberFormatter = new Intl.NumberFormat('es-AR', {
  maximumFractionDigits: 0
});

export const formatCurrency = (value) => {
  if (value === null || value === undefined || Number.isNaN(Number(value))) {
    return '-';
  }
  return currencyFormatter.format(Number(value));
};

export const formatNumber = (value) => {
  if (value === null || value === undefined || Number.isNaN(Number(value))) {
    return '-';
  }
  return numberFormatter.format(Number(value));
};

export const formatPercent = (value) => {
  if (value === null || value === undefined || Number.isNaN(Number(value))) {
    return '-';
  }
  return `${Number(value).toFixed(2)}%`;
};

export const formatDate = (value) => {
  if (!value) return '-';
  const stringValue = String(value);
  return new Intl.DateTimeFormat('es-AR', {
    dateStyle: 'medium',
    timeStyle: stringValue.includes('T') ? 'short' : undefined
  }).format(new Date(stringValue));
};
