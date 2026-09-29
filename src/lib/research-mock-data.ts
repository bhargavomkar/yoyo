import { 
  PublicCompanyIdentity, 
  PrivateCompanyIdentity, 
  FinancialYearData, 
  EvidenceSource, 
  StructuredAnalysis, 
  ComparablePeer, 
  ResearchActivityEvent, 
  SectorResearchItem, 
  ThematicResearchItem, 
  WatchlistItem 
} from '@/types/research';

// 1. Evidence Sources (Mock SEC filings, earnings transcripts, reports)
export const MOCK_EVIDENCE_SOURCES: Record<string, EvidenceSource> = {
  'src-01': {
    id: 'src-01',
    citationNumber: '[Source 01]',
    title: 'NVIDIA FY2025 Form 10-K Annual Report',
    sourceType: 'Annual Report (10-K)',
    publicationDate: 'Feb 26, 2025',
    relevantExcerpt: 'Compute & Networking segment revenue increased 128% to $105.2 billion, primarily driven by strong demand for the NVIDIA HGX platform and Blackwell architecture deployments across cloud hyperscalers.',
    dataUsed: 'Revenue growth rate (128% YoY), Data Center segment mix ($105.2B), Gross margin expansion (75.0%).',
    urlPlaceholder: 'https://sec.gov/edgar/nvda/10k-2025',
    isDemo: false
  },
  'src-02': {
    id: 'src-02',
    citationNumber: '[Source 02]',
    title: 'NVIDIA Q4 FY25 Earnings Conference Call Transcript',
    sourceType: 'Earnings Call Transcript',
    publicationDate: 'Feb 26, 2025',
    relevantExcerpt: 'Blackwell demand is exceptional, and we are tracking billions in wafer starts with TSMC CoWoS-L packaging commitments booked through calendar year 2026.',
    dataUsed: 'Forward demand visibility, supply-chain packaging pipeline constraints, hyperscaler cluster commitments.',
    urlPlaceholder: 'https://investor.nvidia.com/events/q4-fy25',
    isDemo: false
  },
  'src-03': {
    id: 'src-03',
    citationNumber: '[Source 03]',
    title: 'Hyperscaler Aggregate Capex Consensus Model (Faro Research)',
    sourceType: 'Industry Benchmark',
    publicationDate: 'Mar 12, 2025',
    relevantExcerpt: 'Aggregate data center capital expenditure between Microsoft, Google, AWS, and Meta reached $188 billion in 2024 with consensus estimates projecting $225 billion for 2025, providing persistent structural top-line support for merchant accelerator suppliers.',
    dataUsed: 'Hyperscaler capex sensitivity, customer revenue concentration risk (~38% from top 4 buyers).',
    urlPlaceholder: 'https://faro.internal/memos/hyperscale-capex-2025',
    isDemo: false
  },
  'src-04': {
    id: 'src-04',
    citationNumber: '[Source 04]',
    title: 'TSMC Advanced Packaging Sub-Supplier Channel Audit',
    sourceType: 'Proprietary Channel Check',
    publicationDate: 'Mar 18, 2025',
    relevantExcerpt: 'CoWoS substrate delivery cycle times have compressed from 24 weeks to 18 weeks, though high-density glass substrate transitions and power deliver IC yields remain the primary pacing factor for liquid-cooled rack-scale Blackwell deliveries.',
    dataUsed: 'Hardware supply bottlenecks, gross margin sensitivity to packaging yield loss.',
    urlPlaceholder: 'https://faro.internal/checks/tsmc-packaging-q1',
    isDemo: true
  }
};

// 2. Structured AI Research Analysis for NVIDIA
export const NVDA_STRUCTURED_ANALYSIS: StructuredAnalysis = {
  investmentThesis: {
    summary: 'NVIDIA maintains an unassailable full-stack moat across silicon, networking (Quantum InfiniBand/Spectrum-X), and the CUDA software ecosystem, capturing >80% of aggregate data center accelerator value pools.',
    points: [
      {
        id: 't-1',
        claimText: 'Compute & Networking revenue expanded 128% YoY, powered by relentless enterprise and sovereign AI cluster buildouts.',
        epistemicStatus: 'VERIFIED DATA',
        sourceIds: ['src-01']
      },
      {
        id: 't-2',
        claimText: 'Blackwell architecture transition commands higher ASPs and margin durability through CoWoS-L wafer reservations through CY2026.',
        epistemicStatus: 'MODEL ANALYSIS',
        sourceIds: ['src-02', 'src-04']
      },
      {
        id: 't-3',
        claimText: 'Proprietary NVLink 5 and Spectrum-X Ethernet switching create switching costs that render generic ASIC alternatives non-viable for frontier models.',
        epistemicStatus: 'MODEL ANALYSIS',
        sourceIds: ['src-01']
      }
    ]
  },
  counterThesis: {
    summary: 'Customer concentration among top 4 cloud hyperscalers (~38% of revenue) exposes the multiple to severe compression if hyperscaler internal ASICs (Google TPU, AWS Trainium, Meta MTIA) reach workload parity.',
    points: [
      {
        id: 'c-1',
        claimText: 'Top 4 hyperscalers represent $40B+ of direct purchases; any Capex digestion cycle could compress forward P/E multiple from 34x to historical 22x.',
        epistemicStatus: 'ASSUMPTION',
        sourceIds: ['src-03']
      },
      {
        id: 'c-2',
        claimText: 'US export restrictions on advanced accelerator interconnects limit monetization across mainland China sovereign infrastructure.',
        epistemicStatus: 'VERIFIED DATA',
        sourceIds: ['src-01']
      },
      {
        id: 'c-3',
        claimText: 'Power availability and data center grid substation interconnection lead times (3–5 years) may choke physical deployment velocity before silicon demand softens.',
        epistemicStatus: 'ESTIMATE',
        sourceIds: ['src-03']
      }
    ]
  },
  growthDrivers: [
    {
      id: 'gd-1',
      claimText: 'Sovereign AI infrastructure initiatives across Western Europe, Japan, and Middle East allocating $20B+ sovereign compute reserves.',
      epistemicStatus: 'ESTIMATE',
      sourceIds: ['src-02']
    },
    {
      id: 'gd-2',
      claimText: 'Enterprise inference workloads growing at 140% CAGR as fine-tuned SLMs and agentic reasoning architectures migrate from R&D into production.',
      epistemicStatus: 'MODEL ANALYSIS',
      sourceIds: ['src-01']
    },
    {
      id: 'gd-3',
      claimText: 'Spectrum-X Ethernet penetration opening enterprise networking TAM previously dominated by Arista and Cisco.',
      epistemicStatus: 'VERIFIED DATA',
      sourceIds: ['src-01']
    }
  ],
  catalysts: [
    {
      id: 'cat-1',
      claimText: 'Volume ramp of GB200 NVL72 liquid-cooled rack systems beginning Q2 calendar 2025.',
      epistemicStatus: 'MODEL ANALYSIS',
      sourceIds: ['src-02']
    },
    {
      id: 'cat-2',
      claimText: 'Next-generation Rubin architecture tape-out disclosure expected at GTC 2026.',
      epistemicStatus: 'ASSUMPTION',
      sourceIds: ['src-02']
    },
    {
      id: 'cat-3',
      claimText: 'Enterprise software licensing revenue (NVIDIA AI Enterprise) crossing $2B run-rate milestone.',
      epistemicStatus: 'ESTIMATE',
      sourceIds: ['src-01']
    }
  ],
  competitiveAdvantages: [
    {
      id: 'moat-1',
      claimText: 'CUDA developer ecosystem with 5.5M+ active developers and 20 years of optimization libraries.',
      epistemicStatus: 'VERIFIED DATA',
      sourceIds: ['src-01']
    },
    {
      id: 'moat-2',
      claimText: 'NVLink interconnect bandwidth (1.8 TB/s per GPU) exceeds standard PCIe Gen 5 interconnect throughput by 14x.',
      epistemicStatus: 'VERIFIED DATA',
      sourceIds: ['src-01']
    }
  ],
  keyRisks: [
    {
      id: 'risk-1',
      claimText: 'Taiwan geopolitical supply concentration: 100% of advanced packaging and 4nm/3nm wafer fab relies on TSMC facilities.',
      epistemicStatus: 'VERIFIED DATA',
      sourceIds: ['src-01', 'src-04']
    },
    {
      id: 'risk-2',
      claimText: 'Post-training test-time compute shifts favoring lower-precision custom inference ASICs over general-purpose training GPUs.',
      epistemicStatus: 'MODEL ANALYSIS',
      sourceIds: ['src-03']
    }
  ],
  openQuestions: [
    'What percentage of 2026 hyperscaler capex will be redirected to custom internal silicon (TPU v6, Trainium 2, Maia 100)?',
    'How will data center thermal dissipation and 100kW/rack density thresholds throttle enterprise on-premise deployments?',
    'What is the normalized long-term software licensing margin once hardware margins compress from peak 75% to 65%?'
  ],
  importantAssumptions: [
    {
      id: 'as-1',
      claimText: 'Long-term terminal data center compute revenue growth rate of 3.5% across mature replacement cycles.',
      epistemicStatus: 'ASSUMPTION',
      sourceIds: ['src-03']
    },
    {
      id: 'as-2',
      claimText: 'Gross margins normalize at 72.5% over the 5-year forecast horizon despite advanced packaging cost inflation.',
      epistemicStatus: 'ESTIMATE',
      sourceIds: ['src-01', 'src-04']
    }
  ]
};

// 3. Multi-Year Financial Data for NVIDIA (NVDA)
export const NVDA_FINANCIALS_HISTORY: FinancialYearData[] = [
  {
    year: 'FY2022',
    revenue: 26914,
    cogs: 9439,
    grossProfit: 17475,
    grossMargin: 64.9,
    operatingExpenses: 7434,
    operatingIncome: 10041,
    operatingMargin: 37.3,
    netIncome: 9752,
    netMargin: 36.2,
    eps: 0.39,
    ebitda: 11210,
    ebitdaMargin: 41.6,
    freeCashFlow: 8053,
    operatingCashFlow: 9108,
    capex: 1055,
    cash: 21208,
    debt: 11828,
    totalAssets: 44187,
    liabilities: 17575,
    equity: 26612,
    accountsReceivable: 4650,
    inventory: 2605,
    ppe: 3200,
    financingCashFlow: -9262
  },
  {
    year: 'FY2023',
    revenue: 26974,
    cogs: 11618,
    grossProfit: 15356,
    grossMargin: 56.9,
    operatingExpenses: 11132,
    operatingIncome: 4224,
    operatingMargin: 15.7,
    netIncome: 4368,
    netMargin: 16.2,
    eps: 0.17,
    ebitda: 5641,
    ebitdaMargin: 20.9,
    freeCashFlow: 3808,
    operatingCashFlow: 5641,
    capex: 1833,
    cash: 13296,
    debt: 12031,
    totalAssets: 41182,
    liabilities: 19081,
    equity: 22101,
    accountsReceivable: 3829,
    inventory: 5159,
    ppe: 3840,
    financingCashFlow: -10047
  },
  {
    year: 'FY2024',
    revenue: 60922,
    cogs: 16621,
    grossProfit: 44301,
    grossMargin: 72.7,
    operatingExpenses: 11329,
    operatingIncome: 32972,
    operatingMargin: 54.1,
    netIncome: 29760,
    netMargin: 48.9,
    eps: 1.19,
    ebitda: 34480,
    ebitdaMargin: 56.6,
    freeCashFlow: 27021,
    operatingCashFlow: 28090,
    capex: 1069,
    cash: 25984,
    debt: 11056,
    totalAssets: 65728,
    liabilities: 22750,
    equity: 42978,
    accountsReceivable: 9999,
    inventory: 5282,
    ppe: 3914,
    financingCashFlow: -9548
  },
  {
    year: 'FY2025',
    revenue: 128500,
    cogs: 32125,
    grossProfit: 96375,
    grossMargin: 75.0,
    operatingExpenses: 18200,
    operatingIncome: 78175,
    operatingMargin: 60.8,
    netIncome: 65400,
    netMargin: 50.9,
    eps: 2.62,
    ebitda: 82450,
    ebitdaMargin: 64.2,
    freeCashFlow: 60800,
    operatingCashFlow: 63800,
    capex: 3000,
    cash: 43200,
    debt: 9800,
    totalAssets: 112400,
    liabilities: 34100,
    equity: 78300,
    accountsReceivable: 19800,
    inventory: 8900,
    ppe: 5200,
    financingCashFlow: -18400
  }
];

// 4. Comparable Peers for Valuation
export const NVDA_COMPARABLES: ComparablePeer[] = [
  {
    id: 'nvda',
    company: 'NVIDIA Corp',
    ticker: 'NVDA',
    evToRevenue: 24.2,
    evToEbitda: 37.8,
    peRatio: 42.5,
    revenueGrowth: 110.8,
    operatingMargin: 60.8,
    marketCap: '$3,120B'
  },
  {
    id: 'amd',
    company: 'Advanced Micro Devices',
    ticker: 'AMD',
    evToRevenue: 8.6,
    evToEbitda: 28.4,
    peRatio: 38.2,
    revenueGrowth: 17.5,
    operatingMargin: 21.4,
    marketCap: '$240B'
  },
  {
    id: 'avgo',
    company: 'Broadcom Inc',
    ticker: 'AVGO',
    evToRevenue: 14.8,
    evToEbitda: 23.5,
    peRatio: 31.0,
    revenueGrowth: 44.0,
    operatingMargin: 46.5,
    marketCap: '$780B'
  },
  {
    id: 'tsm',
    company: 'Taiwan Semiconductor',
    ticker: 'TSM',
    evToRevenue: 10.2,
    evToEbitda: 17.6,
    peRatio: 26.4,
    revenueGrowth: 28.2,
    operatingMargin: 42.8,
    marketCap: '$890B'
  },
  {
    id: 'msft',
    company: 'Microsoft Corp',
    ticker: 'MSFT',
    evToRevenue: 12.1,
    evToEbitda: 24.2,
    peRatio: 33.6,
    revenueGrowth: 16.0,
    operatingMargin: 44.2,
    marketCap: '$3,180B'
  },
  {
    id: 'intc',
    company: 'Intel Corp',
    ticker: 'INTC',
    evToRevenue: 1.8,
    evToEbitda: 9.4,
    peRatio: 18.5,
    revenueGrowth: -3.2,
    operatingMargin: 4.8,
    marketCap: '$96B'
  }
];

// 5. Public Companies Universe for Search & Exploration
export const PUBLIC_COMPANIES: PublicCompanyIdentity[] = [
  {
    id: 'nvda',
    name: 'NVIDIA Corporation',
    ticker: 'NVDA',
    country: 'United States',
    sector: 'Semiconductors',
    subIndustry: 'AI Accelerators & GPU Computing',
    sharePrice: 128.50,
    sharePriceFormatted: '$128.50',
    sharePriceChange1D: '+2.8%',
    isPositive1D: true,
    marketCap: 3120000000000,
    marketCapFormatted: '$3,120B',
    peRatio: 42.5,
    evToRevenue: 24.2,
    evToEbitda: 37.8,
    priceToSales: 24.3,
    fcfYield: 1.95,
    revenueTTM: '$128.5B',
    revenueGrowthYoY: '+110.8%',
    ebitdaMargin: '64.2%',
    netIncomeTTM: '$65.4B',
    freeCashFlowTTM: '$60.8B',
    cash: '$43.2B',
    debt: '$9.8B',
    riskIndicator: 'Moderate',
    researchStatus: 'Analyzed',
    lastUpdated: '12 mins ago',
    overview: 'Pioneer of GPU-accelerated computing, commanding global market share in training and inferencing foundation AI models with proprietary CUDA software stack.',
    logoLetter: 'N',
    type: 'public'
  },
  {
    id: 'msft',
    name: 'Microsoft Corporation',
    ticker: 'MSFT',
    country: 'United States',
    sector: 'Enterprise Software & Cloud',
    subIndustry: 'Hyperscale Cloud & AI Platforms',
    sharePrice: 426.10,
    sharePriceFormatted: '$426.10',
    sharePriceChange1D: '+0.9%',
    isPositive1D: true,
    marketCap: 3180000000000,
    marketCapFormatted: '$3,180B',
    peRatio: 33.6,
    evToRevenue: 12.1,
    evToEbitda: 24.2,
    priceToSales: 12.2,
    fcfYield: 2.35,
    revenueTTM: '$255.4B',
    revenueGrowthYoY: '+16.0%',
    ebitdaMargin: '52.4%',
    netIncomeTTM: '$88.1B',
    freeCashFlowTTM: '$74.1B',
    cash: '$75.5B',
    debt: '$43.0B',
    riskIndicator: 'Low',
    researchStatus: 'Analyzed',
    lastUpdated: '1 hour ago',
    overview: 'Dominant enterprise software and Azure cloud hyperscaler partnering with OpenAI to integrate Copilot assistants across modern office and developer infrastructure.',
    logoLetter: 'M',
    type: 'public'
  },
  {
    id: 'aapl',
    name: 'Apple Inc.',
    ticker: 'AAPL',
    country: 'United States',
    sector: 'Consumer Electronics & Services',
    subIndustry: 'Edge Silicon & Mobile Ecosystems',
    sharePrice: 228.40,
    sharePriceFormatted: '$228.40',
    sharePriceChange1D: '-0.4%',
    isPositive1D: false,
    marketCap: 3450000000000,
    marketCapFormatted: '$3,450B',
    peRatio: 34.2,
    evToRevenue: 8.8,
    evToEbitda: 25.1,
    priceToSales: 8.9,
    fcfYield: 3.10,
    revenueTTM: '$391.0B',
    revenueGrowthYoY: '+6.1%',
    ebitdaMargin: '34.8%',
    netIncomeTTM: '$101.9B',
    freeCashFlowTTM: '$108.8B',
    cash: '$65.2B',
    debt: '$104.6B',
    riskIndicator: 'Low',
    researchStatus: 'Needs Review',
    lastUpdated: 'Yesterday',
    overview: 'Consumer technology leader monetizing over 2.2 billion active devices through premium hardware, Apple Silicon neural engines, and expanding subscription services.',
    logoLetter: 'A',
    type: 'public'
  },
  {
    id: 'amzn',
    name: 'Amazon.com, Inc.',
    ticker: 'AMZN',
    country: 'United States',
    sector: 'Cloud & E-Commerce',
    subIndustry: 'AWS Hyperscale & Logistics',
    sharePrice: 194.20,
    sharePriceFormatted: '$194.20',
    sharePriceChange1D: '+1.4%',
    isPositive1D: true,
    marketCap: 2040000000000,
    marketCapFormatted: '$2,040B',
    peRatio: 41.8,
    evToRevenue: 3.2,
    evToEbitda: 18.2,
    priceToSales: 3.3,
    fcfYield: 2.60,
    revenueTTM: '$620.1B',
    revenueGrowthYoY: '+12.5%',
    ebitdaMargin: '18.2%',
    netIncomeTTM: '$48.5B',
    freeCashFlowTTM: '$53.0B',
    cash: '$86.2B',
    debt: '$58.1B',
    riskIndicator: 'Moderate',
    researchStatus: 'Updated',
    lastUpdated: '3 hours ago',
    overview: 'Global e-commerce and cloud computing giant; AWS powers leading enterprise cloud workloads and custom Trainium/Inferentia AI silicon deployments.',
    logoLetter: 'A',
    type: 'public'
  },
  {
    id: 'googl',
    name: 'Alphabet Inc.',
    ticker: 'GOOGL',
    country: 'United States',
    sector: 'Internet & Search',
    subIndustry: 'Search, YouTube & Google Cloud',
    sharePrice: 178.60,
    sharePriceFormatted: '$178.60',
    sharePriceChange1D: '+0.6%',
    isPositive1D: true,
    marketCap: 2210000000000,
    marketCapFormatted: '$2,210B',
    peRatio: 23.4,
    evToRevenue: 6.4,
    evToEbitda: 16.5,
    priceToSales: 6.5,
    fcfYield: 3.40,
    revenueTTM: '$345.2B',
    revenueGrowthYoY: '+14.8%',
    ebitdaMargin: '36.5%',
    netIncomeTTM: '$94.6B',
    freeCashFlowTTM: '$72.4B',
    cash: '$110.9B',
    debt: '$28.4B',
    riskIndicator: 'Low',
    researchStatus: 'Analyzed',
    lastUpdated: 'Today',
    overview: 'Search and digital advertising monopoly holding world-class AI research (Google DeepMind) and proprietary TPU accelerator clusters for Gemini models.',
    logoLetter: 'G',
    type: 'public'
  },
  {
    id: 'meta',
    name: 'Meta Platforms, Inc.',
    ticker: 'META',
    country: 'United States',
    sector: 'Social Platforms & AI',
    subIndustry: 'Digital Advertising & Llama Models',
    sharePrice: 585.00,
    sharePriceFormatted: '$585.00',
    sharePriceChange1D: '+1.9%',
    isPositive1D: true,
    marketCap: 1480000000000,
    marketCapFormatted: '$1,480B',
    peRatio: 27.5,
    evToRevenue: 9.1,
    evToEbitda: 17.2,
    priceToSales: 9.2,
    fcfYield: 3.25,
    revenueTTM: '$162.0B',
    revenueGrowthYoY: '+21.4%',
    ebitdaMargin: '52.0%',
    netIncomeTTM: '$54.0B',
    freeCashFlowTTM: '$48.2B',
    cash: '$62.5B',
    debt: '$29.0B',
    riskIndicator: 'Moderate',
    researchStatus: 'Analyzed',
    lastUpdated: 'Yesterday',
    overview: 'Social platform conglomerate reaching 3.3B daily active people; open-source Llama model series establishes ubiquitous global developer standard.',
    logoLetter: 'M',
    type: 'public'
  },
  {
    id: 'tsla',
    name: 'Tesla, Inc.',
    ticker: 'TSLA',
    country: 'United States',
    sector: 'Automotive & Clean Energy',
    subIndustry: 'Autonomous Vehicles & Robotics',
    sharePrice: 248.50,
    sharePriceFormatted: '$248.50',
    sharePriceChange1D: '-1.8%',
    isPositive1D: false,
    marketCap: 792000000000,
    marketCapFormatted: '$792B',
    peRatio: 68.4,
    evToRevenue: 7.8,
    evToEbitda: 42.0,
    priceToSales: 7.9,
    fcfYield: 0.95,
    revenueTTM: '$101.2B',
    revenueGrowthYoY: '+3.5%',
    ebitdaMargin: '14.2%',
    netIncomeTTM: '$11.8B',
    freeCashFlowTTM: '$7.5B',
    cash: '$33.6B',
    debt: '$7.2B',
    riskIndicator: 'High',
    researchStatus: 'Needs Review',
    lastUpdated: '2 days ago',
    overview: 'EV leader and energy storage manufacturer developing Full Self-Driving neural vision stacks, Dojo custom compute, and Optimus humanoid robotics.',
    logoLetter: 'T',
    type: 'public'
  },
  {
    id: 'amd',
    name: 'Advanced Micro Devices',
    ticker: 'AMD',
    country: 'United States',
    sector: 'Semiconductors',
    subIndustry: 'x86 Processors & MI300 Instinct GPUs',
    sharePrice: 154.20,
    sharePriceFormatted: '$154.20',
    sharePriceChange1D: '+3.2%',
    isPositive1D: true,
    marketCap: 249000000000,
    marketCapFormatted: '$249B',
    peRatio: 38.2,
    evToRevenue: 8.6,
    evToEbitda: 28.4,
    priceToSales: 8.7,
    fcfYield: 1.80,
    revenueTTM: '$25.8B',
    revenueGrowthYoY: '+17.5%',
    ebitdaMargin: '26.4%',
    netIncomeTTM: '$6.5B',
    freeCashFlowTTM: '$4.5B',
    cash: '$6.1B',
    debt: '$3.1B',
    riskIndicator: 'Moderate',
    researchStatus: 'Researching',
    lastUpdated: '4 hours ago',
    overview: 'Primary merchant alternative to NVIDIA in data center GPU acceleration with MI300X/MI325X accelerators and market-leading EPYC server CPUs.',
    logoLetter: 'A',
    type: 'public'
  },
  {
    id: 'avgo',
    name: 'Broadcom Inc.',
    ticker: 'AVGO',
    country: 'United States',
    sector: 'Semiconductors & Infrastructure',
    subIndustry: 'Custom Silicon (XPU) & VMware',
    sharePrice: 168.40,
    sharePriceFormatted: '$168.40',
    sharePriceChange1D: '+1.1%',
    isPositive1D: true,
    marketCap: 785000000000,
    marketCapFormatted: '$785B',
    peRatio: 31.0,
    evToRevenue: 14.8,
    evToEbitda: 23.5,
    priceToSales: 14.9,
    fcfYield: 3.15,
    revenueTTM: '$52.7B',
    revenueGrowthYoY: '+44.0%',
    ebitdaMargin: '58.5%',
    netIncomeTTM: '$24.2B',
    freeCashFlowTTM: '$24.8B',
    cash: '$14.2B',
    debt: '$71.5B',
    riskIndicator: 'Moderate',
    researchStatus: 'Analyzed',
    lastUpdated: 'Yesterday',
    overview: 'Leader in custom ASIC accelerators for Google and Meta, combined with mission-critical enterprise virtualization infrastructure through VMware.',
    logoLetter: 'B',
    type: 'public'
  },
  {
    id: 'tsm',
    name: 'Taiwan Semiconductor Mfg',
    ticker: 'TSM',
    country: 'Taiwan',
    sector: 'Semiconductors',
    subIndustry: 'Pure-Play Pure Foundry & CoWoS',
    sharePrice: 178.90,
    sharePriceFormatted: '$178.90',
    sharePriceChange1D: '+2.1%',
    isPositive1D: true,
    marketCap: 890000000000,
    marketCapFormatted: '$890B',
    peRatio: 26.4,
    evToRevenue: 10.2,
    evToEbitda: 17.6,
    priceToSales: 10.3,
    fcfYield: 3.80,
    revenueTTM: '$87.5B',
    revenueGrowthYoY: '+28.2%',
    ebitdaMargin: '67.4%',
    netIncomeTTM: '$33.8B',
    freeCashFlowTTM: '$33.5B',
    cash: '$58.4B',
    debt: '$32.1B',
    riskIndicator: 'Moderate',
    researchStatus: 'Analyzed',
    lastUpdated: '12 hours ago',
    overview: 'World monopoly in advanced semiconductor fabrication; manufactures 100% of NVIDIA, AMD, Apple, and Qualcomm leading-edge 3nm and 4nm chips.',
    logoLetter: 'T',
    type: 'public'
  }
];

// 6. Private Companies Universe (Explicitly DEMO, Non-fabrication)
export const PRIVATE_COMPANIES: PrivateCompanyIdentity[] = [
  {
    id: 'cerebras',
    name: 'Cerebras Systems',
    industry: 'Semiconductors & Wafer-Scale AI',
    location: 'Sunnyvale, CA',
    founded: 2016,
    employees: '450–550',
    totalFunding: '$720M',
    latestRound: 'Series F / Pre-IPO',
    estimatedValuation: '$8.2B (Demo)',
    leadInvestors: ['Benchmark', 'Altimeter Capital', 'Coatue', 'Abu Dhabi G42'],
    businessModel: 'Wafer-scale AI accelerator appliance sales & Cerebras Cloud inference API consumption',
    customerProfile: 'National AI laboratories, sovereign AI ministries, Tier-2 cloud providers',
    competitiveMoat: 'Monolithic single-wafer interconnect (WSE-3) eliminates inter-chip communication bottlenecks',
    annualRecurringRevenue: '$285M (Demo)',
    monthlyRecurringRevenue: '$23.8M (Demo)',
    arrGrowthYoY: '+215%',
    grossMargin: '64.5%',
    netBurnMonthly: '$6.2M',
    cashRunwayMonths: 28,
    cashBalance: '$174M',
    customerConcentrationTop5: '72% (High G42 dependency)',
    dataCertainty: {
      arr: 'Estimated',
      valuation: 'Estimated',
      runway: 'Estimated',
      capTable: 'Verified'
    },
    riskIndicator: 'Moderate',
    researchStatus: 'Analyzed',
    lastUpdated: 'Today',
    overview: 'Creator of the largest monolithic wafer-scale processor (WSE-3) with 4 trillion transistors, delivering unprecedented throughput for frontier LLM inference.',
    logoLetter: 'C',
    type: 'private',
    isDemoMarked: true
  },
  {
    id: 'helsing',
    name: 'Helsing AI',
    industry: 'Defense & Autonomous Sensor Fusion',
    location: 'Munich, Germany',
    founded: 2021,
    employees: '380–420',
    totalFunding: '$740M',
    latestRound: 'Series C',
    estimatedValuation: '$5.4B (Demo)',
    leadInvestors: ['General Catalyst', 'Prima Materia (Daniel Ek)', 'Lightspeed', 'Saab'],
    businessModel: 'Software-defined defense platform licensing embedded onto military platforms (Eurofighter, naval frigates)',
    customerProfile: 'Ministries of Defence across Germany, UK, France, and NATO allies',
    competitiveMoat: 'Live acoustic/sensor model fusion tested in active sovereign airspace and military hardware contracts',
    annualRecurringRevenue: '$140M (Demo)',
    monthlyRecurringRevenue: '$11.6M (Demo)',
    arrGrowthYoY: '+185%',
    grossMargin: '78.2%',
    netBurnMonthly: '$4.1M',
    cashRunwayMonths: 36,
    cashBalance: '$210M',
    customerConcentrationTop5: '88% (Govt defense contracts)',
    dataCertainty: {
      arr: 'Estimated',
      valuation: 'Verified',
      runway: 'Verified',
      capTable: 'Verified'
    },
    riskIndicator: 'Low',
    researchStatus: 'Analyzed',
    lastUpdated: 'Yesterday',
    overview: 'European defense AI unicorn providing autonomous real-time live sensor intelligence and electronic warfare countermeasures for allied militaries.',
    logoLetter: 'H',
    type: 'private',
    isDemoMarked: true
  },
  {
    id: 'coreweave',
    name: 'CoreWeave',
    industry: 'Specialized Cloud & GPU Compute',
    location: 'Roseland, NJ',
    founded: 2017,
    employees: '850–1,000',
    totalFunding: '$1.4B Equity + $7.5B Debt',
    latestRound: 'Pre-IPO Secondary',
    estimatedValuation: '$19.1B (Demo)',
    leadInvestors: ['Magnetar Capital', 'Blackstone', 'Coatue', 'Fidelity', 'NVIDIA'],
    businessModel: 'Dedicated cluster GPU infrastructure-as-a-service with multi-year take-or-pay capacity contracts',
    customerProfile: 'OpenAI, Microsoft, Mistral, Inflection AI, autonomous vehicle labs',
    competitiveMoat: 'Early access allocation of NVIDIA GB200/H100 clusters combined with proprietary Kubernetes orchestration',
    annualRecurringRevenue: '$1,850M (Demo)',
    monthlyRecurringRevenue: '$154.2M (Demo)',
    arrGrowthYoY: '+340%',
    grossMargin: '52.0%',
    netBurnMonthly: 'Self-funding ($42M operating EBITDA)',
    cashRunwayMonths: 42,
    cashBalance: '$820M',
    customerConcentrationTop5: '64% (Microsoft / OpenAI proxy)',
    dataCertainty: {
      arr: 'Estimated',
      valuation: 'Verified',
      runway: 'Verified',
      capTable: 'Estimated'
    },
    riskIndicator: 'Managed',
    researchStatus: 'Analyzed',
    lastUpdated: '2 hours ago',
    overview: 'Specialized cloud infrastructure provider delivering petabyte-scale GPU clusters to leading AI enterprises, backed by debt facilities tied to hardware assets.',
    logoLetter: 'CW',
    type: 'private',
    isDemoMarked: true
  },
  {
    id: 'mistral',
    name: 'Mistral AI',
    industry: 'Frontier AI Foundation Models',
    location: 'Paris, France',
    founded: 2023,
    employees: '90–120',
    totalFunding: '$1.1B',
    latestRound: 'Series B',
    estimatedValuation: '$6.2B (Demo)',
    leadInvestors: ['Andreessen Horowitz', 'Lightspeed', 'General Catalyst', 'NVIDIA', 'Bpifrance'],
    businessModel: 'Commercial API token consumption, sovereign enterprise weight licensing, cloud platform partnerships',
    customerProfile: 'Global Fortune 500 banks, telecoms, European sovereign institutions',
    competitiveMoat: 'Extreme parameter efficiency, open-weight enterprise sovereignty, French/EU governmental endorsement',
    annualRecurringRevenue: '$85M (Demo)',
    monthlyRecurringRevenue: '$7.1M (Demo)',
    arrGrowthYoY: '+280%',
    grossMargin: '68.0%',
    netBurnMonthly: '$8.5M',
    cashRunwayMonths: 32,
    cashBalance: '$380M',
    customerConcentrationTop5: '45%',
    dataCertainty: {
      arr: 'Estimated',
      valuation: 'Verified',
      runway: 'Verified',
      capTable: 'Verified'
    },
    riskIndicator: 'Moderate',
    researchStatus: 'Needs Review',
    lastUpdated: '3 days ago',
    overview: 'Europe’s leading frontier AI lab producing high-performance open and commercial language models tailored for enterprise sovereign data compliance.',
    logoLetter: 'M',
    type: 'private',
    isDemoMarked: true
  },
  {
    id: 'anduril',
    name: 'Anduril Industries',
    industry: 'Autonomous Defense & Robotics',
    location: 'Costa Mesa, CA',
    founded: 2017,
    employees: '2,800–3,200',
    totalFunding: '$3.8B',
    latestRound: 'Series F',
    estimatedValuation: '$14.0B (Demo)',
    leadInvestors: ['Founders Fund', 'Valor Equity Partners', 'Fidelity', 'General Catalyst'],
    businessModel: 'Hardware + Lattice OS recurring software subscription for military force protection and autonomous loitering munitions',
    customerProfile: 'US Department of Defense (Air Force, Navy, SOCOM), UK MoD, Australian ADF',
    competitiveMoat: 'Hardware-agnostic Lattice AI mesh network connecting thousands of autonomous sensor nodes',
    annualRecurringRevenue: '$620M (Demo)',
    monthlyRecurringRevenue: '$51.6M (Demo)',
    arrGrowthYoY: '+125%',
    grossMargin: '61.4%',
    netBurnMonthly: '$12.0M',
    cashRunwayMonths: 38,
    cashBalance: '$520M',
    customerConcentrationTop5: '82% (US DoD defense appropriations)',
    dataCertainty: {
      arr: 'Estimated',
      valuation: 'Verified',
      runway: 'Verified',
      capTable: 'Verified'
    },
    riskIndicator: 'Low',
    researchStatus: 'Analyzed',
    lastUpdated: '4 days ago',
    overview: 'Defense technology disruptor manufacturing autonomous drones, robotic submarines, and Lattice command-and-control software for the US military.',
    logoLetter: 'A',
    type: 'private',
    isDemoMarked: true
  },
  {
    id: 'tenstorrent',
    name: 'Tenstorrent',
    industry: 'RISC-V Modular Silicon & Compute',
    location: 'Toronto, Canada',
    founded: 2016,
    employees: '320–380',
    totalFunding: '$480M',
    latestRound: 'Series D',
    estimatedValuation: '$2.6B (Demo)',
    leadInvestors: ['Samsung Catalyst', 'Hyundai Motor Group', 'Fidelity', 'Bezos Expeditions'],
    businessModel: 'RISC-V processor IP licensing, chiplet sales, Wormhole/Blackhole PCIe AI accelerator boards',
    customerProfile: 'Automotive OEMs, sovereign computing institutes, open-source AI developers',
    competitiveMoat: 'Open RISC-V compute architecture led by legendary silicon architect Jim Keller with modular chiplet topology',
    annualRecurringRevenue: '$42M (Demo)',
    monthlyRecurringRevenue: '$3.5M (Demo)',
    arrGrowthYoY: '+160%',
    grossMargin: '58.0%',
    netBurnMonthly: '$5.5M',
    cashRunwayMonths: 24,
    cashBalance: '$145M',
    customerConcentrationTop5: '68% (Hyundai & Samsung automotive programs)',
    dataCertainty: {
      arr: 'Estimated',
      valuation: 'Estimated',
      runway: 'Estimated',
      capTable: 'Verified'
    },
    riskIndicator: 'High',
    researchStatus: 'Researching',
    lastUpdated: 'Yesterday',
    overview: 'Next-generation AI hardware company developing modular RISC-V CPU and AI chiplet architectures for datacenter and edge deployments.',
    logoLetter: 'T',
    type: 'private',
    isDemoMarked: true
  }
];

// 7. Research Timeline for NVIDIA
export const NVDA_RESEARCH_TIMELINE: ResearchActivityEvent[] = [
  {
    id: 'ev-01',
    date: 'Sep 27, 2026 · 14:15',
    actor: 'Faro Engine',
    title: 'Faro analyzed financial statements',
    detail: 'Ingested FY2025 10-K filing; verified 75.0% gross margin and $60.8B Free Cash Flow delivery.',
    badge: '10-K Ingestion'
  },
  {
    id: 'ev-02',
    date: 'Sep 27, 2026 · 14:18',
    actor: 'Atlas Research',
    title: 'Comparable companies identified & re-weighted',
    detail: 'Calculated median peer EV/Revenue at 12.1x and EV/EBITDA at 24.2x across AMD, AVGO, TSM, and MSFT.',
    badge: 'Comps Engine'
  },
  {
    id: 'ev-03',
    date: 'Sep 27, 2026 · 14:21',
    actor: 'Faro Engine',
    title: 'DCF Valuation model generated',
    detail: 'Simulated 5-year multi-stage model with 18% growth and 9.5% WACC; baseline implied value $142.80.',
    badge: 'DCF Model'
  },
  {
    id: 'ev-04',
    date: 'Sep 27, 2026 · 14:24',
    actor: 'Keystone Risk',
    title: 'Risk & bottleneck telemetry analysis completed',
    detail: 'Tagged Taiwan geopolitical supply single-point dependency and hyperscaler capex digestion sensitivity.',
    badge: 'Risk Audit'
  },
  {
    id: 'ev-05',
    date: 'Sep 27, 2026 · 14:30',
    actor: 'Mosaic Diligence',
    title: 'Research Agent completed market analysis',
    detail: 'Synthesized hyperscaler internal silicon displacement probability and sovereign AI backlog pipeline.',
    badge: 'Agent Synthesis'
  }
];

// 8. Sector Research Items
export const SECTORS_RESEARCH: SectorResearchItem[] = [
  {
    id: 'sec-ai-infra',
    name: 'AI Infrastructure',
    marketSize: '$320B',
    projectedGrowth: '+38.5% CAGR',
    growthRateNumeric: 38.5,
    averageMargin: '54.2%',
    averageValuationEV: '22.4x EV/EBITDA',
    valuationMultipleNumeric: 22.4,
    keyTrends: [
      'Transition from 8-GPU servers to liquid-cooled 72-GPU rack-scale compute fabrics',
      'Optical circuit switching and co-packaged optics replacing copper DAC cables at 1.6T',
      'Data center power acquisition becoming the dominant bottleneck over raw silicon supply'
    ],
    risks: [
      'Hyperscaler capex digestion cycles following multi-year datacenter infrastructure buildup',
      'High-voltage transformer substation lead times stretching past 4 years'
    ],
    majorCompanies: ['NVIDIA', 'Broadcom', 'CoreWeave', 'Cerebras', 'TSMC', 'Supermicro']
  },
  {
    id: 'sec-semis',
    name: 'Semiconductors',
    marketSize: '$680B',
    projectedGrowth: '+14.2% CAGR',
    growthRateNumeric: 14.2,
    averageMargin: '38.0%',
    averageValuationEV: '18.6x EV/EBITDA',
    valuationMultipleNumeric: 18.6,
    keyTrends: [
      'Gate-All-Around (GAA) and backside power delivery adoption in 2nm nodes',
      'CoWoS and 3D chiplet packaging driving 4x transistor density gains without node shrinks',
      'Sovereign fab reshoring incentives (US CHIPS Act, EU Chips Act)'
    ],
    risks: [
      'Geopolitical tensions around Taiwan Strait and advanced tool export prohibitions',
      'Extreme fab construction capital intensity exceeding $20B per leading-edge shell'
    ],
    majorCompanies: ['TSMC', 'NVIDIA', 'ASML', 'AMD', 'Qualcomm', 'Intel']
  },
  {
    id: 'sec-cloud',
    name: 'Cloud Computing',
    marketSize: '$740B',
    projectedGrowth: '+19.0% CAGR',
    growthRateNumeric: 19.0,
    averageMargin: '32.5%',
    averageValuationEV: '16.2x EV/EBITDA',
    valuationMultipleNumeric: 16.2,
    keyTrends: [
      'Migration of legacy on-premise workloads to hyperscale AI model inference endpoints',
      'Multi-cloud sovereign data residency compliance mandates',
      'Custom hyperscaler ARM CPUs and AI ASIC co-processors lowering TCO'
    ],
    risks: [
      'Enterprise cloud optimization initiatives squeezing SaaS seat pricing',
      'High depreciation charges from rapid GPU hardware obsolescence'
    ],
    majorCompanies: ['Microsoft', 'Amazon', 'Alphabet', 'Oracle', 'CoreWeave']
  },
  {
    id: 'sec-defense',
    name: 'Defense & Aerospace',
    marketSize: '$490B',
    projectedGrowth: '+12.8% CAGR',
    growthRateNumeric: 12.8,
    averageMargin: '24.0%',
    averageValuationEV: '15.4x EV/EBITDA',
    valuationMultipleNumeric: 15.4,
    keyTrends: [
      'Software-defined autonomous attritable drone swarms and unmanned naval vessels',
      'Rapid NATO rearmament programs expanding defense procurement budgets to >2.5% of GDP',
      'Integration of edge AI inference into military sensor and radar arrays'
    ],
    risks: [
      'Defense department procurement procurement cycles and budgetary appropriation stalls',
      'Strict export licensing requirements limiting non-NATO international sales'
    ],
    majorCompanies: ['Anduril', 'Helsing', 'Lockheed Martin', 'Saab', 'Rheinmetall', 'RTX']
  },
  {
    id: 'sec-fintech',
    name: 'Fintech & Capital Markets',
    marketSize: '$380B',
    projectedGrowth: '+15.5% CAGR',
    growthRateNumeric: 15.5,
    averageMargin: '28.5%',
    averageValuationEV: '14.0x EV/EBITDA',
    valuationMultipleNumeric: 14.0,
    keyTrends: [
      'Autonomous institutional agent networks automating financial reconciliation and allocation',
      'Real-time gross settlement via modern digital ledger rails',
      'Algorithmic credit underwriting replacing manual commercial lending'
    ],
    risks: [
      'Regulatory compliance audits and anti-money laundering enforcement actions',
      'Elevated interest rate environment compressing venture-backed consumer lending'
    ],
    majorCompanies: ['Stripe', 'Adyen', 'Robinhood', 'Coinbase', 'Plaid']
  },
  {
    id: 'sec-energy',
    name: 'Clean Energy & Grid',
    marketSize: '$520B',
    projectedGrowth: '+16.8% CAGR',
    growthRateNumeric: 16.8,
    averageMargin: '21.0%',
    averageValuationEV: '12.8x EV/EBITDA',
    valuationMultipleNumeric: 12.8,
    keyTrends: [
      'Direct small modular reactor (SMR) and nuclear power purchase agreements for AI campuses',
      'Battery energy storage systems (BESS) buffering grid peak power loads',
      'High-voltage direct current (HVDC) transmission link expansion'
    ],
    risks: [
      'Interconnection queue delays averaging 5 years across US ISO grids',
      'Supply chain bottlenecks in power transformers and high-voltage switchgear'
    ],
    majorCompanies: ['Constellation Energy', 'NextEra Energy', 'GE Vernova', 'Schneider Electric']
  }
];

// 9. Thematic Research Items
export const THEMES_RESEARCH: ThematicResearchItem[] = [
  {
    id: 'theme-ai-infra',
    title: 'AI Infrastructure Supercycle',
    tagline: 'The physical, silicon, and networking foundation powering artificial general intelligence',
    description: 'The global transformation of data center architecture from general-purpose CPU computing to accelerated parallel clusters, encompassing advanced lithography, high-bandwidth memory (HBM3e/HBM4), liquid cooling, and optical switches.',
    marketDrivers: [
      'Frontier model training compute scaling laws (10x FLOPs per generation)',
      'Enterprise transition from prototype AI pilots to high-concurrency production inference',
      'Sovereign AI initiatives allocating billions for national compute independence'
    ],
    companiesExposed: [
      { name: 'NVIDIA', ticker: 'NVDA', role: 'Dominant merchant GPU and networking platform' },
      { name: 'TSMC', ticker: 'TSM', role: 'Monopoly foundry for 4nm/3nm AI silicon and CoWoS packaging' },
      { name: 'Broadcom', ticker: 'AVGO', role: 'Custom ASIC partner for Google TPU and Meta MTIA' },
      { name: 'CoreWeave', role: 'Hyperscale GPU-native specialized cloud infrastructure' }
    ],
    growthOpportunities: [
      'Liquid-cooled rack deployment suppliers (GB200 NVL72 architectures)',
      'Optical interconnect switches replacing copper at 1.6 Terabit/sec bandwidth',
      'High-bandwidth memory suppliers transitioning to HBM4 custom base dies'
    ],
    risks: [
      'Hyperscaler capex digestion cycle if generative AI software revenue lags hardware outlays',
      'Power grid connection moratoriums across Northern Virginia, Dublin, and Singapore'
    ],
    keyDevelopments: [
      'NVIDIA announced volume ramp of Blackwell architecture with multi-billion order backlog',
      'TSMC committed to 3x CoWoS capacity expansion through 2026 to relieve packaging choke points',
      'Microsoft signed 20-year power agreement with Constellation Energy to restart Three Mile Island'
    ],
    stage: 'Scaling'
  },
  {
    id: 'theme-energy-trans',
    title: 'Energy Transition & AI Grid Demand',
    tagline: 'Powering multi-gigawatt compute campuses with clean baseload power',
    description: 'The convergence of soaring data center electricity demand (projected to reach 8% of total US electricity by 2030) with the clean energy transition, driving nuclear power renaissance, geothermal, and utility-scale grid modernization.',
    marketDrivers: [
      'Data center power draw expanding from 15kW/rack to 100kW+/rack for AI clusters',
      'Hyperscaler carbon-neutral commitments mandating 24/7 matching with clean power',
      'Regulatory pressure on electric utilities to maintain grid stability'
    ],
    companiesExposed: [
      { name: 'Constellation Energy', ticker: 'CEG', role: 'Largest US nuclear fleet operator contracting with hyperscalers' },
      { name: 'GE Vernova', ticker: 'GEV', role: 'Turbine and high-voltage grid equipment supplier' },
      { name: 'NextEra Energy', ticker: 'NEE', role: 'Leading utility-scale renewable developer' }
    ],
    growthOpportunities: [
      'Behind-the-meter collocated nuclear reactor campuses bypassing public utility queues',
      'Next-generation geothermal and advanced small modular reactor (SMR) deployments'
    ],
    risks: [
      'FERC regulatory challenges to collocated behind-the-meter power arrangements',
      'High interest rates increasing the levelized cost of capital-intensive clean energy projects'
    ],
    keyDevelopments: [
      'Amazon AWS acquired 960MW nuclear-powered data center campus from Talen Energy',
      'Google partnered with Kairos Power to deploy 500MW of small modular nuclear reactors by 2030'
    ],
    stage: 'Scaling'
  },
  {
    id: 'theme-defense-tech',
    title: 'Software-Defined Defense & Autonomy',
    tagline: 'Autonomous systems, sensor fusion, and real-time electronic warfare superiority',
    description: 'The fundamental modernization of sovereign defense doctrine toward software-first, low-cost autonomous hardware swarms, electronic warfare resiliency, and AI-enabled battle management operating systems.',
    marketDrivers: [
      'Lessons from Eastern European conflict highlighting asymmetric impact of autonomous drones',
      'DOD Replicator initiative aiming to field thousands of attritable autonomous systems',
      'European defense spending reaching multi-decade highs across NATO member states'
    ],
    companiesExposed: [
      { name: 'Anduril Industries', role: 'Autonomous drones, loitering munitions, and Lattice OS mesh network' },
      { name: 'Helsing AI', role: 'European live sensor fusion and defense software operating system' },
      { name: 'Lockheed Martin', ticker: 'LMT', role: 'Tier-1 defense prime modernizing fifth-generation combat aircraft' }
    ],
    growthOpportunities: [
      'Counter-UAS (unmanned aerial system) directed energy and kinetic interceptors',
      'Autonomous underwater vehicles (AUVs) safeguarding undersea communication cables'
    ],
    risks: [
      'Legacy defense prime lobbying protecting traditional cost-plus hardware programs',
      'Strict international arms trafficking (ITAR) regulations restricting cross-border exports'
    ],
    keyDevelopments: [
      'Anduril selected by US Air Force for Collaborative Combat Aircraft (CCA) program alongside General Atomics',
      'Helsing secured €600M contract for Eurofighter Typhoon electronic warfare upgrade'
    ],
    stage: 'Emerging'
  }
];

// 10. Initial Watchlist
export const INITIAL_WATCHLIST: WatchlistItem[] = [
  {
    id: 'wl-nvda',
    companyId: 'nvda',
    name: 'NVIDIA Corporation',
    ticker: 'NVDA',
    type: 'public',
    priceOrValuation: '$128.50',
    growth: '+110.8% YoY',
    risk: 'Moderate',
    researchStatus: 'Analyzed',
    lastAnalyzed: 'Sep 27, 2026',
    thesisSnapshot: 'Dominant full-stack data center accelerator with Blackwell ramp and unassailable CUDA developer moat.'
  },
  {
    id: 'wl-cerebras',
    companyId: 'cerebras',
    name: 'Cerebras Systems',
    type: 'private',
    priceOrValuation: '$8.2B (Demo)',
    growth: '+215% YoY',
    risk: 'Moderate',
    researchStatus: 'Analyzed',
    lastAnalyzed: 'Sep 27, 2026',
    thesisSnapshot: 'Wafer-scale engine architecture providing 10x throughput for frontier LLM inference.'
  },
  {
    id: 'wl-helsing',
    companyId: 'helsing',
    name: 'Helsing AI',
    type: 'private',
    priceOrValuation: '$5.4B (Demo)',
    growth: '+185% YoY',
    risk: 'Low',
    researchStatus: 'Analyzed',
    lastAnalyzed: 'Sep 26, 2026',
    thesisSnapshot: 'Sovereign European defense AI operating system embedded into NATO combat air and naval systems.'
  },
  {
    id: 'wl-coreweave',
    companyId: 'coreweave',
    name: 'CoreWeave',
    type: 'private',
    priceOrValuation: '$19.1B (Demo)',
    growth: '+340% YoY',
    risk: 'Managed',
    researchStatus: 'Analyzed',
    lastAnalyzed: 'Sep 25, 2026',
    thesisSnapshot: 'Leading specialized GPU cloud provider with multi-year hyperscale contracts backstopping debt.'
  }
];
