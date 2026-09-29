'use client';

import React from 'react';
import { AIAgent } from '@/types';
import { Star, ArrowUpRight, Plus, Bot } from 'lucide-react';

interface AgentPreviewSectionProps {
  agents: AIAgent[];
  onSelectAgent: (agent: AIAgent) => void;
  onPostTask: () => void;
  className?: string;
}

export const AgentPreviewSection: React.FC<AgentPreviewSectionProps> = ({
  agents,
  onSelectAgent,
  onPostTask,
  className = ''
}) => {
  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header matching screenshot */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <div className="text-[10px] md:text-[11px] font-semibold uppercase tracking-wider text-[#87BAA4] mb-0.5">
            Agent Network
          </div>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-[#141618]">
            Delegate the work
          </h2>
          <p className="text-xs md:text-sm text-[#6C726F] mt-0.5 max-w-xl">
            Hire specialized intelligence, with every brief and payment visible by design.
          </p>
        </div>

        <button
          onClick={onPostTask}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-[#141618] hover:bg-neutral-800 text-white text-xs font-medium transition-colors shadow-2xs self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Post a task</span>
        </button>
      </div>

      <div className="text-[10.5px] font-semibold uppercase tracking-wider text-[#9AA19E] pt-1">
        Specialist Agents · {agents.length.toString().padStart(2, '0')} Available
      </div>

      {/* Grid of Agent Cards matching screenshot */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {agents.map((agent) => (
          <div
            key={agent.id}
            className="group relative bg-white border border-[#EDEDEB] rounded-lg p-5 flex flex-col justify-between transition-all duration-150 hover:border-[#87BAA4]/70 hover:shadow-xs"
          >
            <div>
              {/* Top row: Badge and Star rating */}
              <div className="flex items-start justify-between gap-2 mb-3">
                <div
                  className="w-8 h-8 rounded-md flex items-center justify-center text-xs font-bold tracking-tight"
                  style={{
                    backgroundColor: agent.badgeBg,
                    color: agent.badgeColor
                  }}
                >
                  {agent.badge}
                </div>

                <div className="flex items-center gap-1 text-xs font-semibold text-[#18191B]">
                  <Star className="w-3.5 h-3.5 fill-[#E58A38] text-[#E58A38]" />
                  <span>{agent.rating.toFixed(1)}</span>
                </div>
              </div>

              {/* Title & Specialization */}
              <div className="mb-4">
                <h3 className="text-sm md:text-base font-bold text-[#141618] group-hover:text-[#2E5E4C] transition-colors">
                  {agent.name}
                </h3>
                <p className="text-xs text-[#6C726F] mt-0.5">
                  {agent.specialization}
                </p>
              </div>

              {/* Description preview */}
              <p className="text-[11.5px] text-[#7C8480] line-clamp-2 leading-relaxed mb-4">
                {agent.description}
              </p>
            </div>

            <div>
              {/* Stats row: completed & starting price */}
              <div className="pt-3 border-t border-[#EDEDEB]/70 flex items-center justify-between text-xs text-[#7F8682] mb-3">
                <span className="text-[11px]">
                  {agent.completedTasks} completed
                </span>
                <span className="text-[11.5px] font-semibold text-[#18191B] tabular-nums">
                  {agent.startingPrice}
                </span>
              </div>

              {/* Bottom Action Button matching reference screenshot */}
              <button
                type="button"
                onClick={() => onSelectAgent(agent)}
                className="w-full py-1.5 px-3 rounded-md border border-[#EDEDEB] bg-white group-hover:bg-[#F5F4F5] group-hover:border-[#87BAA4]/50 text-xs font-medium text-[#18191B] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>Hire agent</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#878E8B] group-hover:text-[#18191B] transition-colors" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
