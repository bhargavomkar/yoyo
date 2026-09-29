'use client';

import React, { useState } from 'react';
import { AgentWorkflow, OrchestratorTemplate } from '@/types/orchestrator';
import { OrchestratorService } from '@/services/orchestratorService';
import { WorkflowGraphView } from '@/components/orchestrator/WorkflowGraphView';
import { 
  Workflow, 
  Plus, 
  ArrowRight, 
  Layers, 
  ShieldCheck, 
  Check, 
  Clock, 
  TrendingUp, 
  Coins, 
  Cpu, 
  AlertTriangle,
  Play
} from 'lucide-react';
import { StatusBadge } from '@/components/ui/StatusBadge';

interface AgentOrchestratorViewProps {
  onSelectWorkflowDetail?: (workflowId: string) => void;
}

export const AgentOrchestratorView: React.FC<AgentOrchestratorViewProps> = () => {
  const [workflows, setWorkflows] = useState<AgentWorkflow[]>(OrchestratorService.getWorkflows());
  const [selectedWorkflowId, setSelectedWorkflowId] = useState<string>(workflows[0]?.id || 'WF-2050');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Form State
  const [objective, setObjective] = useState('Evaluate Atlas Robotics for a potential $5M growth investment.');
  const [targetEntity, setTargetEntity] = useState('Atlas Robotics Inc.');
  const [mode, setMode] = useState<'automatic' | 'manual'>('automatic');
  const [maxBudgetEth, setMaxBudgetEth] = useState(0.40);

  const templates = OrchestratorService.getTemplates();
  const currentWorkflow = workflows.find(w => w.id === selectedWorkflowId) || workflows[0];

  const handleApplyTemplate = (tmpl: OrchestratorTemplate) => {
    setObjective(tmpl.defaultObjective);
    setTargetEntity(tmpl.title.includes('NVIDIA') ? 'NVIDIA Corp' : 'Atlas Robotics Inc.');
    setMaxBudgetEth(tmpl.estimatedBudgetEth);
    setIsCreateModalOpen(true);
  };

  const handleCreateWorkflow = (e: React.FormEvent) => {
    e.preventDefault();
    if (!objective.trim() || !targetEntity.trim()) return;

    const newWf = OrchestratorService.createWorkflowFromPrompt({
      objective,
      targetEntity,
      mode,
      maxBudgetEth
    });

    setWorkflows(OrchestratorService.getWorkflows());
    setSelectedWorkflowId(newWf.id);
    setIsCreateModalOpen(false);
  };

  return (
    <div className="space-y-8 pb-16 max-w-7xl mx-auto animate-in fade-in duration-150">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <div className="text-[10.5px] font-semibold uppercase tracking-wider text-[#87BAA4] mb-0.5">
            Agent-to-Agent Coordination Layer
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-[#141618]">
            Faro Orchestrator
          </h1>
          <p className="text-xs md:text-sm text-[#6C726F] mt-1 max-w-2xl leading-relaxed">
            Coordinate specialized intelligence into one unified institutional investment workflow.
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-[#141618] hover:bg-neutral-800 text-white text-xs font-semibold shadow-2xs transition-colors self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Create Agent Workflow</span>
        </button>
      </div>

      {/* 2. Top Orchestrator Metrics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-[#EDEDEB] rounded-xl p-4 shadow-2xs">
          <div className="text-[10px] text-[#9AA19E] uppercase font-semibold">Active Workflows</div>
          <div className="text-xl font-bold text-[#141618] mt-1">{workflows.filter(w => w.status === 'running').length} Coordinating</div>
          <div className="text-[10.5px] text-[#059669] font-medium mt-0.5">Dual-Pass Evidence Enabled</div>
        </div>

        <div className="bg-white border border-[#EDEDEB] rounded-xl p-4 shadow-2xs">
          <div className="text-[10px] text-[#9AA19E] uppercase font-semibold">Allocated Demo Escrow</div>
          <div className="text-xl font-bold text-[#141618] mt-1">{currentWorkflow ? currentWorkflow.budget.allocatedFormatted : '0.38 ETH'}</div>
          <div className="text-[10.5px] text-[#6C726F] mt-0.5">Max Cap: {currentWorkflow ? currentWorkflow.budget.totalBudgetFormatted : '0.40 ETH'}</div>
        </div>

        <div className="bg-white border border-[#EDEDEB] rounded-xl p-4 shadow-2xs">
          <div className="text-[10px] text-[#9AA19E] uppercase font-semibold">Conflict Status</div>
          <div className="text-xl font-bold text-[#D97706] mt-1">{currentWorkflow ? currentWorkflow.conflicts.length : 0} Surfaced</div>
          <div className="text-[10.5px] text-[#6C726F] mt-0.5">Zero Silent Overwrites</div>
        </div>

        <div className="bg-white border border-[#EDEDEB] rounded-xl p-4 shadow-2xs">
          <div className="text-[10px] text-[#9AA19E] uppercase font-semibold">Human Approval Gate</div>
          <div className="text-xl font-bold text-[#141618] mt-1">
            {currentWorkflow?.approvalGates.some(g => g.status === 'pending') ? '1 Pending' : '0 Pending'}
          </div>
          <div className="text-[10.5px] text-[#059669] font-medium mt-0.5">Partner Sign-off Guard</div>
        </div>
      </div>

      {/* 3. Reusable Workflow Templates Bar */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[10.5px] font-semibold uppercase tracking-wider text-[#9AA19E]">
            Orchestration Templates
          </span>
          <span className="text-[10.5px] text-[#6C726F]">
            Coordinated multi-agent templates with dependency rules
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {templates.map(tmpl => (
            <div
              key={tmpl.id}
              onClick={() => handleApplyTemplate(tmpl)}
              className="p-4 bg-white border border-[#EDEDEB] rounded-xl hover:border-[#87BAA4] hover:shadow-xs transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-[10px] text-[#87BAA4] font-semibold uppercase mb-1">
                  <span>{tmpl.category}</span>
                  <span>{tmpl.estimatedDuration}</span>
                </div>
                <h4 className="text-sm font-bold text-[#141618] group-hover:text-[#2563EB] transition-colors">
                  {tmpl.title}
                </h4>
                <p className="text-xs text-[#6C726F] mt-1 line-clamp-2 leading-relaxed">
                  {tmpl.description}
                </p>
              </div>

              <div className="mt-4 pt-2.5 border-t border-[#EDEDEB] flex items-center justify-between text-xs">
                <span className="font-bold text-[#141618]">{tmpl.estimatedBudgetEth} ETH</span>
                <span className="font-semibold text-[#87BAA4] flex items-center gap-1">
                  Launch <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Active Workflow Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {workflows.map(wf => (
          <button
            key={wf.id}
            onClick={() => setSelectedWorkflowId(wf.id)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shrink-0 ${
              selectedWorkflowId === wf.id
                ? 'bg-[#141618] text-white shadow-xs'
                : 'bg-white border border-[#EDEDEB] text-[#4A504D] hover:bg-[#FAFAF9]'
            }`}
          >
            <span className="font-mono text-[#87BAA4]">[{wf.id}]</span>
            <span>{wf.targetEntity}</span>
            <StatusBadge
              variant={wf.status === 'completed' ? 'success' : wf.status === 'running' ? 'warning' : 'neutral'}
              size="xs"
              dot
            >
              {wf.progressPercent}%
            </StatusBadge>
          </button>
        ))}
      </div>

      {/* 5. Main Workflow Graph View */}
      {currentWorkflow && (
        <WorkflowGraphView
          workflow={currentWorkflow}
          onWorkflowUpdated={(updated) => {
            setWorkflows(OrchestratorService.getWorkflows());
          }}
        />
      )}

      {/* 6. CREATE AGENT WORKFLOW MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-xl w-full p-6 shadow-2xl space-y-4 border border-[#EDEDEB]">
            <div className="flex items-center justify-between pb-3 border-b border-[#EDEDEB]">
              <div>
                <h3 className="text-base font-bold text-[#141618]">Create Coordinated Agent Workflow</h3>
                <p className="text-xs text-[#6C726F]">Faro Orchestrator will plan tasks, assign agents, and enforce dependency graphs.</p>
              </div>
              <button onClick={() => setIsCreateModalOpen(false)} className="text-xs text-[#9AA19E] hover:text-[#141618]">✕</button>
            </div>

            <form onSubmit={handleCreateWorkflow} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#141618] mb-1">Target Entity / Company</label>
                <input
                  type="text"
                  value={targetEntity}
                  onChange={(e) => setTargetEntity(e.target.value)}
                  placeholder="e.g. Atlas Robotics Inc."
                  className="w-full px-3 py-2 rounded-lg border border-[#EDEDEB] text-xs text-[#141618] focus:outline-none focus:border-[#87BAA4]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#141618] mb-1">Workflow Objective</label>
                <textarea
                  value={objective}
                  onChange={(e) => setObjective(e.target.value)}
                  placeholder="What should the coordinated agents evaluate and synthesize?"
                  rows={3}
                  className="w-full p-3 rounded-lg border border-[#EDEDEB] text-xs text-[#141618] focus:outline-none focus:border-[#87BAA4] leading-relaxed"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#141618] mb-1">Agent Assignment Mode</label>
                  <select
                    value={mode}
                    onChange={(e) => setMode(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg border border-[#EDEDEB] text-xs text-[#141618] bg-white cursor-pointer"
                  >
                    <option value="automatic">Automatic (Faro Autonomous Choice)</option>
                    <option value="manual">Manual Agent Selection</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#141618] mb-1">Maximum Workflow Budget</label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.01"
                      value={maxBudgetEth}
                      onChange={(e) => setMaxBudgetEth(parseFloat(e.target.value))}
                      className="w-full px-3 py-2 rounded-lg border border-[#EDEDEB] text-xs text-[#141618]"
                      required
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[#8C9390]">ETH</span>
                  </div>
                </div>
              </div>

              <div className="p-3.5 bg-[#FBFBFA] border border-[#EDEDEB] rounded-lg text-xs space-y-1">
                <div className="font-semibold text-[#141618] flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#87BAA4]" />
                  <span>Simulated Demo Escrow Buffer</span>
                </div>
                <p className="text-[11px] text-[#6C726F]">
                  Allocations will be reserved in demo escrow. No child tasks will be launched exceeding {maxBudgetEth} ETH.
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-3.5 py-2 rounded-lg border border-[#EDEDEB] text-xs font-semibold text-[#6C726F]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>Plan & Launch Workflow</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
