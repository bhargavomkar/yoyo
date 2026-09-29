'use client';

import React, { useState } from 'react';
import { GeneratedResearchReport, EvidenceSource } from '@/types/research';
import { X, Download, Share2, Bookmark, Check, Printer, FileText, Sparkles, ExternalLink } from 'lucide-react';
import { FaroLogo } from '@/components/brand/FaroLogo';

interface ResearchReportModalProps {
  report: GeneratedResearchReport | null;
  isOpen: boolean;
  onClose: () => void;
  onSelectSource: (source: EvidenceSource) => void;
}

export const ResearchReportModal: React.FC<ResearchReportModalProps> = ({
  report,
  isOpen,
  onClose,
  onSelectSource
}) => {
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  if (!isOpen || !report) return null;

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-2xs p-4 animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-4xl max-h-[92vh] bg-white rounded-xl border border-[#EDEDEB] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Action Bar */}
        <div className="px-6 py-3.5 border-b border-[#EDEDEB] bg-[#FAFAF9] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FaroLogo size="sm" />
            <span className="text-xs text-[#8C9390]">|</span>
            <span className="text-xs font-semibold text-[#18191B]">
              Institutional Investment Memo · {report.ticker}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSave}
              className="px-2.5 py-1.5 rounded-md border border-[#EDEDEB] bg-white hover:bg-[#F5F4F5] text-xs font-medium text-[#18191B] flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {saved ? <Check className="w-3.5 h-3.5 text-[#87BAA4]" /> : <Bookmark className="w-3.5 h-3.5 text-[#8C9390]" />}
              <span>{saved ? 'Saved' : 'Save Report'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-2.5 py-1.5 rounded-md border border-[#EDEDEB] bg-white hover:bg-[#F5F4F5] text-xs font-medium text-[#18191B] flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-[#8C9390]" />
              <span>Export PDF</span>
            </button>

            <button
              onClick={handleShare}
              className="px-2.5 py-1.5 rounded-md border border-[#EDEDEB] bg-white hover:bg-[#F5F4F5] text-xs font-medium text-[#18191B] flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-[#87BAA4]" /> : <Share2 className="w-3.5 h-3.5 text-[#8C9390]" />}
              <span>{copied ? 'Link Copied' : 'Share Report'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-md text-[#8C9390] hover:text-[#18191B] hover:bg-[#EDEDEB] transition-colors ml-2"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Report Content Body (Styled like an institutional investment memo) */}
        <div className="p-8 overflow-y-auto space-y-8 flex-1 text-xs leading-relaxed max-w-3xl mx-auto w-full">
          {/* Memo Title & Meta */}
          <div className="border-b border-[#EDEDEB] pb-6 space-y-2 text-center sm:text-left">
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#87BAA4]">
              Investment Committee Memorandum
            </div>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-[#141618]">
              {report.companyName} ({report.ticker})
            </h2>
            <div className="flex flex-wrap items-center gap-4 text-xs text-[#717874] pt-1">
              <span>Date: {report.generatedDate}</span>
              <span>•</span>
              <span>Author: {report.analyst}</span>
              <span>•</span>
              <span>Classification: Confidential / IC Only</span>
            </div>
          </div>

          {/* 1. Executive Summary */}
          <section className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#18191B] pb-1 border-b border-[#EDEDEB]">
              1. Executive Summary
            </h3>
            <p className="text-xs md:text-[13px] text-[#3A403D] leading-relaxed bg-[#F8F9F8] p-4 rounded-lg border border-[#EDEDEB]">
              {report.executiveSummary}
            </p>
          </section>

          {/* 2. Company Overview */}
          <section className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#18191B] pb-1 border-b border-[#EDEDEB]">
              2. Company Overview
            </h3>
            <p className="text-xs text-[#4E5552] leading-relaxed">
              {report.companyOverview}
            </p>
          </section>

          {/* 3. Market Opportunity */}
          <section className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#18191B] pb-1 border-b border-[#EDEDEB]">
              3. Market Dynamics & Secular Drivers
            </h3>
            <p className="text-xs text-[#4E5552] leading-relaxed">
              {report.marketAnalysis}
            </p>
          </section>

          {/* 4. Financial Performance */}
          <section className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#18191B] pb-1 border-b border-[#EDEDEB]">
              4. Financial Performance & Balance Sheet Health
            </h3>
            <p className="text-xs text-[#4E5552] leading-relaxed">
              {report.financialPerformance}
            </p>
          </section>

          {/* 5. Growth Drivers */}
          <section className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#18191B] pb-1 border-b border-[#EDEDEB]">
              5. Key Growth Vectors
            </h3>
            <ul className="space-y-2 list-disc list-inside text-xs text-[#4E5552]">
              {report.growthDrivers.map((driver, idx) => (
                <li key={idx} className="leading-relaxed">
                  <span className="text-[#18191B] font-medium">{driver}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* 6. Competitive Landscape */}
          <section className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#18191B] pb-1 border-b border-[#EDEDEB]">
              6. Competitive Landscape & Moat Durability
            </h3>
            <p className="text-xs text-[#4E5552] leading-relaxed">
              {report.competitiveLandscape}
            </p>
          </section>

          {/* 7. Valuation & Scenario Modeling (Bull, Base, Bear) */}
          <section className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#18191B] pb-1 border-b border-[#EDEDEB]">
              7. Valuation Summary & Multi-Scenario Sensitivity
            </h3>
            <p className="text-xs text-[#4E5552] leading-relaxed">
              {report.valuationSummary}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
              <div className="p-3.5 rounded-lg bg-[#EAF6EE] border border-[#C8EAD2] space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#23683C]">
                  Bull Case
                </span>
                <p className="text-[11.5px] text-[#1E4D3C] leading-snug">
                  {report.bullCase}
                </p>
              </div>

              <div className="p-3.5 rounded-lg bg-[#F5F4F5] border border-[#EDEDEB] space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#18191B]">
                  Base Case (Model Primary)
                </span>
                <p className="text-[11.5px] text-[#363B38] leading-snug">
                  {report.baseCase}
                </p>
              </div>

              <div className="p-3.5 rounded-lg bg-[#FDECEB] border border-[#F8CDC9] space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#A5342C]">
                  Bear Case (Downside Risk)
                </span>
                <p className="text-[11.5px] text-[#69201B] leading-snug">
                  {report.bearCase}
                </p>
              </div>
            </div>
          </section>

          {/* 8. Open Questions */}
          <section className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#18191B] pb-1 border-b border-[#EDEDEB]">
              8. Open Questions for Next Investment Committee
            </h3>
            <ul className="space-y-1.5 list-disc list-inside text-xs text-[#4E5552]">
              {report.openQuestions.map((q, idx) => (
                <li key={idx} className="leading-relaxed">
                  {q}
                </li>
              ))}
            </ul>
          </section>

          {/* 9. Underlying Evidence Sources */}
          <section className="space-y-3 pt-4 border-t border-[#EDEDEB]">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#87BAA4]">
              9. Underlying Evidence Sources Index
            </h3>
            <div className="space-y-2">
              {report.sources.map((src) => (
                <div
                  key={src.id}
                  onClick={() => onSelectSource(src)}
                  className="p-3 rounded-lg border border-[#EDEDEB] bg-[#FAFAF9] hover:bg-[#EBF5F1] transition-colors flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-xs font-bold text-[#204A3B]">
                      {src.citationNumber}
                    </span>
                    <div>
                      <span className="font-semibold text-[#18191B] block">
                        {src.title}
                      </span>
                      <span className="text-[10.5px] text-[#8C9390]">
                        {src.sourceType} · {src.publicationDate}
                      </span>
                    </div>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-[#87BAA4]" />
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-[#EDEDEB] bg-[#FAFAF9] flex items-center justify-between text-xs text-[#8C9390]">
          <span>Generated via Faro Research Intelligence Engine</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-md bg-[#141618] hover:bg-neutral-800 text-white font-semibold transition-colors"
          >
            Close Memo
          </button>
        </div>
      </div>
    </div>
  );
};
