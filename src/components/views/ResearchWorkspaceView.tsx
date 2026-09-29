'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { CompanyService } from '@/services/companyService';
import { PublicCompanyIdentity, PrivateCompanyIdentity, SectorResearchItem, ThematicResearchItem, EvidenceSource } from '@/types/research';
import { PUBLIC_COMPANIES, PRIVATE_COMPANIES, SECTORS_RESEARCH, THEMES_RESEARCH, INITIAL_WATCHLIST } from '@/lib/research-mock-data';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { PublicCompanyView } from '@/components/research/PublicCompanyView';
import { EvidenceSourceDrawer } from '@/components/research/EvidenceSourceDrawer';
import { ResearchReportModal } from '@/components/research/ResearchReportModal';
import { AIResearchService } from '@/services/aiResearchService';
import {
  Search,
  TrendingUp,
  Building2,
  Layers,
  Compass,
  ArrowUpRight,
  ArrowDownRight,
  Bookmark,
  Check,
  ChevronRight,
  Globe,
  BarChart3,
  Sparkles,
  ShieldAlert,
  FileText,
  Bot,
  ExternalLink,
  AlertTriangle,
  Zap,
  Target,
  X
} from 'lucide-react';

type ResearchTab = 'search' | 'sectors' | 'themes';

export const ResearchWorkspaceView: React.FC = () => {
  // Core state
  const [activeTab, setActiveTab] = useState<ResearchTab>('search');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPublicCompany, setSelectedPublicCompany] = useState<PublicCompanyIdentity | null>(null);
  const [watchlistedIds, setWatchlistedIds] = useState<Set<string>>(
    new Set(INITIAL_WATCHLIST.map(w => w.companyId))
  );

  // Modals & drawers
  const [selectedEvidenceSource, setSelectedEvidenceSource] = useState<EvidenceSource | null>(null);
  const [reportCompany, setReportCompany] = useState<PublicCompanyIdentity | null>(null);
  const [expandedSector, setExpandedSector] = useState<string | null>(null);
  const [expandedTheme, setExpandedTheme] = useState<string | null>(null);

  // Search results
  const [searchResults, setSearchResults] = useState<{ publicCompanies: PublicCompanyIdentity[], privateCompanies: PrivateCompanyIdentity[] }>({ publicCompanies: [], privateCompanies: [] });
  const [isSearching, setIsSearching] = useState(false);

  React.useEffect(() => {
    let active = true;
    const fetchSearch = async () => {
      setIsSearching(true);
      const results = await CompanyService.searchCompaniesAsync(searchQuery);
      if (active) {
        setSearchResults(results);
        setIsSearching(false);
      }
    };
    fetchSearch();
    return () => { active = false; };
  }, [searchQuery]);

  const handleToggleWatchlist = useCallback((companyId: string) => {
    setWatchlistedIds(prev => {
      const next = new Set(prev);
      if (next.has(companyId)) {
        next.delete(companyId);
      } else {
        next.add(companyId);
      }
      return next;
    });
  }, []);

  // If a company dossier is open, render it
  if (selectedPublicCompany) {
    return (
      <>
        <PublicCompanyView
          company={selectedPublicCompany}
          onBack={() => setSelectedPublicCompany(null)}
          onSelectSource={(src) => setSelectedEvidenceSource(src)}
          onGenerateReport={(c) => setReportCompany(c)}
          onDelegateAgent={() => {}}
          isWatchlisted={watchlistedIds.has(selectedPublicCompany.id)}
          onToggleWatchlist={handleToggleWatchlist}
        />

        {/* Evidence Drawer */}
        <EvidenceSourceDrawer
          source={selectedEvidenceSource}
          onClose={() => setSelectedEvidenceSource(null)}
        />

        {/* Report Modal */}
        {reportCompany && (
          <ResearchReportModal
            report={AIResearchService.generateResearchReport(reportCompany)}
            isOpen={!!reportCompany}
            onClose={() => setReportCompany(null)}
            onSelectSource={setSelectedEvidenceSource}
          />
        )}
      </>
    );
  }

  return (
    <div className="space-y-6 pb-12 max-w-7xl mx-auto animate-in fade-in duration-150">
      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="text-[10.5px] font-semibold uppercase tracking-wider text-[#87BAA4]">
            Research Intelligence
          </span>
          <StatusBadge variant="sage" size="xs" dot>
            {PUBLIC_COMPANIES.length + PRIVATE_COMPANIES.length} Companies Indexed
          </StatusBadge>
        </div>
        <h1 className="text-xl md:text-2xl font-bold tracking-tight text-[#141618]">
          Research Workspace
        </h1>
        <p className="text-xs text-[#6C726F] max-w-xl">
          Search companies, explore sectors, and analyze investment themes across public and private markets.
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9AA19E]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder='Search companies, markets, sectors, themes... (e.g. "NVIDIA", "AI infrastructure", "Indian SaaS")'
            className="w-full pl-10 pr-10 py-3 rounded-lg border border-[#EDEDEB] bg-white text-sm text-[#141618] placeholder:text-[#9AA19E] focus:outline-none focus:ring-2 focus:ring-[#87BAA4]/40 focus:border-[#87BAA4] transition-all shadow-2xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#9AA19E] hover:text-[#141618] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-1 border-b border-[#EDEDEB] pb-0">
        {[
          { key: 'search' as ResearchTab, label: 'Company Universe', icon: Search, count: searchResults.publicCompanies.length + searchResults.privateCompanies.length },
          { key: 'sectors' as ResearchTab, label: 'Sector Research', icon: Layers, count: SECTORS_RESEARCH.length },
          { key: 'themes' as ResearchTab, label: 'Thematic Research', icon: Compass, count: THEMES_RESEARCH.length },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-medium border-b-2 transition-all -mb-px ${
              activeTab === tab.key
                ? 'border-[#245241] text-[#141618] font-semibold'
                : 'border-transparent text-[#6C726F] hover:text-[#141618] hover:border-[#EDEDEB]'
            }`}
          >
            <tab.icon className="w-3.5 h-3.5" />
            <span>{tab.label}</span>
            <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-semibold ${
              activeTab === tab.key
                ? 'bg-[#EBF5F1] text-[#245241]'
                : 'bg-[#EDEDEB] text-[#636A66]'
            }`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Company Universe Tab */}
      {activeTab === 'search' && (
        <div className="space-y-6">
          {/* Public Companies */}
          {searchResults.publicCompanies.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-[#87BAA4]" />
                  <span className="text-xs font-semibold text-[#141618]">
                    Public Companies
                  </span>
                  <span className="text-[10px] text-[#9AA19E] font-medium">
                    ({searchResults.publicCompanies.length})
                  </span>
                </div>
              </div>

              <div className="bg-white border border-[#EDEDEB] rounded-lg shadow-2xs overflow-hidden">
                {/* Table Header */}
                <div className="grid grid-cols-12 gap-3 px-4 py-2.5 bg-[#FAFAF9] border-b border-[#EDEDEB] text-[10px] font-semibold text-[#9AA19E] uppercase tracking-wider">
                  <div className="col-span-3">Company</div>
                  <div className="col-span-1 text-right">Price</div>
                  <div className="col-span-1 text-right">Mkt Cap</div>
                  <div className="col-span-1 text-right">Rev Growth</div>
                  <div className="col-span-1 text-right">EBITDA %</div>
                  <div className="col-span-1 text-right">P/E</div>
                  <div className="col-span-1 text-center">Risk</div>
                  <div className="col-span-1 text-center">Status</div>
                  <div className="col-span-2 text-right">Actions</div>
                </div>

                {/* Table Rows */}
                {searchResults.publicCompanies.map((company) => (
                  <div
                    key={company.id}
                    className="grid grid-cols-12 gap-3 px-4 py-3 border-b border-[#EDEDEB]/60 hover:bg-[#FAFAF9] transition-colors items-center group cursor-pointer"
                    onClick={() => setSelectedPublicCompany(company)}
                  >
                    <div className="col-span-3 flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-[#141618] text-white flex items-center justify-center text-xs font-bold shrink-0">
                        {company.logoLetter}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-semibold text-[#141618] truncate">{company.name}</span>
                          <span className="px-1 py-0.5 rounded text-[10px] font-mono font-bold bg-[#EDEDEB] text-[#525955] shrink-0">
                            {company.ticker}
                          </span>
                        </div>
                        <div className="text-[10.5px] text-[#8C9390] truncate">{company.sector}</div>
                      </div>
                    </div>

                    <div className="col-span-1 text-right">
                      <div className="text-xs font-semibold text-[#141618] tabular-nums">{company.sharePriceFormatted}</div>
                      <div className={`text-[10px] font-medium tabular-nums ${company.isPositive1D ? 'text-[#23683C]' : 'text-[#A5342C]'}`}>
                        {company.sharePriceChange1D}
                      </div>
                    </div>

                    <div className="col-span-1 text-right text-xs font-medium text-[#141618] tabular-nums">
                      {company.marketCapFormatted}
                    </div>

                    <div className="col-span-1 text-right">
                      <span className="text-xs font-semibold text-[#23683C] tabular-nums">{company.revenueGrowthYoY}</span>
                    </div>

                    <div className="col-span-1 text-right text-xs font-medium text-[#525955] tabular-nums">
                      {company.ebitdaMargin}
                    </div>

                    <div className="col-span-1 text-right text-xs font-medium text-[#525955] tabular-nums">
                      {company.peRatio}x
                    </div>

                    <div className="col-span-1 text-center">
                      <StatusBadge
                        variant={company.riskIndicator === 'Low' ? 'success' : company.riskIndicator === 'Moderate' ? 'warning' : 'danger'}
                        size="xs"
                      >
                        {company.riskIndicator}
                      </StatusBadge>
                    </div>

                    <div className="col-span-1 text-center">
                      <StatusBadge
                        variant={company.researchStatus === 'Analyzed' ? 'success' : company.researchStatus === 'Researching' ? 'warning' : 'neutral'}
                        size="xs"
                        dot
                      >
                        {company.researchStatus}
                      </StatusBadge>
                    </div>

                    <div className="col-span-2 flex items-center justify-end gap-1.5">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleWatchlist(company.id);
                        }}
                        className={`p-1.5 rounded-md transition-colors ${
                          watchlistedIds.has(company.id)
                            ? 'text-[#87BAA4] bg-[#EBF5F1]'
                            : 'text-[#8C9390] hover:text-[#141618] hover:bg-[#F5F4F5] opacity-0 group-hover:opacity-100'
                        }`}
                        title={watchlistedIds.has(company.id) ? 'Remove from Watchlist' : 'Add to Watchlist'}
                      >
                        {watchlistedIds.has(company.id) ? <Check className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedPublicCompany(company);
                        }}
                        className="px-2.5 py-1 rounded-md text-[10.5px] font-semibold bg-[#141618] text-white hover:bg-neutral-800 transition-colors opacity-0 group-hover:opacity-100 shadow-2xs flex items-center gap-1"
                      >
                        <Sparkles className="w-3 h-3" />
                        Analyze
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Private Companies */}
          {searchResults.privateCompanies.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-[#87BAA4]" />
                  <span className="text-xs font-semibold text-[#141618]">
                    Private Companies
                  </span>
                  <span className="text-[10px] text-[#9AA19E] font-medium">
                    ({searchResults.privateCompanies.length})
                  </span>
                  <StatusBadge variant="warning" size="xs">
                    Demo Data
                  </StatusBadge>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                {searchResults.privateCompanies.map((company) => (
                  <PrivateCompanyCard
                    key={company.id}
                    company={company}
                    isWatchlisted={watchlistedIds.has(company.id)}
                    onToggleWatchlist={handleToggleWatchlist}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {searchResults.publicCompanies.length === 0 && searchResults.privateCompanies.length === 0 && searchQuery && (
            <div className="text-center py-16 bg-white border border-[#EDEDEB] rounded-lg">
              <Search className="w-8 h-8 text-[#EDEDEB] mx-auto mb-3" />
              <p className="text-sm font-medium text-[#525955]">No companies match &ldquo;{searchQuery}&rdquo;</p>
              <p className="text-xs text-[#9AA19E] mt-1">Try searching by company name, ticker, sector, or theme</p>
            </div>
          )}
        </div>
      )}

      {/* Sector Research Tab */}
      {activeTab === 'sectors' && (
        <div className="space-y-3">
          {SECTORS_RESEARCH.map((sector) => (
            <SectorCard
              key={sector.id}
              sector={sector}
              isExpanded={expandedSector === sector.id}
              onToggle={() => setExpandedSector(expandedSector === sector.id ? null : sector.id)}
            />
          ))}
        </div>
      )}

      {/* Thematic Research Tab */}
      {activeTab === 'themes' && (
        <div className="space-y-4">
          {THEMES_RESEARCH.map((theme) => (
            <ThematicCard
              key={theme.id}
              theme={theme}
              isExpanded={expandedTheme === theme.id}
              onToggle={() => setExpandedTheme(expandedTheme === theme.id ? null : theme.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// ========================================
// Private Company Card Sub-Component
// ========================================
const PrivateCompanyCard: React.FC<{
  company: PrivateCompanyIdentity;
  isWatchlisted: boolean;
  onToggleWatchlist: (id: string) => void;
}> = ({ company, isWatchlisted, onToggleWatchlist }) => (
  <div className="bg-white border border-[#EDEDEB] rounded-lg p-4 shadow-2xs hover:shadow-sm transition-all group">
    {/* Header */}
    <div className="flex items-start justify-between mb-3">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-[#1C1E20] text-white flex items-center justify-center text-xs font-bold">
          {company.logoLetter}
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold text-[#141618]">{company.name}</span>
            {company.isDemoMarked && (
              <span className="px-1 py-0.5 text-[9px] font-semibold bg-amber-50 text-amber-600 rounded">
                DEMO
              </span>
            )}
          </div>
          <div className="text-[10.5px] text-[#8C9390]">{company.industry} · {company.location}</div>
        </div>
      </div>
      <button
        onClick={() => onToggleWatchlist(company.id)}
        className={`p-1.5 rounded-md transition-colors ${
          isWatchlisted
            ? 'text-[#87BAA4] bg-[#EBF5F1]'
            : 'text-[#8C9390] hover:text-[#141618] hover:bg-[#F5F4F5]'
        }`}
      >
        {isWatchlisted ? <Check className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
      </button>
    </div>

    {/* Key Metrics */}
    <div className="grid grid-cols-2 gap-2 mb-3">
      <div className="p-2 bg-[#FAFAF9] rounded-md">
        <span className="text-[10px] text-[#9AA19E] block">Valuation</span>
        <span className="text-xs font-semibold text-[#141618] tabular-nums">{company.estimatedValuation}</span>
      </div>
      <div className="p-2 bg-[#FAFAF9] rounded-md">
        <span className="text-[10px] text-[#9AA19E] block">ARR</span>
        <span className="text-xs font-semibold text-[#141618] tabular-nums">{company.annualRecurringRevenue}</span>
      </div>
      <div className="p-2 bg-[#FAFAF9] rounded-md">
        <span className="text-[10px] text-[#9AA19E] block">Growth</span>
        <span className="text-xs font-semibold text-[#23683C] tabular-nums">{company.arrGrowthYoY}</span>
      </div>
      <div className="p-2 bg-[#FAFAF9] rounded-md">
        <span className="text-[10px] text-[#9AA19E] block">Runway</span>
        <span className="text-xs font-semibold text-[#141618] tabular-nums">{company.cashRunwayMonths}mo</span>
      </div>
    </div>

    {/* Data Certainty Badges */}
    <div className="flex flex-wrap gap-1.5 mb-3">
      {Object.entries(company.dataCertainty).map(([key, value]) => (
        <span
          key={key}
          className={`px-1.5 py-0.5 text-[9px] font-semibold rounded ${
            value === 'Verified'
              ? 'bg-[#EBF5F1] text-[#245241]'
              : value === 'Estimated'
              ? 'bg-amber-50 text-amber-600'
              : 'bg-[#F5F4F5] text-[#9AA19E]'
          }`}
        >
          {key.toUpperCase()}: {value}
        </span>
      ))}
    </div>

    {/* Risk & Status */}
    <div className="flex items-center justify-between pt-2 border-t border-[#EDEDEB]/60">
      <StatusBadge
        variant={company.riskIndicator === 'Low' ? 'success' : company.riskIndicator === 'Moderate' ? 'warning' : 'danger'}
        size="xs"
      >
        {company.riskIndicator} Risk
      </StatusBadge>
      <StatusBadge
        variant={company.researchStatus === 'Analyzed' ? 'success' : company.researchStatus === 'Researching' ? 'warning' : 'neutral'}
        size="xs"
        dot
      >
        {company.researchStatus}
      </StatusBadge>
    </div>
  </div>
);

// ========================================
// Sector Research Card
// ========================================
const SectorCard: React.FC<{
  sector: SectorResearchItem;
  isExpanded: boolean;
  onToggle: () => void;
}> = ({ sector, isExpanded, onToggle }) => (
  <div className="bg-white border border-[#EDEDEB] rounded-lg shadow-2xs overflow-hidden transition-all">
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-between px-5 py-4 hover:bg-[#FAFAF9] transition-colors text-left cursor-pointer"
    >
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-[#EBF5F1] flex items-center justify-center">
          <Layers className="w-4.5 h-4.5 text-[#367963]" />
        </div>
        <div>
          <div className="text-sm font-semibold text-[#141618]">{sector.name}</div>
          <div className="text-[10.5px] text-[#8C9390]">
            {sector.majorCompanies.length} major companies tracked
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-right hidden sm:block">
          <div className="text-xs font-semibold text-[#141618] tabular-nums">{sector.marketSize}</div>
          <div className="text-[10px] text-[#9AA19E]">Market Size</div>
        </div>
        <div className="text-right hidden sm:block">
          <div className="text-xs font-semibold text-[#23683C] tabular-nums">{sector.projectedGrowth}</div>
          <div className="text-[10px] text-[#9AA19E]">Growth</div>
        </div>
        <div className="text-right hidden md:block">
          <div className="text-xs font-semibold text-[#525955] tabular-nums">{sector.averageMargin}</div>
          <div className="text-[10px] text-[#9AA19E]">Avg Margin</div>
        </div>
        <div className="text-right hidden md:block">
          <div className="text-xs font-semibold text-[#525955] tabular-nums">{sector.averageValuationEV}</div>
          <div className="text-[10px] text-[#9AA19E]">Avg Valuation</div>
        </div>
        <ChevronRight className={`w-4 h-4 text-[#9AA19E] transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`} />
      </div>
    </button>

    {isExpanded && (
      <div className="px-5 pb-5 border-t border-[#EDEDEB] pt-4 animate-in fade-in slide-in-from-top-1 duration-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Key Trends */}
          <div>
            <div className="flex items-center gap-1.5 mb-2.5">
              <Zap className="w-3.5 h-3.5 text-[#87BAA4]" />
              <span className="text-[10.5px] font-semibold uppercase tracking-wider text-[#9AA19E]">Key Trends</span>
            </div>
            <ul className="space-y-2">
              {sector.keyTrends.map((trend, i) => (
                <li key={i} className="text-xs text-[#525955] leading-relaxed flex gap-2">
                  <span className="text-[#87BAA4] mt-0.5 shrink-0">•</span>
                  {trend}
                </li>
              ))}
            </ul>
          </div>

          {/* Risks */}
          <div>
            <div className="flex items-center gap-1.5 mb-2.5">
              <ShieldAlert className="w-3.5 h-3.5 text-[#A5342C]" />
              <span className="text-[10.5px] font-semibold uppercase tracking-wider text-[#9AA19E]">Key Risks</span>
            </div>
            <ul className="space-y-2">
              {sector.risks.map((risk, i) => (
                <li key={i} className="text-xs text-[#525955] leading-relaxed flex gap-2">
                  <span className="text-[#A5342C] mt-0.5 shrink-0">•</span>
                  {risk}
                </li>
              ))}
            </ul>
          </div>

          {/* Major Companies */}
          <div>
            <div className="flex items-center gap-1.5 mb-2.5">
              <Building2 className="w-3.5 h-3.5 text-[#525955]" />
              <span className="text-[10.5px] font-semibold uppercase tracking-wider text-[#9AA19E]">Major Companies</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {sector.majorCompanies.map((name, i) => (
                <span key={i} className="px-2 py-1 rounded-md text-[11px] font-medium bg-[#F5F4F5] text-[#3E4542] border border-[#EDEDEB]">
                  {name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    )}
  </div>
);

// ========================================
// Thematic Research Card
// ========================================
const ThematicCard: React.FC<{
  theme: ThematicResearchItem;
  isExpanded: boolean;
  onToggle: () => void;
}> = ({ theme, isExpanded, onToggle }) => (
  <div className="bg-white border border-[#EDEDEB] rounded-lg shadow-2xs overflow-hidden transition-all">
    <button
      onClick={onToggle}
      className="w-full text-left px-5 py-5 hover:bg-[#FAFAF9] transition-colors cursor-pointer"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div className="w-9 h-9 rounded-lg bg-[#141618] flex items-center justify-center shrink-0">
            <Target className="w-4.5 h-4.5 text-[#87BAA4]" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-sm font-bold text-[#141618]">{theme.title}</span>
              <StatusBadge
                variant={theme.stage === 'Emerging' ? 'warning' : theme.stage === 'Scaling' ? 'sage' : 'neutral'}
                size="xs"
              >
                {theme.stage}
              </StatusBadge>
            </div>
            <p className="text-[11px] text-[#87BAA4] font-medium mb-1">{theme.tagline}</p>
            <p className="text-xs text-[#6C726F] leading-relaxed line-clamp-2">{theme.description}</p>
          </div>
        </div>
        <ChevronRight className={`w-4 h-4 text-[#9AA19E] transition-transform duration-200 shrink-0 ml-3 mt-1 ${isExpanded ? 'rotate-90' : ''}`} />
      </div>
    </button>

    {isExpanded && (
      <div className="px-5 pb-5 border-t border-[#EDEDEB] pt-4 animate-in fade-in slide-in-from-top-1 duration-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left: Drivers & Opportunities */}
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <TrendingUp className="w-3.5 h-3.5 text-[#87BAA4]" />
                <span className="text-[10.5px] font-semibold uppercase tracking-wider text-[#9AA19E]">Market Drivers</span>
              </div>
              <ul className="space-y-1.5">
                {theme.marketDrivers.map((d, i) => (
                  <li key={i} className="text-xs text-[#525955] leading-relaxed flex gap-2">
                    <span className="text-[#87BAA4] mt-0.5 shrink-0">▸</span>
                    {d}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <Zap className="w-3.5 h-3.5 text-[#23683C]" />
                <span className="text-[10.5px] font-semibold uppercase tracking-wider text-[#9AA19E]">Growth Opportunities</span>
              </div>
              <ul className="space-y-1.5">
                {theme.growthOpportunities.map((o, i) => (
                  <li key={i} className="text-xs text-[#525955] leading-relaxed flex gap-2">
                    <span className="text-[#23683C] mt-0.5 shrink-0">+</span>
                    {o}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right: Companies & Developments */}
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <Globe className="w-3.5 h-3.5 text-[#525955]" />
                <span className="text-[10.5px] font-semibold uppercase tracking-wider text-[#9AA19E]">Companies Exposed</span>
              </div>
              <div className="space-y-1.5">
                {theme.companiesExposed.map((c, i) => (
                  <div key={i} className="flex items-center justify-between p-2 bg-[#FAFAF9] rounded-md">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-[#141618]">{c.name}</span>
                      {c.ticker && (
                        <span className="px-1 py-0.5 text-[9px] font-mono font-bold bg-[#EDEDEB] text-[#525955] rounded">
                          {c.ticker}
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-[#8C9390] max-w-[45%] text-right">{c.role}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                <span className="text-[10.5px] font-semibold uppercase tracking-wider text-[#9AA19E]">Key Risks</span>
              </div>
              <ul className="space-y-1.5">
                {theme.risks.map((r, i) => (
                  <li key={i} className="text-xs text-[#525955] leading-relaxed flex gap-2">
                    <span className="text-amber-500 mt-0.5 shrink-0">⚠</span>
                    {r}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <FileText className="w-3.5 h-3.5 text-[#87BAA4]" />
                <span className="text-[10.5px] font-semibold uppercase tracking-wider text-[#9AA19E]">Key Developments</span>
              </div>
              <ul className="space-y-1.5">
                {theme.keyDevelopments.map((d, i) => (
                  <li key={i} className="text-xs text-[#525955] leading-relaxed flex gap-2">
                    <span className="text-[#87BAA4] mt-0.5 shrink-0">→</span>
                    {d}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    )}
  </div>
);
