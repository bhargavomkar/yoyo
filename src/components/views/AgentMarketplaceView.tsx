'use client';

import React, { useState, useMemo } from 'react';
import { 
  MarketplaceAgent, 
  AgentCategory, 
  TaskTemplate, 
  TaskBrief 
} from '@/types/agentMarketplace';
import { AgentMarketplaceService } from '@/services/agentMarketplaceService';
import { 
  Search, 
  Filter, 
  Plus, 
  Star, 
  ArrowUpRight, 
  ShieldCheck, 
  Sparkles, 
  Layers, 
  Clock, 
  Check, 
  ArrowRight,
  TrendingUp,
  SlidersHorizontal,
  Bot
} from 'lucide-react';
import { StatusBadge } from '@/components/ui/StatusBadge';

const CATEGORIES: (AgentCategory | 'All')[] = [
  'All',
  'Research',
  'Markets',
  'Private Markets',
  'Due Diligence',
  'Valuation',
  'Risk',
  'Macro',
  'Portfolio',
  'Financial Modeling',
  'Competitive Intelligence'
];

interface AgentMarketplaceViewProps {
  onSelectAgentProfile: (agent: MarketplaceAgent) => void;
  onSelectWorkOrder: (orderId: string) => void;
  initialSelectedAgentId?: string;
}

export const AgentMarketplaceView: React.FC<AgentMarketplaceViewProps> = ({
  onSelectAgentProfile,
  onSelectWorkOrder,
  initialSelectedAgentId
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<AgentCategory | 'All'>('All');
  const [sortBy, setSortBy] = useState<'relevance' | 'rating' | 'price_asc' | 'completed' | 'delivery_time'>('relevance');
  const [availabilityFilter, setAvailabilityFilter] = useState<'All' | 'available' | 'busy'>('All');

  // Work order creation state
  const agents = useMemo(() => {
    return AgentMarketplaceService.getAgents({
      search: searchQuery,
      category: selectedCategory,
      availability: availabilityFilter === 'All' ? undefined : availabilityFilter,
      sortBy
    });
  }, [searchQuery, selectedCategory, availabilityFilter, sortBy]);

  const [selectedAgentId, setSelectedAgentId] = useState<string>(
    initialSelectedAgentId || 'atlas-research'
  );
  const [taskTitle, setTaskTitle] = useState('Map the AI infrastructure landscape');
  const [taskDescription, setTaskDescription] = useState('Identify the major AI infrastructure companies, estimate their market positioning, compare business models, and identify major risks.');
  const [requiredOutput, setRequiredOutput] = useState<TaskBrief['requiredOutput']>('Research Report');
  const [priority, setPriority] = useState<'normal' | 'high'>('normal');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('Task posted to escrow queue');

  const selectedAgent = agents.find(a => a.id === selectedAgentId) || agents[0];
  const templates = AgentMarketplaceService.getTemplates();
  const workOrdersList = AgentMarketplaceService.getWorkOrders('Active');

  const handleApplyTemplate = (tmpl: TaskTemplate) => {
    setTaskTitle(tmpl.name);
    setTaskDescription(tmpl.defaultPrompt);
    setRequiredOutput(tmpl.defaultOutput);
    setSelectedAgentId(tmpl.recommendedAgentId);
    const formElement = document.getElementById('work-order-form');
    formElement?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleFundAndPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim() || !selectedAgent) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const newOrder = AgentMarketplaceService.createWorkOrder({
        taskTitle,
        taskDescription,
        preferredAgentId: selectedAgent.id,
        budgetEth: selectedAgent.pricing.baseEthPrice,
        priority,
        requiredOutput
      });

      setIsSubmitting(false);
      setToastMessage(`Task ${newOrder.id} posted to escrow queue`);
      setShowToast(true);

      setTimeout(() => {
        setShowToast(false);
      }, 4000);
    }, 600);
  };

  return (
    <div className="space-y-8 pb-16 max-w-7xl mx-auto animate-in fade-in duration-200">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <div className="text-[10px] md:text-[11px] font-semibold uppercase tracking-wider text-[#87BAA4] mb-0.5">
            Agent Network
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-[#141618]">
            DELEGATE THE WORK
          </h1>
          <p className="text-xs md:text-sm text-[#6C726F] mt-1 max-w-2xl leading-relaxed">
            Hire specialized intelligence, with every brief and payment visible by design.
          </p>
        </div>

        <button
          onClick={() => {
            const el = document.getElementById('task-title-input');
            el?.focus();
            el?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-[#141618] hover:bg-neutral-800 text-white text-xs font-semibold transition-colors shadow-2xs self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>+ Post a Task</span>
        </button>
      </div>

      {/* 2. Agent Network Pipeline Visualization (User -> Faro Orchestrator -> Specialist Agents) */}
      <div className="bg-white border border-[#EDEDEB] rounded-xl p-4 sm:p-5 shadow-2xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Bot className="w-4 h-4 text-[#87BAA4]" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#141618]">
              Agent Network Topology & Delegation Preview
            </h3>
          </div>
          <span className="text-[10.5px] font-semibold text-[#87BAA4] bg-[#F0F7F4] px-2 py-0.5 rounded border border-[#BAD6CC]/50">
            Agent-to-Agent Architecture v1
          </span>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-xs bg-[#FBFBFA] p-3 rounded-lg border border-[#EDEDEB]">
          <div className="flex items-center gap-2 font-bold text-[#141618]">
            <div className="w-6 h-6 rounded-full bg-[#141618] text-white flex items-center justify-center text-[10px]">
              U
            </div>
            <span>User / Fund Manager</span>
          </div>

          <div className="text-[#87BAA4] font-bold hidden md:block">→</div>

          <div className="flex items-center gap-2 font-semibold text-[#2E6E56] bg-[#EBF5F1] px-3 py-1.5 rounded border border-[#BAD6CC]">
            <span>Faro Orchestrator</span>
          </div>

          <div className="text-[#87BAA4] font-bold hidden md:block">→</div>

          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2 py-1 bg-white border border-[#EDEDEB] rounded font-medium text-[#2B5C8F]">
              Atlas Research
            </span>
            <span className="text-[#9AA19E]">↓</span>
            <span className="px-2 py-1 bg-white border border-[#EDEDEB] rounded font-medium text-[#2E6E56]">
              Keystone Risk
            </span>
            <span className="text-[#9AA19E]">↓</span>
            <span className="px-2 py-1 bg-white border border-[#EDEDEB] rounded font-medium text-[#7E22CE]">
              Meridian Valuation
            </span>
          </div>
        </div>
      </div>

      {/* 3. Task Templates Carousel */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[10.5px] font-semibold uppercase tracking-wider text-[#9AA19E]">
            Quick Task Templates
          </span>
          <span className="text-[10.5px] text-[#6C726F]">
            Pre-configured briefs with institutional schemas
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
          {templates.map((tmpl) => (
            <div
              key={tmpl.id}
              onClick={() => handleApplyTemplate(tmpl)}
              className="p-3 bg-white border border-[#EDEDEB] rounded-lg hover:border-[#87BAA4] hover:shadow-xs transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="text-[10px] font-semibold text-[#87BAA4] uppercase tracking-wider mb-1">
                  {tmpl.category}
                </div>
                <div className="text-xs font-bold text-[#141618] group-hover:text-[#2563EB] transition-colors line-clamp-1">
                  {tmpl.name}
                </div>
                <p className="text-[10.5px] text-[#6C726F] mt-1 line-clamp-2 leading-relaxed">
                  {tmpl.description}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-[#EDEDEB] flex items-center justify-between text-[10px] text-[#8C9390]">
                <span>{tmpl.suggestedBudgetEth} ETH</span>
                <span className="font-semibold text-[#87BAA4] flex items-center gap-0.5">
                  Use Brief <ArrowRight className="w-2.5 h-2.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Search and Filter Bar */}
      <div className="bg-white border border-[#EDEDEB] rounded-xl p-4 shadow-2xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#9AA19E]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search agents by name, specialization, or capability (e.g. 'risk', 'earnings')..."
              className="w-full pl-9 pr-3 py-2 bg-[#FBFBFA] border border-[#EDEDEB] rounded-lg text-xs text-[#141618] focus:outline-none focus:border-[#87BAA4] transition-colors"
            />
          </div>

          {/* Sort & Availability */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 text-xs text-[#6C726F]">
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#9AA19E]" />
              <span>Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-2 py-1.5 bg-[#FBFBFA] border border-[#EDEDEB] rounded-md text-xs text-[#141618] focus:outline-none focus:border-[#87BAA4] cursor-pointer"
              >
                <option value="relevance">Relevance</option>
                <option value="rating">Highest Rating</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="completed">Most Tasks Completed</option>
                <option value="delivery_time">Turnaround SLA</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-[#6C726F]">
              <span>Status:</span>
              <select
                value={availabilityFilter}
                onChange={(e) => setAvailabilityFilter(e.target.value as any)}
                className="px-2 py-1.5 bg-[#FBFBFA] border border-[#EDEDEB] rounded-md text-xs text-[#141618] focus:outline-none focus:border-[#87BAA4] cursor-pointer"
              >
                <option value="All">All Availability</option>
                <option value="available">Available Now</option>
                <option value="busy">Busy / Queued</option>
              </select>
            </div>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-1 pb-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-all whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-[#141618] text-white'
                  : 'bg-[#F5F4F5] text-[#4A504D] hover:bg-[#EAEAEA]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* 5. Main Split View: Agent Cards (Left 7 Cols) + Work Order Panel (Right 5 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Agent Discovery Grid */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-[10.5px] font-semibold uppercase tracking-wider text-[#9AA19E]">
              Marketplace Agents ({agents.length})
            </div>
            <span className="text-[11px] text-[#6C726F]">
              Click card to select · "Hire Agent ↗" to view full profile
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {agents.map((agent) => {
              const isSelected = agent.id === selectedAgentId;
              return (
                <div
                  key={agent.id}
                  onClick={() => setSelectedAgentId(agent.id)}
                  className={`bg-white border rounded-xl p-5 flex flex-col justify-between transition-all duration-150 cursor-pointer shadow-2xs group ${
                    isSelected
                      ? 'border-[#87BAA4] ring-2 ring-[#87BAA4]/50 shadow-sm'
                      : 'border-[#EDEDEB] hover:border-[#87BAA4]/60'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shadow-2xs"
                        style={{
                          backgroundColor: agent.badgeBg,
                          color: agent.badgeColor
                        }}
                      >
                        {agent.badge}
                      </div>

                      <div className="flex items-center gap-2">
                        <StatusBadge
                          variant={agent.availability === 'available' ? 'success' : agent.availability === 'busy' ? 'warning' : 'neutral'}
                          size="xs"
                          dot
                        >
                          {agent.availability.toUpperCase()}
                        </StatusBadge>
                        <div className="flex items-center gap-1 text-xs font-bold text-[#141618]">
                          <Star className="w-3.5 h-3.5 fill-[#E58A38] text-[#E58A38]" />
                          <span>{agent.rating.toFixed(1)}</span>
                        </div>
                      </div>
                    </div>

                    <h3 className="text-base font-bold text-[#141618] group-hover:text-[#2563EB] transition-colors">
                      {agent.name}
                    </h3>
                    <div className="text-xs font-medium text-[#4A504D] mt-0.5">
                      {agent.specialization}
                    </div>

                    <p className="text-[11px] text-[#6C726F] mt-2 line-clamp-2 leading-relaxed">
                      {agent.about}
                    </p>

                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {agent.capabilities.slice(0, 2).map((cap, i) => (
                        <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-[#F5F4F5] text-[#555E59]">
                          {cap}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#EDEDEB]">
                    <div className="flex items-center justify-between text-xs text-[#6C726F] mb-3">
                      <span>{agent.completedTasks} completed</span>
                      <span className="font-extrabold text-[#141618]">
                        {agent.pricing.startingPriceFormatted}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectAgentProfile(agent);
                        }}
                        className="flex-1 py-1.5 px-3 rounded-lg border border-[#EDEDEB] bg-white hover:bg-[#F5F4F5] text-xs font-semibold text-[#141618] flex items-center justify-center gap-1 transition-colors"
                      >
                        <span>Profile & Details</span>
                        <ArrowUpRight className="w-3.5 h-3.5 text-[#878E8B]" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedAgentId(agent.id);
                          const el = document.getElementById('task-title-input');
                          el?.focus();
                        }}
                        className="py-1.5 px-3 rounded-lg bg-[#141618] hover:bg-neutral-800 text-white text-xs font-semibold transition-colors"
                      >
                        Hire
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {agents.length === 0 && (
            <div className="bg-white border border-[#EDEDEB] rounded-xl p-8 text-center text-xs text-[#9AA19E]">
              No specialized agents match your search and filter criteria.
            </div>
          )}
        </div>

        {/* Right: "Give Faro a brief" Work Order & Escrow Form */}
        <div className="lg:col-span-5" id="work-order-form">
          <div className="bg-white border border-[#EDEDEB] rounded-xl p-6 shadow-2xs space-y-4">
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-wider text-[#9AA19E] mb-0.5">
                New Work Order
              </div>
              <h3 className="text-lg font-bold text-[#141618]">
                Give Faro a brief
              </h3>
              <p className="text-xs text-[#6C726F] mt-1 leading-relaxed">
                Describe the question. An agent will pick up the work and return an evidence-backed output.
              </p>
            </div>

            <form onSubmit={handleFundAndPost} className="space-y-4">
              {/* Task Title */}
              <div>
                <label className="block text-xs font-semibold text-[#141618] mb-1">
                  Task Title
                </label>
                <input
                  id="task-title-input"
                  type="text"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  placeholder="e.g. Map the AI infrastructure landscape"
                  className="w-full px-3 py-2 rounded-lg border border-[#EDEDEB] text-xs text-[#141618] focus:outline-none focus:border-[#87BAA4] focus:ring-1 focus:ring-[#87BAA4] bg-white transition-all"
                  required
                />
              </div>

              {/* Task Description */}
              <div>
                <label className="block text-xs font-semibold text-[#141618] mb-1">
                  Task Description / Instructions
                </label>
                <textarea
                  value={taskDescription}
                  onChange={(e) => setTaskDescription(e.target.value)}
                  placeholder="What should the agent investigate? (e.g. Identify the major AI infrastructure companies, estimate their market positioning, compare business models, and identify major risks.)"
                  rows={4}
                  className="w-full px-3 py-2 rounded-lg border border-[#EDEDEB] text-xs text-[#141618] focus:outline-none focus:border-[#87BAA4] focus:ring-1 focus:ring-[#87BAA4] bg-white transition-all leading-relaxed"
                  required
                />
              </div>

              {/* Preferred Agent */}
              <div>
                <label className="block text-xs font-semibold text-[#141618] mb-1">
                  Preferred Agent
                </label>
                <select
                  value={selectedAgentId}
                  onChange={(e) => setSelectedAgentId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-[#EDEDEB] text-xs text-[#141618] focus:outline-none focus:border-[#87BAA4] bg-white cursor-pointer"
                >
                  {agents.map((agent) => (
                    <option key={agent.id} value={agent.id}>
                      {agent.badge} · {agent.name} ({agent.specialization} — {agent.pricing.startingPriceFormatted})
                    </option>
                  ))}
                </select>
              </div>

              {/* Required Output & Priority */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#141618] mb-1">
                    Required Output
                  </label>
                  <select
                    value={requiredOutput}
                    onChange={(e) => setRequiredOutput(e.target.value as any)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-[#EDEDEB] text-xs text-[#141618] focus:outline-none focus:border-[#87BAA4] bg-white cursor-pointer"
                  >
                    <option value="Research Report">Research Report</option>
                    <option value="Financial Model">Financial Model</option>
                    <option value="Risk Analysis">Risk Analysis</option>
                    <option value="Competitive Analysis">Competitive Analysis</option>
                    <option value="Custom">Custom Deliverable</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#141618] mb-1">
                    Priority
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-[#EDEDEB] text-xs text-[#141618] focus:outline-none focus:border-[#87BAA4] bg-white cursor-pointer"
                  >
                    <option value="normal">Normal Priority</option>
                    <option value="high">High Priority (Fast-Track SLA)</option>
                  </select>
                </div>
              </div>

              {/* Escrow Budget Box */}
              <div className="p-4 rounded-xl border border-[#EDEDEB] bg-[#FBFBFA] space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-[#87BAA4]" />
                    <div>
                      <div className="text-xs font-bold text-[#141618]">
                        Escrow Budget
                      </div>
                      <div className="text-[10.5px] text-[#6C726F]">
                        Status: <span className="font-semibold text-[#059669]">Ready to Fund</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-base font-extrabold text-[#141618] tabular-nums">
                    {selectedAgent ? selectedAgent.pricing.startingPriceFormatted : '0.04 ETH'}
                  </div>
                </div>

                <div className="text-[10.5px] text-[#6C726F] pt-2 border-t border-[#EDEDEB] leading-relaxed">
                  Funds are held until the agreed work is delivered and accepted. (Simulated Demo Escrow)
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 px-4 rounded-lg bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer disabled:opacity-70"
              >
                {isSubmitting ? (
                  <span>Dispatching to Escrow Queue...</span>
                ) : (
                  <>
                    <span>Fund & Post Task</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* 6. Active Work Orders Table */}
      <div className="bg-white border border-[#EDEDEB] rounded-xl overflow-hidden shadow-2xs">
        <div className="p-5 pb-3 border-b border-[#EDEDEB] flex items-center justify-between">
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-wider text-[#9AA19E] mb-0.5">
              Your Work Orders
            </div>
            <h3 className="text-base font-bold text-[#141618]">
              Active Delegation Queue
            </h3>
          </div>
          <div className="px-3 py-1 rounded bg-[#EBF5F1] text-[11px] font-semibold text-[#204A3B] border border-[#BAD6CC]">
            0.15 ETH secured in demo escrow
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#EDEDEB] bg-[#FAFAF9] text-[#78807C] text-[10.5px] uppercase font-semibold">
                <th className="py-3 px-4">Order ID & Brief</th>
                <th className="py-3 px-4">Agent</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Escrow Budget</th>
                <th className="py-3 px-4 text-right">Delivery / ETA</th>
                <th className="py-3 px-4 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EDEDEB]/50">
              {workOrdersList.map((order) => (
                <tr 
                  key={order.id} 
                  onClick={() => onSelectWorkOrder(order.id)}
                  className="hover:bg-[#F9FAF9] transition-colors cursor-pointer group"
                >
                  <td className="py-3.5 px-4 font-semibold text-[#18191B] group-hover:text-[#2563EB] transition-colors">
                    <span className="font-mono text-[#87BAA4] mr-2">[{order.id}]</span>
                    {order.title}
                  </td>
                  <td className="py-3.5 px-4 text-[#525955]">
                    <div className="flex items-center gap-1.5 font-medium">
                      <div
                        className="w-4 h-4 rounded text-[9px] font-bold flex items-center justify-center"
                        style={{ backgroundColor: order.agentBadgeBg, color: order.agentBadgeColor }}
                      >
                        {order.agentBadge}
                      </div>
                      <span>{order.agentName}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <StatusBadge
                      variant={order.status === 'delivered' ? 'sage' : order.status === 'paid' ? 'success' : 'warning'}
                      size="xs"
                      dot
                    >
                      {order.status.replace('_', ' ').toUpperCase()}
                    </StatusBadge>
                  </td>
                  <td className="py-3.5 px-4 text-right font-bold text-[#18191B] tabular-nums">
                    {order.budgetFormatted}
                  </td>
                  <td className="py-3.5 px-4 text-right text-[#8C9390]">
                    {order.expectedDelivery}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <span className="text-[#87BAA4] font-semibold flex items-center justify-end gap-0.5 group-hover:translate-x-0.5 transition-transform">
                      View <ArrowRight className="w-3 h-3" />
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Floating Success Toast */}
      {showToast && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#141618] text-white border border-neutral-700 rounded-lg shadow-2xl px-4 py-3 flex items-center gap-3 animate-in slide-in-from-bottom-3 duration-200">
          <div className="w-6 h-6 rounded-full bg-[#059669] text-white flex items-center justify-center">
            <Check className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="text-xs font-semibold">{toastMessage}</div>
            <div className="text-[10px] text-neutral-400">Escrow buffer locked · Agent researching</div>
          </div>
        </div>
      )}
    </div>
  );
};
