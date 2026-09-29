import { MOCK_EVIDENCE_SOURCES } from '@/lib/research-mock-data';
import { EvidenceSource } from '@/types/research';

export class EvidenceService {
  /**
   * Look up an evidence source by its ID
   */
  static getSourceById(sourceId: string): EvidenceSource | undefined {
    return MOCK_EVIDENCE_SOURCES[sourceId];
  }

  /**
   * Look up an evidence source by citation tag e.g. '[Source 01]'
   */
  static getSourceByCitation(citation: string): EvidenceSource | undefined {
    const clean = citation.trim();
    return Object.values(MOCK_EVIDENCE_SOURCES).find(
      (src) => src.citationNumber.toLowerCase() === clean.toLowerCase()
    );
  }

  /**
   * Retrieve all sources referenced in a company analysis
   */
  static getAllSources(): EvidenceSource[] {
    return Object.values(MOCK_EVIDENCE_SOURCES);
  }
}
