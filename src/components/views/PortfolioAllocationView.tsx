'use client';

import React, { useState, useMemo, useCallback } from 'react';
import {
  PortfolioHolding,
  PortfolioConfig,
  AssetClassSlice,
  AssetClassAllocation,
  AllocationScenario,
  StressScenario,
  StressScenarioKey,
  ConcentrationAnalysis,
  CorrelationEntry,
  EfficientFrontierPoint,
  RiskMetricWithExplanation,
  ExpectedReturnModel,
  PortfolioRiskMetrics,
  SavedPortfolio,
  TimeHorizon,
} from '@/types/portfolio';
import { AgentMarketplaceService } from '@/services/agentMarketplaceService';
import { OrchestratorService } from '@/services/orchestratorService';
import {
  calculateAssetAllocation,
  getAllocatedCapital,
  getUnallocatedPercent,
  isAllocationValid,
  calculateExpectedReturn,
  calculatePortfolioRisk,
  calculateConcentration,
  calculateCorrelation,
  runStressTest,
  calculateScenario,
  calculateEfficientFrontier,
  buildRiskExplanations,
  generatePortfolioAIResponse,
  formatCurrency,
  formatPercent,
  ASSET_CLASS_COLORS,
} from '@/services/portfolioCalculationEngine';
import {
  DEFAULT_PORTFOLIO_CONFIG,
  DEFAULT_ALLOCATION_PERCENTS,
  DEFAULT_HOLDINGS,
  SAVED_PORTFOLIOS,
  SELECTABLE_INVESTMENTS,
} from '@/lib/portfolio-mock-data';

// ============================================================
// SUB-TAB TYPE
// ============================================================
type PortfolioSubTab = 'overview' | 'allocation' | 'holdings' | 'risk' | 'scenarios' | 'stress' | 'frontier' | 'ai';

// ============================================================
// MAIN VIEW COMPONENT
// ============================================================
export const PortfolioAllocationView: React.FC = () => {
  // ---- State ----
  const [activeSubTab, setActiveSubTab] = useState<PortfolioSubTab>('overview');
  const [config, setConfig] = useState<PortfolioConfig>(DEFAULT_PORTFOLIO_CONFIG);
  const [allocationSlices, setAllocationSlices] = useState(DEFAULT_ALLOCATION_PERCENTS);
  const [holdings, setHoldings] = useState<PortfolioHolding[]>(DEFAULT_HOLDINGS);
  const [savedPortfolios, setSavedPortfolios] = useState<SavedPortfolio[]>(SAVED_PORTFOLIOS);
  const [showInvestmentSelector, setShowInvestmentSelector] = useState(false);
  const [investmentSearch, setInvestmentSearch] = useState('');
  const [activeStressScenario, setActiveStressScenario] = useState<StressScenarioKey>('market-crash');
  const [selectedTimeHorizon, setSelectedTimeHorizon] = useState<TimeHorizon>(7);
  const [aiQuery, setAiQuery] = useState('');
  const [aiResponses, setAiResponses] = useState<{ query: string; response: string }[]>([]);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [savePortfolioName, setSavePortfolioName] = useState('');
  const [showRiskExplanation, setShowRiskExplanation] = useState<string | null>(null);
  const [displayMode, setDisplayMode] = useState<'percentage' | 'capital'>('percentage');

  // ---- Computed Values ----
  const assetSlices: AssetClassSlice[] = useMemo(
    () => calculateAssetAllocation(config.availableCapital, allocationSlices),
    [config.availableCapital, allocationSlices]
  );
  const allocatedCapital = useMemo(() => getAllocatedCapital(assetSlices), [assetSlices]);
  const unallocatedPercent = useMemo(() => getUnallocatedPercent(assetSlices), [assetSlices]);
  const allocationValid = useMemo(() => isAllocationValid(allocationSlices), [allocationSlices]);
  const returnModel: ExpectedReturnModel = useMemo(() => calculateExpectedReturn(holdings), [holdings]);
  const riskMetrics: PortfolioRiskMetrics = useMemo(() => calculatePortfolioRisk(holdings), [holdings]);
  const concentration: ConcentrationAnalysis = useMemo(() => calculateConcentration(holdings), [holdings]);
  const correlationMatrix: CorrelationEntry[] = useMemo(() => calculateCorrelation(holdings), [holdings]);
  const stressResult: StressScenario = useMemo(
    () => runStressTest(holdings, config.availableCapital, activeStressScenario),
    [holdings, config.availableCapital, activeStressScenario]
  );
  const scenarios: AllocationScenario[] = useMemo(
    () => (['base', 'bull', 'bear', 'stress'] as const).map((t) => calculateScenario(holdings, config.availableCapital, t)),
    [holdings, config.availableCapital]
  );
  const frontierPoints: EfficientFrontierPoint[] = useMemo(
    () => calculateEfficientFrontier(holdings, config.availableCapital),
    [holdings, config.availableCapital]
  );
  const riskExplanations: RiskMetricWithExplanation[] = useMemo(
    () => buildRiskExplanations(riskMetrics, holdings),
    [riskMetrics, holdings]
  );

  // ---- Handlers ----
  const handleAllocationChange = useCallback((assetClass: AssetClassAllocation, newPercent: number) => {
    setAllocationSlices((prev) =>
      prev.map((s) => (s.assetClass === assetClass ? { ...s, percent: Math.max(0, Math.min(100, newPercent)) } : s))
    );
  }, []);

  const handleRemoveHolding = useCallback((holdingId: string) => {
    setHoldings((prev) => prev.filter((h) => h.id !== holdingId));
  }, []);

  const handleAddInvestment = useCallback((inv: typeof SELECTABLE_INVESTMENTS[0]) => {
    if (holdings.find((h) => h.companyId === inv.companyId)) return;
    const newHolding: PortfolioHolding = {
      id: `h-${inv.companyId}`,
      companyId: inv.companyId,
      name: inv.name,
      ticker: inv.ticker,
      type: inv.type,
      assetClass: inv.assetClass,
      sector: inv.sector,
      geography: inv.geography,
      allocationPercent: 5,
      capitalAllocated: Math.round(config.availableCapital * 0.05),
      expectedReturn: inv.expectedReturn,
      expectedGain: Math.round(config.availableCapital * 0.05 * (inv.expectedReturn / 100)),
      expectedLoss: Math.round(config.availableCapital * 0.05 * (Math.min(inv.expectedReturn * -0.5, -5) / 100)),
      holdingPeriod: config.investmentHorizon,
      riskLevel: inv.riskLevel,
      liquidity: inv.liquidity,
      valuation: inv.valuation,
      logoLetter: inv.logoLetter,
    };
    setHoldings((prev) => [...prev, newHolding]);
    setShowInvestmentSelector(false);
  }, [holdings, config]);

  const handleHoldingAllocationChange = useCallback((holdingId: string, newPercent: number) => {
    setHoldings((prev) =>
      prev.map((h) =>
        h.id === holdingId
          ? {
              ...h,
              allocationPercent: Math.max(0, Math.min(100, newPercent)),
              capitalAllocated: Math.round(config.availableCapital * (Math.max(0, Math.min(100, newPercent)) / 100)),
            }
          : h
      )
    );
  }, [config.availableCapital]);

  const handleAiSubmit = useCallback(() => {
    if (!aiQuery.trim()) return;
    const response = generatePortfolioAIResponse(aiQuery, holdings, config.availableCapital);
    setAiResponses((prev) => [...prev, { query: aiQuery, response }]);
    setAiQuery('');
  }, [aiQuery, holdings, config.availableCapital]);

  const handleSavePortfolio = useCallback(() => {
    if (!savePortfolioName.trim()) return;
    const newPortfolio: SavedPortfolio = {
      id: `portfolio-${Date.now()}`,
      name: savePortfolioName,
      capital: config.availableCapital,
      holdings: [...holdings],
      assetAllocation: assetSlices,
      config: { ...config },
      riskMetrics,
      scenarios,
      createdDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      lastUpdated: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    };
    setSavedPortfolios((prev) => [...prev, newPortfolio]);
    setShowSaveModal(false);
    setSavePortfolioName('');
  }, [savePortfolioName, config, holdings, assetSlices, riskMetrics, scenarios]);

  const handleRunAnalysis = useCallback(() => {
    // Force recalculate by triggering state update
    setHoldings((prev) => [...prev]);
  }, []);

  // ---- Sub-tab navigation items ----
  const subTabs: { key: PortfolioSubTab; label: string; icon: string }[] = [
    { key: 'overview', label: 'Overview', icon: '◎' },
    { key: 'allocation', label: 'Allocation', icon: '⊞' },
    { key: 'holdings', label: 'Holdings', icon: '⊡' },
    { key: 'risk', label: 'Risk Engine', icon: '⊘' },
    { key: 'scenarios', label: 'Scenarios', icon: '◈' },
    { key: 'stress', label: 'Stress Test', icon: '⚡' },
    { key: 'frontier', label: 'Frontier', icon: '◇' },
    { key: 'ai', label: 'Ask Faro', icon: '✦' },
  ];

  // ============================================================
  // RENDER
  // ============================================================
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, letterSpacing: '-0.03em', color: '#141618' }}>
            Capital Allocation
          </h1>
          <p style={{ fontSize: '0.85rem', color: '#6B7280', marginTop: '4px', maxWidth: '520px' }}>
            Model where capital could go, what drives the outcome, and what could go wrong.
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => {
              const wf = OrchestratorService.createWorkflowFromPrompt({
                objective: 'Run coordinated multi-agent risk simulation across macro, sector concentration, and portfolio factor shifts.',
                targetEntity: 'Active $114.8M Portfolio',
                mode: 'automatic',
                maxBudgetEth: 0.18
              });
              alert(`Faro Orchestrator launched Workflow ${wf.id} (Portfolio Multi-Agent Risk Engine)! Check "Agent Orchestrator" in the sidebar.`);
            }}
            style={{
              padding: '8px 16px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 600,
              backgroundColor: '#141618', color: '#fff', border: 'none', cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            ⚡ Run Multi-Agent Risk Analysis (0.18 ETH)
          </button>
          <button
            onClick={() => {
              const order = AgentMarketplaceService.createWorkOrder({
                taskTitle: 'Stress test current portfolio against 30% technology sector decline',
                taskDescription: 'Simulate cross-asset drawdowns, liquidity redemption capacity, and factor correlation shifts under a 30% multiple contraction.',
                preferredAgentId: 'keystone-risk',
                budgetEth: 0.03,
                priority: 'high',
                requiredOutput: 'Risk Analysis'
              });
              alert(`Work order ${order.id} dispatched to Keystone Risk! Check Work Orders under Operations.`);
            }}
            style={{
              padding: '8px 16px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 600,
              backgroundColor: '#F0F7F4', color: '#245241', border: '1px solid #BAD6CC', cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            🛡️ Ask Risk Agent (0.03 ETH)
          </button>
          <button
            onClick={handleRunAnalysis}
            style={{
              padding: '8px 20px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 600,
              backgroundColor: '#87BAA4', color: '#fff', border: 'none', cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            ↻ Run Analysis
          </button>
          <button
            onClick={() => setShowSaveModal(true)}
            style={{
              padding: '8px 20px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 600,
              backgroundColor: '#fff', color: '#141618', border: '1px solid #EDEDEB', cursor: 'pointer',
            }}
          >
            💾 Save Portfolio
          </button>
        </div>
      </div>

      {/* Sub-tab navigation */}
      <div style={{ display: 'flex', gap: '4px', borderBottom: '1px solid #EDEDEB', paddingBottom: '0', overflowX: 'auto' }}>
        {subTabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveSubTab(tab.key)}
            style={{
              padding: '8px 16px', fontSize: '0.78rem', fontWeight: activeSubTab === tab.key ? 600 : 400,
              color: activeSubTab === tab.key ? '#141618' : '#6B7280',
              background: 'transparent', 
              borderTopWidth: 0, borderLeftWidth: 0, borderRightWidth: 0,
              borderBottomWidth: '2px', 
              borderBottomStyle: 'solid',
              borderBottomColor: activeSubTab === tab.key ? '#87BAA4' : 'transparent',
              cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.2s',
            }}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* ====== OVERVIEW ====== */}
      {activeSubTab === 'overview' && (
        <OverviewPanel
          config={config}
          setConfig={setConfig}
          returnModel={returnModel}
          riskMetrics={riskMetrics}
          concentration={concentration}
          holdings={holdings}
          scenarios={scenarios}
          savedPortfolios={savedPortfolios}
        />
      )}

      {/* ====== ALLOCATION ====== */}
      {activeSubTab === 'allocation' && (
        <AllocationPanel
          config={config}
          allocationSlices={allocationSlices}
          assetSlices={assetSlices}
          allocatedCapital={allocatedCapital}
          unallocatedPercent={unallocatedPercent}
          allocationValid={allocationValid}
          displayMode={displayMode}
          setDisplayMode={setDisplayMode}
          onAllocationChange={handleAllocationChange}
        />
      )}

      {/* ====== HOLDINGS ====== */}
      {activeSubTab === 'holdings' && (
        <HoldingsPanel
          holdings={holdings}
          config={config}
          returnModel={returnModel}
          showInvestmentSelector={showInvestmentSelector}
          setShowInvestmentSelector={setShowInvestmentSelector}
          investmentSearch={investmentSearch}
          setInvestmentSearch={setInvestmentSearch}
          onAddInvestment={handleAddInvestment}
          onRemoveHolding={handleRemoveHolding}
          onAllocationChange={handleHoldingAllocationChange}
        />
      )}

      {/* ====== RISK ENGINE ====== */}
      {activeSubTab === 'risk' && (
        <RiskEnginePanel
          riskMetrics={riskMetrics}
          riskExplanations={riskExplanations}
          concentration={concentration}
          correlationMatrix={correlationMatrix}
          holdings={holdings}
          showRiskExplanation={showRiskExplanation}
          setShowRiskExplanation={setShowRiskExplanation}
        />
      )}

      {/* ====== SCENARIOS ====== */}
      {activeSubTab === 'scenarios' && (
        <ScenariosPanel
          scenarios={scenarios}
          config={config}
          selectedTimeHorizon={selectedTimeHorizon}
          setSelectedTimeHorizon={setSelectedTimeHorizon}
        />
      )}

      {/* ====== STRESS TEST ====== */}
      {activeSubTab === 'stress' && (
        <StressTestPanel
          stressResult={stressResult}
          activeStressScenario={activeStressScenario}
          setActiveStressScenario={setActiveStressScenario}
          config={config}
        />
      )}

      {/* ====== EFFICIENT FRONTIER ====== */}
      {activeSubTab === 'frontier' && (
        <FrontierPanel frontierPoints={frontierPoints} />
      )}

      {/* ====== ASK FARO ====== */}
      {activeSubTab === 'ai' && (
        <AskFaroPanel
          aiQuery={aiQuery}
          setAiQuery={setAiQuery}
          aiResponses={aiResponses}
          onSubmit={handleAiSubmit}
        />
      )}

      {/* ====== SAVE MODAL ====== */}
      {showSaveModal && (
        <SavePortfolioModal
          name={savePortfolioName}
          setName={setSavePortfolioName}
          onSave={handleSavePortfolio}
          onClose={() => setShowSaveModal(false)}
        />
      )}
    </div>
  );
};

// ============================================================
// CARD WRAPPER (Faro design system)
// ============================================================
const Card: React.FC<{ children: React.ReactNode; style?: React.CSSProperties; title?: string; subtitle?: string }> = ({
  children, style, title, subtitle
}) => (
  <div style={{
    backgroundColor: '#fff', border: '1px solid #EDEDEB', borderRadius: '12px',
    padding: '20px', ...style,
  }}>
    {title && (
      <div style={{ marginBottom: '16px' }}>
        <h3 style={{ fontSize: '0.85rem', fontWeight: 600, color: '#141618', letterSpacing: '-0.01em' }}>{title}</h3>
        {subtitle && <p style={{ fontSize: '0.75rem', color: '#9AA19E', marginTop: '2px' }}>{subtitle}</p>}
      </div>
    )}
    {children}
  </div>
);

// ============================================================
// BADGE
// ============================================================
const Badge: React.FC<{ label: string; color?: string; bg?: string }> = ({ label, color = '#87BAA4', bg = '#F0F7F4' }) => (
  <span style={{
    fontSize: '0.65rem', fontWeight: 600, color, backgroundColor: bg,
    padding: '2px 8px', borderRadius: '4px', textTransform: 'uppercase', letterSpacing: '0.04em',
  }}>
    {label}
  </span>
);

// ============================================================
// OVERVIEW PANEL
// ============================================================
const OverviewPanel: React.FC<{
  config: PortfolioConfig;
  setConfig: (c: PortfolioConfig) => void;
  returnModel: ExpectedReturnModel;
  riskMetrics: PortfolioRiskMetrics;
  concentration: ConcentrationAnalysis;
  holdings: PortfolioHolding[];
  scenarios: AllocationScenario[];
  savedPortfolios: SavedPortfolio[];
}> = ({ config, setConfig, returnModel, riskMetrics, concentration, holdings, scenarios, savedPortfolios }) => {
  const summaryMetrics = [
    { label: 'Capital', value: formatCurrency(config.availableCapital) },
    { label: 'Expected Return', value: `${returnModel.portfolioExpectedReturn}%`, badge: 'Model Estimate' },
    { label: 'Volatility', value: `${riskMetrics.volatility}%` },
    { label: 'Largest Position', value: `${concentration.topHoldings[0]?.percent || 0}%` },
    { label: 'Largest Sector', value: `${concentration.topSectors[0]?.percent || 0}%` },
    { label: 'Liquidity', value: `${riskMetrics.liquidityScore}%` },
  ];

  return (
    <div className="space-y-6">
      {/* Portfolio Configuration */}
      <Card title="Portfolio Configuration">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
          <ConfigInput label="Available Capital" value={config.availableCapital} type="currency"
            onChange={(v) => setConfig({ ...config, availableCapital: v as number })} />
          <ConfigSelect label="Risk Appetite" value={config.riskAppetite}
            options={['Conservative', 'Moderate', 'Aggressive']}
            onChange={(v) => setConfig({ ...config, riskAppetite: v as PortfolioConfig['riskAppetite'] })} />
          <ConfigInput label="Investment Horizon" value={config.investmentHorizon} type="years"
            onChange={(v) => setConfig({ ...config, investmentHorizon: v as number })} />
          <ConfigInput label="Target Return" value={config.targetReturn} type="percent"
            onChange={(v) => setConfig({ ...config, targetReturn: v as number })} />
          <ConfigInput label="Liquidity Requirement" value={config.liquidityRequirement} type="percent"
            onChange={(v) => setConfig({ ...config, liquidityRequirement: v as number })} />
          <ConfigSelect label="Geographic Preference" value={config.geographicPreference}
            options={['North America', 'Europe', 'Asia-Pacific', 'Global', 'Emerging Markets']}
            onChange={(v) => setConfig({ ...config, geographicPreference: v as PortfolioConfig['geographicPreference'] })} />
        </div>
      </Card>

      {/* Portfolio Summary */}
      <Card title="Portfolio Summary">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px' }}>
          {summaryMetrics.map((m) => (
            <div key={m.label} style={{
              padding: '16px', backgroundColor: '#FAFAF9', borderRadius: '8px', border: '1px solid #EDEDEB',
            }}>
              <div style={{ fontSize: '0.7rem', color: '#9AA19E', fontWeight: 500, marginBottom: '4px' }}>{m.label}</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#141618' }}>{m.value}</div>
              {m.badge && <Badge label={m.badge} />}
            </div>
          ))}
        </div>
      </Card>

      {/* Faro Intelligence Summary */}
      <Card title="Faro Intelligence" subtitle="Structured portfolio analysis">
        <div style={{
          padding: '16px', backgroundColor: '#F8FBF9', borderRadius: '8px', border: '1px solid #E0EDE6',
          fontSize: '0.82rem', lineHeight: '1.7', color: '#2D3436',
        }}>
          <p>
            Technology exposure represents <strong>{concentration.topSectors[0]?.percent || 0}%</strong> of the modeled portfolio.
            The largest individual position represents <strong>{concentration.topHoldings[0]?.percent || 0}%</strong>.
            {concentration.topSectors[0]?.isOver && (
              <span style={{ color: '#D97706' }}> Sector concentration exceeds the {concentration.topSectors[0].threshold}% institutional guideline.</span>
            )}
          </p>
          <p style={{ marginTop: '8px' }}>
            Under the modeled base case, the portfolio&apos;s expected return is <strong>{returnModel.portfolioExpectedReturn}%</strong> with
            estimated volatility of <strong>{riskMetrics.volatility}%</strong> and maximum drawdown
            of <strong>{riskMetrics.maxDrawdown}%</strong>.
          </p>
          <p style={{ marginTop: '8px' }}>
            {holdings.filter((h) => h.type === 'private').length} private holdings contribute to reduced liquidity.
            The portfolio liquidity score is <strong>{riskMetrics.liquidityScore}/100</strong>.
          </p>
          <div style={{ marginTop: '12px', padding: '8px 12px', backgroundColor: '#FEF3C7', borderRadius: '6px', fontSize: '0.72rem', color: '#92400E' }}>
            ⚠️ <strong>Model Estimate</strong> — All outputs are based on current assumptions and demo data. They do not constitute investment advice.
          </div>
        </div>
      </Card>

      {/* Scenario Quick Comparison */}
      <Card title="Scenario Quick View">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px' }}>
          {scenarios.map((s) => (
            <div key={s.id} style={{
              padding: '16px', borderRadius: '8px', border: '1px solid #EDEDEB',
              backgroundColor: s.type === 'base' ? '#F8FBF9' : '#FAFAF9',
            }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                {s.name}
              </div>
              <div style={{ fontSize: '1.15rem', fontWeight: 700, color: s.expectedReturn >= 0 ? '#059669' : '#DC2626', marginTop: '4px' }}>
                {formatPercent(s.expectedReturn)}
              </div>
              <div style={{ fontSize: '0.72rem', color: '#9AA19E', marginTop: '2px' }}>
                {formatCurrency(s.portfolioValue)}
              </div>
              <div style={{ fontSize: '0.68rem', color: '#D97706', marginTop: '4px' }}>
                Drawdown: {s.expectedDrawdown}%
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Saved Portfolios */}
      {savedPortfolios.length > 0 && (
        <Card title="Saved Portfolios">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px' }}>
            {savedPortfolios.map((p) => (
              <div key={p.id} style={{
                padding: '16px', borderRadius: '8px', border: '1px solid #EDEDEB', backgroundColor: '#FAFAF9',
                cursor: 'pointer', transition: 'all 0.2s',
              }}>
                <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#141618' }}>{p.name}</div>
                <div style={{ display: 'flex', gap: '16px', marginTop: '8px' }}>
                  <div>
                    <div style={{ fontSize: '0.65rem', color: '#9AA19E' }}>Capital</div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{formatCurrency(p.capital)}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.65rem', color: '#9AA19E' }}>Holdings</div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{p.holdings.length}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.65rem', color: '#9AA19E' }}>Updated</div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{p.lastUpdated}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

// ============================================================
// ALLOCATION PANEL
// ============================================================
const AllocationPanel: React.FC<{
  config: PortfolioConfig;
  allocationSlices: { assetClass: AssetClassAllocation; percent: number }[];
  assetSlices: AssetClassSlice[];
  allocatedCapital: number;
  unallocatedPercent: number;
  allocationValid: boolean;
  displayMode: 'percentage' | 'capital';
  setDisplayMode: (m: 'percentage' | 'capital') => void;
  onAllocationChange: (ac: AssetClassAllocation, pct: number) => void;
}> = ({ config, allocationSlices, assetSlices, allocatedCapital, unallocatedPercent, allocationValid, displayMode, setDisplayMode, onAllocationChange }) => {
  const totalPercent = allocationSlices.reduce((s, a) => s + a.percent, 0);

  return (
    <div className="space-y-6">
      {/* Toggle */}
      <div className="flex items-center justify-between">
        <div>
          <h3 style={{ fontSize: '0.85rem', fontWeight: 600, color: '#141618' }}>Asset Class Allocation</h3>
          <p style={{ fontSize: '0.72rem', color: '#9AA19E' }}>Adjust percentages. Total must equal 100%.</p>
        </div>
        <div style={{ display: 'flex', gap: '4px', backgroundColor: '#F5F4F5', borderRadius: '8px', padding: '3px' }}>
          {(['percentage', 'capital'] as const).map((mode) => (
            <button key={mode} onClick={() => setDisplayMode(mode)} style={{
              padding: '4px 12px', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 500,
              backgroundColor: displayMode === mode ? '#fff' : 'transparent',
              color: displayMode === mode ? '#141618' : '#9AA19E',
              border: displayMode === mode ? '1px solid #EDEDEB' : '1px solid transparent',
              cursor: 'pointer',
            }}>
              {mode === 'percentage' ? 'Percentage' : 'Capital Amount'}
            </button>
          ))}
        </div>
      </div>

      {/* Summary bar */}
      <Card>
        <div className="flex items-center justify-between" style={{ marginBottom: '12px' }}>
          <div>
            <span style={{ fontSize: '0.72rem', color: '#9AA19E' }}>Allocated: </span>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: allocationValid ? '#059669' : '#D97706' }}>
              {totalPercent.toFixed(0)}%
            </span>
            <span style={{ fontSize: '0.72rem', color: '#9AA19E', marginLeft: '8px' }}>
              ({formatCurrency(allocatedCapital)})
            </span>
          </div>
          <div>
            <span style={{ fontSize: '0.72rem', color: '#9AA19E' }}>Unallocated: </span>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: unallocatedPercent > 0 ? '#D97706' : '#059669' }}>
              {unallocatedPercent.toFixed(0)}%
            </span>
          </div>
        </div>
        {/* Allocation bar */}
        <div style={{ display: 'flex', height: '28px', borderRadius: '8px', overflow: 'hidden', backgroundColor: '#F5F4F5' }}>
          {assetSlices.filter((s) => s.allocationPercent > 0).map((s) => (
            <div key={s.assetClass} style={{
              width: `${s.allocationPercent}%`, backgroundColor: s.color,
              transition: 'width 0.3s ease', position: 'relative',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {s.allocationPercent >= 8 && (
                <span style={{ fontSize: '0.6rem', color: '#fff', fontWeight: 600 }}>{s.allocationPercent}%</span>
              )}
            </div>
          ))}
        </div>
        {/* Legend */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginTop: '12px' }}>
          {assetSlices.filter((s) => s.allocationPercent > 0).map((s) => (
            <div key={s.assetClass} className="flex items-center gap-1">
              <div style={{ width: '8px', height: '8px', borderRadius: '2px', backgroundColor: s.color }} />
              <span style={{ fontSize: '0.68rem', color: '#6B7280' }}>{s.assetClass}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Sliders */}
      <Card>
        <div className="space-y-4">
          {allocationSlices.map((slice) => (
            <div key={slice.assetClass} className="flex items-center gap-4">
              <div style={{ width: '140px', flexShrink: 0 }}>
                <div className="flex items-center gap-2">
                  <div style={{
                    width: '10px', height: '10px', borderRadius: '2px',
                    backgroundColor: ASSET_CLASS_COLORS[slice.assetClass],
                  }} />
                  <span style={{ fontSize: '0.78rem', fontWeight: 500, color: '#141618' }}>{slice.assetClass}</span>
                </div>
              </div>
              <div style={{ flex: 1 }}>
                <input
                  type="range" min={0} max={100} step={1}
                  value={slice.percent}
                  onChange={(e) => onAllocationChange(slice.assetClass, parseInt(e.target.value))}
                  style={{ width: '100%', accentColor: '#87BAA4' }}
                />
              </div>
              <div style={{ width: '100px', textAlign: 'right' }}>
                {displayMode === 'percentage' ? (
                  <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#141618' }}>{slice.percent}%</span>
                ) : (
                  <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#141618' }}>
                    {formatCurrency(Math.round(config.availableCapital * (slice.percent / 100)))}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
        {!allocationValid && (
          <div style={{ marginTop: '16px', padding: '8px 12px', backgroundColor: '#FEF2F2', borderRadius: '6px', fontSize: '0.72rem', color: '#DC2626' }}>
            ⚠️ Total allocation is {totalPercent.toFixed(0)}%. Must equal 100%.
          </div>
        )}
      </Card>

      {/* Table view */}
      <Card title="Allocation Detail">
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #EDEDEB' }}>
                <th style={{ textAlign: 'left', padding: '8px 12px', color: '#9AA19E', fontWeight: 500, fontSize: '0.7rem' }}>Asset Class</th>
                <th style={{ textAlign: 'right', padding: '8px 12px', color: '#9AA19E', fontWeight: 500, fontSize: '0.7rem' }}>Allocation</th>
                <th style={{ textAlign: 'right', padding: '8px 12px', color: '#9AA19E', fontWeight: 500, fontSize: '0.7rem' }}>Capital</th>
              </tr>
            </thead>
            <tbody>
              {assetSlices.filter((s) => s.allocationPercent > 0).map((s) => (
                <tr key={s.assetClass} style={{ borderBottom: '1px solid #F5F4F5' }}>
                  <td style={{ padding: '10px 12px' }}>
                    <div className="flex items-center gap-2">
                      <div style={{ width: '8px', height: '8px', borderRadius: '2px', backgroundColor: s.color }} />
                      {s.assetClass}
                    </div>
                  </td>
                  <td style={{ textAlign: 'right', padding: '10px 12px', fontWeight: 600 }}>{s.allocationPercent}%</td>
                  <td style={{ textAlign: 'right', padding: '10px 12px', fontWeight: 600 }}>{formatCurrency(s.capitalAmount)}</td>
                </tr>
              ))}
              <tr style={{ borderTop: '2px solid #EDEDEB', fontWeight: 700 }}>
                <td style={{ padding: '10px 12px' }}>Total</td>
                <td style={{ textAlign: 'right', padding: '10px 12px' }}>{totalPercent}%</td>
                <td style={{ textAlign: 'right', padding: '10px 12px' }}>{formatCurrency(allocatedCapital)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

// ============================================================
// HOLDINGS PANEL
// ============================================================
const HoldingsPanel: React.FC<{
  holdings: PortfolioHolding[];
  config: PortfolioConfig;
  returnModel: ExpectedReturnModel;
  showInvestmentSelector: boolean;
  setShowInvestmentSelector: (v: boolean) => void;
  investmentSearch: string;
  setInvestmentSearch: (v: string) => void;
  onAddInvestment: (inv: typeof SELECTABLE_INVESTMENTS[0]) => void;
  onRemoveHolding: (id: string) => void;
  onAllocationChange: (id: string, pct: number) => void;
}> = ({ holdings, config, returnModel, showInvestmentSelector, setShowInvestmentSelector, investmentSearch, setInvestmentSearch, onAddInvestment, onRemoveHolding, onAllocationChange }) => {
  const filteredInvestments = SELECTABLE_INVESTMENTS.filter((inv) =>
    !holdings.find((h) => h.companyId === inv.companyId) &&
    (inv.name.toLowerCase().includes(investmentSearch.toLowerCase()) ||
     (inv.ticker || '').toLowerCase().includes(investmentSearch.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 style={{ fontSize: '0.85rem', fontWeight: 600, color: '#141618' }}>Investment Holdings</h3>
          <p style={{ fontSize: '0.72rem', color: '#9AA19E' }}>{holdings.length} positions · {formatCurrency(config.availableCapital)} total capital</p>
        </div>
        <button
          onClick={() => setShowInvestmentSelector(!showInvestmentSelector)}
          style={{
            padding: '8px 16px', borderRadius: '8px', fontSize: '0.78rem', fontWeight: 600,
            backgroundColor: '#87BAA4', color: '#fff', border: 'none', cursor: 'pointer',
          }}
        >
          + Add Investment
        </button>
      </div>

      {/* Investment Selector */}
      {showInvestmentSelector && (
        <Card title="Select Investment" subtitle="Add from researched companies">
          <input
            type="text" placeholder="Search companies..."
            value={investmentSearch} onChange={(e) => setInvestmentSearch(e.target.value)}
            style={{
              width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #EDEDEB',
              fontSize: '0.82rem', marginBottom: '12px', outline: 'none',
            }}
          />
          <div style={{ maxHeight: '300px', overflowY: 'auto' }} className="space-y-2">
            {filteredInvestments.map((inv) => (
              <div key={inv.companyId}
                onClick={() => onAddInvestment(inv)}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '10px 14px', borderRadius: '8px', border: '1px solid #EDEDEB',
                  cursor: 'pointer', transition: 'all 0.15s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F8FBF9')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#fff')}
              >
                <div className="flex items-center gap-3">
                  <div style={{
                    width: '32px', height: '32px', borderRadius: '6px', backgroundColor: '#F0F7F4',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.7rem', fontWeight: 700, color: '#87BAA4',
                  }}>
                    {inv.logoLetter}
                  </div>
                  <div>
                    <div style={{ fontSize: '0.8rem', fontWeight: 600 }}>{inv.name}</div>
                    <div style={{ fontSize: '0.68rem', color: '#9AA19E' }}>
                      {inv.ticker || inv.type} · {inv.sector}
                    </div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 600 }}>{inv.valuation}</div>
                  <div style={{ fontSize: '0.68rem', color: '#059669' }}>+{inv.expectedReturn}% est.</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Expected Return Model */}
      <Card title="Expected Return Model" subtitle="Model Estimate · Based on current assumptions">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '16px' }}>
          <div style={{ padding: '14px', backgroundColor: '#F0F7F4', borderRadius: '8px', textAlign: 'center' }}>
            <div style={{ fontSize: '0.68rem', color: '#6B7280' }}>Expected Return</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#059669' }}>{returnModel.portfolioExpectedReturn}%</div>
          </div>
          <div style={{ padding: '14px', backgroundColor: '#F0F7F4', borderRadius: '8px', textAlign: 'center' }}>
            <div style={{ fontSize: '0.68rem', color: '#6B7280' }}>Expected Gain</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#059669' }}>{formatCurrency(returnModel.portfolioExpectedGain)}</div>
          </div>
          <div style={{ padding: '14px', backgroundColor: '#FEF2F2', borderRadius: '8px', textAlign: 'center' }}>
            <div style={{ fontSize: '0.68rem', color: '#6B7280' }}>Expected Loss</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#DC2626' }}>{formatCurrency(returnModel.portfolioExpectedLoss)}</div>
          </div>
        </div>
        <div style={{ fontSize: '0.68rem', color: '#92400E', padding: '8px 12px', backgroundColor: '#FEF3C7', borderRadius: '6px' }}>
          ⚠️ Returns are model estimates based on selected assumptions. Not guaranteed.
        </div>
      </Card>

      {/* Holdings Table */}
      <Card>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.76rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #EDEDEB' }}>
                {['Investment', 'Type', 'Allocation', 'Capital', 'Exp. Return', 'Risk', 'Liquidity', 'Sector', ''].map((h) => (
                  <th key={h} style={{ textAlign: h === 'Investment' ? 'left' : 'right', padding: '8px 10px', color: '#9AA19E', fontWeight: 500, fontSize: '0.68rem' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {holdings.map((h) => (
                <tr key={h.id} style={{ borderBottom: '1px solid #F5F4F5' }}>
                  <td style={{ padding: '10px' }}>
                    <div className="flex items-center gap-2">
                      <div style={{
                        width: '28px', height: '28px', borderRadius: '6px', backgroundColor: '#F0F7F4',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '0.65rem', fontWeight: 700, color: '#87BAA4',
                      }}>
                        {h.logoLetter}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.78rem' }}>{h.name}</div>
                        <div style={{ fontSize: '0.65rem', color: '#9AA19E' }}>{h.ticker || h.valuation}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ textAlign: 'right', padding: '10px' }}>
                    <Badge
                      label={h.type}
                      color={h.type === 'public' ? '#059669' : '#7C3AED'}
                      bg={h.type === 'public' ? '#F0FDF4' : '#F5F3FF'}
                    />
                  </td>
                  <td style={{ textAlign: 'right', padding: '10px' }}>
                    <input
                      type="number" min={0} max={100} step={1}
                      value={h.allocationPercent}
                      onChange={(e) => onAllocationChange(h.id, parseInt(e.target.value) || 0)}
                      style={{
                        width: '56px', textAlign: 'right', padding: '4px 6px', borderRadius: '4px',
                        border: '1px solid #EDEDEB', fontSize: '0.78rem', fontWeight: 600,
                      }}
                    />
                    <span style={{ fontSize: '0.68rem', color: '#9AA19E' }}>%</span>
                  </td>
                  <td style={{ textAlign: 'right', padding: '10px', fontWeight: 600 }}>{formatCurrency(h.capitalAllocated)}</td>
                  <td style={{ textAlign: 'right', padding: '10px', color: h.expectedReturn >= 0 ? '#059669' : '#DC2626', fontWeight: 600 }}>
                    {formatPercent(h.expectedReturn)}
                  </td>
                  <td style={{ textAlign: 'right', padding: '10px' }}>
                    <Badge
                      label={h.riskLevel}
                      color={h.riskLevel === 'High' ? '#DC2626' : h.riskLevel === 'Moderate' ? '#D97706' : '#059669'}
                      bg={h.riskLevel === 'High' ? '#FEF2F2' : h.riskLevel === 'Moderate' ? '#FEF3C7' : '#F0FDF4'}
                    />
                  </td>
                  <td style={{ textAlign: 'right', padding: '10px', fontSize: '0.72rem', color: '#6B7280' }}>{h.liquidity}</td>
                  <td style={{ textAlign: 'right', padding: '10px', fontSize: '0.72rem', color: '#6B7280' }}>{h.sector}</td>
                  <td style={{ textAlign: 'right', padding: '10px' }}>
                    <button onClick={() => onRemoveHolding(h.id)} style={{
                      fontSize: '0.7rem', color: '#DC2626', cursor: 'pointer', background: 'none', border: 'none', padding: '4px',
                    }}>
                      ✕
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

// ============================================================
// RISK ENGINE PANEL
// ============================================================
const RiskEnginePanel: React.FC<{
  riskMetrics: PortfolioRiskMetrics;
  riskExplanations: RiskMetricWithExplanation[];
  concentration: ConcentrationAnalysis;
  correlationMatrix: CorrelationEntry[];
  holdings: PortfolioHolding[];
  showRiskExplanation: string | null;
  setShowRiskExplanation: (v: string | null) => void;
}> = ({ riskMetrics, riskExplanations, concentration, correlationMatrix, holdings, showRiskExplanation, setShowRiskExplanation }) => {
  const publicTickers = holdings.filter((h) => h.ticker).map((h) => h.ticker!);

  return (
    <div className="space-y-6">
      {/* Risk Metrics Grid */}
      <Card title="Portfolio Risk Metrics" subtitle="Model estimates based on current holdings">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
          {riskExplanations.map((re) => (
            <div key={re.metricName}
              onClick={() => setShowRiskExplanation(showRiskExplanation === re.metricName ? null : re.metricName)}
              style={{
                padding: '16px', borderRadius: '8px', border: '1px solid #EDEDEB',
                backgroundColor: showRiskExplanation === re.metricName ? '#F8FBF9' : '#FAFAF9',
                cursor: 'pointer', transition: 'all 0.2s',
              }}
            >
              <div style={{ fontSize: '0.68rem', color: '#9AA19E', fontWeight: 500 }}>{re.metricName}</div>
              <div style={{ fontSize: '1.15rem', fontWeight: 700, color: '#141618', marginTop: '2px' }}>{re.metricValue}</div>
              <Badge
                label={re.severity}
                color={re.severity === 'critical' ? '#DC2626' : re.severity === 'high' ? '#D97706' : re.severity === 'moderate' ? '#D97706' : '#059669'}
                bg={re.severity === 'critical' ? '#FEF2F2' : re.severity === 'high' ? '#FEF3C7' : re.severity === 'moderate' ? '#FEF3C7' : '#F0FDF4'}
              />
              <div style={{ fontSize: '0.62rem', color: '#9AA19E', marginTop: '4px' }}>Click to explain →</div>
            </div>
          ))}
        </div>
      </Card>

      {/* Risk Explanation Drawer */}
      {showRiskExplanation && (
        <Card>
          {(() => {
            const re = riskExplanations.find((r) => r.metricName === showRiskExplanation);
            if (!re) return null;
            return (
              <div className="space-y-3">
                <h4 style={{ fontSize: '0.85rem', fontWeight: 600 }}>{re.metricName} — Detailed Explanation</h4>
                {(['what', 'why', 'impact', 'evidence', 'assumption'] as const).map((key) => (
                  <div key={key} style={{ padding: '10px 14px', backgroundColor: '#FAFAF9', borderRadius: '6px' }}>
                    <div style={{ fontSize: '0.68rem', fontWeight: 600, color: '#87BAA4', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      {key === 'what' ? 'WHAT?' : key === 'why' ? 'WHY?' : key === 'impact' ? 'IMPACT?' : key === 'evidence' ? 'EVIDENCE?' : 'ASSUMPTION?'}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#2D3436', marginTop: '4px', lineHeight: '1.6' }}>
                      {re.explanation[key]}
                    </div>
                  </div>
                ))}
              </div>
            );
          })()}
        </Card>
      )}

      {/* Concentration Analysis */}
      <Card title="Concentration Analysis" subtitle={`Herfindahl Index: ${concentration.herfindahlIndex}`}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
          {/* Top Holdings */}
          <div>
            <h4 style={{ fontSize: '0.72rem', fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', marginBottom: '8px' }}>Top Holdings</h4>
            {concentration.topHoldings.map((h) => (
              <ConcentrationRow key={h.name} name={h.name} percent={h.percent} threshold={h.threshold} isOver={h.isOver} />
            ))}
          </div>
          {/* Top Sectors */}
          <div>
            <h4 style={{ fontSize: '0.72rem', fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', marginBottom: '8px' }}>Top Sectors</h4>
            {concentration.topSectors.map((s) => (
              <ConcentrationRow key={s.name} name={s.name} percent={s.percent} threshold={s.threshold} isOver={s.isOver} />
            ))}
          </div>
          {/* Top Geographies */}
          <div>
            <h4 style={{ fontSize: '0.72rem', fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', marginBottom: '8px' }}>Top Geographies</h4>
            {concentration.topGeographies.map((g) => (
              <ConcentrationRow key={g.name} name={g.name} percent={g.percent} threshold={g.threshold} isOver={g.isOver} />
            ))}
          </div>
          {/* Top Asset Classes */}
          <div>
            <h4 style={{ fontSize: '0.72rem', fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', marginBottom: '8px' }}>Top Asset Classes</h4>
            {concentration.topAssetClasses.filter((a) => a.percent > 0).map((a) => (
              <ConcentrationRow key={a.name} name={a.name} percent={a.percent} threshold={a.threshold} isOver={a.isOver} />
            ))}
          </div>
        </div>
      </Card>

      {/* Correlation Matrix */}
      {publicTickers.length > 1 && (
        <Card title="Correlation Matrix" subtitle="Demo data · Will be replaced with historical returns">
          <div style={{ overflowX: 'auto' }}>
            <table style={{ borderCollapse: 'collapse', fontSize: '0.72rem' }}>
              <thead>
                <tr>
                  <th style={{ padding: '6px 10px', color: '#9AA19E' }}></th>
                  {publicTickers.map((t) => (
                    <th key={t} style={{ padding: '6px 10px', color: '#141618', fontWeight: 600, textAlign: 'center' }}>{t}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {publicTickers.map((rowTicker) => (
                  <tr key={rowTicker}>
                    <td style={{ padding: '6px 10px', fontWeight: 600, color: '#141618' }}>{rowTicker}</td>
                    {publicTickers.map((colTicker) => {
                      if (rowTicker === colTicker) {
                        return <td key={colTicker} style={{ padding: '6px 10px', textAlign: 'center', fontWeight: 600, backgroundColor: '#F0F7F4' }}>1.00</td>;
                      }
                      const entry = correlationMatrix.find(
                        (e) => (e.tickerA === rowTicker && e.tickerB === colTicker) || (e.tickerA === colTicker && e.tickerB === rowTicker)
                      );
                      const corr = entry?.correlation ?? 0.5;
                      const intensity = Math.round(corr * 255);
                      return (
                        <td key={colTicker} style={{
                          padding: '6px 10px', textAlign: 'center',
                          backgroundColor: `rgba(135, 186, 164, ${corr * 0.4})`,
                          fontWeight: corr > 0.7 ? 600 : 400,
                          color: corr > 0.7 ? '#141618' : '#6B7280',
                        }}>
                          {corr.toFixed(2)}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Exposure Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
        <Card title="Sector Exposure">
          {riskMetrics.sectorExposure.map((s) => (
            <div key={s.name} style={{ marginBottom: '8px' }}>
              <div className="flex justify-between" style={{ fontSize: '0.72rem', marginBottom: '2px' }}>
                <span style={{ color: '#141618' }}>{s.name}</span>
                <span style={{ fontWeight: 600, color: s.isOverConcentrated ? '#D97706' : '#141618' }}>
                  {s.percent}%
                  {s.isOverConcentrated && <span style={{ color: '#D97706' }}> ⚠</span>}
                </span>
              </div>
              <div style={{ height: '6px', backgroundColor: '#F5F4F5', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{
                  height: '100%', width: `${Math.min(s.percent, 100)}%`,
                  backgroundColor: s.isOverConcentrated ? '#D97706' : s.color,
                  borderRadius: '3px', transition: 'width 0.3s ease',
                }} />
              </div>
            </div>
          ))}
        </Card>
        <Card title="Geographic Exposure">
          {riskMetrics.geographicExposure.map((g) => (
            <div key={g.name} style={{ marginBottom: '8px' }}>
              <div className="flex justify-between" style={{ fontSize: '0.72rem', marginBottom: '2px' }}>
                <span style={{ color: '#141618' }}>{g.name}</span>
                <span style={{ fontWeight: 600, color: g.isOverConcentrated ? '#D97706' : '#141618' }}>
                  {g.percent}%
                  {g.isOverConcentrated && <span style={{ color: '#D97706' }}> ⚠</span>}
                </span>
              </div>
              <div style={{ height: '6px', backgroundColor: '#F5F4F5', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{
                  height: '100%', width: `${Math.min(g.percent, 100)}%`,
                  backgroundColor: g.isOverConcentrated ? '#D97706' : g.color,
                  borderRadius: '3px', transition: 'width 0.3s ease',
                }} />
              </div>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
};

// ============================================================
// CONCENTRATION ROW
// ============================================================
const ConcentrationRow: React.FC<{ name: string; percent: number; threshold: number; isOver: boolean }> = ({ name, percent, threshold, isOver }) => (
  <div className="flex items-center justify-between" style={{
    padding: '6px 0', borderBottom: '1px solid #F5F4F5', fontSize: '0.75rem',
  }}>
    <div className="flex items-center gap-2">
      {isOver && <span style={{ color: '#D97706' }}>⚠</span>}
      <span style={{ color: '#141618' }}>{name}</span>
    </div>
    <div className="flex items-center gap-3">
      <span style={{ color: '#9AA19E', fontSize: '0.68rem' }}>Threshold: {threshold}%</span>
      <span style={{ fontWeight: 600, color: isOver ? '#D97706' : '#141618' }}>{percent}%</span>
      <span style={{ fontSize: '0.68rem', color: isOver ? '#DC2626' : '#059669' }}>
        {isOver ? `+${(percent - threshold).toFixed(1)}%` : `${(percent - threshold).toFixed(1)}%`}
      </span>
    </div>
  </div>
);

// ============================================================
// SCENARIOS PANEL
// ============================================================
const ScenariosPanel: React.FC<{
  scenarios: AllocationScenario[];
  config: PortfolioConfig;
  selectedTimeHorizon: TimeHorizon;
  setSelectedTimeHorizon: (t: TimeHorizon) => void;
}> = ({ scenarios, config, selectedTimeHorizon, setSelectedTimeHorizon }) => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <div>
        <h3 style={{ fontSize: '0.85rem', fontWeight: 600 }}>Scenario Comparison</h3>
        <p style={{ fontSize: '0.72rem', color: '#9AA19E' }}>Compare outcomes across different assumption sets</p>
      </div>
      <div style={{ display: 'flex', gap: '4px', backgroundColor: '#F5F4F5', borderRadius: '8px', padding: '3px' }}>
        {([5, 7, 10] as TimeHorizon[]).map((t) => (
          <button key={t} onClick={() => setSelectedTimeHorizon(t)} style={{
            padding: '4px 12px', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 500,
            backgroundColor: selectedTimeHorizon === t ? '#fff' : 'transparent',
            color: selectedTimeHorizon === t ? '#141618' : '#9AA19E',
            border: selectedTimeHorizon === t ? '1px solid #EDEDEB' : '1px solid transparent',
            cursor: 'pointer',
          }}>
            {t}Y
          </button>
        ))}
      </div>
    </div>

    {/* Comparison Table */}
    <Card>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #EDEDEB' }}>
              <th style={{ textAlign: 'left', padding: '8px 12px', color: '#9AA19E', fontWeight: 500, fontSize: '0.7rem' }}>Metric</th>
              {scenarios.map((s) => (
                <th key={s.id} style={{ textAlign: 'right', padding: '8px 12px', color: '#141618', fontWeight: 600, fontSize: '0.72rem' }}>
                  {s.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              { label: 'Portfolio Value', getValue: (s: AllocationScenario) => formatCurrency(s.portfolioValue) },
              { label: 'Expected Return', getValue: (s: AllocationScenario) => formatPercent(s.expectedReturn) },
              { label: 'Max Drawdown', getValue: (s: AllocationScenario) => `${s.expectedDrawdown}%` },
              { label: 'Risk Score', getValue: (s: AllocationScenario) => `${s.riskScore}%` },
              { label: 'Liquidity', getValue: (s: AllocationScenario) => `${s.liquidity}/100` },
            ].map((row) => (
              <tr key={row.label} style={{ borderBottom: '1px solid #F5F4F5' }}>
                <td style={{ padding: '10px 12px', fontWeight: 500 }}>{row.label}</td>
                {scenarios.map((s) => (
                  <td key={s.id} style={{ textAlign: 'right', padding: '10px 12px', fontWeight: 600 }}>
                    {row.getValue(s)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>

    {/* Scenario Details */}
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
      {scenarios.map((s) => (
        <Card key={s.id} title={s.name}>
          <div style={{ marginBottom: '12px' }}>
            <div style={{
              fontSize: '1.5rem', fontWeight: 700,
              color: s.expectedReturn >= 0 ? '#059669' : '#DC2626',
            }}>
              {formatPercent(s.expectedReturn)}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#6B7280' }}>{formatCurrency(s.portfolioValue)}</div>
          </div>
          <div style={{ fontSize: '0.72rem', fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', marginBottom: '8px' }}>
            Assumptions
          </div>
          {s.assumptions.map((a) => (
            <div key={a.label} className="flex justify-between" style={{
              padding: '4px 0', borderBottom: '1px solid #F5F4F5', fontSize: '0.75rem',
            }}>
              <span style={{ color: '#6B7280' }}>{a.label}</span>
              <span style={{ fontWeight: 600, color: '#141618' }}>{a.value}</span>
            </div>
          ))}
          <div style={{ marginTop: '8px' }}>
            <Badge label={s.assumptions[0]?.epistemicStatus || 'ASSUMPTION'} />
          </div>
        </Card>
      ))}
    </div>
  </div>
);

// ============================================================
// STRESS TEST PANEL
// ============================================================
const stressScenarioKeys: { key: StressScenarioKey; label: string; icon: string }[] = [
  { key: 'market-crash', label: 'Market Crash', icon: '📉' },
  { key: 'recession', label: 'Recession', icon: '🏚' },
  { key: 'interest-rate-shock', label: 'Rate Shock', icon: '📈' },
  { key: 'tech-crash', label: 'Tech Crash', icon: '💻' },
  { key: 'currency-shock', label: 'Currency', icon: '💱' },
  { key: 'commodity-shock', label: 'Commodity', icon: '🛢' },
  { key: 'liquidity-shock', label: 'Liquidity', icon: '🔒' },
];

const StressTestPanel: React.FC<{
  stressResult: StressScenario;
  activeStressScenario: StressScenarioKey;
  setActiveStressScenario: (k: StressScenarioKey) => void;
  config: PortfolioConfig;
}> = ({ stressResult, activeStressScenario, setActiveStressScenario, config }) => (
  <div className="space-y-6">
    <div>
      <h3 style={{ fontSize: '0.85rem', fontWeight: 600 }}>Portfolio Stress Test</h3>
      <p style={{ fontSize: '0.72rem', color: '#9AA19E' }}>Simulate adverse market scenarios</p>
    </div>

    {/* Scenario Buttons */}
    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
      {stressScenarioKeys.map((s) => (
        <button key={s.key} onClick={() => setActiveStressScenario(s.key)} style={{
          padding: '8px 14px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 500,
          backgroundColor: activeStressScenario === s.key ? '#141618' : '#fff',
          color: activeStressScenario === s.key ? '#fff' : '#6B7280',
          border: `1px solid ${activeStressScenario === s.key ? '#141618' : '#EDEDEB'}`,
          cursor: 'pointer', transition: 'all 0.2s',
        }}>
          {s.icon} {s.label}
        </button>
      ))}
    </div>

    {/* Stress Result */}
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
      <Card>
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <div style={{ fontSize: '0.72rem', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
            {stressResult.name}
          </div>
          <div style={{ fontSize: '2.5rem', fontWeight: 700, color: '#DC2626', marginTop: '8px' }}>
            {stressResult.portfolioImpactPercent}%
          </div>
          <div style={{ fontSize: '0.85rem', color: '#6B7280', marginTop: '4px' }}>
            Portfolio Impact
          </div>
          <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#DC2626', marginTop: '8px' }}>
            {formatCurrency(stressResult.estimatedLoss)}
          </div>
          <div style={{ fontSize: '0.72rem', color: '#6B7280' }}>Estimated Loss</div>
          <div style={{ marginTop: '12px' }}>
            <Badge label={stressResult.epistemicStatus} />
          </div>
        </div>
      </Card>

      <Card title="Scenario Description">
        <p style={{ fontSize: '0.8rem', color: '#2D3436', lineHeight: '1.7', marginBottom: '12px' }}>
          {stressResult.description}
        </p>
        <div style={{ padding: '10px 14px', backgroundColor: '#FAFAF9', borderRadius: '6px', marginBottom: '12px' }}>
          <div style={{ fontSize: '0.68rem', fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', marginBottom: '4px' }}>
            Historical Precedent
          </div>
          <div style={{ fontSize: '0.75rem', color: '#2D3436' }}>{stressResult.historicalPrecedent}</div>
        </div>
        <div>
          <div style={{ fontSize: '0.68rem', fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', marginBottom: '6px' }}>
            Risk Drivers
          </div>
          {stressResult.riskDrivers.map((d) => (
            <span key={d} style={{
              display: 'inline-block', fontSize: '0.68rem', padding: '2px 8px', borderRadius: '4px',
              backgroundColor: '#FEF2F2', color: '#DC2626', marginRight: '4px', marginBottom: '4px',
            }}>
              {d}
            </span>
          ))}
        </div>
      </Card>
    </div>

    {/* Affected Holdings */}
    <Card title="Affected Holdings">
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #EDEDEB' }}>
              <th style={{ textAlign: 'left', padding: '8px 12px', color: '#9AA19E', fontWeight: 500, fontSize: '0.7rem' }}>Holding</th>
              <th style={{ textAlign: 'right', padding: '8px 12px', color: '#9AA19E', fontWeight: 500, fontSize: '0.7rem' }}>Impact</th>
              <th style={{ textAlign: 'right', padding: '8px 12px', color: '#9AA19E', fontWeight: 500, fontSize: '0.7rem' }}>Severity</th>
            </tr>
          </thead>
          <tbody>
            {stressResult.affectedHoldings.map((h) => (
              <tr key={h.name} style={{ borderBottom: '1px solid #F5F4F5' }}>
                <td style={{ padding: '10px 12px', fontWeight: 500 }}>{h.name}</td>
                <td style={{ textAlign: 'right', padding: '10px 12px', fontWeight: 600, color: '#DC2626' }}>
                  {h.impact}%
                </td>
                <td style={{ textAlign: 'right', padding: '10px 12px' }}>
                  <Badge
                    label={Math.abs(h.impact) > 25 ? 'Severe' : Math.abs(h.impact) > 15 ? 'High' : Math.abs(h.impact) > 8 ? 'Moderate' : 'Low'}
                    color={Math.abs(h.impact) > 25 ? '#DC2626' : Math.abs(h.impact) > 15 ? '#D97706' : '#059669'}
                    bg={Math.abs(h.impact) > 25 ? '#FEF2F2' : Math.abs(h.impact) > 15 ? '#FEF3C7' : '#F0FDF4'}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>

    {/* Affected Sectors */}
    <Card title="Affected Sectors">
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
        {stressResult.affectedSectors.map((s) => (
          <span key={s} style={{
            fontSize: '0.75rem', padding: '6px 14px', borderRadius: '6px',
            backgroundColor: '#FEF2F2', color: '#DC2626', fontWeight: 500,
          }}>
            {s}
          </span>
        ))}
      </div>
    </Card>

    <div style={{ padding: '10px 14px', backgroundColor: '#FEF3C7', borderRadius: '8px', fontSize: '0.72rem', color: '#92400E' }}>
      ⚠️ <strong>Model Scenario</strong> — Stress test results use historical precedent and sector-sensitivity models. Actual outcomes may differ materially from these estimates.
    </div>
  </div>
);

// ============================================================
// EFFICIENT FRONTIER PANEL
// ============================================================
const FrontierPanel: React.FC<{ frontierPoints: EfficientFrontierPoint[] }> = ({ frontierPoints }) => {
  const maxRisk = Math.max(...frontierPoints.map((p) => p.risk)) + 5;
  const maxReturn = Math.max(...frontierPoints.map((p) => p.expectedReturn)) + 3;

  return (
    <div className="space-y-6">
      <div>
        <h3 style={{ fontSize: '0.85rem', fontWeight: 600 }}>Risk / Return — Efficient Frontier</h3>
        <p style={{ fontSize: '0.72rem', color: '#9AA19E' }}>Inspect tradeoffs between portfolio risk and expected return</p>
      </div>

      <Card>
        {/* Chart area */}
        <div style={{ position: 'relative', height: '360px', border: '1px solid #EDEDEB', borderRadius: '8px', padding: '20px', backgroundColor: '#FAFAF9' }}>
          {/* Y-axis label */}
          <div style={{ position: 'absolute', left: '-2px', top: '50%', transform: 'rotate(-90deg) translateX(50%)', fontSize: '0.68rem', color: '#9AA19E', fontWeight: 500 }}>
            Expected Return (%)
          </div>
          {/* X-axis label */}
          <div style={{ position: 'absolute', bottom: '0', left: '50%', transform: 'translateX(-50%)', fontSize: '0.68rem', color: '#9AA19E', fontWeight: 500 }}>
            Risk — Volatility (%)
          </div>

          {/* Grid lines */}
          {[0, 25, 50, 75, 100].map((pct) => (
            <div key={`h-${pct}`} style={{
              position: 'absolute', left: '40px', right: '20px',
              top: `${20 + (pct / 100) * 280}px`,
              borderBottom: '1px dashed #EDEDEB',
            }}>
              <span style={{ position: 'absolute', left: '-35px', top: '-6px', fontSize: '0.6rem', color: '#9AA19E' }}>
                {Math.round(maxReturn * (1 - pct / 100))}%
              </span>
            </div>
          ))}

          {/* Plot points */}
          {frontierPoints.map((p) => {
            const x = 40 + (p.risk / maxRisk) * (100 - 10);
            const y = 20 + ((maxReturn - p.expectedReturn) / maxReturn) * 280;
            return (
              <div key={p.id} style={{
                position: 'absolute',
                left: `${x}%`,
                top: `${y}px`,
                transform: 'translate(-50%, -50%)',
                zIndex: 2,
              }}>
                <div style={{
                  width: p.isCurrentPortfolio ? '16px' : '10px',
                  height: p.isCurrentPortfolio ? '16px' : '10px',
                  borderRadius: '50%',
                  backgroundColor: p.isCurrentPortfolio ? '#87BAA4' : '#9AA19E',
                  border: p.isCurrentPortfolio ? '3px solid #fff' : '2px solid #fff',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.15)',
                  cursor: 'pointer',
                }} title={`${p.label}: Risk ${p.risk}%, Return ${p.expectedReturn}%`} />
                <div style={{
                  position: 'absolute', top: p.isCurrentPortfolio ? '-20px' : '-16px', left: '50%', transform: 'translateX(-50%)',
                  fontSize: '0.6rem', fontWeight: p.isCurrentPortfolio ? 700 : 500,
                  color: p.isCurrentPortfolio ? '#141618' : '#9AA19E',
                  whiteSpace: 'nowrap',
                }}>
                  {p.label}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Portfolio comparison table */}
      <Card title="Portfolio Comparison">
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #EDEDEB' }}>
                <th style={{ textAlign: 'left', padding: '8px 12px', color: '#9AA19E', fontWeight: 500, fontSize: '0.7rem' }}>Portfolio</th>
                <th style={{ textAlign: 'right', padding: '8px 12px', color: '#9AA19E', fontWeight: 500, fontSize: '0.7rem' }}>Risk (%)</th>
                <th style={{ textAlign: 'right', padding: '8px 12px', color: '#9AA19E', fontWeight: 500, fontSize: '0.7rem' }}>Exp. Return (%)</th>
                <th style={{ textAlign: 'right', padding: '8px 12px', color: '#9AA19E', fontWeight: 500, fontSize: '0.7rem' }}>Type</th>
              </tr>
            </thead>
            <tbody>
              {frontierPoints.sort((a, b) => a.risk - b.risk).map((p) => (
                <tr key={p.id} style={{
                  borderBottom: '1px solid #F5F4F5',
                  backgroundColor: p.isCurrentPortfolio ? '#F8FBF9' : 'transparent',
                }}>
                  <td style={{ padding: '10px 12px', fontWeight: p.isCurrentPortfolio ? 700 : 500 }}>
                    {p.isCurrentPortfolio && '◉ '}{p.label}
                  </td>
                  <td style={{ textAlign: 'right', padding: '10px 12px', fontWeight: 600 }}>{p.risk}%</td>
                  <td style={{ textAlign: 'right', padding: '10px 12px', fontWeight: 600, color: '#059669' }}>{p.expectedReturn}%</td>
                  <td style={{ textAlign: 'right', padding: '10px 12px' }}>
                    <Badge label={p.isCurrentPortfolio ? 'Current' : 'Candidate'} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <div style={{ padding: '10px 14px', backgroundColor: '#F0F7F4', borderRadius: '8px', fontSize: '0.72rem', color: '#2D3436' }}>
        💡 No portfolio is labeled as &quot;best.&quot; The efficient frontier helps you inspect the tradeoff between risk and expected return across different allocation strategies.
      </div>
    </div>
  );
};

// ============================================================
// ASK FARO PANEL
// ============================================================
const AskFaroPanel: React.FC<{
  aiQuery: string;
  setAiQuery: (q: string) => void;
  aiResponses: { query: string; response: string }[];
  onSubmit: () => void;
}> = ({ aiQuery, setAiQuery, aiResponses, onSubmit }) => {
  const suggestions = [
    'Build a portfolio for $5M with moderate risk.',
    'Show me what happens if technology falls 30%.',
    'Reduce concentration risk.',
    'What assumptions are driving expected return?',
    'Which holdings contribute most to portfolio risk?',
    'Stress test this portfolio.',
    'Compare a 60/40 portfolio with this allocation.',
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 style={{ fontSize: '0.85rem', fontWeight: 600 }}>Ask Faro — Capital Allocation AI</h3>
        <p style={{ fontSize: '0.72rem', color: '#9AA19E' }}>Query the portfolio with natural language</p>
      </div>

      {/* Input */}
      <Card>
        <div className="flex gap-2">
          <input
            type="text" placeholder="Ask about your portfolio..."
            value={aiQuery} onChange={(e) => setAiQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && onSubmit()}
            style={{
              flex: 1, padding: '12px 16px', borderRadius: '8px', border: '1px solid #EDEDEB',
              fontSize: '0.85rem', outline: 'none',
            }}
          />
          <button onClick={onSubmit} style={{
            padding: '12px 20px', borderRadius: '8px', fontSize: '0.82rem', fontWeight: 600,
            backgroundColor: '#87BAA4', color: '#fff', border: 'none', cursor: 'pointer',
          }}>
            ✦ Ask
          </button>
        </div>
        {/* Suggestions */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '12px' }}>
          {suggestions.map((s) => (
            <button key={s} onClick={() => setAiQuery(s)} style={{
              padding: '4px 10px', borderRadius: '6px', fontSize: '0.68rem',
              backgroundColor: '#F5F4F5', color: '#6B7280', border: '1px solid #EDEDEB',
              cursor: 'pointer', transition: 'all 0.15s',
            }}>
              {s}
            </button>
          ))}
        </div>
      </Card>

      {/* Responses */}
      {aiResponses.map((r, i) => (
        <Card key={i}>
          <div style={{
            padding: '8px 12px', backgroundColor: '#F5F4F5', borderRadius: '6px', marginBottom: '12px',
            fontSize: '0.78rem', color: '#6B7280',
          }}>
            You: {r.query}
          </div>
          <div style={{
            fontSize: '0.82rem', lineHeight: '1.8', color: '#2D3436',
            whiteSpace: 'pre-wrap',
          }}>
            {r.response.split('\n').map((line, j) => {
              if (line.startsWith('**') && line.endsWith('**')) {
                return <div key={j} style={{ fontWeight: 700, marginTop: '8px', marginBottom: '4px' }}>{line.replace(/\*\*/g, '')}</div>;
              }
              if (line.startsWith('> ')) {
                return (
                  <div key={j} style={{
                    padding: '8px 12px', backgroundColor: '#FEF3C7', borderRadius: '6px',
                    fontSize: '0.72rem', color: '#92400E', marginTop: '8px',
                    borderLeft: '3px solid #D97706',
                  }}>
                    {line.replace(/^> /, '').replace(/\*\*/g, '')}
                  </div>
                );
              }
              if (line.startsWith('• ')) {
                return <div key={j} style={{ paddingLeft: '12px' }}>• {line.replace(/^• /, '').replace(/\*\*/g, '')}</div>;
              }
              return <div key={j}>{line.replace(/\*\*/g, '')}</div>;
            })}
          </div>
        </Card>
      ))}

      {aiResponses.length === 0 && (
        <div style={{ textAlign: 'center', padding: '48px', color: '#9AA19E', fontSize: '0.82rem' }}>
          <div style={{ fontSize: '2rem', marginBottom: '12px' }}>✦</div>
          Ask Faro about your portfolio to get AI-powered analysis.
        </div>
      )}
    </div>
  );
};

// ============================================================
// SAVE PORTFOLIO MODAL
// ============================================================
const SavePortfolioModal: React.FC<{
  name: string;
  setName: (n: string) => void;
  onSave: () => void;
  onClose: () => void;
}> = ({ name, setName, onSave, onClose }) => (
  <div style={{
    position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex',
    alignItems: 'center', justifyContent: 'center', zIndex: 1000,
  }} onClick={onClose}>
    <div style={{
      backgroundColor: '#fff', borderRadius: '16px', padding: '28px', width: '400px', maxWidth: '90vw',
    }} onClick={(e) => e.stopPropagation()}>
      <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '16px' }}>Save Portfolio</h3>
      <input
        type="text" placeholder="Portfolio name..." autoFocus
        value={name} onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && onSave()}
        style={{
          width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #EDEDEB',
          fontSize: '0.85rem', marginBottom: '16px', outline: 'none',
        }}
      />
      <div className="flex gap-2 justify-end">
        <button onClick={onClose} style={{
          padding: '8px 20px', borderRadius: '8px', fontSize: '0.82rem',
          backgroundColor: '#F5F4F5', color: '#6B7280', border: 'none', cursor: 'pointer',
        }}>
          Cancel
        </button>
        <button onClick={onSave} disabled={!name.trim()} style={{
          padding: '8px 20px', borderRadius: '8px', fontSize: '0.82rem', fontWeight: 600,
          backgroundColor: name.trim() ? '#87BAA4' : '#EDEDEB', color: '#fff', border: 'none',
          cursor: name.trim() ? 'pointer' : 'not-allowed',
        }}>
          Save Portfolio
        </button>
      </div>
    </div>
  </div>
);

// ============================================================
// CONFIG INPUT HELPERS
// ============================================================
const ConfigInput: React.FC<{
  label: string; value: number; type: 'currency' | 'percent' | 'years';
  onChange: (v: number) => void;
}> = ({ label, value, type, onChange }) => (
  <div>
    <label style={{ fontSize: '0.68rem', fontWeight: 500, color: '#9AA19E', display: 'block', marginBottom: '4px' }}>{label}</label>
    <div className="flex items-center" style={{ border: '1px solid #EDEDEB', borderRadius: '8px', overflow: 'hidden' }}>
      {type === 'currency' && <span style={{ padding: '8px 10px', backgroundColor: '#F5F4F5', fontSize: '0.78rem', color: '#6B7280' }}>$</span>}
      <input
        type="number" value={value}
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
        style={{ flex: 1, padding: '8px 10px', border: 'none', fontSize: '0.82rem', fontWeight: 600, outline: 'none', width: '100%' }}
      />
      {type === 'percent' && <span style={{ padding: '8px 10px', backgroundColor: '#F5F4F5', fontSize: '0.78rem', color: '#6B7280' }}>%</span>}
      {type === 'years' && <span style={{ padding: '8px 10px', backgroundColor: '#F5F4F5', fontSize: '0.78rem', color: '#6B7280' }}>yrs</span>}
    </div>
  </div>
);

const ConfigSelect: React.FC<{
  label: string; value: string; options: string[];
  onChange: (v: string) => void;
}> = ({ label, value, options, onChange }) => (
  <div>
    <label style={{ fontSize: '0.68rem', fontWeight: 500, color: '#9AA19E', display: 'block', marginBottom: '4px' }}>{label}</label>
    <select
      value={value} onChange={(e) => onChange(e.target.value)}
      style={{
        width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #EDEDEB',
        fontSize: '0.82rem', fontWeight: 600, outline: 'none', backgroundColor: '#fff',
      }}
    >
      {options.map((o) => <option key={o} value={o}>{o}</option>)}
    </select>
  </div>
);
