'use client';

import React from 'react';
import { SectionHeader } from '@/components/dashboard/SectionHeader';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { FaroIntelligenceCard } from '@/components/dashboard/FaroIntelligenceCard';
import { PortfolioExposureCard } from '@/components/dashboard/PortfolioExposureCard';
import { OpportunitiesSection } from '@/components/dashboard/OpportunityCard';
import { AgentPreviewSection } from '@/components/dashboard/AgentCard';
import { CAPITAL_METRICS, FARO_INTELLIGENCE_INSIGHT, INVESTMENT_OPPORTUNITIES, SPECIALIST_AGENTS } from '@/lib/mock-data';
import { PORTFOLIO_SNAPSHOTS } from '@/lib/portfolio-mock-data';
import { InvestmentOpportunity, AIAgent } from '@/types';
import { Plus, Download, ArrowUpRight, ShieldCheck, Activity, Briefcase } from 'lucide-react';

interface CommandCenterViewProps {
  onSelectOpportunity: (opp: InvestmentOpportunity) => void;
  onSelectAgent: (agent: AIAgent) => void;
  onPostTask: () => void;
  onOpenAnalysis: () => void;
  onNavigateToMarketplace: () => void;
  onNavigateToAgentActivity?: () => void;
  onSelectPortfolio?: (id: string) => void;
}

export const CommandCenterView: React.FC<CommandCenterViewProps> = ({
  onSelectOpportunity,
  onSelectAgent,
  onPostTask,
  onOpenAnalysis,
  onNavigateToMarketplace,
  onNavigateToAgentActivity,
  onSelectPortfolio
}) => {
  return (
    <div className="space-y-8 pb-12 max-w-7xl mx-auto">
      {/* 1. Header */}
      <SectionHeader
        kicker="Capital Allocation OS"
        title="Capital Command Center"
        subtitle="Understand your capital. Research opportunities. Allocate with evidence."
        action={
          <div className="flex items-center gap-2">
            <button
              onClick={onPostTask}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#141618] hover:bg-neutral-800 text-white text-xs font-semibold transition-colors shadow-2xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Deploy Capital Action</span>
            </button>
          </div>
        }
      />

      {/* 2. Capital Overview Metrics (6 clean cards) */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-[10.5px] font-semibold uppercase tracking-wider text-[#9AA19E]">
            Capital Overview
          </span>
          <span className="text-[10.5px] text-[#8C9390]">
            Fund Cycle: Q2 2026 · Real-time Valuation
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5">
          {CAPITAL_METRICS.map((metric) => (
            <MetricCard key={metric.id} metric={metric} />
          ))}
        </div>
      </div>

      {/* 3. AI Insight Panel (Faro Intelligence) */}
      <div>
        <FaroIntelligenceCard
          insight={FARO_INTELLIGENCE_INSIGHT}
          onOpenDetailedAnalysis={onOpenAnalysis}
        />
      </div>

      {/* 4. Portfolio Exposure Section */}
      <div>
        <PortfolioExposureCard />
      </div>

      {/* NEW: Saved Portfolios Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[10.5px] font-semibold uppercase tracking-wider text-[#9AA19E]">
            Saved Portfolios
          </span>
          <button 
            onClick={() => onSelectPortfolio?.('new')}
            className="text-[10.5px] font-semibold text-[#87BAA4] hover:text-[#6B9A8A] transition-colors"
          >
            + New Portfolio
          </button>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {PORTFOLIO_SNAPSHOTS.map((portfolio) => (
            <div 
              key={portfolio.id}
              onClick={() => onSelectPortfolio?.(portfolio.id)}
              className="bg-white border border-[#EDEDEB] rounded-xl p-5 hover:shadow-sm transition-all cursor-pointer group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#F0F7F4] flex items-center justify-center text-[#87BAA4]">
                    <Briefcase className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-[#141618] group-hover:text-[#87BAA4] transition-colors">
                      {portfolio.name}
                    </h4>
                    <span className="text-[10.5px] text-[#9AA19E]">Updated {portfolio.lastUpdated}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-[#141618]">{portfolio.capitalFormatted}</div>
                  <div className={`text-[10.5px] font-semibold ${portfolio.isPositiveChange ? 'text-[#059669]' : 'text-[#DC2626]'}`}>
                    {portfolio.changePercent}
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-2 py-3 border-t border-[#EDEDEB]">
                <div>
                  <div className="text-[10px] text-[#9AA19E] mb-0.5 uppercase tracking-wider">Return</div>
                  <div className="text-xs font-semibold text-[#059669]">{portfolio.expectedReturn}</div>
                </div>
                <div>
                  <div className="text-[10px] text-[#9AA19E] mb-0.5 uppercase tracking-wider">Risk</div>
                  <div className="text-xs font-semibold text-[#D97706]">{portfolio.riskLevel}</div>
                </div>
                <div>
                  <div className="text-[10px] text-[#9AA19E] mb-0.5 uppercase tracking-wider">Holdings</div>
                  <div className="text-xs font-semibold text-[#141618]">{portfolio.holdingsCount}</div>
                </div>
              </div>
              
              <div className="pt-3 border-t border-[#EDEDEB] flex items-center justify-between">
                <span className="text-[10.5px] text-[#6B7280]">Top Allocation</span>
                <span className="text-[10.5px] font-semibold text-[#141618]">{portfolio.topHolding} ({portfolio.topHoldingPercent})</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Investment Opportunities Section */}
      <div>
        <OpportunitiesSection
          opportunities={INVESTMENT_OPPORTUNITIES}
          onSelectOpportunity={onSelectOpportunity}
        />
      </div>

      {/* 6. Agent Marketplace Preview Section */}
      <div className="pt-2 border-t border-[#EDEDEB]/80 space-y-4">
        <AgentPreviewSection
          agents={SPECIALIST_AGENTS}
          onSelectAgent={onSelectAgent}
          onPostTask={onPostTask}
        />

        {/* Live Active Agents Telemetry Preview */}
        <div className="bg-white border border-[#EDEDEB] rounded-xl p-5 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#87BAA4]" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#141618]">
                Active Agents Telemetry
              </h3>
            </div>
            <button
              onClick={onNavigateToAgentActivity}
              className="text-xs font-semibold text-[#87BAA4] hover:text-[#204A3B] transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span>View Agent Activity</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-lg border border-[#EDEDEB] bg-[#FBFBFA] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded bg-[#EBF2FA] text-[#2B5C8F] font-bold text-xs flex items-center justify-center">
                  AR
                </div>
                <div>
                  <div className="text-xs font-bold text-[#141618]">Atlas Research</div>
                  <div className="text-[10.5px] text-[#6C726F]">Researching</div>
                </div>
              </div>
              <span className="w-2 h-2 rounded-full bg-[#E58A38] animate-pulse" />
            </div>

            <div className="p-3.5 rounded-lg border border-[#EDEDEB] bg-[#FBFBFA] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded bg-[#EBF5F1] text-[#2E6E56] font-bold text-xs flex items-center justify-center">
                  KR
                </div>
                <div>
                  <div className="text-xs font-bold text-[#141618]">Keystone Risk</div>
                  <div className="text-[10.5px] text-[#23683C] font-semibold">Deliverable Ready</div>
                </div>
              </div>
              <span className="w-2 h-2 rounded-full bg-[#059669]" />
            </div>

            <div className="p-3.5 rounded-lg border border-[#EDEDEB] bg-[#FBFBFA] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded bg-[#FEF3EB] text-[#A85A24] font-bold text-xs flex items-center justify-center">
                  MD
                </div>
                <div>
                  <div className="text-xs font-bold text-[#141618]">Mosaic Diligence</div>
                  <div className="text-[10.5px] text-[#6C726F]">Awaiting Review</div>
                </div>
              </div>
              <span className="w-2 h-2 rounded-full bg-[#87BAA4]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
