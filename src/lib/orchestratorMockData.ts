import { 
  AgentWorkflow, 
  OrchestratorTemplate, 
  StandardizedAgentResult, 
  WorkflowTaskNode 
} from '@/types/orchestrator';

export const ORCHESTRATOR_TEMPLATES: OrchestratorTemplate[] = [
  {
    id: 'tmpl-private-equity-full',
    title: 'Private Company Due Diligence & Deal Evaluation',
    category: 'Private Markets',
    description: 'Comprehensive 7-agent coordinated pipeline: Public/private filing discovery, financial ratio extraction, DCF valuation, customer churn audits, downside stress testing, and IC memo synthesis.',
    defaultObjective: 'Evaluate Atlas Robotics for a potential $5M growth equity investment.',
    targetEntityType: 'Private Growth Company',
    estimatedBudgetEth: 0.38,
    estimatedDuration: '~24 mins',
    agentsRequired: [
      { agentId: 'atlas-research', role: 'Company & Founder Background Discovery', dependencies: [] },
      { agentId: 'mosaic-diligence', role: 'VDR Cap Table & Customer Cohort Audit', dependencies: ['atlas-research'] },
      { agentId: 'meridian-valuation', role: '3-Statement DCF & Peer Multiples Model', dependencies: ['mosaic-diligence'] },
      { agentId: 'vector-markets', role: 'Competitive Landscape & Moat Displacement Map', dependencies: ['atlas-research'] },
      { agentId: 'keystone-risk', role: 'Liquidity Runway & Factor Downside Simulation', dependencies: ['meridian-valuation', 'mosaic-diligence'] },
      { agentId: 'faro-synthesis', role: 'Institutional IC Memo & Conflict Resolution', dependencies: ['keystone-risk', 'vector-markets'] }
    ]
  },
  {
    id: 'tmpl-public-earnings-deep',
    title: 'Public Company Deep Research & Thesis Evaluation',
    category: 'Public Equity',
    description: 'Autonomous fundamental investigation across 10-K/Q SEC filings, executive call transcripts, dealer flow positioning, and intrinsic valuation.',
    defaultObjective: 'Conduct full multi-agent fundamental analysis on NVIDIA datacenter GPU pricing power and gross margin longevity.',
    targetEntityType: 'Public Equity',
    estimatedBudgetEth: 0.24,
    estimatedDuration: '~14 mins',
    agentsRequired: [
      { agentId: 'atlas-research', role: 'SEC 10-Q & Transcript Footnote Extraction', dependencies: [] },
      { agentId: 'signal-macro', role: 'Hyperscale Cloud Capex Trajectory Assessment', dependencies: [] },
      { agentId: 'vector-markets', role: 'Dealer Gamma Positioning & 13F Ownership Rotation', dependencies: ['atlas-research'] },
      { agentId: 'meridian-valuation', role: 'Reverse DCF & Terminal Growth Sensitivity', dependencies: ['atlas-research', 'signal-macro'] },
      { agentId: 'keystone-risk', role: 'Supply Chain Single-Point Failure & Geopolitical Shock', dependencies: ['meridian-valuation'] },
      { agentId: 'faro-synthesis', role: 'Synthesis Report & Target Valuation Range', dependencies: ['keystone-risk', 'vector-markets'] }
    ]
  },
  {
    id: 'tmpl-portfolio-multi-risk',
    title: 'Portfolio Multi-Factor Stress Test & Contagion Mapping',
    category: 'Portfolio Management',
    description: 'Coordinates macro policy modeling, factor correlation break analysis, private asset illiquidity haircutting, and redemption stress testing.',
    defaultObjective: 'Stress test the active $114.8M portfolio against a 30% tech multiple contraction coupled with a 50 bps sovereign rate spike.',
    targetEntityType: 'Active Multi-Asset Portfolio',
    estimatedBudgetEth: 0.18,
    estimatedDuration: '~8 mins',
    agentsRequired: [
      { agentId: 'signal-macro', role: 'Central Bank Rate Path & Inflation Pass-Through', dependencies: [] },
      { agentId: 'keystone-risk', role: 'Monte Carlo 10,000 Portfolio Drawdown Simulation', dependencies: ['signal-macro'] },
      { agentId: 'vector-markets', role: 'Cross-Asset Liquidity & Spread Widening Contagion', dependencies: ['signal-macro'] },
      { agentId: 'faro-synthesis', role: 'Executive Risk Audit & Rebalancing Directives', dependencies: ['keystone-risk', 'vector-markets'] }
    ]
  }
];

export const INITIAL_ORCHESTRATOR_WORKFLOWS: AgentWorkflow[] = [
  {
    id: 'WF-2050',
    title: 'Evaluate Atlas Robotics for $5.0M Growth Equity Investment',
    targetEntity: 'Atlas Robotics Inc.',
    objective: 'Evaluate Atlas Robotics as a potential $5M growth equity investment. Quantify ARR growth rate, cap table liquidation preferences, competitive defensibility against incumbent automation players, and downside bankruptcy risk.',
    mode: 'automatic',
    status: 'running',
    progressPercent: 72,
    budget: {
      totalBudgetEth: 0.40,
      totalBudgetFormatted: '0.40 ETH',
      allocatedEth: 0.38,
      allocatedFormatted: '0.38 ETH',
      spentEth: 0.22,
      spentFormatted: '0.22 ETH',
      remainingEth: 0.16,
      remainingFormatted: '0.16 ETH',
      isSimulatedDemo: true,
      warnings: []
    },
    tasks: [
      {
        id: 'TASK-1051',
        workflowId: 'WF-2050',
        childTaskIds: ['TASK-1052', 'TASK-1054'],
        title: 'Company & Founder Background Discovery',
        description: 'Audit corporate registry, founder academic IP patents, initial seed filings, and customer references.',
        agentId: 'atlas-research',
        agentName: 'Atlas Research',
        agentBadge: 'AR',
        agentBadgeBg: '#EBF2FA',
        agentBadgeColor: '#2B5C8F',
        agentCategory: 'Research',
        selectionReason: 'Highest citation accuracy score (98.6%) and public/patent registry extraction speed.',
        budgetEth: 0.08,
        budgetFormatted: '0.08 ETH',
        progressPercent: 100,
        status: 'completed',
        dependsOnTaskIds: [],
        startedAt: '09:31',
        completedAt: '09:38',
        eta: 'Completed',
        result: {
          taskId: 'TASK-1051',
          workflowId: 'WF-2050',
          agentId: 'atlas-research',
          agentName: 'Atlas Research',
          agentBadge: 'AR',
          agentBadgeBg: '#EBF2FA',
          agentBadgeColor: '#2B5C8F',
          summary: 'Atlas Robotics has demonstrated 42% YoY ARR expansion driven by automotive warehouse retrofits. Key patent portfolio confirmed valid through 2038.',
          findings: [
            {
              title: 'Revenue Trajectory & Contract Backlog',
              detail: 'Company audited ARR stands at $14.2M with a contracted multi-year backlog of $28.5M.',
              certainty: 'verified',
              evidenceIds: ['ev-wf-1']
            },
            {
              title: 'Proprietary Vision Navigation IP',
              detail: 'Holds 6 granted USPTO patents on SLAM vision guidance without needing external floor QR fiducials.',
              certainty: 'verified',
              evidenceIds: ['ev-wf-2']
            }
          ],
          evidence: [
            {
              id: 'ev-wf-1',
              claim: 'Atlas ARR reached $14.2M in Q1 2026.',
              sourceTitle: 'Atlas Robotics Q1 Management Presentation',
              sourceType: 'Cap Table',
              confidenceScore: 98,
              timestamp: 'Q1 Audit',
              snippet: 'Audited revenues confirm $14.2M annualized run-rate across 48 warehouse deployments.'
            },
            {
              id: 'ev-wf-2',
              claim: '6 core patents granted by USPTO on multi-camera SLAM.',
              sourceTitle: 'USPTO Patent Docket Records 2024-2026',
              sourceType: 'Patent',
              confidenceScore: 100,
              timestamp: 'Official Gazette',
              snippet: 'Patents US11948201B2 and US11840292B2 active in good standing without re-examination challenge.'
            }
          ],
          assumptions: [
            'Current warehouse churn remains under 3% annual based on initial cohort telemetry.'
          ],
          unknowns: [
            'International distributor margins for the upcoming European commercial rollout.'
          ],
          confidenceContext: {
            overallConfidenceScore: 96,
            dataSufficiency: 'High',
            criticalCaveats: ['Pending warranty reserve numbers for legacy generation-1 hardware units.']
          },
          recommendedNextTask: {
            taskTitle: 'VDR Cap Table & Customer Cohort Audit',
            targetSpecialization: 'Private company diligence',
            rationale: 'Pass company fundamentals to Mosaic Diligence to verify liquidation preference stack.'
          },
          timestamp: '09:38'
        }
      },
      {
        id: 'TASK-1052',
        workflowId: 'WF-2050',
        parentTaskId: 'TASK-1051',
        childTaskIds: ['TASK-1053'],
        title: 'VDR Cap Table & Customer Cohort Diligence',
        description: 'Audit Series A/B shareholders agreement, liquidation preferences, net retention curves, and customer concentration.',
        agentId: 'mosaic-diligence',
        agentName: 'Mosaic Diligence',
        agentBadge: 'MD',
        agentBadgeBg: '#FEF3EB',
        agentBadgeColor: '#A85A24',
        agentCategory: 'Due Diligence',
        selectionReason: 'Specialized in cap table waterfall reconstruction and contract footnote extraction.',
        budgetEth: 0.08,
        budgetFormatted: '0.08 ETH',
        progressPercent: 100,
        status: 'completed',
        dependsOnTaskIds: ['TASK-1051'],
        startedAt: '09:39',
        completedAt: '09:50',
        eta: 'Completed',
        result: {
          taskId: 'TASK-1052',
          workflowId: 'WF-2050',
          agentId: 'mosaic-diligence',
          agentName: 'Mosaic Diligence',
          agentBadge: 'MD',
          agentBadgeBg: '#FEF3EB',
          agentBadgeColor: '#A85A24',
          summary: 'Cap table verified. 1x non-participating preference confirmed on Series A & B. Top 3 customers account for 58% of contracted ARR.',
          findings: [
            {
              title: 'Clean Senior Liquidation Preference',
              detail: 'No senior recapitalizations or aggressive 2x participating hurdles discovered.',
              certainty: 'verified',
              evidenceIds: ['ev-wf-3']
            },
            {
              title: 'Customer Concentration Vulnerability',
              detail: 'A major tier-1 logistics customer represents 34% of active ARR. Loss of this account would impair growth rate severely.',
              certainty: 'verified',
              evidenceIds: ['ev-wf-4']
            }
          ],
          evidence: [
            {
              id: 'ev-wf-3',
              claim: 'Series B shares hold standard 1x non-participating preferred liquidation rights.',
              sourceTitle: 'Amended & Restated Certificate of Incorporation',
              sourceType: 'Cap Table',
              confidenceScore: 99,
              timestamp: 'Exhibit 3.1 VDR',
              snippet: 'Section 4(b): Holders of Series B Preferred Stock shall be entitled to receive in preference to Junior Stock an amount equal to 1.0x Original Issue Price.'
            },
            {
              id: 'ev-wf-4',
              claim: 'Customer Apex Logistics accounts for 34% of trailing 12-month ARR.',
              sourceTitle: 'SaaS Cohort & Customer Revenue Schedule',
              sourceType: 'Cap Table',
              confidenceScore: 95,
              timestamp: 'March 2026 Audit',
              snippet: 'Apex Logistics contract annual value is $4.83M of total $14.20M current run-rate.'
            }
          ],
          assumptions: [
            'Apex Logistics will exercise their 24-month contract renewal option in Q4.'
          ],
          unknowns: [
            'Whether Apex Logistics is currently trialing competing Symbotic or Boston Dynamics hardware.'
          ],
          confidenceContext: {
            overallConfidenceScore: 93,
            dataSufficiency: 'High',
            criticalCaveats: ['Top-3 concentration exceeds typical 40% prudence guideline.']
          },
          recommendedNextTask: {
            taskTitle: 'DCF & Multiples Valuation',
            targetSpecialization: 'Valuation',
            rationale: 'Pass clean ARR and margin profile to Meridian Valuation for intrinsic DCF model.'
          },
          timestamp: '09:50'
        }
      },
      {
        id: 'TASK-1053',
        workflowId: 'WF-2050',
        parentTaskId: 'TASK-1052',
        childTaskIds: ['TASK-1055'],
        title: '3-Statement DCF & Peer Multiples Model',
        description: 'Construct 5-year discounted cash flow model, analyze gross margin expansion, and benchmark peer trading multiples.',
        agentId: 'meridian-valuation',
        agentName: 'Meridian Valuation',
        agentBadge: 'MV',
        agentBadgeBg: '#F3E8FF',
        agentBadgeColor: '#7E22CE',
        agentCategory: 'Valuation',
        selectionReason: 'Specialized 3-statement financial modeling agent with automated sensitivity tables.',
        budgetEth: 0.06,
        budgetFormatted: '0.06 ETH',
        progressPercent: 100,
        status: 'completed',
        dependsOnTaskIds: ['TASK-1052'],
        startedAt: '09:51',
        completedAt: '10:01',
        eta: 'Completed',
        result: {
          taskId: 'TASK-1053',
          workflowId: 'WF-2050',
          agentId: 'meridian-valuation',
          agentName: 'Meridian Valuation',
          agentBadge: 'MV',
          agentBadgeBg: '#F3E8FF',
          agentBadgeColor: '#7E22CE',
          summary: 'Intrinsic post-money equity valuation estimated at $85M - $98M. Current round proposed at $80M pre-money represents an attractive 12% discount to intrinsic base case.',
          findings: [
            {
              title: 'DCF Valuation Range ($85M - $98M)',
              detail: 'Base case intrinsic valuation of $91.5M supported by 11.2% WACC and 3.0% terminal growth rate.',
              certainty: 'estimated',
              evidenceIds: ['ev-wf-5']
            },
            {
              title: 'Peer Trading Multiples Compression',
              detail: 'Public peer multiples in warehouse automation average 6.4x forward ARR; Atlas round priced at 5.6x forward ARR.',
              certainty: 'verified',
              evidenceIds: ['ev-wf-6']
            }
          ],
          evidence: [
            {
              id: 'ev-wf-5',
              claim: 'Intrinsic DCF model yields midpoint valuation of $91.5M.',
              sourceTitle: 'Faro DCF Sensitivity Engine (WACC 10.5% - 12.0%)',
              sourceType: 'Market Data',
              confidenceScore: 92,
              timestamp: 'Calculated Live',
              snippet: '10-year projected cash flows discounted at 11.2% cost of capital yield $91.5M equity valuation.'
            },
            {
              id: 'ev-wf-6',
              claim: 'Public comps (Symbotic, Zebra, Cognex) trade at mean 6.4x EV/ARR.',
              sourceTitle: 'Capital Markets Consensus Trading Multiples',
              sourceType: 'Market Data',
              confidenceScore: 96,
              timestamp: 'Live Market Comps',
              snippet: 'Industrial automation enterprise value to next-twelve-months revenue mean multiple is 6.4x.'
            }
          ],
          assumptions: [
            'Gross margins expand from 54% to 65% as software-as-a-service licensing mix exceeds 40% of revenue.'
          ],
          unknowns: [
            'Hardware bill-of-materials cost fluctuations in automotive-grade lidar sensors.'
          ],
          confidenceContext: {
            overallConfidenceScore: 91,
            dataSufficiency: 'Moderate',
            criticalCaveats: ['Assumes hardware gross margins do not face aggressive price slashing from Asian competitors.']
          },
          recommendedNextTask: {
            taskTitle: 'Downside Stress Test & Runway Simulation',
            targetSpecialization: 'Risk',
            rationale: 'Pass cash burn and concentration to Keystone Risk for downside simulation.'
          },
          timestamp: '10:01'
        }
      },
      {
        id: 'TASK-1054',
        workflowId: 'WF-2050',
        parentTaskId: 'TASK-1051',
        childTaskIds: ['TASK-1055'],
        title: 'Competitive Displacement Map & Market Moats',
        description: 'Benchmark Atlas against Symbotic, Locus Robotics, Boston Dynamics, and Geek+ across install base and deployment latency.',
        agentId: 'vector-markets',
        agentName: 'Vector Markets',
        agentBadge: 'VM',
        agentBadgeBg: '#E0E7FF',
        agentBadgeColor: '#4338CA',
        agentCategory: 'Competitive Intelligence',
        selectionReason: 'Specialized in cross-sector market intelligence and customer switching cost analysis.',
        budgetEth: 0.06,
        budgetFormatted: '0.06 ETH',
        progressPercent: 100,
        status: 'completed',
        dependsOnTaskIds: ['TASK-1051'],
        startedAt: '09:39',
        completedAt: '09:48',
        eta: 'Completed',
        result: {
          taskId: 'TASK-1054',
          workflowId: 'WF-2050',
          agentId: 'vector-markets',
          agentName: 'Vector Markets',
          agentBadge: 'VM',
          agentBadgeBg: '#E0E7FF',
          agentBadgeColor: '#4338CA',
          summary: 'Atlas Robotics deploys in 3 weeks vs 6-9 months for Symbotic, capturing medium-sized brownfield logistics facilities that incumbents cannot serve economically.',
          findings: [
            {
              title: 'Brownfield Advantage & Zero Infrastructure Overhaul',
              detail: 'Atlas robots operate in existing aisles without physical guide rails, lowering customer CapEx by 70%.',
              certainty: 'verified',
              evidenceIds: ['ev-wf-7']
            }
          ],
          evidence: [
            {
              id: 'ev-wf-7',
              claim: 'Deployment turnaround time verified at 18-24 calendar days.',
              sourceTitle: 'Logistics Automation Customer Case Studies',
              sourceType: 'Expert Network',
              confidenceScore: 94,
              timestamp: 'Case Study Telemetry',
              snippet: 'Average commissioning duration across 12 recent warehouse retrofits was 21 days.'
            }
          ],
          assumptions: ['Incumbents will not release brownfield SLAM software before late 2027.'],
          unknowns: ['Patents being filed by European competitors in autonomous pallet handling.'],
          confidenceContext: {
            overallConfidenceScore: 92,
            dataSufficiency: 'High',
            criticalCaveats: ['Incumbents could acquire smaller SLAM startups to bridge the agility gap.']
          },
          timestamp: '09:48'
        }
      },
      {
        id: 'TASK-1055',
        workflowId: 'WF-2050',
        parentTaskId: 'TASK-1053',
        childTaskIds: ['TASK-1056'],
        title: 'Runway Stress Simulation & Churn Downside',
        description: 'Stress test 18-month cash runway against loss of top customer (Apex Logistics) and 20% hardware cost escalation.',
        agentId: 'keystone-risk',
        agentName: 'Keystone Risk',
        agentBadge: 'KR',
        agentBadgeBg: '#EBF5F1',
        agentBadgeColor: '#2E6E56',
        agentCategory: 'Risk',
        selectionReason: 'Quantitative downside engine with factor stress test algorithms.',
        budgetEth: 0.05,
        budgetFormatted: '0.05 ETH',
        progressPercent: 70,
        status: 'running',
        dependsOnTaskIds: ['TASK-1053', 'TASK-1054'],
        startedAt: '10:02',
        eta: '~2 mins remaining'
      },
      {
        id: 'TASK-1056',
        workflowId: 'WF-2050',
        parentTaskId: 'TASK-1055',
        childTaskIds: [],
        title: 'Final Synthesis & Investment Committee Memo',
        description: 'Synthesize research, diligence, valuation, and risk results into institutional IC memo with conflict verification.',
        agentId: 'faro-synthesis',
        agentName: 'Faro Synthesis Agent',
        agentBadge: 'FS',
        agentBadgeBg: '#141618',
        agentBadgeColor: '#87BAA4',
        agentCategory: 'Research',
        selectionReason: 'Lead Faro Orchestrator intelligence engine for institutional memo generation.',
        budgetEth: 0.05,
        budgetFormatted: '0.05 ETH',
        progressPercent: 0,
        status: 'blocked',
        dependsOnTaskIds: ['TASK-1055'],
        blockedByMessage: 'Awaiting completion of Runway Stress Simulation by Keystone Risk.',
        eta: 'Queued'
      }
    ],
    dependencies: [
      { taskId: 'TASK-1052', dependsOnTaskId: 'TASK-1051', dependencyType: 'requires_output', status: 'resolved' },
      { taskId: 'TASK-1053', dependsOnTaskId: 'TASK-1052', dependencyType: 'requires_output', status: 'resolved' },
      { taskId: 'TASK-1054', dependsOnTaskId: 'TASK-1051', dependencyType: 'requires_output', status: 'resolved' },
      { taskId: 'TASK-1055', dependsOnTaskId: 'TASK-1053', dependencyType: 'requires_output', status: 'pending' },
      { taskId: 'TASK-1056', dependsOnTaskId: 'TASK-1055', dependencyType: 'requires_output', status: 'pending' }
    ],
    handoffs: [
      {
        id: 'ho-1',
        workflowId: 'WF-2050',
        fromAgentId: 'atlas-research',
        fromAgentName: 'Atlas Research',
        toAgentId: 'mosaic-diligence',
        toAgentName: 'Mosaic Diligence',
        dataSummary: 'Corporate registry verified, patent portfolio confirmed, $14.2M ARR run-rate certified.',
        resultPayload: null as any,
        status: 'delivered',
        timestamp: '09:38'
      },
      {
        id: 'ho-2',
        workflowId: 'WF-2050',
        fromAgentId: 'mosaic-diligence',
        fromAgentName: 'Mosaic Diligence',
        toAgentId: 'meridian-valuation',
        toAgentName: 'Meridian Valuation',
        dataSummary: 'Cap table waterfall cleared (1x non-participating preferred), 34% customer concentration flagged.',
        resultPayload: null as any,
        status: 'delivered',
        timestamp: '09:50'
      },
      {
        id: 'ho-3',
        workflowId: 'WF-2050',
        fromAgentId: 'meridian-valuation',
        fromAgentName: 'Meridian Valuation',
        toAgentId: 'keystone-risk',
        toAgentName: 'Keystone Risk',
        dataSummary: 'DCF model ($85M - $98M fair value) & cash burn assumptions passed to risk engine.',
        resultPayload: null as any,
        status: 'delivered',
        timestamp: '10:01'
      }
    ],
    conflicts: [
      {
        id: 'conf-1',
        workflowId: 'WF-2050',
        topic: 'Revenue Growth Durability & Churn Vulnerability',
        agentA: {
          agentId: 'atlas-research',
          agentName: 'Atlas Research',
          conclusion: 'Revenue expansion remains robust at +42% YoY with high inbound contract backlog.',
          evidenceQuote: 'Contracted multi-year backlog stands at $28.5M across active enterprise customers.',
          certainty: 'verified'
        },
        agentB: {
          agentId: 'mosaic-diligence',
          agentName: 'Mosaic Diligence',
          conclusion: 'Revenue stability is highly precarious due to 34% concentration in a single customer.',
          evidenceQuote: 'Apex Logistics represents $4.83M of total $14.2M ARR; non-renewal would halt expansion.',
          certainty: 'verified'
        },
        status: 'detected',
        resolutionNote: 'Conflict surfaced to human investment committee: recommendation to condition $5M investment on contract extension rider with Apex Logistics.'
      }
    ],
    approvalGates: [
      {
        id: 'gate-1',
        workflowId: 'WF-2050',
        gateType: 'capital_allocation_proposal',
        title: 'Authorize $5.0M Investment Term Sheet Execution',
        description: 'Faro Orchestrator recommends issuing a $5.0M Series B growth equity term sheet for Atlas Robotics at $80M pre-money valuation.',
        proposalData: {
          targetEntity: 'Atlas Robotics Inc.',
          amountFormatted: '$5,000,000',
          riskImpact: 'Moderate concentration risk (34% customer dependency); requires board seat and customer diversification covenants.',
          agentsSignedOff: ['Atlas Research', 'Mosaic Diligence', 'Meridian Valuation']
        },
        status: 'pending',
        requestedAt: '10:02'
      }
    ],
    sharedMemoryContext: [
      {
        factId: 'fact-1',
        key: 'Audited ARR',
        value: '$14.20M (Trailing 12-Month)',
        certainty: 'verified',
        originatingAgentName: 'Atlas Research',
        timestamp: '09:38'
      },
      {
        factId: 'fact-2',
        key: 'Active Patent Portfolio',
        value: '6 Granted USPTO SLAM Patents without challenge',
        certainty: 'verified',
        originatingAgentName: 'Atlas Research',
        timestamp: '09:38'
      },
      {
        factId: 'fact-3',
        key: 'Liquidation Seniority',
        value: 'Series B 1x Non-Participating Preferred',
        certainty: 'verified',
        originatingAgentName: 'Mosaic Diligence',
        timestamp: '09:50'
      },
      {
        factId: 'fact-4',
        key: 'Top Customer Share',
        value: '34.0% Apex Logistics concentration',
        certainty: 'verified',
        originatingAgentName: 'Mosaic Diligence',
        timestamp: '09:50'
      },
      {
        factId: 'fact-5',
        key: 'Intrinsic DCF Fair Value',
        value: '$85.0M - $98.0M ($91.5M base case)',
        certainty: 'estimated',
        originatingAgentName: 'Meridian Valuation',
        timestamp: '10:01'
      }
    ],
    events: [
      { id: 'evt-1', timestamp: '09:31', timeOffset: '35m ago', actor: 'Faro Orchestrator', action: 'Created workflow plan & resolved agent dependencies', type: 'planning' },
      { id: 'evt-2', timestamp: '09:31', timeOffset: '35m ago', actor: 'Atlas Research', action: 'Assigned to Company & Founder Background Discovery (0.08 ETH)', type: 'dispatch' },
      { id: 'evt-3', timestamp: '09:38', timeOffset: '28m ago', actor: 'Atlas Research', action: 'Completed background task with 2 verified citations', type: 'milestone' },
      { id: 'evt-4', timestamp: '09:38', timeOffset: '28m ago', actor: 'Atlas Research', action: 'Initiated Agent Handoff to Mosaic Diligence', type: 'handoff' },
      { id: 'evt-5', timestamp: '09:50', timeOffset: '16m ago', actor: 'Mosaic Diligence', action: 'Completed Cap Table Diligence — Flagged 34% Apex customer concentration', type: 'milestone' },
      { id: 'evt-6', timestamp: '09:50', timeOffset: '16m ago', actor: 'Faro Conflict Engine', action: 'Conflict detected between Atlas Research (Backlog) & Mosaic Diligence (Concentration)', type: 'conflict' },
      { id: 'evt-7', timestamp: '10:01', timeOffset: '5m ago', actor: 'Meridian Valuation', action: 'Delivered 3-Statement DCF Model ($85M - $98M fair value)', type: 'milestone' },
      { id: 'evt-8', timestamp: '10:02', timeOffset: '4m ago', actor: 'Faro Orchestrator', action: 'Triggered Human Approval Gate: $5.0M Investment Term Sheet Execution', type: 'gate' },
      { id: 'evt-9', timestamp: '10:02', timeOffset: '4m ago', actor: 'Keystone Risk', action: 'Dispatched to Runway Stress Simulation & Churn Downside (0.05 ETH)', type: 'dispatch' }
    ],
    createdAt: '09:31 AM'
  }
];
