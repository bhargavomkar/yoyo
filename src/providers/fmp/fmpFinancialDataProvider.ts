// ============================================================
// FARO — Financial Modeling Prep Financial Data Provider
// ============================================================
// Real provider for financial statements using FMP API.
// https://financialmodelingprep.com/developer/docs
// ============================================================

import {
  FinancialDataProvider,
} from '../interfaces';
import {
  NormalizedFinancialStatement,
  NormalizedMetric,
  DataSource,
  DataSourceStatus,
  PeriodType,
} from '@/types/dataLayer';
import { DATA_MODE } from '@/config/dataConfig';

// FMP API endpoints
const FMP_API_BASE = 'https://financialmodelingprep.com/api/v3';

// Period type mapping
const PERIOD_TYPE_TO_FMP: Record<PeriodType, string> = {
  'annual': 'annual',
  'quarterly': 'quarterly',
  'ttm': 'ttm',
  'monthly': 'annual',
  'daily': 'annual',
  'point_in_time': 'annual',
};

// Source factory for financial data
const financialDataSource = (companyId: string, period: string, metric: string): DataSource => ({
  id: `fmp-fin-${companyId}-${period}-${metric}-${Date.now()}`,
  provider: 'fmp',
  sourceType: 'provider_feed',
  retrievedAt: new Date().toISOString(),
  dataPeriod: period,
  entity: companyId,
  metric,
  confidence: 0.90,
  status: 'verified',
  isDemo: false,
});

// ---- Helper Functions ----

function mapFinancialMetric(key: string, label: string, value: number, companyId: string, period: string): NormalizedMetric {
  // Format large numbers
  const absValue = Math.abs(value);
  let formattedValue: string;
  if (absValue >= 1e12) {
    formattedValue = `$${(value / 1e12).toFixed(2)}T`;
  } else if (absValue >= 1e9) {
    formattedValue = `$${(value / 1e9).toFixed(2)}B`;
  } else if (absValue >= 1e6) {
    formattedValue = `$${(value / 1e6).toFixed(1)}M`;
  } else if (absValue >= 1e3) {
    formattedValue = `$${(value / 1e3).toFixed(1)}K`;
  } else {
    formattedValue = `$${value.toFixed(2)}`;
  }

  return {
    key,
    label,
    value,
    formattedValue,
    currency: 'USD',
    source: financialDataSource(companyId, period, key),
    formula: undefined,
    inputMetrics: undefined,
  };
}

function buildIncomeStatement(companyId: string, periodData: any): NormalizedFinancialStatement | null {
  if (!periodData) return null;

  const period = periodData.calendarDate || periodData.fillingDate || periodData.date;
  
  return {
    id: `${companyId}-is-${period}`,
    companyId,
    statementType: 'income_statement',
    period,
    periodType: 'annual',
    currency: 'USD',
    metrics: [
      mapFinancialMetric('revenue', 'Revenue', periodData.revenue || 0, companyId, period),
      mapFinancialMetric('cogs', 'Cost of Revenue', periodData.costOfRevenue || 0, companyId, period),
      mapFinancialMetric('gross_profit', 'Gross Profit', periodData.grossProfit || 0, companyId, period),
      mapFinancialMetric('operating_expenses', 'Operating Expenses', periodData.totalOperatingExpenses || 0, companyId, period),
      mapFinancialMetric('operating_income', 'Operating Income', periodData.operatingIncome || 0, companyId, period),
      mapFinancialMetric('interest_expense', 'Interest Expense', periodData.interestExpense || 0, companyId, period),
      mapFinancialMetric('net_income', 'Net Income', periodData.netIncome || 0, companyId, period),
      mapFinancialMetric('eps', 'Earnings Per Share', periodData.eps || 0, companyId, period),
      mapFinancialMetric('ebitda', 'EBITDA', periodData.ebitda || 0, companyId, period),
    ],
    source: financialDataSource(companyId, period, 'income_statement'),
  };
}

function buildBalanceSheet(companyId: string, periodData: any): NormalizedFinancialStatement | null {
  if (!periodData) return null;

  const period = periodData.calendarDate || periodData.fillingDate || periodData.date;
  
  return {
    id: `${companyId}-bs-${period}`,
    companyId,
    statementType: 'balance_sheet',
    period,
    periodType: 'annual',
    currency: 'USD',
    metrics: [
      mapFinancialMetric('cash', 'Cash & Equivalents', periodData.cashAndCashEquivalents || 0, companyId, period),
      mapFinancialMetric('accounts_receivable', 'Accounts Receivable', periodData.receivables || 0, companyId, period),
      mapFinancialMetric('inventory', 'Inventory', periodData.inventory || 0, companyId, period),
      mapFinancialMetric('ppe', 'Property, Plant & Equipment', periodData.propertyPlantEquipment || 0, companyId, period),
      mapFinancialMetric('total_assets', 'Total Assets', periodData.totalAssets || 0, companyId, period),
      mapFinancialMetric('total_debt', 'Total Debt', (periodData.shortTermDebt || 0) + (periodData.longTermDebt || 0), companyId, period),
      mapFinancialMetric('total_liabilities', 'Total Liabilities', periodData.totalLiabilities || 0, companyId, period),
      mapFinancialMetric('equity', 'Shareholders\' Equity', periodData.totalStockholdersEquity || 0, companyId, period),
    ],
    source: financialDataSource(companyId, period, 'balance_sheet'),
  };
}

function buildCashFlowStatement(companyId: string, periodData: any): NormalizedFinancialStatement | null {
  if (!periodData) return null;

  const period = periodData.calendarDate || periodData.fillingDate || periodData.date;
  
  return {
    id: `${companyId}-cf-${period}`,
    companyId,
    statementType: 'cash_flow',
    period,
    periodType: 'annual',
    currency: 'USD',
    metrics: [
      mapFinancialMetric('operating_cash_flow', 'Operating Cash Flow', periodData.operatingCashFlow || 0, companyId, period),
      mapFinancialMetric('capex', 'Capital Expenditures', periodData.capitalExpenditure || 0, companyId, period),
      mapFinancialMetric('free_cash_flow', 'Free Cash Flow', periodData.freeCashFlow || 0, companyId, period),
      mapFinancialMetric('financing_cash_flow', 'Financing Cash Flow', periodData.financingCashFlow || 0, companyId, period),
    ],
    source: financialDataSource(companyId, period, 'cash_flow'),
  };
}

// ---- Provider Implementation ----

export class FmpFinancialDataProvider implements FinancialDataProvider {
  readonly providerId = 'fmp-financial';
  readonly providerName = 'Financial Modeling Prep (Financial Data)';
  readonly isDemo = false;
  private readonly apiKey: string | undefined;

  constructor() {
    this.apiKey = process.env.FMP_API_KEY;
  }

  private getApiKey(): string {
    if (!this.apiKey) {
      throw new Error('FMP_API_KEY environment variable is required for live mode');
    }
    return this.apiKey;
  }

  private async fetchFmp<T>(endpoint: string, params: Record<string, string | number> = {}): Promise<T> {
    const apiKey = this.getApiKey();
    const url = new URL(`${FMP_API_BASE}${endpoint}`);
    url.searchParams.set('apikey', apiKey);
    
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, String(value));
    });

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Faro-AI-Research-Platform/1.0',
      },
    });

    if (!response.ok) {
      const errorBody = await response.text().catch(() => '{}');
      let errorMessage = `FMP API error: ${response.status} ${response.statusText}`;
      
      try {
        const errorData = JSON.parse(errorBody);
        if (errorData?.message) {
          errorMessage += ` - ${errorData.message}`;
        }
      } catch {
        // Ignore parsing errors
      }

      if (response.status === 403) {
        throw new Error('FMP API: Invalid or missing API key. Please check your FMP_API_KEY environment variable.');
      }
      if (response.status === 429) {
        throw new Error('FMP API: Rate limit exceeded. Free tier limited to 250 calls/day.');
      }
      
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return data as T;
  }

  async ping(): Promise<{ ok: boolean; latencyMs: number }> {
    try {
      const startTime = Date.now();
      await this.fetchFmp<string[]>('/balance-sheet-statements/AAPL', { limit: 1 });
      const latencyMs = Date.now() - startTime;
      return { ok: true, latencyMs };
    } catch {
      return { ok: false, latencyMs: -1 };
    }
  }

  async getIncomeStatement(companyId: string, period: string, periodType: PeriodType = 'annual'): Promise<NormalizedFinancialStatement | null> {
    try {
      const fmpPeriodType = PERIOD_TYPE_TO_FMP[periodType];
      const data = await this.fetchFmp<any[]>(`/income-statement/${companyId.toUpperCase()}`, {
        period: fmpPeriodType,
      });

      // Find the specific period
      const periodData = data.find(p => 
        p.calendarDate === period || 
        p.date === period ||
        (fmpPeriodType === 'ttm' && p.date)
      );

      if (!periodData) {
        // Try to get the latest period if specific period not found
        if (data.length > 0) {
          return buildIncomeStatement(companyId.toLowerCase(), data[0]);
        }
        return null;
      }

      return buildIncomeStatement(companyId.toLowerCase(), periodData);
    } catch (error) {
      console.error(`FMP Financial Provider - Error getting income statement for ${companyId} (${period}):`, error);
      throw error;
    }
  }

  async getBalanceSheet(companyId: string, period: string, periodType: PeriodType = 'annual'): Promise<NormalizedFinancialStatement | null> {
    try {
      const fmpPeriodType = PERIOD_TYPE_TO_FMP[periodType];
      const data = await this.fetchFmp<any[]>(`/balance-sheet-statement/${companyId.toUpperCase()}`, {
        period: fmpPeriodType,
      });

      const periodData = data.find(p => 
        p.calendarDate === period || 
        p.date === period ||
        (fmpPeriodType === 'ttm' && p.date)
      );

      if (!periodData) {
        if (data.length > 0) {
          return buildBalanceSheet(companyId.toLowerCase(), data[0]);
        }
        return null;
      }

      return buildBalanceSheet(companyId.toLowerCase(), periodData);
    } catch (error) {
      console.error(`FMP Financial Provider - Error getting balance sheet for ${companyId} (${period}):`, error);
      throw error;
    }
  }

  async getCashFlowStatement(companyId: string, period: string, periodType: PeriodType = 'annual'): Promise<NormalizedFinancialStatement | null> {
    try {
      const fmpPeriodType = PERIOD_TYPE_TO_FMP[periodType];
      const data = await this.fetchFmp<any[]>(`/cash-flow-statement/${companyId.toUpperCase()}`, {
        period: fmpPeriodType,
      });

      const periodData = data.find(p => 
        p.calendarDate === period || 
        p.date === period ||
        (fmpPeriodType === 'ttm' && p.date)
      );

      if (!periodData) {
        if (data.length > 0) {
          return buildCashFlowStatement(companyId.toLowerCase(), data[0]);
        }
        return null;
      }

      return buildCashFlowStatement(companyId.toLowerCase(), periodData);
    } catch (error) {
      console.error(`FMP Financial Provider - Error getting cash flow for ${companyId} (${period}):`, error);
      throw error;
    }
  }

  async getFinancialStatements(companyId: string, periodType: PeriodType = 'annual', count: number = 3): Promise<NormalizedFinancialStatement[]> {
    const results: NormalizedFinancialStatement[] = [];
    const fmpPeriodType = PERIOD_TYPE_TO_FMP[periodType];

    try {
      // Fetch income statements
      const isData = await this.fetchFmp<any[]>(`/income-statement/${companyId.toUpperCase()}`, {
        period: fmpPeriodType,
        limit: count,
      });

      // Fetch balance sheets
      const bsData = await this.fetchFmp<any[]>(`/balance-sheet-statement/${companyId.toUpperCase()}`, {
        period: fmpPeriodType,
        limit: count,
      });

      // Fetch cash flow statements
      const cfData = await this.fetchFmp<any[]>(`/cash-flow-statement/${companyId.toLowerCase()}`, {
        period: fmpPeriodType,
        limit: count,
      });

      // Build results from the most recent periods
      const periodKeys = new Set<string>();
      
      isData.slice(0, count).forEach((item, index) => {
        const period = item.calendarDate || item.date;
        if (period && !periodKeys.has(period)) {
          periodKeys.add(period);
          const is = buildIncomeStatement(companyId.toLowerCase(), item);
          if (is) results.push(is);
        }
      });

      bsData.slice(0, count).forEach((item) => {
        const period = item.calendarDate || item.date;
        if (period && !periodKeys.has(period)) {
          periodKeys.add(period);
          const bs = buildBalanceSheet(companyId.toLowerCase(), item);
          if (bs) results.push(bs);
        }
      });

      cfData.slice(0, count).forEach((item) => {
        const period = item.calendarDate || item.date;
        if (period && !periodKeys.has(period)) {
          periodKeys.add(period);
          const cf = buildCashFlowStatement(companyId.toLowerCase(), item);
          if (cf) results.push(cf);
        }
      });

    } catch (error) {
      console.error(`FMP Financial Provider - Error getting financial statements for ${companyId}:`, error);
      throw error;
    }

    return results;
  }
}
