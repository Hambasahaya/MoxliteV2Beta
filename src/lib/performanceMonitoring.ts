/**
 * Load Balancing Monitor & Dashboard
 * Track performance metrics and identify bottlenecks
 */

interface PerformanceMetrics {
  pageLoadTime: number;
  largestContentfulPaint: number;
  firstInputDelay: number;
  cumulativeLayoutShift: number;
  timeToFirstByte: number;
  bundleSize: number;
  cacheHitRate: number;
  apiResponseTime: number;
}

interface PerformanceHistory {
  timestamp: number;
  metrics: PerformanceMetrics;
}

const performanceHistory: PerformanceHistory[] = [];
const maxHistorySize = 100; // Keep last 100 measurements

/**
 * Measure Core Web Vitals
 */
export const measureCoreWebVitals = (): Partial<PerformanceMetrics> => {
  if (typeof window === "undefined" || !window.performance) {
    return {};
  }

  const perfData = window.performance.timing;
  const perfNav = window.performance.navigation;

  return {
    pageLoadTime: perfData.loadEventEnd - perfData.navigationStart,
    timeToFirstByte: perfData.responseStart - perfData.navigationStart,
  };
};

/**
 * Get Web Vitals using modern Observer APIs
 */
export const observeWebVitals = (callback: (metrics: Partial<PerformanceMetrics>) => void) => {
  if (typeof window === "undefined") return;

  const metrics: Partial<PerformanceMetrics> = {};

  // Largest Contentful Paint (LCP)
  try {
    // @ts-ignore - Web API types not fully supported in TypeScript
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1] as any;
      metrics.largestContentfulPaint = lastEntry.renderTime || lastEntry.loadTime;
    });

    observer.observe({ entryTypes: ["largest-contentful-paint"] });
  } catch (e) {
    console.warn("LCP observer not supported");
  }

  // Cumulative Layout Shift (CLS)
  try {
    // @ts-ignore - Web API types not fully supported in TypeScript
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const layoutEntry = entry as any;
        if (!layoutEntry.hadRecentInput) {
          metrics.cumulativeLayoutShift = (metrics.cumulativeLayoutShift || 0) + layoutEntry.value;
        }
      }
    });

    observer.observe({ entryTypes: ["layout-shift"] });
  } catch (e) {
    console.warn("CLS observer not supported");
  }

  // First Input Delay (FID) - deprecated, but still useful for older browsers
  try {
    // @ts-ignore - Web API types not fully supported in TypeScript
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      if (entries.length > 0) {
        metrics.firstInputDelay = (entries[0] as any).processingDuration;
      }
    });

    observer.observe({ entryTypes: ["first-input"] });
  } catch (e) {
    console.warn("FID observer not supported");
  }

  // Call callback with all metrics
  setTimeout(() => callback(metrics), 3000); // Wait 3s for metrics to accumulate
};

/**
 * Record performance metrics
 */
export const recordMetrics = (metrics: Partial<PerformanceMetrics>) => {
  const history: PerformanceHistory = {
    timestamp: Date.now(),
    metrics: metrics as PerformanceMetrics,
  };

  performanceHistory.push(history);

  // Keep limited history size
  if (performanceHistory.length > maxHistorySize) {
    performanceHistory.shift();
  }
};

/**
 * Get average metrics over time
 */
export const getAverageMetrics = (): Partial<PerformanceMetrics> => {
  if (performanceHistory.length === 0) return {};

  const sum = performanceHistory.reduce<{
    pageLoadTime: number;
    largestContentfulPaint: number;
    firstInputDelay: number;
    cumulativeLayoutShift: number;
    timeToFirstByte: number;
  }>(
    (acc, history) => ({
      pageLoadTime: (acc.pageLoadTime || 0) + (history.metrics.pageLoadTime || 0),
      largestContentfulPaint: (acc.largestContentfulPaint || 0) + (history.metrics.largestContentfulPaint || 0),
      firstInputDelay: (acc.firstInputDelay || 0) + (history.metrics.firstInputDelay || 0),
      cumulativeLayoutShift: (acc.cumulativeLayoutShift || 0) + (history.metrics.cumulativeLayoutShift || 0),
      timeToFirstByte: (acc.timeToFirstByte || 0) + (history.metrics.timeToFirstByte || 0),
    }),
    {
      pageLoadTime: 0,
      largestContentfulPaint: 0,
      firstInputDelay: 0,
      cumulativeLayoutShift: 0,
      timeToFirstByte: 0,
    }
  );

  const count = performanceHistory.length;

  return {
    pageLoadTime: (sum.pageLoadTime || 0) / count,
    largestContentfulPaint: (sum.largestContentfulPaint || 0) / count,
    firstInputDelay: (sum.firstInputDelay || 0) / count,
    cumulativeLayoutShift: (sum.cumulativeLayoutShift || 0) / count,
    timeToFirstByte: (sum.timeToFirstByte || 0) / count,
  };
};

/**
 * Performance assessment - Good, Needs Improvement, Poor
 */
export const assessPerformance = (
  metrics: Partial<PerformanceMetrics>
): "excellent" | "good" | "needs-improvement" | "poor" => {
  const lcpMs = metrics.largestContentfulPaint || 0;
  const fidMs = metrics.firstInputDelay || 0;
  const clsScore = metrics.cumulativeLayoutShift || 0;

  // Google's Core Web Vitals thresholds
  // LCP: Good < 2.5s, Needs improvement < 4s
  // FID: Good < 100ms, Needs improvement < 300ms
  // CLS: Good < 0.1, Needs improvement < 0.25

  const scores = {
    lcp: lcpMs < 2500 ? 3 : lcpMs < 4000 ? 2 : 1,
    fid: fidMs < 100 ? 3 : fidMs < 300 ? 2 : 1,
    cls: clsScore < 0.1 ? 3 : clsScore < 0.25 ? 2 : 1,
  };

  const avgScore = (scores.lcp + scores.fid + scores.cls) / 3;

  if (avgScore >= 2.8) return "excellent";
  if (avgScore >= 2.3) return "good";
  if (avgScore >= 1.8) return "needs-improvement";
  return "poor";
};

/**
 * Log performance report to console
 */
export const logPerformanceReport = () => {
  const metrics = getAverageMetrics();
  const assessment = assessPerformance(metrics);

  console.group("🚀 Performance Report");
  console.log("Assessment:", assessment.toUpperCase());
  console.log("Average Metrics:", {
    "Page Load Time": `${(metrics.pageLoadTime || 0).toFixed(0)}ms`,
    "Largest Contentful Paint": `${(metrics.largestContentfulPaint || 0).toFixed(0)}ms`,
    "First Input Delay": `${(metrics.firstInputDelay || 0).toFixed(2)}ms`,
    "Cumulative Layout Shift": `${(metrics.cumulativeLayoutShift || 0).toFixed(3)}`,
    "Time to First Byte": `${(metrics.timeToFirstByte || 0).toFixed(0)}ms`,
  });
  console.table(performanceHistory.slice(-5));
  console.groupEnd();
};

/**
 * Send metrics to analytics service
 */
export const reportMetricsToAnalytics = async (
  metrics: Partial<PerformanceMetrics>,
  endpoint = "/api/analytics/performance"
) => {
  try {
    await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        timestamp: Date.now(),
        metrics,
        url: typeof window !== "undefined" ? window.location.href : "",
        userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "",
      }),
    });
  } catch (error) {
    console.warn("Failed to report metrics", error);
  }
};

/**
 * Auto-report metrics on page unload
 */
export const autoReportMetrics = () => {
  if (typeof window === "undefined") return;

  window.addEventListener("beforeunload", () => {
    const metrics = getAverageMetrics();
    reportMetricsToAnalytics(metrics);
  }, { once: true });
};

/**
 * Initialize performance monitoring
 */
export const initializePerformanceMonitoring = () => {
  if (typeof window === "undefined") return;

  // Measure initial metrics
  const vitalMetrics = measureCoreWebVitals();
  recordMetrics(vitalMetrics);

  // Observe web vitals as they become available
  observeWebVitals((metrics) => {
    recordMetrics(metrics);
  });

  // Auto-report on page unload
  autoReportMetrics();

  // Log report after page load
  window.addEventListener("load", () => {
    setTimeout(() => {
      logPerformanceReport();
    }, 1000);
  });
};
