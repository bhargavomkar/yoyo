// ============================================================
// FARO — Financial Modeling Prep Market Data Provider
// ============================================================
// Real provider for stock quotes and historical prices using FMP API.
// https://financialmodelingprep.com/developer/docs
// ============================================================

import {
  MarketDataProvider,
} from '../interfaces';
import {
  NormalizedMarketQuote,
  HistoricalPriceData,
  HistoricalPricePoint,
  HistoricalRange,
  DataSource,
  DataSourceStatus,
  DataFreshness,
} from '@/types/dataLayer';
import { DATA_MODE } from '@/config/dataConfig';

// FMP API endpoints
const FMP_API_BASE = 'https://financialmodelingprep.com/api/v3';

// FMP Historical Range mapping
const RANGE_TO_DAYS: Record<HistoricalRange, number> = {
  '1D': 1,
  '1W': 5,
  '1M': 22,
  '3M': 66,
  '6M': 132,
  '1Y': 252,
  '3Y': 756,
  '5Y': 1260,
  '10Y': 2520,
};

// Quote data source
const marketDataSource = (ticker: string, metric: string): DataSource => ({
  id: `fmp-mkt-${ticker}-${metric}-${Date.now()}`,
  provider: 'fmp',
  sourceType: 'market_data',
  retrievedAt: new Date().toISOString(),
  entity: ticker,
  metric,
  confidence: 0.95,
  status: 'verified',
  isDemo: false,
});

// ---- Helper Functions ----

function normalizeRange(range: HistoricalRange): string {
  const days = RANGE_TO_DAYS[range];
  if (days === 1) return '1D';
  if (days === 5) return '5D';
  if (days === 30) return '1M';
  if (days === 90) return '3M';
  if (days === 180) return '6M';
  if (days === 365) return '1Y';
  if (days === 1095) return '3Y';
  if (days === 1825) return '5Y';
  return '10Y';
}

// ---- Provider Implementation ----

export class FmpMarketDataProvider implements MarketDataProvider {
  readonly providerId = 'fmp-market';
  readonly providerName = 'Financial Modeling Prep (Market Data)';
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

  private async fetchFmp<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
    const apiKey = this.getApiKey();
    const url = new URL(`${FMP_API_BASE}${endpoint}`);
    url.searchParams.set('apikey', apiKey);
    
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, value);
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
      // Use a lightweight endpoint for health check
      await this.fetchFmp<string>('/favicon.ico');
      const latencyMs = Date.now() - startTime;
      return { ok: true, latencyMs };
    } catch {
      return { ok: false, latencyMs: -1 };
    }
  }

  async getQuote(ticker: string): Promise<NormalizedMarketQuote | null> {
    try {
      const data = await this.fetchFmp<any[]>(`/quote/${ticker.toUpperCase()}`);

      if (!data || data.length === 0) {
        return null;
      }

      const quote = data[0];

      // Build the quote with FMP data
      return {
        companyId: ticker.toLowerCase(),
        ticker: ticker.toUpperCase(),
        exchange: quote.exchange || 'NASDAQ',
        price: {
          value: quote.price,
          originalValue: quote.price,
          currency: quote.currency || 'USD',
          source: marketDataSource(ticker.toUpperCase(), 'price'),
          freshness: 'live',
          lastUpdated: quote.timestamp ? new Date(quote.timestamp * 1000).toISOString() : new Date().toISOString(),
        },
        open: {
          value: quote.open,
          originalValue: quote.open,
          currency: quote.currency || 'USD',
          source: marketDataSource(ticker.toUpperCase(), 'open'),
          freshness: 'live',
          lastUpdated: new Date().toISOString(),
        },
        high: {
          value: quote.dayHigh,
          originalValue: quote.dayHigh,
          currency: quote.currency || 'USD',
          source: marketDataSource(ticker.toUpperCase(), 'high'),
          freshness: 'live',
          lastUpdated: new Date().toISOString(),
        },
        low: {
          value: quote.dayLow,
          originalValue: quote.dayLow,
          currency: quote.currency || 'USD',
          source: marketDataSource(ticker.toUpperCase(), 'low'),
          freshness: 'live',
          lastUpdated: new Date().toISOString(),
        },
        volume: {
          value: quote.volume,
          originalValue: quote.volume,
          unit: 'shares',
          source: marketDataSource(ticker.toUpperCase(), 'volume'),
          freshness: 'live',
          lastUpdated: new Date().toISOString(),
        },
        marketCap: {
          value: quote.marketCap,
          originalValue: quote.marketCap,
          currency: quote.currency || 'USD',
          source: marketDataSource(ticker.toUpperCase(), 'market_cap'),
          freshness: 'current',
          lastUpdated: new Date().toISOString(),
        },
        week52High: {
          value: quote.yearHigh,
          originalValue: quote.yearHigh,
          currency: quote.currency || 'USD',
          source: marketDataSource(ticker.toUpperCase(), '52w_high'),
          freshness: 'current',
          lastUpdated: new Date().toISOString(),
        },
        week52Low: {
          value: quote.yearLow,
          originalValue: quote.yearLow,
          currency: quote.currency || 'USD',
          source: marketDataSource(ticker.toUpperCase(), '52w_low'),
          freshness: 'current',
          lastUpdated: new Date().toISOString(),
        },
        previousClose: {
          value: quote.previousClose,
          originalValue: quote.previousClose,
          currency: quote.currency || 'USD',
          source: marketDataSource(ticker.toUpperCase(), 'prev_close'),
          freshness: 'current',
          lastUpdated: new Date().toISOString(),
        },
        change: quote.change,
        changePercent: quote.changesPercentage,
        currency: quote.currency || 'USD',
        lastUpdated: new Date().toISOString(),
        freshness: 'live',
      };
    } catch (error) {
      console.error(`FMP Market Provider - Error getting quote for ${ticker}:`, error);
      throw error;
    }
  }

  async getBatchQuotes(tickers: string[]): Promise<NormalizedMarketQuote[]> {
    const results: NormalizedMarketQuote[] = [];
    
    for (const ticker of tickers) {
      try {
        const quote = await this.getQuote(ticker);
        if (quote) {
          results.push(quote);
        }
      } catch (error) {
        console.error(`FMP Market Provider - Failed to fetch ${ticker}:`, error);
        // Continue with other tickers even if one fails
      }
    }
    
    return results;
  }

  async getHistoricalPrices(ticker: string, range: HistoricalRange): Promise<HistoricalPriceData | null> {
    try {
      const days = RANGE_TO_DAYS[range];
      if (!days) {
        return null;
      }

      const data = await this.fetchFmp<any>(`/historical-price-full/${ticker.toUpperCase()}`, {
        timeseries: String(days),
      });

      if (!data?.historical || data.historical.length === 0) {
        return null;
      }

      // Sort by date ascending (FMP returns descending)
      const sortedPrices = [...data.historical].sort((a, b) => 
        new Date(a.date).getTime() - new Date(b.date).getTime()
      );

      const prices: HistoricalPricePoint[] = sortedPrices.map((point: any) => ({
        date: point.date,
        open: point.open,
        high: point.high,
        low: point.low,
        close: point.close,
        adjustedClose: point.adjClose || point.close,
        volume: point.volume,
      }));

      return {
        companyId: ticker.toLowerCase(),
        ticker: ticker.toUpperCase(),
        range,
        currency: 'USD',
        prices,
        source: {
          id: `fmp-history-${ticker}-${range}-${Date.now()}`,
          provider: 'fmp',
          sourceType: 'market_data',
          retrievedAt: new Date().toISOString(),
          entity: ticker,
          metric: 'historical_prices',
          confidence: 0.95,
          status: 'verified',
          isDemo: false,
        },
      };
    } catch (error) {
      console.error(`FMP Market Provider - Error getting historical prices for ${ticker} (${range}):`, error);
      throw error;
    }
  }
}
