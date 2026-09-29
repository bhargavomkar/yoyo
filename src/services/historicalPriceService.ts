// ============================================================
// FARO — Historical Price Service
// ============================================================
// Centralized calculations for returns, volatility, beta,
// correlation, and drawdown. UI components should NOT
// duplicate these calculations.
// ============================================================

import { HistoricalPricePoint, HistoricalPriceData, HistoricalRange } from '@/types/dataLayer';
import { ProviderRegistry } from '@/providers/providerRegistry';

class HistoricalPriceServiceImpl {

  async getPriceHistory(ticker: string, range: HistoricalRange): Promise<HistoricalPriceData | null> {
    const provider = ProviderRegistry.getMarketProvider();
    return provider.getHistoricalPrices(ticker, range);
  }

  // ---- Return Calculations ----

  calculateReturns(prices: HistoricalPricePoint[]): number[] {
    if (prices.length < 2) return [];
    const returns: number[] = [];
    for (let i = 1; i < prices.length; i++) {
      const prev = prices[i - 1].adjustedClose;
      const curr = prices[i].adjustedClose;
      if (prev !== 0) {
        returns.push((curr - prev) / prev);
      }
    }
    return returns;
  }

  calculateTotalReturn(prices: HistoricalPricePoint[]): number {
    if (prices.length < 2) return 0;
    const first = prices[0].adjustedClose;
    const last = prices[prices.length - 1].adjustedClose;
    if (first === 0) return 0;
    return (last - first) / first;
  }

  calculateAnnualizedReturn(prices: HistoricalPricePoint[]): number {
    if (prices.length < 2) return 0;
    const totalReturn = this.calculateTotalReturn(prices);
    const days = prices.length;
    const years = days / 252; // Trading days
    if (years <= 0) return 0;
    return Math.pow(1 + totalReturn, 1 / years) - 1;
  }

  // ---- Volatility ----

  calculateVolatility(prices: HistoricalPricePoint[], annualize = true): number {
    const returns = this.calculateReturns(prices);
    if (returns.length < 2) return 0;
    const mean = returns.reduce((a, b) => a + b, 0) / returns.length;
    const variance = returns.reduce((sum, r) => sum + Math.pow(r - mean, 2), 0) / (returns.length - 1);
    const dailyVol = Math.sqrt(variance);
    return annualize ? dailyVol * Math.sqrt(252) : dailyVol;
  }

  // ---- Drawdown ----

  calculateDrawdown(prices: HistoricalPricePoint[]): { maxDrawdown: number; currentDrawdown: number; drawdownSeries: number[] } {
    if (prices.length === 0) return { maxDrawdown: 0, currentDrawdown: 0, drawdownSeries: [] };
    let peak = prices[0].adjustedClose;
    let maxDD = 0;
    const series: number[] = [];

    for (const p of prices) {
      if (p.adjustedClose > peak) peak = p.adjustedClose;
      const dd = peak > 0 ? (p.adjustedClose - peak) / peak : 0;
      series.push(dd);
      if (dd < maxDD) maxDD = dd;
    }

    return {
      maxDrawdown: maxDD,
      currentDrawdown: series[series.length - 1],
      drawdownSeries: series,
    };
  }

  // ---- Correlation ----

  calculateCorrelation(pricesA: HistoricalPricePoint[], pricesB: HistoricalPricePoint[]): number {
    const returnsA = this.calculateReturns(pricesA);
    const returnsB = this.calculateReturns(pricesB);
    const n = Math.min(returnsA.length, returnsB.length);
    if (n < 2) return 0;

    const a = returnsA.slice(-n);
    const b = returnsB.slice(-n);
    const meanA = a.reduce((s, v) => s + v, 0) / n;
    const meanB = b.reduce((s, v) => s + v, 0) / n;

    let cov = 0, varA = 0, varB = 0;
    for (let i = 0; i < n; i++) {
      const da = a[i] - meanA;
      const db = b[i] - meanB;
      cov += da * db;
      varA += da * da;
      varB += db * db;
    }

    const denom = Math.sqrt(varA * varB);
    return denom === 0 ? 0 : cov / denom;
  }

  // ---- Beta ----

  calculateBeta(stockPrices: HistoricalPricePoint[], benchmarkPrices: HistoricalPricePoint[]): number {
    const stockReturns = this.calculateReturns(stockPrices);
    const benchReturns = this.calculateReturns(benchmarkPrices);
    const n = Math.min(stockReturns.length, benchReturns.length);
    if (n < 2) return 1;

    const s = stockReturns.slice(-n);
    const b = benchReturns.slice(-n);
    const meanS = s.reduce((a, v) => a + v, 0) / n;
    const meanB = b.reduce((a, v) => a + v, 0) / n;

    let cov = 0, varB = 0;
    for (let i = 0; i < n; i++) {
      const ds = s[i] - meanS;
      const db = b[i] - meanB;
      cov += ds * db;
      varB += db * db;
    }

    return varB === 0 ? 1 : cov / varB;
  }

  // ---- Sharpe Ratio ----

  calculateSharpeRatio(prices: HistoricalPricePoint[], riskFreeRate = 0.05): number {
    const annReturn = this.calculateAnnualizedReturn(prices);
    const vol = this.calculateVolatility(prices);
    return vol === 0 ? 0 : (annReturn - riskFreeRate) / vol;
  }

  // ---- Sortino Ratio ----

  calculateSortinoRatio(prices: HistoricalPricePoint[], riskFreeRate = 0.05): number {
    const returns = this.calculateReturns(prices);
    if (returns.length < 2) return 0;
    const annReturn = this.calculateAnnualizedReturn(prices);
    const negativeReturns = returns.filter(r => r < 0);
    if (negativeReturns.length === 0) return annReturn > riskFreeRate ? Infinity : 0;
    const downVar = negativeReturns.reduce((sum, r) => sum + r * r, 0) / negativeReturns.length;
    const downDev = Math.sqrt(downVar) * Math.sqrt(252);
    return downDev === 0 ? 0 : (annReturn - riskFreeRate) / downDev;
  }

  // ---- Value at Risk (parametric) ----

  calculateVaR(prices: HistoricalPricePoint[], confidenceLevel = 0.95, holdingPeriodDays = 1): number {
    const vol = this.calculateVolatility(prices, false);
    const zScore = confidenceLevel === 0.99 ? 2.326 : confidenceLevel === 0.95 ? 1.645 : 1.282;
    return vol * zScore * Math.sqrt(holdingPeriodDays);
  }
}

export const HistoricalPriceService = new HistoricalPriceServiceImpl();
