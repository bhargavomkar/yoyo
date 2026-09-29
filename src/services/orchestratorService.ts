import { 
  AgentWorkflow, 
  WorkflowTaskNode, 
  OrchestratorTemplate, 
  HumanApprovalGate, 
  AgentConflict, 
  FinalSynthesisReport 
} from '@/types/orchestrator';
import { 
  ORCHESTRATOR_TEMPLATES, 
  INITIAL_ORCHESTRATOR_WORKFLOWS 
} from '@/lib/orchestratorMockData';
import { DEMO_MARKETPLACE_AGENTS } from '@/lib/agentMarketplaceMockData';

class OrchestratorEngine {
  private workflows: AgentWorkflow[] = [...INITIAL_ORCHESTRATOR_WORKFLOWS];
  private templates: OrchestratorTemplate[] = [...ORCHESTRATOR_TEMPLATES];

  public getWorkflows(): AgentWorkflow[] {
    return this.workflows;
  }

  public getWorkflowById(id: string): AgentWorkflow | undefined {
    return this.workflows.find(w => w.id === id);
  }

  public getTemplates(): OrchestratorTemplate[] {
    return this.templates;
  }

  public createWorkflowFromPrompt(params: {
    objective: string;
    targetEntity: string;
    mode: 'automatic' | 'manual';
    maxBudgetEth?: number;
    selectedAgentIds?: string[];
    relatedDealId?: string;
  }): AgentWorkflow {
    const nextId = `WF-${2050 + this.workflows.length + 1}`;
    const budgetTotal = params.maxBudgetEth || 0.40;

    // Plan tasks
    const newWorkflow: AgentWorkflow = {
      id: nextId,
      title: `Orchestrated Analysis: ${params.targetEntity}`,
      targetEntity: params.targetEntity,
      objective: params.objective,
      mode: params.mode,
      status: 'running',
      progressPercent: 15,
      budget: {
        totalBudgetEth: budgetTotal,
        totalBudgetFormatted: `${budgetTotal.toFixed(2)} ETH`,
        allocatedEth: 0.35,
        allocatedFormatted: '0.35 ETH',
        spentEth: 0.08,
        spentFormatted: '0.08 ETH',
        remainingEth: budgetTotal - 0.35,
        remainingFormatted: `${(budgetTotal - 0.35).toFixed(2)} ETH`,
        isSimulatedDemo: true,
        warnings: []
      },
      tasks: [
        {
          id: `TASK-${Math.floor(1060 + Math.random() * 50)}`,
          workflowId: nextId,
          childTaskIds: [],
          title: `Primary Intelligence & Filing Extraction: ${params.targetEntity}`,
          description: `Gather audited financials, SEC/registry filings, and operational metrics for ${params.targetEntity}.`,
          agentId: 'atlas-research',
          agentName: 'Atlas Research',
          agentBadge: 'AR',
          agentBadgeBg: '#EBF2FA',
          agentBadgeColor: '#2B5C8F',
          agentCategory: 'Research',
          selectionReason: 'Autonomous fundamental research with 98.6% citation accuracy.',
          budgetEth: 0.08,
          budgetFormatted: '0.08 ETH',
          progressPercent: 65,
          status: 'running',
          dependsOnTaskIds: [],
          startedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          eta: '~3 mins remaining'
        },
        {
          id: `TASK-${Math.floor(1110 + Math.random() * 50)}`,
          workflowId: nextId,
          childTaskIds: [],
          title: `Valuation & Cap Table Dilution Modeling`,
          description: `Construct intrinsic valuation model and liquidation preference stack.`,
          agentId: 'meridian-valuation',
          agentName: 'Meridian Valuation',
          agentBadge: 'MV',
          agentBadgeBg: '#F3E8FF',
          agentBadgeColor: '#7E22CE',
          agentCategory: 'Valuation',
          selectionReason: 'Specialized 3-statement DCF & multiple benchmarking engine.',
          budgetEth: 0.08,
          budgetFormatted: '0.08 ETH',
          progressPercent: 0,
          status: 'blocked',
          dependsOnTaskIds: ['TASK-1060'],
          blockedByMessage: 'Awaiting primary intelligence from Atlas Research.',
          eta: 'Queued'
        },
        {
          id: `TASK-${Math.floor(1160 + Math.random() * 50)}`,
          workflowId: nextId,
          childTaskIds: [],
          title: `Multi-Factor Stress Test & Downside Simulation`,
          description: `Simulate macro shock, supply disruptions, and customer loss scenarios.`,
          agentId: 'keystone-risk',
          agentName: 'Keystone Risk',
          agentBadge: 'KR',
          agentBadgeBg: '#EBF5F1',
          agentBadgeColor: '#2E6E56',
          agentCategory: 'Risk',
          selectionReason: 'Quantitative Monte Carlo stress testing algorithms.',
          budgetEth: 0.06,
          budgetFormatted: '0.06 ETH',
          progressPercent: 0,
          status: 'blocked',
          dependsOnTaskIds: ['TASK-1110'],
          blockedByMessage: 'Awaiting valuation model output.',
          eta: 'Queued'
        },
        {
          id: `TASK-${Math.floor(1210 + Math.random() * 50)}`,
          workflowId: nextId,
          childTaskIds: [],
          title: `Faro Final IC Memo Synthesis`,
          description: `Integrate research, valuation, and risk results into unified evidence-backed memo.`,
          agentId: 'faro-synthesis',
          agentName: 'Faro Synthesis Agent',
          agentBadge: 'FS',
          agentBadgeBg: '#141618',
          agentBadgeColor: '#87BAA4',
          agentCategory: 'Research',
          selectionReason: 'Lead Faro Orchestrator institutional synthesis engine.',
          budgetEth: 0.05,
          budgetFormatted: '0.05 ETH',
          progressPercent: 0,
          status: 'blocked',
          dependsOnTaskIds: ['TASK-1160'],
          blockedByMessage: 'Awaiting risk stress simulation completion.',
          eta: 'Queued'
        }
      ],
      dependencies: [],
      handoffs: [],
      conflicts: [],
      approvalGates: [],
      sharedMemoryContext: [
        {
          factId: `fact-${Date.now()}`,
          key: 'Workflow Objective',
          value: params.objective,
          certainty: 'verified',
          originatingAgentName: 'Faro Orchestrator',
          timestamp: 'Just now'
        }
      ],
      events: [
        {
          id: `evt-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          timeOffset: 'Just now',
          actor: 'Faro Orchestrator',
          action: `Initiated autonomous workflow for ${params.targetEntity} with ${budgetTotal} ETH budget`,
          type: 'planning'
        }
      ],
      createdAt: 'Just now',
      relatedDealId: params.relatedDealId
    };

    this.workflows = [newWorkflow, ...this.workflows];
    return newWorkflow;
  }

  public respondToApprovalGate(params: {
    workflowId: string;
    gateId: string;
    decision: 'approved' | 'rejected' | 'revision_requested';
    notes?: string;
  }): AgentWorkflow | undefined {
    const wf = this.workflows.find(w => w.id === params.workflowId);
    if (!wf) return undefined;

    const gate = wf.approvalGates.find(g => g.id === params.gateId);
    if (gate) {
      gate.status = params.decision;
      gate.respondedAt = 'Just now';
      gate.feedbackNotes = params.notes;

      wf.events.push({
        id: `evt-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        timeOffset: 'Just now',
        actor: 'Human Investment Partner',
        action: `Responded to Approval Gate "${gate.title}": ${params.decision.toUpperCase()}`,
        type: 'gate'
      });

      // If approved, trigger final synthesis completion simulation
      if (params.decision === 'approved') {
        const synthesisTask = wf.tasks.find(t => t.agentId === 'faro-synthesis');
        if (synthesisTask) {
          synthesisTask.status = 'completed';
          synthesisTask.progressPercent = 100;
          wf.status = 'completed';
          wf.progressPercent = 100;

          wf.synthesis = {
            id: `synth-${Date.now()}`,
            workflowId: wf.id,
            title: `Investment Committee Synthesis: ${wf.targetEntity}`,
            executiveSummary: `${wf.targetEntity} represents an actionable growth investment opportunity at an attractive valuation entry ($80M pre-money). While customer concentration warrants ongoing scrutiny, proprietary SLAM guidance and brownfield operational velocity provide sustainable pricing defense.`,
            investmentThesis: [
              'High ARR momentum (+42% YoY) supported by $28.5M contracted backlog.',
              'Moat backed by 6 granted USPTO patents on SLAM vision navigation without costly physical track retrofits.',
              'Entry valuation priced at a 12% discount to intrinsic DCF midpoint of $91.5M.'
            ],
            counterThesis: [
              'Apex Logistics customer represents 34% of active ARR; contract non-renewal would imperil growth thesis.',
              'Potential hardware cost escalation from tier-1 automotive lidar suppliers.'
            ],
            financialAnalysis: {
              keyMetrics: [
                { label: 'Audited Run-Rate ARR', value: '$14.2M' },
                { label: 'Gross Margins (Blended)', value: '54.2%' },
                { label: 'Cash Runway at Current Burn', value: '18.4 Months' },
                { label: 'Contracted Multi-Year Backlog', value: '$28.5M' }
              ],
              synthesisNote: 'Revenues verified via cap table schedule exhibits. Working capital is sufficient through late 2027 without immediate recapitalization.'
            },
            marketAnalysis: {
              addressableMarket: '$18.4B Global Brownfield Warehouse Automation by 2030',
              competitiveMoats: [
                'Zero-floor-infrastructure retrofits (3-week commissioning SLA vs 6-9 months for incumbents)',
                'Hardware-agnostic vision software layer'
              ]
            },
            valuationSynthesis: {
              fairValueRange: '$85.0M – $98.0M',
              methodologiesApplied: ['10-Year Discounted Cash Flow (11.2% WACC)', 'Public Peer Enterprise Comps (6.4x EV/ARR)']
            },
            risksIdentified: [
              {
                risk: 'Customer Concentration (Apex Logistics represents 34% ARR)',
                severity: 'High',
                mitigation: 'Incorporate customer diversification milestone covenant and require 24-month contract renewal rider prior to funding closing.',
                detectedByAgent: 'Mosaic Diligence'
              },
              {
                risk: 'Hardware Component Cost Escalation',
                severity: 'Medium',
                mitigation: 'Accelerate transition to high-margin software licensing subscription tiers.',
                detectedByAgent: 'Keystone Risk'
              }
            ],
            dueDiligenceFindings: [
              { category: 'Cap Table', finding: '1x Non-participating senior liquidation preferences clean without debt liens.', status: 'Verified' },
              { category: 'IP & Patents', finding: '6 USPTO patents active in good standing without challenge.', status: 'Verified' },
              { category: 'Customer Retention', finding: 'Top account concentration elevated at 34%.', status: 'Flagged' }
            ],
            evidenceCitations: wf.tasks.flatMap(t => t.result?.evidence || []).slice(0, 6),
            unknowns: [
              'Pricing response from Symbotic and Boston Dynamics in brownfield retrofits.'
            ],
            assumptions: [
              'Apex Logistics contract will renew under current fee terms.'
            ],
            openQuestions: [
              'Should Faro syndicate an additional $2.5M to bring total round to $7.5M for accelerated European expansion?'
            ],
            generatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          };
        }
      }
    }
    return wf;
  }

  public retryTask(workflowId: string, taskId: string): AgentWorkflow | undefined {
    const wf = this.workflows.find(w => w.id === paramsSafe(workflowId));
    if (!wf) return undefined;
    const task = wf.tasks.find(t => t.id === taskId);
    if (task) {
      task.status = 'running';
      task.progressPercent = 30;
      task.failureReason = undefined;
    }
    return wf;
  }

  public replaceAgentForTask(workflowId: string, taskId: string, newAgentId: string): AgentWorkflow | undefined {
    const wf = this.workflows.find(w => w.id === workflowId);
    if (!wf) return undefined;
    const task = wf.tasks.find(t => t.id === taskId);
    const agent = DEMO_MARKETPLACE_AGENTS.find(a => a.id === newAgentId);
    if (task && agent) {
      task.agentId = agent.id;
      task.agentName = agent.name;
      task.agentBadge = agent.badge;
      task.agentBadgeBg = agent.badgeBg;
      task.agentBadgeColor = agent.badgeColor;
      task.selectionReason = `Manually replaced by user: ${agent.specialization}`;
      task.status = 'running';
      task.progressPercent = 10;
    }
    return wf;
  }

  public resolveConflict(workflowId: string, conflictId: string, resolutionNote: string): AgentWorkflow | undefined {
    const wf = this.workflows.find(w => w.id === workflowId);
    if (!wf) return undefined;
    const conf = wf.conflicts.find(c => c.id === conflictId);
    if (conf) {
      conf.status = 'resolved';
      conf.resolutionNote = resolutionNote;
    }
    return wf;
  }
}

function paramsSafe(str: string): string {
  return str;
}

export const OrchestratorService = new OrchestratorEngine();
