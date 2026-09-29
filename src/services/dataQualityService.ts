// ============================================================
// FARO — Data Quality Service
// ============================================================
// Validates data points for missing values, duplicates,
// currency mismatches, outliers, source conflicts, staleness.
// ============================================================

import {
  DataQualityCheck,
  DataQualityReport,
  DataQualityLevel,
  DataConflict,
  NormalizedFinancialStatement,
  DataSource,
} from '@/types/dataLayer';
import { QUALITY_THRESHOLDS, STALENESS_THRESHOLD } from '@/config/dataConfig';

class DataQualityServiceImpl {

  // ---- Full Report for an entity ----

  generateReport(
    entityId: string,
    entityName: string,
    statements: NormalizedFinancialStatement[],
    conflicts: DataConflict[] = [],
  ): DataQualityReport {
    const checks: DataQualityCheck[] = [];
    const now = new Date().toISOString();

    // Check each statement
    for (const stmt of statements) {
      // Missing values
      for (const metric of stmt.metrics) {
        if (metric.value === null || metric.value === undefined || isNaN(metric.value)) {
          checks.push({
            id: `missing-${stmt.id}-${metric.key}`,
            checkType: 'missing_value',
            entity: entityName,
            metric: metric.label,
            severity: 'warning',
            message: `Missing value for ${metric.label} in ${stmt.period}`,
            detectedAt: now,
          });
        }
      }

      // Stale data check
      const retrievedAt = new Date(stmt.source.retrievedAt).getTime();
      const ageSeconds = (Date.now() - retrievedAt) / 1000;
      const threshold = STALENESS_THRESHOLD.financial_statements;
      if (ageSeconds > threshold) {
        checks.push({
          id: `stale-${stmt.id}`,
          checkType: 'stale_data',
          entity: entityName,
          severity: 'warning',
          message: `${stmt.statementType} for ${stmt.period} was retrieved ${Math.floor(ageSeconds / 86400)} days ago`,
          details: `Threshold: ${Math.floor(threshold / 86400)} days`,
          detectedAt: now,
        });
      }

      // Currency mismatch within statement
      const currencies = new Set(stmt.metrics.map(m => m.currency));
      if (currencies.size > 1) {
        checks.push({
          id: `currency-mismatch-${stmt.id}`,
          checkType: 'currency_mismatch',
          entity: entityName,
          severity: 'error',
          message: `Mixed currencies in ${stmt.statementType} for ${stmt.period}: ${[...currencies].join(', ')}`,
          detectedAt: now,
        });
      }

      // Outlier checks (simple: negative revenue)
      const revenue = stmt.metrics.find(m => m.key === 'revenue');
      if (revenue && revenue.value < 0) {
        checks.push({
          id: `outlier-${stmt.id}-revenue`,
          checkType: 'outlier',
          entity: entityName,
          metric: 'Revenue',
          severity: 'error',
          message: `Negative revenue detected: ${revenue.formattedValue}`,
          detectedAt: now,
        });
      }
    }

    // Source conflict checks
    for (const conflict of conflicts) {
      checks.push({
        id: `conflict-${conflict.id}`,
        checkType: 'source_conflict',
        entity: entityName,
        metric: conflict.metric,
        severity: 'warning',
        message: `Data conflict: ${conflict.sources.length} sources disagree on ${conflict.metric} for ${conflict.period}`,
        details: conflict.sources.map(s => `${s.provider}: ${s.value}`).join(' vs '),
        detectedAt: now,
      });
    }

    // Duplicate period check
    const periodKeys = statements.map(s => `${s.statementType}-${s.period}`);
    const duplicates = periodKeys.filter((k, i) => periodKeys.indexOf(k) !== i);
    for (const dup of duplicates) {
      checks.push({
        id: `duplicate-${dup}`,
        checkType: 'duplicate_record',
        entity: entityName,
        severity: 'warning',
        message: `Duplicate record for ${dup}`,
        detectedAt: now,
      });
    }

    const errors = checks.filter(c => c.severity === 'error' || c.severity === 'critical').length;
    const warnings = checks.filter(c => c.severity === 'warning').length;

    let overallQuality: DataQualityLevel = 'verified';
    if (errors > 0) overallQuality = 'error';
    else if (warnings > 0) overallQuality = 'warning';
    else if (checks.length === 0 && statements.length === 0) overallQuality = 'incomplete';

    return {
      entityId,
      entityName,
      overallQuality,
      totalChecks: checks.length,
      passed: checks.length - errors - warnings,
      warnings,
      errors,
      checks,
      lastAuditedAt: now,
    };
  }

  // ---- Detect conflicts between sources ----

  detectConflicts(
    metric: string,
    entity: string,
    period: string,
    sources: { provider: string; value: number; currency: string; retrievedAt: string; confidence: number }[]
  ): DataConflict | null {
    if (sources.length < 2) return null;

    const values = sources.map(s => s.value);
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    if (mean === 0) return null;

    const maxVariance = Math.max(...values.map(v => Math.abs(v - mean) / mean));
    if (maxVariance <= QUALITY_THRESHOLDS.maxConflictVariance) return null;

    // Conflict detected
    const sorted = [...sources].sort((a, b) => b.confidence - a.confidence);
    return {
      id: `conflict-${entity}-${metric}-${period}`,
      metric,
      entity,
      period,
      sources,
      selectedSourceIndex: sources.indexOf(sorted[0]),
      reason: `Highest confidence source: ${sorted[0].provider} (${(sorted[0].confidence * 100).toFixed(0)}%)`,
      resolvedBy: 'system_priority',
    };
  }
}

export const DataQualityService = new DataQualityServiceImpl();
