import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility to merge class names respecting Tailwind precedence.
 */
export const cn = (...inputs) => twMerge(clsx(inputs));

const currencyFormatter = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
  currencyDisplay: 'narrowSymbol'
});

const numberFormatter = new Intl.NumberFormat('es-AR', {
  maximumFractionDigits: 0
});

export const formatCurrency = (value, options = {}) => {
  const { showCurrencyCode = true } = options;
  if (value === null || value === undefined || Number.isNaN(Number(value))) {
    return '-';
  }
  // Keep the localized currency (narrow symbol like $) and optionally append the ISO code for clarity (ARS)
  return showCurrencyCode ? `${currencyFormatter.format(Number(value))} ARS` : `${currencyFormatter.format(Number(value))}`;
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

export const formatCurrencyShort = (value) => {
  if (value === null || value === undefined || Number.isNaN(Number(value))) {
    return '-';
  }
  try {
    // Use compact notation to shorten axis labels (e.g. $300K)
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      currencyDisplay: 'narrowSymbol',
      notation: 'compact',
      maximumFractionDigits: 0
    }).format(Number(value));
  } catch (e) {
    // Fallback: simple manual compact
    const n = Number(value);
    if (Math.abs(n) >= 1e6) return `${(n / 1e6).toFixed(0)}M`;
    if (Math.abs(n) >= 1e3) return `${(n / 1e3).toFixed(0)}K`;
    return `${n}`;
  }
};
