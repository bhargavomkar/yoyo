// ============================================================
// FARO — Financial Modeling Prep Company Data Provider
// ============================================================
// Real provider for company metadata and search using FMP API.
// https://financialmodelingprep.com/developer/docs
// ============================================================

import {
  CompanyDataProvider,
} from '../interfaces';
import {
  CanonicalCompany,
  DataSource,
  DataSourceStatus,
} from '@/types/dataLayer';
import { DATA_MODE } from '@/config/dataConfig';

// FMP API endpoints
const FMP_API_BASE = 'https://financialmodelingprep.com/api/v3';

// Source factory for company data
const companyDataSource = (companyId: string, metric: string): DataSource => ({
  id: `fmp-comp-${companyId}-${metric}-${Date.now()}`,
  provider: 'fmp',
  sourceType: 'provider_feed',
  retrievedAt: new Date().toISOString(),
  entity: companyId,
  metric,
  confidence: 0.85,
  status: 'verified',
  isDemo: false,
});

// ---- Helper Functions ----

function buildCanonicalCompany(data: any): CanonicalCompany {
  const ticker = data.symbol || data.ticker || data.code || '';
  const logoLetter = ticker ? ticker[0].toUpperCase() : '?';
  
  // Determine sector and industry from available data
  const industry = data.finnishIndustry || data.gicsIndustry || data.industry || 'Unknown';
  const sector = data.finnishSector || data.gicsSector || data.sector || 'Unknown';
  
  return {
    id: ticker.toLowerCase(),
    legalName: data.companyName || data.name || 'Unknown Company',
    displayName: data.companyName || data.name || ticker,
    ticker: ticker,
    exchange: data.exchange || 'NASDAQ',
    isin: data.isin || undefined,
    lei: data.lei || undefined,
    country: data.country || 'United States',
    industry,
    sector,
    currency: data.currency || 'USD',
    isPublic: true,
    website: data.website || undefined,
    description: data.description || 'No description available.',
    logoLetter,
    employees: data.fullTimeEmployees ? `${data.fullTimeEmployees.toLocaleString()}` : undefined,
    founded: data.founded ? parseInt(data.founded) : undefined,
    dataQuality: 'verified',
    dataSources: ['fmp'],
    lastUpdated: new Date().toISOString(),
    isDemo: false,
  };
}

// ---- Provider Implementation ----

export class FmpCompanyDataProvider implements CompanyDataProvider {
  readonly providerId = 'fmp-company';
  readonly providerName = 'Financial Modeling Prep (Company Data)';
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
      await this.fetchFmp<string[]>('/historical/stock_list');
      const latencyMs = Date.now() - startTime;
      return { ok: true, latencyMs };
    } catch {
      return { ok: false, latencyMs: -1 };
    }
  }

  async getCompany(companyId: string): Promise<CanonicalCompany | null> {
    try {
      const data = await this.fetchFmp<any[]>(`/company-price/${companyId.toUpperCase()}`);

      if (!data || data.length === 0) {
        return null;
      }

      return buildCanonicalCompany(data[0]);
    } catch (error) {
      console.error(`FMP Company Provider - Error getting company ${companyId}:`, error);
      throw error;
    }
  }

  async searchCompanies(query: string, limit: number = 10): Promise<CanonicalCompany[]> {
    try {
      // Use FMP's stock list search
      const data = await this.fetchFmp<any[]>(`/stock/list`);
      
      if (!data || !Array.isArray(data)) {
        return [];
      }

      // Filter and rank results
      const queryLower = query.toLowerCase();
      
      const matches = data
        .filter((item: any) => {
          // Check ticker, name, or description
          const ticker = (item.symbol || '').toLowerCase();
          const name = (item.name || '').toLowerCase();
          const description = (item.description || '').toLowerCase();
          
          return ticker.includes(queryLower) || 
                 name.includes(queryLower) || 
                 description.includes(queryLower);
        })
        .slice(0, limit)
        .map((item: any) => buildCanonicalCompany(item));

      return matches;
    } catch (error) {
      console.error(`FMP Company Provider - Error searching companies:`, error);
      // Return empty array on error rather than throwing
      return [];
    }
  }

  async getCompaniesBySector(sector: string): Promise<CanonicalCompany[]> {
    try {
      const data = await this.fetchFmp<any[]>(`/stock/list`);
      
      if (!data || !Array.isArray(data)) {
        return [];
      }

      const sectorLower = sector.toLowerCase();
      
      return data
        .filter((item: any) => {
          const itemSector = (item.gicsSector || item.sector || '').toLowerCase();
          return itemSector.includes(sectorLower);
        })
        .slice(0, 50) // Limit to 50 companies per sector
        .map((item: any) => buildCanonicalCompany(item));
    } catch (error) {
      console.error(`FMP Company Provider - Error getting companies by sector ${sector}:`, error);
      return [];
    }
  }
}
