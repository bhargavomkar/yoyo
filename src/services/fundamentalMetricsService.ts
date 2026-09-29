// ============================================================
// FARO — Fundamental Metrics Service
// ============================================================
// Centralized calculation of margins, ratios, and valuation
// multiples. Every calculation exposes its formula and input
// data so the evidence graph can trace conclusions.
// ============================================================

import {
  FundamentalMetricCalculation,
  NormalizedFinancialStatement,
  NormalizedMarketQuote,
  DataSource,
} from '@/types/dataLayer';
import { ProviderRegistry } from '@/providers/providerRegistry';

const demoCalcSource = (metric: string, entity: string): DataSource => ({
  id: `calc-${entity}-${metric}`,
  provider: 'faro-engine',
  sourceType: 'calculation',
  retrievedAt: new Date().toISOString(),
  entity,
  metric,
  confidence: 0.95,
  status: 'derived',
  isDemo: true,
});

function getMetricValue(statement: NormalizedFinancialStatement, key: string): number | null {
  const metric = statement.metrics.find(m => m.key === key);
  return metric ? metric.value : null;
}

function fmt(value: number, unit: string): string {
  if (unit === '%') return `${(value * 100).toFixed(2)}%`;
  if (unit === 'x') return `${value.toFixed(2)}x`;
  if (unit === '$') {
    const abs = Math.abs(value);
    if (abs >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
    if (abs >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
    if (abs >= 1e6) return `$${(value / 1e6).toFixed(1)}M`;
    return `$${value.toFixed(2)}`;
  }
  return value.toFixed(2);
}

class FundamentalMetricsServiceImpl {

  calculateFromStatements(
    companyId: string,
    incomeStatement: NormalizedFinancialStatement,
    balanceSheet: NormalizedFinancialStatement,
    cashFlowStatement: NormalizedFinancialStatement,
    quote?: NormalizedMarketQuote,
    priorIncomeStatement?: NormalizedFinancialStatement,
  ): FundamentalMetricCalculation[] {
    const metrics: FundamentalMetricCalculation[] = [];
    const now = new Date().toISOString();

    const revenue = getMetricValue(incomeStatement, 'revenue');
    const grossProfit = getMetricValue(incomeStatement, 'gross_profit');
    const operatingIncome = getMetricValue(incomeStatement, 'operating_income');
    const netIncome = getMetricValue(incomeStatement, 'net_income');
    const ebitda = getMetricValue(incomeStatement, 'ebitda');
    const fcf = getMetricValue(cashFlowStatement, 'free_cash_flow');
    const equity = getMetricValue(balanceSheet, 'equity');
    const totalAssets = getMetricValue(balanceSheet, 'total_assets');
    const totalDebt = getMetricValue(balanceSheet, 'total_debt');
    const cash = getMetricValue(balanceSheet, 'cash');
    const prevRevenue = priorIncomeStatement ? getMetricValue(priorIncomeStatement, 'revenue') : null;

    // Revenue Growth
    if (revenue && prevRevenue && prevRevenue !== 0) {
      const growth = (revenue - prevRevenue) / prevRevenue;
      metrics.push({
        key: 'revenue_growth', label: 'Revenue Growth', value: growth, formattedValue: fmt(growth, '%'), unit: '%',
        formula: '(Current Revenue - Prior Revenue) / Prior Revenue',
        inputData: [
          { label: 'Current Revenue', value: fmt(revenue, '$'), source: incomeStatement.source.status },
          { label: 'Prior Revenue', value: fmt(prevRevenue, '$'), source: priorIncomeStatement!.source.status },
        ],
        source: demoCalcSource('revenue_growth', companyId), calculatedAt: now,
      });
    }

    // Gross Margin
    if (grossProfit && revenue && revenue !== 0) {
      const margin = grossProfit / revenue;
      metrics.push({
        key: 'gross_margin', label: 'Gross Margin', value: margin, formattedValue: fmt(margin, '%'), unit: '%',
        formula: 'Gross Profit / Revenue',
        inputData: [
          { label: 'Gross Profit', value: fmt(grossProfit, '$'), source: incomeStatement.source.status },
          { label: 'Revenue', value: fmt(revenue, '$'), source: incomeStatement.source.status },
        ],
        source: demoCalcSource('gross_margin', companyId), calculatedAt: now,
      });
    }

    // Operating Margin
    if (operatingIncome && revenue && revenue !== 0) {
      const margin = operatingIncome / revenue;
      metrics.push({
        key: 'operating_margin', label: 'Operating Margin', value: margin, formattedValue: fmt(margin, '%'), unit: '%',
        formula: 'Operating Income / Revenue',
        inputData: [
          { label: 'Operating Income', value: fmt(operatingIncome, '$'), source: incomeStatement.source.status },
          { label: 'Revenue', value: fmt(revenue, '$'), source: incomeStatement.source.status },
        ],
        source: demoCalcSource('operating_margin', companyId), calculatedAt: now,
      });
    }

    // Net Margin
    if (netIncome && revenue && revenue !== 0) {
      const margin = netIncome / revenue;
      metrics.push({
        key: 'net_margin', label: 'Net Margin', value: margin, formattedValue: fmt(margin, '%'), unit: '%',
        formula: 'Net Income / Revenue',
        inputData: [
          { label: 'Net Income', value: fmt(netIncome, '$'), source: incomeStatement.source.status },
          { label: 'Revenue', value: fmt(revenue, '$'), source: incomeStatement.source.status },
        ],
        source: demoCalcSource('net_margin', companyId), calculatedAt: now,
      });
    }

    // EBITDA Margin
    if (ebitda && revenue && revenue !== 0) {
      const margin = ebitda / revenue;
      metrics.push({
        key: 'ebitda_margin', label: 'EBITDA Margin', value: margin, formattedValue: fmt(margin, '%'), unit: '%',
        formula: 'EBITDA / Revenue',
        inputData: [
          { label: 'EBITDA', value: fmt(ebitda, '$'), source: incomeStatement.source.status },
          { label: 'Revenue', value: fmt(revenue, '$'), source: incomeStatement.source.status },
        ],
        source: demoCalcSource('ebitda_margin', companyId), calculatedAt: now,
      });
    }

    // FCF Margin
    if (fcf && revenue && revenue !== 0) {
      const margin = fcf / revenue;
      metrics.push({
        key: 'fcf_margin', label: 'FCF Margin', value: margin, formattedValue: fmt(margin, '%'), unit: '%',
        formula: 'Free Cash Flow / Revenue',
        inputData: [
          { label: 'Free Cash Flow', value: fmt(fcf, '$'), source: cashFlowStatement.source.status },
          { label: 'Revenue', value: fmt(revenue, '$'), source: incomeStatement.source.status },
        ],
        source: demoCalcSource('fcf_margin', companyId), calculatedAt: now,
      });
    }

    // ROE
    if (netIncome && equity && equity !== 0) {
      const roe = netIncome / equity;
      metrics.push({
        key: 'roe', label: 'Return on Equity (ROE)', value: roe, formattedValue: fmt(roe, '%'), unit: '%',
        formula: 'Net Income / Shareholders\' Equity',
        inputData: [
          { label: 'Net Income', value: fmt(netIncome, '$'), source: incomeStatement.source.status },
          { label: 'Equity', value: fmt(equity, '$'), source: balanceSheet.source.status },
        ],
        source: demoCalcSource('roe', companyId), calculatedAt: now,
      });
    }

    // ROIC (simplified: NOPAT / Invested Capital)
    if (operatingIncome && totalDebt !== null && equity) {
      const taxRate = 0.21;
      const nopat = operatingIncome * (1 - taxRate);
      const investedCapital = equity + (totalDebt ?? 0) - (cash ?? 0);
      if (investedCapital !== 0) {
        const roic = nopat / investedCapital;
        metrics.push({
          key: 'roic', label: 'Return on Invested Capital (ROIC)', value: roic, formattedValue: fmt(roic, '%'), unit: '%',
          formula: 'NOPAT / (Equity + Debt - Cash)',
          inputData: [
            { label: 'Operating Income', value: fmt(operatingIncome, '$'), source: incomeStatement.source.status },
            { label: 'Equity', value: fmt(equity, '$'), source: balanceSheet.source.status },
            { label: 'Debt', value: fmt(totalDebt ?? 0, '$'), source: balanceSheet.source.status },
            { label: 'Cash', value: fmt(cash ?? 0, '$'), source: balanceSheet.source.status },
          ],
          source: demoCalcSource('roic', companyId), calculatedAt: now,
        });
      }
    }

    // Debt/EBITDA
    if (totalDebt !== null && ebitda && ebitda !== 0) {
      const ratio = (totalDebt ?? 0) / ebitda;
      metrics.push({
        key: 'debt_to_ebitda', label: 'Debt / EBITDA', value: ratio, formattedValue: fmt(ratio, 'x'), unit: 'x',
        formula: 'Total Debt / EBITDA',
        inputData: [
          { label: 'Total Debt', value: fmt(totalDebt ?? 0, '$'), source: balanceSheet.source.status },
          { label: 'EBITDA', value: fmt(ebitda, '$'), source: incomeStatement.source.status },
        ],
        source: demoCalcSource('debt_to_ebitda', companyId), calculatedAt: now,
      });
    }

    // P/E (requires market quote)
    if (quote && netIncome && netIncome !== 0) {
      const marketCap = quote.marketCap.value;
      const pe = marketCap / netIncome;
      metrics.push({
        key: 'pe_ratio', label: 'Price / Earnings (P/E)', value: pe, formattedValue: fmt(pe, 'x'), unit: 'x',
        formula: 'Market Cap / Net Income',
        inputData: [
          { label: 'Market Cap', value: fmt(marketCap, '$'), source: quote.price.source.status },
          { label: 'Net Income', value: fmt(netIncome, '$'), source: incomeStatement.source.status },
        ],
        source: demoCalcSource('pe_ratio', companyId), calculatedAt: now,
      });
    }

    // EV/Revenue
    if (quote && revenue && revenue !== 0) {
      const ev = quote.marketCap.value + (totalDebt ?? 0) - (cash ?? 0);
      const evRev = ev / revenue;
      metrics.push({
        key: 'ev_to_revenue', label: 'EV / Revenue', value: evRev, formattedValue: fmt(evRev, 'x'), unit: 'x',
        formula: '(Market Cap + Debt - Cash) / Revenue',
        inputData: [
          { label: 'Market Cap', value: fmt(quote.marketCap.value, '$'), source: quote.price.source.status },
          { label: 'Revenue', value: fmt(revenue, '$'), source: incomeStatement.source.status },
        ],
        source: demoCalcSource('ev_to_revenue', companyId), calculatedAt: now,
      });
    }

    // EV/EBITDA
    if (quote && ebitda && ebitda !== 0) {
      const ev = quote.marketCap.value + (totalDebt ?? 0) - (cash ?? 0);
      const evEbitda = ev / ebitda;
      metrics.push({
        key: 'ev_to_ebitda', label: 'EV / EBITDA', value: evEbitda, formattedValue: fmt(evEbitda, 'x'), unit: 'x',
        formula: '(Market Cap + Debt - Cash) / EBITDA',
        inputData: [
          { label: 'Enterprise Value', value: fmt(ev, '$'), source: quote.price.source.status },
          { label: 'EBITDA', value: fmt(ebitda, '$'), source: incomeStatement.source.status },
        ],
        source: demoCalcSource('ev_to_ebitda', companyId), calculatedAt: now,
      });
    }

    // P/FCF
    if (quote && fcf && fcf !== 0) {
      const pFcf = quote.marketCap.value / fcf;
      metrics.push({
        key: 'p_to_fcf', label: 'Price / FCF', value: pFcf, formattedValue: fmt(pFcf, 'x'), unit: 'x',
        formula: 'Market Cap / Free Cash Flow',
        inputData: [
          { label: 'Market Cap', value: fmt(quote.marketCap.value, '$'), source: quote.price.source.status },
          { label: 'Free Cash Flow', value: fmt(fcf, '$'), source: cashFlowStatement.source.status },
        ],
        source: demoCalcSource('p_to_fcf', companyId), calculatedAt: now,
      });
    }

    return metrics;
  }

  // Convenience: compute all from provider data
  async computeForCompany(companyId: string): Promise<FundamentalMetricCalculation[]> {
    const finProvider = ProviderRegistry.getFinancialProvider();
    const mktProvider = ProviderRegistry.getMarketProvider();
    const companyProvider = ProviderRegistry.getCompanyProvider();

    const company = await companyProvider.getCompany(companyId);
    if (!company) return [];

    const statements = await finProvider.getFinancialStatements(companyId, 'annual', 2);
    if (statements.length === 0) return [];

    const is = statements.find(s => s.statementType === 'income_statement');
    const bs = statements.find(s => s.statementType === 'balance_sheet');
    const cf = statements.find(s => s.statementType === 'cash_flow');
    if (!is || !bs || !cf) return [];

    // Find prior income statement
    const priorIS = statements.filter(s => s.statementType === 'income_statement' && s.period !== is.period)[0];

    let quote: NormalizedMarketQuote | undefined;
    if (company.ticker) {
      const q = await mktProvider.getQuote(company.ticker);
      if (q) quote = q;
    }

    return this.calculateFromStatements(companyId, is, bs, cf, quote, priorIS);
  }
}

export const FundamentalMetricsService = new FundamentalMetricsServiceImpl();
