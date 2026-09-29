// ============================================================
// FARO — Portfolio Mock Data
// ============================================================
// References companies from research-mock-data.ts to avoid duplication.
// Demo data clearly labelled as model estimates.
// ============================================================

import {
  PortfolioHolding,
  PortfolioConfig,
  AssetClassAllocation,
  SavedPortfolio,
  PortfolioSnapshot,
} from '@/types/portfolio';
import {
  calculateAssetAllocation,
  calculatePortfolioRisk,
  calculateScenario,
} from '@/services/portfolioCalculationEngine';

// ---- Default Portfolio Configuration ----

export const DEFAULT_PORTFOLIO_CONFIG: PortfolioConfig = {
  availableCapital: 10_000_000,
  riskAppetite: 'Moderate',
  investmentHorizon: 7,
  targetReturn: 15,
  liquidityRequirement: 20,
  geographicPreference: 'Global',
  assetClassPreference: ['Public Equity', 'Private Equity', 'Venture', 'Fixed Income', 'Cash'],
};

// ---- Default Asset Allocation Slices ----

export const DEFAULT_ALLOCATION_PERCENTS: { assetClass: AssetClassAllocation; percent: number }[] = [
  { assetClass: 'Public Equity', percent: 40 },
  { assetClass: 'Private Equity', percent: 20 },
  { assetClass: 'Venture', percent: 15 },
  { assetClass: 'Fixed Income', percent: 10 },
  { assetClass: 'Cash', percent: 10 },
  { assetClass: 'Alternatives', percent: 5 },
  { assetClass: 'Real Assets', percent: 0 },
];

// ---- Default Holdings (Reference research-mock-data company IDs) ----

export const DEFAULT_HOLDINGS: PortfolioHolding[] = [
  {
    id: 'h-nvda',
    companyId: 'nvda',
    name: 'NVIDIA Corporation',
    ticker: 'NVDA',
    type: 'public',
    assetClass: 'Public Equity',
    sector: 'Semiconductors',
    geography: 'United States',
    allocationPercent: 14,
    capitalAllocated: 1_400_000,
    expectedReturn: 22.5,
    expectedGain: 315_000,
    expectedLoss: -157_500,
    holdingPeriod: 7,
    riskLevel: 'Moderate',
    liquidity: 'High',
    valuation: '$3,120B',
    logoLetter: 'N',
  },
  {
    id: 'h-msft',
    companyId: 'msft',
    name: 'Microsoft Corporation',
    ticker: 'MSFT',
    type: 'public',
    assetClass: 'Public Equity',
    sector: 'Enterprise Software & Cloud',
    geography: 'United States',
    allocationPercent: 12,
    capitalAllocated: 1_200_000,
    expectedReturn: 14.2,
    expectedGain: 170_400,
    expectedLoss: -85_200,
    holdingPeriod: 7,
    riskLevel: 'Low',
    liquidity: 'High',
    valuation: '$3,180B',
    logoLetter: 'M',
  },
  {
    id: 'h-amzn',
    companyId: 'amzn',
    name: 'Amazon.com, Inc.',
    ticker: 'AMZN',
    type: 'public',
    assetClass: 'Public Equity',
    sector: 'Cloud & E-Commerce',
    geography: 'United States',
    allocationPercent: 10,
    capitalAllocated: 1_000_000,
    expectedReturn: 16.8,
    expectedGain: 168_000,
    expectedLoss: -84_000,
    holdingPeriod: 7,
    riskLevel: 'Moderate',
    liquidity: 'High',
    valuation: '$2,040B',
    logoLetter: 'A',
  },
  {
    id: 'h-googl',
    companyId: 'googl',
    name: 'Alphabet Inc.',
    ticker: 'GOOGL',
    type: 'public',
    assetClass: 'Public Equity',
    sector: 'Internet & Search',
    geography: 'United States',
    allocationPercent: 8,
    capitalAllocated: 800_000,
    expectedReturn: 13.5,
    expectedGain: 108_000,
    expectedLoss: -54_000,
    holdingPeriod: 7,
    riskLevel: 'Low',
    liquidity: 'High',
    valuation: '$2,210B',
    logoLetter: 'G',
  },
  {
    id: 'h-tsm',
    companyId: 'tsm',
    name: 'Taiwan Semiconductor Mfg',
    ticker: 'TSM',
    type: 'public',
    assetClass: 'Public Equity',
    sector: 'Semiconductors',
    geography: 'Taiwan',
    allocationPercent: 6,
    capitalAllocated: 600_000,
    expectedReturn: 18.2,
    expectedGain: 109_200,
    expectedLoss: -54_600,
    holdingPeriod: 7,
    riskLevel: 'Moderate',
    liquidity: 'High',
    valuation: '$890B',
    logoLetter: 'T',
  },
  {
    id: 'h-cerebras',
    companyId: 'cerebras',
    name: 'Cerebras Systems',
    type: 'private',
    assetClass: 'Venture',
    sector: 'Semiconductors & Wafer-Scale AI',
    geography: 'United States',
    allocationPercent: 8,
    capitalAllocated: 800_000,
    expectedReturn: 35.0,
    expectedGain: 280_000,
    expectedLoss: -200_000,
    holdingPeriod: 5,
    riskLevel: 'Moderate',
    liquidity: 'Low',
    valuation: '$8.2B (Demo)',
    logoLetter: 'C',
  },
  {
    id: 'h-coreweave',
    companyId: 'coreweave',
    name: 'CoreWeave',
    type: 'private',
    assetClass: 'Private Equity',
    sector: 'Specialized Cloud & GPU Compute',
    geography: 'United States',
    allocationPercent: 12,
    capitalAllocated: 1_200_000,
    expectedReturn: 28.0,
    expectedGain: 336_000,
    expectedLoss: -240_000,
    holdingPeriod: 5,
    riskLevel: 'Managed',
    liquidity: 'Low',
    valuation: '$19.1B (Demo)',
    logoLetter: 'CW',
  },
  {
    id: 'h-helsing',
    companyId: 'helsing',
    name: 'Helsing AI',
    type: 'private',
    assetClass: 'Private Equity',
    sector: 'Defense & Autonomous Sensor Fusion',
    geography: 'Europe',
    allocationPercent: 8,
    capitalAllocated: 800_000,
    expectedReturn: 24.0,
    expectedGain: 192_000,
    expectedLoss: -120_000,
    holdingPeriod: 7,
    riskLevel: 'Low',
    liquidity: 'Low',
    valuation: '$5.4B (Demo)',
    logoLetter: 'H',
  },
  {
    id: 'h-fixed',
    companyId: 'fixed-income',
    name: 'US Treasury / IG Credit',
    type: 'public',
    assetClass: 'Fixed Income',
    sector: 'Fixed Income',
    geography: 'United States',
    allocationPercent: 10,
    capitalAllocated: 1_000_000,
    expectedReturn: 4.8,
    expectedGain: 48_000,
    expectedLoss: -15_000,
    holdingPeriod: 7,
    riskLevel: 'Low',
    liquidity: 'High',
    valuation: 'Par',
    logoLetter: 'FI',
  },
  {
    id: 'h-cash',
    companyId: 'cash-reserves',
    name: 'Cash & Equivalents',
    type: 'public',
    assetClass: 'Cash',
    sector: 'Cash',
    geography: 'United States',
    allocationPercent: 7,
    capitalAllocated: 700_000,
    expectedReturn: 5.2,
    expectedGain: 36_400,
    expectedLoss: 0,
    holdingPeriod: 1,
    riskLevel: 'Low',
    liquidity: 'High',
    valuation: 'NAV',
    logoLetter: '$',
  },
  {
    id: 'h-alt',
    companyId: 'alternatives-fund',
    name: 'Multi-Strategy Alternatives',
    type: 'public',
    assetClass: 'Alternatives',
    sector: 'Alternatives',
    geography: 'Global',
    allocationPercent: 5,
    capitalAllocated: 500_000,
    expectedReturn: 9.5,
    expectedGain: 47_500,
    expectedLoss: -37_500,
    holdingPeriod: 3,
    riskLevel: 'Moderate',
    liquidity: 'Medium',
    valuation: 'NAV',
    logoLetter: 'AL',
  },
];

// ---- Saved Portfolios ----

const defaultSlices = calculateAssetAllocation(10_000_000, DEFAULT_ALLOCATION_PERCENTS);

export const SAVED_PORTFOLIOS: SavedPortfolio[] = [
  {
    id: 'portfolio-growth',
    name: 'Faro Growth Portfolio',
    capital: 10_000_000,
    holdings: DEFAULT_HOLDINGS,
    assetAllocation: defaultSlices,
    config: DEFAULT_PORTFOLIO_CONFIG,
    riskMetrics: calculatePortfolioRisk(DEFAULT_HOLDINGS),
    scenarios: [
      calculateScenario(DEFAULT_HOLDINGS, 10_000_000, 'base'),
      calculateScenario(DEFAULT_HOLDINGS, 10_000_000, 'bull'),
      calculateScenario(DEFAULT_HOLDINGS, 10_000_000, 'bear'),
      calculateScenario(DEFAULT_HOLDINGS, 10_000_000, 'stress'),
    ],
    createdDate: 'Sep 20, 2026',
    lastUpdated: 'Sep 27, 2026',
  },
  {
    id: 'portfolio-balanced',
    name: 'Faro Balanced Portfolio',
    capital: 5_000_000,
    holdings: DEFAULT_HOLDINGS.slice(0, 6).map((h) => ({
      ...h,
      capitalAllocated: Math.round(h.capitalAllocated * 0.5),
    })),
    assetAllocation: calculateAssetAllocation(5_000_000, [
      { assetClass: 'Public Equity', percent: 35 },
      { assetClass: 'Fixed Income', percent: 25 },
      { assetClass: 'Private Equity', percent: 15 },
      { assetClass: 'Cash', percent: 15 },
      { assetClass: 'Alternatives', percent: 10 },
      { assetClass: 'Venture', percent: 0 },
      { assetClass: 'Real Assets', percent: 0 },
    ]),
    config: {
      ...DEFAULT_PORTFOLIO_CONFIG,
      availableCapital: 5_000_000,
      riskAppetite: 'Conservative',
      targetReturn: 10,
    },
    riskMetrics: calculatePortfolioRisk(DEFAULT_HOLDINGS.slice(0, 6)),
    scenarios: [],
    createdDate: 'Sep 15, 2026',
    lastUpdated: 'Sep 26, 2026',
  },
  {
    id: 'portfolio-ai-infra',
    name: 'AI Infrastructure Portfolio',
    capital: 15_000_000,
    holdings: DEFAULT_HOLDINGS.filter((h) =>
      ['nvda', 'cerebras', 'coreweave', 'tsm', 'amzn'].includes(h.companyId)
    ).map((h) => ({
      ...h,
      capitalAllocated: Math.round(h.capitalAllocated * 1.5),
    })),
    assetAllocation: calculateAssetAllocation(15_000_000, [
      { assetClass: 'Public Equity', percent: 45 },
      { assetClass: 'Venture', percent: 25 },
      { assetClass: 'Private Equity', percent: 20 },
      { assetClass: 'Cash', percent: 10 },
      { assetClass: 'Fixed Income', percent: 0 },
      { assetClass: 'Alternatives', percent: 0 },
      { assetClass: 'Real Assets', percent: 0 },
    ]),
    config: {
      ...DEFAULT_PORTFOLIO_CONFIG,
      availableCapital: 15_000_000,
      riskAppetite: 'Aggressive',
      targetReturn: 25,
    },
    riskMetrics: calculatePortfolioRisk(
      DEFAULT_HOLDINGS.filter((h) =>
        ['nvda', 'cerebras', 'coreweave', 'tsm', 'amzn'].includes(h.companyId)
      )
    ),
    scenarios: [],
    createdDate: 'Sep 22, 2026',
    lastUpdated: 'Sep 27, 2026',
  },
];

// ---- Portfolio Snapshots for Command Center ----

export const PORTFOLIO_SNAPSHOTS: PortfolioSnapshot[] = [
  {
    id: 'portfolio-growth',
    name: 'Faro Growth Portfolio',
    capital: 10_000_000,
    capitalFormatted: '$10.0M',
    expectedReturn: '14.8%',
    riskLevel: 'Moderate',
    holdingsCount: 11,
    topHolding: 'NVIDIA',
    topHoldingPercent: '14%',
    lastUpdated: 'Sep 27, 2026',
    changePercent: '+2.4%',
    isPositiveChange: true,
  },
  {
    id: 'portfolio-balanced',
    name: 'Faro Balanced Portfolio',
    capital: 5_000_000,
    capitalFormatted: '$5.0M',
    expectedReturn: '10.2%',
    riskLevel: 'Conservative',
    holdingsCount: 6,
    topHolding: 'NVIDIA',
    topHoldingPercent: '20%',
    lastUpdated: 'Sep 26, 2026',
    changePercent: '+1.1%',
    isPositiveChange: true,
  },
  {
    id: 'portfolio-ai-infra',
    name: 'AI Infrastructure Portfolio',
    capital: 15_000_000,
    capitalFormatted: '$15.0M',
    expectedReturn: '24.2%',
    riskLevel: 'Aggressive',
    holdingsCount: 5,
    topHolding: 'NVIDIA',
    topHoldingPercent: '28%',
    lastUpdated: 'Sep 27, 2026',
    changePercent: '+3.8%',
    isPositiveChange: true,
  },
];

// ---- Available companies for investment selection ----
// (These reference companies from research-mock-data.ts)

export interface SelectableInvestment {
  companyId: string;
  name: string;
  ticker?: string;
  type: 'public' | 'private';
  assetClass: AssetClassAllocation;
  sector: string;
  geography: string;
  riskLevel: 'Low' | 'Moderate' | 'High' | 'Managed';
  liquidity: 'High' | 'Medium' | 'Low' | 'Illiquid';
  valuation: string;
  expectedReturn: number;
  logoLetter: string;
}

export const SELECTABLE_INVESTMENTS: SelectableInvestment[] = [
  { companyId: 'nvda', name: 'NVIDIA Corporation', ticker: 'NVDA', type: 'public', assetClass: 'Public Equity', sector: 'Semiconductors', geography: 'United States', riskLevel: 'Moderate', liquidity: 'High', valuation: '$3,120B', expectedReturn: 22.5, logoLetter: 'N' },
  { companyId: 'msft', name: 'Microsoft Corporation', ticker: 'MSFT', type: 'public', assetClass: 'Public Equity', sector: 'Enterprise Software & Cloud', geography: 'United States', riskLevel: 'Low', liquidity: 'High', valuation: '$3,180B', expectedReturn: 14.2, logoLetter: 'M' },
  { companyId: 'amzn', name: 'Amazon.com, Inc.', ticker: 'AMZN', type: 'public', assetClass: 'Public Equity', sector: 'Cloud & E-Commerce', geography: 'United States', riskLevel: 'Moderate', liquidity: 'High', valuation: '$2,040B', expectedReturn: 16.8, logoLetter: 'A' },
  { companyId: 'googl', name: 'Alphabet Inc.', ticker: 'GOOGL', type: 'public', assetClass: 'Public Equity', sector: 'Internet & Search', geography: 'United States', riskLevel: 'Low', liquidity: 'High', valuation: '$2,210B', expectedReturn: 13.5, logoLetter: 'G' },
  { companyId: 'meta', name: 'Meta Platforms, Inc.', ticker: 'META', type: 'public', assetClass: 'Public Equity', sector: 'Social Platforms & AI', geography: 'United States', riskLevel: 'Moderate', liquidity: 'High', valuation: '$1,480B', expectedReturn: 15.8, logoLetter: 'M' },
  { companyId: 'tsla', name: 'Tesla, Inc.', ticker: 'TSLA', type: 'public', assetClass: 'Public Equity', sector: 'Automotive & Clean Energy', geography: 'United States', riskLevel: 'High', liquidity: 'High', valuation: '$792B', expectedReturn: 18.5, logoLetter: 'T' },
  { companyId: 'amd', name: 'Advanced Micro Devices', ticker: 'AMD', type: 'public', assetClass: 'Public Equity', sector: 'Semiconductors', geography: 'United States', riskLevel: 'Moderate', liquidity: 'High', valuation: '$249B', expectedReturn: 20.2, logoLetter: 'A' },
  { companyId: 'avgo', name: 'Broadcom Inc.', ticker: 'AVGO', type: 'public', assetClass: 'Public Equity', sector: 'Semiconductors & Infrastructure', geography: 'United States', riskLevel: 'Moderate', liquidity: 'High', valuation: '$785B', expectedReturn: 16.0, logoLetter: 'B' },
  { companyId: 'tsm', name: 'Taiwan Semiconductor Mfg', ticker: 'TSM', type: 'public', assetClass: 'Public Equity', sector: 'Semiconductors', geography: 'Taiwan', riskLevel: 'Moderate', liquidity: 'High', valuation: '$890B', expectedReturn: 18.2, logoLetter: 'T' },
  { companyId: 'cerebras', name: 'Cerebras Systems', type: 'private', assetClass: 'Venture', sector: 'Semiconductors & Wafer-Scale AI', geography: 'United States', riskLevel: 'Moderate', liquidity: 'Low', valuation: '$8.2B (Demo)', expectedReturn: 35.0, logoLetter: 'C' },
  { companyId: 'helsing', name: 'Helsing AI', type: 'private', assetClass: 'Private Equity', sector: 'Defense & Autonomous Sensor Fusion', geography: 'Europe', riskLevel: 'Low', liquidity: 'Low', valuation: '$5.4B (Demo)', expectedReturn: 24.0, logoLetter: 'H' },
  { companyId: 'coreweave', name: 'CoreWeave', type: 'private', assetClass: 'Private Equity', sector: 'Specialized Cloud & GPU Compute', geography: 'United States', riskLevel: 'Managed', liquidity: 'Low', valuation: '$19.1B (Demo)', expectedReturn: 28.0, logoLetter: 'CW' },
  { companyId: 'mistral', name: 'Mistral AI', type: 'private', assetClass: 'Venture', sector: 'Frontier AI Foundation Models', geography: 'Europe', riskLevel: 'Moderate', liquidity: 'Low', valuation: '$6.2B (Demo)', expectedReturn: 32.0, logoLetter: 'M' },
];
