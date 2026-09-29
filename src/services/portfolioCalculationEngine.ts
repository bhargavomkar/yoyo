// ============================================================
// FARO — Centralized Calculation Engine
// ============================================================
// All portfolio math lives here. No calculation logic in UI.
// Designed to be replaceable with real market-data backends.
// ============================================================

import {
  AssetClassSlice,
  PortfolioHolding,
  PortfolioRiskMetrics,
  ExposureItem,
  ConcentrationAnalysis,
  CorrelationEntry,
  StressScenario,
  AllocationScenario,
  ExpectedReturnModel,
  EfficientFrontierPoint,
  RiskMetricWithExplanation,
  StressScenarioKey,
  AssetClassAllocation,
} from '@/types/portfolio';

// ---- Color Map for Asset Classes ----
export const ASSET_CLASS_COLORS: Record<AssetClassAllocation, string> = {
  'Public Equity': '#87BAA4',
  'Private Equity': '#6B9A8A',
  'Venture': '#9AA19E',
  'Cash': '#BAD6CC',
  'Fixed Income': '#7A8E86',
  'Real Assets': '#5A7A6E',
  'Alternatives': '#A8B5B0',
};

// ---- 1. Allocation Calculations ----

export function calculateAssetAllocation(
  totalCapital: number,
  slices: { assetClass: AssetClassAllocation; percent: number }[]
): AssetClassSlice[] {
  return slices.map((s) => ({
    assetClass: s.assetClass,
    allocationPercent: s.percent,
    capitalAmount: Math.round(totalCapital * (s.percent / 100)),
    color: ASSET_CLASS_COLORS[s.assetClass],
  }));
}

export function getAllocatedCapital(slices: AssetClassSlice[]): number {
  return slices.reduce((sum, s) => sum + s.capitalAmount, 0);
}

export function getUnallocatedPercent(slices: AssetClassSlice[]): number {
  const total = slices.reduce((sum, s) => sum + s.allocationPercent, 0);
  return Math.max(0, 100 - total);
}

export function isAllocationValid(slices: { percent: number }[]): boolean {
  const total = slices.reduce((sum, s) => sum + s.percent, 0);
  return Math.abs(total - 100) < 0.01;
}

// ---- 2. Expected Return Calculations ----

export function calculateExpectedReturn(holdings: PortfolioHolding[]): ExpectedReturnModel {
  const holdingReturns = holdings.map((h) => ({
    holdingId: h.id,
    name: h.name,
    capitalAllocated: h.capitalAllocated,
    expectedReturn: h.expectedReturn,
    expectedGain: h.capitalAllocated * (h.expectedReturn / 100),
    expectedLoss: h.capitalAllocated * (Math.min(h.expectedReturn * -0.5, -5) / 100),
    holdingPeriod: h.holdingPeriod,
  }));

  const totalCapital = holdings.reduce((s, h) => s + h.capitalAllocated, 0);
  const weightedReturn = totalCapital > 0
    ? holdings.reduce((s, h) => s + (h.capitalAllocated / totalCapital) * h.expectedReturn, 0)
    : 0;

  const totalGain = holdingReturns.reduce((s, h) => s + h.expectedGain, 0);
  const totalLoss = holdingReturns.reduce((s, h) => s + h.expectedLoss, 0);

  return {
    holdingReturns,
    portfolioExpectedReturn: Math.round(weightedReturn * 10) / 10,
    portfolioExpectedGain: Math.round(totalGain),
    portfolioExpectedLoss: Math.round(totalLoss),
    assumptions: [
      'Returns are model estimates based on selected scenario assumptions.',
      'Expected gain assumes base-case revenue growth and margin expansion.',
      'Expected loss models a 1-sigma negative deviation from base case.',
      'Holding period returns are not annualized unless stated.',
    ],
  };
}

// ---- 3. Portfolio Risk Calculations ----

export function calculatePortfolioRisk(holdings: PortfolioHolding[]): PortfolioRiskMetrics {
  if (holdings.length === 0) {
    return emptyRiskMetrics();
  }

  const totalCapital = holdings.reduce((s, h) => s + h.capitalAllocated, 0);

  // Volatility: weighted average of per-holding implied vols
  const holdingVols = holdings.map((h) => {
    const baseVol = h.type === 'private' ? 35 : h.riskLevel === 'High' ? 28 : h.riskLevel === 'Moderate' ? 22 : 14;
    return { weight: h.capitalAllocated / totalCapital, vol: baseVol };
  });
  const weightedVol = holdingVols.reduce((s, hv) => s + hv.weight * hv.vol, 0);
  const diversificationDiscount = Math.max(0.65, 1 - holdings.length * 0.03);
  const portfolioVol = Math.round(weightedVol * diversificationDiscount * 10) / 10;

  // Max Drawdown (empirical approximation)
  const maxDrawdown = Math.round(portfolioVol * 1.6 * 10) / 10;

  // Concentration (Herfindahl)
  const hhi = holdings.reduce((s, h) => s + Math.pow(h.allocationPercent, 2), 0);
  const concentrationScore = Math.round(Math.min(100, hhi / 10));

  // Liquidity
  const liquidWeights = holdings.reduce((s, h) => {
    const liq = h.liquidity === 'High' ? 100 : h.liquidity === 'Medium' ? 70 : h.liquidity === 'Low' ? 40 : 10;
    return s + (h.capitalAllocated / totalCapital) * liq;
  }, 0);
  const liquidityScore = Math.round(liquidWeights);

  // Sector Exposure
  const sectorMap = new Map<string, number>();
  holdings.forEach((h) => {
    sectorMap.set(h.sector, (sectorMap.get(h.sector) || 0) + h.allocationPercent);
  });
  const sectorColors = ['#87BAA4', '#9AA19E', '#BAD6CC', '#6B9A8A', '#7A8E86', '#5A7A6E', '#A8B5B0'];
  let colorIdx = 0;
  const sectorExposure: ExposureItem[] = Array.from(sectorMap.entries()).map(([name, pct]) => ({
    name,
    percent: Math.round(pct * 10) / 10,
    capitalAmount: Math.round(totalCapital * (pct / 100)),
    threshold: 35,
    isOverConcentrated: pct > 35,
    color: sectorColors[colorIdx++ % sectorColors.length],
  })).sort((a, b) => b.percent - a.percent);

  // Geographic Exposure
  const geoMap = new Map<string, number>();
  holdings.forEach((h) => {
    geoMap.set(h.geography, (geoMap.get(h.geography) || 0) + h.allocationPercent);
  });
  colorIdx = 0;
  const geographicExposure: ExposureItem[] = Array.from(geoMap.entries()).map(([name, pct]) => ({
    name,
    percent: Math.round(pct * 10) / 10,
    capitalAmount: Math.round(totalCapital * (pct / 100)),
    threshold: 50,
    isOverConcentrated: pct > 50,
    color: sectorColors[colorIdx++ % sectorColors.length],
  })).sort((a, b) => b.percent - a.percent);

  // Correlation (simplified average)
  const correlationAverage = holdings.length > 1 ? 0.62 : 1.0;

  // Downside exposure (2-sigma)
  const downsideExposure = Math.round(portfolioVol * 2 * 10) / 10;

  return {
    volatility: portfolioVol,
    maxDrawdown,
    concentrationScore,
    liquidityScore,
    sectorExposure,
    geographicExposure,
    correlationAverage,
    downsideExposure,
    sharpeRatio: Math.round(((14.8 - 5.2) / portfolioVol) * 100) / 100,
    sortinoRatio: Math.round(((14.8 - 5.2) / (portfolioVol * 0.7)) * 100) / 100,
    valueAtRisk95: Math.round(portfolioVol * 1.645 * 10) / 10,
    betaToMarket: Math.round((portfolioVol / 16) * 100) / 100,
  };
}

function emptyRiskMetrics(): PortfolioRiskMetrics {
  return {
    volatility: 0, maxDrawdown: 0, concentrationScore: 0, liquidityScore: 100,
    sectorExposure: [], geographicExposure: [], correlationAverage: 0,
    downsideExposure: 0, sharpeRatio: 0, sortinoRatio: 0, valueAtRisk95: 0, betaToMarket: 0,
  };
}

// ---- 4. Concentration Analysis ----

export function calculateConcentration(holdings: PortfolioHolding[]): ConcentrationAnalysis {
  const byName = holdings.map((h) => ({
    name: h.name, percent: h.allocationPercent, threshold: 15, isOver: h.allocationPercent > 15,
  })).sort((a, b) => b.percent - a.percent);

  const sectorMap = new Map<string, number>();
  holdings.forEach((h) => sectorMap.set(h.sector, (sectorMap.get(h.sector) || 0) + h.allocationPercent));
  const bySector = Array.from(sectorMap.entries()).map(([name, pct]) => ({
    name, percent: Math.round(pct * 10) / 10, threshold: 35, isOver: pct > 35,
  })).sort((a, b) => b.percent - a.percent);

  const geoMap = new Map<string, number>();
  holdings.forEach((h) => geoMap.set(h.geography, (geoMap.get(h.geography) || 0) + h.allocationPercent));
  const byGeo = Array.from(geoMap.entries()).map(([name, pct]) => ({
    name, percent: Math.round(pct * 10) / 10, threshold: 50, isOver: pct > 50,
  })).sort((a, b) => b.percent - a.percent);

  const acMap = new Map<string, number>();
  holdings.forEach((h) => acMap.set(h.assetClass, (acMap.get(h.assetClass) || 0) + h.allocationPercent));
  const byAC = Array.from(acMap.entries()).map(([name, pct]) => ({
    name, percent: Math.round(pct * 10) / 10, threshold: 40, isOver: pct > 40,
  })).sort((a, b) => b.percent - a.percent);

  const hhi = holdings.reduce((s, h) => s + Math.pow(h.allocationPercent, 2), 0);

  return {
    topHoldings: byName.slice(0, 5),
    topSectors: bySector.slice(0, 5),
    topGeographies: byGeo.slice(0, 5),
    topAssetClasses: byAC,
    herfindahlIndex: Math.round(hhi),
  };
}

// ---- 5. Correlation Matrix ----

export function calculateCorrelation(holdings: PortfolioHolding[]): CorrelationEntry[] {
  // Demo correlation data — structured for later replacement with real historical returns
  const demoCorrelations: Record<string, Record<string, number>> = {
    NVDA: { MSFT: 0.72, AMZN: 0.64, GOOGL: 0.68, META: 0.71, TSLA: 0.45, AMD: 0.82, AVGO: 0.78, TSM: 0.75 },
    MSFT: { AMZN: 0.68, GOOGL: 0.74, META: 0.65, TSLA: 0.38, AMD: 0.58, AVGO: 0.62, TSM: 0.56 },
    AMZN: { GOOGL: 0.72, META: 0.63, TSLA: 0.42, AMD: 0.52, AVGO: 0.48, TSM: 0.46 },
    GOOGL: { META: 0.78, TSLA: 0.35, AMD: 0.55, AVGO: 0.52, TSM: 0.50 },
    META: { TSLA: 0.32, AMD: 0.54, AVGO: 0.50, TSM: 0.48 },
    TSLA: { AMD: 0.38, AVGO: 0.30, TSM: 0.28 },
    AMD: { AVGO: 0.72, TSM: 0.78 },
    AVGO: { TSM: 0.70 },
  };

  const entries: CorrelationEntry[] = [];
  const publicHoldings = holdings.filter((h) => h.ticker);

  for (let i = 0; i < publicHoldings.length; i++) {
    for (let j = i + 1; j < publicHoldings.length; j++) {
      const a = publicHoldings[i].ticker!;
      const b = publicHoldings[j].ticker!;
      const corr = demoCorrelations[a]?.[b] ?? demoCorrelations[b]?.[a] ?? 0.5;
      entries.push({
        holdingA: publicHoldings[i].name,
        holdingB: publicHoldings[j].name,
        tickerA: a,
        tickerB: b,
        correlation: corr,
      });
    }
  }

  return entries;
}

// ---- 6. Stress Testing ----

export function runStressTest(
  holdings: PortfolioHolding[],
  totalCapital: number,
  scenarioKey: StressScenarioKey
): StressScenario {
  const scenarios: Record<StressScenarioKey, Omit<StressScenario, 'affectedHoldings' | 'estimatedLoss'>> = {
    'market-crash': {
      id: 'market-crash',
      name: 'Market Crash',
      description: 'Broad market decline of 25-35% over 3-6 months, similar to Q1 2020 or 2008.',
      portfolioImpactPercent: -18.4,
      affectedSectors: ['Technology', 'Growth Equities', 'Venture'],
      riskDrivers: ['Systematic risk', 'Liquidity contraction', 'Margin calls', 'Correlation convergence'],
      historicalPrecedent: 'S&P 500 declined 34% in March 2020; Nasdaq fell 38%.',
      epistemicStatus: 'MODEL ANALYSIS',
    },
    'recession': {
      id: 'recession',
      name: 'Recession',
      description: 'Economic contraction with declining GDP, rising unemployment, and earnings compression.',
      portfolioImpactPercent: -14.2,
      affectedSectors: ['Consumer', 'Private Equity', 'Venture'],
      riskDrivers: ['Revenue slowdown', 'Multiple compression', 'Credit tightening', 'Consumer weakness'],
      historicalPrecedent: 'During 2008-09 recession, S&P 500 lost 57% peak-to-trough.',
      epistemicStatus: 'MODEL ANALYSIS',
    },
    'interest-rate-shock': {
      id: 'interest-rate-shock',
      name: 'Interest Rate Shock',
      description: 'Unexpected 200bp rate increase compressing growth multiples and DCF valuations.',
      portfolioImpactPercent: -12.8,
      affectedSectors: ['High-Growth Tech', 'Private Equity', 'Real Estate'],
      riskDrivers: ['Discount rate increase', 'Multiple compression', 'Duration risk', 'Refinancing risk'],
      historicalPrecedent: '2022 Fed hiking cycle caused Nasdaq to decline 33%.',
      epistemicStatus: 'MODEL ANALYSIS',
    },
    'tech-crash': {
      id: 'tech-crash',
      name: 'Technology Sector Crash',
      description: 'Technology sector drawdown of 30-45% driven by regulation, demand shift, or bubble unwind.',
      portfolioImpactPercent: -22.6,
      affectedSectors: ['Semiconductors', 'Cloud', 'AI', 'SaaS'],
      riskDrivers: ['Sector concentration', 'Multiple contraction', 'AI capex reduction', 'Regulatory intervention'],
      historicalPrecedent: 'Dot-com bust (2000-02): Nasdaq fell 78% peak-to-trough.',
      epistemicStatus: 'MODEL ANALYSIS',
    },
    'currency-shock': {
      id: 'currency-shock',
      name: 'Currency Shock',
      description: 'USD strengthens 15-20% against major currencies, impacting international revenue.',
      portfolioImpactPercent: -6.4,
      affectedSectors: ['International Revenue Companies', 'Emerging Markets'],
      riskDrivers: ['FX translation losses', 'International demand impact', 'EM capital outflows'],
      historicalPrecedent: '2014-15 USD rally reduced S&P 500 EPS by ~5% from FX headwinds.',
      epistemicStatus: 'ESTIMATE',
    },
    'commodity-shock': {
      id: 'commodity-shock',
      name: 'Commodity Shock',
      description: 'Energy prices spike 50%+ from supply disruption or geopolitical crisis.',
      portfolioImpactPercent: -8.2,
      affectedSectors: ['Manufacturing', 'Transportation', 'Consumer'],
      riskDrivers: ['Input cost inflation', 'Margin compression', 'Consumer spending reduction'],
      historicalPrecedent: '2022 energy crisis caused European industrials to decline 20-30%.',
      epistemicStatus: 'ESTIMATE',
    },
    'liquidity-shock': {
      id: 'liquidity-shock',
      name: 'Liquidity Shock',
      description: 'Credit markets seize, private valuations drop 30-50%, exit timelines extend 2-3 years.',
      portfolioImpactPercent: -15.6,
      affectedSectors: ['Private Equity', 'Venture', 'Alternatives'],
      riskDrivers: ['Exit market closure', 'Valuation markdowns', 'Capital call defaults', 'Fund-level liquidity'],
      historicalPrecedent: '2023 SVB crisis froze venture lending; private valuations marked down 30-50%.',
      epistemicStatus: 'MODEL ANALYSIS',
    },
  };

  const base = scenarios[scenarioKey];
  
  // Calculate per-holding impacts
  const sectorImpacts: Record<string, number> = {
    'Semiconductors': scenarioKey === 'tech-crash' ? -35 : scenarioKey === 'market-crash' ? -22 : -12,
    'Enterprise Software & Cloud': scenarioKey === 'tech-crash' ? -30 : scenarioKey === 'interest-rate-shock' ? -20 : -10,
    'Cloud & E-Commerce': scenarioKey === 'tech-crash' ? -28 : scenarioKey === 'recession' ? -18 : -8,
    'Internet & Search': scenarioKey === 'tech-crash' ? -25 : -10,
    'Social Platforms & AI': scenarioKey === 'tech-crash' ? -30 : -12,
    'Automotive & Clean Energy': scenarioKey === 'recession' ? -25 : -15,
    'Consumer Electronics & Services': scenarioKey === 'recession' ? -15 : -8,
    'Semiconductors & Infrastructure': scenarioKey === 'tech-crash' ? -32 : -14,
    'Defense & Autonomous Sensor Fusion': scenarioKey === 'recession' ? -5 : -3,
    'Specialized Cloud & GPU Compute': scenarioKey === 'tech-crash' ? -28 : scenarioKey === 'liquidity-shock' ? -25 : -12,
    'Frontier AI Foundation Models': scenarioKey === 'tech-crash' ? -30 : scenarioKey === 'liquidity-shock' ? -30 : -15,
  };

  const affectedHoldings = holdings.map((h) => {
    let impact = sectorImpacts[h.sector] || base.portfolioImpactPercent;
    if (h.type === 'private' && (scenarioKey === 'liquidity-shock' || scenarioKey === 'recession')) {
      impact *= 1.4;
    }
    return { name: h.name, impact: Math.round(impact * 10) / 10 };
  }).sort((a, b) => a.impact - b.impact);

  // Recalculate total portfolio impact based on holdings
  const totalWeight = holdings.reduce((s, h) => s + h.allocationPercent, 0);
  let portfolioImpact = 0;
  if (totalWeight > 0) {
    holdings.forEach((h) => {
      const hImpact = affectedHoldings.find((ah) => ah.name === h.name)?.impact || base.portfolioImpactPercent;
      portfolioImpact += (h.allocationPercent / totalWeight) * hImpact;
    });
  } else {
    portfolioImpact = base.portfolioImpactPercent;
  }

  return {
    ...base,
    portfolioImpactPercent: Math.round(portfolioImpact * 10) / 10,
    estimatedLoss: Math.round(totalCapital * (portfolioImpact / 100)),
    affectedHoldings,
  };
}

// ---- 7. Scenario Modeling ----

export function calculateScenario(
  holdings: PortfolioHolding[],
  totalCapital: number,
  type: 'base' | 'bull' | 'bear' | 'stress'
): AllocationScenario {
  const multipliers: Record<string, { returnMult: number; drawdownMult: number; riskMult: number }> = {
    base: { returnMult: 1.0, drawdownMult: 1.0, riskMult: 1.0 },
    bull: { returnMult: 1.5, drawdownMult: 0.6, riskMult: 0.8 },
    bear: { returnMult: 0.4, drawdownMult: 1.8, riskMult: 1.4 },
    stress: { returnMult: -0.3, drawdownMult: 2.5, riskMult: 1.8 },
  };

  const m = multipliers[type];
  const baseReturn = calculateExpectedReturn(holdings);
  const baseRisk = calculatePortfolioRisk(holdings);

  const scenarioReturn = Math.round(baseReturn.portfolioExpectedReturn * m.returnMult * 10) / 10;
  const scenarioValue = Math.round(totalCapital * (1 + scenarioReturn / 100));

  const assumptionSets: Record<string, { label: string; value: string; num: number }[]> = {
    base: [
      { label: 'Revenue Growth', value: '20%', num: 20 },
      { label: 'Operating Margin', value: '25%', num: 25 },
      { label: 'Valuation Multiple', value: '25x', num: 25 },
      { label: 'Risk-Free Rate', value: '4.5%', num: 4.5 },
    ],
    bull: [
      { label: 'Revenue Growth', value: '30%', num: 30 },
      { label: 'Operating Margin', value: '30%', num: 30 },
      { label: 'Valuation Multiple', value: '35x', num: 35 },
      { label: 'Risk-Free Rate', value: '3.5%', num: 3.5 },
    ],
    bear: [
      { label: 'Revenue Growth', value: '8%', num: 8 },
      { label: 'Operating Margin', value: '18%', num: 18 },
      { label: 'Valuation Multiple', value: '18x', num: 18 },
      { label: 'Risk-Free Rate', value: '6.0%', num: 6 },
    ],
    stress: [
      { label: 'Revenue Growth', value: '-5%', num: -5 },
      { label: 'Operating Margin', value: '12%', num: 12 },
      { label: 'Valuation Multiple', value: '12x', num: 12 },
      { label: 'Risk-Free Rate', value: '7.5%', num: 7.5 },
    ],
  };

  const names: Record<string, string> = {
    base: 'Base Case', bull: 'Bull Case', bear: 'Bear Case', stress: 'Stress Case',
  };

  return {
    id: `scenario-${type}`,
    name: names[type],
    type,
    assumptions: assumptionSets[type].map((a) => ({
      label: a.label,
      value: a.value,
      numericValue: a.num,
      epistemicStatus: 'ASSUMPTION',
    })),
    portfolioValue: scenarioValue,
    expectedReturn: scenarioReturn,
    expectedDrawdown: Math.round(baseRisk.maxDrawdown * m.drawdownMult * 10) / 10,
    riskScore: Math.round(baseRisk.volatility * m.riskMult * 10) / 10,
    liquidity: baseRisk.liquidityScore,
  };
}

// ---- 8. Efficient Frontier ----

export function calculateEfficientFrontier(
  holdings: PortfolioHolding[],
  totalCapital: number
): EfficientFrontierPoint[] {
  const currentRisk = calculatePortfolioRisk(holdings);
  const currentReturn = calculateExpectedReturn(holdings);

  const points: EfficientFrontierPoint[] = [
    // Current portfolio
    {
      id: 'current',
      label: 'Current Portfolio',
      risk: currentRisk.volatility,
      expectedReturn: currentReturn.portfolioExpectedReturn,
      isCurrentPortfolio: true,
      isCandidatePortfolio: false,
    },
    // Conservative
    { id: 'conservative', label: 'Conservative', risk: 8.5, expectedReturn: 7.2, isCurrentPortfolio: false, isCandidatePortfolio: true },
    // Balanced
    { id: 'balanced', label: 'Balanced', risk: 12.4, expectedReturn: 10.8, isCurrentPortfolio: false, isCandidatePortfolio: true },
    // Growth
    { id: 'growth', label: 'Growth', risk: 16.8, expectedReturn: 13.5, isCurrentPortfolio: false, isCandidatePortfolio: true },
    // Aggressive
    { id: 'aggressive', label: 'Aggressive', risk: 22.5, expectedReturn: 16.2, isCurrentPortfolio: false, isCandidatePortfolio: true },
    // Max Return
    { id: 'max-return', label: 'Max Return', risk: 28.0, expectedReturn: 18.4, isCurrentPortfolio: false, isCandidatePortfolio: true },
    // Min Risk
    { id: 'min-risk', label: 'Min Risk', risk: 5.2, expectedReturn: 5.0, isCurrentPortfolio: false, isCandidatePortfolio: true },
    // 60/40
    { id: '60-40', label: '60/40 Traditional', risk: 10.2, expectedReturn: 8.4, isCurrentPortfolio: false, isCandidatePortfolio: true },
  ];

  return points;
}

// ---- 9. Risk Explanations ----

export function buildRiskExplanations(metrics: PortfolioRiskMetrics, holdings: PortfolioHolding[]): RiskMetricWithExplanation[] {
  return [
    {
      metricName: 'Annualized Volatility',
      metricValue: `${metrics.volatility}%`,
      numericValue: metrics.volatility,
      unit: '%',
      severity: metrics.volatility > 25 ? 'critical' : metrics.volatility > 18 ? 'high' : metrics.volatility > 12 ? 'moderate' : 'low',
      explanation: {
        what: `The portfolio's annualized volatility is ${metrics.volatility}%, measuring expected price dispersion.`,
        why: `Driven by ${metrics.sectorExposure[0]?.name || 'technology'} concentration (${metrics.sectorExposure[0]?.percent || 0}%) and ${holdings.filter(h => h.type === 'private').length} illiquid private holdings.`,
        impact: `In a normal distribution, 68% of annual returns are expected within ±${metrics.volatility}% of the mean.`,
        evidence: 'Calculated from weighted-average implied volatilities of individual holdings with diversification discount.',
        assumption: 'Uses static volatility estimates. Real implementation would use trailing 252-day realized vol and option-implied vol.',
      },
    },
    {
      metricName: 'Maximum Drawdown',
      metricValue: `${metrics.maxDrawdown}%`,
      numericValue: metrics.maxDrawdown,
      unit: '%',
      severity: metrics.maxDrawdown > 35 ? 'critical' : metrics.maxDrawdown > 25 ? 'high' : metrics.maxDrawdown > 15 ? 'moderate' : 'low',
      explanation: {
        what: `The estimated maximum peak-to-trough drawdown is ${metrics.maxDrawdown}%.`,
        why: 'High-growth and technology-heavy allocations historically experience deeper drawdowns during systematic sell-offs.',
        impact: `A portfolio worth $10M could temporarily decline to $${((10 * (100 - metrics.maxDrawdown)) / 100).toFixed(1)}M during extreme market events.`,
        evidence: 'Approximated as 1.6× annualized volatility based on empirical equity drawdown relationships.',
        assumption: 'Assumes normally distributed returns. Fat-tail events (e.g. 2008) can exceed this estimate.',
      },
    },
    {
      metricName: 'Concentration Score',
      metricValue: `${metrics.concentrationScore}/100`,
      numericValue: metrics.concentrationScore,
      unit: '/100',
      severity: metrics.concentrationScore > 40 ? 'high' : metrics.concentrationScore > 25 ? 'moderate' : 'low',
      explanation: {
        what: `The portfolio concentration index is ${metrics.concentrationScore}/100 (Herfindahl-based).`,
        why: `The largest position represents ${holdings.length > 0 ? Math.max(...holdings.map(h => h.allocationPercent)) : 0}% of the portfolio.`,
        impact: 'Higher concentration means greater sensitivity to individual company events (earnings miss, regulatory action, etc.).',
        evidence: 'Computed from the Herfindahl-Hirschman Index (sum of squared allocation weights).',
        assumption: 'Threshold of 15% per position and 35% per sector used as institutional guideline.',
      },
    },
    {
      metricName: 'Liquidity Score',
      metricValue: `${metrics.liquidityScore}/100`,
      numericValue: metrics.liquidityScore,
      unit: '/100',
      severity: metrics.liquidityScore < 40 ? 'high' : metrics.liquidityScore < 60 ? 'moderate' : 'low',
      explanation: {
        what: `Portfolio liquidity is scored at ${metrics.liquidityScore}/100 (100 = fully liquid).`,
        why: `${holdings.filter(h => h.type === 'private').length} private holdings and ${holdings.filter(h => h.liquidity === 'Low' || h.liquidity === 'Illiquid').length} low-liquidity positions reduce aggregate liquidity.`,
        impact: 'In a liquidity event, illiquid positions cannot be exited quickly without significant discount to fair value.',
        evidence: 'Weighted average of per-holding liquidity scores (High=100, Medium=70, Low=40, Illiquid=10).',
        assumption: 'Private holdings assumed to require 6-18 months for exit. Public holdings assume normal market volumes.',
      },
    },
    {
      metricName: 'Value-at-Risk (95%)',
      metricValue: `${metrics.valueAtRisk95}%`,
      numericValue: metrics.valueAtRisk95,
      unit: '%',
      severity: metrics.valueAtRisk95 > 30 ? 'critical' : metrics.valueAtRisk95 > 20 ? 'high' : metrics.valueAtRisk95 > 12 ? 'moderate' : 'low',
      explanation: {
        what: `With 95% confidence, the portfolio is not expected to lose more than ${metrics.valueAtRisk95}% in a single year.`,
        why: 'VaR is determined by portfolio volatility and the assumed return distribution.',
        impact: `There is a 5% chance of losing more than $${((10 * metrics.valueAtRisk95) / 100).toFixed(1)}M on a $10M portfolio.`,
        evidence: 'Calculated as 1.645 × annualized volatility (parametric VaR, normal distribution).',
        assumption: 'Assumes normal distribution of returns. Does not capture tail risk events.',
      },
    },
  ];
}

// ---- 10. Portfolio AI Response Generator ----

export function generatePortfolioAIResponse(query: string, holdings: PortfolioHolding[], totalCapital: number): string {
  const risk = calculatePortfolioRisk(holdings);
  const returnModel = calculateExpectedReturn(holdings);
  const concentration = calculateConcentration(holdings);
  const q = query.toLowerCase();

  if (q.includes('stress') || q.includes('crash') || q.includes('falls') || q.includes('drop')) {
    const stressResult = runStressTest(holdings, totalCapital, 'tech-crash');
    return `**Portfolio Stress Analysis — Technology Sector Crash**\n\n` +
      `Under a modeled technology sector crash scenario, the portfolio's estimated decline is **${stressResult.portfolioImpactPercent}%**, ` +
      `representing an estimated loss of **$${Math.abs(stressResult.estimatedLoss).toLocaleString()}**.\n\n` +
      `**Most Affected Holdings:**\n${stressResult.affectedHoldings.slice(0, 3).map(h => `• ${h.name}: ${h.impact}%`).join('\n')}\n\n` +
      `**Risk Drivers:** ${stressResult.riskDrivers.join(', ')}\n\n` +
      `> ⚠️ **Model Estimate** — This scenario uses historical precedent and sector-specific sensitivity models. Actual outcomes may differ materially.`;
  }

  if (q.includes('concentration') || q.includes('diversif')) {
    return `**Concentration Analysis**\n\n` +
      `**Largest Position:** ${concentration.topHoldings[0]?.name || 'N/A'} at ${concentration.topHoldings[0]?.percent || 0}% ` +
      `(threshold: ${concentration.topHoldings[0]?.threshold || 15}%)\n\n` +
      `**Largest Sector:** ${concentration.topSectors[0]?.name || 'N/A'} at ${concentration.topSectors[0]?.percent || 0}% ` +
      `(threshold: ${concentration.topSectors[0]?.threshold || 35}%)\n\n` +
      `**Recommendation:** Consider reducing the largest position to below 15% and diversifying sector exposure across at least 4 sectors.\n\n` +
      `> **Proposed Allocation** — These suggestions are based on institutional diversification guidelines, not guaranteed outcomes.`;
  }

  if (q.includes('assumption') || q.includes('driving')) {
    return `**Assumptions Driving Expected Return**\n\n` +
      `The portfolio's modeled expected return of **${returnModel.portfolioExpectedReturn}%** is driven by:\n\n` +
      returnModel.assumptions.map((a, i) => `${i + 1}. ${a}`).join('\n') + '\n\n' +
      `**Key Input Sensitivities:**\n` +
      `• Revenue growth ±5% changes expected return by ~±2.1%\n` +
      `• Multiple compression of 5x reduces return by ~3.8%\n` +
      `• Interest rate +100bp reduces growth stock valuations by ~8-12%\n\n` +
      `> **Model Estimate** — Returns are not guaranteed. All projections use base-case assumptions.`;
  }

  if (q.includes('risk') || q.includes('which holdings')) {
    return `**Portfolio Risk Attribution**\n\n` +
      `**Annualized Volatility:** ${risk.volatility}%\n` +
      `**95% Value-at-Risk:** ${risk.valueAtRisk95}%\n` +
      `**Maximum Drawdown:** ${risk.maxDrawdown}%\n\n` +
      `**Top Risk Contributors:**\n` +
      holdings.sort((a, b) => {
        const riskOrder = { High: 3, Moderate: 2, Managed: 1, Low: 0 };
        return riskOrder[b.riskLevel] - riskOrder[a.riskLevel];
      }).slice(0, 3).map(h => `• **${h.name}** — ${h.allocationPercent}% allocation, ${h.riskLevel} risk, ${h.expectedReturn}% expected return`).join('\n') + '\n\n' +
      `> **Model Estimate** — Risk metrics are calculated from static volatility estimates and will be refined with historical return data.`;
  }

  // General portfolio summary
  return `**Portfolio Summary**\n\n` +
    `**Total Capital:** $${totalCapital.toLocaleString()}\n` +
    `**Expected Return:** ${returnModel.portfolioExpectedReturn}% (Model Estimate)\n` +
    `**Volatility:** ${risk.volatility}%\n` +
    `**Holdings:** ${holdings.length}\n` +
    `**Liquidity Score:** ${risk.liquidityScore}/100\n\n` +
    `Technology exposure represents ${concentration.topSectors[0]?.percent || 0}% of the modeled portfolio. ` +
    `The largest individual position represents ${concentration.topHoldings[0]?.percent || 0}%. ` +
    `Under the modeled technology-sector stress scenario, the portfolio's estimated decline is ` +
    `${runStressTest(holdings, totalCapital, 'tech-crash').portfolioImpactPercent}%.\n\n` +
    `> **Model Estimate** — All outputs are based on current assumptions and demo data. They are not investment advice.`;
}

// ---- Format Helpers ----

export function formatCurrency(value: number): string {
  if (Math.abs(value) >= 1_000_000_000) return `$${(value / 1_000_000_000).toFixed(1)}B`;
  if (Math.abs(value) >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (Math.abs(value) >= 1_000) return `$${(value / 1_000).toFixed(0)}K`;
  return `$${value.toLocaleString()}`;
}

export function formatPercent(value: number): string {
  return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
}
