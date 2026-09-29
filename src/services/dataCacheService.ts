// ============================================================
// FARO — Data Cache Service
// ============================================================
// In-memory cache with TTL-based expiration.
// Prevents redundant API calls during a session.
// ============================================================

import { CacheEntry } from '@/types/dataLayer';
import { CACHE_TTL } from '@/config/dataConfig';

class DataCacheServiceImpl {
  private cache: Map<string, CacheEntry> = new Map();

  set<T>(key: string, data: T, provider: string, category: string = 'company_metadata'): void {
    const ttl = CACHE_TTL[category] ?? 3600;
    const now = new Date();
    const expires = new Date(now.getTime() + ttl * 1000);

    this.cache.set(key, {
      key,
      data,
      fetchedAt: now.toISOString(),
      expiresAt: expires.toISOString(),
      provider,
      version: 1,
      hitCount: 0,
    });
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    // Check expiration
    if (new Date(entry.expiresAt).getTime() < Date.now()) {
      this.cache.delete(key);
      return null;
    }

    entry.hitCount++;
    return entry.data as T;
  }

  has(key: string): boolean {
    return this.get(key) !== null;
  }

  invalidate(key: string): void {
    this.cache.delete(key);
  }

  invalidateByPrefix(prefix: string): void {
    for (const key of this.cache.keys()) {
      if (key.startsWith(prefix)) this.cache.delete(key);
    }
  }

  clear(): void {
    this.cache.clear();
  }

  getStats(): { totalEntries: number; totalHits: number; expiredEntries: number } {
    let totalHits = 0;
    let expired = 0;
    const now = Date.now();
    for (const entry of this.cache.values()) {
      totalHits += entry.hitCount;
      if (new Date(entry.expiresAt).getTime() < now) expired++;
    }
    return { totalEntries: this.cache.size, totalHits, expiredEntries: expired };
  }
}

export const DataCacheService = new DataCacheServiceImpl();
