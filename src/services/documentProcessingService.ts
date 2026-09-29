// ============================================================
// FARO — Document Processing Service
// ============================================================
// Pipeline for: Upload → Text Extract → Table Extract →
// Financial Extract → Validation → Human Review
// ============================================================

import { DocumentProcessingJob, ExtractedMetric, DocumentProcessingStatus } from '@/types/dataLayer';

class DocumentProcessingServiceImpl {
  private jobs: Map<string, DocumentProcessingJob> = new Map();

  constructor() {
    // Seed with demo jobs
    this.seedDemoJobs();
  }

  private seedDemoJobs() {
    const demoJobs: DocumentProcessingJob[] = [
      {
        id: 'doc-job-001',
        fileName: 'NexGen_Robotics_Series_B_Pitch_Deck.pdf',
        fileType: 'application/pdf',
        fileSizeBytes: 4_200_000,
        uploadedAt: '2026-09-20T14:30:00Z',
        uploadedBy: 'analyst@faro.ai',
        status: 'verified',
        entityId: 'nexgen-robotics',
        entityName: 'NexGen Robotics',
        extractedMetrics: [
          { metric: 'ARR', value: 18_500_000, currency: 'USD', period: 'FY2026', pageNumber: 8, confidence: 0.92, status: 'verified' },
          { metric: 'MRR', value: 1_540_000, currency: 'USD', period: 'Sep-2026', pageNumber: 8, confidence: 0.88, status: 'verified' },
          { metric: 'Gross Margin', value: 0.72, currency: 'USD', period: 'FY2026', pageNumber: 12, confidence: 0.85, status: 'verified' },
        ],
        extractedTables: 4,
        extractedPages: 28,
        processingErrors: [],
        completedAt: '2026-09-20T14:35:00Z',
        verifiedAt: '2026-09-21T10:00:00Z',
        verifiedBy: 'senior-analyst@faro.ai',
      },
      {
        id: 'doc-job-002',
        fileName: 'ArcLight_Energy_Q2_2026_Financials.xlsx',
        fileType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        fileSizeBytes: 1_800_000,
        uploadedAt: '2026-09-25T09:15:00Z',
        uploadedBy: 'analyst@faro.ai',
        status: 'needs_verification',
        entityId: 'arclight-energy',
        entityName: 'ArcLight Energy',
        extractedMetrics: [
          { metric: 'Revenue', value: 8_200_000, currency: 'USD', period: 'Q2-2026', pageNumber: 1, confidence: 0.94, status: 'needs_verification' },
          { metric: 'EBITDA', value: -1_200_000, currency: 'USD', period: 'Q2-2026', pageNumber: 1, confidence: 0.90, status: 'needs_verification' },
          { metric: 'Cash', value: 42_000_000, currency: 'USD', period: 'Q2-2026', pageNumber: 3, confidence: 0.96, status: 'needs_verification' },
        ],
        extractedTables: 6,
        extractedPages: 3,
        processingErrors: [],
        completedAt: '2026-09-25T09:17:00Z',
      },
      {
        id: 'doc-job-003',
        fileName: 'NexGen_Cap_Table_Sep_2026.csv',
        fileType: 'text/csv',
        fileSizeBytes: 45_000,
        uploadedAt: '2026-09-27T16:00:00Z',
        uploadedBy: 'legal@faro.ai',
        status: 'processing',
        entityId: 'nexgen-robotics',
        entityName: 'NexGen Robotics',
        extractedMetrics: [],
        extractedTables: 0,
        extractedPages: 1,
        processingErrors: [],
      },
    ];

    for (const job of demoJobs) {
      this.jobs.set(job.id, job);
    }
  }

  // ---- CRUD ----

  getAllJobs(): DocumentProcessingJob[] {
    return Array.from(this.jobs.values()).sort((a, b) => 
      new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
    );
  }

  getJob(id: string): DocumentProcessingJob | null {
    return this.jobs.get(id) ?? null;
  }

  getJobsByEntity(entityId: string): DocumentProcessingJob[] {
    return this.getAllJobs().filter(j => j.entityId === entityId);
  }

  // ---- Simulated Upload ----

  createJob(fileName: string, fileType: string, fileSizeBytes: number, entityId?: string, entityName?: string): DocumentProcessingJob {
    const job: DocumentProcessingJob = {
      id: `doc-job-${Date.now()}`,
      fileName,
      fileType,
      fileSizeBytes,
      uploadedAt: new Date().toISOString(),
      uploadedBy: 'user@faro.ai',
      status: 'uploaded',
      entityId,
      entityName,
      extractedMetrics: [],
      extractedTables: 0,
      extractedPages: 0,
      processingErrors: [],
    };
    this.jobs.set(job.id, job);
    return job;
  }

  // ---- Status Transitions (simulated) ----

  advanceJob(id: string): DocumentProcessingJob | null {
    const job = this.jobs.get(id);
    if (!job) return null;

    const transitions: Record<DocumentProcessingStatus, DocumentProcessingStatus> = {
      'uploaded': 'processing',
      'processing': 'text_extracted',
      'text_extracted': 'tables_extracted',
      'tables_extracted': 'financials_extracted',
      'financials_extracted': 'validation_pending',
      'validation_pending': 'needs_verification',
      'needs_verification': 'verified',
      'verified': 'verified',
      'failed': 'failed',
    };

    job.status = transitions[job.status];
    if (job.status === 'verified') {
      job.verifiedAt = new Date().toISOString();
      job.verifiedBy = 'analyst@faro.ai';
    }
    return job;
  }

  verifyMetric(jobId: string, metricIndex: number, verified: boolean): void {
    const job = this.jobs.get(jobId);
    if (!job || !job.extractedMetrics[metricIndex]) return;
    job.extractedMetrics[metricIndex].status = verified ? 'verified' : 'rejected';
  }
}

export const DocumentProcessingService = new DocumentProcessingServiceImpl();
