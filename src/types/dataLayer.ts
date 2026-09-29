// ============================================================
// FARO — Data Layer Type System
// ============================================================
// Every financial data point in Faro carries provenance,
// freshness, and quality metadata.
// ============================================================

// ---- Data Mode ----

export type DataMode = 'demo' | 'live';

// ---- Data Source Status ----

export type DataSourceStatus =
  | 'verified'      // Confirmed from authoritative filing or provider
  | 'estimated'     // Calculated or modeled from available data
  | 'derived'       // Computed from other verified/estimated values
  | 'user_provided' // Manually entered by user
  | 'demo'          // Synthetic demonstration data
  | 'unavailable';  // No data available from any source

// ---- Data Freshness ----

export type DataFreshness =
  | 'live'     // Real-time or near-real-time
  | 'delayed'  // Delayed feed (e.g. 15-min delay)
  | 'current'  // Updated within expected refresh window
  | 'stale'    // Older than expected refresh window
  | 'demo';    // Synthetic — no freshness guarantee

// ---- Provider Status ----

export type ProviderStatus =
  | 'connected'
  | 'degraded'
  | 'disconnected'
  | 'rate_limited'
  | 'error';

// ---- Data Source (provenance of a single value) ----

export interface DataSource {
  id: string;
  provider: string;          // e.g. 'demo', 'sec-edgar', 'bloomberg'
  sourceType: DataSourceType;
  sourceUrl?: string;        // URL to original source (never invented)
  retrievedAt: string;       // ISO timestamp
  publishedAt?: string;      // When the source data was published
  dataPeriod?: string;       // e.g. 'FY2025', 'Q2-2026'
  entity?: string;           // Company name or ticker
  metric?: string;           // e.g. 'Revenue', 'EPS'
  confidence: number;        // 0–1
  status: DataSourceStatus;
  isDemo: boolean;
}

export type DataSourceType =
  | 'company_filing'     // 10-K, 10-Q, annual report
  | 'earnings_call'
  | 'sec_filing'
  | 'provider_feed'      // Bloomberg, Refinitiv, etc.
  | 'market_data'
  | 'news_article'
  | 'research_report'
  | 'user_upload'
  | 'ai_derived'
  | 'calculation'
  | 'demo_synthetic';

// ---- Data Point (a single value with full metadata) ----

export interface DataPoint<T = number> {
  value: T;
  originalValue?: T;         // Pre-normalization value
  currency?: string;
  originalCurrency?: string;
  unit?: string;
  period?: string;
  periodType?: PeriodType;
  source: DataSource;
  freshness: DataFreshness;
  lastUpdated: string;
  conflicts?: DataConflict[];
}

export type PeriodType = 'annual' | 'quarterly' | 'ttm' | 'monthly' | 'daily' | 'point_in_time';

// ---- Data Conflict ----

export interface DataConflict {
  id: string;
  metric: string;
  entity: string;
  period: string;
  sources: {
    provider: string;
    value: number;
    currency: string;
    retrievedAt: string;
    confidence: number;
  }[];
  selectedSourceIndex: number;  // Index of preferred source
  reason: string;               // Why this source was preferred
  resolvedAt?: string;
  resolvedBy?: 'system_priority' | 'user' | 'unresolved';
}

// ---- Data Quality ----

export type DataQualityLevel = 'verified' | 'warning' | 'incomplete' | 'error';

export interface DataQualityCheck {
  id: string;
  checkType: DataQualityCheckType;
  entity: string;
  metric?: string;
  severity: 'info' | 'warning' | 'error' | 'critical';
  message: string;
  details?: string;
  detectedAt: string;
  resolvedAt?: string;
}

export type DataQualityCheckType =
  | 'missing_value'
  | 'duplicate_record'
  | 'invalid_date'
  | 'currency_mismatch'
  | 'period_mismatch'
  | 'outlier'
  | 'source_conflict'
  | 'stale_data'
  | 'schema_violation';

export interface DataQualityReport {
  entityId: string;
  entityName: string;
  overallQuality: DataQualityLevel;
  totalChecks: number;
  passed: number;
  warnings: number;
  errors: number;
  checks: DataQualityCheck[];
  lastAuditedAt: string;
}

// ---- Currency Conversion ----

export interface CurrencyConversion {
  fromCurrency: string;
  toCurrency: string;
  originalValue: number;
  convertedValue: number;
  exchangeRate: number;
  exchangeRateDate: string;
  source: string;
}

// ---- Cache Entry ----

export interface CacheEntry<T = unknown> {
  key: string;
  data: T;
  fetchedAt: string;
  expiresAt: string;
  provider: string;
  version: number;
  hitCount: number;
}

// ---- Data Lineage ----

export interface DataLineageNode {
  id: string;
  label: string;
  type: 'raw_data' | 'provider' | 'normalization' | 'calculation' | 'engine' | 'ai_analysis' | 'output';
  source?: string;
  timestamp?: string;
  children: DataLineageNode[];
}

// ---- Document Processing ----

export type DocumentProcessingStatus =
  | 'uploaded'
  | 'processing'
  | 'text_extracted'
  | 'tables_extracted'
  | 'financials_extracted'
  | 'validation_pending'
  | 'needs_verification'
  | 'verified'
  | 'failed';

export interface DocumentProcessingJob {
  id: string;
  fileName: string;
  fileType: string;
  fileSizeBytes: number;
  uploadedAt: string;
  uploadedBy: string;
  status: DocumentProcessingStatus;
  entityId?: string;        // Linked company
  entityName?: string;
  extractedMetrics: ExtractedMetric[];
  extractedTables: number;
  extractedPages: number;
  processingErrors: string[];
  completedAt?: string;
  verifiedAt?: string;
  verifiedBy?: string;
}

export interface ExtractedMetric {
  metric: string;
  value: number;
  currency: string;
  period: string;
  pageNumber: number;
  confidence: number;
  status: 'needs_verification' | 'verified' | 'rejected';
}

// ---- Provider Registration ----

export interface ProviderRegistration {
  id: string;
  name: string;
  type: ProviderType;
  status: ProviderStatus;
  priority: number;        // Higher = preferred in conflicts
  lastSyncAt?: string;
  nextSyncAt?: string;
  recordCount: number;
  errorCount: number;
  warningCount: number;
  apiUsage?: {
    requestsToday: number;
    requestLimit: number;
    costToday: number;
  };
  isDemo: boolean;
}

export type ProviderType =
  | 'market_data'
  | 'financial_data'
  | 'company_data'
  | 'filings'
  | 'news'
  | 'alternative_data'
  | 'private_company';

// ---- Canonical Company ----

export interface CanonicalCompany {
  id: string;
  legalName: string;
  displayName: string;
  ticker?: string;
  exchange?: string;
  isin?: string;
  lei?: string;
  country: string;
  industry: string;
  sector: string;
  currency: string;
  isPublic: boolean;
  website?: string;
  description: string;
  logoLetter: string;
  employees?: string;
  founded?: number;
  dataQuality: DataQualityLevel;
  dataSources: string[];     // Provider IDs that contribute data
  lastUpdated: string;
  isDemo: boolean;
}

// ---- Normalized Financial Statement ----

export interface NormalizedFinancialStatement {
  id: string;
  companyId: string;
  statementType: 'income_statement' | 'balance_sheet' | 'cash_flow';
  period: string;          // e.g. 'FY2025', 'Q2-2026'
  periodType: PeriodType;
  currency: string;
  metrics: NormalizedMetric[];
  source: DataSource;
  filingDate?: string;
}

export interface NormalizedMetric {
  key: string;             // e.g. 'revenue', 'gross_profit'
  label: string;           // Human-readable label
  value: number;
  formattedValue: string;
  currency: string;
  originalCurrency?: string;
  originalValue?: number;
  exchangeRate?: number;
  source: DataSource;
  formula?: string;        // e.g. 'revenue - cogs'
  inputMetrics?: string[]; // Keys of metrics used in calculation
}

// ---- Market Quote ----

export interface NormalizedMarketQuote {
  companyId: string;
  ticker: string;
  exchange: string;
  price: DataPoint<number>;
  open: DataPoint<number>;
  high: DataPoint<number>;
  low: DataPoint<number>;
  volume: DataPoint<number>;
  marketCap: DataPoint<number>;
  week52High: DataPoint<number>;
  week52Low: DataPoint<number>;
  previousClose: DataPoint<number>;
  change: number;
  changePercent: number;
  currency: string;
  lastUpdated: string;
  freshness: DataFreshness;
}

// ---- Historical Price ----

export interface HistoricalPricePoint {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  adjustedClose: number;
  volume: number;
}

export type HistoricalRange = '1D' | '1W' | '1M' | '3M' | '6M' | '1Y' | '3Y' | '5Y' | '10Y';

export interface HistoricalPriceData {
  companyId: string;
  ticker: string;
  range: HistoricalRange;
  currency: string;
  prices: HistoricalPricePoint[];
  source: DataSource;
}

// ---- Fundamental Metrics ----

export interface FundamentalMetricCalculation {
  key: string;
  label: string;
  value: number;
  formattedValue: string;
  unit: string;
  formula: string;
  inputData: { label: string; value: string; source: DataSourceStatus }[];
  source: DataSource;
  calculatedAt: string;
}

// ---- Evidence Graph ----

export interface EvidenceNode {
  id: string;
  type: 'conclusion' | 'metric' | 'statement' | 'document' | 'source' | 'page_section';
  label: string;
  value?: string;
  status: DataSourceStatus;
  children: EvidenceNode[];
}

// ---- Data Access Control ----

export type DataAccessLevel =
  | 'public'           // Publicly available data
  | 'user'             // User-uploaded private data
  | 'deal_room'        // Restricted to specific deal participants
  | 'confidential'     // Highly restricted
  | 'agent_context';   // Temporary agent working context

export interface DataAccessPolicy {
  resourceId: string;
  resourceType: string;
  accessLevel: DataAccessLevel;
  allowedAgentIds?: string[];
  allowedDealIds?: string[];
}

// ---- Data Health Summary ----

export interface DataHealthSummary {
  dataMode: DataMode;
  totalProviders: number;
  connectedProviders: number;
  totalRecords: number;
  verifiedRecords: number;
  warningCount: number;
  errorCount: number;
  staleDataCount: number;
  lastFullSyncAt: string;
  providers: ProviderRegistration[];
  qualityReports: DataQualityReport[];
  recentConflicts: DataConflict[];
  processingJobs: DocumentProcessingJob[];
}
