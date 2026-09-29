'use client';

import React from 'react';
import { InvestmentOpportunity } from '@/types';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { X, ArrowUpRight, FileText, CheckCircle2, ShieldAlert, Building, DollarSign, Calendar, Bot } from 'lucide-react';

interface OpportunityDetailModalProps {
  opportunity: InvestmentOpportunity | null;
  onClose: () => void;
  onDeployAgentForOpp: (opp: InvestmentOpportunity) => void;
}

export const OpportunityDetailModal: React.FC<OpportunityDetailModalProps> = ({
  opportunity,
  onClose,
  onDeployAgentForOpp
}) => {
  if (!opportunity) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div 
        className="w-full max-w-2xl bg-white rounded-xl border border-[#EDEDEB] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="px-6 py-4 border-b border-[#EDEDEB] flex items-center justify-between bg-[#FAFAF9]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#141618] text-white font-bold text-sm flex items-center justify-center">
              {opportunity.logo}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-[#141618]">
                  {opportunity.company}
                </h3>
                <span className="text-xs text-[#8C9390]">
                  ({opportunity.symbol})
                </span>
                <StatusBadge variant="neutral" size="xs">
                  {opportunity.sector}
                </StatusBadge>
              </div>
              <div className="text-[11px] text-[#6C726F] mt-0.5">
                {opportunity.hqLocation} · Lead Partner: {opportunity.leadPartner}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <StatusBadge variant="sage" size="sm" dot>
              {opportunity.status}
            </StatusBadge>
            <button
              onClick={onClose}
              className="p-1.5 rounded-md text-[#8C9390] hover:text-[#18191B] hover:bg-[#EDEDEB] transition-colors ml-2"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-[#F9F9F8] rounded-lg border border-[#EDEDEB]">
              <span className="text-[10.5px] text-[#8C9390] block mb-0.5">Valuation</span>
              <span className="text-base font-bold text-[#141618] tabular-nums">
                {opportunity.valuation}
              </span>
            </div>
            <div className="p-3 bg-[#F9F9F8] rounded-lg border border-[#EDEDEB]">
              <span className="text-[10.5px] text-[#8C9390] block mb-0.5">YoY Growth</span>
              <span className="text-base font-bold text-[#23683C] tabular-nums">
                {opportunity.growth}
              </span>
            </div>
            <div className="p-3 bg-[#F9F9F8] rounded-lg border border-[#EDEDEB]">
              <span className="text-[10.5px] text-[#8C9390] block mb-0.5">Target Ticket</span>
              <span className="text-base font-bold text-[#141618] tabular-nums">
                {opportunity.targetInvestment}
              </span>
            </div>
            <div className="p-3 bg-[#F9F9F8] rounded-lg border border-[#EDEDEB]">
              <span className="text-[10.5px] text-[#8C9390] block mb-0.5">Projected Net IRR</span>
              <span className="text-base font-bold text-[#204A3B] tabular-nums">
                {opportunity.projectedIRR}
              </span>
            </div>
          </div>

          {/* Thesis Section */}
          <div className="space-y-1.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#87BAA4]">
              Core Investment Thesis
            </h4>
            <p className="text-sm text-[#383E3A] leading-relaxed bg-[#FBFBFA] p-3.5 rounded-lg border border-[#EDEDEB]">
              "{opportunity.thesis}"
            </p>
          </div>

          {/* Due Diligence Vectors */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#87BAA4]">
              Due Diligence Workstreams
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="flex items-center justify-between p-2.5 rounded-md border border-[#EDEDEB] bg-white">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#87BAA4]" />
                  <span className="font-medium text-[#18191B]">Cap Table & Liquidity Waterfall</span>
                </div>
                <span className="text-[10px] text-[#23683C] font-semibold bg-[#EAF6EE] px-1.5 py-0.5 rounded">Verified</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-md border border-[#EDEDEB] bg-white">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#87BAA4]" />
                  <span className="font-medium text-[#18191B]">IP & Semiconductor Architecture</span>
                </div>
                <span className="text-[10px] text-[#23683C] font-semibold bg-[#EAF6EE] px-1.5 py-0.5 rounded">Verified</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-md border border-[#EDEDEB] bg-white">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#E58A38]" />
                  <span className="font-medium text-[#18191B]">Customer Cohort Retention Audit</span>
                </div>
                <span className="text-[10px] text-[#A05A20] font-semibold bg-[#FEF3EB] px-1.5 py-0.5 rounded">In Review</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-md border border-[#EDEDEB] bg-white">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-[#9AA19E]" />
                  <span className="font-medium text-[#18191B]">Sovereign Defense Export Compliance</span>
                </div>
                <span className="text-[10px] text-[#555C58] font-semibold bg-[#EDEDEB] px-1.5 py-0.5 rounded">Pending</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-3.5 border-t border-[#EDEDEB] bg-[#FAFAF9] flex items-center justify-between">
          <button
            onClick={() => onDeployAgentForOpp(opportunity)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#EBF5F1] hover:bg-[#BAD6CC]/50 text-[#1E4D3C] text-xs font-semibold transition-colors border border-[#BAD6CC]"
          >
            <Bot className="w-3.5 h-3.5" />
            <span>Deploy Mosaic Diligence on {opportunity.company}</span>
          </button>

          <button
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-md bg-[#141618] text-white hover:bg-neutral-800 text-xs font-semibold transition-colors"
          >
            Close Dossier
          </button>
        </div>
      </div>
    </div>
  );
};
