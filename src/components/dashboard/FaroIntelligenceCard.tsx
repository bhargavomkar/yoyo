'use client';

import React, { useState } from 'react';
import { AIInsight } from '@/types';
import { Sparkles, ArrowRight, ShieldCheck, ChevronDown, ChevronUp, Cpu, Activity, ExternalLink } from 'lucide-react';
import { StatusBadge } from '@/components/ui/StatusBadge';

interface FaroIntelligenceCardProps {
  insight: AIInsight;
  onOpenDetailedAnalysis: () => void;
  className?: string;
}

export const FaroIntelligenceCard: React.FC<FaroIntelligenceCardProps> = ({
  insight,
  onOpenDetailedAnalysis,
  className = ''
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      className={`relative overflow-hidden bg-white border border-[#EDEDEB] rounded-lg p-5 transition-all duration-200 hover:border-[#87BAA4]/60 shadow-2xs ${className}`}
    >
      {/* Subtle top indicator bar in Faro sage */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#87BAA4] via-[#BAD6CC] to-transparent" />

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-[#EBF5F1] flex items-center justify-center text-[#2E6E56]">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-bold tracking-wider text-[#141618] uppercase">
            {insight.title}
          </span>
          <StatusBadge variant="sage" size="xs" dot>
            Real-time Telemetry
          </StatusBadge>
        </div>

        <span className="text-[11px] text-[#9AA19E]">
          {insight.timestamp}
        </span>
      </div>

      {/* Core Insight Statement */}
      <div className="mb-4">
        <h3 className="text-base md:text-lg font-semibold text-[#141618] leading-snug">
          {insight.summary}
        </h3>
        <p className="text-xs md:text-[13px] text-[#5C6460] mt-1 leading-relaxed">
          Aggregated positioning shifted across wafer-scale hardware, cloud compute commitments, and synthetic enterprise allocations.
        </p>
      </div>

      {/* Key Metric Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-4">
        {insight.metrics.map((m, idx) => (
          <div 
            key={idx}
            className="p-2.5 rounded-md bg-[#F8F9F8] border border-[#EDEDEB]/80"
          >
            <div className="text-[10.5px] font-medium text-[#878E8B] truncate">
              {m.label}
            </div>
            <div className="text-xs md:text-sm font-semibold text-[#18191B] mt-0.5 tabular-nums">
              {m.value}
            </div>
          </div>
        ))}
      </div>

      {/* Inline expander preview */}
      {isExpanded && (
        <div className="mb-4 pt-3 border-t border-[#EDEDEB] space-y-2 animate-in fade-in slide-in-from-top-1 duration-200">
          <div className="text-xs font-semibold text-[#141618] flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-[#87BAA4]" />
            Evidence Synthesis:
          </div>
          <div className="space-y-1.5">
            {insight.fullAnalysis.map((item, idx) => (
              <div key={idx} className="text-xs text-[#525955] flex items-start gap-2 bg-[#FBFBFB] p-2 rounded border border-[#EDEDEB]/60">
                <span className="w-1.5 h-1.5 rounded-full bg-[#87BAA4] mt-1.5 shrink-0" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="pt-2 border-t border-[#EDEDEB]/70 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenDetailedAnalysis}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#245241] hover:text-[#183B2F] transition-colors group"
          >
            <span>View analysis</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </button>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-[11.5px] text-[#78807C] hover:text-[#141618] inline-flex items-center gap-1 transition-colors"
          >
            {isExpanded ? (
              <>Less <ChevronUp className="w-3 h-3" /></>
            ) : (
              <>Quick Evidence <ChevronDown className="w-3 h-3" /></>
            )}
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] text-[#8C9390]">Model confidence:</span>
          <span className="text-[11px] font-semibold text-[#141618]">{insight.confidence}%</span>
        </div>
      </div>
    </div>
  );
};
