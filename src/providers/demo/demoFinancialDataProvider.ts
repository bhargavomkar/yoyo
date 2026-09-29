// ============================================================
// FARO — Demo Financial Data Provider
// ============================================================

import { FinancialDataProvider } from '../interfaces';
import {
  NormalizedFinancialStatement,
  NormalizedMetric,
  DataSource,
  PeriodType,
} from '@/types/dataLayer';

const demoSource = (metric: string, entity: string, period: string): DataSource => ({
  id: `demo-fin-${entity}-${metric}-${period}`,
  provider: 'demo',
  sourceType: 'demo_synthetic',
  retrievedAt: new Date().toISOString(),
  dataPeriod: period,
  entity,
  metric,
  confidence: 0,
  status: 'demo',
  isDemo: true,
});

const m = (key: string, label: string, value: number, entity: string, period: string, formula?: string): NormalizedMetric => ({
  key,
  label,
  value,
  formattedValue: formatFinancialValue(value),
  currency: 'USD',
  source: demoSource(key, entity, period),
  formula,
});

function formatFinancialValue(v: number): string {
  const abs = Math.abs(v);
  if (abs >= 1e12) return `$${(v / 1e12).toFixed(2)}T`;
  if (abs >= 1e9) return `$${(v / 1e9).toFixed(2)}B`;
  if (abs >= 1e6) return `$${(v / 1e6).toFixed(1)}M`;
  if (abs >= 1e3) return `$${(v / 1e3).toFixed(1)}K`;
  return `$${v.toFixed(2)}`;
}

// ---- NVDA Demo Financials ----

const NVDA_INCOME: Record<string, Record<string, number>> = {
  FY2025: { revenue: 130_497_000_000, cogs: 29_168_000_000, grossProfit: 101_329_000_000, operatingExpenses: 13_351_000_000, operatingIncome: 87_978_000_000, interestExpense: 246_000_000, netIncome: 72_880_000_000, eps: 2.94, ebitda: 90_234_000_000 },
  FY2024: { revenue: 60_922_000_000, cogs: 16_621_000_000, grossProfit: 44_301_000_000, operatingExpenses: 11_329_000_000, operatingIncome: 32_972_000_000, interestExpense: 257_000_000, netIncome: 29_760_000_000, eps: 1.21, ebitda: 35_180_000_000 },
  FY2023: { revenue: 26_974_000_000, cogs: 11_618_000_000, grossProfit: 15_356_000_000, operatingExpenses: 7_553_000_000, operatingIncome: 7_803_000_000, interestExpense: 257_000_000, netIncome: 4_368_000_000, eps: 0.18, ebitda: 9_050_000_000 },
};

const NVDA_BALANCE: Record<string, Record<string, number>> = {
  FY2025: { cash: 43_174_000_000, totalAssets: 112_198_000_000, totalDebt: 8_462_000_000, totalLiabilities: 33_152_000_000, equity: 79_046_000_000, accountsReceivable: 17_483_000_000, inventory: 9_366_000_000, ppe: 5_768_000_000 },
  FY2024: { cash: 25_984_000_000, totalAssets: 65_728_000_000, totalDebt: 8_459_000_000, totalLiabilities: 22_750_000_000, equity: 42_978_000_000, accountsReceivable: 9_999_000_000, inventory: 5_282_000_000, ppe: 3_914_000_000 },
};

const NVDA_CASHFLOW: Record<string, Record<string, number>> = {
  FY2025: { operatingCashFlow: 64_089_000_000, capex: -3_233_000_000, freeCashFlow: 60_856_000_000, financingCashFlow: -30_158_000_000 },
  FY2024: { operatingCashFlow: 28_090_000_000, capex: -1_069_000_000, freeCashFlow: 27_021_000_000, financingCashFlow: -12_831_000_000 },
};

function buildIncomeStatement(companyId: string, period: string, data: Record<string, number>): NormalizedFinancialStatement {
  return {
    id: `${companyId}-is-${period}`,
    companyId,
    statementType: 'income_statement',
    period,
    periodType: 'annual',
    currency: 'USD',
    metrics: [
      m('revenue', 'Revenue', data.revenue, companyId, period),
      m('cogs', 'Cost of Revenue', data.cogs, companyId, period),
      m('gross_profit', 'Gross Profit', data.grossProfit, companyId, period, 'revenue - cogs'),
      m('operating_expenses', 'Operating Expenses', data.operatingExpenses, companyId, period),
      m('operating_income', 'Operating Income', data.operatingIncome, companyId, period, 'gross_profit - operating_expenses'),
      m('interest_expense', 'Interest Expense', data.interestExpense, companyId, period),
      m('net_income', 'Net Income', data.netIncome, companyId, period),
      m('eps', 'Earnings Per Share', data.eps, companyId, period),
      m('ebitda', 'EBITDA', data.ebitda, companyId, period),
    ],
    source: demoSource('income_statement', companyId, period),
  };
}

function buildBalanceSheet(companyId: string, period: string, data: Record<string, number>): NormalizedFinancialStatement {
  return {
    id: `${companyId}-bs-${period}`,
    companyId,
    statementType: 'balance_sheet',
    period,
    periodType: 'annual',
    currency: 'USD',
    metrics: [
      m('cash', 'Cash & Equivalents', data.cash, companyId, period),
      m('accounts_receivable', 'Accounts Receivable', data.accountsReceivable, companyId, period),
      m('inventory', 'Inventory', data.inventory, companyId, period),
      m('ppe', 'Property, Plant & Equipment', data.ppe, companyId, period),
      m('total_assets', 'Total Assets', data.totalAssets, companyId, period),
      m('total_debt', 'Total Debt', data.totalDebt, companyId, period),
      m('total_liabilities', 'Total Liabilities', data.totalLiabilities, companyId, period),
      m('equity', 'Shareholders\' Equity', data.equity, companyId, period, 'total_assets - total_liabilities'),
    ],
    source: demoSource('balance_sheet', companyId, period),
  };
}

function buildCashFlowStatement(companyId: string, period: string, data: Record<string, number>): NormalizedFinancialStatement {
  return {
    id: `${companyId}-cf-${period}`,
    companyId,
    statementType: 'cash_flow',
    period,
    periodType: 'annual',
    currency: 'USD',
    metrics: [
      m('operating_cash_flow', 'Operating Cash Flow', data.operatingCashFlow, companyId, period),
      m('capex', 'Capital Expenditures', data.capex, companyId, period),
      m('free_cash_flow', 'Free Cash Flow', data.freeCashFlow, companyId, period, 'operating_cash_flow + capex'),
      m('financing_cash_flow', 'Financing Cash Flow', data.financingCashFlow, companyId, period),
    ],
    source: demoSource('cash_flow', companyId, period),
  };
}

export class DemoFinancialDataProvider implements FinancialDataProvider {
  readonly providerId = 'demo-financial';
  readonly providerName = 'Demo Financial Data';
  readonly isDemo = true;

  async ping() {
    return { ok: true, latencyMs: 1 };
  }

  async getIncomeStatement(companyId: string, period: string): Promise<NormalizedFinancialStatement | null> {
    if (companyId === 'nvda' || companyId === 'NVDA') {
      const data = NVDA_INCOME[period];
      if (!data) return null;
      return buildIncomeStatement('nvda', period, data);
    }
    return null;
  }

  async getBalanceSheet(companyId: string, period: string): Promise<NormalizedFinancialStatement | null> {
    if (companyId === 'nvda' || companyId === 'NVDA') {
      const data = NVDA_BALANCE[period];
      if (!data) return null;
      return buildBalanceSheet('nvda', period, data);
    }
    return null;
  }

  async getCashFlowStatement(companyId: string, period: string): Promise<NormalizedFinancialStatement | null> {
    if (companyId === 'nvda' || companyId === 'NVDA') {
      const data = NVDA_CASHFLOW[period];
      if (!data) return null;
      return buildCashFlowStatement('nvda', period, data);
    }
    return null;
  }

  async getFinancialStatements(companyId: string, periodType: PeriodType, count = 3): Promise<NormalizedFinancialStatement[]> {
    const results: NormalizedFinancialStatement[] = [];
    if (companyId === 'nvda' || companyId === 'NVDA') {
      const periods = Object.keys(NVDA_INCOME).slice(0, count);
      for (const p of periods) {
        const is = await this.getIncomeStatement('nvda', p);
        if (is) results.push(is);
        const bs = await this.getBalanceSheet('nvda', p);
        if (bs) results.push(bs);
        const cf = await this.getCashFlowStatement('nvda', p);
        if (cf) results.push(cf);
      }
    }
    return results;
  }
}
