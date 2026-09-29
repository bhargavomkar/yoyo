'use client';

import React from 'react';
import { InvestmentOpportunity, RiskLevel, OpportunityStatus } from '@/types';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { ArrowUpRight, ChevronRight, Shield, Zap, TrendingUp } from 'lucide-react';

interface OpportunitiesSectionProps {
  opportunities: InvestmentOpportunity[];
  onSelectOpportunity: (opportunity: InvestmentOpportunity) => void;
  className?: string;
}

export const OpportunitiesSection: React.FC<OpportunitiesSectionProps> = ({
  opportunities,
  onSelectOpportunity,
  className = ''
}) => {
  const getRiskVariant = (risk: RiskLevel) => {
    switch (risk) {
      case 'Low':
        return 'success';
      case 'Moderate':
        return 'warning';
      case 'High':
        return 'danger';
      case 'Managed':
        return 'neutral';
      default:
        return 'neutral';
    }
  };

  const getStatusVariant = (status: OpportunityStatus) => {
    switch (status) {
      case 'Term Sheet':
        return 'sage';
      case 'IC Review':
        return 'info';
      case 'Due Diligence':
        return 'warning';
      case 'Active Pipeline':
        return 'neutral';
      case 'Monitoring':
        return 'outline';
      default:
        return 'neutral';
    }
  };

  return (
    <div className={`bg-white border border-[#EDEDEB] rounded-lg overflow-hidden shadow-2xs ${className}`}>
      {/* Section Header */}
      <div className="p-5 pb-3 border-b border-[#EDEDEB]/70 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-wider text-[#87BAA4] mb-0.5">
            Deal Flow & Pipelines
          </div>
          <h3 className="text-base font-bold text-[#141618]">
            Investment Opportunities
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-[#8C9390]">
            {opportunities.length} active opportunities
          </span>
        </div>
      </div>

      {/* Institutional Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-[#EDEDEB] bg-[#FAFAF9] text-[#767E7A] text-[11px] font-semibold uppercase tracking-wider">
              <th className="py-2.5 px-4 font-medium">Company</th>
              <th className="py-2.5 px-4 font-medium">Sector</th>
              <th className="py-2.5 px-4 font-medium">Asset Type</th>
              <th className="py-2.5 px-4 font-medium text-right">Valuation</th>
              <th className="py-2.5 px-4 font-medium text-right">Growth</th>
              <th className="py-2.5 px-4 font-medium text-center">Risk</th>
              <th className="py-2.5 px-4 font-medium text-right">Status</th>
              <th className="py-2.5 px-3 font-medium"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#EDEDEB]/60">
            {opportunities.map((opp) => (
              <tr
                key={opp.id}
                onClick={() => onSelectOpportunity(opp)}
                className="group hover:bg-[#F8F9F8] transition-colors cursor-pointer"
              >
                {/* Company Name & Emblem */}
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-md bg-[#EDEDEB] text-[#141618] font-bold text-xs flex items-center justify-center border border-[#E0E0DE] group-hover:border-[#87BAA4] transition-colors">
                      {opp.logo}
                    </div>
                    <div>
                      <div className="font-semibold text-[#141618] group-hover:text-[#255644] transition-colors flex items-center gap-1.5">
                        {opp.company}
                        <ArrowUpRight className="w-3 h-3 text-[#9AA19E] opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <div className="text-[10.5px] text-[#8C9390]">
                        {opp.symbol} · {opp.hqLocation}
                      </div>
                    </div>
                  </div>
                </td>

                {/* Sector */}
                <td className="py-3 px-4">
                  <span className="text-[#4F5652] text-xs font-medium">
                    {opp.sector}
                  </span>
                </td>

                {/* Asset Type */}
                <td className="py-3 px-4">
                  <span className="text-[#6D7470] text-xs">
                    {opp.assetType}
                  </span>
                </td>

                {/* Valuation */}
                <td className="py-3 px-4 text-right">
                  <span className="font-semibold text-[#141618] tabular-nums">
                    {opp.valuation}
                  </span>
                </td>

                {/* Growth */}
                <td className="py-3 px-4 text-right">
                  <span className="inline-flex items-center gap-0.5 text-xs font-semibold text-[#245946] tabular-nums">
                    {opp.growth}
                  </span>
                </td>

                {/* Risk */}
                <td className="py-3 px-4 text-center">
                  <StatusBadge variant={getRiskVariant(opp.risk)} size="xs">
                    {opp.risk}
                  </StatusBadge>
                </td>

                {/* Status */}
                <td className="py-3 px-4 text-right">
                  <StatusBadge variant={getStatusVariant(opp.status)} size="xs" dot>
                    {opp.status}
                  </StatusBadge>
                </td>

                {/* Chevron link */}
                <td className="py-3 px-3 text-right">
                  <ChevronRight className="w-4 h-4 text-[#C2C6C4] group-hover:text-[#141618] transition-colors" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
