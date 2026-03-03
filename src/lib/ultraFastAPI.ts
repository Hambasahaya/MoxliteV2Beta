/**
 * Ultra-Fast Request Pipeline
 * Bypasses standard queue for critical high-speed paths
 * Use this for hero section, above-fold content
 */

import { scheduleRequest } from "./requestScheduler";

// Ultra-lightweight cache for critical resources
const CRITICAL_CACHE = new Map<string, { data: any; expiry: number }>();
const CRITICAL_TTL = 5 * 60 * 1000; // 5 minute TTL

/**
 * Parallel fire - launch all high-priority requests simultaneously
 * No waiting, no queuing - maximum speed for critical content
 */
export const parallelFire = async <T = any>(
  urls: string[],
  options?: { timeout?: number; cache?: boolean }
): Promise<(T | null)[]> => {
  const timeout = options?.timeout ?? 2000;
  const useCache = options?.cache ?? true;

  return Promise.allSettled(
    urls.map(async (url) => {
      // Check cache first
      if (useCache) {
        const cached = CRITICAL_CACHE.get(url);
        if (cached && cached.expiry > Date.now()) {
          return cached.data as T;
        }
      }

      try {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), timeout);

        const response = await fetch(url, {
          signal: controller.signal,
          headers: { "Accept-Encoding": "gzip, deflate" },
        });

        clearTimeout(timer);

        if (!response.ok) return null;

        const data = await response.json();

        // Cache result
        if (useCache) {
          CRITICAL_CACHE.set(url, {
            data,
            expiry: Date.now() + CRITICAL_TTL,
          });
        }

        return data as T;
      } catch (error) {
        // Timeout or network error - fail silently
        return null;
      }
    })
  ).then((results) =>
    results.map((result) => (result.status === "fulfilled" ? result.value : null))
  );
};

/**
 * Batch fire - fire multiple requests in quick succession
 * Slightly less aggressive than parallelFire, but still very fast
 */
export const batchFire = async <T = any>(
  requests: Array<{ url: string; priority?: "high" | "normal" }>,
  timeout = 2000
): Promise<(T | null)[]> => {
  // Schedule all high-priority first, then normal without waiting
  const promises = requests.map(({ url, priority = "normal" }) =>
    scheduleRequest(
      async () => {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), timeout);

        try {
          const response = await fetch(url, { signal: controller.signal });
          clearTimeout(timer);

          if (!response.ok) return null;
          return (await response.json()) as T;
        } catch {
          clearTimeout(timer);
          return null;
        }
      },
      priority
    ).catch(() => null)
  );

  return Promise.all(promises);
};

/**
 * Ultra-fast API call with smart timeout
 * Automatically reduces timeout after first try
 */
export const ultraFastCall = async <T = any>(
  url: string,
  options?: {
    initialTimeout?: number; // First attempt timeout
    fallbackTimeout?: number; // Retry timeout
    retries?: number;
  }
): Promise<T | null> => {
  const initialTimeout = options?.initialTimeout ?? 1500;
  const fallbackTimeout = options?.fallbackTimeout ?? 1000;
  const maxRetries = options?.retries ?? 0;

  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const timeout =
        attempt === 0 ? initialTimeout : fallbackTimeout;
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), timeout);

      const response = await fetch(url, { signal: controller.signal });
      clearTimeout(timer);

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      return (await response.json()) as T;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      // Quick backoff - 100ms instead of 1000ms
      if (attempt < maxRetries) {
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
    }
  }

  return null;
};

/**
 * Clear critical cache
 */
export const clearCriticalCache = () => {
  CRITICAL_CACHE.clear();
};

/**
 * Get cache stats
 */
export const getCriticalCacheStats = () => {
  return {
    cached: CRITICAL_CACHE.size,
    keys: Array.from(CRITICAL_CACHE.keys()),
  };
};
