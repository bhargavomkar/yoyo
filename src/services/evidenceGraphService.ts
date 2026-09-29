// ============================================================
// FARO — Evidence Graph Service
// ============================================================
// Traces every AI conclusion back to its underlying data,
// financial statements, source documents, and providers.
// ============================================================

import { EvidenceNode, DataSourceStatus, DataLineageNode } from '@/types/dataLayer';

class EvidenceGraphServiceImpl {

  // ---- Build an evidence chain for a metric ----

  buildMetricEvidenceChain(
    conclusion: string,
    metric: string,
    metricValue: string,
    statementType: string,
    period: string,
    sourceDocument: string,
    sourceSection: string,
    provider: string,
    status: DataSourceStatus,
  ): EvidenceNode {
    return {
      id: `evidence-${Date.now()}`,
      type: 'conclusion',
      label: conclusion,
      status,
      children: [{
        id: `metric-${Date.now()}`,
        type: 'metric',
        label: `${metric} = ${metricValue}`,
        value: metricValue,
        status,
        children: [{
          id: `stmt-${Date.now()}`,
          type: 'statement',
          label: `${statementType} — ${period}`,
          status,
          children: [{
            id: `doc-${Date.now()}`,
            type: 'document',
            label: sourceDocument,
            status,
            children: [{
              id: `section-${Date.now()}`,
              type: 'page_section',
              label: sourceSection,
              status,
              children: [{
                id: `source-${Date.now()}`,
                type: 'source',
                label: `Provider: ${provider}`,
                value: provider,
                status,
                children: [],
              }],
            }],
          }],
        }],
      }],
    };
  }

  // ---- Build data lineage for a computed value ----

  buildLineage(
    outputLabel: string,
    engineName: string,
    calculations: string[],
    normalizedSources: string[],
    rawProviders: string[],
  ): DataLineageNode {
    return {
      id: `lineage-output-${Date.now()}`,
      label: outputLabel,
      type: 'output',
      children: [{
        id: `lineage-engine-${Date.now()}`,
        label: engineName,
        type: 'engine',
        children: calculations.map((calc, i) => ({
          id: `lineage-calc-${Date.now()}-${i}`,
          label: calc,
          type: 'calculation' as const,
          children: normalizedSources.map((src, j) => ({
            id: `lineage-norm-${Date.now()}-${i}-${j}`,
            label: src,
            type: 'normalization' as const,
            children: rawProviders.map((prov, k) => ({
              id: `lineage-prov-${Date.now()}-${i}-${j}-${k}`,
              label: prov,
              type: 'provider' as const,
              children: [],
            })),
          })),
        })),
      }],
    };
  }

  // ---- Portfolio risk lineage ----

  buildPortfolioRiskLineage(): DataLineageNode {
    return this.buildLineage(
      'Portfolio Risk Score',
      'Faro Risk Engine',
      ['Volatility Calculation', 'VaR (95%)', 'Max Drawdown', 'Beta Calculation'],
      ['Normalized Historical Prices', 'Normalized Returns'],
      ['Market Data Provider', 'Retrieved Timestamp'],
    );
  }

  // ---- Flatten evidence tree for display ----

  flattenEvidence(node: EvidenceNode, depth = 0): { node: EvidenceNode; depth: number }[] {
    const result: { node: EvidenceNode; depth: number }[] = [{ node, depth }];
    for (const child of node.children) {
      result.push(...this.flattenEvidence(child, depth + 1));
    }
    return result;
  }
}

export const EvidenceGraphService = new EvidenceGraphServiceImpl();
