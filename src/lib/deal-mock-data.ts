import { 
  Deal, DealTerm, DueDiligenceCategory, CapTable, 
  DealRisk, ICReview, DealDocument, DealActivity, InvestmentMemo 
} from '@/types/deal';

// ============================================================
// DEMO DATA - DEAL PIPELINE
// ============================================================
export const DEMO_DEALS: Deal[] = [
  {
    id: 'deal-atlas-robotics',
    companyId: 'comp-atlas-robotics',
    companyName: 'Atlas Robotics',
    industry: 'AI Robotics',
    dealType: 'Venture Capital',
    stage: 'screening',
    status: 'active',
    roundSize: 8000000,
    valuation: 40000000, // Post-Money
    location: 'San Francisco, CA',
    owner: 'Sarah Chen',
    riskStatus: 'moderate',
    lastActivityDate: '2026-09-27',
    createdAt: '2026-09-20',
    description: 'Developing next-generation autonomous humanoid robots for industrial applications.',
    website: 'atlasrobotics.demo',
    revenue: 500000,
    revenueGrowth: 300,
    grossMargin: 45,
    burn: 350000,
    runwayMonths: 9,
    fundingRaised: 3000000
  },
  {
    id: 'deal-novagrid',
    companyId: 'comp-novagrid',
    companyName: 'NovaGrid',
    industry: 'Energy Infrastructure',
    dealType: 'Growth Equity',
    stage: 'diligence',
    status: 'active',
    roundSize: 20000000,
    valuation: 120000000,
    location: 'Austin, TX',
    owner: 'Michael Chang',
    riskStatus: 'low',
    lastActivityDate: '2026-09-28',
    createdAt: '2026-09-10',
    description: 'Smart grid optimization software utilizing edge AI to predict and manage load.',
    revenue: 8500000,
    revenueGrowth: 110,
    grossMargin: 78,
    burn: 600000,
    runwayMonths: 14,
    fundingRaised: 18000000
  },
  {
    id: 'deal-helixbio',
    companyId: 'comp-helixbio',
    companyName: 'HelixBio',
    industry: 'Biotechnology',
    dealType: 'Venture Capital',
    stage: 'ic_review',
    status: 'active',
    roundSize: 12000000,
    valuation: 60000000,
    location: 'Boston, MA',
    owner: 'Elena Rodriguez',
    riskStatus: 'high',
    lastActivityDate: '2026-09-29',
    createdAt: '2026-08-15',
    description: 'CRISPR-based therapeutics targeting rare genetic autoimmune disorders.',
    revenue: 0,
    revenueGrowth: 0,
    grossMargin: 0,
    burn: 800000,
    runwayMonths: 8,
    fundingRaised: 7000000
  }
];

export const DEMO_DEAL_TERMS: Record<string, DealTerm> = {
  'deal-novagrid': {
    investmentAmount: 10000000, // We are taking half the round
    preMoneyValuation: 100000000,
    postMoneyValuation: 120000000,
    ownershipPercent: 8.33,
    liquidationPreference: '1x Non-Participating',
    antiDilution: 'Broad-based Weighted Average',
    boardRights: '1 Seat',
    proRataRights: 'Yes',
    optionPoolPercent: 12,
    debtAmount: 0
  }
};

export const DEMO_CAP_TABLES: Record<string, CapTable> = {
  'deal-novagrid': {
    dealId: 'deal-novagrid',
    totalShares: 10000000,
    shareholders: [
      { id: 'sh-1', name: 'Founders', type: 'founder', shares: 5500000, ownershipPercent: 55, shareClass: 'common' },
      { id: 'sh-2', name: 'Seed Investors', type: 'investor', shares: 2000000, ownershipPercent: 20, shareClass: 'preferred' },
      { id: 'sh-3', name: 'Series A Investors', type: 'investor', shares: 1500000, ownershipPercent: 15, shareClass: 'preferred' },
      { id: 'sh-4', name: 'Employee Option Pool', type: 'employee_pool', shares: 1000000, ownershipPercent: 10, shareClass: 'options' }
    ]
  }
};

export const DEMO_DUE_DILIGENCE: Record<string, DueDiligenceCategory[]> = {
  'deal-novagrid': [
    {
      id: 'dd-fin-1',
      type: 'financial',
      title: 'Financial',
      status: 'complete',
      items: [
        { id: 'f-1', task: 'Revenue verified', isComplete: true, isFlagged: false },
        { id: 'f-2', task: 'Gross margin verified', isComplete: true, isFlagged: false },
        { id: 'f-3', task: 'Cash position verified', isComplete: true, isFlagged: false },
        { id: 'f-4', task: 'Debt verified', isComplete: true, isFlagged: false },
        { id: 'f-5', task: 'Customer concentration reviewed', isComplete: true, isFlagged: true, notes: 'Top 3 customers make up 42% of ARR' },
        { id: 'f-6', task: 'Revenue recognition reviewed', isComplete: true, isFlagged: false }
      ],
      findings: [
        {
          id: 'find-1',
          finding: 'Customer concentration appears elevated.',
          evidence: 'Top 3 customers account for 42% of total ARR. Largest customer (Texas Power) is 18%.',
          evidenceSource: 'Company-provided ARR schedule (Aug 2026)',
          status: 'verified',
          isDemo: true
        }
      ],
      openQuestions: [
        'What are the renewal dates for the top 3 customers?'
      ]
    },
    {
      id: 'dd-com-1',
      type: 'commercial',
      title: 'Commercial',
      status: 'in_progress',
      items: [
        { id: 'c-1', task: 'Market size analysis', isComplete: true, isFlagged: false },
        { id: 'c-2', task: 'Competitive landscape mapping', isComplete: true, isFlagged: false },
        { id: 'c-3', task: 'Customer reference calls (5)', isComplete: false, isFlagged: false }
      ],
      findings: [],
      openQuestions: []
    }
  ]
};

export const DEMO_DEAL_DOCUMENTS: Record<string, DealDocument[]> = {
  'deal-novagrid': [
    { id: 'doc-1', dealId: 'deal-novagrid', filename: 'NovaGrid_Q2_2026_Financials.xlsx', category: 'financial', uploadedBy: 'Michael Chang', uploadDate: '2026-09-15', status: 'reviewed', isDemo: true },
    { id: 'doc-2', dealId: 'deal-novagrid', filename: 'NovaGrid_PitchDeck_SeriesB.pdf', category: 'pitch_deck', uploadedBy: 'Michael Chang', uploadDate: '2026-09-10', status: 'reviewed', isDemo: true },
    { id: 'doc-3', dealId: 'deal-novagrid', filename: 'Customer_Contracts_Top5.zip', category: 'contract', uploadedBy: 'Michael Chang', uploadDate: '2026-09-20', status: 'processing', isDemo: true },
    { id: 'doc-4', dealId: 'deal-novagrid', filename: 'CapTable_Current_Draft.xlsx', category: 'cap_table', uploadedBy: 'Michael Chang', uploadDate: '2026-09-15', status: 'reviewed', isDemo: true }
  ]
};

export const DEMO_DEAL_RISKS: Record<string, DealRisk[]> = {
  'deal-novagrid': [
    {
      id: 'risk-1',
      type: 'concentration',
      title: 'Customer Concentration',
      description: 'High reliance on a small number of early enterprise grid partners.',
      evidence: 'Top 3 clients = 42% ARR.',
      assumption: 'Assumes renewal of Texas Power contract in Q4.',
      potentialImpact: 'high',
      openQuestions: ['Status of Texas Power renewal negotiations?']
    },
    {
      id: 'risk-2',
      type: 'market',
      title: 'Sales Cycle Length',
      description: 'Utility software procurement is notoriously slow.',
      evidence: 'Average sales cycle in historical data is 14 months.',
      assumption: 'Series B runway assumes 12-month sales cycles.',
      potentialImpact: 'moderate',
      openQuestions: []
    }
  ]
};

export const DEMO_IC_REVIEWS: Record<string, ICReview> = {
  'deal-helixbio': {
    dealId: 'deal-helixbio',
    status: 'under_review',
    investmentThesis: [
      'Breakthrough CRISPR delivery mechanism validated in mice models.',
      'World-class founding team from Broad Institute.',
      'First indication target has no current cure and fast-track FDA potential.'
    ],
    counterThesis: [
      'Pre-clinical stage means significant binary biological risk.',
      'Requires substantial future capital (est. $40M+) to reach Phase II.',
      'IP landscape in CRISPR delivery remains highly contested.'
    ],
    financialAnalysisSummary: 'Pre-revenue. $800k monthly burn. Raising $12M provides ~15 months of runway, extending through IND filing.',
    valuationSummary: '$60M post-money is slightly elevated for pre-clinical, but justified by platform potential.',
    keyRisks: ['Binary biological risk', 'IP litigation risk', 'Future financing risk'],
    diligenceSummary: 'Scientific diligence confirms delivery mechanism novelty. IP counsel reviewing freedom to operate.',
    openQuestions: ['Can they achieve IND filing within 12 months?', 'What is the backup indication?'],
    dealTermsSummary: 'Standard Series A. 1x non-participating. Broad-based anti-dilution.'
  }
};

export const DEMO_DEAL_ACTIVITIES: Record<string, DealActivity[]> = {
  'deal-novagrid': [
    { id: 'act-6', dealId: 'deal-novagrid', date: '2026-09-28', title: 'Customer references requested', description: 'Asked founders for 5 references.', type: 'diligence_update' },
    { id: 'act-5', dealId: 'deal-novagrid', date: '2026-09-25', title: 'Financial diligence completed', description: 'Revenue verified. Concentration risk noted.', type: 'diligence_update' },
    { id: 'act-4', dealId: 'deal-novagrid', date: '2026-09-20', title: 'Contracts uploaded', description: 'Top 5 customer contracts added to data room.', type: 'document_uploaded' },
    { id: 'act-3', dealId: 'deal-novagrid', date: '2026-09-15', title: 'Moved to Diligence', description: 'IC approved moving to deep diligence phase.', type: 'stage_change' },
    { id: 'act-2', dealId: 'deal-novagrid', date: '2026-09-12', title: 'Management Meeting', description: 'Met with CEO and CTO. Very impressed with technical vision.', type: 'note_added' },
    { id: 'act-1', dealId: 'deal-novagrid', date: '2026-09-10', title: 'Deal created', description: 'Added from outbound sourcing.', type: 'stage_change' }
  ]
};
