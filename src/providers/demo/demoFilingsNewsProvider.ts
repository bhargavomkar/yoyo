// ============================================================
// FARO — Demo Filings & News Providers
// ============================================================

import { FilingsProvider, FilingRecord, NewsProvider, NewsArticle } from '../interfaces';
import { DataSource } from '@/types/dataLayer';

const demoSource = (entity: string): DataSource => ({
  id: `demo-filing-${entity}`,
  provider: 'demo',
  sourceType: 'demo_synthetic',
  retrievedAt: new Date().toISOString(),
  entity,
  confidence: 0,
  status: 'demo',
  isDemo: true,
});

const DEMO_FILINGS: FilingRecord[] = [
  { id: 'f-nvda-10k-2025', companyId: 'nvda', filingType: '10-K', filingDate: '2025-02-26', periodOfReport: 'FY2025', title: 'NVIDIA Corporation - Annual Report (10-K)', source: demoSource('nvda') },
  { id: 'f-nvda-10q-q3-2025', companyId: 'nvda', filingType: '10-Q', filingDate: '2024-11-20', periodOfReport: 'Q3-FY2025', title: 'NVIDIA Corporation - Quarterly Report (10-Q)', source: demoSource('nvda') },
  { id: 'f-nvda-10k-2024', companyId: 'nvda', filingType: '10-K', filingDate: '2024-02-21', periodOfReport: 'FY2024', title: 'NVIDIA Corporation - Annual Report (10-K)', source: demoSource('nvda') },
  { id: 'f-aapl-10k-2024', companyId: 'aapl', filingType: '10-K', filingDate: '2024-10-31', periodOfReport: 'FY2024', title: 'Apple Inc. - Annual Report (10-K)', source: demoSource('aapl') },
  { id: 'f-msft-10k-2024', companyId: 'msft', filingType: '10-K', filingDate: '2024-07-30', periodOfReport: 'FY2024', title: 'Microsoft Corporation - Annual Report (10-K)', source: demoSource('msft') },
];

const DEMO_NEWS: NewsArticle[] = [
  { id: 'n-1', title: 'NVIDIA Reports Record Q4 Revenue of $39.3B', summary: 'NVIDIA reported Q4 FY2025 revenue of $39.3 billion, up 78% year-over-year, driven by data center demand.', publishedAt: '2025-02-26T16:00:00Z', source: 'Demo News Wire', sentiment: 'positive', relevantTickers: ['NVDA'], isDemo: true },
  { id: 'n-2', title: 'Fed Signals Potential Rate Hold Through Q3 2026', summary: 'Federal Reserve maintains current policy stance, suggesting rates may hold steady through Q3 2026.', publishedAt: '2026-09-18T14:00:00Z', source: 'Demo News Wire', sentiment: 'neutral', relevantTickers: [], isDemo: true },
  { id: 'n-3', title: 'Apple Intelligence Drives Record Services Revenue', summary: 'Apple reported services revenue exceeding $25B in the quarter, boosted by AI features.', publishedAt: '2026-07-30T20:00:00Z', source: 'Demo News Wire', sentiment: 'positive', relevantTickers: ['AAPL'], isDemo: true },
  { id: 'n-4', title: 'Azure Cloud Growth Accelerates to 35% YoY', summary: 'Microsoft Azure revenue growth accelerated to 35% year-over-year, exceeding analyst estimates.', publishedAt: '2026-07-22T16:00:00Z', source: 'Demo News Wire', sentiment: 'positive', relevantTickers: ['MSFT'], isDemo: true },
  { id: 'n-5', title: 'Semiconductor Export Controls Expanded', summary: 'New semiconductor export restrictions announced, potentially affecting chip sales to certain regions.', publishedAt: '2026-09-15T10:00:00Z', source: 'Demo News Wire', sentiment: 'negative', relevantTickers: ['NVDA', 'AVGO', 'AMD'], isDemo: true },
];

export class DemoFilingsProvider implements FilingsProvider {
  readonly providerId = 'demo-filings';
  readonly providerName = 'Demo SEC Filings';
  readonly isDemo = true;

  async ping() { return { ok: true, latencyMs: 1 }; }

  async getFilings(companyId: string, filingType?: string, limit = 10): Promise<FilingRecord[]> {
    let results = DEMO_FILINGS.filter(f => f.companyId === companyId);
    if (filingType) results = results.filter(f => f.filingType === filingType);
    return results.slice(0, limit);
  }

  async getLatestFiling(companyId: string, filingType: string): Promise<FilingRecord | null> {
    const filings = await this.getFilings(companyId, filingType, 1);
    return filings[0] ?? null;
  }
}

export class DemoNewsProvider implements NewsProvider {
  readonly providerId = 'demo-news';
  readonly providerName = 'Demo News Wire';
  readonly isDemo = true;

  async ping() { return { ok: true, latencyMs: 1 }; }

  async getNews(query: string, limit = 10): Promise<NewsArticle[]> {
    const q = query.toLowerCase();
    return DEMO_NEWS.filter(n => n.title.toLowerCase().includes(q) || n.summary.toLowerCase().includes(q)).slice(0, limit);
  }

  async getCompanyNews(companyId: string, limit = 10): Promise<NewsArticle[]> {
    const ticker = companyId.toUpperCase();
    return DEMO_NEWS.filter(n => n.relevantTickers.includes(ticker)).slice(0, limit);
  }

  async getMarketNews(limit = 10): Promise<NewsArticle[]> {
    return DEMO_NEWS.slice(0, limit);
  }
}
