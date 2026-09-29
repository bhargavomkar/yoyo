import { AgentCategory, AgentDeliverableEvidence } from './agentMarketplace';

export type WorkflowStatus = 
  | 'planning'
  | 'queued'
  | 'running'
  | 'awaiting_approval'
  | 'completed'
  | 'failed'
  | 'cancelled';

export type OrchestratorTaskStatus = 
  | 'queued'
  | 'running'
  | 'completed'
  | 'blocked'
  | 'failed'
  | 'awaiting_input'
  | 'cancelled';

export type CertaintyLevel = 'verified' | 'estimated' | 'assumption' | 'unknown';

export interface AgentResultFinding {
  title: string;
  detail: string;
  certainty: CertaintyLevel;
  evidenceIds: string[];
  metrics?: { label: string; value: string }[];
}

export interface StandardizedAgentResult {
  taskId: string;
  workflowId: string;
  agentId: string;
  agentName: string;
  agentBadge: string;
  agentBadgeBg: string;
  agentBadgeColor: string;
  summary: string;
  findings: AgentResultFinding[];
  evidence: AgentDeliverableEvidence[];
  assumptions: string[];
  unknowns: string[];
  confidenceContext: {
    overallConfidenceScore: number; // 0 - 100
    dataSufficiency: 'High' | 'Moderate' | 'Sparse';
    criticalCaveats: string[];
  };
  recommendedNextTask?: {
    taskTitle: string;
    targetSpecialization: string;
    rationale: string;
  };
  timestamp: string;
}

export interface AgentDependency {
  taskId: string;
  dependsOnTaskId: string;
  dependencyType: 'requires_output' | 'requires_approval' | 'soft_prerequisite';
  status: 'pending' | 'resolved' | 'failed';
}

export interface AgentHandoff {
  id: string;
  workflowId: string;
  fromAgentId: string;
  fromAgentName: string;
  toAgentId: string;
  toAgentName: string;
  dataSummary: string;
  resultPayload: StandardizedAgentResult;
  status: 'queued' | 'in_transit' | 'delivered' | 'rejected';
  timestamp: string;
}

export interface WorkflowTaskNode {
  id: string; // e.g. "TASK-1051"
  workflowId: string;
  parentTaskId?: string;
  childTaskIds: string[];
  title: string;
  description: string;
  agentId: string;
  agentName: string;
  agentBadge: string;
  agentBadgeBg: string;
  agentBadgeColor: string;
  agentCategory: AgentCategory;
  selectionReason: string;
  budgetEth: number;
  budgetFormatted: string;
  progressPercent: number; // 0 - 100
  status: OrchestratorTaskStatus;
  dependsOnTaskIds: string[];
  blockedByMessage?: string;
  startedAt?: string;
  completedAt?: string;
  eta: string;
  result?: StandardizedAgentResult;
  failureReason?: string;
  retriesCount?: number;
}

export interface AgentConflict {
  id: string;
  workflowId: string;
  topic: string;
  agentA: {
    agentId: string;
    agentName: string;
    conclusion: string;
    evidenceQuote: string;
    certainty: CertaintyLevel;
  };
  agentB: {
    agentId: string;
    agentName: string;
    conclusion: string;
    evidenceQuote: string;
    certainty: CertaintyLevel;
  };
  status: 'detected' | 'investigating' | 'resolved';
  resolutionNote?: string;
  investigationTaskId?: string;
}

export interface HumanApprovalGate {
  id: string;
  workflowId: string;
  gateType: 'capital_allocation_proposal' | 'escrow_payment_release' | 'high_risk_thesis_shift';
  title: string;
  description: string;
  proposalData: {
    targetEntity: string;
    amountFormatted?: string;
    riskImpact?: string;
    agentsSignedOff: string[];
  };
  status: 'pending' | 'approved' | 'rejected' | 'revision_requested';
  requestedAt: string;
  respondedAt?: string;
  feedbackNotes?: string;
}

export interface WorkflowBudgetTracker {
  totalBudgetEth: number;
  totalBudgetFormatted: string;
  allocatedEth: number;
  allocatedFormatted: string;
  spentEth: number;
  spentFormatted: string;
  remainingEth: number;
  remainingFormatted: string;
  isSimulatedDemo: boolean;
  warnings: string[];
}

export interface FinalSynthesisReport {
  id: string;
  workflowId: string;
  title: string;
  executiveSummary: string;
  investmentThesis: string[];
  counterThesis: string[];
  financialAnalysis: {
    keyMetrics: { label: string; value: string }[];
    synthesisNote: string;
  };
  marketAnalysis: {
    addressableMarket: string;
    competitiveMoats: string[];
  };
  valuationSynthesis: {
    fairValueRange: string;
    methodologiesApplied: string[];
  };
  risksIdentified: {
    risk: string;
    severity: 'High' | 'Medium' | 'Low';
    mitigation: string;
    detectedByAgent: string;
  }[];
  dueDiligenceFindings: {
    category: string;
    finding: string;
    status: 'Verified' | 'Flagged' | 'Under Review';
  }[];
  evidenceCitations: AgentDeliverableEvidence[];
  unknowns: string[];
  assumptions: string[];
  openQuestions: string[];
  generatedAt: string;
}

export interface WorkflowEventLog {
  id: string;
  timestamp: string;
  timeOffset: string;
  actor: string;
  action: string;
  type: 'planning' | 'dispatch' | 'handoff' | 'milestone' | 'conflict' | 'gate' | 'completion' | 'failure';
}

export interface AgentWorkflow {
  id: string; // e.g. "WF-2050"
  title: string;
  targetEntity: string;
  objective: string;
  mode: 'automatic' | 'manual';
  status: WorkflowStatus;
  progressPercent: number;
  budget: WorkflowBudgetTracker;
  tasks: WorkflowTaskNode[];
  dependencies: AgentDependency[];
  handoffs: AgentHandoff[];
  conflicts: AgentConflict[];
  approvalGates: HumanApprovalGate[];
  sharedMemoryContext: {
    factId: string;
    key: string;
    value: string;
    certainty: CertaintyLevel;
    originatingAgentName: string;
    timestamp: string;
  }[];
  synthesis?: FinalSynthesisReport;
  events: WorkflowEventLog[];
  createdAt: string;
  completedAt?: string;
  relatedDealId?: string;
  relatedPortfolioId?: string;
}

export interface OrchestratorTemplate {
  id: string;
  title: string;
  category: string;
  description: string;
  defaultObjective: string;
  targetEntityType: string;
  estimatedBudgetEth: number;
  estimatedDuration: string;
  agentsRequired: {
    agentId: string;
    role: string;
    dependencies: string[];
  }[];
}
