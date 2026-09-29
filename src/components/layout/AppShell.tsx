'use client';

import React, { useState } from 'react';
import { FaroSidebar } from './FaroSidebar';
import { TopNavigation } from './TopNavigation';
import { CommandCenterView } from '@/components/views/CommandCenterView';
import { AgentMarketplaceView } from '@/components/views/AgentMarketplaceView';
import { PlaceholderModuleView } from '@/components/views/PlaceholderModuleView';
import { DataHealthView } from '@/components/views/DataHealthView';
import { ResearchWorkspaceView } from '@/components/views/ResearchWorkspaceView';
import { WatchlistView } from '@/components/views/WatchlistView';
import { PortfolioAllocationView } from '@/components/views/PortfolioAllocationView';
import { DealPipelineView } from '@/components/views/DealPipelineView';
import { DealDetailView } from '@/components/views/DealDetailView';
import { WorkOrdersListView } from '@/components/views/WorkOrdersListView';
import { WorkOrderDetailView } from '@/components/views/WorkOrderDetailView';
import { AgentActivityView } from '@/components/views/AgentActivityView';
import { AgentProfileView } from '@/components/views/AgentProfileView';
import { AgentOrchestratorView } from '@/components/views/AgentOrchestratorView';
import { AgentEconomyView } from '@/components/views/AgentEconomyView';
import { MarketplaceAgent, WorkOrder } from '@/types/agentMarketplace';
import { AgentMarketplaceService } from '@/services/agentMarketplaceService';
import { OpportunityDetailModal } from '@/components/modals/OpportunityDetailModal';
import { AgentBriefModal } from '@/components/modals/AgentBriefModal';
import { InsightAnalysisModal } from '@/components/modals/InsightAnalysisModal';
import { CommandPalette } from '@/components/modals/CommandPalette';
import { WORKSPACES, FARO_INTELLIGENCE_INSIGHT, SPECIALIST_AGENTS } from '@/lib/mock-data';
import { NavItemKey, InvestmentOpportunity, AIAgent, Workspace } from '@/types';

export const AppShell: React.FC = () => {
  const [currentTab, setCurrentTabState] = useState<NavItemKey>('command-center');
  const [selectedDealId, setSelectedDealId] = useState<string | null>(null);
  const [selectedAgentProfile, setSelectedAgentProfile] = useState<MarketplaceAgent | null>(null);
  const [selectedWorkOrderId, setSelectedWorkOrderId] = useState<string | null>(null);
  const [currentWorkspace, setCurrentWorkspace] = useState<Workspace>(WORKSPACES[0]);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const setCurrentTab = (tab: NavItemKey) => {
    setCurrentTabState(tab);
    if (tab !== 'deal-pipeline') {
      setSelectedDealId(null);
    }
    if (tab !== 'agent-marketplace') {
      setSelectedAgentProfile(null);
    }
    if (tab !== 'work-orders') {
      setSelectedWorkOrderId(null);
    }
  };
  
  // Interactive Modals State
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedOpportunity, setSelectedOpportunity] = useState<InvestmentOpportunity | null>(null);
  const [selectedAgentForBrief, setSelectedAgentForBrief] = useState<AIAgent | null>(null);
  const [isBriefModalOpen, setIsBriefModalOpen] = useState(false);
  const [isInsightAnalysisOpen, setIsInsightAnalysisOpen] = useState(false);

  // Handlers
  const handleOpenBriefWithAgent = (agent: AIAgent) => {
    setSelectedAgentForBrief(agent);
    setIsBriefModalOpen(true);
  };

  const handleOpenGeneralBrief = () => {
    setSelectedAgentForBrief(SPECIALIST_AGENTS[0]);
    setIsBriefModalOpen(true);
  };

  const handleDeployAgentForOpp = (opp: InvestmentOpportunity) => {
    setSelectedOpportunity(null);
    setSelectedAgentForBrief(SPECIALIST_AGENTS[1]); // Mosaic Diligence
    setIsBriefModalOpen(true);
  };

  return (
    <div className="min-h-screen flex bg-[#F5F4F5] text-[#141618]">
      {/* 1. Institutional Sidebar */}
      <FaroSidebar
        currentTab={currentTab}
        onSelectTab={(tab) => setCurrentTab(tab)}
        isOpenMobile={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
        currentWorkspace={currentWorkspace}
        onSelectWorkspace={setCurrentWorkspace}
      />

      {/* 2. Main Content Viewport */}
      <div className="flex-1 flex flex-col min-w-0">
        <TopNavigation
          currentTab={currentTab}
          onOpenSearch={() => setIsSearchOpen(true)}
          onToggleMobileSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)}
        />

        {/* Dynamic page container */}
        <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto">
          {currentTab === 'command-center' && (
            <CommandCenterView
              onSelectOpportunity={(opp) => setSelectedOpportunity(opp)}
              onSelectAgent={handleOpenBriefWithAgent}
              onPostTask={handleOpenGeneralBrief}
              onOpenAnalysis={() => setIsInsightAnalysisOpen(true)}
              onNavigateToMarketplace={() => setCurrentTab('agent-marketplace')}
              onNavigateToAgentActivity={() => setCurrentTab('agent-activity')}
              onSelectPortfolio={() => setCurrentTab('portfolio-allocation')}
            />
          )}

          {currentTab === 'agent-marketplace' && (
            selectedAgentProfile ? (
              <AgentProfileView
                agent={selectedAgentProfile}
                onBack={() => setSelectedAgentProfile(null)}
                onHireAgent={(agent) => {
                  setSelectedAgentProfile(null);
                  handleOpenBriefWithAgent(agent as any);
                }}
              />
            ) : (
              <AgentMarketplaceView
                onSelectAgentProfile={(agent) => setSelectedAgentProfile(agent)}
                onSelectWorkOrder={(orderId) => {
                  setSelectedWorkOrderId(orderId);
                  setCurrentTab('work-orders');
                }}
              />
            )
          )}

          {currentTab === 'work-orders' && (
            selectedWorkOrderId ? (
              (() => {
                const order = AgentMarketplaceService.getWorkOrderById(selectedWorkOrderId);
                if (!order) return <WorkOrdersListView onSelectWorkOrder={setSelectedWorkOrderId} onPostNewTask={() => setCurrentTab('agent-marketplace')} />;
                return (
                  <WorkOrderDetailView
                    workOrder={order}
                    onBack={() => setSelectedWorkOrderId(null)}
                    onOrderUpdated={() => {
                      // Trigger re-render
                      setSelectedWorkOrderId(selectedWorkOrderId);
                    }}
                  />
                );
              })()
            ) : (
              <WorkOrdersListView
                onSelectWorkOrder={(orderId) => setSelectedWorkOrderId(orderId)}
                onPostNewTask={() => setCurrentTab('agent-marketplace')}
              />
            )
          )}

          {currentTab === 'agent-activity' && (
            <AgentActivityView
              onSelectWorkOrder={(orderId) => {
                setSelectedWorkOrderId(orderId);
                setCurrentTab('work-orders');
              }}
            />
          )}

          {currentTab === 'research-workspace' && (
            <ResearchWorkspaceView />
          )}

          {currentTab === 'watchlist' && (
            <WatchlistView
              onNavigateToResearch={() => setCurrentTab('research-workspace')}
            />
          )}

          {currentTab === 'portfolio-allocation' && (
            <PortfolioAllocationView />
          )}

          {(currentTab === 'deal-pipeline' || currentTab === 'due-diligence') && (
            selectedDealId ? (
              <DealDetailView 
                dealId={selectedDealId} 
                onBack={() => setSelectedDealId(null)} 
              />
            ) : (
              <DealPipelineView 
                onSelectDeal={(id) => setSelectedDealId(id)} 
              />
            )
          )}

          {currentTab === 'agent-orchestrator' && (
            <AgentOrchestratorView />
          )}

          {currentTab === 'agent-economy' && (
            <AgentEconomyView />
          )}

          {currentTab === 'data-health' && (
            <DataHealthView />
          )}

          {currentTab !== 'command-center' && 
           currentTab !== 'agent-marketplace' && 
           currentTab !== 'agent-orchestrator' && 
           currentTab !== 'agent-economy' && 
           currentTab !== 'data-health' && 
           currentTab !== 'work-orders' && 
           currentTab !== 'agent-activity' && 
           currentTab !== 'research-workspace' && 
           currentTab !== 'watchlist' && 
           currentTab !== 'portfolio-allocation' && 
           currentTab !== 'deal-pipeline' && 
           currentTab !== 'due-diligence' && (
            <PlaceholderModuleView
              tabKey={currentTab}
              onBackToCommandCenter={() => setCurrentTab('command-center')}
              onDeployAgent={handleOpenGeneralBrief}
            />
          )}
        </main>
      </div>

      {/* 3. Interactive Modals & Drawers */}
      <OpportunityDetailModal
        opportunity={selectedOpportunity}
        onClose={() => setSelectedOpportunity(null)}
        onDeployAgentForOpp={handleDeployAgentForOpp}
      />

      <AgentBriefModal
        isOpen={isBriefModalOpen}
        onClose={() => setIsBriefModalOpen(false)}
        initialAgent={selectedAgentForBrief}
        onTaskCreated={(task) => {
          // Task dispatched
        }}
      />

      <InsightAnalysisModal
        insight={FARO_INTELLIGENCE_INSIGHT}
        isOpen={isInsightAnalysisOpen}
        onClose={() => setIsInsightAnalysisOpen(false)}
        onCommissionAgent={() => {
          setSelectedAgentForBrief(SPECIALIST_AGENTS[2]); // Keystone Risk
          setIsBriefModalOpen(true);
        }}
      />

      <CommandPalette
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectNav={(key) => setCurrentTab(key)}
        onSelectOpp={(opp) => setSelectedOpportunity(opp)}
        onSelectAgent={handleOpenBriefWithAgent}
      />
    </div>
  );
};
