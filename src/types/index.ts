export type AssetClass = 
  | 'Public Equity'
  | 'Private Equity'
  | 'Venture & Growth'
  | 'Private Credit'
  | 'Real Assets'
  | 'Cash & Equivalents';

export type Sector = 
  | 'Semiconductors & AI Infra'
  | 'Enterprise SaaS'
  | 'Defense & Aerospace'
  | 'Clean Energy & Grid'
  | 'Fintech & Capital Markets'
  | 'Healthcare & Biotech';

export type Geography = 
  | 'North America'
  | 'Western Europe'
  | 'APAC & Japan'
  | 'Latin America'
  | 'Middle East';

export type OpportunityStatus = 
  | 'Due Diligence'
  | 'IC Review'
  | 'Term Sheet'
  | 'Active Pipeline'
  | 'Monitoring';

export type RiskLevel = 'Low' | 'Moderate' | 'High' | 'Managed';

export interface InvestmentOpportunity {
  id: string;
  company: string;
  symbol?: string;
  logo: string;
  sector: Sector;
  assetType: AssetClass;
  valuation: string;
  growth: string;
  risk: RiskLevel;
  status: OpportunityStatus;
  leadPartner: string;
  thesis: string;
  projectedIRR: string;
  targetInvestment: string;
  ebitdaMultiple?: string;
  hqLocation: string;
  lastUpdated: string;
}

export interface FinancialMetric {
  id: string;
  label: string;
  value: string;
  numericValue: number;
  delta?: {
    value: string;
    isPositive: boolean;
    period: string;
  };
  subtext?: string;
  sparkline?: number[];
  category: 'primary' | 'secondary';
}

export interface ExposureBreakdown {
  name: string;
  allocationPercent: number;
  amountFormatted: string;
  amountNumeric: number;
  change30d: string;
  isPositiveChange: boolean;
  color: string;
}

export interface AIAgent {
  id: string;
  name: string;
  badge: string;
  badgeBg: string;
  badgeColor: string;
  specialization: string;
  rating: number;
  completedTasks: number;
  startingPrice: string;
  ethPriceNumeric: number;
  description: string;
  capabilities: string[];
  latency: string;
  model: string;
  activeOrders: number;
}

export interface AIInsight {
  id: string;
  title: string;
  summary: string;
  category: 'allocation' | 'risk' | 'macro' | 'earnings';
  confidence: number;
  deltaPercent: string;
  metrics: {
    label: string;
    value: string;
  }[];
  timestamp: string;
  fullAnalysis: string[];
  recommendedActions: string[];
}

export interface Workspace {
  id: string;
  name: string;
  aum: string;
  strategy: string;
  type: 'fund' | 'syndicate' | 'family_office';
}

export type NavItemKey = 
  | 'command-center'
  | 'research-workspace'
  | 'portfolio-allocation'
  | 'agent-marketplace'
  | 'agent-orchestrator'
  | 'agent-economy'
  | 'public-markets'
  | 'private-markets'
  | 'deal-pipeline'
  | 'watchlist'
  | 'research'
  | 'valuations'
  | 'risk'
  | 'due-diligence'
  | 'investment-memos'
  | 'tasks'
  | 'work-orders'
  | 'agent-activity'
  | 'documents'
  | 'settings'
  | 'data-health'
  | 'help';
