'use client';

import React, { useState, useEffect } from 'react';
import { Search, Bot, Building2, LayoutDashboard, Sparkles, PieChart, ArrowRight, X } from 'lucide-react';
import { INVESTMENT_OPPORTUNITIES } from '@/lib/mock-data';
import { DEMO_MARKETPLACE_AGENTS } from '@/lib/agentMarketplaceMockData';
import { NavItemKey } from '@/types';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectNav: (key: NavItemKey) => void;
  onSelectOpp: (opp: any) => void;
  onSelectAgent: (agent: any) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onSelectNav,
  onSelectOpp,
  onSelectAgent
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        // Toggle or open handled by parent
      }
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  const filteredOpps = INVESTMENT_OPPORTUNITIES.filter(
    (o) =>
      o.company.toLowerCase().includes(query.toLowerCase()) ||
      o.sector.toLowerCase().includes(query.toLowerCase())
  );

  const filteredAgents = DEMO_MARKETPLACE_AGENTS.filter(
    (a) =>
      a.name.toLowerCase().includes(query.toLowerCase()) ||
      a.specialization.toLowerCase().includes(query.toLowerCase()) ||
      a.category.toLowerCase().includes(query.toLowerCase()) ||
      a.capabilities.some(c => c.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <div 
      className="fixed inset-0 z-50 flex items-start justify-center pt-24 bg-black/40 backdrop-blur-xs p-4 animate-in fade-in duration-100"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl bg-white rounded-xl border border-[#EDEDEB] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Bar */}
        <div className="p-3.5 border-b border-[#EDEDEB] flex items-center gap-3 bg-[#FAFAF9]">
          <Search className="w-4 h-4 text-[#8C9390]" />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command, asset, or agent..."
            className="w-full bg-transparent text-sm text-[#18191B] placeholder-[#8C9390] focus:outline-none"
          />
          <button
            onClick={onClose}
            className="p-1 rounded text-[#8C9390] hover:text-[#18191B]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 text-xs divide-y divide-[#EDEDEB]/50">
          {/* Quick Navigation Items */}
          <div className="py-2">
            <div className="px-3 py-1 text-[10px] font-semibold text-[#8C9390] uppercase tracking-wider">
              Quick Navigation
            </div>
            <button
              onClick={() => {
                onSelectNav('command-center');
                onClose();
              }}
              className="w-full px-3 py-2 rounded-md flex items-center justify-between text-[#18191B] hover:bg-[#F5F4F5] transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <LayoutDashboard className="w-4 h-4 text-[#87BAA4]" />
                <span className="font-medium">Command Center</span>
              </div>
              <span className="text-[10px] text-[#8C9390]">Home</span>
            </button>
            <button
              onClick={() => {
                onSelectNav('agent-marketplace');
                onClose();
              }}
              className="w-full px-3 py-2 rounded-md flex items-center justify-between text-[#18191B] hover:bg-[#F5F4F5] transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <Bot className="w-4 h-4 text-[#87BAA4]" />
                <span className="font-medium">Agent Marketplace</span>
              </div>
              <span className="text-[10px] text-[#8C9390]">3 Agents</span>
            </button>
          </div>

          {/* Investment Opportunities */}
          {filteredOpps.length > 0 && (
            <div className="py-2">
              <div className="px-3 py-1 text-[10px] font-semibold text-[#8C9390] uppercase tracking-wider">
                Investment Pipeline
              </div>
              {filteredOpps.map((opp) => (
                <button
                  key={opp.id}
                  onClick={() => {
                    onSelectOpp(opp);
                    onClose();
                  }}
                  className="w-full px-3 py-2 rounded-md flex items-center justify-between text-[#18191B] hover:bg-[#F5F4F5] transition-colors text-left"
                >
                  <div className="flex items-center gap-2.5">
                    <Building2 className="w-4 h-4 text-[#8C9390]" />
                    <span className="font-medium">{opp.company}</span>
                    <span className="text-[10.5px] text-[#8C9390]">({opp.sector})</span>
                  </div>
                  <span className="text-[11px] font-semibold text-[#18191B]">{opp.valuation}</span>
                </button>
              ))}
            </div>
          )}

          {/* Specialist Agents */}
          {filteredAgents.length > 0 && (
            <div className="py-2">
              <div className="px-3 py-1 text-[10px] font-semibold text-[#8C9390] uppercase tracking-wider">
                Specialist AI Agents
              </div>
              {filteredAgents.map((agent) => (
                <button
                  key={agent.id}
                  onClick={() => {
                    onSelectAgent(agent);
                    onClose();
                  }}
                  className="w-full px-3 py-2 rounded-md flex items-center justify-between text-[#18191B] hover:bg-[#F5F4F5] transition-colors text-left"
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className="w-5 h-5 rounded flex items-center justify-center text-[9px] font-bold"
                      style={{ backgroundColor: agent.badgeBg, color: agent.badgeColor }}
                    >
                      {agent.badge}
                    </span>
                    <span className="font-medium">{agent.name}</span>
                    <span className="text-[10.5px] text-[#8C9390]">{agent.specialization}</span>
                  </div>
                  <span className="text-[10px] font-semibold text-[#87BAA4]">Hire ↗</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="p-2.5 border-t border-[#EDEDEB] bg-[#FAFAF9] flex items-center justify-between text-[10.5px] text-[#8C9390]">
          <span>Institutional Command Center Search</span>
          <div className="flex items-center gap-2">
            <span>ESC to close</span>
            <span>↵ to select</span>
          </div>
        </div>
      </div>
    </div>
  );
};
