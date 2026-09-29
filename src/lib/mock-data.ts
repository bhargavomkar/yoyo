import { 
  FinancialMetric, 
  ExposureBreakdown, 
  InvestmentOpportunity, 
  AIAgent, 
  AIInsight, 
  Workspace 
} from '@/types';

export const WORKSPACES: Workspace[] = [
  {
    id: 'faro-demo-fund',
    name: 'Faro Demo Fund',
    aum: '$150.0M',
    strategy: 'Multi-Strategy Tech & Macro',
    type: 'fund'
  },
  {
    id: 'deeptech-growth-ii',
    name: 'DeepTech Growth II',
    aum: '$340.0M',
    strategy: 'AI Infrastructure & Defense',
    type: 'fund'
  },
  {
    id: 'faro-macro-alpha',
    name: 'Faro Macro Alpha',
    aum: '$85.0M',
    strategy: 'Cross-Asset Quantitative',
    type: 'fund'
  }
];

export const CAPITAL_METRICS: FinancialMetric[] = [
  {
    id: 'total-capital',
    label: 'Total Capital',
    value: '$150,000,000',
    numericValue: 150000000,
    subtext: 'Committed LP capital across tranches',
    sparkline: [142, 144, 145, 148, 150, 150],
    category: 'primary'
  },
  {
    id: 'invested-capital',
    label: 'Invested Capital',
    value: '$98,240,000',
    numericValue: 98240000,
    delta: {
      value: '65.5% deployed',
      isPositive: true,
      period: 'target 70%'
    },
    subtext: 'Active capital in 18 portfolio assets',
    sparkline: [76, 81, 86, 91, 95, 98],
    category: 'primary'
  },
  {
    id: 'available-capital',
    label: 'Available Capital',
    value: '$51,760,000',
    numericValue: 51760000,
    delta: {
      value: '34.5% reserve',
      isPositive: false,
      period: 'dry powder'
    },
    subtext: 'Liquid reserves for opportunistic deployment',
    sparkline: [74, 69, 64, 59, 55, 51.7],
    category: 'primary'
  },
  {
    id: 'portfolio-value',
    label: 'Portfolio Value',
    value: '$114,820,000',
    numericValue: 114820000,
    delta: {
      value: '+$16.58M (+16.9%)',
      isPositive: true,
      period: 'trailing 12m'
    },
    subtext: 'Net asset mark based on Q2 audit & market pricing',
    sparkline: [98, 102, 105, 108, 111, 114.8],
    category: 'primary'
  },
  {
    id: 'unrealized-pnl',
    label: 'Unrealized P&L',
    value: '+$16,580,000',
    numericValue: 16580000,
    delta: {
      value: '+16.88% Net IRR',
      isPositive: true,
      period: 'since inception'
    },
    subtext: 'Driven primarily by semiconductor & compute positions',
    sparkline: [4.2, 7.8, 9.5, 12.1, 14.8, 16.58],
    category: 'secondary'
  },
  {
    id: 'cash-reserves',
    label: 'Cash & Equivalents',
    value: '$51,760,000',
    numericValue: 51760000,
    delta: {
      value: '4.88% APY',
      isPositive: true,
      period: 'T-Bills & SOFR Repo'
    },
    subtext: 'Generating ~$210,000/mo in risk-free yield',
    sparkline: [52, 51.9, 51.8, 51.7, 51.76, 51.76],
    category: 'secondary'
  }
];

export const EXPOSURE_DATA = {
  assetClass: [
    { name: 'Public Equity', allocationPercent: 34.2, amountFormatted: '$39.27M', amountNumeric: 39270000, change30d: '+1.8%', isPositiveChange: true, color: '#87BAA4' },
    { name: 'Private Equity', allocationPercent: 28.4, amountFormatted: '$32.61M', amountNumeric: 32610000, change30d: '0.0%', isPositiveChange: true, color: '#9AA19E' },
    { name: 'Venture & Growth', allocationPercent: 19.8, amountFormatted: '$22.73M', amountNumeric: 22730000, change30d: '+3.1%', isPositiveChange: true, color: '#BAD6CC' },
    { name: 'Private Credit', allocationPercent: 10.5, amountFormatted: '$12.06M', amountNumeric: 12060000, change30d: '-0.4%', isPositiveChange: false, color: '#556B60' },
    { name: 'Real Assets', allocationPercent: 7.1, amountFormatted: '$8.15M', amountNumeric: 8150000, change30d: '+0.2%', isPositiveChange: true, color: '#C8DDD4' }
  ] as ExposureBreakdown[],
  sector: [
    { name: 'Semiconductors & AI Infra', allocationPercent: 31.5, amountFormatted: '$36.17M', amountNumeric: 36170000, change30d: '+4.2%', isPositiveChange: true, color: '#87BAA4' },
    { name: 'Enterprise SaaS', allocationPercent: 22.8, amountFormatted: '$26.18M', amountNumeric: 26180000, change30d: '-1.1%', isPositiveChange: false, color: '#9AA19E' },
    { name: 'Defense & Aerospace', allocationPercent: 16.4, amountFormatted: '$18.83M', amountNumeric: 18830000, change30d: '+1.5%', isPositiveChange: true, color: '#BAD6CC' },
    { name: 'Clean Energy & Grid', allocationPercent: 12.2, amountFormatted: '$14.01M', amountNumeric: 14010000, change30d: '+0.6%', isPositiveChange: true, color: '#68887B' },
    { name: 'Fintech & Capital Markets', allocationPercent: 9.8, amountFormatted: '$11.25M', amountNumeric: 11250000, change30d: '-0.8%', isPositiveChange: false, color: '#B5C4BE' },
    { name: 'Healthcare & Biotech', allocationPercent: 7.3, amountFormatted: '$8.38M', amountNumeric: 8380000, change30d: '+0.1%', isPositiveChange: true, color: '#D4E2DC' }
  ] as ExposureBreakdown[],
  geography: [
    { name: 'North America', allocationPercent: 62.5, amountFormatted: '$71.76M', amountNumeric: 71760000, change30d: '+0.8%', isPositiveChange: true, color: '#87BAA4' },
    { name: 'Western Europe', allocationPercent: 21.0, amountFormatted: '$24.11M', amountNumeric: 24110000, change30d: '+1.4%', isPositiveChange: true, color: '#BAD6CC' },
    { name: 'APAC & Japan', allocationPercent: 12.5, amountFormatted: '$14.35M', amountNumeric: 14350000, change30d: '+2.1%', isPositiveChange: true, color: '#9AA19E' },
    { name: 'Middle East', allocationPercent: 4.0, amountFormatted: '$4.59M', amountNumeric: 4590000, change30d: '-0.3%', isPositiveChange: false, color: '#68887B' }
  ] as ExposureBreakdown[]
};

export const FARO_INTELLIGENCE_INSIGHT: AIInsight = {
  id: 'insight-semi-01',
  title: 'Faro Intelligence',
  summary: 'Your portfolio has increased exposure to semiconductor infrastructure over the last 30 days.',
  category: 'allocation',
  confidence: 94,
  deltaPercent: '+4.2%',
  metrics: [
    { label: 'Current Weight', value: '31.5% of AUM' },
    { label: '30-Day Delta', value: '+$4.82M (+4.2%)' },
    { label: 'Supply Chain Beta', value: '1.42x to TSMC/ASML' },
    { label: 'Risk Factor', value: 'Power grid & packaging bottlenecks' }
  ],
  timestamp: 'Updated 14 mins ago · Continuous real-time telemetry',
  fullAnalysis: [
    'Direct equity position expansion across wafer equipment and optical interconnect providers has raised aggregate portfolio semiconductor beta from 1.15x to 1.42x.',
    'Hyperscaler capex guidance from Q2 earnings calls indicates $185B+ aggregate 2026 data center capital commitment, reinforcing the fundamental demand thesis.',
    'Synthetic exposure via private venture growth equity (GPU hosting and custom inference ASICs) now accounts for $12.4M of indirect chip demand exposure.',
    'Faro Risk Agent Keystone projects that a 15% drawdown in Philadelphia Semiconductor Index (SOX) would result in a net -4.8% impact on total fund NAV.'
  ],
  recommendedActions: [
    'Execute portfolio rebalance hedge via liquid semiconductor inverse options collar.',
    'Commission Keystone Risk agent for supply-chain shock stress test.',
    'Request Mosaic Diligence deep-dive on advanced packaging capacity dependencies.'
  ]
};

export const INVESTMENT_OPPORTUNITIES: InvestmentOpportunity[] = [
  {
    id: 'opp-cerebras',
    company: 'Cerebras Systems',
    symbol: 'CRBR',
    logo: 'C',
    sector: 'Semiconductors & AI Infra',
    assetType: 'Venture & Growth',
    valuation: '$8.2B',
    growth: '+215% YoY',
    risk: 'Moderate',
    status: 'Due Diligence',
    leadPartner: 'Marcus Vance',
    thesis: 'Wafer-scale engine architecture achieving 10x throughput for frontier LLM inference vs traditional GPU clusters.',
    projectedIRR: '34.5%',
    targetInvestment: '$12.0M',
    ebitdaMultiple: 'N/A (Growth Stage)',
    hqLocation: 'Sunnyvale, CA',
    lastUpdated: 'Today, 09:15 AM'
  },
  {
    id: 'opp-helsing',
    company: 'Helsing AI',
    symbol: 'HLSG',
    logo: 'H',
    sector: 'Defense & Aerospace',
    assetType: 'Private Equity',
    valuation: '$5.4B',
    growth: '+185% YoY',
    risk: 'Low',
    status: 'IC Review',
    leadPartner: 'Elena Rostova',
    thesis: 'Sovereign European AI defense operating system embedded into Eurofighter and NATO maritime sensor arrays.',
    projectedIRR: '28.0%',
    targetInvestment: '$15.0M',
    ebitdaMultiple: '22.4x forward ARR',
    hqLocation: 'Munich, Germany',
    lastUpdated: 'Yesterday'
  },
  {
    id: 'opp-coreweave',
    company: 'CoreWeave',
    symbol: 'CRWV',
    logo: 'CW',
    sector: 'Semiconductors & AI Infra',
    assetType: 'Private Equity',
    valuation: '$19.1B',
    growth: '+340% YoY',
    risk: 'Managed',
    status: 'Term Sheet',
    leadPartner: 'Marcus Vance',
    thesis: 'Pre-IPO secondary allocation at favorable discount with multi-year hyperscale contracts backstopping revenue.',
    projectedIRR: '31.2%',
    targetInvestment: '$20.0M',
    ebitdaMultiple: '14.8x run-rate EBITDA',
    hqLocation: 'Roseland, NJ',
    lastUpdated: '2 hours ago'
  },
  {
    id: 'opp-mistral',
    company: 'Mistral AI',
    symbol: 'MSTR',
    logo: 'M',
    sector: 'Enterprise SaaS',
    assetType: 'Venture & Growth',
    valuation: '$6.2B',
    growth: '+280% YoY',
    risk: 'Moderate',
    status: 'Active Pipeline',
    leadPartner: 'Sophie Chen',
    thesis: 'Leading European open and commercial model weights with high enterprise sovereign data compliance penetration.',
    projectedIRR: '38.0%',
    targetInvestment: '$8.5M',
    ebitdaMultiple: 'Pre-EBITDA',
    hqLocation: 'Paris, France',
    lastUpdated: '3 days ago'
  },
  {
    id: 'opp-anduril',
    company: 'Anduril Industries',
    symbol: 'ANDR',
    logo: 'A',
    sector: 'Defense & Aerospace',
    assetType: 'Private Equity',
    valuation: '$14.0B',
    growth: '+125% YoY',
    risk: 'Low',
    status: 'Monitoring',
    leadPartner: 'Elena Rostova',
    thesis: 'Autonomous defense hardware and Lattice OS with Tier-1 US Department of Defense program of record awards.',
    projectedIRR: '24.5%',
    targetInvestment: '$10.0M',
    ebitdaMultiple: '18.2x ARR',
    hqLocation: 'Costa Mesa, CA',
    lastUpdated: '4 days ago'
  },
  {
    id: 'opp-tenstorrent',
    company: 'Tenstorrent',
    symbol: 'TNST',
    logo: 'T',
    sector: 'Semiconductors & AI Infra',
    assetType: 'Venture & Growth',
    valuation: '$2.6B',
    growth: '+160% YoY',
    risk: 'High',
    status: 'Due Diligence',
    leadPartner: 'Marcus Vance',
    thesis: 'RISC-V modular chiplet architecture led by Jim Keller, providing sovereign silicon licensing to automotive OEMs.',
    projectedIRR: '42.0%',
    targetInvestment: '$6.0M',
    ebitdaMultiple: 'Pre-EBITDA',
    hqLocation: 'Toronto, Canada',
    lastUpdated: '1 day ago'
  }
];

export const SPECIALIST_AGENTS: AIAgent[] = [
  {
    id: 'atlas-research',
    name: 'Atlas Research',
    badge: 'AR',
    badgeBg: '#EBF2FA',
    badgeColor: '#2B5C8F',
    specialization: 'Public markets & earnings',
    rating: 4.9,
    completedTasks: 128,
    startingPrice: 'from 0.04 ETH',
    ethPriceNumeric: 0.04,
    description: 'Autonomous financial analyst parsing 10-K, 10-Q, earnings calls, and transcripts across global public equities.',
    capabilities: [
      'SEC filing diff & footnote extraction',
      'Real-time earnings call sentiment parsing',
      'Consensus estimate variance models',
      'Transcript executive tone telemetry'
    ],
    latency: '~4 mins per brief',
    model: 'Faro-Titan-Financial-v3',
    activeOrders: 4
  },
  {
    id: 'mosaic-diligence',
    name: 'Mosaic Diligence',
    badge: 'MD',
    badgeBg: '#FEF3EB',
    badgeColor: '#A85A24',
    specialization: 'Private company diligence',
    rating: 4.8,
    completedTasks: 76,
    startingPrice: 'from 0.08 ETH',
    ethPriceNumeric: 0.08,
    description: 'Synthesizes cap tables, cohort retention, technical founder background checks, and proprietary market sizing.',
    capabilities: [
      'Cap table waterfall & dilution modeling',
      'SaaS cohort retention curve fitting',
      'Technical patent & IP infringement screening',
      'Competitive landscape displacement map'
    ],
    latency: '~12 mins per brief',
    model: 'Faro-PrivateMarkets-v4',
    activeOrders: 2
  },
  {
    id: 'keystone-risk',
    name: 'Keystone Risk',
    badge: 'KR',
    badgeBg: '#EBF5F1',
    badgeColor: '#2E6E56',
    specialization: 'Portfolio stress testing',
    rating: 5.0,
    completedTasks: 54,
    startingPrice: 'from 0.03 ETH',
    ethPriceNumeric: 0.03,
    description: 'Multi-factor quantitative stress testing, supply chain exposure mapping, and liquidity risk simulations.',
    capabilities: [
      'Macro shock Monte Carlo simulations',
      'Geopolitical supply chain single-point failure audit',
      'Liquidity horizon & redemption stress testing',
      'Factor correlation matrix shifts'
    ],
    latency: '~2 mins per brief',
    model: 'Faro-RiskEngine-v2',
    activeOrders: 1
  }
];

export const WORK_ORDERS = [
  {
    id: 'wo-1042',
    title: 'Map the AI infrastructure landscape',
    agent: 'Atlas Research',
    status: 'In Progress',
    budget: '0.04 ETH',
    created: '22m ago',
    eta: '18m remaining'
  },
  {
    id: 'wo-1041',
    title: 'Cerebras custom wafer-scale supply risk',
    agent: 'Keystone Risk',
    status: 'Completed',
    budget: '0.03 ETH',
    created: '2h ago',
    eta: 'Delivered to IC folder'
  },
  {
    id: 'wo-1040',
    title: 'Helsing NATO procurement pipeline audit',
    agent: 'Mosaic Diligence',
    status: 'Completed',
    budget: '0.08 ETH',
    created: 'Yesterday',
    eta: 'Memo generated'
  }
];
