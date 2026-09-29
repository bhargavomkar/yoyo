'use client';

import React, { useState, useMemo } from 'react';
import { WorkOrder } from '@/types/agentMarketplace';
import { AgentMarketplaceService } from '@/services/agentMarketplaceService';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { 
  Clock, 
  Search, 
  Filter, 
  ArrowUpRight, 
  ShieldCheck, 
  FileText,
  AlertCircle
} from 'lucide-react';

interface WorkOrdersListViewProps {
  onSelectWorkOrder: (orderId: string) => void;
  onPostNewTask: () => void;
}

export const WorkOrdersListView: React.FC<WorkOrdersListViewProps> = ({
  onSelectWorkOrder,
  onPostNewTask
}) => {
  const [activeTab, setActiveTab] = useState<'Active' | 'Completed' | 'Cancelled'>('Active');
  const [searchQuery, setSearchQuery] = useState('');

  const orders = useMemo(() => {
    let list = AgentMarketplaceService.getWorkOrders(activeTab);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(o => 
        o.title.toLowerCase().includes(q) ||
        o.agentName.toLowerCase().includes(q) ||
        o.id.toLowerCase().includes(q)
      );
    }
    return list;
  }, [activeTab, searchQuery]);

  return (
    <div className="space-y-6 pb-16 max-w-7xl mx-auto animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-[10.5px] font-semibold uppercase tracking-wider text-[#87BAA4] mb-0.5">
            OPERATIONS
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#141618]">
            Work Orders
          </h1>
          <p className="text-xs sm:text-sm text-[#6C726F] mt-1">
            Track delegated intelligence briefs, evidence generation, and escrow settlements.
          </p>
        </div>

        <button
          onClick={onPostNewTask}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-[#141618] hover:bg-neutral-800 text-white text-xs font-semibold shadow-2xs transition-colors self-start sm:self-auto cursor-pointer"
        >
          <span>+ Post a Task</span>
        </button>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-2">
          {(['Active', 'Completed', 'Cancelled'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === tab
                  ? 'bg-[#141618] text-white shadow-2xs'
                  : 'bg-white border border-[#EDEDEB] text-[#6C726F] hover:bg-[#FAFAF9]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#9AA19E]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search work orders..."
            className="w-full pl-9 pr-3 py-1.5 bg-white border border-[#EDEDEB] rounded-lg text-xs text-[#141618] focus:outline-none focus:border-[#87BAA4]"
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white border border-[#EDEDEB] rounded-xl overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#EDEDEB] bg-[#FAFAF9] text-[#78807C] text-[10.5px] uppercase font-semibold">
                <th className="py-3 px-4">Order ID & Brief</th>
                <th className="py-3 px-4">Assigned Agent</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Escrow Budget</th>
                <th className="py-3 px-4">Created</th>
                <th className="py-3 px-4 text-right">Delivery / ETA</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EDEDEB]/60">
              {orders.map((order) => (
                <tr 
                  key={order.id} 
                  onClick={() => onSelectWorkOrder(order.id)}
                  className="hover:bg-[#F9FAF9] transition-colors cursor-pointer group"
                >
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[11px] font-bold text-[#87BAA4]">{order.id}</span>
                      <span className="font-semibold text-[#141618] group-hover:text-[#2563EB] transition-colors">{order.title}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1.5">
                      <div 
                        className="w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold"
                        style={{ backgroundColor: order.agentBadgeBg, color: order.agentBadgeColor }}
                      >
                        {order.agentBadge}
                      </div>
                      <span className="text-[#4A504D] font-medium">{order.agentName}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <StatusBadge
                      variant={
                        order.status === 'paid' ? 'success' :
                        order.status === 'delivered' ? 'sage' :
                        order.status === 'revision_requested' ? 'warning' : 'info'
                      }
                      size="xs"
                      dot
                    >
                      {order.status.replace('_', ' ').toUpperCase()}
                    </StatusBadge>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-[#141618] tabular-nums">
                    {order.budgetFormatted}
                  </td>
                  <td className="py-3.5 px-4 text-[#8C9390]">
                    {order.createdAt}
                  </td>
                  <td className="py-3.5 px-4 text-right font-medium text-[#4A504D]">
                    {order.expectedDelivery}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button className="px-2.5 py-1 rounded border border-[#EDEDEB] bg-white group-hover:bg-[#141618] group-hover:text-white group-hover:border-[#141618] text-[11px] font-semibold text-[#141618] transition-all inline-flex items-center gap-1">
                      <span>View</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {orders.length === 0 && (
            <div className="text-center py-12 text-xs text-[#9AA19E]">
              No work orders found in this view.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
