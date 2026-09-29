# 🌐 FARO — Technologies, APIs & Resource Documentation (`resourceapi.md`)

> **Comprehensive overview of all technologies, external APIs, data providers, internal analytical engines, and resources powering the FARO Autonomous Investment OS.**

---

## 📋 Table of Contents
1. [Core Technology Stack & Frameworks](#1-core-technology-stack--frameworks)
2. [External APIs & Data Providers](#2-external-apis--data-providers)
3. [Internal Analytical Engines & Services](#3-internal-analytical-engines--services)
4. [Data Layer & Provider Architecture](#4-data-layer--provider-architecture)
5. [Synthetic Data & Mock Resources](#5-synthetic-data--mock-resources)
6. [Environment Variables & Configuration](#6-environment-variables--configuration)

---

## 1. ⚡ Core Technology Stack & Frameworks

FARO is built using a modern TypeScript web architecture engineered for performance, modularity, and institutional user interfaces.

| Category | Technology / Library | Version | Purpose & Usage in FARO |
| :--- | :--- | :--- | :--- |
| **Core Framework** | **Next.js** | `16.3.6` | App Router architecture, Turbopack builder, React Server & Client Components, page rendering. |
| **UI Library** | **React** | `19.2.8` | Declarative component model, hooks state management, dynamic layout composition. |
| **Language** | **TypeScript** | `5.0+` | End-to-end type safety, strict interface contracts for financial metrics, agents, and deals. |
| **Styling Engine** | **Tailwind CSS** | `v4.0` (`@tailwindcss/postcss`) | Institutional dark/light color palette, glassmorphic UI tokens, micro-animations. |
| **Data Visualization** | **Recharts** | `3.10.1` | Financial area charts, bar charts, portfolio allocation pies, sparklines, and metric deltas. |
| **Iconography** | **Lucide React** | `1.48.0` | Comprehensive icon set for navigation, asset classes, risk levels, and agent status badges. |
| **Class Helpers** | **`clsx` & `tailwind-merge`** | `2.1.1` / `3.7.0` | Dynamic class name resolution and conditional styling merge utilities. |

---

## 2. 🔌 External APIs & Data Providers

FARO features a decoupled provider architecture (`src/providers/`) that supports both real-time live financial data APIs and synthetic institutional demo providers.

```
                    ┌──────────────────────────────────────────────┐
                    │            Unified Data Layer                │
                    │        (dataLayerService.ts)                 │
                    └──────────────────────┬───────────────────────┘
                                           │
                    ┌──────────────────────┴───────────────────────┐
                    │            Provider Registry                 │
                    │         (providerRegistry.ts)                │
                    └──────────────┬───────────────────────┬───────┘
                                   │                       │
                    ┌──────────────▼───────┐       ┌───────▼──────────────┐
                    │   FMP Live Provider  │       │  Demo Provider Suite │
                    │ (fmpFinancialData,   │       │ (demoFinancialData,  │
                    │  fmpMarketData, etc) │       │  demoMarketData, etc)│
                    └──────────────────────┘       └──────────────────────┘
```

### Supported Data APIs & Providers

1. **Financial Modeling Prep (FMP) API**
   - **Provider File**: [`fmpFinancialDataProvider.ts`](file:///d:/hackthon%20rvit/src/providers/fmp/fmpFinancialDataProvider.ts), [`fmpMarketDataProvider.ts`](file:///d:/hackthon%20rvit/src/providers/fmp/fmpMarketDataProvider.ts), [`fmpCompanyDataProvider.ts`](file:///d:/hackthon%20rvit/src/providers/fmp/fmpCompanyDataProvider.ts)
   - **Endpoints Integrated**:
     - `/income-statement/{symbol}`: Historical & quarterly income statements.
     - `/balance-sheet-statement/{symbol}`: Balance sheets, total debt, cash reserves.
     - `/cash-flow-statement/{symbol}`: Operating, investing, and financing cash flows.
     - `/quote/{symbol}`: Real-time stock prices, volume, market cap, 52-week ranges.
     - `/historical-price-full/{symbol}`: Historical pricing time series for charting.
     - `/profile/{symbol}`: Corporate profiles, sector, industry, CEO, HQ address.
   - **Auth**: API Key via `FMP_API_KEY` header/query parameter.

2. **Alpha Vantage API (Provider Spec Ready)**
   - **Usage**: Alternative market data feed provider for global equities, forex rates, and macroeconomic indicators.
   - **Auth**: API Key via `ALPHA_VANTAGE_API_KEY`.

3. **IEX Cloud API (Provider Spec Ready)**
   - **Usage**: High-frequency ticker quotes, batch quote polling, and execution stats.
   - **Auth**: API Token via `IEX_TOKEN`.

4. **SEC EDGAR Filings Feed Interface (`FilingsProvider`)**
   - **Usage**: SEC filing discovery (10-K, 10-Q, 8-K), report date tracking, official URL linking, and source verification.

5. **Alternative Data Feeds (`AlternativeDataProvider`)**
   - **Usage**: Ingests non-traditional datasets including web traffic metrics, mobile app downloads, and satellite imagery telemetry.

---

## 3. 🧠 Internal Analytical Engines & Services (`src/services/`)

FARO includes 17 specialized internal services and analytical calculation engines:

| Service File | Primary Responsibility | Key Functions / Methods |
| :--- | :--- | :--- |
| [`portfolioCalculationEngine.ts`](file:///d:/hackthon%20rvit/src/services/portfolioCalculationEngine.ts) | Quantitative portfolio risk & allocation engine. | `calculatePortfolioMetrics()`, `runMonteCarloSimulation()`, `calculateVaR()`, `calculateSharpeRatio()`, `stressTestPortfolio()` |
| [`orchestratorService.ts`](file:///d:/hackthon%20rvit/src/services/orchestratorService.ts) | Autonomous multi-agent pipeline orchestration. | `executeWorkflow()`, `getNodeStatus()`, `getWorkflowDAG()`, `retryWorkflowNode()`, `pausePipeline()` |
| [`aiResearchService.ts`](file:///d:/hackthon%20rvit/src/services/aiResearchService.ts) | Grounded AI research assistant & thesis verifier. | `askFaro()`, `verifyHypothesis()`, `generateInvestmentMemo()`, `synthesizeSources()` |
| [`agentMarketplaceService.ts`](file:///d:/hackthon%20rvit/src/services/agentMarketplaceService.ts) | Agent hiring, SLA management & work orders. | `getAgents()`, `hireAgent()`, `createWorkOrder()`, `getWorkOrderById()`, `updateWorkOrderStatus()` |
| [`fundamentalMetricsService.ts`](file:///d:/hackthon%20rvit/src/services/fundamentalMetricsService.ts) | Fundamental metric calculations & ratio analysis. | `calculateEVtoEBITDA()`, `calculatePERatio()`, `calculateFCFYield()`, `normalizeStatements()` |
| [`valuationService.ts`](file:///d:/hackthon%20rvit/src/services/valuationService.ts) | Financial valuation modeling suite. | `runDCFModel()`, `runLBOModel()`, `getPeerMultiples()`, `calculateImpliedSharePrice()` |
| [`evidenceGraphService.ts`](file:///d:/hackthon%20rvit/src/services/evidenceGraphService.ts) | Grounded evidence DAG tracing & citation. | `getEvidenceForInsight()`, `buildEvidenceNodes()`, `verifyCitationUrl()` |
| [`historicalPriceService.ts`](file:///d:/hackthon%20rvit/src/services/historicalPriceService.ts) | Price history aggregation & normalization. | `getHistoricalPrices()`, `aggregateByPeriod()`, `calculatePriceChange()` |
| [`dataQualityService.ts`](file:///d:/hackthon%20rvit/src/services/dataQualityService.ts) | Data health, provider latency & feed monitoring. | `getHealthMetrics()`, `pingProviders()`, `getDataCleanlinessScore()` |
| [`dataCacheService.ts`](file:///d:/hackthon%20rvit/src/services/dataCacheService.ts) | Multi-tiered in-memory TTL caching engine. | `get()`, `set()`, `invalidate()`, `getCacheStats()` |
| [`dealService.ts`](file:///d:/hackthon%20rvit/src/services/dealService.ts) | Private Equity / VC deal pipeline CRUD. | `getDeals()`, `getDealById()`, `updateDealStage()`, `addDiligenceItem()` |
| [`companyService.ts`](file:///d:/hackthon%20rvit/src/services/companyService.ts) | Corporate metadata & profile manager. | `getCompany()`, `searchCompanies()`, `getCompaniesBySector()` |
| [`documentProcessingService.ts`](file:///d:/hackthon%20rvit/src/services/documentProcessingService.ts) | Dataroom & PDF financial extraction processor. | `processDocument()`, `extractFinancialTables()`, `verifyDataRoomAccess()` |
| [`currencyService.ts`](file:///d:/hackthon%20rvit/src/services/currencyService.ts) | Multi-currency FX conversion & formatting. | `convertCurrency()`, `formatCurrency()`, `getFXRates()` |
| [`dataLayerService.ts`](file:///d:/hackthon%20rvit/src/services/dataLayerService.ts) | Centralized facade for all data operations. | Unified access point wrapping provider registries and caches. |

---

## 4. 📐 Data Layer & Provider Architecture (`src/providers/`)

FARO uses a strict TypeScript interface contract layer (`src/providers/interfaces.ts`):

- **`BaseProvider`**: Standardized provider identity, `isDemo` flag, and `ping()` health monitoring.
- **`MarketDataProvider`**: `getQuote()`, `getBatchQuotes()`, `getHistoricalPrices()`.
- **`FinancialDataProvider`**: `getIncomeStatement()`, `getBalanceSheet()`, `getCashFlowStatement()`, `getFinancialStatements()`.
- **`CompanyDataProvider`**: `getCompany()`, `searchCompanies()`, `getCompaniesBySector()`.
- **`FilingsProvider`**: `getFilings()`, `getLatestFiling()`.
- **`NewsProvider`**: `getNews()`, `getCompanyNews()`, `getMarketNews()`.
- **`AlternativeDataProvider`**: `getAlternativeData()`, `getAvailableDataTypes()`.
- **`PrivateCompanyDataProvider`**: `getCompany()`, `getDocuments()`, `uploadDocument()`.

---

## 5. 🗄 Synthetic Data & Mock Resources (`src/lib/`)

When running in `DATA_MODE=demo` (or as default fallbacks), FARO relies on modular institutional datasets:

1. **[`mock-data.ts`](file:///d:/hackthon%20rvit/src/lib/mock-data.ts)**
   - `WORKSPACES`: Institutional fund entities (e.g., *Apex Horizon Fund I*, *Vanguard Growth Syndicate*, *Meridian Family Office*).
   - `INVESTMENT_OPPORTUNITIES`: Multi-asset investment pipeline objects across sectors (Semiconductors, SaaS, Defense, Clean Energy).
   - `SPECIALIST_AGENTS`: Default AI agent definitions with performance badges, ratings, and hourly rates.
   - `FARO_INTELLIGENCE_INSIGHT`: High-level AI synthesized macro/risk insights with confidence scores.

2. **[`agentMarketplaceMockData.ts`](file:///d:/hackthon%20rvit/src/lib/agentMarketplaceMockData.ts)**
   - Detailed agent profiles, capability matrices, SLAs, model specs (GPT-4o, Claude 3.5 Sonnet, Custom Fine-tunes), and past order logs.

3. **[`deal-mock-data.ts`](file:///d:/hackthon%20rvit/src/lib/deal-mock-data.ts)**
   - Granular private equity and venture capital deal cards, IC memorandum drafts, cap tables, and diligence check items.

4. **[`orchestratorMockData.ts`](file:///d:/hackthon%20rvit/src/lib/orchestratorMockData.ts)**
   - Pre-built multi-agent workflow DAG graphs, step dependencies, and mock execution outputs.

5. **[`portfolio-mock-data.ts`](file:///d:/hackthon%20rvit/src/lib/portfolio-mock-data.ts)**
   - Asset class allocation breakdowns, geographic exposure vectors, and historical risk scenarios.

6. **[`research-mock-data.ts`](file:///d:/hackthon%20rvit/src/lib/research-mock-data.ts)**
   - Public company financial statement data, evidence grounding nodes, and historical financial multiples.

---

## ⚙️ 6. Environment Variables & Configuration

FARO is configured via `.env` / `.env.local` using standard environment parameters:

```env
# Operating Mode: 'demo' (synthetic data) or 'live' (real API endpoints)
DATA_MODE=demo

# External API Keys (Required only in 'live' mode)
FMP_API_KEY=your_fmp_api_key_here
ALPHA_VANTAGE_API_KEY=your_alpha_vantage_api_key_here
IEX_TOKEN=your_iex_token_here

# Cache TTL Configuration (in seconds)
CACHE_TTL_MARKET_DATA=60
CACHE_TTL_FINANCIAL_STATEMENTS=3600
CACHE_TTL_COMPANY_METADATA=86400
CACHE_TTL_HISTORICAL_PRICES=3600
```
