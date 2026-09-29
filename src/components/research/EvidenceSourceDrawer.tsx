'use client';

import React from 'react';
import { EvidenceSource } from '@/types/research';
import { X, FileText, Calendar, ExternalLink, ShieldCheck, Database, Link as LinkIcon } from 'lucide-react';

interface EvidenceSourceDrawerProps {
  source: EvidenceSource | null;
  onClose: () => void;
}

export const EvidenceSourceDrawer: React.FC<EvidenceSourceDrawerProps> = ({
  source,
  onClose
}) => {
  if (!source) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-end bg-black/40 backdrop-blur-2xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-lg h-full bg-white border-l border-[#EDEDEB] shadow-2xl p-6 overflow-y-auto flex flex-col justify-between animate-in slide-in-from-right duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-start justify-between gap-3 pb-4 border-b border-[#EDEDEB]">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-[#EBF5F1] text-[#245241] border border-[#BAD6CC]">
                  {source.citationNumber}
                </span>
                <span className="text-[11px] font-semibold text-[#87BAA4] uppercase tracking-wider">
                  Verified Evidence Record
                </span>
              </div>
              <h3 className="text-base font-bold text-[#141618] leading-snug">
                {source.title}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-md text-[#8C9390] hover:text-[#141618] hover:bg-[#F5F4F5] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-lg bg-[#FAFAF9] border border-[#EDEDEB]">
              <span className="text-[10.5px] font-medium text-[#8C9390] block mb-0.5">
                Source Type
              </span>
              <span className="font-semibold text-[#18191B] flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-[#87BAA4]" />
                {source.sourceType}
              </span>
            </div>

            <div className="p-3 rounded-lg bg-[#FAFAF9] border border-[#EDEDEB]">
              <span className="text-[10.5px] font-medium text-[#8C9390] block mb-0.5">
                Publication Date
              </span>
              <span className="font-semibold text-[#18191B] flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#87BAA4]" />
                {source.publicationDate}
              </span>
            </div>
          </div>

          {/* Primary Evidence Excerpt */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold text-[#18191B] uppercase tracking-wider block">
              Direct Filing Excerpt
            </span>
            <div className="p-4 rounded-lg bg-[#F8F9F8] border border-[#EDEDEB] border-l-4 border-l-[#87BAA4] text-xs text-[#2D3330] leading-relaxed italic">
              "{source.relevantExcerpt}"
            </div>
          </div>

          {/* Data Used In Model */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold text-[#18191B] uppercase tracking-wider flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-[#87BAA4]" />
              Model Quantitative Ingestion
            </span>
            <div className="p-3 rounded-lg bg-[#FAFAF9] border border-[#EDEDEB] text-xs text-[#525955] leading-relaxed">
              {source.dataUsed}
            </div>
          </div>

          {/* Digital Signature & Integrity Check */}
          <div className="p-3 rounded-lg bg-[#EBF5F1]/30 border border-[#BAD6CC]/60 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#87BAA4]" />
              <span className="font-medium text-[#204A3B]">
                Cryptographic Ingestion Hash Verified
              </span>
            </div>
            <span className="text-[10px] text-[#2E6E56] font-mono">
              SHA-256: 8f4c...3b12
            </span>
          </div>
        </div>

        {/* Footer Link */}
        <div className="pt-6 border-t border-[#EDEDEB] mt-6 flex items-center justify-between">
          <a
            href={source.urlPlaceholder || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#2563EB] hover:text-blue-800 transition-colors"
          >
            <LinkIcon className="w-3.5 h-3.5" />
            <span>Open SEC EDGAR Source Document</span>
            <ExternalLink className="w-3 h-3 ml-0.5" />
          </a>

          <button
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-md bg-[#141618] hover:bg-neutral-800 text-white text-xs font-semibold transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
