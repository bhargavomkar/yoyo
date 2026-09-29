// ============================================================
// FARO — Capital Allocation & Risk Engine Types
// ============================================================

import { PublicCompanyIdentity, PrivateCompanyIdentity, EpistemicStatus } from './research';

// ---- Core Portfolio Types ----

export type AssetClassAllocation =
  | 'Public Equity'
  | 'Private Equity'
  | 'Venture'
  | 'Cash'
  | 'Fixed Income'
  | 'Real Assets'
  | 'Alternatives';

export type RiskAppetite = 'Conservative' | 'Moderate' | 'Aggressive';

export type GeographicPreference =
  | 'North America'
  | 'Europe'
  | 'Asia-Pacific'
  | 'Global'
  | 'Emerging Markets';

export type ScenarioType = 'base' | 'bull' | 'bear' | 'stress';

export type StressScenarioKey =
  | 'market-crash'
  | 'recession'
  | 'interest-rate-shock'
  | 'tech-crash'
  | 'currency-shock'
  | 'commodity-shock'
  | 'liquidity-shock';

export type TimeHorizon = 5 | 7 | 10;

// ---- Portfolio Configuration ----

export interface PortfolioConfig {
  availableCapital: number;
  riskAppetite: RiskAppetite;
  investmentHorizon: number; // years
  targetReturn: number; // percentage
  liquidityRequirement: number; // percentage
  geographicPreference: GeographicPreference;
  assetClassPreference: AssetClassAllocation[];
}

// ---- Asset Class Allocation ----

export interface AssetClassSlice {
  assetClass: AssetClassAllocation;
  allocationPercent: number;
  capitalAmount: number;
  color: string;
}

// ---- Portfolio Holding ----

export interface PortfolioHolding {
  id: string;
  companyId: string;
  name: string;
  ticker?: string;
  type: 'public' | 'private';
  assetClass: AssetClassAllocation;
  sector: string;
  geography: string;
  allocationPercent: number;
  capitalAllocated: number;
  expectedReturn: number; // annual %
  expectedGain: number;
  expectedLoss: number;
  holdingPeriod: number; // years
  riskLevel: 'Low' | 'Moderate' | 'High' | 'Managed';
  liquidity: 'High' | 'Medium' | 'Low' | 'Illiquid';
  valuation: string;
  logoLetter: string;
}

// ---- Allocation Scenario ----

export interface AllocationScenario {
  id: string;
  name: string;
  type: ScenarioType;
  assumptions: ScenarioAssumption[];
  portfolioValue: number;
  expectedReturn: number;
  expectedDrawdown: number;
  riskScore: number;
  liquidity: number;
}

export interface ScenarioAssumption {
  label: string;
  value: string;
  numericValue: number;
  epistemicStatus: EpistemicStatus;
}

// ---- Risk Types ----

export interface PortfolioRiskMetrics {
  volatility: number; // annualized %
  maxDrawdown: number; // %
  concentrationScore: number; // 0-100
  liquidityScore: number; // 0-100 (higher = more liquid)
  sectorExposure: ExposureItem[];
  geographicExposure: ExposureItem[];
  correlationAverage: number;
  downsideExposure: number; // % loss in 2-sigma event
  sharpeRatio: number;
  sortinoRatio: number;
  valueAtRisk95: number; // 95% VaR as % of portfolio
  betaToMarket: number;
}

export interface ExposureItem {
  name: string;
  percent: number;
  capitalAmount: number;
  threshold: number; // max recommended %
  isOverConcentrated: boolean;
  color: string;
}

export interface ConcentrationAnalysis {
  topHoldings: { name: string; percent: number; threshold: number; isOver: boolean }[];
  topSectors: { name: string; percent: number; threshold: number; isOver: boolean }[];
  topGeographies: { name: string; percent: number; threshold: number; isOver: boolean }[];
  topAssetClasses: { name: string; percent: number; threshold: number; isOver: boolean }[];
  herfindahlIndex: number; // portfolio concentration index
}

// ---- Correlation Matrix ----

export interface CorrelationEntry {
  holdingA: string;
  holdingB: string;
  tickerA: string;
  tickerB: string;
  correlation: number;
}

// ---- Stress Testing ----

export interface StressScenario {
  id: StressScenarioKey;
  name: string;
  description: string;
  portfolioImpactPercent: number;
  estimatedLoss: number;
  affectedHoldings: { name: string; impact: number }[];
  affectedSectors: string[];
  riskDrivers: string[];
  historicalPrecedent: string;
  epistemicStatus: EpistemicStatus;
}

// ---- Expected Return Model ----

export interface ExpectedReturnModel {
  holdingReturns: {
    holdingId: string;
    name: string;
    capitalAllocated: number;
    expectedReturn: number;
    expectedGain: number;
    expectedLoss: number;
    holdingPeriod: number;
  }[];
  portfolioExpectedReturn: number;
  portfolioExpectedGain: number;
  portfolioExpectedLoss: number;
  assumptions: string[];
}

// ---- Risk Explanation ----

export interface RiskExplanation {
  what: string;
  why: string;
  impact: string;
  evidence: string;
  assumption: string;
}

export interface RiskMetricWithExplanation {
  metricName: string;
  metricValue: string;
  numericValue: number;
  unit: string;
  severity: 'low' | 'moderate' | 'high' | 'critical';
  explanation: RiskExplanation;
}

// ---- Efficient Frontier ----

export interface EfficientFrontierPoint {
  id: string;
  label: string;
  risk: number; // volatility %
  expectedReturn: number; // %
  isCurrentPortfolio: boolean;
  isCandidatePortfolio: boolean;
  allocation?: Record<string, number>;
}

// ---- Saved Portfolio ----

export interface SavedPortfolio {
  id: string;
  name: string;
  capital: number;
  holdings: PortfolioHolding[];
  assetAllocation: AssetClassSlice[];
  config: PortfolioConfig;
  riskMetrics: PortfolioRiskMetrics;
  scenarios: AllocationScenario[];
  createdDate: string;
  lastUpdated: string;
}

// ---- Portfolio Snapshot (for Command Center) ----

export interface PortfolioSnapshot {
  id: string;
  name: string;
  capital: number;
  capitalFormatted: string;
  expectedReturn: string;
  riskLevel: string;
  holdingsCount: number;
  topHolding: string;
  topHoldingPercent: string;
  lastUpdated: string;
  changePercent: string;
  isPositiveChange: boolean;
}
