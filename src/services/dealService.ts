import { 
  Deal, DealTerm, DueDiligenceCategory, CapTable, 
  DealRisk, ICReview, DealDocument, DealActivity, InvestmentMemo,
  DueDiligenceStatus, DiligenceFinding, RiskType
} from '@/types/deal';
import { 
  DEMO_DEALS, DEMO_DEAL_TERMS, DEMO_CAP_TABLES, DEMO_DUE_DILIGENCE,
  DEMO_DEAL_DOCUMENTS, DEMO_DEAL_RISKS, DEMO_IC_REVIEWS, DEMO_DEAL_ACTIVITIES
} from '@/lib/deal-mock-data';

export class DealService {
  /**
   * Fetch all active deals in the pipeline
   */
  static getPipelineDeals(): Deal[] {
    return DEMO_DEALS;
  }

  /**
   * Get a specific deal by ID
   */
  static getDealById(id: string): Deal | undefined {
    return DEMO_DEALS.find(d => d.id === id);
  }

  /**
   * Get deal terms
   */
  static getDealTerms(dealId: string): DealTerm | undefined {
    return DEMO_DEAL_TERMS[dealId];
  }

  /**
   * Get cap table
   */
  static getCapTable(dealId: string): CapTable | undefined {
    return DEMO_CAP_TABLES[dealId];
  }

  /**
   * Get due diligence categories
   */
  static getDueDiligence(dealId: string): DueDiligenceCategory[] {
    return DEMO_DUE_DILIGENCE[dealId] || [];
  }

  /**
   * Get deal documents
   */
  static getDocuments(dealId: string): DealDocument[] {
    return DEMO_DEAL_DOCUMENTS[dealId] || [];
  }

  /**
   * Get deal risks
   */
  static getRisks(dealId: string): DealRisk[] {
    return DEMO_DEAL_RISKS[dealId] || [];
  }

  /**
   * Get IC review
   */
  static getICReview(dealId: string): ICReview | undefined {
    return DEMO_IC_REVIEWS[dealId];
  }

  /**
   * Get deal activities
   */
  static getActivities(dealId: string): DealActivity[] {
    return DEMO_DEAL_ACTIVITIES[dealId] || [];
  }

  /**
   * Calculate summary metrics for the pipeline
   */
  static getPipelineMetrics() {
    const deals = this.getPipelineDeals();
    return {
      activeDeals: deals.filter(d => d.status === 'active').length,
      totalPipelineValue: deals.reduce((sum, d) => sum + d.roundSize, 0),
      dealsInDiligence: deals.filter(d => d.stage === 'diligence').length,
      dealsInIC: deals.filter(d => d.stage === 'ic_review').length,
    };
  }

  /**
   * Calculate overall diligence progress
   */
  static getDiligenceProgress(dealId: string): { completed: number; total: number; percent: number } {
    const categories = this.getDueDiligence(dealId);
    let totalItems = 0;
    let completedItems = 0;

    categories.forEach(cat => {
      cat.items.forEach(item => {
        totalItems++;
        if (item.isComplete) completedItems++;
      });
    });

    return {
      completed: completedItems,
      total: totalItems,
      percent: totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0
    };
  }
}
