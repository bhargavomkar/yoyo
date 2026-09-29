'use client';

import React from 'react';
import { Search, Menu, Bell, Terminal } from 'lucide-react';
import { NavItemKey } from '@/types';
import { DataLayerService } from '@/services/dataLayerService';

interface TopNavigationProps {
  currentTab: NavItemKey;
  onOpenSearch: () => void;
  onToggleMobileSidebar: () => void;
}

const TAB_TITLES: Record<NavItemKey, string> = {
  'command-center': 'Command Center',
  'research-workspace': 'Research Workspace',
  'portfolio-allocation': 'Portfolio Allocation',
  'agent-marketplace': 'Agent Marketplace',
  'public-markets': 'Public Markets',
  'private-markets': 'Private Markets',
  'deal-pipeline': 'Deal Pipeline',
  'watchlist': 'Watchlist',
  'research': 'Research',
  'valuations': 'Valuations',
  'risk': 'Risk',
  'due-diligence': 'Due Diligence',
  'investment-memos': 'Investment Memos',
  'tasks': 'Tasks',
  'work-orders': 'Work Orders',
  'agent-activity': 'Agent Activity',
  'documents': 'Documents',
  'settings': 'Settings',
  'data-health': 'Data Health',
  'help': 'Help & Documentation',
  'agent-orchestrator': 'Faro Orchestrator',
  'agent-economy': 'Agent Economy'
};

// ---- Data Mode Indicator Component ----

const DataModeIndicator: React.FC = () => {
  const dataMode = DataLayerService.isDemo() ? 'demo' : 'live';
  
  return (
    <div className={`hidden sm:flex items-center gap-2 px-2 py-1 rounded border text-[10px] md:text-[10.5px] font-semibold tracking-wider uppercase ${
      dataMode === 'demo'
        ? 'bg-amber-50 border-amber-200 text-amber-700' 
        : 'bg-[#EBF5F1]/80 border-[#BAD6CC]/60 text-[#2D604E]'
    }`}>
      {dataMode === 'demo' ? (
        <>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
          <span>DEMO MODE</span>
        </>
      ) : (
        <>
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#87BAA4] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#87BAA4]"></span>
          </span>
          <span>DATA: LIVE</span>
        </>
      )}
    </div>
  );
};

export const TopNavigation: React.FC<TopNavigationProps> = ({
  currentTab,
  onOpenSearch,
  onToggleMobileSidebar
}) => {
  return (
    <header className="sticky top-0 z-30 h-14 bg-white/95 backdrop-blur-md border-b border-[#EDEDEB] px-4 md:px-8 flex items-center justify-between">
      {/* Left: Mobile hamburger & Institutional Breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileSidebar}
          className="p-1.5 -ml-1.5 rounded-md text-[#555C58] hover:bg-[#F5F4F5] md:hidden"
          aria-label="Toggle Navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Institutional Breadcrumb */}
        <nav className="flex items-center text-xs md:text-[13px] tracking-tight text-[#9AA19E] select-none font-medium">
          <span className="font-semibold text-[#666D69] tracking-wider uppercase text-[11px] md:text-xs">
            FARO
          </span>
          <span className="mx-2 text-[#C4C7C5]">/</span>
          <span className="text-[#141618] font-medium">
            {TAB_TITLES[currentTab] || 'Command Center'}
          </span>
        </nav>
      </div>

      {/* Right side utilities */}
      <div className="flex items-center gap-3 md:gap-5">
        {/* Search trigger button styled to feel like Linear / Institutional terminal */}
        <button
          onClick={onOpenSearch}
          className="flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs text-[#6F7673] bg-[#F5F4F5] hover:bg-[#EDEDEB] hover:text-[#18191B] border border-[#EDEDEB] transition-colors"
          title="Open Search (Cmd + K)"
        >
          <Search className="w-3.5 h-3.5 text-[#9AA19E]" />
          <span className="hidden sm:inline text-[11.5px] font-normal">Search assets, agents, memos...</span>
          <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[9.5px] font-mono text-[#8C9390] bg-white border border-[#EDEDEB] rounded shadow-2xs">
            ⌘K
          </kbd>
        </button>

        {/* Data Mode Indicator */}
        <DataModeIndicator />

        {/* Notifications / Activity Bell */}
        <button 
          className="p-1.5 rounded-md text-[#78807C] hover:text-[#18191B] hover:bg-[#F5F4F5] transition-colors relative"
          title="Live intelligence alerts"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-[#87BAA4] rounded-full" />
        </button>

        {/* User Avatar matching screenshot */}
        <div 
          className="w-7 h-7 rounded-full bg-[#141618] text-white flex items-center justify-center text-[11px] font-semibold tracking-wider shadow-2xs select-none cursor-pointer hover:ring-2 hover:ring-[#87BAA4]/50 transition-all"
          title="Felix Martinez (General Partner)"
        >
          FM
        </div>
      </div>
    </header>
  );
};
