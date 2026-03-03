/**
 * Resource Hints & Preloading Strategy
 * Optimize what to preload, prefetch, and load
 */

/**
 * Smart preloading based on content type and priority
 */
export const preloadResource = (
  url: string,
  type: "script" | "style" | "image" | "font" | "fetch" | "document"
) => {
  if (typeof window === "undefined") return;

  const link = document.createElement("link");
  link.rel = type === "fetch" ? "prefetch" : "preload";
  link.href = url;

  switch (type) {
    case "script":
      link.as = "script";
      break;
    case "style":
      link.as = "style";
      break;
    case "image":
      link.as = "image";
      link.imageSrcset = url;
      break;
    case "font":
      link.as = "font";
      link.type = "font/woff2";
      link.crossOrigin = "anonymous";
      break;
    case "fetch":
      link.as = "fetch";
      link.crossOrigin = "anonymous";
      break;
    case "document":
      link.as = "document";
      break;
  }

  document.head.appendChild(link);
};

/**
 * Prefetch resources for likely next navigation
 * (user probably will visit these pages)
 */
export const prefetchNextPage = (url: string) => {
  preloadResource(url, "document");
};

/**
 * Preload critical fonts to prevent FOUT (Flash of Unstyled Text)
 */
export const preloadFonts = () => {
  // System fonts - no need to preload
  // If using custom fonts, preload them:
  
  // Example:
  // preloadResource("/fonts/roboto-bold.woff2", "font");
};

/**
 * Prioritized preload strategy for initial page load
 */
export const initializePreloading = () => {
  // Preload critical images (above the fold)
  preloadResource("/image/logo.png", "image");

  // Preload critical chunks
  preloadResource("/_next/static/chunks/main.js", "script");

  // Prefetch likely next pages
  prefetchNextPage("/about");
  prefetchNextPage("/contact");
};

/**
 * Detect connection quality and adjust loading strategy
 */
export const getConnectionQuality = (): "slow" | "normal" | "fast" => {
  if (typeof navigator === "undefined") return "normal";

  // @ts-ignore - Connection API
  const connection = navigator.connection || navigator.mozConnection;

  if (!connection) return "normal";

  // Effective type: slow-2g, 2g, 3g, 4g
  const effectiveType = connection.effectiveType;

  if (["slow-2g", "2g", "3g"].includes(effectiveType)) {
    return "slow";
  }
  if (effectiveType === "4g") {
    return "fast";
  }

  return "normal";
};

/**
 * Adjust image quality based on connection
 */
export const getOptimalImageQuality = (): "low" | "medium" | "high" => {
  const quality = getConnectionQuality();
  return quality === "slow" ? "low" : quality === "fast" ? "high" : "medium";
};

/**
 * DNS prefetch for external domains
 * Reduces DNS lookup time for external resources
 */
export const dnsPrefetch = (domain: string) => {
  if (typeof window === "undefined") return;

  const link = document.createElement("link");
  link.rel = "dns-prefetch";
  link.href = domain;
  document.head.appendChild(link);
};

/**
 * Preconnect to critical origins
 * Establishes early connection: DNS + TCP + TLS
 */
export const preconnect = (url: string, crossOrigin?: boolean) => {
  if (typeof window === "undefined") return;

  const link = document.createElement("link");
  link.rel = "preconnect";
  link.href = url;
  if (crossOrigin) {
    link.crossOrigin = "anonymous";
  }
  document.head.appendChild(link);
};

/**
 * Initialize critical resource hints
 */
export const initializeCriticalResourceHints = () => {
  // Preconnect to API server
  preconnect("https://backstage.moxlite.com", true);

  // Preconnect to translation API
  preconnect("https://api.mymemory.translated.net", true);

  // DNS prefetch for tracking
  dnsPrefetch("https://www.googletagmanager.com");
};

/**
 * Monitor resource loading performance
 */
export const monitorResourceTiming = () => {
  if (typeof window === "undefined" || !window.performance) return;

  const resources = performance.getEntriesByType("resource");
  const resourceStats = {
    totalResources: resources.length,
    totalTime: 0,
    byType: {} as Record<string, number>,
  };

  resources.forEach((resource) => {
    const resourceTiming = resource as PerformanceResourceTiming;
    const timing = resourceTiming.duration;
    resourceStats.totalTime += timing;

    const type = resourceTiming.initiatorType || "other";
    if (!resourceStats.byType[type]) {
      resourceStats.byType[type] = 0;
    }
    resourceStats.byType[type] += timing;
  });

  return resourceStats;
};

/**
 * Defer non-critical scripts
 * Call this for scripts that aren't needed immediately
 */
export const deferScript = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") {
      resolve();
      return;
    }

    const script = document.createElement("script");
    script.src = src;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load ${src}`));

    document.body.appendChild(script);
  });
};

/**
 * Load script asynchronously with fallback
 */
export const asyncLoadScript = (
  src: string,
  onLoad?: () => void,
  onError?: () => void
) => {
  if (typeof window === "undefined") return;

  const script = document.createElement("script");
  script.src = src;
  script.async = true;

  script.onload = () => {
    onLoad?.();
  };

  script.onerror = () => {
    console.error(`Failed to load script: ${src}`);
    onError?.();
  };

  document.body.appendChild(script);
};

/**
 * Polyfill loader - load only if needed
 */
export const loadPolyfills = async () => {
  // Check what polyfills are needed
  const polyfillsNeeded = [];

  // Example: IntersectionObserver polyfill
  if (!("IntersectionObserver" in window)) {
    polyfillsNeeded.push("/polyfills/intersection-observer.js");
  }

  // Load all needed polyfills
  await Promise.all(
    polyfillsNeeded.map(
      (url) =>
        new Promise<void>((resolve) => {
          asyncLoadScript(url, resolve);
        })
    )
  );
};
