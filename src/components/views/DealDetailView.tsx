'use client';

import React, { useState, useMemo } from 'react';
import { DealService } from '@/services/dealService';
import { AgentMarketplaceService } from '@/services/agentMarketplaceService';
import { OrchestratorService } from '@/services/orchestratorService';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { 
  Building2, DollarSign, FileText, Activity, ShieldAlert,
  Users, Briefcase, FileCheck, Landmark, BarChart3, Clock, Lock, Workflow
} from 'lucide-react';

interface DealDetailViewProps {
  dealId: string;
  onBack: () => void;
}

type DealTab = 'overview' | 'screening' | 'diligence' | 'documents' | 'cap_table' | 'terms' | 'valuation' | 'risk' | 'ic_review' | 'memo' | 'activity';

export const DealDetailView: React.FC<DealDetailViewProps> = ({ dealId, onBack }) => {
  const [activeTab, setActiveTab] = useState<DealTab>('overview');

  const deal = useMemo(() => DealService.getDealById(dealId), [dealId]);
  const terms = useMemo(() => DealService.getDealTerms(dealId), [dealId]);
  const capTable = useMemo(() => DealService.getCapTable(dealId), [dealId]);
  const diligence = useMemo(() => DealService.getDueDiligence(dealId), [dealId]);
  const documents = useMemo(() => DealService.getDocuments(dealId), [dealId]);
  const risks = useMemo(() => DealService.getRisks(dealId), [dealId]);
  const icReview = useMemo(() => DealService.getICReview(dealId), [dealId]);
  const activities = useMemo(() => DealService.getActivities(dealId), [dealId]);
  const diligenceProgress = useMemo(() => DealService.getDiligenceProgress(dealId), [dealId]);

  if (!deal) {
    return <div>Deal not found.</div>;
  }

  const tabs: { key: DealTab; label: string; icon: React.ReactNode }[] = [
    { key: 'overview', label: 'Overview', icon: <Building2 className="w-3.5 h-3.5" /> },
    { key: 'screening', label: 'Screening', icon: <BarChart3 className="w-3.5 h-3.5" /> },
    { key: 'diligence', label: 'Due Diligence', icon: <FileCheck className="w-3.5 h-3.5" /> },
    { key: 'documents', label: 'Documents', icon: <FileText className="w-3.5 h-3.5" /> },
    { key: 'cap_table', label: 'Cap Table', icon: <Users className="w-3.5 h-3.5" /> },
    { key: 'terms', label: 'Deal Terms', icon: <Briefcase className="w-3.5 h-3.5" /> },
    { key: 'valuation', label: 'Valuation', icon: <DollarSign className="w-3.5 h-3.5" /> },
    { key: 'risk', label: 'Risk Analysis', icon: <ShieldAlert className="w-3.5 h-3.5" /> },
    { key: 'ic_review', label: 'IC Review', icon: <Landmark className="w-3.5 h-3.5" /> },
    { key: 'memo', label: 'Investment Memo', icon: <FileText className="w-3.5 h-3.5" /> },
    { key: 'activity', label: 'Activity', icon: <Activity className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="space-y-6 pb-12 max-w-[1200px] mx-auto animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <button 
          onClick={onBack}
          className="text-xs font-semibold text-[#6B7280] hover:text-[#141618] transition-colors self-start"
        >
          ← Back to Pipeline
        </button>

        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold text-[#141618] tracking-tight">{deal.companyName}</h1>
              <StatusBadge variant={deal.status === 'active' ? 'success' : 'neutral'} size="sm">
                {deal.stage.replace('_', ' ').toUpperCase()}
              </StatusBadge>
              {deal.riskStatus === 'high' && (
                <StatusBadge variant="danger" size="sm">HIGH RISK</StatusBadge>
              )}
            </div>
            <p className="text-sm text-[#6B7280] max-w-2xl">{deal.description}</p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button 
              onClick={() => {
                const wf = OrchestratorService.createWorkflowFromPrompt({
                  objective: `Run full 7-agent due diligence pipeline on ${deal.companyName} for potential $5M growth investment.`,
                  targetEntity: deal.companyName,
                  mode: 'automatic',
                  maxBudgetEth: 0.38,
                  relatedDealId: deal.id
                });
                alert(`Faro Orchestrator launched Workflow ${wf.id} with 7 specialized agents! Check "Agent Orchestrator" in the sidebar.`);
              }}
              className="px-3.5 py-1.5 bg-[#141618] hover:bg-neutral-800 text-white rounded-lg text-xs font-semibold shadow-2xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Workflow className="w-3.5 h-3.5 text-[#87BAA4]" />
              <span>Run Full AI Diligence (7 Agents)</span>
            </button>
            <button 
              onClick={() => {
                const order = AgentMarketplaceService.createWorkOrder({
                  taskTitle: `Perform financial diligence on ${deal.companyName}`,
                  taskDescription: `Audit ${deal.companyName} cap table, revenue growth, customer cohorts, and unit margins.`,
                  preferredAgentId: 'mosaic-diligence',
                  budgetEth: 0.08,
                  priority: 'high',
                  requiredOutput: 'Research Report',
                  relatedDealId: deal.id
                });
                alert(`Work order ${order.id} dispatched to Mosaic Diligence! Check Work Orders under Operations.`);
              }}
              className="px-3 py-1.5 bg-[#F0F7F4] border border-[#BAD6CC] text-[#245241] rounded-lg text-xs font-semibold shadow-2xs hover:bg-[#E0EDE6] transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <span>+ Financial Diligence (0.08 ETH)</span>
            </button>
            <button 
              onClick={() => {
                const order = AgentMarketplaceService.createWorkOrder({
                  taskTitle: `Review risk & downside scenarios for ${deal.companyName}`,
                  taskDescription: `Perform multi-factor risk simulation and competitive vulnerability audit on ${deal.companyName}.`,
                  preferredAgentId: 'keystone-risk',
                  budgetEth: 0.03,
                  priority: 'normal',
                  requiredOutput: 'Risk Analysis',
                  relatedDealId: deal.id
                });
                alert(`Work order ${order.id} dispatched to Keystone Risk! Check Work Orders under Operations.`);
              }}
              className="px-3 py-1.5 bg-white border border-[#EDEDEB] rounded-lg text-xs font-semibold text-[#141618] shadow-2xs hover:bg-[#FAFAF9] transition-colors cursor-pointer"
            >
              Review Risk
            </button>
            <button className="px-3 py-1.5 bg-[#141618] text-white border border-transparent rounded-lg text-xs font-semibold shadow-2xs hover:bg-neutral-800 flex items-center gap-1.5 cursor-pointer">
              <Activity className="w-3.5 h-3.5" /> Move Stage
            </button>
          </div>
        </div>

        {/* Top metrics bar */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-2">
          <div className="bg-white border border-[#EDEDEB] rounded-lg p-3">
            <div className="text-[10px] text-[#9AA19E] uppercase font-semibold">Deal Size</div>
            <div className="text-sm font-bold mt-0.5">${(deal.roundSize / 1000000).toFixed(1)}M</div>
          </div>
          <div className="bg-white border border-[#EDEDEB] rounded-lg p-3">
            <div className="text-[10px] text-[#9AA19E] uppercase font-semibold">Valuation (Post)</div>
            <div className="text-sm font-bold mt-0.5">${(deal.valuation / 1000000).toFixed(1)}M</div>
          </div>
          <div className="bg-white border border-[#EDEDEB] rounded-lg p-3">
            <div className="text-[10px] text-[#9AA19E] uppercase font-semibold">Industry</div>
            <div className="text-sm font-bold mt-0.5">{deal.industry}</div>
          </div>
          <div className="bg-white border border-[#EDEDEB] rounded-lg p-3">
            <div className="text-[10px] text-[#9AA19E] uppercase font-semibold">Diligence Progress</div>
            <div className="text-sm font-bold mt-0.5">{diligenceProgress.percent}%</div>
          </div>
          <div className="bg-white border border-[#EDEDEB] rounded-lg p-3">
            <div className="text-[10px] text-[#9AA19E] uppercase font-semibold">Owner</div>
            <div className="text-sm font-bold mt-0.5">{deal.owner}</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-[#EDEDEB] overflow-x-auto pb-0.5 scrollbar-hide">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold whitespace-nowrap border-b-2 transition-colors ${
              activeTab === tab.key 
                ? 'border-[#87BAA4] text-[#141618]' 
                : 'border-transparent text-[#6B7280] hover:text-[#141618] hover:border-[#E0EDE6]'
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="mt-6">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card title="Company Overview">
                <div className="text-sm text-[#2D3436] leading-relaxed">
                  {deal.description}
                </div>
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div>
                    <div className="text-[10px] text-[#9AA19E] uppercase font-semibold mb-1">Website</div>
                    <div className="text-xs text-[#141618]">{deal.website || 'N/A'}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-[#9AA19E] uppercase font-semibold mb-1">Location</div>
                    <div className="text-xs text-[#141618]">{deal.location}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-[#9AA19E] uppercase font-semibold mb-1">Created At</div>
                    <div className="text-xs text-[#141618]">{deal.createdAt}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-[#9AA19E] uppercase font-semibold mb-1">Last Activity</div>
                    <div className="text-xs text-[#141618]">{deal.lastActivityDate}</div>
                  </div>
                </div>
              </Card>

              <Card title="Agent Workflow Hooks" subtitle="Connect AI agents to this deal (Coming Soon)">
                <div className="flex flex-wrap gap-2">
                  <button className="px-3 py-1.5 bg-[#F5F4F5] border border-[#EDEDEB] rounded-lg text-xs font-semibold text-[#6B7280] hover:text-[#141618] transition-colors">
                    Ask Research Agent
                  </button>
                  <button className="px-3 py-1.5 bg-[#F5F4F5] border border-[#EDEDEB] rounded-lg text-xs font-semibold text-[#6B7280] hover:text-[#141618] transition-colors">
                    Run Financial Diligence
                  </button>
                  <button className="px-3 py-1.5 bg-[#F5F4F5] border border-[#EDEDEB] rounded-lg text-xs font-semibold text-[#6B7280] hover:text-[#141618] transition-colors">
                    Analyze Market
                  </button>
                  <button className="px-3 py-1.5 bg-[#F5F4F5] border border-[#EDEDEB] rounded-lg text-xs font-semibold text-[#6B7280] hover:text-[#141618] transition-colors">
                    Review Risk
                  </button>
                </div>
              </Card>
            </div>
            <div className="space-y-6">
              <Card title="Quick Actions">
                <div className="space-y-2">
                  <button className="w-full text-left px-3 py-2 text-xs font-semibold text-[#141618] bg-[#FAFAF9] hover:bg-[#F5F4F5] rounded-md transition-colors border border-[#EDEDEB]">
                    + Add Note
                  </button>
                  <button className="w-full text-left px-3 py-2 text-xs font-semibold text-[#141618] bg-[#FAFAF9] hover:bg-[#F5F4F5] rounded-md transition-colors border border-[#EDEDEB]">
                    + Upload Document
                  </button>
                  <button className="w-full text-left px-3 py-2 text-xs font-semibold text-[#141618] bg-[#FAFAF9] hover:bg-[#F5F4F5] rounded-md transition-colors border border-[#EDEDEB]">
                    + Start Due Diligence
                  </button>
                </div>
              </Card>

              <Card title="Recent Activity">
                <div className="space-y-4">
                  {activities.slice(0, 3).map(act => (
                    <div key={act.id} className="relative pl-4 border-l-2 border-[#E0EDE6]">
                      <div className="absolute w-2 h-2 rounded-full bg-[#87BAA4] -left-[5px] top-1"></div>
                      <div className="text-[10px] text-[#9AA19E] font-semibold">{act.date}</div>
                      <div className="text-xs font-semibold text-[#141618] mt-0.5">{act.title}</div>
                      <div className="text-[11px] text-[#6B7280] mt-0.5">{act.description}</div>
                    </div>
                  ))}
                </div>
                <button 
                  onClick={() => setActiveTab('activity')}
                  className="text-xs font-semibold text-[#87BAA4] mt-4 hover:underline"
                >
                  View all activity →
                </button>
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'screening' && (
          <div className="space-y-6">
            <Card title="Financial Screening Metrics">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                <Metric label="Revenue" value={deal.revenue ? `$${(deal.revenue/1000000).toFixed(1)}M` : 'Pre-revenue'} />
                <Metric label="Revenue Growth" value={deal.revenueGrowth ? `${deal.revenueGrowth}% YoY` : 'N/A'} />
                <Metric label="Gross Margin" value={deal.grossMargin ? `${deal.grossMargin}%` : 'N/A'} />
                <Metric label="Burn Rate" value={deal.burn ? `$${(deal.burn/1000).toFixed(0)}k / mo` : 'N/A'} />
                <Metric label="Runway" value={deal.runwayMonths ? `${deal.runwayMonths} months` : 'N/A'} />
                <Metric label="Funding Raised" value={deal.fundingRaised ? `$${(deal.fundingRaised/1000000).toFixed(1)}M` : 'N/A'} />
              </div>
            </Card>
            <Card title="Screening Questionnaire">
              <div className="space-y-4">
                {[
                  { q: 'Is the market large enough?', a: 'Market is highly fragmented, TAM estimated at $12B.' },
                  { q: 'Is growth strong enough?', a: 'Growing >100% YoY, top quartile for stage.' },
                  { q: 'Is valuation reasonable relative to assumptions?', a: 'Priced at 14x forward ARR, premium but justified by growth.' },
                  { q: 'Are there significant concentration risks?', a: 'Yes, top 3 clients = 42% of revenue. Requires deep diligence.' },
                  { q: 'Are there material unknowns?', a: 'Sales cycle length predictability at scale is unproven.' }
                ].map((item, i) => (
                  <div key={i} className="p-3 bg-[#FAFAF9] rounded-lg border border-[#EDEDEB]">
                    <div className="text-xs font-semibold text-[#141618]">{item.q}</div>
                    <div className="text-xs text-[#6B7280] mt-1">{item.a}</div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'diligence' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {diligence.map(cat => (
                <Card key={cat.id} title={cat.title} subtitle={`Status: ${cat.status.replace('_', ' ').toUpperCase()}`}>
                  <div className="space-y-2 mb-4">
                    {cat.items.map(item => (
                      <div key={item.id} className="flex items-start gap-3 p-2 hover:bg-[#FAFAF9] rounded-md transition-colors">
                        <input type="checkbox" checked={item.isComplete} readOnly className="mt-0.5 accent-[#87BAA4]" />
                        <div className="flex-1">
                          <div className={`text-xs font-semibold ${item.isComplete ? 'text-[#9AA19E] line-through' : 'text-[#141618]'}`}>
                            {item.task}
                          </div>
                          {item.notes && <div className="text-[11px] text-[#6B7280] mt-0.5">{item.notes}</div>}
                        </div>
                        {item.isFlagged && <StatusBadge variant="danger" size="xs">Flagged</StatusBadge>}
                      </div>
                    ))}
                  </div>

                  {cat.findings.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-[#EDEDEB] space-y-3">
                      <h4 className="text-[10px] font-semibold text-[#9AA19E] uppercase tracking-wider">Key Findings</h4>
                      {cat.findings.map(finding => (
                        <div key={finding.id} className="p-3 bg-[#F0F7F4] border border-[#BAD6CC] rounded-lg">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-bold text-[#141618]">Finding:</span>
                            <span className="text-xs text-[#2D3436]">{finding.finding}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] font-semibold text-[#6B7280]">Evidence:</span>
                            <span className="text-[11px] text-[#6B7280]">{finding.evidence}</span>
                          </div>
                          <div className="mt-2">
                            <StatusBadge variant={finding.status === 'verified' ? 'success' : 'warning'} size="xs">
                              {finding.status.toUpperCase()}
                            </StatusBadge>
                            {finding.isDemo && <span className="ml-2 text-[10px] font-bold text-[#87BAA4]">DEMO</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </Card>
              ))}
              {diligence.length === 0 && (
                <div className="text-center p-8 text-sm text-[#9AA19E]">No diligence categories created yet.</div>
              )}
            </div>
            <div>
              <Card title="Diligence Progress">
                <div className="text-center py-6">
                  <div className="text-3xl font-bold text-[#87BAA4]">{diligenceProgress.percent}%</div>
                  <div className="text-xs text-[#6B7280] mt-1">{diligenceProgress.completed} of {diligenceProgress.total} items completed</div>
                </div>
                <div className="w-full bg-[#EDEDEB] h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-[#87BAA4] h-full transition-all duration-500" 
                    style={{ width: `${diligenceProgress.percent}%` }}
                  />
                </div>
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'documents' && (
          <Card title="Virtual Data Room">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#EDEDEB] text-[#9AA19E]">
                  <th className="pb-2 font-semibold">Document</th>
                  <th className="pb-2 font-semibold">Category</th>
                  <th className="pb-2 font-semibold">Uploaded By</th>
                  <th className="pb-2 font-semibold">Date</th>
                  <th className="pb-2 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {documents.map(doc => (
                  <tr key={doc.id} className="border-b border-[#F5F4F5] hover:bg-[#FAFAF9] transition-colors">
                    <td className="py-3 font-semibold text-[#141618] flex items-center gap-2">
                      <Lock className="w-3.5 h-3.5 text-[#9AA19E]" />
                      {doc.filename}
                      {doc.isDemo && <span className="text-[9px] bg-[#F0F7F4] text-[#87BAA4] px-1 rounded">DEMO</span>}
                    </td>
                    <td className="py-3 text-[#6B7280] uppercase text-[10px] tracking-wider">{doc.category.replace('_', ' ')}</td>
                    <td className="py-3 text-[#6B7280]">{doc.uploadedBy}</td>
                    <td className="py-3 text-[#6B7280]">{doc.uploadDate}</td>
                    <td className="py-3">
                      <StatusBadge variant={doc.status === 'reviewed' ? 'success' : doc.status === 'processing' ? 'warning' : 'neutral'} size="xs">
                        {doc.status.toUpperCase()}
                      </StatusBadge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {documents.length === 0 && <div className="text-center py-8 text-xs text-[#9AA19E]">No documents uploaded.</div>}
          </Card>
        )}

        {activeTab === 'cap_table' && capTable && (
          <div className="space-y-6">
            <Card title="Capitalization Table" subtitle={`Total Shares: ${capTable.totalShares.toLocaleString()}`}>
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#EDEDEB] text-[#9AA19E]">
                    <th className="pb-2 font-semibold">Shareholder</th>
                    <th className="pb-2 font-semibold">Type</th>
                    <th className="pb-2 font-semibold">Class</th>
                    <th className="pb-2 font-semibold text-right">Shares</th>
                    <th className="pb-2 font-semibold text-right">Ownership %</th>
                  </tr>
                </thead>
                <tbody>
                  {capTable.shareholders.map(sh => (
                    <tr key={sh.id} className="border-b border-[#F5F4F5]">
                      <td className="py-3 font-semibold text-[#141618]">{sh.name}</td>
                      <td className="py-3 capitalize text-[#6B7280]">{sh.type.replace('_', ' ')}</td>
                      <td className="py-3 capitalize text-[#6B7280]">{sh.shareClass}</td>
                      <td className="py-3 text-right text-[#141618]">{sh.shares.toLocaleString()}</td>
                      <td className="py-3 text-right font-bold text-[#87BAA4]">{sh.ownershipPercent}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
            <div className="p-3 bg-[#FEF3C7] text-[#92400E] text-xs rounded-lg border border-[#FCD34D]">
              <strong>Demo Mode:</strong> Cap table visualization and dilution modeling will be connected to real data via API in a future update.
            </div>
          </div>
        )}

        {activeTab === 'terms' && terms && (
          <Card title="Deal Terms">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <Metric label="Investment Amount" value={`$${(terms.investmentAmount/1000000).toFixed(1)}M`} />
              <Metric label="Pre-Money Valuation" value={`$${(terms.preMoneyValuation/1000000).toFixed(1)}M`} />
              <Metric label="Post-Money Valuation" value={`$${(terms.postMoneyValuation/1000000).toFixed(1)}M`} />
              <Metric label="Target Ownership" value={`${terms.ownershipPercent}%`} />
              <Metric label="Liquidation Pref." value={terms.liquidationPreference} />
              <Metric label="Anti-Dilution" value={terms.antiDilution} />
              <Metric label="Board Rights" value={terms.boardRights} />
              <Metric label="Pro-Rata Rights" value={terms.proRataRights} />
              <Metric label="Option Pool" value={`${terms.optionPoolPercent}%`} />
            </div>
          </Card>
        )}

        {activeTab === 'risk' && (
          <div className="space-y-4">
            {risks.map(risk => (
              <Card key={risk.id}>
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <ShieldAlert className={`w-4 h-4 ${risk.potentialImpact === 'high' ? 'text-[#DC2626]' : 'text-[#D97706]'}`} />
                    <h3 className="text-sm font-bold text-[#141618]">{risk.title}</h3>
                  </div>
                  <StatusBadge variant={risk.potentialImpact === 'high' ? 'danger' : 'warning'} size="xs">
                    {risk.potentialImpact.toUpperCase()} RISK
                  </StatusBadge>
                </div>
                <div className="text-xs text-[#2D3436] mb-4">{risk.description}</div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-3 bg-[#FAFAF9] rounded-lg border border-[#EDEDEB]">
                    <div className="text-[10px] font-semibold text-[#6B7280] uppercase tracking-wider mb-1">Evidence</div>
                    <div className="text-xs text-[#141618]">{risk.evidence}</div>
                  </div>
                  <div className="p-3 bg-[#FAFAF9] rounded-lg border border-[#EDEDEB]">
                    <div className="text-[10px] font-semibold text-[#6B7280] uppercase tracking-wider mb-1">Assumption</div>
                    <div className="text-xs text-[#141618]">{risk.assumption}</div>
                  </div>
                </div>
              </Card>
            ))}
            {risks.length === 0 && <div className="text-sm text-[#9AA19E] p-4">No risks logged.</div>}
          </div>
        )}

        {activeTab === 'ic_review' && icReview && (
          <div className="space-y-6">
            <Card title="Investment Committee Status">
              <div className="flex items-center gap-4">
                <StatusBadge variant={
                  icReview.status === 'approved' ? 'success' : 
                  icReview.status === 'rejected' ? 'danger' : 
                  icReview.status === 'under_review' ? 'warning' : 'neutral'
                } size="md">
                  {icReview.status.replace('_', ' ').toUpperCase()}
                </StatusBadge>
                <span className="text-sm text-[#6B7280]">Decision is not automatically determined by AI.</span>
              </div>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card title="Investment Thesis">
                <ul className="list-disc pl-4 space-y-2 text-xs text-[#141618]">
                  {icReview.investmentThesis.map((t, i) => <li key={i}>{t}</li>)}
                </ul>
              </Card>
              <Card title="Counter Thesis">
                <ul className="list-disc pl-4 space-y-2 text-xs text-[#141618]">
                  {icReview.counterThesis.map((t, i) => <li key={i}>{t}</li>)}
                </ul>
              </Card>
            </div>

            <Card title="IC Summaries">
              <div className="space-y-4">
                <div>
                  <div className="text-[10px] font-semibold text-[#9AA19E] uppercase tracking-wider mb-1">Financial Analysis</div>
                  <div className="text-xs text-[#2D3436] p-3 bg-[#FAFAF9] rounded-lg">{icReview.financialAnalysisSummary}</div>
                </div>
                <div>
                  <div className="text-[10px] font-semibold text-[#9AA19E] uppercase tracking-wider mb-1">Valuation Summary</div>
                  <div className="text-xs text-[#2D3436] p-3 bg-[#FAFAF9] rounded-lg">{icReview.valuationSummary}</div>
                </div>
                <div>
                  <div className="text-[10px] font-semibold text-[#9AA19E] uppercase tracking-wider mb-1">Diligence Summary</div>
                  <div className="text-xs text-[#2D3436] p-3 bg-[#FAFAF9] rounded-lg">{icReview.diligenceSummary}</div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'memo' && (
          <Card title="Investment Memo">
            <div className="p-8 border border-[#EDEDEB] rounded-xl bg-white shadow-sm max-w-3xl mx-auto">
              <h2 className="text-2xl font-bold text-center mb-6">Investment Memorandum: {deal.companyName}</h2>
              <div className="text-center text-xs text-[#6B7280] mb-8 border-b border-[#EDEDEB] pb-4">
                Confidential - For Investment Committee Use Only
              </div>
              <div className="space-y-6">
                <div className="text-sm text-[#2D3436] italic text-center text-[#9AA19E]">
                  Click "Generate Memo" in the header to synthesize diligence, risk, and valuation data into a complete IC memo via Faro AI.
                </div>
              </div>
            </div>
          </Card>
        )}

        {activeTab === 'activity' && (
          <Card title="Deal Activity Log">
            <div className="space-y-6">
              {activities.map(act => (
                <div key={act.id} className="relative pl-6 border-l-2 border-[#E0EDE6]">
                  <div className="absolute w-3 h-3 rounded-full bg-[#87BAA4] -left-[7px] top-1 border-2 border-white"></div>
                  <div className="text-xs font-semibold text-[#9AA19E]">{act.date}</div>
                  <div className="text-sm font-bold text-[#141618] mt-1">{act.title}</div>
                  <div className="text-xs text-[#2D3436] mt-1">{act.description}</div>
                  <div className="mt-2">
                    <StatusBadge variant="neutral" size="xs">{act.type.replace('_', ' ').toUpperCase()}</StatusBadge>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

// --- Helpers ---
const Card: React.FC<{ title?: string; subtitle?: string; children: React.ReactNode }> = ({ title, subtitle, children }) => (
  <div className="bg-white border border-[#EDEDEB] rounded-xl p-5 shadow-2xs">
    {title && (
      <div className="mb-4">
        <h3 className="text-sm font-bold text-[#141618]">{title}</h3>
        {subtitle && <p className="text-xs text-[#9AA19E] mt-0.5">{subtitle}</p>}
      </div>
    )}
    {children}
  </div>
);

const Metric: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
  <div>
    <div className="text-[10px] text-[#9AA19E] uppercase font-semibold tracking-wider mb-1">{label}</div>
    <div className="text-sm font-bold text-[#141618]">{value}</div>
  </div>
);
