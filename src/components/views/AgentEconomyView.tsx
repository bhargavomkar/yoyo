'use client';

import React from 'react';
import { DEMO_MARKETPLACE_AGENTS } from '@/lib/agentMarketplaceMockData';
import { OrchestratorService } from '@/services/orchestratorService';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { 
  Coins, 
  TrendingUp, 
  Activity, 
  CheckCircle2, 
  ArrowUpRight, 
  ShieldCheck, 
  Star,
  Zap,
  BarChart3
} from 'lucide-react';

export const AgentEconomyView: React.FC = () => {
  const workflows = OrchestratorService.getWorkflows();
  const agents = DEMO_MARKETPLACE_AGENTS;

  const totalCompletedTasks = agents.reduce((acc, a) => acc + a.completedTasks, 0);
  const avgSuccessRate = (agents.reduce((acc, a) => acc + a.successRate, 0) / agents.length).toFixed(1);

  return (
    <div className="space-y-8 pb-16 max-w-7xl mx-auto animate-in fade-in duration-150">
      {/* Header */}
      <div>
        <div className="text-[10.5px] font-semibold uppercase tracking-wider text-[#87BAA4] mb-0.5">
          Decentralized Intelligence Economy
        </div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-[#141618]">
          Agent Economy
        </h1>
        <p className="text-xs md:text-sm text-[#6C726F] mt-1 max-w-2xl">
          Telemetry of decentralized agent fees, escrow settlements, reputation scores, and cross-agent utilization.
        </p>
      </div>

      {/* Economy Overview Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-[#EDEDEB] rounded-xl p-5 shadow-2xs">
          <div className="text-[10px] text-[#9AA19E] uppercase font-semibold">Active Workflows</div>
          <div className="text-2xl font-bold text-[#141618] mt-1">{workflows.length} Coordinated</div>
          <div className="text-[10.5px] text-[#059669] font-medium mt-0.5">100% On-SLA Delivery</div>
        </div>

        <div className="bg-white border border-[#EDEDEB] rounded-xl p-5 shadow-2xs">
          <div className="text-[10px] text-[#9AA19E] uppercase font-semibold">Total Tasks Completed</div>
          <div className="text-2xl font-bold text-[#141618] mt-1">{totalCompletedTasks}</div>
          <div className="text-[10.5px] text-[#6C726F] mt-0.5">Across 6 Specialized Agents</div>
        </div>

        <div className="bg-white border border-[#EDEDEB] rounded-xl p-5 shadow-2xs">
          <div className="text-[10px] text-[#9AA19E] uppercase font-semibold">Total Demo Spend</div>
          <div className="text-2xl font-bold text-[#141618] mt-1">1.84 ETH</div>
          <div className="text-[10.5px] text-[#87BAA4] font-medium mt-0.5">Simulated Escrow Volume</div>
        </div>

        <div className="bg-white border border-[#EDEDEB] rounded-xl p-5 shadow-2xs">
          <div className="text-[10px] text-[#9AA19E] uppercase font-semibold">Average Success Rate</div>
          <div className="text-2xl font-bold text-[#059669] mt-1">{avgSuccessRate}%</div>
          <div className="text-[10.5px] text-[#6C726F] mt-0.5">Dual-Pass Verified</div>
        </div>
      </div>

      {/* Agents Reputation & Pricing Table */}
      <div className="bg-white border border-[#EDEDEB] rounded-xl overflow-hidden shadow-2xs">
        <div className="p-5 pb-3 border-b border-[#EDEDEB] flex items-center justify-between">
          <div>
            <div className="text-[10px] uppercase font-semibold text-[#87BAA4] tracking-wider">
              Reputation & SLA Ledger
            </div>
            <h3 className="text-base font-bold text-[#141618]">Top Specialized Agents</h3>
          </div>
          <span className="text-xs text-[#6C726F]">Transparent Performance Metrics</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#EDEDEB] bg-[#FAFAF9] text-[#78807C] text-[10.5px] uppercase font-semibold">
                <th className="py-3 px-4">Agent Name</th>
                <th className="py-3 px-4">Specialization</th>
                <th className="py-3 px-4">Rating</th>
                <th className="py-3 px-4">Completed</th>
                <th className="py-3 px-4">Success Rate</th>
                <th className="py-3 px-4">Base Pricing</th>
                <th className="py-3 px-4 text-right">Avg SLA</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EDEDEB]/50">
              {agents.map(agent => (
                <tr key={agent.id} className="hover:bg-[#F9FAF9] transition-colors">
                  <td className="py-3.5 px-4 font-bold text-[#141618] flex items-center gap-2">
                    <div 
                      className="w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold"
                      style={{ backgroundColor: agent.badgeBg, color: agent.badgeColor }}
                    >
                      {agent.badge}
                    </div>
                    <span>{agent.name}</span>
                  </td>
                  <td className="py-3.5 px-4 text-[#4A504D]">{agent.specialization}</td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1 font-bold text-[#141618]">
                      <Star className="w-3.5 h-3.5 fill-[#E58A38] text-[#E58A38]" />
                      <span>{agent.rating.toFixed(1)}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-[#141618]">{agent.completedTasks} tasks</td>
                  <td className="py-3.5 px-4 font-bold text-[#059669]">{agent.successRate}%</td>
                  <td className="py-3.5 px-4 font-mono font-bold text-[#141618]">{agent.pricing.startingPriceFormatted}</td>
                  <td className="py-3.5 px-4 text-right font-medium text-[#6C726F]">{agent.latency}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Simulated Escrow Architecture Notice */}
      <div className="p-4 bg-[#FBFBFA] border border-[#EDEDEB] rounded-xl flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-[#87BAA4] shrink-0 mt-0.5" />
        <div className="text-xs text-[#6C726F] leading-relaxed">
          <span className="font-bold text-[#141618]">Decentralized Micro-Payment Architecture Notice: </span>
          All token escrow settlements in this phase are simulated in-memory and client storage. Future phases will integrate smart-contract escrow routing on Ethereum/Base for autonomous micro-agent settlement.
        </div>
      </div>
    </div>
  );
};
