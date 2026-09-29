export type DealStage = 
  | 'sourced' 
  | 'screening' 
  | 'research' 
  | 'diligence' 
  | 'ic_review' 
  | 'negotiation' 
  | 'closed' 
  | 'passed';

export type DealStatus = 'active' | 'won' | 'lost' | 'on_hold';

export interface Deal {
  id: string;
  companyId: string;
  companyName: string;
  industry: string;
  dealType: string;
  stage: DealStage;
  status: DealStatus;
  roundSize: number;
  valuation: number;
  location: string;
  owner: string;
  riskStatus: 'low' | 'moderate' | 'high' | 'critical';
  lastActivityDate: string;
  createdAt: string;
  description: string;
  website?: string;
  revenue?: number;
  revenueGrowth?: number;
  grossMargin?: number;
  burn?: number;
  runwayMonths?: number;
  fundingRaised?: number;
}

export interface DealTerm {
  investmentAmount: number;
  preMoneyValuation: number;
  postMoneyValuation: number;
  ownershipPercent: number;
  liquidationPreference: string;
  antiDilution: string;
  boardRights: string;
  proRataRights: string;
  optionPoolPercent: number;
  debtAmount: number;
}

export type DueDiligenceCategoryType = 
  | 'financial' 
  | 'commercial' 
  | 'market' 
  | 'product' 
  | 'technology' 
  | 'legal' 
  | 'management' 
  | 'operations' 
  | 'cybersecurity' 
  | 'regulatory';

export type DueDiligenceStatus = 'not_started' | 'in_progress' | 'needs_review' | 'complete';

export interface DueDiligenceItem {
  id: string;
  task: string;
  isComplete: boolean;
  isFlagged: boolean;
  notes?: string;
}

export interface DiligenceFinding {
  id: string;
  finding: string;
  evidence: string;
  evidenceSource: string;
  status: 'verified' | 'estimated' | 'unverified' | 'unavailable';
  isDemo?: boolean;
}

export interface DueDiligenceCategory {
  id: string;
  type: DueDiligenceCategoryType;
  title: string;
  status: DueDiligenceStatus;
  items: DueDiligenceItem[];
  findings: DiligenceFinding[];
  openQuestions: string[];
}

export type DocumentCategory = 
  | 'financial' 
  | 'contract' 
  | 'cap_table' 
  | 'pitch_deck' 
  | 'customer_data' 
  | 'legal' 
  | 'ip' 
  | 'employment' 
  | 'compliance' 
  | 'other';

export type DocumentStatus = 'uploaded' | 'processing' | 'reviewed' | 'flagged';

export interface DealDocument {
  id: string;
  dealId: string;
  filename: string;
  category: DocumentCategory;
  uploadedBy: string;
  uploadDate: string;
  status: DocumentStatus;
  isDemo?: boolean;
}

export interface Shareholder {
  id: string;
  name: string;
  type: 'founder' | 'investor' | 'employee_pool' | 'other';
  shares: number;
  ownershipPercent: number;
  shareClass: 'common' | 'preferred' | 'options';
}

export interface CapTable {
  dealId: string;
  totalShares: number;
  shareholders: Shareholder[];
}

export type RiskType = 
  | 'financial' 
  | 'market' 
  | 'execution' 
  | 'technology' 
  | 'regulatory' 
  | 'concentration' 
  | 'liquidity' 
  | 'valuation';

export interface DealRisk {
  id: string;
  type: RiskType;
  title: string;
  description: string;
  evidence: string;
  assumption: string;
  potentialImpact: 'low' | 'moderate' | 'high' | 'critical';
  openQuestions: string[];
}

export type ICDecisionStatus = 'pending' | 'under_review' | 'approved' | 'rejected' | 'deferred';

export interface ICReview {
  dealId: string;
  status: ICDecisionStatus;
  investmentThesis: string[];
  counterThesis: string[];
  financialAnalysisSummary: string;
  valuationSummary: string;
  keyRisks: string[];
  diligenceSummary: string;
  openQuestions: string[];
  dealTermsSummary: string;
}

export interface InvestmentMemo {
  id: string;
  dealId: string;
  title: string;
  createdAt: string;
  lastUpdated: string;
  content: {
    executiveSummary: string;
    company: string;
    market: string;
    businessModel: string;
    financials: string;
    growth: string;
    competition: string;
    valuation: string;
    dealTerms: string;
    investmentThesis: string;
    counterThesis: string;
    risks: string;
    dueDiligenceFindings: string;
    openQuestions: string;
    scenarioAnalysis: string;
    evidence: string;
  };
}

export interface DealActivity {
  id: string;
  dealId: string;
  date: string;
  title: string;
  description: string;
  type: 'stage_change' | 'document_uploaded' | 'diligence_update' | 'note_added' | 'ic_update';
}
