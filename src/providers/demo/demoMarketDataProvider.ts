// ============================================================
// FARO — Demo Market Data Provider
// ============================================================
// Provides synthetic market data for development.
// Every value is explicitly marked as demo data.
// ============================================================

import {
  MarketDataProvider,
  type NewsArticle,
} from '../interfaces';
import {
  NormalizedMarketQuote,
  HistoricalPriceData,
  HistoricalPricePoint,
  HistoricalRange,
  DataSource,
  DataPoint,
} from '@/types/dataLayer';

const demoSource = (metric: string, entity: string): DataSource => ({
  id: `demo-mkt-${entity}-${metric}`,
  provider: 'demo',
  sourceType: 'demo_synthetic',
  retrievedAt: new Date().toISOString(),
  entity,
  metric,
  confidence: 0,
  status: 'demo',
  isDemo: true,
});

const demoDataPoint = (value: number, metric: string, entity: string): DataPoint<number> => ({
  value,
  source: demoSource(metric, entity),
  freshness: 'demo',
  lastUpdated: new Date().toISOString(),
});

// ---- Demo Quotes ----

const DEMO_QUOTES: Record<string, Omit<NormalizedMarketQuote, 'price' | 'open' | 'high' | 'low' | 'volume' | 'marketCap' | 'week52High' | 'week52Low' | 'previousClose'> & { _p: number; _o: number; _h: number; _l: number; _v: number; _mc: number; _52h: number; _52l: number; _pc: number }> = {
  NVDA: { companyId: 'nvda', ticker: 'NVDA', exchange: 'NASDAQ', change: 4.82, changePercent: 3.21, currency: 'USD', lastUpdated: new Date().toISOString(), freshness: 'demo', _p: 154.72, _o: 150.10, _h: 156.20, _l: 149.85, _v: 312_000_000, _mc: 3_790_000_000_000, _52h: 174.72, _52l: 47.32, _pc: 149.90 },
  AAPL: { companyId: 'aapl', ticker: 'AAPL', exchange: 'NASDAQ', change: -1.23, changePercent: -0.54, currency: 'USD', lastUpdated: new Date().toISOString(), freshness: 'demo', _p: 227.35, _o: 228.50, _h: 229.10, _l: 226.80, _v: 54_000_000, _mc: 3_480_000_000_000, _52h: 237.49, _52l: 164.08, _pc: 228.58 },
  MSFT: { companyId: 'msft', ticker: 'MSFT', exchange: 'NASDAQ', change: 2.15, changePercent: 0.49, currency: 'USD', lastUpdated: new Date().toISOString(), freshness: 'demo', _p: 442.57, _o: 440.20, _h: 443.90, _l: 439.10, _v: 22_000_000, _mc: 3_290_000_000_000, _52h: 468.35, _52l: 309.45, _pc: 440.42 },
  GOOGL: { companyId: 'googl', ticker: 'GOOGL', exchange: 'NASDAQ', change: 1.87, changePercent: 1.05, currency: 'USD', lastUpdated: new Date().toISOString(), freshness: 'demo', _p: 180.22, _o: 178.50, _h: 181.00, _l: 177.90, _v: 28_000_000, _mc: 2_220_000_000_000, _52h: 193.31, _52l: 130.67, _pc: 178.35 },
  AMZN: { companyId: 'amzn', ticker: 'AMZN', exchange: 'NASDAQ', change: 3.42, changePercent: 1.72, currency: 'USD', lastUpdated: new Date().toISOString(), freshness: 'demo', _p: 201.65, _o: 198.30, _h: 202.40, _l: 197.80, _v: 62_000_000, _mc: 2_110_000_000_000, _52h: 214.20, _52l: 151.61, _pc: 198.23 },
  TSLA: { companyId: 'tsla', ticker: 'TSLA', exchange: 'NASDAQ', change: -5.12, changePercent: -1.89, currency: 'USD', lastUpdated: new Date().toISOString(), freshness: 'demo', _p: 265.30, _o: 270.00, _h: 271.50, _l: 263.80, _v: 118_000_000, _mc: 849_000_000_000, _52h: 358.64, _52l: 138.80, _pc: 270.42 },
};

function buildQuote(raw: typeof DEMO_QUOTES['NVDA']): NormalizedMarketQuote {
  const t = raw.ticker;
  return {
    companyId: raw.companyId,
    ticker: t,
    exchange: raw.exchange,
    price: demoDataPoint(raw._p, 'price', t),
    open: demoDataPoint(raw._o, 'open', t),
    high: demoDataPoint(raw._h, 'high', t),
    low: demoDataPoint(raw._l, 'low', t),
    volume: demoDataPoint(raw._v, 'volume', t),
    marketCap: demoDataPoint(raw._mc, 'market_cap', t),
    week52High: demoDataPoint(raw._52h, '52w_high', t),
    week52Low: demoDataPoint(raw._52l, '52w_low', t),
    previousClose: demoDataPoint(raw._pc, 'prev_close', t),
    change: raw.change,
    changePercent: raw.changePercent,
    currency: raw.currency,
    lastUpdated: raw.lastUpdated,
    freshness: 'demo',
  };
}

function generateDemoHistory(ticker: string, range: HistoricalRange): HistoricalPriceData {
  const basePrice = DEMO_QUOTES[ticker]?._p ?? 100;
  const rangeMap: Record<HistoricalRange, number> = { '1D': 1, '1W': 5, '1M': 22, '3M': 66, '6M': 132, '1Y': 252, '3Y': 756, '5Y': 1260, '10Y': 2520 };
  const days = rangeMap[range] || 252;
  const prices: HistoricalPricePoint[] = [];
  const now = Date.now();
  for (let i = days; i >= 0; i--) {
    const date = new Date(now - i * 86400000);
    const drift = (1 - i / days) * 0.3 + 0.7;
    const noise = 1 + (Math.sin(i * 0.2) * 0.03 + (Math.random() - 0.5) * 0.02);
    const close = +(basePrice * drift * noise).toFixed(2);
    const high = +(close * (1 + Math.random() * 0.02)).toFixed(2);
    const low = +(close * (1 - Math.random() * 0.02)).toFixed(2);
    const open = +(close * (1 + (Math.random() - 0.5) * 0.015)).toFixed(2);
    prices.push({
      date: date.toISOString().split('T')[0],
      open, high, low, close, adjustedClose: close,
      volume: Math.floor(20_000_000 + Math.random() * 80_000_000),
    });
  }
  return {
    companyId: DEMO_QUOTES[ticker]?.companyId ?? ticker.toLowerCase(),
    ticker,
    range,
    currency: 'USD',
    prices,
    source: demoSource('historical_prices', ticker),
  };
}

// ---- Provider Implementation ----

export class DemoMarketDataProvider implements MarketDataProvider {
  readonly providerId = 'demo-market';
  readonly providerName = 'Demo Market Data';
  readonly isDemo = true;

  async ping() {
    return { ok: true, latencyMs: 1 };
  }

  async getQuote(ticker: string): Promise<NormalizedMarketQuote | null> {
    const raw = DEMO_QUOTES[ticker.toUpperCase()];
    if (!raw) return null;
    return buildQuote(raw);
  }

  async getBatchQuotes(tickers: string[]): Promise<NormalizedMarketQuote[]> {
    const results: NormalizedMarketQuote[] = [];
    for (const t of tickers) {
      const q = await this.getQuote(t);
      if (q) results.push(q);
    }
    return results;
  }

  async getHistoricalPrices(ticker: string, range: HistoricalRange): Promise<HistoricalPriceData | null> {
    return generateDemoHistory(ticker.toUpperCase(), range);
  }
}
