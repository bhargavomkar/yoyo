'use client';

import React, { useState } from 'react';
import { PublicCompanyIdentity, EvidenceSource } from '@/types/research';
import { AIResearchService } from '@/services/aiResearchService';
import { EvidenceService } from '@/services/evidenceService';
import { Sparkles, Send, ArrowRight, CornerDownLeft, ShieldCheck, ExternalLink } from 'lucide-react';

interface AskFaroPanelProps {
  company: PublicCompanyIdentity;
  onSelectSource: (source: EvidenceSource) => void;
  onOpenDCF?: () => void;
}

export const AskFaroPanel: React.FC<AskFaroPanelProps> = ({
  company,
  onSelectSource,
  onOpenDCF
}) => {
  const [query, setQuery] = useState('');
  const [history, setHistory] = useState<
    Array<{
      question: string;
      answer: string;
      claims: { text: string; status: 'VERIFIED DATA' | 'MODEL ANALYSIS' | 'ASSUMPTION' | 'ESTIMATE' }[];
      suggestedFollowUps: string[];
      relatedSourceIds: string[];
    }>
  >([
    {
      question: "Why has NVIDIA's revenue growth accelerated?",
      ...AIResearchService.answerQuery("Why has NVIDIA's revenue growth accelerated?", company)
    }
  ]);
  const [isThinking, setIsThinking] = useState(false);

  const suggestedPrompts = [
    `What are the biggest risks to ${company.ticker}'s thesis?`,
    `Compare ${company.ticker} with AMD and Broadcom`,
    `Find strongest counterarguments to Blackwell multiple`,
    `Build a DCF valuation for ${company.ticker}`
  ];

  const handleAsk = (textToAsk: string) => {
    if (!textToAsk.trim()) return;

    if (textToAsk.toLowerCase().includes('dcf') && onOpenDCF) {
      onOpenDCF();
    }

    setIsThinking(true);
    setQuery('');

    setTimeout(() => {
      const response = AIResearchService.answerQuery(textToAsk, company);
      setHistory((prev) => [
        {
          question: textToAsk,
          ...response
        },
        ...prev
      ]);
      setIsThinking(false);
    }, 450);
  };

  return (
    <div className="bg-white border border-[#EDEDEB] rounded-lg p-5 shadow-2xs space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#EDEDEB]/70">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-[#EBF5F1] flex items-center justify-center text-[#245241]">
            <Sparkles className="w-3.5 h-3.5 text-[#87BAA4]" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-[#141618]">
              Ask Faro · Research Coprocessor
            </h4>
            <p className="text-[11px] text-[#6C726F]">
              Operating on active 10-K, earnings transcripts, and valuation models for {company.name}.
            </p>
          </div>
        </div>

        <span className="text-[10px] font-mono text-[#8C9390] bg-[#F5F4F5] px-2 py-0.5 rounded border border-[#EDEDEB]">
          Context: {company.ticker} FY25
        </span>
      </div>

      {/* Suggested Prompt Chips */}
      <div className="flex flex-wrap gap-1.5">
        {suggestedPrompts.map((p, idx) => (
          <button
            key={idx}
            onClick={() => handleAsk(p)}
            className="text-[11px] px-2.5 py-1 rounded-md bg-[#FAFAF9] hover:bg-[#EBF5F1] text-[#484F4B] hover:text-[#183B2F] border border-[#EDEDEB] hover:border-[#BAD6CC] transition-colors cursor-pointer text-left"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleAsk(query);
        }}
        className="relative"
      >
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={`Ask about ${company.name}'s revenue drivers, supply chain, customer concentration, or risks...`}
          className="w-full pl-3.5 pr-20 py-2.5 rounded-lg border border-[#EDEDEB] text-xs text-[#18191B] focus:outline-none focus:border-[#87BAA4] focus:ring-1 focus:ring-[#87BAA4] bg-white transition-all placeholder-[#9AA19E]"
        />
        <button
          type="submit"
          disabled={!query.trim() || isThinking}
          className="absolute right-1.5 top-1.5 bottom-1.5 px-3 rounded-md bg-[#141618] hover:bg-neutral-800 disabled:opacity-40 text-white text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer"
        >
          <span>Ask</span>
          <CornerDownLeft className="w-3 h-3" />
        </button>
      </form>

      {/* History Stream */}
      <div className="space-y-4 pt-1 max-h-[420px] overflow-y-auto">
        {isThinking && (
          <div className="p-3.5 rounded-lg bg-[#FAFAF9] border border-[#EDEDEB] text-xs text-[#6C726F] flex items-center gap-2 animate-pulse">
            <Sparkles className="w-3.5 h-3.5 text-[#87BAA4]" />
            <span>Analyzing filing footnotes, consensus models, and supply telemetry...</span>
          </div>
        )}

        {history.map((item, idx) => (
          <div
            key={idx}
            className="p-4 rounded-lg bg-[#FBFBFA] border border-[#EDEDEB] space-y-3 animate-in fade-in duration-150"
          >
            {/* User Question */}
            <div className="text-xs font-bold text-[#141618] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#87BAA4]" />
              <span>{item.question}</span>
            </div>

            {/* AI Synthesized Answer */}
            <p className="text-xs text-[#3E4542] leading-relaxed">
              {item.answer}
            </p>

            {/* Claims & Epistemic Status */}
            <div className="space-y-1.5 pt-1 border-t border-[#EDEDEB]/60">
              <span className="text-[10px] uppercase font-bold text-[#8C9390]">
                Decomposed Evidence Assertions
              </span>
              <div className="space-y-1">
                {item.claims.map((claim, cIdx) => (
                  <div
                    key={cIdx}
                    className="p-2 rounded bg-white border border-[#EDEDEB] flex items-center justify-between text-[11px] gap-2"
                  >
                    <span className="text-[#383E3A]">{claim.text}</span>
                    <span
                      className={`px-1.5 py-0.5 rounded text-[9px] font-semibold shrink-0 uppercase ${
                        claim.status === 'VERIFIED DATA'
                          ? 'bg-[#EAF6EE] text-[#23683C]'
                          : claim.status === 'MODEL ANALYSIS'
                          ? 'bg-[#EBF2FA] text-[#285786]'
                          : 'bg-[#FEF3EB] text-[#A05A20]'
                      }`}
                    >
                      {claim.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Source References */}
            {item.relatedSourceIds.length > 0 && (
              <div className="flex items-center gap-2 pt-1 text-[11px]">
                <span className="text-[#8C9390]">Cited:</span>
                {item.relatedSourceIds.map((srcId) => {
                  const src = EvidenceService.getSourceById(srcId);
                  if (!src) return null;
                  return (
                    <button
                      key={src.id}
                      onClick={() => onSelectSource(src)}
                      className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-white hover:bg-[#EBF5F1] text-[#245241] border border-[#BAD6CC] transition-colors cursor-pointer"
                    >
                      {src.citationNumber}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
