'use client';

import React, { useState } from 'react';
import { 
  AgentWorkflow, 
  WorkflowTaskNode, 
  HumanApprovalGate, 
  AgentConflict 
} from '@/types/orchestrator';
import { OrchestratorService } from '@/services/orchestratorService';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { 
  Workflow, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  AlertCircle, 
  ArrowRight, 
  ShieldCheck, 
  FileText, 
  Share2, 
  RefreshCw, 
  RotateCcw, 
  UserCheck, 
  HelpCircle,
  Database,
  Layers,
  ChevronDown,
  ChevronRight,
  TrendingUp,
  Cpu
} from 'lucide-react';

interface WorkflowGraphViewProps {
  workflow: AgentWorkflow;
  onWorkflowUpdated: (updated: AgentWorkflow) => void;
  onSelectTaskResult?: (task: WorkflowTaskNode) => void;
}

export const WorkflowGraphView: React.FC<WorkflowGraphViewProps> = ({
  workflow,
  onWorkflowUpdated,
  onSelectTaskResult
}) => {
  const [activeTab, setActiveTab] = useState<'graph' | 'tree' | 'handoffs' | 'conflicts' | 'synthesis' | 'memory'>('graph');
  const [selectedTask, setSelectedTask] = useState<WorkflowTaskNode | null>(workflow.tasks[0]);
  const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);
  const [selectedGate, setSelectedGate] = useState<HumanApprovalGate | null>(null);
  const [approvalNotes, setApprovalNotes] = useState('');
  const [treeExpandedMap, setTreeExpandedMap] = useState<Record<string, boolean>>({
    'TASK-1051': true,
    'TASK-1052': true
  });

  const toggleTreeNode = (taskId: string) => {
    setTreeExpandedMap(prev => ({ ...prev, [taskId]: !prev[taskId] }));
  };

  const handleOpenGate = (gate: HumanApprovalGate) => {
    setSelectedGate(gate);
    setIsApprovalModalOpen(true);
  };

  const handleApproveGate = (decision: 'approved' | 'rejected' | 'revision_requested') => {
    if (!selectedGate) return;
    const updated = OrchestratorService.respondToApprovalGate({
      workflowId: workflow.id,
      gateId: selectedGate.id,
      decision,
      notes: approvalNotes
    });
    if (updated) {
      onWorkflowUpdated(updated);
      setIsApprovalModalOpen(false);
      setApprovalNotes('');
    }
  };

  return (
    <div className="space-y-6">
      {/* Workflow Navigation Subtabs */}
      <div className="flex items-center justify-between border-b border-[#EDEDEB] pb-2 overflow-x-auto gap-2">
        <div className="flex items-center gap-1.5">
          {[
            { key: 'graph', label: 'Visual Workflow Graph' },
            { key: 'tree', label: `Task Tree Hierarchy (${workflow.tasks.length})` },
            { key: 'handoffs', label: `Agent Handoffs (${workflow.handoffs.length})` },
            { key: 'conflicts', label: `Conflict Engine (${workflow.conflicts.length})` },
            { key: 'memory', label: `Shared Memory Context (${workflow.sharedMemoryContext.length})` },
            { key: 'synthesis', label: workflow.synthesis ? '★ Final IC Synthesis Memo' : 'Final Synthesis' }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                activeTab === tab.key
                  ? 'bg-[#141618] text-white shadow-2xs'
                  : 'text-[#6C726F] hover:bg-[#FAFAF9] hover:text-[#141618]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Pending Approval Badge */}
        {workflow.approvalGates.some(g => g.status === 'pending') && (
          <button
            onClick={() => handleOpenGate(workflow.approvalGates.find(g => g.status === 'pending')!)}
            className="px-3 py-1 bg-[#FEF3EB] border border-[#F8DCC4] text-[#A05A20] rounded-lg text-xs font-bold flex items-center gap-1.5 hover:bg-[#FDECEB] transition-colors cursor-pointer shrink-0 animate-pulse"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-[#E58A38]" />
            <span>Human Approval Gate Pending</span>
          </button>
        )}
      </div>

      {/* 1. VISUAL WORKFLOW GRAPH */}
      {activeTab === 'graph' && (
        <div className="space-y-6">
          {/* Visual Graph Canvas Card */}
          <div className="bg-white border border-[#EDEDEB] rounded-xl p-6 shadow-2xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#EDEDEB]">
              <div>
                <h3 className="text-sm font-bold text-[#141618] flex items-center gap-2">
                  <Workflow className="w-4 h-4 text-[#87BAA4]" />
                  <span>Agent Orchestration Graph: {workflow.targetEntity}</span>
                </h3>
                <p className="text-xs text-[#6C726F] mt-0.5">
                  Click any node to inspect standardized results, verified evidence, and handoff payloads.
                </p>
              </div>

              {/* Status Indicator */}
              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1.5 text-[#059669] font-medium">
                  <span className="w-2 h-2 rounded-full bg-[#059669]" /> Completed
                </span>
                <span className="flex items-center gap-1.5 text-[#2563EB] font-medium">
                  <span className="w-2 h-2 rounded-full bg-[#2563EB] animate-pulse" /> Running
                </span>
                <span className="flex items-center gap-1.5 text-[#9AA19E] font-medium">
                  <span className="w-2 h-2 rounded-full bg-[#9AA19E]" /> Queued/Blocked
                </span>
              </div>
            </div>

            {/* Topology Graph Flow */}
            <div className="p-6 bg-[#FBFBFA] border border-[#EDEDEB] rounded-xl overflow-x-auto">
              <div className="min-w-[800px] flex flex-col items-center gap-8 py-2">
                {/* Level 0: Faro Orchestrator */}
                <div className="flex flex-col items-center">
                  <div className="px-5 py-2.5 rounded-xl bg-[#141618] text-white shadow-sm flex items-center gap-2 text-xs font-bold border border-neutral-700">
                    <Cpu className="w-4 h-4 text-[#87BAA4]" />
                    <span>Faro Orchestrator</span>
                    <span className="text-[10px] text-neutral-400 font-normal">({workflow.budget.allocatedFormatted} Allocated)</span>
                  </div>
                  <div className="w-0.5 h-6 bg-[#EDEDEB]" />
                  <div className="text-[10px] font-bold text-[#87BAA4]">↓ PLANS & DISPATCHES</div>
                  <div className="w-0.5 h-4 bg-[#EDEDEB]" />
                </div>

                {/* Level 1: Primary Discovery Agent */}
                <div className="w-full flex justify-center">
                  {workflow.tasks.filter(t => t.id === 'TASK-1051').map(task => (
                    <div
                      key={task.id}
                      onClick={() => setSelectedTask(task)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer w-72 bg-white shadow-2xs group ${
                        selectedTask?.id === task.id ? 'border-[#87BAA4] ring-2 ring-[#87BAA4]/40' : 'border-[#EDEDEB] hover:border-[#87BAA4]'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold" style={{ backgroundColor: task.agentBadgeBg, color: task.agentBadgeColor }}>
                            {task.agentBadge}
                          </div>
                          <span className="text-xs font-bold text-[#141618]">{task.agentName}</span>
                        </div>
                        <StatusBadge variant="success" size="xs" dot>Done</StatusBadge>
                      </div>
                      <div className="text-xs font-semibold text-[#141618] line-clamp-1">{task.title}</div>
                      <div className="text-[10.5px] text-[#6C726F] mt-1">{task.budgetFormatted} · SLA: 7m</div>
                      <div className="mt-2.5 w-full bg-[#EDEDEB] rounded-full h-1.5 overflow-hidden">
                        <div className="bg-[#059669] h-full" style={{ width: `${task.progressPercent}%` }} />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Level 2: Parallel Branches (Diligence & Competitive) */}
                <div className="flex items-center justify-center gap-12 w-full">
                  {workflow.tasks.filter(t => ['TASK-1052', 'TASK-1054'].includes(t.id)).map(task => (
                    <div key={task.id} className="flex flex-col items-center">
                      <div className="text-[10px] text-[#9AA19E] mb-1">↓ Handoff Context</div>
                      <div
                        onClick={() => setSelectedTask(task)}
                        className={`p-4 rounded-xl border transition-all cursor-pointer w-72 bg-white shadow-2xs ${
                          selectedTask?.id === task.id ? 'border-[#87BAA4] ring-2 ring-[#87BAA4]/40' : 'border-[#EDEDEB] hover:border-[#87BAA4]'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold" style={{ backgroundColor: task.agentBadgeBg, color: task.agentBadgeColor }}>
                              {task.agentBadge}
                            </div>
                            <span className="text-xs font-bold text-[#141618]">{task.agentName}</span>
                          </div>
                          <StatusBadge variant="success" size="xs" dot>Done</StatusBadge>
                        </div>
                        <div className="text-xs font-semibold text-[#141618] line-clamp-1">{task.title}</div>
                        <div className="text-[10.5px] text-[#6C726F] mt-1">{task.budgetFormatted} · SLA: 11m</div>
                        <div className="mt-2.5 w-full bg-[#EDEDEB] rounded-full h-1.5 overflow-hidden">
                          <div className="bg-[#059669] h-full" style={{ width: `${task.progressPercent}%` }} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Level 3: Valuation Agent */}
                <div className="w-full flex justify-center">
                  {workflow.tasks.filter(t => t.id === 'TASK-1053').map(task => (
                    <div key={task.id} className="flex flex-col items-center">
                      <div className="text-[10px] text-[#9AA19E] mb-1">↓ Cap Table Handoff</div>
                      <div
                        onClick={() => setSelectedTask(task)}
                        className={`p-4 rounded-xl border transition-all cursor-pointer w-72 bg-white shadow-2xs ${
                          selectedTask?.id === task.id ? 'border-[#87BAA4] ring-2 ring-[#87BAA4]/40' : 'border-[#EDEDEB] hover:border-[#87BAA4]'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold" style={{ backgroundColor: task.agentBadgeBg, color: task.agentBadgeColor }}>
                              {task.agentBadge}
                            </div>
                            <span className="text-xs font-bold text-[#141618]">{task.agentName}</span>
                          </div>
                          <StatusBadge variant="success" size="xs" dot>Done</StatusBadge>
                        </div>
                        <div className="text-xs font-semibold text-[#141618] line-clamp-1">{task.title}</div>
                        <div className="text-[10.5px] text-[#6C726F] mt-1">{task.budgetFormatted} · Fair Val: $91.5M</div>
                        <div className="mt-2.5 w-full bg-[#EDEDEB] rounded-full h-1.5 overflow-hidden">
                          <div className="bg-[#059669] h-full" style={{ width: `${task.progressPercent}%` }} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Level 4: Risk Downside Stress Engine */}
                <div className="w-full flex justify-center">
                  {workflow.tasks.filter(t => t.id === 'TASK-1055').map(task => (
                    <div key={task.id} className="flex flex-col items-center">
                      <div className="text-[10px] text-[#2563EB] font-bold mb-1">↓ Stress Engine Running</div>
                      <div
                        onClick={() => setSelectedTask(task)}
                        className={`p-4 rounded-xl border transition-all cursor-pointer w-72 bg-white shadow-2xs ring-1 ring-[#2563EB]/40 ${
                          selectedTask?.id === task.id ? 'border-[#2563EB] ring-2 ring-[#2563EB]/40' : 'border-[#EDEDEB]'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold" style={{ backgroundColor: task.agentBadgeBg, color: task.agentBadgeColor }}>
                              {task.agentBadge}
                            </div>
                            <span className="text-xs font-bold text-[#141618]">{task.agentName}</span>
                          </div>
                          <StatusBadge variant="warning" size="xs" dot>Running</StatusBadge>
                        </div>
                        <div className="text-xs font-semibold text-[#141618] line-clamp-1">{task.title}</div>
                        <div className="text-[10.5px] text-[#6C726F] mt-1">{task.budgetFormatted} · {task.eta}</div>
                        <div className="mt-2.5 w-full bg-[#EDEDEB] rounded-full h-1.5 overflow-hidden">
                          <div className="bg-[#2563EB] h-full animate-pulse" style={{ width: `${task.progressPercent}%` }} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Level 5: Final Synthesis (Blocked until Level 4 finishes) */}
                <div className="w-full flex justify-center">
                  {workflow.tasks.filter(t => t.id === 'TASK-1056').map(task => (
                    <div key={task.id} className="flex flex-col items-center">
                      <div className="text-[10px] text-[#9AA19E] mb-1">↓ Awaiting Synthesis Input</div>
                      <div
                        onClick={() => setSelectedTask(task)}
                        className="p-4 rounded-xl border border-dashed border-[#EDEDEB] bg-white opacity-80 cursor-pointer w-72 text-center space-y-1.5"
                      >
                        <div className="text-xs font-bold text-[#141618]">{task.agentName}</div>
                        <div className="text-[10.5px] text-[#9AA19E]">{task.title}</div>
                        <StatusBadge variant="neutral" size="xs">Blocked</StatusBadge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Task Detail Inspector Drawer */}
            {selectedTask && (
              <div className="p-5 bg-white border border-[#EDEDEB] rounded-xl shadow-2xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-3 border-b border-[#EDEDEB]">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-[#87BAA4]">{selectedTask.id}</span>
                      <StatusBadge variant={selectedTask.status === 'completed' ? 'success' : selectedTask.status === 'running' ? 'warning' : 'neutral'} size="xs" dot>
                        {selectedTask.status.toUpperCase()}
                      </StatusBadge>
                      <span className="text-[10px] text-[#9AA19E]">Budget: {selectedTask.budgetFormatted}</span>
                    </div>
                    <h4 className="text-base font-bold text-[#141618] mt-1">{selectedTask.title}</h4>
                    <p className="text-xs text-[#6C726F] mt-0.5">{selectedTask.description}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <div className="text-xs font-bold text-[#141618]">{selectedTask.agentName}</div>
                      <div className="text-[10.5px] text-[#8C9390]">{selectedTask.agentCategory}</div>
                    </div>
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shadow-2xs" style={{ backgroundColor: selectedTask.agentBadgeBg, color: selectedTask.agentBadgeColor }}>
                      {selectedTask.agentBadge}
                    </div>
                  </div>
                </div>

                {/* Selection Rationale */}
                <div className="text-xs text-[#4A504D] bg-[#FBFBFA] p-3 rounded-lg border border-[#EDEDEB]">
                  <span className="font-semibold text-[#141618]">Orchestrator Selection Rationale: </span>
                  {selectedTask.selectionReason}
                </div>

                {/* Result Section if completed */}
                {selectedTask.result ? (
                  <div className="space-y-3">
                    <h5 className="text-xs font-bold uppercase tracking-wider text-[#9AA19E]">Standardized Output & Findings</h5>
                    <div className="p-4 rounded-lg bg-[#F0F7F4]/60 border border-[#BAD6CC] space-y-2">
                      <div className="text-xs font-semibold text-[#204A3B]">Summary:</div>
                      <p className="text-xs text-[#2D3436] leading-relaxed">{selectedTask.result.summary}</p>
                    </div>

                    <div className="space-y-2">
                      {selectedTask.result.findings.map((f, idx) => (
                        <div key={idx} className="p-3 rounded-lg border border-[#EDEDEB] bg-white flex items-start justify-between gap-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-[#141618]">{f.title}</span>
                              <span className={`text-[9.5px] font-bold uppercase px-1.5 py-0.2 rounded ${
                                f.certainty === 'verified' ? 'bg-[#EAF6EE] text-[#23683C]' :
                                f.certainty === 'estimated' ? 'bg-[#EBF2FA] text-[#285786]' : 'bg-[#FEF3EB] text-[#A05A20]'
                              }`}>
                                {f.certainty}
                              </span>
                            </div>
                            <p className="text-xs text-[#6C726F] mt-0.5">{f.detail}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6 text-xs text-[#9AA19E]">
                    {selectedTask.blockedByMessage || 'Task is currently processing in orchestrator queue.'}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 2. TASK TREE HIERARCHY */}
      {activeTab === 'tree' && (
        <div className="bg-white border border-[#EDEDEB] rounded-xl p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#EDEDEB]">
            <div>
              <h3 className="text-sm font-bold text-[#141618]">Orchestration Task Tree Hierarchy</h3>
              <p className="text-xs text-[#6C726F] mt-0.5">Parent-to-child delegation tree with dependencies and budgets.</p>
            </div>
            <span className="text-xs font-mono font-bold text-[#87BAA4]">{workflow.id}</span>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div className="p-3 bg-[#FBFBFA] rounded-lg border border-[#EDEDEB] font-bold text-[#141618] flex items-center justify-between">
              <span>ROOT WORKFLOW: {workflow.title}</span>
              <span className="font-sans text-[11px] text-[#059669] font-bold">{workflow.progressPercent}% Overall</span>
            </div>

            <div className="pl-4 space-y-2">
              {workflow.tasks.map(task => (
                <div key={task.id} className="p-3 bg-white border border-[#EDEDEB] rounded-lg hover:border-[#87BAA4] transition-colors flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-[#87BAA4] font-bold">{task.id}</span>
                    <span className="font-sans font-semibold text-[#141618]">{task.title}</span>
                    <span className="font-sans text-[11px] text-[#6C726F]">({task.agentName})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-[#141618]">{task.budgetFormatted}</span>
                    <StatusBadge variant={task.status === 'completed' ? 'success' : task.status === 'running' ? 'warning' : 'neutral'} size="xs" dot>
                      {task.status.toUpperCase()}
                    </StatusBadge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 3. AGENT HANDOFFS */}
      {activeTab === 'handoffs' && (
        <div className="bg-white border border-[#EDEDEB] rounded-xl p-6 shadow-2xs space-y-4">
          <h3 className="text-sm font-bold text-[#141618]">Agent-to-Agent Handoff Telemetry</h3>
          <p className="text-xs text-[#6C726F]">
            Inspect verified contextual state payloads passed between specialized agents.
          </p>

          <div className="space-y-3 pt-2">
            {workflow.handoffs.map(ho => (
              <div key={ho.id} className="p-4 bg-[#FBFBFA] border border-[#EDEDEB] rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#141618]">
                    <span className="text-[#2B5C8F]">{ho.fromAgentName}</span>
                    <span className="text-[#87BAA4]">→</span>
                    <span className="text-[#7E22CE]">{ho.toAgentName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge variant="success" size="xs">DELIVERED</StatusBadge>
                    <span className="text-[10px] text-[#9AA19E]">{ho.timestamp}</span>
                  </div>
                </div>
                <div className="text-xs text-[#2D3436] p-3 rounded-lg bg-white border border-[#EDEDEB] leading-relaxed">
                  <span className="font-semibold text-[#141618]">Payload Digest: </span>
                  {ho.dataSummary}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. CONFLICT DETECTION ENGINE */}
      {activeTab === 'conflicts' && (
        <div className="bg-white border border-[#EDEDEB] rounded-xl p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#EDEDEB]">
            <div>
              <h3 className="text-sm font-bold text-[#141618] flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-[#D97706]" />
                <span>Agent Discrepancy & Conflict Detection</span>
              </h3>
              <p className="text-xs text-[#6C726F] mt-0.5">
                Faro automatically surfaces contradictory claims between agents rather than smoothing them away.
              </p>
            </div>
            <span className="text-[10.5px] font-bold text-[#A05A20] bg-[#FEF3EB] px-2.5 py-1 rounded border border-[#F8DCC4]">
              {workflow.conflicts.length} Active Conflict
            </span>
          </div>

          <div className="space-y-4 pt-1">
            {workflow.conflicts.map(conf => (
              <div key={conf.id} className="p-5 rounded-xl border border-[#F8DCC4] bg-[#FEF3EB]/30 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold text-[#141618]">Topic: {conf.topic}</div>
                  <StatusBadge variant="warning" size="xs">CONFLICT DETECTED</StatusBadge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-white rounded-lg border border-[#EDEDEB] space-y-2">
                    <div className="text-xs font-bold text-[#2B5C8F]">{conf.agentA.agentName} Claim:</div>
                    <p className="text-xs text-[#141618] italic font-medium">"{conf.agentA.conclusion}"</p>
                    <div className="text-[11px] text-[#6C726F] pt-1 border-t border-[#EDEDEB]">
                      Evidence Citation: {conf.agentA.evidenceQuote}
                    </div>
                  </div>

                  <div className="p-4 bg-white rounded-lg border border-[#EDEDEB] space-y-2">
                    <div className="text-xs font-bold text-[#A85A24]">{conf.agentB.agentName} Counter-Claim:</div>
                    <p className="text-xs text-[#141618] italic font-medium">"{conf.agentB.conclusion}"</p>
                    <div className="text-[11px] text-[#6C726F] pt-1 border-t border-[#EDEDEB]">
                      Evidence Citation: {conf.agentB.evidenceQuote}
                    </div>
                  </div>
                </div>

                {conf.resolutionNote && (
                  <div className="p-3 bg-white rounded-lg border border-[#BAD6CC] text-xs text-[#204A3B]">
                    <span className="font-bold">Faro Orchestrator Directive: </span>
                    {conf.resolutionNote}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. SHARED MEMORY CONTEXT */}
      {activeTab === 'memory' && (
        <div className="bg-white border border-[#EDEDEB] rounded-xl p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#EDEDEB]">
            <div>
              <h3 className="text-sm font-bold text-[#141618] flex items-center gap-2">
                <Database className="w-4 h-4 text-[#87BAA4]" />
                <span>Workspace Shared Memory Context</span>
              </h3>
              <p className="text-xs text-[#6C726F] mt-0.5">
                Cross-agent facts and verified numbers available to every agent in this workflow.
              </p>
            </div>
            <span className="text-xs font-bold text-[#141618]">
              {workflow.sharedMemoryContext.length} Contextual Anchors
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {workflow.sharedMemoryContext.map(fact => (
              <div key={fact.factId} className="p-3.5 rounded-lg border border-[#EDEDEB] bg-[#FBFBFA] space-y-1">
                <div className="text-[10px] uppercase font-bold text-[#9AA19E] tracking-wider">{fact.key}</div>
                <div className="text-xs font-bold text-[#141618]">{fact.value}</div>
                <div className="flex items-center justify-between text-[10px] text-[#6C726F] pt-1">
                  <span>Origin: {fact.originatingAgentName}</span>
                  <span className="font-bold text-[#059669] capitalize">{fact.certainty}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. FINAL IC SYNTHESIS MEMO */}
      {activeTab === 'synthesis' && (
        <div className="space-y-6">
          {workflow.synthesis ? (
            <div className="bg-white border border-[#EDEDEB] rounded-xl p-6 sm:p-8 shadow-2xs space-y-6">
              <div className="pb-4 border-b border-[#EDEDEB] flex items-center justify-between">
                <div>
                  <div className="text-[10.5px] uppercase font-semibold text-[#87BAA4] tracking-wider">
                    Investment Committee Synthesis
                  </div>
                  <h2 className="text-2xl font-bold text-[#141618] mt-1">{workflow.synthesis.title}</h2>
                </div>
                <span className="text-xs text-[#9AA19E]">Generated {workflow.synthesis.generatedAt}</span>
              </div>

              {/* Executive Summary */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#9AA19E] mb-2">Executive Summary</h4>
                <div className="p-4 rounded-lg bg-[#FBFBFA] border border-[#EDEDEB] text-xs text-[#2D3436] leading-relaxed">
                  {workflow.synthesis.executiveSummary}
                </div>
              </div>

              {/* Thesis & Counter-Thesis Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-[#F0F7F4]/70 border border-[#BAD6CC] space-y-2">
                  <div className="text-xs font-bold text-[#204A3B]">Investment Thesis (Pros)</div>
                  <ul className="list-disc list-inside space-y-1 text-xs text-[#141618]">
                    {workflow.synthesis.investmentThesis.map((t, idx) => (
                      <li key={idx}>{t}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-lg bg-[#FDECEB]/70 border border-[#F8CDC9] space-y-2">
                  <div className="text-xs font-bold text-[#A5342C]">Counter-Thesis & Key Vulnerabilities</div>
                  <ul className="list-disc list-inside space-y-1 text-xs text-[#141618]">
                    {workflow.synthesis.counterThesis.map((ct, idx) => (
                      <li key={idx}>{ct}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Financial Telemetry */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#9AA19E] mb-2">Synthesized Financial Ratios</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {workflow.synthesis.financialAnalysis.keyMetrics.map((km, idx) => (
                    <div key={idx} className="p-3 bg-[#FAFAF9] rounded-lg border border-[#EDEDEB]">
                      <div className="text-[10px] text-[#9AA19E] uppercase font-semibold">{km.label}</div>
                      <div className="text-sm font-bold text-[#141618] mt-0.5">{km.value}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Risks & Mitigation */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#9AA19E] mb-2">Downside Risks & Covenant Recommendations</h4>
                <div className="space-y-2.5">
                  {workflow.synthesis.risksIdentified.map((r, idx) => (
                    <div key={idx} className="p-3.5 rounded-lg border border-[#EDEDEB] bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="text-xs font-bold text-[#141618]">{r.risk}</div>
                        <div className="text-[11px] text-[#6C726F] mt-0.5">Mitigation: {r.mitigation}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-[#9AA19E]">Identified by {r.detectedByAgent}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${r.severity === 'High' ? 'bg-[#FDECEB] text-[#A5342C]' : 'bg-[#FEF3EB] text-[#A05A20]'}`}>
                          {r.severity}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-[#EDEDEB] rounded-xl p-12 text-center text-xs text-[#9AA19E] space-y-2">
              <Clock className="w-8 h-8 text-[#9AA19E] mx-auto" />
              <div className="font-bold text-[#141618]">Final Synthesis Inactive</div>
              <p className="max-w-md mx-auto text-[#6C726F]">
                Faro Synthesis Agent will compile the full investment analysis once all upstream specialized agent nodes complete.
              </p>
            </div>
          )}
        </div>
      )}

      {/* HUMAN APPROVAL GATE MODAL */}
      {isApprovalModalOpen && selectedGate && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-2xl space-y-4 border border-[#EDEDEB]">
            <div className="flex items-center gap-2 text-[#E58A38]">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="text-base font-bold text-[#141618]">Human Approval Gate Required</h3>
            </div>

            <div className="p-4 bg-[#FBFBFA] border border-[#EDEDEB] rounded-xl space-y-2 text-xs">
              <div className="font-bold text-[#141618]">{selectedGate.title}</div>
              <p className="text-[#6C726F] leading-relaxed">{selectedGate.description}</p>
              {selectedGate.proposalData.amountFormatted && (
                <div className="pt-2 border-t border-[#EDEDEB] flex items-center justify-between">
                  <span className="font-semibold text-[#141618]">Capital Amount:</span>
                  <span className="font-extrabold text-[#059669] text-sm">{selectedGate.proposalData.amountFormatted}</span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#141618] mb-1">Partner Directives & Review Notes</label>
              <textarea
                value={approvalNotes}
                onChange={(e) => setApprovalNotes(e.target.value)}
                placeholder="Condition investment on 24-month contract renewal rider with Apex Logistics."
                rows={3}
                className="w-full p-3 rounded-lg border border-[#EDEDEB] text-xs focus:outline-none focus:border-[#87BAA4]"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => handleApproveGate('rejected')}
                className="px-3.5 py-2 rounded-lg border border-[#EDEDEB] text-xs font-semibold text-[#DC2626] hover:bg-[#FDECEB] transition-colors"
              >
                Reject Proposal
              </button>
              <button
                type="button"
                onClick={() => handleApproveGate('approved')}
                className="px-4 py-2 rounded-lg bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-semibold transition-colors shadow-2xs cursor-pointer"
              >
                Approve & Execute Synthesis
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
