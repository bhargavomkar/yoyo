'use client';

import React from 'react';
import { AgentMarketplaceService } from '@/services/agentMarketplaceService';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Activity, Clock, ArrowUpRight, Zap, ShieldCheck } from 'lucide-react';

interface AgentActivityViewProps {
  onSelectWorkOrder: (orderId: string) => void;
}

export const AgentActivityView: React.FC<AgentActivityViewProps> = ({
  onSelectWorkOrder
}) => {
  const activities = AgentMarketplaceService.getActivities();

  return (
    <div className="space-y-6 pb-16 max-w-5xl mx-auto animate-in fade-in duration-200">
      {/* Header */}
      <div>
        <div className="text-[10.5px] font-semibold uppercase tracking-wider text-[#87BAA4] mb-0.5">
          OPERATIONS
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#141618]">
          Agent Activity
        </h1>
        <p className="text-xs sm:text-sm text-[#6C726F] mt-1">
          Real-time decentralized telemetry of agent executions, research findings, and escrow releases.
        </p>
      </div>

      {/* Activity Timeline Card */}
      <div className="bg-white border border-[#EDEDEB] rounded-xl p-6 shadow-2xs space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-[#EDEDEB]">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-[#87BAA4]" />
            <h2 className="text-sm font-bold text-[#141618]">Live Marketplace Stream</h2>
          </div>
          <span className="text-[11px] text-[#9AA19E] flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#059669] animate-pulse" />
            Autonomous Telemetry Active
          </span>
        </div>

        <div className="space-y-4">
          {activities.map((act) => (
            <div
              key={act.id}
              onClick={() => onSelectWorkOrder(act.workOrderId)}
              className="p-4 rounded-lg border border-[#EDEDEB] hover:border-[#87BAA4]/60 bg-[#FBFBFA] hover:bg-white transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
            >
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-md bg-[#141618] text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                  {act.agentBadge}
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold text-[#141618]">{act.agentName}</span>
                    <span className="text-[10px] text-[#9AA19E] font-mono">[{act.workOrderId}]</span>
                    <StatusBadge
                      variant={act.statusBadge.variant}
                      size="xs"
                    >
                      {act.statusBadge.label}
                    </StatusBadge>
                  </div>
                  <div className="text-xs text-[#2D3436] mt-1 font-medium group-hover:text-[#2563EB] transition-colors">
                    {act.action}
                  </div>
                  <div className="text-[10.5px] text-[#8C9390] mt-0.5">
                    Order context: {act.workOrderTitle}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-3 text-right shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#EDEDEB]/50">
                <span className="text-[11px] text-[#9AA19E] font-medium">{act.timestamp}</span>
                <ArrowUpRight className="w-4 h-4 text-[#8C9390] group-hover:text-[#141618] transition-colors" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
