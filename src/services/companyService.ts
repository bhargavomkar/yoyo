import { 
  PUBLIC_COMPANIES, 
  PRIVATE_COMPANIES 
} from '@/lib/research-mock-data';
import { 
  PublicCompanyIdentity, 
  PrivateCompanyIdentity, 
  ResearchStatus 
} from '@/types/research';
import { DataLayerService } from './dataLayerService';

export class CompanyService {
  /**
   * Async search leveraging the new Data Layer
   */
  static async searchCompaniesAsync(query: string): Promise<{
    publicCompanies: PublicCompanyIdentity[];
    privateCompanies: PrivateCompanyIdentity[];
  }> {
    const q = query.trim().toLowerCase();
    
    // Get from data layer
    const dlCompanies = await DataLayerService.searchCompanies(q, 20);
    
    // We still need to map DataLayer format to UI format for now
    const mappedPublic = dlCompanies.map(c => ({
      id: c.id,
      name: c.displayName,
      ticker: c.ticker || '',
      exchange: c.exchange || '',
      sector: c.sector || 'Technology',
      subIndustry: c.industry || '',
      country: c.country || 'USA',
      sharePrice: 0,
      sharePriceFormatted: '-',
      sharePriceChange1D: '-',
      isPositive1D: true,
      marketCap: 0,
      marketCapFormatted: '-',
      peRatio: 0, 
      evToRevenue: 0,
      evToEbitda: 0,
      priceToSales: 0,
      fcfYield: 0,
      revenueTTM: '-', 
      revenueGrowthYoY: '-',
      ebitdaMargin: '-',
      netIncomeTTM: '-',
      freeCashFlowTTM: '-',
      cash: '-',
      debt: '-',
      riskIndicator: 'Moderate' as const,
      researchStatus: 'Data Available' as ResearchStatus,
      lastUpdated: 'Just now',
      overview: c.description || '',
      logoLetter: c.displayName.charAt(0),
      type: 'public' as const
    }));

    // For private companies, we'll keep using mock data since the demo private companies must stay
    const mockRes = this.searchCompanies(q);

    return {
      publicCompanies: mappedPublic.length > 0 ? mappedPublic : mockRes.publicCompanies,
      privateCompanies: mockRes.privateCompanies
    };
  }

  /**
   * Sync search for backward compatibility
   * Search across both public and private universe
   */
  static searchCompanies(query: string): {
    publicCompanies: PublicCompanyIdentity[];
    privateCompanies: PrivateCompanyIdentity[];
  } {
    const q = query.trim().toLowerCase();
    if (!q) {
      return {
        publicCompanies: PUBLIC_COMPANIES,
        privateCompanies: PRIVATE_COMPANIES
      };
    }

    // Support semantic searches like "companies with >30% revenue growth"
    if (q.includes('>30%') || q.includes('> 30%') || q.includes('high growth')) {
      const publicMatches = PUBLIC_COMPANIES.filter((c) => {
        const growthNum = parseFloat(c.revenueGrowthYoY.replace(/[+%]/g, ''));
        return growthNum > 30;
      });
      const privateMatches = PRIVATE_COMPANIES.filter((c) => {
        const growthNum = parseFloat(c.arrGrowthYoY.replace(/[+%]/g, ''));
        return growthNum > 30;
      });
      return { publicCompanies: publicMatches, privateCompanies: privateMatches };
    }

    // Filter by sector / theme / name / ticker / country
    const publicMatches = PUBLIC_COMPANIES.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.ticker.toLowerCase().includes(q) ||
        c.sector.toLowerCase().includes(q) ||
        c.subIndustry.toLowerCase().includes(q) ||
        c.country.toLowerCase().includes(q)
    );

    const privateMatches = PRIVATE_COMPANIES.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.industry.toLowerCase().includes(q) ||
        c.location.toLowerCase().includes(q) ||
        c.leadInvestors.some((inv) => inv.toLowerCase().includes(q))
    );

    return {
      publicCompanies: publicMatches,
      privateCompanies: privateMatches
    };
  }

  static getPublicCompanyById(id: string): PublicCompanyIdentity | undefined {
    return PUBLIC_COMPANIES.find(
      (c) => c.id.toLowerCase() === id.toLowerCase() || c.ticker.toLowerCase() === id.toLowerCase()
    );
  }

  static getPrivateCompanyById(id: string): PrivateCompanyIdentity | undefined {
    return PRIVATE_COMPANIES.find(
      (c) => c.id.toLowerCase() === id.toLowerCase()
    );
  }

  static updateResearchStatus(
    companyId: string, 
    newStatus: ResearchStatus, 
    type: 'public' | 'private'
  ): boolean {
    if (type === 'public') {
      const comp = PUBLIC_COMPANIES.find((c) => c.id === companyId);
      if (comp) {
        comp.researchStatus = newStatus;
        comp.lastUpdated = 'Just now';
        return true;
      }
    } else {
      const comp = PRIVATE_COMPANIES.find((c) => c.id === companyId);
      if (comp) {
        comp.researchStatus = newStatus;
        comp.lastUpdated = 'Just now';
        return true;
      }
    }
    return false;
  }
}
