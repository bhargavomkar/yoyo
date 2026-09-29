'use client';

import React, { useMemo } from 'react';
import { Deal, DealStage } from '@/types/deal';
import { DealService } from '@/services/dealService';
import { Plus, Filter, Search, ArrowRight, Activity, AlertCircle } from 'lucide-react';
import { StatusBadge } from '@/components/ui/StatusBadge';

const STAGES: { id: DealStage; label: string }[] = [
  { id: 'sourced', label: 'Sourced' },
  { id: 'screening', label: 'Screening' },
  { id: 'research', label: 'Research' },
  { id: 'diligence', label: 'Due Diligence' },
  { id: 'ic_review', label: 'IC Review' },
  { id: 'negotiation', label: 'Negotiation' },
  { id: 'closed', label: 'Closed' },
  { id: 'passed', label: 'Passed' },
];

interface DealPipelineViewProps {
  onSelectDeal: (dealId: string) => void;
}

export const DealPipelineView: React.FC<DealPipelineViewProps> = ({ onSelectDeal }) => {
  const deals = useMemo(() => DealService.getPipelineDeals(), []);

  const dealsByStage = useMemo(() => {
    const map = new Map<DealStage, Deal[]>();
    STAGES.forEach(s => map.set(s.id, []));
    deals.forEach(d => {
      const list = map.get(d.stage) || [];
      list.push(d);
      map.set(d.stage, list);
    });
    return map;
  }, [deals]);

  const metrics = useMemo(() => DealService.getPipelineMetrics(), []);

  return (
    <div className="space-y-6 pb-12 max-w-[1600px] mx-auto animate-in fade-in duration-150 h-full flex flex-col">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[1.75rem] font-bold text-[#141618] tracking-tight">Deal Pipeline</h1>
          <p className="text-[0.85rem] text-[#6B7280] mt-1">
            Track and manage private investment opportunities across the lifecycle.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#9AA19E]" />
            <input 
              type="text" 
              placeholder="Search deals..." 
              className="pl-9 pr-4 py-2 bg-white border border-[#EDEDEB] rounded-lg text-sm focus:outline-none focus:border-[#87BAA4] w-64 transition-colors shadow-2xs"
            />
          </div>
          <button className="flex items-center gap-2 px-3 py-2 bg-white border border-[#EDEDEB] rounded-lg text-sm font-semibold text-[#141618] hover:bg-[#FAFAF9] transition-colors shadow-2xs">
            <Filter className="w-4 h-4 text-[#6B7280]" />
            Filters
          </button>
          <button className="flex items-center gap-2 px-3 py-2 bg-[#141618] text-white rounded-lg text-sm font-semibold hover:bg-neutral-800 transition-colors shadow-2xs">
            <Plus className="w-4 h-4" />
            New Deal
          </button>
        </div>
      </div>

      {/* Pipeline Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-[#EDEDEB] rounded-xl p-4 shadow-2xs">
          <div className="text-[10.5px] font-semibold text-[#9AA19E] uppercase tracking-wider mb-1">Active Deals</div>
          <div className="text-2xl font-bold text-[#141618]">{metrics.activeDeals}</div>
        </div>
        <div className="bg-white border border-[#EDEDEB] rounded-xl p-4 shadow-2xs">
          <div className="text-[10.5px] font-semibold text-[#9AA19E] uppercase tracking-wider mb-1">Pipeline Value</div>
          <div className="text-2xl font-bold text-[#141618]">
            ${(metrics.totalPipelineValue / 1000000).toFixed(1)}M
          </div>
        </div>
        <div className="bg-white border border-[#EDEDEB] rounded-xl p-4 shadow-2xs">
          <div className="text-[10.5px] font-semibold text-[#9AA19E] uppercase tracking-wider mb-1">In Due Diligence</div>
          <div className="text-2xl font-bold text-[#141618]">{metrics.dealsInDiligence}</div>
        </div>
        <div className="bg-white border border-[#EDEDEB] rounded-xl p-4 shadow-2xs">
          <div className="text-[10.5px] font-semibold text-[#9AA19E] uppercase tracking-wider mb-1">IC Review</div>
          <div className="text-2xl font-bold text-[#141618]">{metrics.dealsInIC}</div>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 flex gap-4 overflow-x-auto pb-4">
        {STAGES.map(stage => {
          const stageDeals = dealsByStage.get(stage.id) || [];
          return (
            <div key={stage.id} className="min-w-[280px] w-[280px] flex flex-col gap-3">
              {/* Column Header */}
              <div className="flex items-center justify-between pb-2 border-b-2 border-[#EDEDEB]">
                <h3 className="text-xs font-semibold text-[#141618] uppercase tracking-wider">{stage.label}</h3>
                <span className="text-[10px] font-semibold bg-[#F5F4F5] text-[#6B7280] px-2 py-0.5 rounded-full">
                  {stageDeals.length}
                </span>
              </div>

              {/* Cards */}
              <div className="flex-1 overflow-y-auto space-y-3">
                {stageDeals.map(deal => (
                  <div 
                    key={deal.id}
                    onClick={() => onSelectDeal(deal.id)}
                    className="bg-white border border-[#EDEDEB] rounded-xl p-4 shadow-sm hover:shadow-md hover:border-[#BAD6CC] transition-all cursor-pointer group"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="text-sm font-bold text-[#141618] group-hover:text-[#87BAA4] transition-colors">
                        {deal.companyName}
                      </h4>
                      {deal.riskStatus === 'high' || deal.riskStatus === 'critical' ? (
                        <AlertCircle className="w-4 h-4 text-[#DC2626]" />
                      ) : null}
                    </div>
                    
                    <div className="text-xs text-[#6B7280] mb-3">{deal.industry}</div>

                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <div>
                        <div className="text-[10px] text-[#9AA19E] uppercase tracking-wider">Round</div>
                        <div className="text-xs font-semibold text-[#141618]">{deal.dealType}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-[#9AA19E] uppercase tracking-wider">Size</div>
                        <div className="text-xs font-semibold text-[#141618]">${(deal.roundSize / 1000000).toFixed(1)}M</div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-[#EDEDEB] flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-[10.5px] text-[#9AA19E]">
                        <Activity className="w-3.5 h-3.5" />
                        <span>{deal.lastActivityDate}</span>
                      </div>
                      <div className="flex items-center gap-1 text-[10.5px] font-semibold text-[#87BAA4]">
                        Open <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
