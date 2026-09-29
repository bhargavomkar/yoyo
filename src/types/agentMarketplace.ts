export type AgentCategory = 
  | 'Research'
  | 'Markets'
  | 'Private Markets'
  | 'Due Diligence'
  | 'Valuation'
  | 'Risk'
  | 'Macro'
  | 'Portfolio'
  | 'Financial Modeling'
  | 'Competitive Intelligence';

export type AgentAvailability = 'available' | 'busy' | 'offline';

export type PricingModel = 'Fixed Price' | 'Hourly' | 'Custom Quote';

export interface AgentPricing {
  model: PricingModel;
  baseEthPrice: number;
  startingPriceFormatted: string;
  hourlyRate?: string;
  notes?: string;
}

export interface AgentReview {
  id: string;
  agentId: string;
  userName: string;
  userRole: string;
  rating: number; // 1 - 5
  accuracy: number;
  evidenceQuality: number;
  timeliness: number;
  usefulness: number;
  comment: string;
  date: string;
  verifiedWorkOrderId: string;
}

export interface AgentDeliverableEvidence {
  id: string;
  claim: string;
  sourceTitle: string;
  sourceType: 'SEC Filing' | 'Earnings Call' | 'Cap Table' | 'Market Data' | 'Patent' | 'Expert Network';
  sourceUrl?: string;
  confidenceScore: number; // 0 - 100
  timestamp: string;
  snippet: string;
}

export interface AgentDeliverable {
  id: string;
  workOrderId: string;
  title: string;
  status: 'draft' | 'ready' | 'accepted' | 'revision_requested';
  executiveSummary: string;
  marketMap?: { category: string; players: string[]; positioning: string }[];
  keyFindings: { title: string; detail: string; evidenceIds: string[] }[];
  financialMetrics?: { metric: string; value: string; variance?: string }[];
  risksIdentified: { risk: string; severity: 'high' | 'medium' | 'low'; mitigation: string }[];
  evidence: AgentDeliverableEvidence[];
  openQuestions: string[];
  generatedAt: string;
  pdfExportAvailable?: boolean;
}

export interface AgentPerformanceStats {
  tasksCompleted: number;
  successRate: number; // 0 - 100
  averageRating: number;
  averageCompletionTime: string;
  monthlyVelocity: number[];
  accuracyScore: number;
  timelinessScore: number;
  isDemoData: boolean;
}

export interface MarketplaceAgent {
  id: string;
  name: string;
  badge: string;
  badgeBg: string;
  badgeColor: string;
  avatarUrl?: string;
  category: AgentCategory;
  specialization: string;
  rating: number;
  completedTasks: number;
  successRate: number;
  availability: AgentAvailability;
  pricing: AgentPricing;
  about: string;
  capabilities: string[];
  latency: string;
  model: string;
  activeOrders: number;
  performance: AgentPerformanceStats;
  reviews: AgentReview[];
  recentDeliverableTitles: string[];
  isDemoAgent: boolean;
}

export type WorkOrderStatus = 
  | 'posted'
  | 'accepted'
  | 'researching'
  | 'awaiting_review'
  | 'delivered'
  | 'accepted_by_user'
  | 'revision_requested'
  | 'agent_revising'
  | 'paid'
  | 'cancelled'
  | 'disputed';

export type EscrowStatus = 'ready_to_fund' | 'funded_simulated' | 'released_simulated' | 'refunded_simulated';

export interface EscrowState {
  escrowId: string;
  budgetEth: number;
  budgetFormatted: string;
  status: EscrowStatus;
  isSimulatedDemo: boolean;
  depositTxHash?: string;
  releaseTxHash?: string;
  explanation: string;
}

export interface WorkOrderTimelineEvent {
  id: string;
  timestamp: string;
  timeOffset: string;
  label: string;
  detail?: string;
  type: 'creation' | 'assignment' | 'research' | 'milestone' | 'deliverable' | 'review' | 'payment';
}

export interface TaskBrief {
  taskTitle: string;
  taskDescription: string;
  preferredAgentId: string;
  budgetEth: number;
  deadline?: string;
  priority: 'normal' | 'high';
  requiredOutput: 'Research Report' | 'Financial Model' | 'Risk Analysis' | 'Competitive Analysis' | 'Custom';
  attachments?: { name: string; size: string }[];
  relatedDealId?: string;
  relatedPortfolioId?: string;
  relatedTicker?: string;
}

export interface WorkOrder {
  id: string; // e.g. "WORK-1042"
  title: string;
  agentId: string;
  agentName: string;
  agentBadge: string;
  agentBadgeBg: string;
  agentBadgeColor: string;
  brief: TaskBrief;
  budgetEth: number;
  budgetFormatted: string;
  status: WorkOrderStatus;
  escrow: EscrowState;
  createdAt: string;
  lastUpdated: string;
  expectedDelivery: string;
  timeline: WorkOrderTimelineEvent[];
  deliverable?: AgentDeliverable;
  userRating?: {
    overall: number;
    accuracy: number;
    evidenceQuality: number;
    timeliness: number;
    usefulness: number;
    writtenReview?: string;
    submittedAt: string;
  };
  revisionNotes?: string;
  // Agent-to-Agent future preparation fields:
  parentTaskId?: string;
  childTaskIds?: string[];
  agentDependencies?: string[];
  handoffTargetAgentId?: string;
}

export interface TaskTemplate {
  id: string;
  name: string;
  category: AgentCategory;
  recommendedAgentId: string;
  description: string;
  defaultPrompt: string;
  defaultOutput: 'Research Report' | 'Financial Model' | 'Risk Analysis' | 'Competitive Analysis' | 'Custom';
  suggestedBudgetEth: number;
  estimatedTurnaround: string;
}

export interface AgentActivityEvent {
  id: string;
  timestamp: string;
  agentId: string;
  agentName: string;
  agentBadge: string;
  workOrderId: string;
  workOrderTitle: string;
  action: string;
  actionType: 'accepted' | 'researching' | 'delivered' | 'awaiting_review' | 'paid' | 'revision';
  statusBadge: { label: string; variant: 'success' | 'warning' | 'info' | 'danger' | 'neutral' | 'sage' };
}
