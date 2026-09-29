'use client';

import React, { useState } from 'react';
import { WorkOrder, AgentDeliverable } from '@/types/agentMarketplace';
import { 
  ArrowLeft, 
  Check, 
  Clock, 
  ShieldCheck, 
  ExternalLink, 
  FileText, 
  AlertTriangle, 
  RotateCcw, 
  Download,
  CheckCircle2,
  HelpCircle,
  TrendingUp,
  MessageSquare
} from 'lucide-react';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { AgentMarketplaceService } from '@/services/agentMarketplaceService';

interface WorkOrderDetailViewProps {
  workOrder: WorkOrder;
  onBack: () => void;
  onOrderUpdated: (updated: WorkOrder) => void;
}

export const WorkOrderDetailView: React.FC<WorkOrderDetailViewProps> = ({
  workOrder,
  onBack,
  onOrderUpdated
}) => {
  const [activeTab, setActiveTab] = useState<'deliverable' | 'brief' | 'timeline' | 'escrow'>('deliverable');
  const [isRevisionModalOpen, setIsRevisionModalOpen] = useState(false);
  const [revisionNotes, setRevisionNotes] = useState('');
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [starRating, setStarRating] = useState(5);
  const [writtenReview, setWrittenReview] = useState('');

  const deliverable = workOrder.deliverable;

  const handleAccept = () => {
    const updated = AgentMarketplaceService.acceptDeliverable(workOrder.id);
    if (updated) {
      onOrderUpdated(updated);
      setIsRatingModalOpen(true);
    }
  };

  const handleSendRevision = (e: React.FormEvent) => {
    e.preventDefault();
    if (!revisionNotes.trim()) return;
    const updated = AgentMarketplaceService.requestRevision(workOrder.id, revisionNotes);
    if (updated) {
      onOrderUpdated(updated);
      setIsRevisionModalOpen(false);
      setRevisionNotes('');
    }
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    AgentMarketplaceService.addAgentReview(workOrder.agentId, {
      agentId: workOrder.agentId,
      userName: 'Investment Partner',
      userRole: 'Faro Fund Manager',
      rating: starRating,
      accuracy: 5,
      evidenceQuality: 5,
      timeliness: 5,
      usefulness: starRating,
      comment: writtenReview || 'Comprehensive, rigorous analysis delivered ahead of schedule.',
      verifiedWorkOrderId: workOrder.id
    });
    setIsRatingModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-16 max-w-6xl mx-auto animate-in fade-in duration-200">
      {/* Top back button */}
      <div>
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#6C726F] hover:text-[#141618] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Work Orders</span>
        </button>
      </div>

      {/* Header Card */}
      <div className="bg-white border border-[#EDEDEB] rounded-xl p-6 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-[#87BAA4]">{workOrder.id}</span>
              <StatusBadge
                variant={
                  workOrder.status === 'paid' ? 'success' :
                  workOrder.status === 'delivered' ? 'sage' :
                  workOrder.status === 'revision_requested' ? 'warning' : 'info'
                }
                size="sm"
                dot
              >
                {workOrder.status.replace('_', ' ').toUpperCase()}
              </StatusBadge>
              <span className="text-[10px] text-[#9AA19E]">Created {workOrder.createdAt}</span>
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-[#141618]">
              {workOrder.title}
            </h1>

            <div className="flex items-center gap-2 pt-1 text-xs text-[#6C726F]">
              <span>Assigned Agent:</span>
              <div className="flex items-center gap-1.5 font-semibold text-[#141618]">
                <div
                  className="w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold"
                  style={{ backgroundColor: workOrder.agentBadgeBg, color: workOrder.agentBadgeColor }}
                >
                  {workOrder.agentBadge}
                </div>
                <span>{workOrder.agentName}</span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 shrink-0">
            {workOrder.status === 'delivered' && (
              <>
                <button
                  onClick={() => setIsRevisionModalOpen(true)}
                  className="px-3.5 py-2 rounded-lg border border-[#EDEDEB] bg-white hover:bg-[#F5F4F5] text-xs font-semibold text-[#141618] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-[#6C726F]" />
                  <span>Request Revision</span>
                </button>
                <button
                  onClick={handleAccept}
                  className="px-4 py-2 rounded-lg bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Accept Deliverable & Release Escrow</span>
                </button>
              </>
            )}

            {workOrder.status === 'paid' && (
              <div className="px-3 py-1.5 rounded-lg bg-[#F0F7F4] border border-[#BAD6CC] text-xs font-semibold text-[#204A3B] flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#87BAA4]" />
                <span>Accepted & Escrow Paid</span>
              </div>
            )}
          </div>
        </div>

        {/* Tab selection */}
        <div className="pt-3 border-t border-[#EDEDEB] flex items-center gap-2 overflow-x-auto">
          {[
            { key: 'deliverable', label: 'Evidence-Backed Deliverable' },
            { key: 'brief', label: 'Task Brief & Scope' },
            { key: 'timeline', label: `Execution Timeline (${workOrder.timeline.length})` },
            { key: 'escrow', label: 'Escrow & Smart Contract Status' }
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

      {/* Main Tab Views */}
      <div className="space-y-6">
        {activeTab === 'deliverable' && deliverable && (
          <div className="space-y-6">
            {/* Deliverable Header */}
            <div className="bg-white border border-[#EDEDEB] rounded-xl p-6 shadow-2xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#EDEDEB]">
                <div>
                  <div className="text-[10.5px] uppercase font-semibold text-[#87BAA4] tracking-wider">
                    Institutional Deliverable
                  </div>
                  <h2 className="text-xl font-bold text-[#141618] mt-0.5">
                    {deliverable.title}
                  </h2>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-[#9AA19E]">Generated at {deliverable.generatedAt}</span>
                  <button className="px-2.5 py-1 rounded border border-[#EDEDEB] text-[11px] font-semibold text-[#141618] hover:bg-[#FAFAF9] flex items-center gap-1 transition-colors">
                    <Download className="w-3 h-3 text-[#6C726F]" />
                    <span>Export PDF</span>
                  </button>
                </div>
              </div>

              {/* Executive Summary */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#9AA19E] mb-2">
                  Executive Summary
                </h3>
                <p className="text-xs text-[#2D3436] leading-relaxed bg-[#FBFBFA] p-4 rounded-lg border border-[#EDEDEB]">
                  {deliverable.executiveSummary}
                </p>
              </div>

              {/* Market Map */}
              {deliverable.marketMap && deliverable.marketMap.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#9AA19E] mb-2.5">
                    Market Map & Architectural Stacks
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {deliverable.marketMap.map((map, i) => (
                      <div key={i} className="p-4 rounded-lg border border-[#EDEDEB] bg-white space-y-2">
                        <div className="text-xs font-bold text-[#141618]">{map.category}</div>
                        <div className="flex flex-wrap gap-1.5">
                          {map.players.map((p, idx) => (
                            <span key={idx} className="px-2 py-0.5 rounded bg-[#F5F4F5] text-[10px] font-semibold text-[#141618]">
                              {p}
                            </span>
                          ))}
                        </div>
                        <p className="text-[11px] text-[#6C726F] pt-1 leading-normal">
                          {map.positioning}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Key Findings with Evidence links */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#9AA19E] mb-2.5">
                  Evidence-Anchored Findings
                </h3>
                <div className="space-y-3">
                  {deliverable.keyFindings.map((finding, i) => (
                    <div key={i} className="p-4 rounded-lg border border-[#EDEDEB] bg-[#FBFBFA] space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-[#141618]">{finding.title}</h4>
                        <div className="flex items-center gap-1">
                          {finding.evidenceIds.map(eid => (
                            <span key={eid} className="px-1.5 py-0.5 rounded bg-[#BAD6CC]/40 text-[#204A3B] text-[9.5px] font-bold">
                              REF {eid.toUpperCase()}
                            </span>
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-[#4A504D] leading-relaxed">
                        {finding.detail}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Financial Metrics */}
              {deliverable.financialMetrics && (
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#9AA19E] mb-2.5">
                    Extracted Financial Telemetry
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {deliverable.financialMetrics.map((fm, i) => (
                      <div key={i} className="p-3.5 rounded-lg border border-[#EDEDEB] bg-white">
                        <div className="text-[10px] uppercase font-semibold text-[#9AA19E]">{fm.metric}</div>
                        <div className="text-lg font-bold text-[#141618] mt-0.5">{fm.value}</div>
                        {fm.variance && (
                          <div className="text-[10.5px] font-semibold text-[#059669] mt-0.5">{fm.variance}</div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Risks */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#9AA19E] mb-2.5">
                  Downside & Structural Risks
                </h3>
                <div className="space-y-2.5">
                  {deliverable.risksIdentified.map((r, i) => (
                    <div key={i} className="p-3.5 rounded-lg border border-[#EDEDEB] bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-start gap-2.5">
                        <AlertTriangle className={`w-4 h-4 shrink-0 mt-0.5 ${r.severity === 'high' ? 'text-[#DC2626]' : 'text-[#D97706]'}`} />
                        <div>
                          <div className="text-xs font-semibold text-[#141618]">{r.risk}</div>
                          <div className="text-[11px] text-[#6C726F] mt-0.5">Mitigation: {r.mitigation}</div>
                        </div>
                      </div>
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded self-start sm:self-auto ${
                        r.severity === 'high' ? 'bg-[#FDECEB] text-[#A5342C]' : 'bg-[#FEF3EB] text-[#A05A20]'
                      }`}>
                        {r.severity} Severity
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Evidence Repository */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#9AA19E] mb-2.5">
                  Verified Evidence Citations ({deliverable.evidence.length})
                </h3>
                <div className="space-y-2.5">
                  {deliverable.evidence.map((ev) => (
                    <div key={ev.id} className="p-3 rounded-lg border border-[#BAD6CC]/60 bg-[#F0F7F4]/60 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono font-bold text-[#2E6E56]">[{ev.id.toUpperCase()}]</span>
                          <span className="text-xs font-bold text-[#141618]">{ev.sourceTitle}</span>
                        </div>
                        <span className="text-[10px] font-semibold text-[#059669] bg-white px-2 py-0.5 rounded border border-[#BAD6CC]">
                          {ev.confidenceScore}% Confidence
                        </span>
                      </div>
                      <p className="text-xs text-[#2D3436] italic">
                        "{ev.snippet}"
                      </p>
                      <div className="flex items-center justify-between text-[10px] text-[#6C726F] pt-0.5">
                        <span>Source type: {ev.sourceType}</span>
                        <span>{ev.timestamp}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Open Questions */}
              {deliverable.openQuestions.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#9AA19E] mb-2">
                    Open Questions for Investment Committee
                  </h3>
                  <ul className="list-disc list-inside space-y-1 text-xs text-[#4A504D]">
                    {deliverable.openQuestions.map((q, idx) => (
                      <li key={idx}>{q}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Task Brief */}
        {activeTab === 'brief' && (
          <div className="bg-white border border-[#EDEDEB] rounded-xl p-6 shadow-2xs space-y-4">
            <h3 className="text-sm font-bold text-[#141618]">Original Task Specification</h3>
            <div className="space-y-3">
              <div>
                <div className="text-[10px] uppercase font-semibold text-[#9AA19E]">Task Title</div>
                <div className="text-sm font-bold text-[#141618] mt-0.5">{workOrder.brief.taskTitle}</div>
              </div>
              <div>
                <div className="text-[10px] uppercase font-semibold text-[#9AA19E]">Description / Prompt</div>
                <div className="text-xs text-[#2D3436] mt-0.5 p-3 rounded-lg bg-[#FBFBFA] border border-[#EDEDEB] leading-relaxed">
                  {workOrder.brief.taskDescription}
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <div className="p-3 bg-[#FAFAF9] rounded-lg border border-[#EDEDEB]">
                  <div className="text-[10px] uppercase font-semibold text-[#9AA19E]">Output Format</div>
                  <div className="text-xs font-bold text-[#141618] mt-0.5">{workOrder.brief.requiredOutput}</div>
                </div>
                <div className="p-3 bg-[#FAFAF9] rounded-lg border border-[#EDEDEB]">
                  <div className="text-[10px] uppercase font-semibold text-[#9AA19E]">Priority</div>
                  <div className="text-xs font-bold text-[#141618] mt-0.5 uppercase">{workOrder.brief.priority}</div>
                </div>
                <div className="p-3 bg-[#FAFAF9] rounded-lg border border-[#EDEDEB]">
                  <div className="text-[10px] uppercase font-semibold text-[#9AA19E]">Budget</div>
                  <div className="text-xs font-bold text-[#141618] mt-0.5">{workOrder.budgetFormatted}</div>
                </div>
                <div className="p-3 bg-[#FAFAF9] rounded-lg border border-[#EDEDEB]">
                  <div className="text-[10px] uppercase font-semibold text-[#9AA19E]">Assigned Agent</div>
                  <div className="text-xs font-bold text-[#141618] mt-0.5">{workOrder.agentName}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Timeline */}
        {activeTab === 'timeline' && (
          <div className="bg-white border border-[#EDEDEB] rounded-xl p-6 shadow-2xs space-y-4">
            <h3 className="text-sm font-bold text-[#141618]">Agent Execution Timeline</h3>
            <p className="text-xs text-[#6C726F]">
              Every step, citation collection, and deliverable state logged in order.
            </p>
            <div className="space-y-4 pt-2">
              {workOrder.timeline.map((event, idx) => (
                <div key={event.id || idx} className="relative pl-6 border-l-2 border-[#BAD6CC] pb-3 last:pb-0">
                  <div className="absolute w-2.5 h-2.5 rounded-full bg-[#87BAA4] -left-[6px] top-1 border-2 border-white" />
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#141618]">{event.label}</span>
                    <span className="text-[10px] text-[#9AA19E] font-mono">{event.timestamp} ({event.timeOffset})</span>
                  </div>
                  {event.detail && (
                    <p className="text-[11px] text-[#6C726F] mt-0.5">{event.detail}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Escrow */}
        {activeTab === 'escrow' && (
          <div className="bg-white border border-[#EDEDEB] rounded-xl p-6 shadow-2xs space-y-4">
            <div className="flex items-center gap-2 text-[#87BAA4]">
              <ShieldCheck className="w-5 h-5" />
              <h3 className="text-sm font-bold text-[#141618]">Smart Contract Escrow State</h3>
            </div>
            <p className="text-xs text-[#6C726F]">
              Faro uses smart contract escrow where funds are held programmatically until evidence acceptance.
            </p>

            <div className="p-4 bg-[#FBFBFA] border border-[#EDEDEB] rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#6C726F]">Escrow ID:</span>
                <span className="text-xs font-mono font-bold text-[#141618]">{workOrder.escrow.escrowId}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#6C726F]">Locked Budget:</span>
                <span className="text-sm font-bold text-[#141618]">{workOrder.escrow.budgetFormatted}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#6C726F]">Escrow Status:</span>
                <StatusBadge
                  variant={workOrder.escrow.status === 'released_simulated' ? 'success' : 'warning'}
                  size="sm"
                  dot
                >
                  {workOrder.escrow.status.replace('_', ' ').toUpperCase()}
                </StatusBadge>
              </div>
              {workOrder.escrow.depositTxHash && (
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#6C726F]">Simulated Deposit TX:</span>
                  <span className="text-[10px] font-mono text-[#8C9390]">{workOrder.escrow.depositTxHash.slice(0, 20)}...</span>
                </div>
              )}
            </div>

            <div className="p-3 bg-[#FEF3C7] text-[#92400E] text-xs rounded-lg border border-[#FCD34D]">
              <strong>Demo Mode Notice:</strong> Escrow transactions are simulated and do not draw real ETH until the smart contract layer is deployed in the next milestone.
            </div>
          </div>
        )}
      </div>

      {/* Revision Modal */}
      {isRevisionModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-[#141618]">Request Deliverable Revision</h3>
            <p className="text-xs text-[#6C726F]">
              Provide specific questions or requests to {workOrder.agentName}. The agent will revise the deliverable within SLA.
            </p>
            <form onSubmit={handleSendRevision} className="space-y-4">
              <textarea
                value={revisionNotes}
                onChange={(e) => setRevisionNotes(e.target.value)}
                placeholder="e.g. Expand the competitive analysis and include private AI infrastructure operators in Europe."
                rows={4}
                className="w-full p-3 rounded-lg border border-[#EDEDEB] text-xs focus:outline-none focus:border-[#87BAA4]"
                required
              />
              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsRevisionModalOpen(false)}
                  className="px-3 py-1.5 rounded-md border border-[#EDEDEB] text-xs font-semibold text-[#6C726F]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-md bg-[#141618] hover:bg-neutral-800 text-white text-xs font-semibold"
                >
                  Send Revision Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Rating Modal after acceptance */}
      {isRatingModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-[#141618]">Rate {workOrder.agentName}</h3>
            <p className="text-xs text-[#6C726F]">
              Your rating updates the decentralized agent reputation score on the marketplace.
            </p>
            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#141618] mb-1">Overall Rating</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setStarRating(star)}
                      className={`text-xl ${star <= starRating ? 'text-[#E58A38]' : 'text-neutral-300'}`}
                    >
                      ★
                    </button>
                  ))}
                  <span className="text-xs font-bold text-[#141618] ml-2">{starRating} Stars</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#141618] mb-1">Written Feedback (Optional)</label>
                <textarea
                  value={writtenReview}
                  onChange={(e) => setWrittenReview(e.target.value)}
                  placeholder="The findings were exceptionally well-documented and helped our IC evaluate the compute bottlenecks."
                  rows={3}
                  className="w-full p-3 rounded-lg border border-[#EDEDEB] text-xs focus:outline-none focus:border-[#87BAA4]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsRatingModalOpen(false)}
                  className="px-3 py-1.5 rounded-md border border-[#EDEDEB] text-xs font-semibold text-[#6C726F]"
                >
                  Skip
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-md bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-semibold"
                >
                  Submit Verified Rating
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
