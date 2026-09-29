'use client';

import React from 'react';
import { AIInsight } from '@/types';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { X, Sparkles, Activity, ShieldCheck, ArrowRight, TrendingUp, AlertTriangle } from 'lucide-react';

interface InsightAnalysisModalProps {
  insight: AIInsight;
  isOpen: boolean;
  onClose: () => void;
  onCommissionAgent: () => void;
}

export const InsightAnalysisModal: React.FC<InsightAnalysisModalProps> = ({
  insight,
  isOpen,
  onClose,
  onCommissionAgent
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div 
        className="w-full max-w-2xl bg-white rounded-xl border border-[#EDEDEB] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#EDEDEB] flex items-center justify-between bg-[#FAFAF9]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#EBF5F1] flex items-center justify-center text-[#245241]">
              <Sparkles className="w-4 h-4 text-[#87BAA4]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-[#141618]">
                  Faro Intelligence Analysis
                </h3>
                <StatusBadge variant="sage" size="xs" dot>
                  Confidence {insight.confidence}%
                </StatusBadge>
              </div>
              <div className="text-[11px] text-[#8C9390]">
                Quantitative telemetry & supply-chain factor decomposition
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-md text-[#8C9390] hover:text-[#18191B] hover:bg-[#EDEDEB] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {/* Main Statement */}
          <div className="p-4 rounded-lg bg-[#EBF5F1]/30 border border-[#BAD6CC]/60">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#2D604E] block mb-1">
              Active Telemetry Trigger
            </span>
            <p className="text-sm font-semibold text-[#18191B]">
              {insight.summary}
            </p>
          </div>

          {/* Core Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {insight.metrics.map((m, idx) => (
              <div key={idx} className="p-3 rounded-md bg-[#F8F9F8] border border-[#EDEDEB]">
                <div className="text-[10px] text-[#878E8B] uppercase font-semibold">
                  {m.label}
                </div>
                <div className="text-sm font-bold text-[#18191B] mt-0.5 tabular-nums">
                  {m.value}
                </div>
              </div>
            ))}
          </div>

          {/* Evidence Synthesis */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#87BAA4] flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5" />
              Evidence & Analytical Vectors
            </h4>
            <div className="space-y-2">
              {insight.fullAnalysis.map((item, idx) => (
                <div 
                  key={idx} 
                  className="p-3 rounded-md bg-[#FAFAF9] border border-[#EDEDEB] text-[#474E4A] leading-relaxed flex items-start gap-2.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#87BAA4] mt-1.5 shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended Actions */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#87BAA4] flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              Prescribed Capital Actions
            </h4>
            <div className="space-y-2">
              {insight.recommendedActions.map((action, idx) => (
                <div 
                  key={idx}
                  className="p-2.5 rounded-md border border-[#EDEDEB] bg-white flex items-center justify-between gap-3 hover:border-[#87BAA4] transition-colors"
                >
                  <span className="text-xs font-medium text-[#18191B]">
                    {action}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#87BAA4] shrink-0" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-[#EDEDEB] bg-[#FAFAF9] flex items-center justify-between">
          <button
            onClick={() => {
              onClose();
              onCommissionAgent();
            }}
            className="px-3.5 py-1.5 rounded-md bg-[#141618] hover:bg-neutral-800 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>Commission Keystone Risk Agent</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-md border border-[#EDEDEB] hover:bg-[#EDEDEB] text-xs font-medium text-[#555C58]"
          >
            Acknowledge
          </button>
        </div>
      </div>
    </div>
  );
};
