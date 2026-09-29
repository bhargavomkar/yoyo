import { NVDA_FINANCIALS_HISTORY } from '@/lib/research-mock-data';
import { FinancialYearData } from '@/types/research';
import { DataLayerService } from './dataLayerService';
import { PeriodType, NormalizedFinancialStatement } from '@/types/dataLayer';

export class FinancialDataService {
  /**
   * Retrieves historical statement data for a given company.
   * Consumes Faro Data Layer, falls back to demo data if unavailable.
   */
  static async getFinancialsHistoryAsync(companyTicker: string): Promise<FinancialYearData[]> {
    const is = await DataLayerService.getFinancialStatements(companyTicker, 'annual', 5);
    
    // Fallback to legacy mock data if Data Layer returns nothing
    if (is.length === 0) {
      return NVDA_FINANCIALS_HISTORY;
    }

    // Map Data Layer normalized statements back to UI shape
    const periods = Array.from(new Set(is.map(s => s.period))).sort();
    const results: FinancialYearData[] = [];

    for (const period of periods) {
      const pIs = is.find(s => s.statementType === 'income_statement' && s.period === period);
      const pBs = is.find(s => s.statementType === 'balance_sheet' && s.period === period);
      const pCf = is.find(s => s.statementType === 'cash_flow' && s.period === period);

      const getVal = (stmt: NormalizedFinancialStatement | undefined, key: string) => 
        stmt?.metrics.find(m => m.key === key)?.value ?? 0;

      const rev = getVal(pIs, 'revenue');
      const gp = getVal(pIs, 'gross_profit');
      const opIn = getVal(pIs, 'operating_income');
      const ni = getVal(pIs, 'net_income');
      const ebitda = getVal(pIs, 'ebitda');

      results.push({
        year: period,
        revenue: rev,
        cogs: getVal(pIs, 'cogs'),
        grossProfit: gp,
        grossMargin: rev ? gp / rev : 0,
        operatingExpenses: getVal(pIs, 'operating_expenses'),
        operatingIncome: opIn,
        operatingMargin: rev ? opIn / rev : 0,
        netIncome: ni,
        netMargin: rev ? ni / rev : 0,
        eps: getVal(pIs, 'eps'),
        ebitda: ebitda,
        ebitdaMargin: rev ? ebitda / rev : 0,
        freeCashFlow: getVal(pCf, 'free_cash_flow'),
        operatingCashFlow: getVal(pCf, 'operating_cash_flow'),
        capex: getVal(pCf, 'capex'),
        cash: getVal(pBs, 'cash'),
        debt: getVal(pBs, 'total_debt'),
        totalAssets: getVal(pBs, 'total_assets'),
        liabilities: getVal(pBs, 'total_liabilities'),
        equity: getVal(pBs, 'equity'),
        accountsReceivable: getVal(pBs, 'accounts_receivable'),
        inventory: getVal(pBs, 'inventory'),
        ppe: getVal(pBs, 'ppe'),
        financingCashFlow: getVal(pCf, 'financing_cash_flow')
      });
    }

    return results;
  }

  // Legacy sync wrapper for UI compatibility
  static getFinancialsHistory(companyTicker: string): FinancialYearData[] {
    return NVDA_FINANCIALS_HISTORY;
  }

  static getPerformanceData(companyTicker: string, timeframe: '1Y' | '3Y' | '5Y' | '10Y') {
    const raw = NVDA_FINANCIALS_HISTORY;
    switch (timeframe) {
      case '1Y': return raw.slice(-2);
      case '3Y': return raw.slice(-3);
      case '5Y': 
      case '10Y':
      default: return raw;
    }
  }

  static calculateYoY(currentVal: number, previousVal: number): { percentFormatted: string; isPositive: boolean; } {
    if (!previousVal || previousVal === 0) return { percentFormatted: 'N/A', isPositive: true };
    const delta = ((currentVal - previousVal) / Math.abs(previousVal)) * 100;
    const isPositive = delta >= 0;
    return { percentFormatted: `${isPositive ? '+' : ''}${delta.toFixed(1)}%`, isPositive };
  }
}
