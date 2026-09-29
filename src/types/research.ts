export type ResearchStatus = 
  | 'Not Researched' 
  | 'Researching' 
  | 'Analyzed' 
  | 'Needs Review' 
  | 'Updated';

export type EpistemicStatus = 
  | 'VERIFIED DATA' 
  | 'MODEL ANALYSIS' 
  | 'ASSUMPTION' 
  | 'ESTIMATE' 
  | 'UNKNOWN';

export type CompanyType = 'public' | 'private';

export interface EvidenceSource {
  id: string; // e.g. 'source-01'
  citationNumber: string; // e.g. '[Source 01]'
  title: string;
  sourceType: 'Annual Report (10-K)' | 'Quarterly Report (10-Q)' | 'Earnings Call Transcript' | 'SEC Filing' | 'Audited Cap Table' | 'Proprietary Channel Check' | 'Industry Benchmark';
  publicationDate: string;
  relevantExcerpt: string;
  dataUsed: string;
  urlPlaceholder?: string;
  isDemo?: boolean;
}

export interface ResearchClaim {
  id: string;
  claimText: string;
  epistemicStatus: EpistemicStatus;
  sourceIds: string[];
}

export interface StructuredAnalysis {
  investmentThesis: {
    summary: string;
    points: ResearchClaim[];
  };
  counterThesis: {
    summary: string;
    points: ResearchClaim[];
  };
  growthDrivers: ResearchClaim[];
  catalysts: ResearchClaim[];
  competitiveAdvantages: ResearchClaim[];
  keyRisks: ResearchClaim[];
  openQuestions: string[];
  importantAssumptions: ResearchClaim[];
}

export interface FinancialYearData {
  year: string;
  revenue: number;
  cogs: number;
  grossProfit: number;
  grossMargin: number;
  operatingExpenses: number;
  operatingIncome: number;
  operatingMargin: number;
  netIncome: number;
  netMargin: number;
  eps: number;
  ebitda: number;
  ebitdaMargin: number;
  freeCashFlow: number;
  operatingCashFlow: number;
  capex: number;
  cash: number;
  debt: number;
  totalAssets: number;
  liabilities: number;
  equity: number;
  accountsReceivable?: number;
  inventory?: number;
  ppe?: number;
  financingCashFlow?: number;
}

export interface PublicCompanyIdentity {
  id: string;
  name: string;
  ticker: string;
  country: string;
  sector: string;
  subIndustry: string;
  sharePrice: number;
  sharePriceFormatted: string;
  sharePriceChange1D: string;
  isPositive1D: boolean;
  marketCap: number;
  marketCapFormatted: string;
  peRatio: number;
  evToRevenue: number;
  evToEbitda: number;
  priceToSales: number;
  fcfYield: number;
  revenueTTM: string;
  revenueGrowthYoY: string;
  ebitdaMargin: string;
  netIncomeTTM: string;
  freeCashFlowTTM: string;
  cash: string;
  debt: string;
  riskIndicator: 'Low' | 'Moderate' | 'High' | 'Managed';
  researchStatus: ResearchStatus;
  lastUpdated: string;
  overview: string;
  logoLetter: string;
  type: 'public';
}

export interface PrivateCompanyIdentity {
  id: string;
  name: string;
  industry: string;
  location: string;
  founded: number;
  employees: string;
  totalFunding: string;
  latestRound: string;
  estimatedValuation: string;
  leadInvestors: string[];
  businessModel: string;
  customerProfile: string;
  competitiveMoat: string;
  // Private Financials
  annualRecurringRevenue: string;
  monthlyRecurringRevenue: string;
  arrGrowthYoY: string;
  grossMargin: string;
  netBurnMonthly: string;
  cashRunwayMonths: number;
  cashBalance: string;
  customerConcentrationTop5: string;
  dataCertainty: {
    arr: 'Verified' | 'Estimated' | 'Unavailable';
    valuation: 'Verified' | 'Estimated' | 'Unavailable';
    runway: 'Verified' | 'Estimated' | 'Unavailable';
    capTable: 'Verified' | 'Estimated' | 'Unavailable';
  };
  riskIndicator: 'Low' | 'Moderate' | 'High' | 'Managed';
  researchStatus: ResearchStatus;
  lastUpdated: string;
  overview: string;
  logoLetter: string;
  type: 'private';
  isDemoMarked: boolean;
}

export interface DCFModelInputs {
  revenueGrowthRate: number; // e.g. 18 (%)
  operatingMargin: number; // e.g. 55 (%)
  taxRate: number; // e.g. 15 (%)
  wacc: number; // e.g. 9.5 (%)
  terminalGrowthRate: number; // e.g. 3.5 (%)
}

export interface DCFModelOutputs {
  projectedRevenues: number[];
  projectedFCFs: number[];
  pvOfFCF: number;
  terminalValue: number;
  pvOfTerminalValue: number;
  enterpriseValue: number;
  netDebt: number;
  equityValue: number;
  impliedSharePrice: number;
  currentSharePrice: number;
  upsideDownsidePercent: number;
}

export interface ComparablePeer {
  id: string;
  company: string;
  ticker: string;
  evToRevenue: number;
  evToEbitda: number;
  peRatio: number;
  revenueGrowth: number;
  operatingMargin: number;
  marketCap: string;
}

export interface ResearchActivityEvent {
  id: string;
  date: string;
  actor: 'Faro Engine' | 'Atlas Research' | 'Keystone Risk' | 'Mosaic Diligence' | 'Analyst';
  title: string;
  detail: string;
  badge?: string;
}

export interface SectorResearchItem {
  id: string;
  name: string;
  marketSize: string;
  projectedGrowth: string;
  growthRateNumeric: number;
  averageMargin: string;
  averageValuationEV: string;
  valuationMultipleNumeric: number;
  keyTrends: string[];
  risks: string[];
  majorCompanies: string[];
}

export interface ThematicResearchItem {
  id: string;
  title: string;
  tagline: string;
  description: string;
  marketDrivers: string[];
  companiesExposed: { name: string; ticker?: string; role: string }[];
  growthOpportunities: string[];
  risks: string[];
  keyDevelopments: string[];
  stage: 'Emerging' | 'Scaling' | 'Mature';
}

export interface WatchlistItem {
  id: string;
  companyId: string;
  name: string;
  ticker?: string;
  type: CompanyType;
  priceOrValuation: string;
  growth: string;
  risk: 'Low' | 'Moderate' | 'High' | 'Managed';
  researchStatus: ResearchStatus;
  lastAnalyzed: string;
  thesisSnapshot: string;
}

export interface GeneratedResearchReport {
  id: string;
  companyName: string;
  ticker?: string;
  generatedDate: string;
  analyst: string;
  executiveSummary: string;
  companyOverview: string;
  marketAnalysis: string;
  financialPerformance: string;
  growthDrivers: string[];
  competitiveLandscape: string;
  valuationSummary: string;
  bullCase: string;
  baseCase: string;
  bearCase: string;
  openQuestions: string[];
  sources: EvidenceSource[];
}
