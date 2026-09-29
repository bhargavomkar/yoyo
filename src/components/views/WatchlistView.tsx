'use client';

import React, { useState, useMemo } from 'react';
import { WatchlistItem } from '@/types/research';
import { INITIAL_WATCHLIST, PUBLIC_COMPANIES, PRIVATE_COMPANIES } from '@/lib/research-mock-data';
import { StatusBadge } from '@/components/ui/StatusBadge';
import {
  Bookmark,
  TrendingUp,
  Building2,
  Search,
  ArrowUpRight,
  Trash2,
  ChevronRight,
  Eye,
  BarChart3,
  Sparkles,
  Clock,
  Filter,
  SortAsc,
  X,
  AlertCircle
} from 'lucide-react';

type WatchlistFilter = 'all' | 'public' | 'private';
type WatchlistSort = 'name' | 'growth' | 'risk' | 'lastAnalyzed';

interface WatchlistViewProps {
  onNavigateToResearch: () => void;
}

export const WatchlistView: React.FC<WatchlistViewProps> = ({ onNavigateToResearch }) => {
  const [items, setItems] = useState<WatchlistItem[]>(INITIAL_WATCHLIST);
  const [filter, setFilter] = useState<WatchlistFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<WatchlistSort>('name');

  const filteredItems = useMemo(() => {
    let result = [...items];

    // Filter by type
    if (filter === 'public') result = result.filter(i => i.type === 'public');
    if (filter === 'private') result = result.filter(i => i.type === 'private');

    // Filter by search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(i =>
        i.name.toLowerCase().includes(q) ||
        (i.ticker && i.ticker.toLowerCase().includes(q)) ||
        i.thesisSnapshot.toLowerCase().includes(q)
      );
    }

    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case 'name': return a.name.localeCompare(b.name);
        case 'growth': {
          const gA = parseFloat(a.growth.replace(/[+%YoY ]/g, ''));
          const gB = parseFloat(b.growth.replace(/[+%YoY ]/g, ''));
          return gB - gA;
        }
        case 'risk': {
          const riskOrder = { 'Low': 0, 'Moderate': 1, 'Managed': 2, 'High': 3 };
          return (riskOrder[a.risk] || 0) - (riskOrder[b.risk] || 0);
        }
        case 'lastAnalyzed': return b.lastAnalyzed.localeCompare(a.lastAnalyzed);
        default: return 0;
      }
    });

    return result;
  }, [items, filter, searchQuery, sortBy]);

  const removeFromWatchlist = (id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const publicCount = items.filter(i => i.type === 'public').length;
  const privateCount = items.filter(i => i.type === 'private').length;

  return (
    <div className="space-y-6 pb-12 max-w-6xl mx-auto animate-in fade-in duration-150">
      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="text-[10.5px] font-semibold uppercase tracking-wider text-[#87BAA4]">
            Portfolio Intelligence
          </span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-[#141618]">
              Watchlist
            </h1>
            <p className="text-xs text-[#6C726F] mt-0.5">
              Monitored companies across public and private markets · {items.length} companies tracked
            </p>
          </div>
          <button
            onClick={onNavigateToResearch}
            className="px-3.5 py-2 rounded-md bg-[#141618] hover:bg-neutral-800 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Add Companies</span>
          </button>
        </div>
      </div>

      {/* Watchlist Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        <div className="p-3.5 bg-white border border-[#EDEDEB] rounded-lg shadow-2xs">
          <div className="text-[10.5px] text-[#9AA19E] font-medium mb-0.5">Total Tracked</div>
          <div className="text-xl font-bold text-[#141618] tabular-nums">{items.length}</div>
        </div>
        <div className="p-3.5 bg-white border border-[#EDEDEB] rounded-lg shadow-2xs">
          <div className="text-[10.5px] text-[#9AA19E] font-medium mb-0.5">Public Markets</div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-bold text-[#141618] tabular-nums">{publicCount}</span>
            <TrendingUp className="w-3.5 h-3.5 text-[#87BAA4]" />
          </div>
        </div>
        <div className="p-3.5 bg-white border border-[#EDEDEB] rounded-lg shadow-2xs">
          <div className="text-[10.5px] text-[#9AA19E] font-medium mb-0.5">Private Markets</div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-bold text-[#141618] tabular-nums">{privateCount}</span>
            <Building2 className="w-3.5 h-3.5 text-[#87BAA4]" />
          </div>
        </div>
        <div className="p-3.5 bg-white border border-[#EDEDEB] rounded-lg shadow-2xs">
          <div className="text-[10.5px] text-[#9AA19E] font-medium mb-0.5">Fully Analyzed</div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-bold text-[#23683C] tabular-nums">
              {items.filter(i => i.researchStatus === 'Analyzed').length}
            </span>
            <span className="text-[10px] text-[#9AA19E]">/ {items.length}</span>
          </div>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#EDEDEB] pb-3">
        {/* Filters */}
        <div className="flex items-center gap-1">
          {[
            { key: 'all' as WatchlistFilter, label: 'All', count: items.length },
            { key: 'public' as WatchlistFilter, label: 'Public', count: publicCount },
            { key: 'private' as WatchlistFilter, label: 'Private', count: privateCount },
          ].map(f => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                filter === f.key
                  ? 'bg-[#EBF5F1] text-[#245241] font-semibold'
                  : 'text-[#6C726F] hover:text-[#141618] hover:bg-[#F5F4F5]'
              }`}
            >
              {f.label}
              <span className={`ml-1 text-[10px] ${filter === f.key ? 'text-[#367963]' : 'text-[#9AA19E]'}`}>
                {f.count}
              </span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#9AA19E]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter watchlist..."
              className="pl-8 pr-3 py-1.5 rounded-md border border-[#EDEDEB] bg-white text-xs text-[#141618] placeholder:text-[#9AA19E] focus:outline-none focus:ring-1 focus:ring-[#87BAA4]/40 w-44"
            />
          </div>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as WatchlistSort)}
            className="px-2.5 py-1.5 rounded-md border border-[#EDEDEB] bg-white text-xs text-[#525955] focus:outline-none focus:ring-1 focus:ring-[#87BAA4]/40 cursor-pointer"
          >
            <option value="name">Sort: Name</option>
            <option value="growth">Sort: Growth</option>
            <option value="risk">Sort: Risk</option>
            <option value="lastAnalyzed">Sort: Last Analyzed</option>
          </select>
        </div>
      </div>

      {/* Watchlist Table */}
      {filteredItems.length > 0 ? (
        <div className="bg-white border border-[#EDEDEB] rounded-lg shadow-2xs overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-3 px-5 py-2.5 bg-[#FAFAF9] border-b border-[#EDEDEB] text-[10px] font-semibold text-[#9AA19E] uppercase tracking-wider">
            <div className="col-span-3">Company</div>
            <div className="col-span-1 text-center">Type</div>
            <div className="col-span-2 text-right">Price / Valuation</div>
            <div className="col-span-1 text-right">Growth</div>
            <div className="col-span-1 text-center">Risk</div>
            <div className="col-span-1 text-center">Research</div>
            <div className="col-span-2">Thesis Snapshot</div>
            <div className="col-span-1 text-right">Actions</div>
          </div>

          {/* Table Rows */}
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="grid grid-cols-12 gap-3 px-5 py-3.5 border-b border-[#EDEDEB]/60 hover:bg-[#FAFAF9] transition-colors items-center group"
            >
              <div className="col-span-3 flex items-center gap-2.5 min-w-0">
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-bold shrink-0 ${
                  item.type === 'public'
                    ? 'bg-[#141618] text-white'
                    : 'bg-[#1C1E20] text-[#87BAA4]'
                }`}>
                  {item.name.charAt(0)}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-semibold text-[#141618] truncate">{item.name}</span>
                    {item.ticker && (
                      <span className="px-1 py-0.5 rounded text-[10px] font-mono font-bold bg-[#EDEDEB] text-[#525955] shrink-0">
                        {item.ticker}
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] text-[#8C9390]">
                    Last analyzed: {item.lastAnalyzed}
                  </div>
                </div>
              </div>

              <div className="col-span-1 text-center">
                <StatusBadge variant={item.type === 'public' ? 'sage' : 'neutral'} size="xs">
                  {item.type === 'public' ? 'Public' : 'Private'}
                </StatusBadge>
              </div>

              <div className="col-span-2 text-right text-xs font-semibold text-[#141618] tabular-nums">
                {item.priceOrValuation}
              </div>

              <div className="col-span-1 text-right">
                <span className="text-xs font-semibold text-[#23683C] tabular-nums">{item.growth}</span>
              </div>

              <div className="col-span-1 text-center">
                <StatusBadge
                  variant={item.risk === 'Low' ? 'success' : item.risk === 'Moderate' ? 'warning' : item.risk === 'Managed' ? 'sage' : 'danger'}
                  size="xs"
                >
                  {item.risk}
                </StatusBadge>
              </div>

              <div className="col-span-1 text-center">
                <StatusBadge
                  variant={item.researchStatus === 'Analyzed' ? 'success' : item.researchStatus === 'Researching' ? 'warning' : 'neutral'}
                  size="xs"
                  dot
                >
                  {item.researchStatus}
                </StatusBadge>
              </div>

              <div className="col-span-2">
                <p className="text-[11px] text-[#6C726F] leading-relaxed line-clamp-2">
                  {item.thesisSnapshot}
                </p>
              </div>

              <div className="col-span-1 flex items-center justify-end gap-1">
                <button
                  onClick={() => removeFromWatchlist(item.id)}
                  className="p-1.5 rounded-md text-[#8C9390] hover:text-[#A5342C] hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
                  title="Remove from Watchlist"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white border border-[#EDEDEB] rounded-lg">
          <Bookmark className="w-8 h-8 text-[#EDEDEB] mx-auto mb-3" />
          <p className="text-sm font-medium text-[#525955]">
            {searchQuery ? `No results for "${searchQuery}"` : 'No companies in your watchlist'}
          </p>
          <p className="text-xs text-[#9AA19E] mt-1">
            {searchQuery ? 'Try a different search term' : 'Add companies from the Research Workspace'}
          </p>
          {!searchQuery && (
            <button
              onClick={onNavigateToResearch}
              className="mt-4 px-4 py-2 rounded-md bg-[#141618] text-white text-xs font-semibold hover:bg-neutral-800 transition-colors shadow-2xs cursor-pointer"
            >
              Go to Research Workspace
            </button>
          )}
        </div>
      )}
    </div>
  );
};
