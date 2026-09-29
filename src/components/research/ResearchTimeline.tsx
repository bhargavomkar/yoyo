'use client';

import React from 'react';
import { ResearchActivityEvent } from '@/types/research';
import { Activity, Clock, Bot, Cpu, ShieldAlert, CheckCircle2, User } from 'lucide-react';

interface ResearchTimelineProps {
  events: ResearchActivityEvent[];
  onDelegateNewTask?: () => void;
}

export const ResearchTimeline: React.FC<ResearchTimelineProps> = ({
  events,
  onDelegateNewTask
}) => {
  const getActorIcon = (actor: string) => {
    switch (actor) {
      case 'Atlas Research':
        return <Bot className="w-3.5 h-3.5 text-[#2B5C8F]" />;
      case 'Keystone Risk':
        return <ShieldAlert className="w-3.5 h-3.5 text-[#2E6E56]" />;
      case 'Mosaic Diligence':
        return <Cpu className="w-3.5 h-3.5 text-[#A85A24]" />;
      case 'Analyst':
        return <User className="w-3.5 h-3.5 text-[#18191B]" />;
      default:
        return <Activity className="w-3.5 h-3.5 text-[#87BAA4]" />;
    }
  };

  return (
    <div className="bg-white border border-[#EDEDEB] rounded-lg p-5 shadow-2xs space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#EDEDEB]/70">
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-wider text-[#87BAA4] mb-0.5">
            Audit Trail & Agent Dispatch
          </div>
          <h4 className="text-sm font-bold text-[#141618]">
            Research Activity Timeline
          </h4>
        </div>

        {onDelegateNewTask && (
          <button
            onClick={onDelegateNewTask}
            className="px-2.5 py-1 rounded bg-[#F5F4F5] hover:bg-[#EDEDEB] text-[#18191B] text-[11px] font-medium transition-colors border border-[#EDEDEB] cursor-pointer"
          >
            + Assign Agent
          </button>
        )}
      </div>

      {/* Timeline items */}
      <div className="relative pl-4 space-y-4 before:absolute before:left-1.5 before:top-2 before:bottom-2 before:w-[1px] before:bg-[#EDEDEB]">
        {events.map((ev) => (
          <div key={ev.id} className="relative group">
            {/* Timeline dot */}
            <div className="absolute -left-[19px] top-1 w-3 h-3 rounded-full bg-white border-2 border-[#87BAA4] group-hover:scale-110 transition-transform" />

            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="text-[10.5px] font-mono text-[#8C9390]">
                  {ev.date}
                </span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#F5F4F5] text-[#555C58] font-medium flex items-center gap-1">
                  {getActorIcon(ev.actor)}
                  <span>{ev.actor}</span>
                </span>
                {ev.badge && (
                  <span className="text-[9.5px] font-medium text-[#204A3B] bg-[#EBF5F1] px-1 rounded">
                    {ev.badge}
                  </span>
                )}
              </div>

              <div className="text-xs font-semibold text-[#18191B]">
                {ev.title}
              </div>

              <p className="text-[11px] text-[#6C726F] leading-relaxed">
                {ev.detail}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
