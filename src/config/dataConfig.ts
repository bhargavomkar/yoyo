// ============================================================
// FARO — Data Configuration
// ============================================================
// Central configuration for data mode, provider priorities,
// cache TTLs, and quality thresholds.
// ============================================================

import { DataMode } from '@/types/dataLayer';

// ---- Data Mode ----
// Use NEXT_SERVER_DATA_MODE environment variable for server-side only
// The NEXT_PUBLIC_FARO_DATA_MODE is kept for client-side compatibility
// but should NOT be used in production for live mode

const ENV_DATA_MODE = (typeof process !== 'undefined' && process.env)
  ? (process.env.NEXT_SERVER_DATA_MODE || process.env.NEXT_PUBLIC_FARO_DATA_MODE)
  : 'demo';

export const DATA_MODE: DataMode = (ENV_DATA_MODE as DataMode) || 'demo';

export const isLiveMode = (): boolean => DATA_MODE === 'live';
export const isDemoMode = (): boolean => DATA_MODE === 'demo';

// ---- Provider Priority (higher = preferred in conflicts) ----

export const PROVIDER_PRIORITY: Record<string, number> = {
  'sec-edgar':     100,  // SEC filings are authoritative
  'bloomberg':      90,
  'refinitiv':      85,
  'factset':        80,
  'capital-iq':     75,
  'yahoo-finance':  50,
  'user-upload':    40,
  'ai-derived':     20,
  'demo':            1,  // Lowest priority
};

// ---- Cache TTL (seconds) ----

export const CACHE_TTL: Record<string, number> = {
  company_metadata:     86400,    // 24 hours
  financial_statements: 3600,     // 1 hour
  market_data:          60,       // 1 minute
  historical_prices:    3600,     // 1 hour
  filings:              86400,    // 24 hours
  news:                 300,      // 5 minutes
  research:             1800,     // 30 minutes
};

// ---- Staleness Thresholds (seconds) ----

export const STALENESS_THRESHOLD: Record<string, number> = {
  market_data:          300,      // 5 minutes
  financial_statements: 604800,   // 7 days
  company_metadata:     2592000,  // 30 days
  filings:              604800,   // 7 days
  news:                 3600,     // 1 hour
};

// ---- Data Quality Thresholds ----

export const QUALITY_THRESHOLDS = {
  minConfidence: 0.6,
  outlierStdDevs: 3.0,
  maxConflictVariance: 0.05,   // 5% variance triggers conflict
  maxStaleDays: 30,
};

// ---- Supported Currencies ----

export const SUPPORTED_CURRENCIES = [
  'USD', 'EUR', 'GBP', 'JPY', 'CHF', 'CAD', 'AUD',
  'HKD', 'SGD', 'INR', 'CNY', 'KRW', 'SEK', 'NOK',
] as const;

export type SupportedCurrency = typeof SUPPORTED_CURRENCIES[number];

export const DEFAULT_CURRENCY: SupportedCurrency = 'USD';
