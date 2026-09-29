import { 
  MarketplaceAgent, 
  WorkOrder, 
  TaskTemplate, 
  AgentActivityEvent, 
  AgentCategory,
  WorkOrderStatus,
  TaskBrief,
  AgentDeliverable,
  AgentReview
} from '@/types/agentMarketplace';
import { 
  DEMO_MARKETPLACE_AGENTS, 
  DEMO_TASK_TEMPLATES, 
  INITIAL_WORK_ORDERS, 
  INITIAL_AGENT_ACTIVITIES 
} from '@/lib/agentMarketplaceMockData';

// In-memory state with lazy LocalStorage persistence where client allows
class AgentMarketplaceManager {
  private agents: MarketplaceAgent[] = [...DEMO_MARKETPLACE_AGENTS];
  private workOrders: WorkOrder[] = [...INITIAL_WORK_ORDERS];
  private templates: TaskTemplate[] = [...DEMO_TASK_TEMPLATES];
  private activities: AgentActivityEvent[] = [...INITIAL_AGENT_ACTIVITIES];

  // --- Agents ---
  public getAgents(filters?: {
    search?: string;
    category?: AgentCategory | 'All';
    minRating?: number;
    availability?: string;
    sortBy?: 'relevance' | 'rating' | 'price_asc' | 'price_desc' | 'completed' | 'delivery_time';
  }): MarketplaceAgent[] {
    let result = [...this.agents];

    if (filters?.search && filters.search.trim()) {
      const q = filters.search.toLowerCase().trim();
      result = result.filter(a => 
        a.name.toLowerCase().includes(q) ||
        a.specialization.toLowerCase().includes(q) ||
        a.about.toLowerCase().includes(q) ||
        a.capabilities.some(c => c.toLowerCase().includes(q))
      );
    }

    if (filters?.category && filters.category !== 'All') {
      result = result.filter(a => a.category === filters.category);
    }

    if (filters?.minRating) {
      result = result.filter(a => a.rating >= (filters.minRating || 0));
    }

    if (filters?.availability && filters.availability !== 'All') {
      const avail = filters.availability.toLowerCase();
      result = result.filter(a => a.availability === avail);
    }

    if (filters?.sortBy) {
      switch (filters.sortBy) {
        case 'rating':
          result.sort((a, b) => b.rating - a.rating);
          break;
        case 'price_asc':
          result.sort((a, b) => a.pricing.baseEthPrice - b.pricing.baseEthPrice);
          break;
        case 'price_desc':
          result.sort((a, b) => b.pricing.baseEthPrice - a.pricing.baseEthPrice);
          break;
        case 'completed':
          result.sort((a, b) => b.completedTasks - a.completedTasks);
          break;
        case 'delivery_time':
          result.sort((a, b) => parseFloat(a.latency) - parseFloat(b.latency));
          break;
        default:
          break;
      }
    }

    return result;
  }

  public getAgentById(id: string): MarketplaceAgent | undefined {
    return this.agents.find(a => a.id === id);
  }

  public addAgentReview(agentId: string, review: Omit<AgentReview, 'id' | 'date'>): AgentReview {
    const agent = this.agents.find(a => a.id === agentId);
    const newRev: AgentReview = {
      ...review,
      id: `rev-${Date.now()}`,
      date: 'Just now'
    };
    if (agent) {
      agent.reviews = [newRev, ...agent.reviews];
      // Recalculate average rating
      const sum = agent.reviews.reduce((acc, r) => acc + r.rating, 0);
      agent.rating = parseFloat((sum / agent.reviews.length).toFixed(1));
    }
    return newRev;
  }

  // --- Work Orders ---
  public getWorkOrders(tab?: 'Active' | 'Completed' | 'Cancelled'): WorkOrder[] {
    if (!tab || tab === 'Active') {
      return this.workOrders.filter(w => !['paid', 'cancelled', 'disputed'].includes(w.status));
    }
    if (tab === 'Completed') {
      return this.workOrders.filter(w => ['paid', 'accepted_by_user'].includes(w.status));
    }
    if (tab === 'Cancelled') {
      return this.workOrders.filter(w => ['cancelled', 'disputed'].includes(w.status));
    }
    return this.workOrders;
  }

  public getWorkOrderById(id: string): WorkOrder | undefined {
    return this.workOrders.find(w => w.id === id);
  }

  public createWorkOrder(brief: TaskBrief): WorkOrder {
    const agent = this.getAgentById(brief.preferredAgentId) || this.agents[0];
    const orderNum = 1042 + this.workOrders.length + 1;
    const orderId = `WORK-${orderNum}`;

    const newOrder: WorkOrder = {
      id: orderId,
      title: brief.taskTitle,
      agentId: agent.id,
      agentName: agent.name,
      agentBadge: agent.badge,
      agentBadgeBg: agent.badgeBg,
      agentBadgeColor: agent.badgeColor,
      brief,
      budgetEth: brief.budgetEth || agent.pricing.baseEthPrice,
      budgetFormatted: `${brief.budgetEth || agent.pricing.baseEthPrice} ETH`,
      status: 'posted',
      escrow: {
        escrowId: `ESC-${Math.floor(1000 + Math.random() * 9000)}`,
        budgetEth: brief.budgetEth || agent.pricing.baseEthPrice,
        budgetFormatted: `${brief.budgetEth || agent.pricing.baseEthPrice} ETH`,
        status: 'funded_simulated',
        isSimulatedDemo: true,
        depositTxHash: `0x${Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`,
        explanation: 'Funds are held in simulated demo escrow until the deliverable is accepted.'
      },
      createdAt: 'Just now',
      lastUpdated: 'Just now',
      expectedDelivery: `~${agent.latency}`,
      timeline: [
        {
          id: `tl-${Date.now()}-1`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          timeOffset: 'Just now',
          label: 'Task created & demo escrow funded',
          detail: '0.04 ETH placed into simulated smart escrow buffer',
          type: 'creation'
        },
        {
          id: `tl-${Date.now()}-2`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          timeOffset: 'Just now',
          label: `${agent.name} queued task for processing`,
          type: 'assignment'
        }
      ]
    };

    this.workOrders = [newOrder, ...this.workOrders];

    // Add activity
    this.addActivity({
      agentId: agent.id,
      agentName: agent.name,
      agentBadge: agent.badge,
      workOrderId: orderId,
      workOrderTitle: brief.taskTitle,
      action: `Created new work order: ${brief.taskTitle}`,
      actionType: 'accepted',
      statusBadge: { label: 'Task Posted', variant: 'info' }
    });

    return newOrder;
  }

  public acceptDeliverable(workOrderId: string): WorkOrder | undefined {
    const order = this.workOrders.find(w => w.id === workOrderId);
    if (!order) return undefined;

    order.status = 'paid';
    order.escrow.status = 'released_simulated';
    order.escrow.releaseTxHash = `0x${Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;
    order.lastUpdated = 'Just now';
    order.timeline.push({
      id: `tl-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      timeOffset: 'Just now',
      label: 'Deliverable accepted by user — simulated escrow released',
      type: 'payment'
    });

    this.addActivity({
      agentId: order.agentId,
      agentName: order.agentName,
      agentBadge: order.agentBadge,
      workOrderId: order.id,
      workOrderTitle: order.title,
      action: `Deliverable accepted by user. ${order.budgetFormatted} demo payment released`,
      actionType: 'paid',
      statusBadge: { label: 'Payment Released', variant: 'success' }
    });

    return order;
  }

  public requestRevision(workOrderId: string, notes: string): WorkOrder | undefined {
    const order = this.workOrders.find(w => w.id === workOrderId);
    if (!order) return undefined;

    order.status = 'revision_requested';
    order.revisionNotes = notes;
    order.lastUpdated = 'Just now';
    order.timeline.push({
      id: `tl-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      timeOffset: 'Just now',
      label: `Revision requested: "${notes.slice(0, 50)}..."`,
      type: 'review'
    });

    this.addActivity({
      agentId: order.agentId,
      agentName: order.agentName,
      agentBadge: order.agentBadge,
      workOrderId: order.id,
      workOrderTitle: order.title,
      action: `Revision requested: ${notes}`,
      actionType: 'revision',
      statusBadge: { label: 'Revision Requested', variant: 'warning' }
    });

    return order;
  }

  // --- Task Templates ---
  public getTemplates(): TaskTemplate[] {
    return this.templates;
  }

  // --- Agent Activity ---
  public getActivities(): AgentActivityEvent[] {
    return this.activities;
  }

  private addActivity(event: Omit<AgentActivityEvent, 'id' | 'timestamp'>) {
    const newAct: AgentActivityEvent = {
      ...event,
      id: `act-${Date.now()}`,
      timestamp: 'Just now'
    };
    this.activities = [newAct, ...this.activities];
  }
}

export const AgentMarketplaceService = new AgentMarketplaceManager();
