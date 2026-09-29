'use client';

import React, { useState } from 'react';
import { FaroLogo } from '@/components/brand/FaroLogo';
import { WORKSPACES } from '@/lib/mock-data';
import { NavItemKey, Workspace } from '@/types';
import {
  LayoutDashboard,
  Sparkles,
  PieChart,
  Bot,
  TrendingUp,
  Building2,
  GitBranch,
  Bookmark,
  FileSearch,
  Calculator,
  ShieldAlert,
  ClipboardCheck,
  FileText,
  CheckSquare,
  Clock,
  Activity,
  FolderClosed,
  Workflow,
  Coins,
  Settings,
  HelpCircle,
  ChevronDown,
  Check,
  Plus,
  X,
  Database
} from 'lucide-react';

interface FaroSidebarProps {
  currentTab: NavItemKey;
  onSelectTab: (tab: NavItemKey) => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
  currentWorkspace: Workspace;
  onSelectWorkspace: (ws: Workspace) => void;
}

export const FaroSidebar: React.FC<FaroSidebarProps> = ({
  currentTab,
  onSelectTab,
  isOpenMobile = false,
  onCloseMobile,
  currentWorkspace,
  onSelectWorkspace
}) => {
  const [isWorkspaceDropdownOpen, setIsWorkspaceDropdownOpen] = useState(false);

  const mainNavItems = [
    { key: 'command-center' as NavItemKey, label: 'Command Center', icon: LayoutDashboard },
    { key: 'research-workspace' as NavItemKey, label: 'Research Workspace', icon: Sparkles },
    { key: 'portfolio-allocation' as NavItemKey, label: 'Portfolio Allocation', icon: PieChart },
    { 
      key: 'agent-marketplace' as NavItemKey, 
      label: 'Agent Marketplace', 
      icon: Bot,
      badge: '6'
    },
    { 
      key: 'agent-orchestrator' as NavItemKey, 
      label: 'Agent Orchestrator', 
      icon: Workflow,
      badge: 'New'
    },
    { 
      key: 'agent-economy' as NavItemKey, 
      label: 'Agent Economy', 
      icon: Coins 
    },
  ];

  const investmentItems = [
    { key: 'public-markets' as NavItemKey, label: 'Public Markets', icon: TrendingUp },
    { key: 'private-markets' as NavItemKey, label: 'Private Markets', icon: Building2 },
    { key: 'deal-pipeline' as NavItemKey, label: 'Deal Pipeline', icon: GitBranch },
    { key: 'watchlist' as NavItemKey, label: 'Watchlist', icon: Bookmark },
  ];

  const intelligenceItems = [
    { key: 'research' as NavItemKey, label: 'Research', icon: FileSearch },
    { key: 'valuations' as NavItemKey, label: 'Valuations', icon: Calculator },
    { key: 'risk' as NavItemKey, label: 'Risk', icon: ShieldAlert },
    { key: 'due-diligence' as NavItemKey, label: 'Due Diligence', icon: ClipboardCheck },
    { key: 'investment-memos' as NavItemKey, label: 'Investment Memos', icon: FileText },
  ];

  const operationsItems = [
    { key: 'tasks' as NavItemKey, label: 'Tasks', icon: CheckSquare },
    { key: 'work-orders' as NavItemKey, label: 'Work Orders', icon: Clock },
    { key: 'agent-activity' as NavItemKey, label: 'Agent Activity', icon: Activity },
    { key: 'documents' as NavItemKey, label: 'Documents', icon: FolderClosed },
    { key: 'data-health' as NavItemKey, label: 'Data Health', icon: Database },
  ];

  const renderNavGroup = (title: string, items: typeof mainNavItems) => (
    <div className="mb-5">
      <div className="px-3 mb-1.5 text-[10px] font-semibold tracking-wider text-[#9AA19E] uppercase">
        {title}
      </div>
      <div className="space-y-0.5">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.key;
          return (
            <button
              key={item.key}
              onClick={() => {
                onSelectTab(item.key);
                if (onCloseMobile) onCloseMobile();
              }}
              className={`w-full flex items-center justify-between px-3 py-1.5 rounded-md text-[13px] font-medium transition-all group ${
                isActive
                  ? 'bg-[#EBF5F1] text-[#245241] shadow-xs'
                  : 'text-[#474E4A] hover:bg-[#F5F4F5] hover:text-[#18191B]'
              }`}
            >
              <div className="flex items-center gap-2.5 truncate">
                <Icon
                  className={`w-4 h-4 shrink-0 transition-colors ${
                    isActive ? 'text-[#3E7C66]' : 'text-[#878E8B] group-hover:text-[#474E4A]'
                  }`}
                />
                <span className="truncate">{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`px-1.5 py-0.2 text-[10px] font-semibold rounded-full ${
                    isActive
                      ? 'bg-[#BAD6CC] text-[#204A3B]'
                      : 'bg-[#EDEDEB] text-[#636A66]'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile backdrop */}
      {isOpenMobile && (
        <div 
          className="fixed inset-0 z-40 bg-black/25 backdrop-blur-xs md:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`fixed md:sticky top-0 left-0 z-50 h-screen w-64 shrink-0 bg-white border-r border-[#EDEDEB] flex flex-col justify-between transition-transform duration-200 ease-in-out md:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Top Header & Logo */}
        <div className="p-4 pb-3 border-b border-[#EDEDEB]/70 flex items-center justify-between">
          <FaroLogo size="md" />
          {isOpenMobile && (
            <button
              onClick={onCloseMobile}
              className="p-1 rounded-md text-neutral-400 hover:text-neutral-700 hover:bg-[#F5F4F5] md:hidden"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Scrollable Navigation Area */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-4">
          {/* Workspace Selector */}
          <div>
            <div className="px-3 mb-1.5 text-[10px] font-semibold tracking-wider text-[#9AA19E] uppercase">
              Workspace
            </div>
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsWorkspaceDropdownOpen(!isWorkspaceDropdownOpen)}
                className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-md border border-[#EDEDEB] bg-white hover:bg-[#F9F9F9] transition-colors text-left"
              >
                <div className="flex items-center gap-2 truncate">
                  <span className="w-2 h-2 rounded-full bg-[#87BAA4] shrink-0" />
                  <span className="text-[12.5px] font-medium text-[#18191B] truncate">
                    {currentWorkspace.name}
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-[#9AA19E] shrink-0 ml-1" />
              </button>

              {/* Workspace Dropdown */}
              {isWorkspaceDropdownOpen && (
                <div className="absolute top-full left-0 mt-1 w-full bg-white rounded-md border border-[#EDEDEB] shadow-lg py-1 z-30 animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-3 py-1 text-[10px] font-semibold text-[#9AA19E] uppercase border-b border-[#EDEDEB]/50">
                    Switch Fund
                  </div>
                  {WORKSPACES.map((ws) => (
                    <button
                      key={ws.id}
                      onClick={() => {
                        onSelectWorkspace(ws);
                        setIsWorkspaceDropdownOpen(false);
                      }}
                      className="w-full px-3 py-2 text-left text-xs flex items-center justify-between hover:bg-[#F5F4F5] transition-colors"
                    >
                      <div>
                        <div className="font-medium text-[#18191B]">{ws.name}</div>
                        <div className="text-[11px] text-[#9AA19E]">{ws.aum} · {ws.strategy}</div>
                      </div>
                      {ws.id === currentWorkspace.id && (
                        <Check className="w-3.5 h-3.5 text-[#87BAA4]" />
                      )}
                    </button>
                  ))}
                  <div className="border-t border-[#EDEDEB]/60 mt-1 pt-1">
                    <button
                      onClick={() => {
                        setIsWorkspaceDropdownOpen(false);
                      }}
                      className="w-full px-3 py-1.5 text-left text-[11px] font-medium text-[#2E5E4C] hover:bg-[#EBF5F1] transition-colors flex items-center gap-1.5"
                    >
                      <Plus className="w-3 h-3" />
                      Create Workspace
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Primary Navigation */}
          <div className="space-y-0.5">
            {mainNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.key;
              return (
                <button
                  key={item.key}
                  onClick={() => {
                    onSelectTab(item.key);
                    if (onCloseMobile) onCloseMobile();
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-[13px] font-medium transition-all group ${
                    isActive
                      ? 'bg-[#EBF5F1] text-[#1E4D3C] font-semibold'
                      : 'text-[#3E4542] hover:bg-[#F5F4F5] hover:text-[#141618]'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Icon
                      className={`w-4 h-4 shrink-0 transition-colors ${
                        isActive ? 'text-[#367963]' : 'text-[#878E8B] group-hover:text-[#474E4A]'
                      }`}
                    />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`px-1.5 py-0.5 text-[10px] font-semibold rounded-full ${
                        isActive
                          ? 'bg-[#BAD6CC] text-[#194033]'
                          : 'bg-[#EDEDEB] text-[#636A66]'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Group 2: Investments */}
          {renderNavGroup('Investments', investmentItems)}

          {/* Group 3: Intelligence */}
          {renderNavGroup('Intelligence', intelligenceItems)}

          {/* Group 4: Operations */}
          {renderNavGroup('Operations', operationsItems)}
        </div>

        {/* Bottom Sidebar: Settings, Help & User Profile */}
        <div className="p-3 border-t border-[#EDEDEB] bg-white space-y-1">
          <button
            onClick={() => onSelectTab('settings')}
            className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-md text-[13px] font-medium transition-colors ${
              currentTab === 'settings'
                ? 'bg-[#EBF5F1] text-[#245241]'
                : 'text-[#5C6460] hover:bg-[#F5F4F5] hover:text-[#18191B]'
            }`}
          >
            <Settings className="w-4 h-4 text-[#8C9390]" />
            <span>Settings</span>
          </button>

          <button
            onClick={() => onSelectTab('help')}
            className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-md text-[13px] font-medium transition-colors ${
              currentTab === 'help'
                ? 'bg-[#EBF5F1] text-[#245241]'
                : 'text-[#5C6460] hover:bg-[#F5F4F5] hover:text-[#18191B]'
            }`}
          >
            <HelpCircle className="w-4 h-4 text-[#8C9390]" />
            <span>Help & Docs</span>
          </button>

          {/* User Profile Card */}
          <div className="pt-2 mt-1 border-t border-[#EDEDEB]/70 flex items-center justify-between px-2 py-1">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-[#18191B] text-white flex items-center justify-center text-[11px] font-semibold tracking-wide">
                FM
              </div>
              <div className="flex flex-col text-left">
                <span className="text-xs font-semibold text-[#18191B] leading-tight">
                  Felix Martinez
                </span>
                <span className="text-[10.5px] text-[#9AA19E] leading-tight">
                  General Partner
                </span>
              </div>
            </div>
            <div className="w-2 h-2 rounded-full bg-[#87BAA4]" title="Connected" />
          </div>
        </div>
      </aside>
    </>
  );
};
