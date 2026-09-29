'use client';

import React, { useState } from 'react';
import { MarketplaceAgent } from '@/types/agentMarketplace';
import { 
  ArrowLeft, 
  Star, 
  Clock, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowUpRight, 
  FileText, 
  Activity, 
  Check, 
  AlertCircle,
  TrendingUp,
  Cpu,
  Layers
} from 'lucide-react';
import { StatusBadge } from '@/components/ui/StatusBadge';

interface AgentProfileViewProps {
  agent: MarketplaceAgent;
  onBack: () => void;
  onHireAgent: (agent: MarketplaceAgent) => void;
}

export const AgentProfileView: React.FC<AgentProfileViewProps> = ({
  agent,
  onBack,
  onHireAgent
}) => {
  const [activeTab, setActiveTab] = useState<'about' | 'capabilities' | 'past_work' | 'performance' | 'reviews'>('about');

  return (
    <div className="space-y-6 pb-16 max-w-6xl mx-auto animate-in fade-in duration-200">
      {/* Back button */}
      <div>
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#6C726F] hover:text-[#141618] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Marketplace</span>
        </button>
      </div>

      {/* Hero Header Card */}
      <div className="bg-white border border-[#EDEDEB] rounded-xl p-6 sm:p-8 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
          <div className="flex items-start gap-4">
            <div
              className="w-16 h-16 rounded-xl flex items-center justify-center text-xl font-bold shrink-0 shadow-2xs"
              style={{
                backgroundColor: agent.badgeBg,
                color: agent.badgeColor
              }}
            >
              {agent.badge}
            </div>

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-2xl font-bold tracking-tight text-[#141618]">
                  {agent.name}
                </h1>
                <StatusBadge
                  variant={agent.availability === 'available' ? 'success' : agent.availability === 'busy' ? 'warning' : 'neutral'}
                  size="sm"
                  dot
                >
                  {agent.availability.toUpperCase()}
                </StatusBadge>
                {agent.isDemoAgent && (
                  <span className="text-[10px] font-semibold text-[#87BAA4] px-1.5 py-0.5 rounded bg-[#F0F7F4] border border-[#BAD6CC]/50">
                    DEMO AGENT
                  </span>
                )}
              </div>

              <p className="text-sm font-medium text-[#4A504D]">
                {agent.specialization} · <span className="text-[#8C9390]">{agent.category}</span>
              </p>

              <div className="flex flex-wrap items-center gap-4 text-xs text-[#6C726F] pt-1">
                <div className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-[#E58A38] text-[#E58A38]" />
                  <span className="font-bold text-[#141618]">{agent.rating.toFixed(1)}</span>
                  <span>({agent.reviews.length} reviews)</span>
                </div>
                <span>•</span>
                <div>
                  <span className="font-bold text-[#141618]">{agent.completedTasks}</span> tasks completed
                </div>
                <span>•</span>
                <div>
                  <span className="font-bold text-[#059669]">{agent.successRate}%</span> success rate
                </div>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-[#9AA19E]" />
                  <span>Avg {agent.latency}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Pricing & CTA */}
          <div className="flex flex-col items-start sm:items-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#EDEDEB]">
            <div>
              <div className="text-[10.5px] uppercase font-semibold text-[#9AA19E] tracking-wider text-left sm:text-right">
                Pricing Structure
              </div>
              <div className="text-2xl font-extrabold text-[#141618] tracking-tight text-left sm:text-right">
                {agent.pricing.startingPriceFormatted}
              </div>
              <div className="text-[11px] text-[#6C726F] text-left sm:text-right">
                {agent.pricing.model} (Escrow Protected)
              </div>
            </div>

            <button
              onClick={() => onHireAgent(agent)}
              className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-lg bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer w-full sm:w-auto"
            >
              <span>Hire {agent.name}</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mt-8 pt-4 border-t border-[#EDEDEB] flex items-center gap-2 overflow-x-auto">
          {[
            { key: 'about', label: 'About & Overview' },
            { key: 'capabilities', label: 'Capabilities & Moats' },
            { key: 'past_work', label: 'Recent Deliverables' },
            { key: 'performance', label: 'Performance & Velocity' },
            { key: 'reviews', label: `Verified Reviews (${agent.reviews.length})` }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all whitespace-nowrap ${
                activeTab === tab.key
                  ? 'bg-[#141618] text-white shadow-2xs'
                  : 'text-[#6C726F] hover:bg-[#F5F4F5] hover:text-[#141618]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left 8 cols: Main tab content */}
        <div className="lg:col-span-8 space-y-6">
          {activeTab === 'about' && (
            <div className="bg-white border border-[#EDEDEB] rounded-xl p-6 shadow-2xs space-y-5">
              <div>
                <h3 className="text-sm font-bold text-[#141618] mb-2">Agent Overview</h3>
                <p className="text-xs text-[#4A504D] leading-relaxed">
                  {agent.about}
                </p>
              </div>

              <div className="pt-4 border-t border-[#EDEDEB]">
                <h4 className="text-xs font-bold text-[#141618] mb-3">Model Architecture & Infrastructure</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 bg-[#FBFBFA] rounded-lg border border-[#EDEDEB]">
                    <div className="text-[10px] uppercase font-semibold text-[#9AA19E] tracking-wider">Foundation Model</div>
                    <div className="text-xs font-semibold text-[#141618] mt-0.5">{agent.model}</div>
                  </div>
                  <div className="p-3 bg-[#FBFBFA] rounded-lg border border-[#EDEDEB]">
                    <div className="text-[10px] uppercase font-semibold text-[#9AA19E] tracking-wider">Latency SLA</div>
                    <div className="text-xs font-semibold text-[#141618] mt-0.5">{agent.latency}</div>
                  </div>
                  <div className="p-3 bg-[#FBFBFA] rounded-lg border border-[#EDEDEB]">
                    <div className="text-[10px] uppercase font-semibold text-[#9AA19E] tracking-wider">Execution Pipeline</div>
                    <div className="text-xs font-semibold text-[#141618] mt-0.5">Dual-Pass Verification & Evidence Mapping</div>
                  </div>
                  <div className="p-3 bg-[#FBFBFA] rounded-lg border border-[#EDEDEB]">
                    <div className="text-[10px] uppercase font-semibold text-[#9AA19E] tracking-wider">Active Parallel Orders</div>
                    <div className="text-xs font-semibold text-[#141618] mt-0.5">{agent.activeOrders} queue slots</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'capabilities' && (
            <div className="bg-white border border-[#EDEDEB] rounded-xl p-6 shadow-2xs space-y-4">
              <h3 className="text-sm font-bold text-[#141618]">Specialized Capabilities</h3>
              <p className="text-xs text-[#6C726F]">
                Institutional capabilities verified against standard private equity & public research workflows.
              </p>

              <div className="space-y-2.5 pt-2">
                {agent.capabilities.map((cap, i) => (
                  <div key={i} className="flex items-start gap-2.5 p-3 rounded-lg border border-[#EDEDEB] bg-[#FBFBFA]">
                    <CheckCircle2 className="w-4 h-4 text-[#87BAA4] shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs font-semibold text-[#141618]">{cap}</div>
                      <div className="text-[11px] text-[#6C726F] mt-0.5">
                        Produces structured citations, audited figures, and confidence ratings.
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'past_work' && (
            <div className="bg-white border border-[#EDEDEB] rounded-xl p-6 shadow-2xs space-y-4">
              <h3 className="text-sm font-bold text-[#141618]">Recent Anonymized Deliverables</h3>
              <p className="text-xs text-[#6C726F]">
                Recent briefs generated by {agent.name} with verified user sign-offs.
              </p>

              <div className="space-y-3 pt-2">
                {agent.recentDeliverableTitles.map((title, i) => (
                  <div key={i} className="p-4 rounded-lg border border-[#EDEDEB] bg-white hover:border-[#87BAA4]/60 transition-colors flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FileText className="w-4 h-4 text-[#2B5C8F]" />
                      <div>
                        <div className="text-xs font-semibold text-[#141618]">{title}</div>
                        <div className="text-[10px] text-[#9AA19E] mt-0.5">Verified deliverable · 8–12 cited sources</div>
                      </div>
                    </div>
                    <span className="text-[11px] font-semibold text-[#059669]">Accepted & Paid</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'performance' && (
            <div className="bg-white border border-[#EDEDEB] rounded-xl p-6 shadow-2xs space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-[#141618]">Agent Performance Metrics</h3>
                  <p className="text-xs text-[#6C726F] mt-0.5">Audited completion and SLA metrics (Demo Dataset)</p>
                </div>
                <span className="text-[10px] font-semibold text-[#9AA19E] bg-[#FAFAF9] px-2 py-0.5 rounded border border-[#EDEDEB]">
                  DEMO DATA
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 bg-[#FBFBFA] rounded-lg border border-[#EDEDEB]">
                  <div className="text-[10px] uppercase font-semibold text-[#9AA19E]">Tasks Completed</div>
                  <div className="text-lg font-bold text-[#141618] mt-1">{agent.performance.tasksCompleted}</div>
                </div>
                <div className="p-3 bg-[#FBFBFA] rounded-lg border border-[#EDEDEB]">
                  <div className="text-[10px] uppercase font-semibold text-[#9AA19E]">Success Rate</div>
                  <div className="text-lg font-bold text-[#059669] mt-1">{agent.performance.successRate}%</div>
                </div>
                <div className="p-3 bg-[#FBFBFA] rounded-lg border border-[#EDEDEB]">
                  <div className="text-[10px] uppercase font-semibold text-[#9AA19E]">Accuracy Score</div>
                  <div className="text-lg font-bold text-[#141618] mt-1">{agent.performance.accuracyScore}%</div>
                </div>
                <div className="p-3 bg-[#FBFBFA] rounded-lg border border-[#EDEDEB]">
                  <div className="text-[10px] uppercase font-semibold text-[#9AA19E]">Avg Delivery Time</div>
                  <div className="text-lg font-bold text-[#141618] mt-1">{agent.performance.averageCompletionTime}</div>
                </div>
              </div>

              <div className="pt-2">
                <div className="text-xs font-semibold text-[#141618] mb-2 flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-[#87BAA4]" />
                  <span>Monthly Task Velocity (Trailing 6 Months)</span>
                </div>
                <div className="flex items-end gap-2 h-20 pt-2 border-b border-[#EDEDEB]">
                  {agent.performance.monthlyVelocity.map((val, idx) => (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                      <div 
                        className="w-full bg-[#87BAA4] rounded-t hover:bg-[#689B85] transition-colors"
                        style={{ height: `${(val / 60) * 100}%` }}
                        title={`${val} tasks`}
                      />
                      <span className="text-[9px] text-[#9AA19E]">M{idx + 1}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="bg-white border border-[#EDEDEB] rounded-xl p-6 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-[#141618]">Institutional User Reviews</h3>
                <div className="flex items-center gap-1 text-xs font-bold text-[#141618]">
                  <Star className="w-3.5 h-3.5 fill-[#E58A38] text-[#E58A38]" />
                  <span>{agent.rating.toFixed(1)} / 5.0</span>
                </div>
              </div>

              <div className="space-y-3.5 pt-2">
                {agent.reviews.map((rev) => (
                  <div key={rev.id} className="p-4 rounded-lg border border-[#EDEDEB] bg-[#FBFBFA] space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="text-xs font-bold text-[#141618]">{rev.userName}</div>
                        <div className="text-[10.5px] text-[#6C726F]">{rev.userRole}</div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star 
                              key={i} 
                              className={`w-3 h-3 ${i < rev.rating ? 'fill-[#E58A38] text-[#E58A38]' : 'text-[#EDEDEB]'}`} 
                            />
                          ))}
                        </div>
                        <div className="text-[10px] text-[#9AA19E] mt-0.5">{rev.date}</div>
                      </div>
                    </div>

                    <p className="text-xs text-[#2D3436] italic leading-relaxed">
                      "{rev.comment}"
                    </p>

                    <div className="flex items-center gap-3 text-[10px] text-[#78807C] pt-1 border-t border-[#EDEDEB]/50">
                      <span>Accuracy: {rev.accuracy}/5</span>
                      <span>Evidence: {rev.evidenceQuality}/5</span>
                      <span>Timeliness: {rev.timeliness}/5</span>
                      <span className="text-[#87BAA4] font-medium ml-auto">Verified Task #{rev.verifiedWorkOrderId}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right 4 cols: Escrow & Delegation Guarantee */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white border border-[#EDEDEB] rounded-xl p-5 shadow-2xs space-y-3">
            <div className="flex items-center gap-2 text-[#87BAA4]">
              <ShieldCheck className="w-5 h-5" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#141618]">
                Escrow Guarantee
              </h3>
            </div>
            <p className="text-xs text-[#6C726F] leading-relaxed">
              Every work order placed with {agent.name} is funded into smart contract escrow. Funds are only released when you inspect and accept the final evidence deliverable.
            </p>
            <div className="p-3 bg-[#F0F7F4] border border-[#BAD6CC]/60 rounded-lg text-[11px] text-[#245241] space-y-1">
              <div className="font-semibold flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5" />
                <span>Simulated Demo Escrow</span>
              </div>
              <div>No real wallet transaction required in current demonstration phase.</div>
            </div>
          </div>

          <div className="bg-white border border-[#EDEDEB] rounded-xl p-5 shadow-2xs space-y-3">
            <h4 className="text-xs font-bold text-[#141618] uppercase tracking-wider">
              Pricing Details
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-[#EDEDEB]">
                <span className="text-[#6C726F]">Base Task Cost:</span>
                <span className="font-bold text-[#141618]">{agent.pricing.startingPriceFormatted}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#EDEDEB]">
                <span className="text-[#6C726F]">Pricing Model:</span>
                <span className="font-medium text-[#141618]">{agent.pricing.model}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#EDEDEB]">
                <span className="text-[#6C726F]">Revisions Allowed:</span>
                <span className="font-medium text-[#141618]">2 Free Iterations</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-[#6C726F]">Turnaround SLA:</span>
                <span className="font-medium text-[#059669]">{agent.latency}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
