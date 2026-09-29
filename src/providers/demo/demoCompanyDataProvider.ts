// ============================================================
// FARO — Demo Company Data Provider
// ============================================================

import { CompanyDataProvider } from '../interfaces';
import { CanonicalCompany } from '@/types/dataLayer';

const DEMO_COMPANIES: CanonicalCompany[] = [
  {
    id: 'nvda', legalName: 'NVIDIA Corporation', displayName: 'NVIDIA', ticker: 'NVDA',
    exchange: 'NASDAQ', isin: 'US67066G1040', lei: '549300S4KLFTLO7GS118', country: 'United States',
    industry: 'Semiconductors', sector: 'Semiconductors & AI Infra', currency: 'USD',
    isPublic: true, website: 'https://nvidia.com',
    description: 'Designs and manufactures GPUs, DPUs, and AI accelerators for datacenter, gaming, professional, and automotive markets.',
    logoLetter: 'N', employees: '~32,000', founded: 1993,
    dataQuality: 'verified', dataSources: ['demo'], lastUpdated: new Date().toISOString(), isDemo: true,
  },
  {
    id: 'aapl', legalName: 'Apple Inc.', displayName: 'Apple', ticker: 'AAPL',
    exchange: 'NASDAQ', isin: 'US0378331005', country: 'United States',
    industry: 'Consumer Electronics', sector: 'Enterprise SaaS', currency: 'USD',
    isPublic: true, website: 'https://apple.com',
    description: 'Designs, manufactures, and markets consumer electronics, software, and services worldwide.',
    logoLetter: 'A', employees: '~164,000', founded: 1976,
    dataQuality: 'verified', dataSources: ['demo'], lastUpdated: new Date().toISOString(), isDemo: true,
  },
  {
    id: 'msft', legalName: 'Microsoft Corporation', displayName: 'Microsoft', ticker: 'MSFT',
    exchange: 'NASDAQ', isin: 'US5949181045', country: 'United States',
    industry: 'Software', sector: 'Enterprise SaaS', currency: 'USD',
    isPublic: true, website: 'https://microsoft.com',
    description: 'Develops and licenses software, services, devices, and solutions worldwide. Major cloud platform operator.',
    logoLetter: 'M', employees: '~228,000', founded: 1975,
    dataQuality: 'verified', dataSources: ['demo'], lastUpdated: new Date().toISOString(), isDemo: true,
  },
  {
    id: 'googl', legalName: 'Alphabet Inc.', displayName: 'Alphabet', ticker: 'GOOGL',
    exchange: 'NASDAQ', isin: 'US02079K3059', country: 'United States',
    industry: 'Internet', sector: 'Enterprise SaaS', currency: 'USD',
    isPublic: true, website: 'https://abc.xyz',
    description: 'Provides online advertising, search, cloud computing, and technology products and services worldwide.',
    logoLetter: 'G', employees: '~182,000', founded: 1998,
    dataQuality: 'verified', dataSources: ['demo'], lastUpdated: new Date().toISOString(), isDemo: true,
  },
  {
    id: 'amzn', legalName: 'Amazon.com, Inc.', displayName: 'Amazon', ticker: 'AMZN',
    exchange: 'NASDAQ', isin: 'US0231351067', country: 'United States',
    industry: 'E-Commerce & Cloud', sector: 'Enterprise SaaS', currency: 'USD',
    isPublic: true, website: 'https://amazon.com',
    description: 'Engages in retail, cloud computing (AWS), digital streaming, and artificial intelligence.',
    logoLetter: 'A', employees: '~1,500,000', founded: 1994,
    dataQuality: 'verified', dataSources: ['demo'], lastUpdated: new Date().toISOString(), isDemo: true,
  },
  {
    id: 'tsla', legalName: 'Tesla, Inc.', displayName: 'Tesla', ticker: 'TSLA',
    exchange: 'NASDAQ', isin: 'US88160R1014', country: 'United States',
    industry: 'Automotive & Energy', sector: 'Clean Energy & Grid', currency: 'USD',
    isPublic: true, website: 'https://tesla.com',
    description: 'Designs, manufactures, and sells electric vehicles, energy storage, and solar energy generation systems.',
    logoLetter: 'T', employees: '~140,000', founded: 2003,
    dataQuality: 'verified', dataSources: ['demo'], lastUpdated: new Date().toISOString(), isDemo: true,
  },
  // Private company examples
  {
    id: 'nexgen-robotics', legalName: 'NexGen Robotics Inc.', displayName: 'NexGen Robotics',
    country: 'United States', industry: 'Autonomous Systems', sector: 'Defense & Aerospace',
    currency: 'USD', isPublic: false,
    description: 'Autonomous hardware platform for defense and commercial logistics.',
    logoLetter: 'N', employees: '~420', founded: 2019,
    dataQuality: 'incomplete', dataSources: ['demo'], lastUpdated: new Date().toISOString(), isDemo: true,
  },
  {
    id: 'arclight-energy', legalName: 'ArcLight Energy Systems Corp.', displayName: 'ArcLight Energy',
    country: 'United States', industry: 'Grid Infrastructure', sector: 'Clean Energy & Grid',
    currency: 'USD', isPublic: false,
    description: 'Next-generation grid-scale battery storage and power management.',
    logoLetter: 'A', employees: '~280', founded: 2020,
    dataQuality: 'incomplete', dataSources: ['demo'], lastUpdated: new Date().toISOString(), isDemo: true,
  },
];

export class DemoCompanyDataProvider implements CompanyDataProvider {
  readonly providerId = 'demo-company';
  readonly providerName = 'Demo Company Data';
  readonly isDemo = true;

  async ping() {
    return { ok: true, latencyMs: 1 };
  }

  async getCompany(companyId: string): Promise<CanonicalCompany | null> {
    return DEMO_COMPANIES.find(c => c.id === companyId) ?? null;
  }

  async searchCompanies(query: string, limit = 10): Promise<CanonicalCompany[]> {
    const q = query.toLowerCase();
    return DEMO_COMPANIES
      .filter(c => c.displayName.toLowerCase().includes(q) || c.ticker?.toLowerCase().includes(q) || c.legalName.toLowerCase().includes(q))
      .slice(0, limit);
  }

  async getCompaniesBySector(sector: string): Promise<CanonicalCompany[]> {
    return DEMO_COMPANIES.filter(c => c.sector === sector);
  }
}
