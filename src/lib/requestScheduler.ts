/**
 * Request Scheduler - Load Balancing for API Calls
 * Prevents overwhelming the server with requests on initial page load
 */

interface ScheduledRequest<T> {
  execute: () => Promise<T>;
  priority: number;
  retries: number;
  id: string;
  resolve: (value: T | PromiseLike<T>) => void;
  reject: (reason?: any) => void;
}

interface RequestQueue {
  highPriority: ScheduledRequest<any>[];
  normalPriority: ScheduledRequest<any>[];
  lowPriority: ScheduledRequest<any>[];
}

// Configuration - Aggressive optimization for speed
const MAX_CONCURRENT_REQUESTS = 6; // Increased from 3 - modern browsers can handle more
const REQUEST_TIMEOUT = 8000; // Reduced from 15000 - fail fast
const PRIORITY_DELAY = {
  high: 0,
  normal: 20, // Reduced from 100
  low: 50, // Reduced from 300
};

let activeRequests = 0;
const queue: RequestQueue = {
  highPriority: [],
  normalPriority: [],
  lowPriority: [],
};


const requestCache = new Map<string, Promise<any>>();
const generateCacheKey = (execute: Function): string => {
  return execute.toString().substring(0, 100) + Date.now();
};

/**
 * Throttle concurrent requests to prevent server overload
 */
export const scheduleRequest = async <T>(
  execute: () => Promise<T>,
  priority: "high" | "normal" | "low" = "normal",
  retries: number = 1 // Reduced from 2
): Promise<T> => {
  const id = `${Date.now()}-${Math.random()}`;
  
  return new Promise<T>((resolveOuter, rejectOuter) => {
    const request: ScheduledRequest<T> = {
      execute,
      priority: priority === "high" ? 3 : priority === "normal" ? 2 : 1,
      retries,
      id,
      resolve: (value: T | PromiseLike<T>) => {
        removeFromQueue(id);
        resolveOuter(value as T);
      },
      reject: (reason?: any) => {
        removeFromQueue(id);
        rejectOuter(reason);
      },
    };

    // Add to appropriate queue
    if (priority === "high") {
      queue.highPriority.push(request);
    } else if (priority === "normal") {
      queue.normalPriority.push(request);
    } else {
      queue.lowPriority.push(request);
    }

    // Try to process
    processQueue();
  });
};

/**
 * Process queue - execute requests in parallel up to limit
 */
const processQueue = async () => {
  // Better queue processing - fire multiple high-priority requests simultaneously
  const availableSlots = MAX_CONCURRENT_REQUESTS - activeRequests;
  
  for (let i = 0; i < availableSlots; i++) {
    const request =
      queue.highPriority.shift() ||
      queue.normalPriority.shift() ||
      queue.lowPriority.shift();

    if (!request) break; // Queue empty

    activeRequests++;
    // Fire request without waiting (true parallel execution)
    executeRequest(request).catch(() => {
      // Error already handled in executeRequest
    });
  }
};

/**
 * Execute single request with timeout and retry logic
 */
const executeRequest = async (request: ScheduledRequest<any>) => {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= request.retries; attempt++) {
    try {
      // Timeout wrapper
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(
          () => reject(new Error("Request timeout")),
          REQUEST_TIMEOUT
        )
      );

      const result = await Promise.race([
        request.execute(),
        timeoutPromise,
      ]);

      // Success
      activeRequests--;
      processQueue(); // Process next in queue
      request.resolve(result);
      return;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      // Fast backoff before retry
      if (attempt < request.retries) {
        await new Promise((resolve) =>
          setTimeout(resolve, 300 * Math.pow(1.5, attempt)) // Much faster backoff
        );
      }
    }
  }

  // All retries failed
  activeRequests--;
  processQueue();
  request.reject(lastError || new Error("Unknown error"));
};

/**
 * Remove request from queue
 */
const removeFromQueue = (id: string) => {
  queue.highPriority = queue.highPriority.filter((r) => r.id !== id);
  queue.normalPriority = queue.normalPriority.filter((r) => r.id !== id);
  queue.lowPriority = queue.lowPriority.filter((r) => r.id !== id);
};

/**
 * Get queue statistics for monitoring
 */
export const getSchedulerStats = () => {
  return {
    activeRequests,
    totalQueued:
      queue.highPriority.length +
      queue.normalPriority.length +
      queue.lowPriority.length,
    highPriority: queue.highPriority.length,
    normalPriority: queue.normalPriority.length,
    lowPriority: queue.lowPriority.length,
    maxConcurrent: MAX_CONCURRENT_REQUESTS,
  };
};

/**
 * Clear all pending requests
 */
export const clearQueue = () => {
  queue.highPriority = [];
  queue.normalPriority = [];
  queue.lowPriority = [];
};

/**
 * Batch schedule multiple requests with automatic load balancing
 */
export const scheduleBatch = async <T>(
  requests: Array<{
    execute: () => Promise<T>;
    priority?: "high" | "normal" | "low";
  }>
): Promise<T[]> => {
  return Promise.all(
    requests.map((req) =>
      scheduleRequest(req.execute, req.priority || "normal")
    )
  );
};
