// ============================================================
// FARO — Data Layer Service
// ============================================================
// Central orchestrator for the Faro data layer.
// Coordinates providers, caching, normalization, quality
// checks, and evidence tracking.
// ============================================================

import {
  CanonicalCompany,
  NormalizedFinancialStatement,
  NormalizedMarketQuote,
  HistoricalPriceData,
  HistoricalRange,
  DataHealthSummary,
  DataConflict,
  DataQualityReport,
  FundamentalMetricCalculation,
  PeriodType,
} from '@/types/dataLayer';
import { ProviderRegistry } from '@/providers/providerRegistry';
import { DataCacheService } from './dataCacheService';
import { DataQualityService } from './dataQualityService';
import { FundamentalMetricsService } from './fundamentalMetricsService';
import { HistoricalPriceService } from './historicalPriceService';
import { DocumentProcessingService } from './documentProcessingService';
import { DATA_MODE } from '@/config/dataConfig';
import type { FilingRecord, NewsArticle } from '@/providers/interfaces';

class DataLayerServiceImpl {

  // ---- Company Data ----

  async getCompany(companyId: string): Promise<CanonicalCompany | null> {
    const cacheKey = `company:${companyId}`;
    const cached = DataCacheService.get<CanonicalCompany>(cacheKey);
    if (cached) return cached;

    const provider = ProviderRegistry.getCompanyProvider();
    const company = await provider.getCompany(companyId);
    if (company) {
      DataCacheService.set(cacheKey, company, provider.providerId, 'company_metadata');
    }
    return company;
  }

  async searchCompanies(query: string, limit?: number): Promise<CanonicalCompany[]> {
    const provider = ProviderRegistry.getCompanyProvider();
    return provider.searchCompanies(query, limit);
  }

  // ---- Market Data ----

  async getQuote(ticker: string): Promise<NormalizedMarketQuote | null> {
    const cacheKey = `quote:${ticker}`;
    const cached = DataCacheService.get<NormalizedMarketQuote>(cacheKey);
    if (cached) return cached;

    const provider = ProviderRegistry.getMarketProvider();
    const quote = await provider.getQuote(ticker);
    if (quote) {
      DataCacheService.set(cacheKey, quote, provider.providerId, 'market_data');
    }
    return quote;
  }

  async getBatchQuotes(tickers: string[]): Promise<NormalizedMarketQuote[]> {
    const provider = ProviderRegistry.getMarketProvider();
    return provider.getBatchQuotes(tickers);
  }

  async getHistoricalPrices(ticker: string, range: HistoricalRange): Promise<HistoricalPriceData | null> {
    const cacheKey = `history:${ticker}:${range}`;
    const cached = DataCacheService.get<HistoricalPriceData>(cacheKey);
    if (cached) return cached;

    const data = await HistoricalPriceService.getPriceHistory(ticker, range);
    if (data) {
      DataCacheService.set(cacheKey, data, 'historical', 'historical_prices');
    }
    return data;
  }

  // ---- Financial Statements ----

  async getFinancialStatements(companyId: string, periodType: PeriodType = 'annual', count?: number): Promise<NormalizedFinancialStatement[]> {
    const cacheKey = `financials:${companyId}:${periodType}`;
    const cached = DataCacheService.get<NormalizedFinancialStatement[]>(cacheKey);
    if (cached) return cached;

    const provider = ProviderRegistry.getFinancialProvider();
    const statements = await provider.getFinancialStatements(companyId, periodType, count);
    if (statements.length > 0) {
      DataCacheService.set(cacheKey, statements, provider.providerId, 'financial_statements');
    }
    return statements;
  }

  async getIncomeStatement(companyId: string, period: string, periodType: PeriodType = 'annual'): Promise<NormalizedFinancialStatement | null> {
    const provider = ProviderRegistry.getFinancialProvider();
    return provider.getIncomeStatement(companyId, period, periodType);
  }

  async getBalanceSheet(companyId: string, period: string, periodType: PeriodType = 'annual'): Promise<NormalizedFinancialStatement | null> {
    const provider = ProviderRegistry.getFinancialProvider();
    return provider.getBalanceSheet(companyId, period, periodType);
  }

  async getCashFlowStatement(companyId: string, period: string, periodType: PeriodType = 'annual'): Promise<NormalizedFinancialStatement | null> {
    const provider = ProviderRegistry.getFinancialProvider();
    return provider.getCashFlowStatement(companyId, period, periodType);
  }

  // ---- Filings ----

  async getFilings(companyId: string, filingType?: string, limit?: number): Promise<FilingRecord[]> {
    const cacheKey = `filings:${companyId}:${filingType ?? 'all'}`;
    const cached = DataCacheService.get<FilingRecord[]>(cacheKey);
    if (cached) return cached;

    const provider = ProviderRegistry.getFilingsProvider();
    const filings = await provider.getFilings(companyId, filingType, limit);
    DataCacheService.set(cacheKey, filings, provider.providerId, 'filings');
    return filings;
  }

  // ---- News ----

  async getCompanyNews(companyId: string, limit?: number): Promise<NewsArticle[]> {
    const provider = ProviderRegistry.getNewsProvider();
    return provider.getCompanyNews(companyId, limit);
  }

  async getMarketNews(limit?: number): Promise<NewsArticle[]> {
    const provider = ProviderRegistry.getNewsProvider();
    return provider.getMarketNews(limit);
  }

  // ---- Fundamental Metrics ----

  async getFundamentalMetrics(companyId: string): Promise<FundamentalMetricCalculation[]> {
    return FundamentalMetricsService.computeForCompany(companyId);
  }

  // ---- Data Quality ----

  async getQualityReport(companyId: string): Promise<DataQualityReport | null> {
    const company = await this.getCompany(companyId);
    if (!company) return null;

    const statements = await this.getFinancialStatements(companyId, 'annual');
    return DataQualityService.generateReport(companyId, company.displayName, statements);
  }

  // ---- Data Health (Admin Dashboard) ----

  async getDataHealth(): Promise<DataHealthSummary> {
    const providers = ProviderRegistry.getAllRegistrations();
    const connected = providers.filter(p => p.status === 'connected').length;
    const totalRecords = providers.reduce((sum, p) => sum + p.recordCount, 0);
    const jobs = DocumentProcessingService.getAllJobs();

    return {
      dataMode: DATA_MODE,
      totalProviders: providers.length,
      connectedProviders: connected,
      totalRecords,
      verifiedRecords: 0,
      warningCount: providers.reduce((s, p) => s + p.warningCount, 0),
      errorCount: providers.reduce((s, p) => s + p.errorCount, 0),
      staleDataCount: 0,
      lastFullSyncAt: new Date().toISOString(),
      providers,
      qualityReports: [],
      recentConflicts: [],
      processingJobs: jobs,
    };
  }

  // ---- Data Mode ----

  getDataMode() {
    return DATA_MODE;
  }

  isDemo(): boolean {
    return DATA_MODE === 'demo';
  }
}

export const DataLayerService = new DataLayerServiceImpl();
