'use client';

import React, { useState } from 'react';
import { PublicCompanyIdentity, EvidenceSource } from '@/types/research';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { FinancialPerformanceSection } from './FinancialPerformanceSection';
import { FinancialStatementsTable } from './FinancialStatementsTable';
import { ValuationSection } from './ValuationSection';
import { FaroIntelligenceAnalysis } from './FaroIntelligenceAnalysis';
import { ResearchTimeline } from './ResearchTimeline';
import { AskFaroPanel } from './AskFaroPanel';
import { FinancialDataService } from '@/services/financialDataService';
import { AIResearchService } from '@/services/aiResearchService';
import { AgentMarketplaceService } from '@/services/agentMarketplaceService';
import { OrchestratorService } from '@/services/orchestratorService';
import { NVDA_RESEARCH_TIMELINE } from '@/lib/research-mock-data';
import { 
  Bookmark, 
  Check, 
  FileText, 
  Bot, 
  Workflow,
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight, 
  ArrowLeft,
  Share2,
  Sparkles,
  Layers,
  BarChart3
} from 'lucide-react';

interface PublicCompanyViewProps {
  company: PublicCompanyIdentity;
  onBack: () => void;
  onSelectSource: (source: EvidenceSource) => void;
  onGenerateReport: (company: PublicCompanyIdentity) => void;
  onDelegateAgent: () => void;
  isWatchlisted: boolean;
  onToggleWatchlist: (companyId: string) => void;
}

export const PublicCompanyView: React.FC<PublicCompanyViewProps> = ({
  company,
  onBack,
  onSelectSource,
  onGenerateReport,
  onDelegateAgent,
  isWatchlisted,
  onToggleWatchlist
}) => {
  const [activeSection, setActiveSection] = useState<'all' | 'intelligence' | 'performance' | 'statements' | 'valuation'>('all');

  const history = FinancialDataService.getFinancialsHistory(company.ticker);
  const analysis = AIResearchService.getStructuredAnalysis(company.ticker);

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Analyzed':
        return 'success';
      case 'Researching':
        return 'warning';
      case 'Needs Review':
        return 'danger';
      case 'Updated':
        return 'sage';
      default:
        return 'neutral';
    }
  };

  return (
    <div className="space-y-6 pb-16 max-w-7xl mx-auto animate-in fade-in duration-150">
      {/* Back button */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs text-[#6C726F] hover:text-[#141618] font-medium transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Company Search & Universe</span>
        </button>

        <div className="flex items-center gap-2">
          <StatusBadge variant={getStatusVariant(company.researchStatus)} size="xs" dot>
            Status: {company.researchStatus}
          </StatusBadge>
          <span className="text-[11px] text-[#8C9390]">
            Updated {company.lastUpdated}
          </span>
        </div>
      </div>

      {/* Main Company Header Card */}
      <div className="bg-white border border-[#EDEDEB] rounded-lg p-6 shadow-2xs space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-5 pb-5 border-b border-[#EDEDEB]">
          {/* Identity */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-lg bg-[#141618] text-white flex items-center justify-center font-bold text-base">
                {company.logoLetter}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl md:text-2xl font-bold tracking-tight text-[#141618]">
                    {company.name}
                  </h1>
                  <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-[#EDEDEB] text-[#141618]">
                    {company.ticker}
                  </span>
                  <StatusBadge variant="neutral" size="xs">
                    {company.sector}
                  </StatusBadge>
                </div>
                <div className="text-xs text-[#6C726F] mt-0.5">
                  {company.subIndustry} · {company.country}
                </div>
              </div>
            </div>
            <p className="text-xs text-[#525955] leading-relaxed max-w-2xl pt-1">
              {company.overview}
            </p>
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center gap-2 self-start lg:self-auto">
            <button
              onClick={() => onToggleWatchlist(company.id)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium border flex items-center gap-1.5 transition-colors cursor-pointer ${
                isWatchlisted
                  ? 'bg-[#EBF5F1] text-[#1E4D3C] border-[#BAD6CC]'
                  : 'bg-white hover:bg-[#F5F4F5] text-[#18191B] border-[#EDEDEB]'
              }`}
            >
              {isWatchlisted ? <Check className="w-3.5 h-3.5 text-[#87BAA4]" /> : <Bookmark className="w-3.5 h-3.5 text-[#8C9390]" />}
              <span>{isWatchlisted ? 'In Watchlist' : 'Add to Watchlist'}</span>
            </button>

            <button
              onClick={() => onGenerateReport(company)}
              className="px-3.5 py-1.5 rounded-md bg-[#141618] hover:bg-neutral-800 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Generate Research Report</span>
            </button>

            <button
              onClick={() => {
                const order = AgentMarketplaceService.createWorkOrder({
                  taskTitle: `Analyze ${company.name}'s latest earnings and competitive position`,
                  taskDescription: `Parse 10-Q filing notes, compute consensus beat/miss variances, and model datacenter gross margins for ${company.name} (${company.ticker}).`,
                  preferredAgentId: 'atlas-research',
                  budgetEth: 0.04,
                  priority: 'normal',
                  requiredOutput: 'Research Report',
                  relatedTicker: company.ticker
                });
                alert(`Work order ${order.id} dispatched to Atlas Research! Check Work Orders under Operations.`);
              }}
              className="px-3 py-1.5 rounded-md border border-[#BAD6CC] bg-[#EBF5F1] hover:bg-[#BAD6CC]/50 text-[#1E4D3C] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Bot className="w-3.5 h-3.5" />
              <span>Delegate Research (0.04 ETH)</span>
            </button>

            <button
              onClick={() => {
                const wf = OrchestratorService.createWorkflowFromPrompt({
                  objective: `Deep multi-agent research on ${company.name} (${company.ticker}): fundamentals, competitive landscape, valuation, and risk synthesis.`,
                  targetEntity: `${company.name} (${company.ticker})`,
                  mode: 'automatic',
                  maxBudgetEth: 0.24
                });
                alert(`Faro Orchestrator launched Deep Research Workflow ${wf.id} with 4 coordinated agents! Check "Agent Orchestrator" in the sidebar.`);
              }}
              className="px-3 py-1.5 rounded-md bg-[#141618] hover:bg-neutral-800 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
            >
              <Workflow className="w-3.5 h-3.5 text-[#87BAA4]" />
              <span>Deep Research (4 Agents)</span>
            </button>
          </div>
        </div>

        {/* Financial Metrics Strip (10 Core Metrics with YoY / % changes) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 text-xs">
          <div className="p-3 bg-[#FAFAF9] rounded-lg border border-[#EDEDEB]">
            <span className="text-[10.5px] text-[#8C9390] block mb-0.5 font-medium">Share Price</span>
            <div className="flex items-baseline justify-between">
              <span className="text-base font-bold text-[#141618] tabular-nums">
                {company.sharePriceFormatted}
              </span>
              <span className={`text-[11px] font-semibold ${company.isPositive1D ? 'text-[#23683C]' : 'text-[#A5342C]'}`}>
                {company.sharePriceChange1D}
              </span>
            </div>
          </div>

          <div className="p-3 bg-[#FAFAF9] rounded-lg border border-[#EDEDEB]">
            <span className="text-[10.5px] text-[#8C9390] block mb-0.5 font-medium">Market Cap</span>
            <span className="text-base font-bold text-[#141618] tabular-nums">
              {company.marketCapFormatted}
            </span>
          </div>

          <div className="p-3 bg-[#FAFAF9] rounded-lg border border-[#EDEDEB]">
            <span className="text-[10.5px] text-[#8C9390] block mb-0.5 font-medium">Revenue (TTM)</span>
            <div className="flex items-baseline justify-between">
              <span className="text-base font-bold text-[#141618] tabular-nums">
                {company.revenueTTM}
              </span>
              <span className="text-[11px] font-semibold text-[#23683C]">
                {company.revenueGrowthYoY}
              </span>
            </div>
          </div>

          <div className="p-3 bg-[#FAFAF9] rounded-lg border border-[#EDEDEB]">
            <span className="text-[10.5px] text-[#8C9390] block mb-0.5 font-medium">EBITDA Margin</span>
            <span className="text-base font-bold text-[#141618] tabular-nums">
              {company.ebitdaMargin}
            </span>
          </div>

          <div className="p-3 bg-[#FAFAF9] rounded-lg border border-[#EDEDEB]">
            <span className="text-[10.5px] text-[#8C9390] block mb-0.5 font-medium">Net Income (TTM)</span>
            <span className="text-base font-bold text-[#141618] tabular-nums">
              {company.netIncomeTTM}
            </span>
          </div>

          <div className="p-3 bg-[#FAFAF9] rounded-lg border border-[#EDEDEB]">
            <span className="text-[10.5px] text-[#8C9390] block mb-0.5 font-medium">Free Cash Flow</span>
            <span className="text-base font-bold text-[#204A3B] tabular-nums">
              {company.freeCashFlowTTM}
            </span>
          </div>

          <div className="p-3 bg-[#FAFAF9] rounded-lg border border-[#EDEDEB]">
            <span className="text-[10.5px] text-[#8C9390] block mb-0.5 font-medium">Cash & Short-Term</span>
            <span className="text-base font-bold text-[#141618] tabular-nums">
              {company.cash}
            </span>
          </div>

          <div className="p-3 bg-[#FAFAF9] rounded-lg border border-[#EDEDEB]">
            <span className="text-[10.5px] text-[#8C9390] block mb-0.5 font-medium">Total Debt</span>
            <span className="text-base font-bold text-[#555C58] tabular-nums">
              {company.debt}
            </span>
          </div>

          <div className="p-3 bg-[#FAFAF9] rounded-lg border border-[#EDEDEB]">
            <span className="text-[10.5px] text-[#8C9390] block mb-0.5 font-medium">Trailing P/E</span>
            <span className="text-base font-bold text-[#141618] tabular-nums">
              {company.peRatio}x
            </span>
          </div>

          <div className="p-3 bg-[#FAFAF9] rounded-lg border border-[#EDEDEB]">
            <span className="text-[10.5px] text-[#8C9390] block mb-0.5 font-medium">Risk Assessment</span>
            <StatusBadge variant={company.riskIndicator === 'Low' ? 'success' : company.riskIndicator === 'Moderate' ? 'warning' : 'danger'} size="xs">
              {company.riskIndicator} Risk
            </StatusBadge>
          </div>
        </div>
      </div>

      {/* Section Navigation Tabs */}
      <div className="flex items-center gap-1 border-b border-[#EDEDEB] pb-2 text-xs">
        <button
          onClick={() => setActiveSection('all')}
          className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
            activeSection === 'all'
              ? 'bg-white text-[#141618] font-semibold border border-[#EDEDEB] shadow-2xs'
              : 'text-[#6C726F] hover:text-[#141618]'
          }`}
        >
          All Dossier Sections
        </button>
        <button
          onClick={() => setActiveSection('intelligence')}
          className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
            activeSection === 'intelligence'
              ? 'bg-white text-[#141618] font-semibold border border-[#EDEDEB] shadow-2xs'
              : 'text-[#6C726F] hover:text-[#141618]'
          }`}
        >
          Faro Intelligence
        </button>
        <button
          onClick={() => setActiveSection('performance')}
          className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
            activeSection === 'performance'
              ? 'bg-white text-[#141618] font-semibold border border-[#EDEDEB] shadow-2xs'
              : 'text-[#6C726F] hover:text-[#141618]'
          }`}
        >
          Financial Performance
        </button>
        <button
          onClick={() => setActiveSection('statements')}
          className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
            activeSection === 'statements'
              ? 'bg-white text-[#141618] font-semibold border border-[#EDEDEB] shadow-2xs'
              : 'text-[#6C726F] hover:text-[#141618]'
          }`}
        >
          Financial Statements
        </button>
        <button
          onClick={() => setActiveSection('valuation')}
          className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
            activeSection === 'valuation'
              ? 'bg-white text-[#141618] font-semibold border border-[#EDEDEB] shadow-2xs'
              : 'text-[#6C726F] hover:text-[#141618]'
          }`}
        >
          Valuation & DCF
        </button>
      </div>

      {/* 1. Faro Intelligence Analysis Panel */}
      {(activeSection === 'all' || activeSection === 'intelligence') && (
        <FaroIntelligenceAnalysis
          analysis={analysis}
          onSelectSource={onSelectSource}
        />
      )}

      {/* 2. Interactive Financial Performance Section */}
      {(activeSection === 'all' || activeSection === 'performance') && (
        <FinancialPerformanceSection history={history} />
      )}

      {/* 3. Financial Statements Table */}
      {(activeSection === 'all' || activeSection === 'statements') && (
        <FinancialStatementsTable history={history} />
      )}

      {/* 4. Valuation & DCF Analysis */}
      {(activeSection === 'all' || activeSection === 'valuation') && (
        <ValuationSection company={company} />
      )}

      {/* 5. Bottom Split: Ask Faro Contextual Assistant & Research Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-7">
          <AskFaroPanel
            company={company}
            onSelectSource={onSelectSource}
            onOpenDCF={() => setActiveSection('valuation')}
          />
        </div>

        <div className="lg:col-span-5">
          <ResearchTimeline
            events={NVDA_RESEARCH_TIMELINE}
            onDelegateNewTask={onDelegateAgent}
          />
        </div>
      </div>
    </div>
  );
};
