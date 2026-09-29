'use client';

import React, { useState } from 'react';
import { AIAgent } from '@/types';
import { SPECIALIST_AGENTS } from '@/lib/mock-data';
import { X, Check, ArrowUpRight, ShieldCheck, Sparkles } from 'lucide-react';

interface AgentBriefModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialAgent?: AIAgent | null;
  onTaskCreated: (task: { title: string; agent: string; budget: string }) => void;
}

export const AgentBriefModal: React.FC<AgentBriefModalProps> = ({
  isOpen,
  onClose,
  initialAgent,
  onTaskCreated
}) => {
  const [selectedAgentId, setSelectedAgentId] = useState<string>(
    initialAgent?.id || SPECIALIST_AGENTS[0].id
  );
  const [taskTitle, setTaskTitle] = useState('Map the AI infrastructure landscape');
  const [notes, setNotes] = useState('Include Tier-1 hyperscaler GPU cluster telemetry and ASML packaging dependencies.');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showToast, setShowToast] = useState(false);

  if (!isOpen) return null;

  const currentAgent =
    SPECIALIST_AGENTS.find((a) => a.id === selectedAgentId) || SPECIALIST_AGENTS[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setShowToast(true);
      onTaskCreated({
        title: taskTitle,
        agent: currentAgent.name,
        budget: `${currentAgent.ethPriceNumeric} ETH`
      });

      setTimeout(() => {
        setShowToast(false);
        onClose();
      }, 1500);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div 
        className="w-full max-w-lg bg-white rounded-xl border border-[#EDEDEB] shadow-xl overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#EDEDEB] flex items-center justify-between bg-[#FAFAF9]">
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-wider text-[#87BAA4]">
              New Work Order
            </div>
            <h3 className="text-base font-bold text-[#141618]">
              Give Faro a brief
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md text-[#8C9390] hover:text-[#18191B] hover:bg-[#EDEDEB] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body matching reference screenshot */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <p className="text-xs text-[#6C726F] leading-relaxed">
            Describe the question. An agent will pick up the work and return an evidence-backed output.
          </p>

          {/* Task Title */}
          <div>
            <label className="block text-xs font-semibold text-[#18191B] mb-1.5">
              Task title
            </label>
            <input
              type="text"
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              placeholder="e.g. Map the AI infrastructure landscape"
              className="w-full px-3 py-2 rounded-md border border-[#EDEDEB] text-xs text-[#18191B] focus:outline-none focus:border-[#87BAA4] focus:ring-1 focus:ring-[#87BAA4] bg-white transition-all"
              required
            />
          </div>

          {/* Preferred Agent */}
          <div>
            <label className="block text-xs font-semibold text-[#18191B] mb-1.5">
              Preferred agent
            </label>
            <div className="grid grid-cols-3 gap-2">
              {SPECIALIST_AGENTS.map((agent) => {
                const isSelected = agent.id === currentAgent.id;
                return (
                  <button
                    key={agent.id}
                    type="button"
                    onClick={() => setSelectedAgentId(agent.id)}
                    className={`p-2 rounded-md border text-left flex items-center gap-2 transition-all ${
                      isSelected
                        ? 'border-[#87BAA4] bg-[#EBF5F1]/50 ring-1 ring-[#87BAA4]'
                        : 'border-[#EDEDEB] hover:bg-[#F9F9F8]'
                    }`}
                  >
                    <span
                      className="w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold shrink-0"
                      style={{
                        backgroundColor: agent.badgeBg,
                        color: agent.badgeColor
                      }}
                    >
                      {agent.badge}
                    </span>
                    <div className="truncate">
                      <div className="text-[11px] font-semibold text-[#18191B] truncate">
                        {agent.name}
                      </div>
                      <div className="text-[9.5px] text-[#8C9390]">
                        {agent.ethPriceNumeric} ETH
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Additional Context */}
          <div>
            <label className="block text-xs font-semibold text-[#18191B] mb-1.5">
              Context & parameters (optional)
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Specify documents, timeline, or data sources..."
              className="w-full px-3 py-2 rounded-md border border-[#EDEDEB] text-xs text-[#18191B] focus:outline-none focus:border-[#87BAA4] bg-white"
            />
          </div>

          {/* Escrow Budget Card matching screenshot */}
          <div className="p-3 rounded-lg border border-[#EDEDEB] bg-[#FBFBFB] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded bg-white border border-[#EDEDEB] flex items-center justify-center text-[#2E5E4C]">
                <ShieldCheck className="w-4 h-4 text-[#87BAA4]" />
              </div>
              <div>
                <div className="text-xs font-medium text-[#18191B]">
                  Escrow budget
                </div>
                <div className="text-[10px] text-[#8C9390]">
                  Held until delivery is accepted
                </div>
              </div>
            </div>
            <div className="text-sm font-bold text-[#141618] tabular-nums">
              {currentAgent.ethPriceNumeric} ETH
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 rounded-md bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-xs disabled:opacity-70 cursor-pointer"
            >
              {isSubmitting ? (
                <span>Routing to Agent Escrow...</span>
              ) : (
                <>
                  <span>Fund & post task</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Confirmation Toast */}
        {showToast && (
          <div className="bg-[#141618] text-white text-xs px-4 py-3 flex items-center gap-2 border-t border-white/10 animate-in fade-in duration-150">
            <Check className="w-4 h-4 text-[#87BAA4]" />
            <span>Task posted to escrow queue</span>
          </div>
        )}
      </div>
    </div>
  );
};
