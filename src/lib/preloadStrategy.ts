/**
 * Preload Data Strategy
 * Load critical data immediately on page load before components render
 */

import { parallelFire, ultraFastCall } from "./ultraFastAPI";

interface PreloadConfig {
  name: string;
  url: string;
  priority: "critical" | "high" | "normal";
  timeout?: number;
}

const preloadedData = new Map<string, any>();
let isPreloading = false;

/**
 * Preload critical data in parallel
 * Call this as early as possible (in _app.tsx or before first page loads)
 */
export const preloadCriticalData = async (
  configs: PreloadConfig[]
): Promise<void> => {
  if (isPreloading) return; // Prevent duplicate loads
  isPreloading = true;

  // Sort by priority
  const sorted = [...configs].sort((a, b) => {
    const priorityMap = { critical: 0, high: 1, normal: 2 };
    return (
      priorityMap[a.priority as keyof typeof priorityMap] -
      priorityMap[b.priority as keyof typeof priorityMap]
    );
  });

  // Fire critical first, then rest
  const criticalConfigs = sorted.filter((c) => c.priority === "critical");
  const restConfigs = sorted.filter((c) => c.priority !== "critical");

  // Load critical in parallel with short timeout
  await Promise.allSettled(
    criticalConfigs.map((config) =>
      ultraFastCall(config.url, {
        initialTimeout: config.timeout ?? 1500,
        retries: 0,
      }).then((data) => {
        if (data) preloadedData.set(config.name, data);
      })
    )
  );

  // Load rest without waiting
  Promise.allSettled(
    restConfigs.map((config) =>
      ultraFastCall(config.url, {
        initialTimeout: config.timeout ?? 2000,
        retries: 0,
      }).then((data) => {
        if (data) preloadedData.set(config.name, data);
      })
    )
  ).catch(() => {
    // Ignore errors - we already tried
  });
};

/**
 * Get preloaded data
 */
export const getPreloadedData = <T = any>(name: string): T | null => {
  return (preloadedData.get(name) as T) || null;
};

/**
 * Preload chain - popular navigation paths
 */
export const preloadNextPage = async (
  pathname: string,
  requiredResources: string[]
): Promise<void> => {
  // Start preloading data for next likely page
  const configs: PreloadConfig[] = requiredResources.map((resource) => ({
    name: `${pathname}:${resource}`,
    url: resource,
    priority: "normal",
    timeout: 2000,
  }));

  // Don't wait for this - just queue it up
  setImmediate(() => preloadCriticalData(configs));
};

/**
 * Get all preloaded keys
 */
export const getPreloadedKeys = (): string[] => {
  return Array.from(preloadedData.keys());
};

/**
 * Clear preloaded data (useful for page transitions)
 */
export const clearPreloadedData = (name?: string): void => {
  if (name) {
    preloadedData.delete(name);
  } else {
    preloadedData.clear();
    isPreloading = false;
  }
};

/**
 * Suggested critical data to preload on app start
 * Edit this based on your actual API endpoints
 */
export const DEFAULT_CRITICAL_PRELOAD: PreloadConfig[] = [
  // Hero section data
  {
    name: "heroSlides",
    url: "/api/hero-slides",
    priority: "critical",
    timeout: 1500,
  },
  // Navigation/menu data
  {
    name: "navigation",
    url: "/api/navigation",
    priority: "critical",
    timeout: 1500,
  },
  // Product categories
  {
    name: "categories",
    url: "/api/categories",
    priority: "high",
    timeout: 2000,
  },
  // Featured products
  {
    name: "featured",
    url: "/api/products/featured",
    priority: "high",
    timeout: 2000,
  },
  // News/blog posts
  {
    name: "news",
    url: "/api/news",
    priority: "normal",
    timeout: 2000,
  },
];

/**
 * Auto-init preloading with default config
 * Call this in _app.tsx useEffect
 */
export const initAutomaticPreload = () => {
  if (typeof window === "undefined") return; // Server-side guard

  // Start preloading critical data immediately
  setImmediate(() => {
    preloadCriticalData(DEFAULT_CRITICAL_PRELOAD).catch(console.error);
  });
};
