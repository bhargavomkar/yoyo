import { 
  MarketplaceAgent, 
  WorkOrder, 
  TaskTemplate, 
  AgentActivityEvent, 
  AgentCategory,
  WorkOrderStatus,
  TaskBrief,
  AgentDeliverable
} from '@/types/agentMarketplace';

export const DEMO_MARKETPLACE_AGENTS: MarketplaceAgent[] = [
  {
    id: 'atlas-research',
    name: 'Atlas Research',
    badge: 'AR',
    badgeBg: '#EBF2FA',
    badgeColor: '#2B5C8F',
    category: 'Research',
    specialization: 'Public markets & earnings',
    rating: 4.9,
    completedTasks: 128,
    successRate: 99.2,
    availability: 'available',
    pricing: {
      model: 'Fixed Price',
      baseEthPrice: 0.04,
      startingPriceFormatted: '0.04 ETH',
      hourlyRate: '0.02 ETH / hr',
      notes: 'Includes full SEC 10-K/Q analysis and earnings call transcripts synthesis.'
    },
    about: 'Autonomous institutional research intelligence specializing in public equity fundamentals, earnings call variance, and SEC footnote auditing.',
    capabilities: [
      'SEC filing diff & footnote extraction',
      'Real-time earnings call sentiment parsing',
      'Consensus estimate variance models',
      'Transcript executive tone telemetry',
      'Market mapping & competitive positioning'
    ],
    latency: '~4 mins per brief',
    model: 'Faro-Titan-Financial-v3',
    activeOrders: 4,
    performance: {
      tasksCompleted: 128,
      successRate: 99.2,
      averageRating: 4.9,
      averageCompletionTime: '4.2 mins',
      monthlyVelocity: [18, 24, 29, 36, 42, 51],
      accuracyScore: 98.6,
      timelinessScore: 99.4,
      isDemoData: true
    },
    reviews: [
      {
        id: 'rev-1',
        agentId: 'atlas-research',
        userName: 'Julian K.',
        userRole: 'Managing Director, Aether Capital',
        rating: 5,
        accuracy: 5,
        evidenceQuality: 5,
        timeliness: 5,
        usefulness: 5,
        comment: 'Atlas mapped NVIDIA and AMD datacenter margin variances within 4 minutes. Cited exact 10-K inventory write-down footnotes.',
        date: '3 days ago',
        verifiedWorkOrderId: 'WORK-1038'
      },
      {
        id: 'rev-2',
        agentId: 'atlas-research',
        userName: 'Helena V.',
        userRole: 'Partner, Alpine Global',
        rating: 4.8,
        accuracy: 5,
        evidenceQuality: 4.8,
        timeliness: 5,
        usefulness: 4.8,
        comment: 'Extremely fast turn-around on hyperscale capex forecasts. Every claim came with a direct quote and SEC filing hyperlink.',
        date: '1 week ago',
        verifiedWorkOrderId: 'WORK-1029'
      }
    ],
    recentDeliverableTitles: [
      'NVIDIA vs AMD Datacenter GPU Margin Sensitivity Q2 2026',
      'Microsoft Azure Capex & Custom Silicon Depreciation Cycle',
      'Broadcom Custom ASIC Hyperscale Pipeline Assessment'
    ],
    isDemoAgent: true
  },
  {
    id: 'mosaic-diligence',
    name: 'Mosaic Diligence',
    badge: 'MD',
    badgeBg: '#FEF3EB',
    badgeColor: '#A85A24',
    category: 'Due Diligence',
    specialization: 'Private company diligence',
    rating: 4.8,
    completedTasks: 76,
    successRate: 97.4,
    availability: 'available',
    pricing: {
      model: 'Fixed Price',
      baseEthPrice: 0.08,
      startingPriceFormatted: '0.08 ETH',
      hourlyRate: '0.04 ETH / hr',
      notes: 'Full data room audit, cap table waterfall reconstruction, and cohort retention curve fitting.'
    },
    about: 'Private market intelligence analyst. Parses confidential data rooms, verifies cap table liquidation preferences, and audits cohort expansion.',
    capabilities: [
      'Cap table waterfall & dilution modeling',
      'SaaS cohort retention curve fitting',
      'Technical patent & IP infringement screening',
      'Competitive landscape displacement map',
      'Founder background & litigation background check'
    ],
    latency: '~12 mins per brief',
    model: 'Faro-PrivateMarkets-v4',
    activeOrders: 2,
    performance: {
      tasksCompleted: 76,
      successRate: 97.4,
      averageRating: 4.8,
      averageCompletionTime: '11.8 mins',
      monthlyVelocity: [8, 12, 14, 18, 22, 28],
      accuracyScore: 97.1,
      timelinessScore: 98.0,
      isDemoData: true
    },
    reviews: [
      {
        id: 'rev-3',
        agentId: 'mosaic-diligence',
        userName: 'David Vance',
        userRole: 'Principal, Horizon Growth',
        rating: 5,
        accuracy: 5,
        evidenceQuality: 5,
        timeliness: 4.8,
        usefulness: 5,
        comment: 'Spotted a 2x participating preferred clause buried on page 84 of the Series B shareholders agreement. Saved us millions in term negotiation.',
        date: '2 weeks ago',
        verifiedWorkOrderId: 'WORK-1018'
      }
    ],
    recentDeliverableTitles: [
      'Helsing Defense NATO Procurement Pipeline & Cap Table Dilution',
      'CoreWeave Secondary Allocation & Hyperscale Backstop Diligence',
      'Mistral AI Sovereign Enterprise Licensing Model Audit'
    ],
    isDemoAgent: true
  },
  {
    id: 'keystone-risk',
    name: 'Keystone Risk',
    badge: 'KR',
    badgeBg: '#EBF5F1',
    badgeColor: '#2E6E56',
    category: 'Risk',
    specialization: 'Portfolio stress testing',
    rating: 5.0,
    completedTasks: 54,
    successRate: 100,
    availability: 'available',
    pricing: {
      model: 'Fixed Price',
      baseEthPrice: 0.03,
      startingPriceFormatted: '0.03 ETH',
      hourlyRate: '0.015 ETH / hr',
      notes: 'Monte Carlo simulations (10,000 runs) and geopolitical factor shock tests.'
    },
    about: 'Quantitative risk and portfolio stress-testing agent. Models macro shocks, factor correlation breakdowns, and liquidity drawdown horizons.',
    capabilities: [
      'Macro shock Monte Carlo simulations',
      'Geopolitical supply chain single-point failure audit',
      'Liquidity horizon & redemption stress testing',
      'Factor correlation matrix shifts',
      'Value at Risk (VaR 95% & 99%) multi-asset modeling'
    ],
    latency: '~2 mins per brief',
    model: 'Faro-RiskEngine-v2',
    activeOrders: 1,
    performance: {
      tasksCompleted: 54,
      successRate: 100,
      averageRating: 5.0,
      averageCompletionTime: '2.1 mins',
      monthlyVelocity: [6, 9, 11, 14, 19, 24],
      accuracyScore: 99.8,
      timelinessScore: 100,
      isDemoData: true
    },
    reviews: [
      {
        id: 'rev-4',
        agentId: 'keystone-risk',
        userName: 'Siddharth M.',
        userRole: 'Chief Risk Officer, Meridian Asset Management',
        rating: 5,
        accuracy: 5,
        evidenceQuality: 5,
        timeliness: 5,
        usefulness: 5,
        comment: 'Flawless portfolio stress test during the April rate scare. Highlighted our 31.5% semiconductor single-factor concentration risk immediately.',
        date: '5 days ago',
        verifiedWorkOrderId: 'WORK-1035'
      }
    ],
    recentDeliverableTitles: [
      'Semiconductor Foundry Taiwan Strait Disruption Downside Analysis',
      'Multi-Asset Fund 2026 Stagflation & Sovereign Yield Curve Shock',
      'Private Credit Default Spread Contagion Matrix'
    ],
    isDemoAgent: true
  },
  {
    id: 'meridian-valuation',
    name: 'Meridian Valuation',
    badge: 'MV',
    badgeBg: '#F3E8FF',
    badgeColor: '#7E22CE',
    category: 'Valuation',
    specialization: 'DCF & Multiples modeling',
    rating: 4.8,
    completedTasks: 62,
    successRate: 98.4,
    availability: 'available',
    pricing: {
      model: 'Fixed Price',
      baseEthPrice: 0.05,
      startingPriceFormatted: '0.05 ETH',
      hourlyRate: '0.025 ETH / hr',
      notes: 'Interactive dynamic 3-statement financial model and sensitivity matrix generation.'
    },
    about: 'Institutional valuation agent constructing DCF, comparable public trading multiples, precedent transactions, and LBO returns models.',
    capabilities: [
      '3-Statement DCF valuation models',
      'Comparable company public trading comps',
      'Precedent M&A transaction benchmarking',
      'WACC & Cost of Capital sensitivity tables',
      'LBO return threshold & debt capacity analysis'
    ],
    latency: '~6 mins per brief',
    model: 'Faro-Valuation-v2.5',
    activeOrders: 3,
    performance: {
      tasksCompleted: 62,
      successRate: 98.4,
      averageRating: 4.8,
      averageCompletionTime: '5.9 mins',
      monthlyVelocity: [7, 10, 15, 18, 23, 29],
      accuracyScore: 98.1,
      timelinessScore: 97.9,
      isDemoData: true
    },
    reviews: [
      {
        id: 'rev-5',
        agentId: 'meridian-valuation',
        userName: 'Chloe Bennett',
        userRole: 'VP Private Equity, Oakline Partners',
        rating: 4.9,
        accuracy: 5,
        evidenceQuality: 4.8,
        timeliness: 4.9,
        usefulness: 5,
        comment: 'Exported a flawless DCF sensitivity grid with revenue growth rates vs WACC. Saved my team 12 hours of manual Excel modeling.',
        date: '4 days ago',
        verifiedWorkOrderId: 'WORK-1033'
      }
    ],
    recentDeliverableTitles: [
      'Datacenter Infrastructure DCF & Capex Depreciation Sensitivity',
      'European Defense Tech Multiples & Sovereign Re-rating Benchmark',
      'CoreWeave Series C Post-Money Waterfall & Dilution Grid'
    ],
    isDemoAgent: true
  },
  {
    id: 'signal-macro',
    name: 'Signal Macro',
    badge: 'SM',
    badgeBg: '#FEF9C3',
    badgeColor: '#A16207',
    category: 'Macro',
    specialization: 'Central bank & rate policy',
    rating: 4.7,
    completedTasks: 89,
    successRate: 96.6,
    availability: 'available',
    pricing: {
      model: 'Fixed Price',
      baseEthPrice: 0.035,
      startingPriceFormatted: '0.035 ETH',
      hourlyRate: '0.018 ETH / hr',
      notes: 'Global macro tracker covering FOMC, ECB, BOJ, and treasury yield curve shifts.'
    },
    about: 'Global macroeconomic tracking intelligence. Synthesizes central bank communications, interest rate expectations, inflation telemetry, and sovereign bond spreads.',
    capabilities: [
      'FOMC & ECB statement NLP word diffing',
      'Yield curve inversion & steepening monitors',
      'Global liquidity & M2 velocity tracker',
      'Commodity price shock inflation passthrough',
      'FX cross-currency swap basis monitors'
    ],
    latency: '~3 mins per brief',
    model: 'Faro-MacroPulse-v3',
    activeOrders: 2,
    performance: {
      tasksCompleted: 89,
      successRate: 96.6,
      averageRating: 4.7,
      averageCompletionTime: '3.2 mins',
      monthlyVelocity: [12, 15, 20, 24, 30, 36],
      accuracyScore: 96.8,
      timelinessScore: 98.5,
      isDemoData: true
    },
    reviews: [
      {
        id: 'rev-6',
        agentId: 'signal-macro',
        userName: 'Alistair Ross',
        userRole: 'Macro Portfolio Manager, Solon Capital',
        rating: 4.8,
        accuracy: 4.8,
        evidenceQuality: 5,
        timeliness: 5,
        usefulness: 4.7,
        comment: 'Provides instant diffing of FOMC meeting minutes with dot plot revisions. Clear probabilistic rate path distribution.',
        date: '1 week ago',
        verifiedWorkOrderId: 'WORK-1022'
      }
    ],
    recentDeliverableTitles: [
      'Federal Reserve Dot Plot Trajectory & Terminal Rate Scenarios',
      'European Central Bank Sovereign Bond Spread Widening Risk',
      'US Treasury Issuance Schedule & Money Market Liquidity Drain'
    ],
    isDemoAgent: true
  },
  {
    id: 'vector-markets',
    name: 'Vector Markets',
    badge: 'VM',
    badgeBg: '#E0E7FF',
    badgeColor: '#4338CA',
    category: 'Markets',
    specialization: 'Cross-asset liquidity & flow',
    rating: 4.9,
    completedTasks: 114,
    successRate: 98.9,
    availability: 'busy',
    pricing: {
      model: 'Fixed Price',
      baseEthPrice: 0.045,
      startingPriceFormatted: '0.045 ETH',
      hourlyRate: '0.022 ETH / hr',
      notes: 'Institutional order flow parsing, dark pool liquidity metrics, and gamma positioning.'
    },
    about: 'Capital markets telemetry analyst tracking institutional fund flows, dealer gamma positioning, index rebalancing, and dark pool block trades.',
    capabilities: [
      'Options dealer gamma exposure (GEX) mapping',
      '13F institutional hedge fund positioning diff',
      'Dark pool volume & block trade anomaly detection',
      'ETF creation/redemption arbitrage flow tracker',
      'Short interest squeeze probability screening'
    ],
    latency: '~5 mins per brief',
    model: 'Faro-FlowVectors-v2',
    activeOrders: 5,
    performance: {
      tasksCompleted: 114,
      successRate: 98.9,
      averageRating: 4.9,
      averageCompletionTime: '4.8 mins',
      monthlyVelocity: [15, 21, 26, 32, 40, 48],
      accuracyScore: 98.8,
      timelinessScore: 99.1,
      isDemoData: true
    },
    reviews: [
      {
        id: 'rev-7',
        agentId: 'vector-markets',
        userName: 'Karen Wu',
        userRole: 'Head of Quantitative Execution, Citadel Horizon',
        rating: 5,
        accuracy: 5,
        evidenceQuality: 5,
        timeliness: 4.9,
        usefulness: 5,
        comment: 'Vector Markets spotted negative dealer gamma pin ahead of OPEX with astonishing precision. An essential execution overlay.',
        date: '3 days ago',
        verifiedWorkOrderId: 'WORK-1036'
      }
    ],
    recentDeliverableTitles: [
      'SPX & NDX Monthly OPEX Dealer Gamma Inversion Thresholds',
      'Mega-Cap Tech Institutional 13F Ownership Rotation Trends',
      'VIX Term Structure Inversion & Systemic De-leveraging Signals'
    ],
    isDemoAgent: true
  }
];

export const DEMO_TASK_TEMPLATES: TaskTemplate[] = [
  {
    id: 'tmpl-earnings',
    name: 'Public Company Earnings Analysis',
    category: 'Research',
    recommendedAgentId: 'atlas-research',
    description: 'Detailed revenue beat/miss, segment margins, executive transcript tone, and guidance changes from latest 10-Q/10-K.',
    defaultPrompt: 'Analyze the latest earnings report for [Company / Ticker]. Break down segment revenue growth, gross margins, management commentary on compute spending, and quantify any variance versus consensus estimates.',
    defaultOutput: 'Research Report',
    suggestedBudgetEth: 0.04,
    estimatedTurnaround: '~4 mins'
  },
  {
    id: 'tmpl-due-diligence',
    name: 'Private Company Due Diligence',
    category: 'Due Diligence',
    recommendedAgentId: 'mosaic-diligence',
    description: 'Cap table liquidation waterfall, historical revenue cohorts, customer concentration, and legal risk audit.',
    defaultPrompt: 'Perform full diligence on [Company Name]. Evaluate their revenue model, net retention rate, customer concentration risk, cap table liquidation preferences, and IP defensibility against major incumbents.',
    defaultOutput: 'Research Report',
    suggestedBudgetEth: 0.08,
    estimatedTurnaround: '~12 mins'
  },
  {
    id: 'tmpl-competitive-landscape',
    name: 'Competitive Landscape & Market Map',
    category: 'Competitive Intelligence',
    recommendedAgentId: 'atlas-research',
    description: 'Comprehensive mapping of incumbents, challengers, unit economics, pricing models, and technological moats.',
    defaultPrompt: 'Map the competitive landscape in [Sector / Sub-industry]. Compare the leading 5 players across pricing, proprietary architecture, customer switching costs, and market share trajectories over the past 24 months.',
    defaultOutput: 'Competitive Analysis',
    suggestedBudgetEth: 0.04,
    estimatedTurnaround: '~5 mins'
  },
  {
    id: 'tmpl-stress-test',
    name: 'Portfolio Stress Test',
    category: 'Risk',
    recommendedAgentId: 'keystone-risk',
    description: 'Multi-factor downside simulation against interest rate spikes, semiconductor export bans, or tech sector re-rating.',
    defaultPrompt: 'Stress test the portfolio against a 30% technology sector multiple contraction coupled with a 50 bps sovereign rate spike. Quantify estimated drawdown, liquidity redemption capacity, and top vulnerable holdings.',
    defaultOutput: 'Risk Analysis',
    suggestedBudgetEth: 0.03,
    estimatedTurnaround: '~2 mins'
  },
  {
    id: 'tmpl-dcf',
    name: 'DCF & Multiples Valuation',
    category: 'Valuation',
    recommendedAgentId: 'meridian-valuation',
    description: 'Intrinsic 10-year discounted cash flow model with WACC sensitivity table and peer multiples benchmark.',
    defaultPrompt: 'Build an intrinsic DCF valuation model for [Target Asset]. Model base, bull, and bear revenue trajectories, terminal growth rate assumptions between 2.5% and 3.5%, and sensitivity to WACC variations.',
    defaultOutput: 'Financial Model',
    suggestedBudgetEth: 0.05,
    estimatedTurnaround: '~6 mins'
  },
  {
    id: 'tmpl-macro-rate',
    name: 'Central Bank Rate Policy Forecast',
    category: 'Macro',
    recommendedAgentId: 'signal-macro',
    description: 'FOMC/ECB policy outlook, forward rate curves, balance sheet runoff velocity, and inflation breakevens.',
    defaultPrompt: 'Synthesize the latest FOMC meeting minutes, dot plot revisions, and US core CPI release. Model probabilistic scenarios for interest rate paths over the next 4 quarters and assess impacts on risk assets.',
    defaultOutput: 'Research Report',
    suggestedBudgetEth: 0.035,
    estimatedTurnaround: '~3 mins'
  }
];

export const INITIAL_WORK_ORDERS: WorkOrder[] = [
  {
    id: 'WORK-1042',
    title: 'Map the AI infrastructure landscape',
    agentId: 'atlas-research',
    agentName: 'Atlas Research',
    agentBadge: 'AR',
    agentBadgeBg: '#EBF2FA',
    agentBadgeColor: '#2B5C8F',
    brief: {
      taskTitle: 'Map the AI infrastructure landscape',
      taskDescription: 'Identify the major AI infrastructure companies, estimate their market positioning, compare business models, and identify major risks.',
      preferredAgentId: 'atlas-research',
      budgetEth: 0.04,
      priority: 'normal',
      requiredOutput: 'Research Report'
    },
    budgetEth: 0.04,
    budgetFormatted: '0.04 ETH',
    status: 'delivered',
    escrow: {
      escrowId: 'ESC-8921',
      budgetEth: 0.04,
      budgetFormatted: '0.04 ETH',
      status: 'funded_simulated',
      isSimulatedDemo: true,
      depositTxHash: '0x8f7a29e1c49b01d4a9f93310e1189912c77a3d61',
      explanation: 'Funds are held in demo escrow until the agreed work is delivered and accepted.'
    },
    createdAt: '42 mins ago',
    lastUpdated: '2 mins ago',
    expectedDelivery: 'Delivered (Ready for Review)',
    timeline: [
      { id: 'tl-1', timestamp: '09:31', timeOffset: '42m ago', label: 'Task posted & escrow secured', type: 'creation' },
      { id: 'tl-2', timestamp: '09:32', timeOffset: '41m ago', label: 'Atlas Research accepted work order', type: 'assignment' },
      { id: 'tl-3', timestamp: '09:34', timeOffset: '39m ago', label: 'Research started across 14 hyperscale filings', type: 'research' },
      { id: 'tl-4', timestamp: '09:42', timeOffset: '31m ago', label: 'Financial metrics & margin curves collected', type: 'milestone' },
      { id: 'tl-5', timestamp: '09:51', timeOffset: '22m ago', label: 'Competitive landscape displacement map synthesized', type: 'milestone' },
      { id: 'tl-6', timestamp: '10:02', timeOffset: '11m ago', label: 'Risk assessment & evidence citations linked', type: 'milestone' },
      { id: 'tl-7', timestamp: '10:08', timeOffset: '5m ago', label: 'Deliverable generated with 8 evidence anchors', type: 'deliverable' },
      { id: 'tl-8', timestamp: '10:09', timeOffset: '2m ago', label: 'Deliverable ready for institutional review', type: 'review' }
    ],
    deliverable: {
      id: 'deliv-1042',
      workOrderId: 'WORK-1042',
      title: 'AI Infrastructure Landscape: Full Stack Assessment & Moat Analysis',
      status: 'ready',
      executiveSummary: 'The AI infrastructure sector is undergoing rapid tiering into compute silicon suppliers, specialized neocloud GPU operators, and sovereign model hosting networks. Hyperscaler capex commitments ($180B+ aggregate annualized) continue to backstop demand, while private compute providers capture premium pricing on high-cluster availability.',
      marketMap: [
        { category: 'Silicon & Interconnect', players: ['NVIDIA', 'Broadcom', 'Cerebras', 'AMD'], positioning: 'Dominant pricing power; NVLink and custom ASIC clusters create steep multi-year lock-in.' },
        { category: 'Specialized Compute Clouds', players: ['CoreWeave', 'Lambda Labs', 'Crusoe Energy'], positioning: 'High revenue expansion rates driven by reserved multi-year enterprise cluster contracts.' },
        { category: 'Sovereign Foundation Models', players: ['Mistral AI', 'Helsing', 'Aleph Alpha'], positioning: 'Capturing European and NATO defense data sovereignty requirements.' }
      ],
      keyFindings: [
        {
          title: 'Hyperscale Custom ASICs vs Merchant GPU Hegemony',
          detail: 'While Google, Meta, and AWS expand internal TPU/Trainium silicon, 82% of enterprise production model training remains tied to NVIDIA CUDA/NVLink ecosystems through late 2027.',
          evidenceIds: ['ev-1', 'ev-2']
        },
        {
          title: 'Specialized Neocloud Unit Economics',
          detail: 'Operators like CoreWeave achieve payback periods of 14-18 months on H100/H200 cluster deployments, underpinned by take-or-pay enterprise contracts.',
          evidenceIds: ['ev-3', 'ev-4']
        },
        {
          title: 'Data Center Power & Interconnection Bottlenecks',
          detail: 'Grid interconnection queues now average 36-48 months in Northern Virginia and Frankfurt, shifting strategic advantage to power-adjacent infrastructure.',
          evidenceIds: ['ev-5']
        }
      ],
      financialMetrics: [
        { metric: 'Aggregate Tier-1 Hyperscaler 2026 AI Capex', value: '$194.5B', variance: '+28.4% YoY' },
        { metric: 'Gross Margins on Reserved 8x GPU Clusters', value: '64.2%', variance: '+380 bps' },
        { metric: 'Average Power Purchase Agreement Price per MWh', value: '$78.40', variance: '+12.1% YoY' }
      ],
      risksIdentified: [
        { risk: 'Power Grid Capacity Caps', severity: 'high', mitigation: 'Focus investments on co-located nuclear and behind-the-meter geothermal energy facilities.' },
        { risk: 'Model Architecture Efficiency Strides', severity: 'medium', mitigation: 'Diversify into model inference architectures rather than pure training compute.' },
        { risk: 'TSMC CoWoS Packaging Allocation Squeeze', severity: 'medium', mitigation: 'Monitor multi-foundry advanced packaging capacity in Arizona and Kumamoto.' }
      ],
      evidence: [
        {
          id: 'ev-1',
          claim: 'NVIDIA datacenter revenue grew 427% year-over-year with gross margins sustaining 75.8%.',
          sourceTitle: 'NVIDIA FY2026 Q1 Form 10-Q SEC Filing',
          sourceType: 'SEC Filing',
          sourceUrl: 'https://sec.gov/edgar/data/1045810/nvda-10q',
          confidenceScore: 99,
          timestamp: 'SEC Official Record',
          snippet: 'Datacenter segment revenue was $22,563 million, up 427% from the year-ago quarter, driven by the NVIDIA HGX platform.'
        },
        {
          id: 'ev-2',
          claim: 'Hyperscaler customers represent approximately 48% of total merchant AI accelerator orders.',
          sourceTitle: 'Consensus Hyperscale Capex Tracking Model',
          sourceType: 'Earnings Call',
          confidenceScore: 96,
          timestamp: 'Q1 Earnings Transcript',
          snippet: 'Executive VP remarks: Cloud service providers represented roughly mid-40s percent of our Data Center revenue.'
        },
        {
          id: 'ev-3',
          claim: 'CoreWeave signed a multi-billion dollar long-term compute provision backstop.',
          sourceTitle: 'CoreWeave Series C Private Diligence Memorandum',
          sourceType: 'Cap Table',
          confidenceScore: 95,
          timestamp: 'Confidential VDR Audit',
          snippet: 'Master Services Agreement exhibits confirm take-or-pay commitments spanning 36 months.'
        },
        {
          id: 'ev-4',
          claim: 'Average cluster power density increased from 15kW to 65kW per rack.',
          sourceTitle: 'Uptime Institute Datacenter Power Density Survey 2026',
          sourceType: 'Market Data',
          confidenceScore: 94,
          timestamp: 'March 2026 Edition',
          snippet: 'High-performance compute deployments for liquid-cooled clusters surpass 60kW average per rack envelope.'
        },
        {
          id: 'ev-5',
          claim: 'PJM interconnection queue backlogs exceed 240 gigawatts of generation and transmission requests.',
          sourceTitle: 'PJM Regional Transmission Planning Assessment',
          sourceType: 'Market Data',
          confidenceScore: 98,
          timestamp: 'Official PJM Bulletin',
          snippet: 'PJM queue studies show transmission upgrades required for major data center loads now extend past 2029.'
        }
      ],
      openQuestions: [
        'How rapidly will liquid cooling retrofits enable tier-2 data center conversion?',
        'Will sovereign AI procurement mandates in the EU create sustainable domestic margin premiums?'
      ],
      generatedAt: '10:08 AM',
      pdfExportAvailable: true
    }
  },
  {
    id: 'WORK-1041',
    title: 'Cerebras custom wafer-scale supply risk',
    agentId: 'keystone-risk',
    agentName: 'Keystone Risk',
    agentBadge: 'KR',
    agentBadgeBg: '#EBF5F1',
    agentBadgeColor: '#2E6E56',
    brief: {
      taskTitle: 'Cerebras custom wafer-scale supply risk',
      taskDescription: 'Audit wafer-scale packaging yield constraints, TSMC single-point manufacturing dependence, and cooling reliability.',
      preferredAgentId: 'keystone-risk',
      budgetEth: 0.03,
      priority: 'high',
      requiredOutput: 'Risk Analysis'
    },
    budgetEth: 0.03,
    budgetFormatted: '0.03 ETH',
    status: 'paid',
    escrow: {
      escrowId: 'ESC-8919',
      budgetEth: 0.03,
      budgetFormatted: '0.03 ETH',
      status: 'released_simulated',
      isSimulatedDemo: true,
      depositTxHash: '0x3a4b91...',
      releaseTxHash: '0x992c10...',
      explanation: 'Deliverable accepted by user. Escrow released to Keystone Risk.'
    },
    createdAt: '2 hours ago',
    lastUpdated: '1 hour ago',
    expectedDelivery: 'Completed & Paid',
    timeline: [
      { id: 'tl-10', timestamp: '07:15', timeOffset: '2h ago', label: 'Work order created', type: 'creation' },
      { id: 'tl-11', timestamp: '07:16', timeOffset: '2h ago', label: 'Keystone Risk initiated stress model', type: 'research' },
      { id: 'tl-12', timestamp: '07:22', timeOffset: '1h 50m ago', label: 'Risk deliverable completed', type: 'deliverable' },
      { id: 'tl-13', timestamp: '07:30', timeOffset: '1h 40m ago', label: 'User accepted deliverable and released demo escrow', type: 'payment' }
    ]
  },
  {
    id: 'WORK-1040',
    title: 'Helsing NATO procurement pipeline audit',
    agentId: 'mosaic-diligence',
    agentName: 'Mosaic Diligence',
    agentBadge: 'MD',
    agentBadgeBg: '#FEF3EB',
    agentBadgeColor: '#A85A24',
    brief: {
      taskTitle: 'Helsing NATO procurement pipeline audit',
      taskDescription: 'Verify European defense ministry contracts, Eurofighter AI sensor integration milestones, and funding backlog.',
      preferredAgentId: 'mosaic-diligence',
      budgetEth: 0.08,
      priority: 'normal',
      requiredOutput: 'Research Report'
    },
    budgetEth: 0.08,
    budgetFormatted: '0.08 ETH',
    status: 'paid',
    escrow: {
      escrowId: 'ESC-8912',
      budgetEth: 0.08,
      budgetFormatted: '0.08 ETH',
      status: 'released_simulated',
      isSimulatedDemo: true,
      explanation: 'Work order completed and verified.'
    },
    createdAt: 'Yesterday',
    lastUpdated: '18 hours ago',
    expectedDelivery: 'Delivered & Stored in Deal Room',
    timeline: [
      { id: 'tl-20', timestamp: '14:00', timeOffset: 'Yesterday', label: 'Task dispatched to Mosaic Diligence', type: 'creation' },
      { id: 'tl-21', timestamp: '14:24', timeOffset: 'Yesterday', label: 'Full diligence brief generated', type: 'deliverable' },
      { id: 'tl-22', timestamp: '15:10', timeOffset: 'Yesterday', label: 'Approved by Investment Committee partner', type: 'payment' }
    ]
  }
];

export const INITIAL_AGENT_ACTIVITIES: AgentActivityEvent[] = [
  {
    id: 'act-1',
    timestamp: '2 mins ago',
    agentId: 'atlas-research',
    agentName: 'Atlas Research',
    agentBadge: 'AR',
    workOrderId: 'WORK-1042',
    workOrderTitle: 'Map the AI infrastructure landscape',
    action: 'Deliverable generated with 5 evidence anchors — awaiting user review',
    actionType: 'awaiting_review',
    statusBadge: { label: 'Deliverable Ready', variant: 'sage' }
  },
  {
    id: 'act-2',
    timestamp: '14 mins ago',
    agentId: 'keystone-risk',
    agentName: 'Keystone Risk',
    agentBadge: 'KR',
    workOrderId: 'WORK-1043',
    workOrderTitle: 'Portfolio 30% Tech Decline Stress Simulation',
    action: 'Monte Carlo 10,000 runs initiated across cross-asset correlation matrices',
    actionType: 'researching',
    statusBadge: { label: 'Researching', variant: 'warning' }
  },
  {
    id: 'act-3',
    timestamp: '38 mins ago',
    agentId: 'mosaic-diligence',
    agentName: 'Mosaic Diligence',
    agentBadge: 'MD',
    workOrderId: 'WORK-1044',
    workOrderTitle: 'Perform financial diligence on Atlas Robotics',
    action: 'Work order accepted from Deal Room — parsing confidential cap table VDR',
    actionType: 'accepted',
    statusBadge: { label: 'Task Accepted', variant: 'info' }
  },
  {
    id: 'act-4',
    timestamp: '1 hour ago',
    agentId: 'keystone-risk',
    agentName: 'Keystone Risk',
    agentBadge: 'KR',
    workOrderId: 'WORK-1041',
    workOrderTitle: 'Cerebras custom wafer-scale supply risk',
    action: 'Deliverable accepted by user. 0.03 ETH demo escrow released',
    actionType: 'paid',
    statusBadge: { label: 'Escrow Released', variant: 'success' }
  },
  {
    id: 'act-5',
    timestamp: '3 hours ago',
    agentId: 'meridian-valuation',
    agentName: 'Meridian Valuation',
    agentBadge: 'MV',
    workOrderId: 'WORK-1039',
    workOrderTitle: 'CoreWeave Series C Waterfall Model',
    action: 'Exported DCF sensitivity matrix and comparable multiples workbook',
    actionType: 'delivered',
    statusBadge: { label: 'Delivered', variant: 'success' }
  }
];
