'use client';

import React, { useState } from 'react';
import { StructuredAnalysis, EpistemicStatus, EvidenceSource, ResearchClaim } from '@/types/research';
import { Sparkles, ShieldCheck, AlertCircle, HelpCircle, ArrowRight, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';
import { EvidenceService } from '@/services/evidenceService';

interface FaroIntelligenceAnalysisProps {
  analysis: StructuredAnalysis;
  onSelectSource: (source: EvidenceSource) => void;
}

export const FaroIntelligenceAnalysis: React.FC<FaroIntelligenceAnalysisProps> = ({
  analysis,
  onSelectSource
}) => {
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const renderEpistemicBadge = (status: EpistemicStatus) => {
    switch (status) {
      case 'VERIFIED DATA':
        return (
          <span className="px-1.5 py-0.5 rounded text-[9.5px] font-semibold bg-[#EAF6EE] text-[#23683C] border border-[#C8EAD2] tracking-wider uppercase">
            Verified Data
          </span>
        );
      case 'MODEL ANALYSIS':
        return (
          <span className="px-1.5 py-0.5 rounded text-[9.5px] font-semibold bg-[#EBF2FA] text-[#285786] border border-[#CFE1F4] tracking-wider uppercase">
            Model Analysis
          </span>
        );
      case 'ASSUMPTION':
        return (
          <span className="px-1.5 py-0.5 rounded text-[9.5px] font-semibold bg-[#FEF3EB] text-[#A05A20] border border-[#F8DCC4] tracking-wider uppercase">
            Assumption
          </span>
        );
      case 'ESTIMATE':
        return (
          <span className="px-1.5 py-0.5 rounded text-[9.5px] font-semibold bg-[#EDEDEB] text-[#555C58] border border-[#E0E0DE] tracking-wider uppercase">
            Estimate
          </span>
        );
      case 'UNKNOWN':
      default:
        return (
          <span className="px-1.5 py-0.5 rounded text-[9.5px] font-semibold bg-[#FDECEB] text-[#A5342C] border border-[#F8CDC9] tracking-wider uppercase">
            Unknown
          </span>
        );
    }
  };

  const renderClaim = (claim: ResearchClaim) => {
    return (
      <div
        key={claim.id}
        className="p-3 rounded-lg bg-[#FAFAF9] border border-[#EDEDEB] flex flex-col sm:flex-row sm:items-start justify-between gap-2.5 transition-colors hover:border-[#87BAA4]/60"
      >
        <div className="flex-1 space-y-1.5">
          <div className="flex items-center gap-2">
            {renderEpistemicBadge(claim.epistemicStatus)}
          </div>
          <p className="text-xs text-[#252B28] leading-relaxed">
            {claim.claimText}
          </p>
        </div>

        {/* Clickable Citations */}
        {claim.sourceIds && claim.sourceIds.length > 0 && (
          <div className="flex items-center gap-1.5 shrink-0 self-start sm:self-auto pt-1 sm:pt-0">
            {claim.sourceIds.map((srcId) => {
              const src = EvidenceService.getSourceById(srcId);
              if (!src) return null;
              return (
                <button
                  key={src.id}
                  onClick={() => onSelectSource(src)}
                  className="px-1.5 py-0.5 rounded text-[10.5px] font-mono font-bold bg-white hover:bg-[#EBF5F1] text-[#2E5E4C] border border-[#BAD6CC] transition-colors flex items-center gap-1 cursor-pointer"
                  title={`View Source: ${src.title}`}
                >
                  <span>{src.citationNumber}</span>
                  <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white border border-[#EDEDEB] rounded-lg p-5 shadow-2xs space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-3 border-b border-[#EDEDEB]/70">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-6 h-6 rounded bg-[#EBF5F1] flex items-center justify-center text-[#245241]">
              <Sparkles className="w-3.5 h-3.5 text-[#87BAA4]" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#141618]">
              Faro Intelligence
            </span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#EDEDEB] text-[#555C58]">
              Evidence Protocol v2.4
            </span>
          </div>
          <h3 className="text-base font-bold text-[#141618]">
            Structured Research Intelligence & Epistemic Decomposition
          </h3>
          <p className="text-xs text-[#6C726F] mt-0.5">
            Every analytical vector is indexed to underlying audited filings, transcripts, and model assumptions.
          </p>
        </div>

        {/* Epistemic Legend */}
        <div className="flex flex-wrap items-center gap-1.5 self-start sm:self-auto">
          {renderEpistemicBadge('VERIFIED DATA')}
          {renderEpistemicBadge('MODEL ANALYSIS')}
          {renderEpistemicBadge('ASSUMPTION')}
          {renderEpistemicBadge('ESTIMATE')}
        </div>
      </div>

      {/* 1. Investment Thesis vs Counter Thesis (Side-by-side or stacked) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Investment Thesis */}
        <div className="p-4 rounded-lg bg-[#EBF5F1]/30 border border-[#BAD6CC]/70 space-y-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#87BAA4]" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#1E4D3C]">
              Investment Thesis
            </span>
          </div>
          <p className="text-xs font-medium text-[#18191B] leading-relaxed italic">
            "{analysis.investmentThesis.summary}"
          </p>
          <div className="space-y-2 pt-1">
            {analysis.investmentThesis.points.map(renderClaim)}
          </div>
        </div>

        {/* Counter Thesis */}
        <div className="p-4 rounded-lg bg-[#FEF3EB]/30 border border-[#F8DCC4] space-y-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-[#E58A38]" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#A05A20]">
              Counter Thesis & Downside Risks
            </span>
          </div>
          <p className="text-xs font-medium text-[#18191B] leading-relaxed italic">
            "{analysis.counterThesis.summary}"
          </p>
          <div className="space-y-2 pt-1">
            {analysis.counterThesis.points.map(renderClaim)}
          </div>
        </div>
      </div>

      {/* 2. Growth Drivers & Catalysts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="space-y-2.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#87BAA4] block">
            Core Growth Drivers
          </span>
          <div className="space-y-2">
            {analysis.growthDrivers.map(renderClaim)}
          </div>
        </div>

        <div className="space-y-2.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#87BAA4] block">
            Upcoming Catalysts
          </span>
          <div className="space-y-2">
            {analysis.catalysts.map(renderClaim)}
          </div>
        </div>
      </div>

      {/* 3. Competitive Moats & Key Risks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="space-y-2.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#87BAA4] block">
            Competitive Advantages (Moat)
          </span>
          <div className="space-y-2">
            {analysis.competitiveAdvantages.map(renderClaim)}
          </div>
        </div>

        <div className="space-y-2.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#E58A38] block">
            Key Risks & Dependencies
          </span>
          <div className="space-y-2">
            {analysis.keyRisks.map(renderClaim)}
          </div>
        </div>
      </div>

      {/* 4. Open Questions & Important Assumptions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2 border-t border-[#EDEDEB]/70">
        <div className="space-y-2.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#8C9390] block">
            Open Questions for Investor Investigation
          </span>
          <div className="space-y-2">
            {analysis.openQuestions.map((q, idx) => (
              <div key={idx} className="p-3 rounded-lg bg-[#FAFAF9] border border-[#EDEDEB] text-xs text-[#4F5652] flex items-start gap-2">
                <HelpCircle className="w-3.5 h-3.5 text-[#87BAA4] mt-0.5 shrink-0" />
                <span>{q}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#8C9390] block">
            Important Baseline Assumptions
          </span>
          <div className="space-y-2">
            {analysis.importantAssumptions.map(renderClaim)}
          </div>
        </div>
      </div>
    </div>
  );
};
