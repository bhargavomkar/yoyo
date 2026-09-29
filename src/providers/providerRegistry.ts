// ============================================================
// FARO — Provider Registry
// ============================================================
// Central registry for all data providers. Manages provider
// lifecycle, health checks, and fallback behavior.
// When DATA_MODE=live, real providers can be registered
// alongside demo providers.
// ============================================================

import {
  MarketDataProvider,
  FinancialDataProvider,
  CompanyDataProvider,
  FilingsProvider,
  NewsProvider,
} from './interfaces';
import { DemoMarketDataProvider } from './demo/demoMarketDataProvider';
import { DemoFinancialDataProvider } from './demo/demoFinancialDataProvider';
import { DemoCompanyDataProvider } from './demo/demoCompanyDataProvider';
import { DemoFilingsProvider, DemoNewsProvider } from './demo/demoFilingsNewsProvider';
import { ProviderRegistration, ProviderStatus } from '@/types/dataLayer';
import { DATA_MODE } from '@/config/dataConfig';

// Import real FMP providers
import { FmpMarketDataProvider } from './fmp/fmpMarketDataProvider';
import { FmpFinancialDataProvider } from './fmp/fmpFinancialDataProvider';
import { FmpCompanyDataProvider } from './fmp/fmpCompanyDataProvider';

class ProviderRegistryImpl {
  private marketProviders: MarketDataProvider[] = [];
  private financialProviders: FinancialDataProvider[] = [];
  private companyProviders: CompanyDataProvider[] = [];
  private filingsProviders: FilingsProvider[] = [];
  private newsProviders: NewsProvider[] = [];
  private registrations: Map<string, ProviderRegistration> = new Map();

  constructor() {
    this.initializeDefaults();
  }

  private initializeDefaults() {
    // Always register demo providers as fallback
    const demoMarket = new DemoMarketDataProvider();
    const demoFinancial = new DemoFinancialDataProvider();
    const demoCompany = new DemoCompanyDataProvider();
    const demoFilings = new DemoFilingsProvider();
    const demoNews = new DemoNewsProvider();

    this.registerMarketProvider(demoMarket);
    this.registerFinancialProvider(demoFinancial);
    this.registerCompanyProvider(demoCompany);
    this.registerFilingsProvider(demoFilings);
    this.registerNewsProvider(demoNews);

    // Register real FMP providers when in live mode
    if (DATA_MODE === 'live') {
      try {
        const fmpMarket = new FmpMarketDataProvider();
        const fmpFinancial = new FmpFinancialDataProvider();
        const fmpCompany = new FmpCompanyDataProvider();

        this.registerMarketProvider(fmpMarket);
        this.registerFinancialProvider(fmpFinancial);
        this.registerCompanyProvider(fmpCompany);
      } catch (error) {
        console.warn('FMP providers failed to initialize in live mode:', error);
      }
    }
  }

  // ---- Registration Methods ----

  registerMarketProvider(provider: MarketDataProvider) {
    this.marketProviders.push(provider);
    this.addRegistration(provider.providerId, provider.providerName, 'market_data', provider.isDemo);
  }

  registerFinancialProvider(provider: FinancialDataProvider) {
    this.financialProviders.push(provider);
    this.addRegistration(provider.providerId, provider.providerName, 'financial_data', provider.isDemo);
  }

  registerCompanyProvider(provider: CompanyDataProvider) {
    this.companyProviders.push(provider);
    this.addRegistration(provider.providerId, provider.providerName, 'company_data', provider.isDemo);
  }

  registerFilingsProvider(provider: FilingsProvider) {
    this.filingsProviders.push(provider);
    this.addRegistration(provider.providerId, provider.providerName, 'filings', provider.isDemo);
  }

  registerNewsProvider(provider: NewsProvider) {
    this.newsProviders.push(provider);
    this.addRegistration(provider.providerId, provider.providerName, 'news', provider.isDemo);
  }

  private addRegistration(id: string, name: string, type: ProviderRegistration['type'], isDemo: boolean) {
    this.registrations.set(id, {
      id,
      name,
      type,
      status: 'connected',
      priority: isDemo ? 1 : 50,
      lastSyncAt: new Date().toISOString(),
      recordCount: 0,
      errorCount: 0,
      warningCount: 0,
      isDemo,
    });
  }

  // ---- Accessor Methods ----

  getMarketProvider(): MarketDataProvider {
    // In live mode, prefer non-demo providers
    if (DATA_MODE === 'live') {
      const live = this.marketProviders.find(p => !p.isDemo);
      if (live) return live;
    }
    return this.marketProviders[0];
  }

  getFinancialProvider(): FinancialDataProvider {
    if (DATA_MODE === 'live') {
      const live = this.financialProviders.find(p => !p.isDemo);
      if (live) return live;
    }
    return this.financialProviders[0];
  }

  getCompanyProvider(): CompanyDataProvider {
    if (DATA_MODE === 'live') {
      const live = this.companyProviders.find(p => !p.isDemo);
      if (live) return live;
    }
    return this.companyProviders[0];
  }

  getFilingsProvider(): FilingsProvider {
    if (DATA_MODE === 'live') {
      const live = this.filingsProviders.find(p => !p.isDemo);
      if (live) return live;
    }
    return this.filingsProviders[0];
  }

  getNewsProvider(): NewsProvider {
    if (DATA_MODE === 'live') {
      const live = this.newsProviders.find(p => !p.isDemo);
      if (live) return live;
    }
    return this.newsProviders[0];
  }

  // ---- Health & Status ----

  getAllRegistrations(): ProviderRegistration[] {
    return Array.from(this.registrations.values());
  }

  getRegistration(providerId: string): ProviderRegistration | undefined {
    return this.registrations.get(providerId);
  }

  updateProviderStatus(providerId: string, status: ProviderStatus) {
    const reg = this.registrations.get(providerId);
    if (reg) {
      reg.status = status;
      if (status === 'error') reg.errorCount++;
    }
  }

  async healthCheck(): Promise<Map<string, { ok: boolean; latencyMs: number }>> {
    const results = new Map<string, { ok: boolean; latencyMs: number }>();
    const allProviders = [
      ...this.marketProviders,
      ...this.financialProviders,
      ...this.companyProviders,
      ...this.filingsProviders,
      ...this.newsProviders,
    ];
    for (const provider of allProviders) {
      try {
        const result = await provider.ping();
        results.set(provider.providerId, result);
        this.updateProviderStatus(provider.providerId, result.ok ? 'connected' : 'error');
      } catch {
        results.set(provider.providerId, { ok: false, latencyMs: -1 });
        this.updateProviderStatus(provider.providerId, 'error');
      }
    }
    return results;
  }

  getDataMode() {
    return DATA_MODE;
  }
}

// Singleton
export const ProviderRegistry = new ProviderRegistryImpl();
