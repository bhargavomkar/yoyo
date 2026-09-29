// ============================================================
// FARO — Data Provider Interfaces
// ============================================================
// Standardized interfaces for all external data providers.
// Each provider implements a consistent API surface so Faro
// can swap providers without touching UI code.
// ============================================================

import {
  CanonicalCompany,
  NormalizedFinancialStatement,
  NormalizedMarketQuote,
  HistoricalPriceData,
  HistoricalRange,
  DataSource,
  PeriodType,
} from '@/types/dataLayer';

// ---- Base Provider ----

export interface BaseProvider {
  readonly providerId: string;
  readonly providerName: string;
  readonly isDemo: boolean;
  ping(): Promise<{ ok: boolean; latencyMs: number }>;
}

// ---- Market Data Provider ----

export interface MarketDataProvider extends BaseProvider {
  getQuote(ticker: string): Promise<NormalizedMarketQuote | null>;
  getBatchQuotes(tickers: string[]): Promise<NormalizedMarketQuote[]>;
  getHistoricalPrices(ticker: string, range: HistoricalRange): Promise<HistoricalPriceData | null>;
}

// ---- Financial Data Provider ----

export interface FinancialDataProvider extends BaseProvider {
  getIncomeStatement(companyId: string, period: string, periodType: PeriodType): Promise<NormalizedFinancialStatement | null>;
  getBalanceSheet(companyId: string, period: string, periodType: PeriodType): Promise<NormalizedFinancialStatement | null>;
  getCashFlowStatement(companyId: string, period: string, periodType: PeriodType): Promise<NormalizedFinancialStatement | null>;
  getFinancialStatements(companyId: string, periodType: PeriodType, count?: number): Promise<NormalizedFinancialStatement[]>;
}

// ---- Company Data Provider ----

export interface CompanyDataProvider extends BaseProvider {
  getCompany(companyId: string): Promise<CanonicalCompany | null>;
  searchCompanies(query: string, limit?: number): Promise<CanonicalCompany[]>;
  getCompaniesBySector(sector: string): Promise<CanonicalCompany[]>;
}

// ---- Filings Provider ----

export interface FilingRecord {
  id: string;
  companyId: string;
  filingType: string;     // 10-K, 10-Q, 8-K, etc.
  filingDate: string;
  periodOfReport: string;
  title: string;
  url?: string;           // Never invented
  source: DataSource;
}

export interface FilingsProvider extends BaseProvider {
  getFilings(companyId: string, filingType?: string, limit?: number): Promise<FilingRecord[]>;
  getLatestFiling(companyId: string, filingType: string): Promise<FilingRecord | null>;
}

// ---- News Provider ----

export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  publishedAt: string;
  source: string;
  url?: string;           // Never invented
  sentiment?: 'positive' | 'negative' | 'neutral';
  relevantTickers: string[];
  isDemo: boolean;
}

export interface NewsProvider extends BaseProvider {
  getNews(query: string, limit?: number): Promise<NewsArticle[]>;
  getCompanyNews(companyId: string, limit?: number): Promise<NewsArticle[]>;
  getMarketNews(limit?: number): Promise<NewsArticle[]>;
}

// ---- Alternative Data Provider ----

export interface AlternativeDataPoint {
  id: string;
  dataType: string;       // 'web_traffic', 'app_downloads', 'satellite', etc.
  entity: string;
  value: number;
  unit: string;
  period: string;
  source: DataSource;
}

export interface AlternativeDataProvider extends BaseProvider {
  getAlternativeData(companyId: string, dataType: string): Promise<AlternativeDataPoint[]>;
  getAvailableDataTypes(companyId: string): Promise<string[]>;
}

// ---- Private Company Data Provider ----

export interface PrivateCompanyDocument {
  id: string;
  companyId: string;
  documentType: 'financial_statement' | 'pitch_deck' | 'cap_table' | 'contract' | 'data_room' | 'other';
  fileName: string;
  fileSize: number;
  uploadedAt: string;
  uploadedBy: string;
  status: 'uploaded' | 'processing' | 'extracted' | 'verified';
}

export interface PrivateCompanyDataProvider extends BaseProvider {
  getCompany(companyId: string): Promise<CanonicalCompany | null>;
  getDocuments(companyId: string): Promise<PrivateCompanyDocument[]>;
  uploadDocument(companyId: string, document: File, documentType: string): Promise<PrivateCompanyDocument>;
  getFinancials(companyId: string): Promise<NormalizedFinancialStatement[]>;
}
