import { Language } from "@/components/common/LanguageToggle";

// Multi-layer caching system for optimal performance
const MEMORY_CACHE: Map<string, { value: string; timestamp: number }> = new Map();
const PENDING_REQUESTS: Map<string, Promise<string>> = new Map();

// Configuration
const CACHE_TTL = 30 * 24 * 60 * 60 * 1000; // 30 days
const BATCH_DELAY = 100; // 100ms for faster batching
const MAX_BATCH_SIZE = 10;
const TRANSLATION_TIMEOUT = 8000; // 8 second timeout
const API_RETRY_ATTEMPTS = 2;

let batchQueue: Array<{ 
  text: string; 
  language: Language; 
  resolve: (text: string) => void; 
  reject: (error: Error) => void;  
  retries?: number;
}> = [];
let batchTimeout: NodeJS.Timeout | null = null;

/**
 * Hash function for cache key generation
 * More reliable than string concatenation
 */
const generateCacheKey = (text: string, language: Language): string => {
  return `${language}:${text.substring(0, 100)}:${text.length}`;
};

/**
 * Get from memory cache with TTL validation
 */
const getFromMemoryCache = (key: string): string | null => {
  const cached = MEMORY_CACHE.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.value;
  }
  if (cached) {
    MEMORY_CACHE.delete(key);
  }
  return null;
};

/**
 * Get from localStorage with TTL validation
 */
const getFromLocalStorage = (key: string): string | null => {
  if (typeof window === "undefined") return null;
  try {
    const item = localStorage.getItem(`trans_${key}`);
    if (!item) return null;
    
    const parsed = JSON.parse(item);
    if (Date.now() - parsed.timestamp < CACHE_TTL) {
      return parsed.value;
    }
    localStorage.removeItem(`trans_${key}`);
  } catch {
    // Ignore localStorage errors
  }
  return null;
};

/**
 * Save to both memory and localStorage cache
 */
const saveToCache = (key: string, value: string): void => {
  const timestamp = Date.now();
  MEMORY_CACHE.set(key, { value, timestamp });
  
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(`trans_${key}`, JSON.stringify({ value, timestamp }));
    } catch {
      // Ignore localStorage errors (quota exceeded, etc.)
    }
  }
};

/**
 * Process batch translations with advanced features
 */
const processBatch = async () => {
  if (batchQueue.length === 0) return;

  const queue = batchQueue.slice(0, MAX_BATCH_SIZE);
  batchQueue = batchQueue.slice(MAX_BATCH_SIZE);
  batchTimeout = null;

  // Group by language
  const grouped = queue.reduce((acc, item) => {
    if (!acc[item.language]) acc[item.language] = [];
    acc[item.language].push(item);
    return acc;
  }, {} as Record<Language, typeof queue>);

  for (const [language, items] of Object.entries(grouped)) {
    // Process all items in parallel for the same language
    await Promise.allSettled(
      items.map(async (item) => {
        try {
          const result = await translateTextDirect(
            item.text, 
            item.language as Language,
            item.retries || 0
          );
          item.resolve(result);
        } catch (error) {
          item.reject(error instanceof Error ? error : new Error("Translation failed"));
        }
      })
    );
  }
};

/**
 * Smart translation with fallback strategies
 */
const translateTextDirect = async (
  text: string,
  targetLanguage: Language,
  retryCount: number = 0
): Promise<string> => {
  if (targetLanguage === "en" || !text || text.trim().length === 0) {
    return text;
  }

  const cacheKey = generateCacheKey(text, targetLanguage);
  
  // Try memory cache first (fastest)
  const memoryCached = getFromMemoryCache(cacheKey);
  if (memoryCached) return memoryCached;
  
  // Try localStorage (fast, persistent)
  const localCached = getFromLocalStorage(cacheKey);
  if (localCached) {
    saveToCache(cacheKey, localCached); // Restore to memory cache
    return localCached;
  }

  try {
    // Use Google Translate API format with better parameters
    const response = await fetch(
      `https://translate.googleapis.com/translate_a/element.js?cb=googleTranslateElementInit`,
      { signal: AbortSignal.timeout(TRANSLATION_TIMEOUT) }
    ).catch(() => {
      // Fallback to alternative service
      return fetch(
        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
          text.substring(0, 500)
        )}&langpair=en|${targetLanguage === "id" ? "id" : "en"}`,
        { signal: AbortSignal.timeout(TRANSLATION_TIMEOUT) }
      );
    });

    if (!response.ok) {
      throw new Error(`API response status: ${response.status}`);
    }

    const data = await response.json();
    
    let translatedText = text;
    
    if (data.responseData?.translatedText) {
      translatedText = data.responseData.translatedText;
    } else if (data.data?.[0]?.[0]) {
      translatedText = data.data[0][0];
    }

    // Clean up translated text
    translatedText = translatedText.trim();
    
    // Save to cache
    saveToCache(cacheKey, translatedText);
    return translatedText;
  } catch (error) {
    console.warn(`Translation error for "${text.substring(0, 50)}"`, error);
    
    // Retry logic for network errors
    if (retryCount < API_RETRY_ATTEMPTS && error instanceof TypeError) {
      return new Promise((resolve) => {
        setTimeout(() => {
          translateTextDirect(text, targetLanguage, retryCount + 1)
            .then(resolve)
            .catch(() => resolve(text));
        }, 1000 * (retryCount + 1)); // Exponential backoff
      });
    }
    
    return text;
  }
};

/**
 * Main translation function with intelligent batching
 */
export const translateText = async (
  text: string,
  targetLanguage: Language
): Promise<string> => {
  if (targetLanguage === "en" || !text || text.trim().length === 0) {
    return text;
  }

  const cacheKey = generateCacheKey(text, targetLanguage);

  // Check immediate cache first
  const memoryCached = getFromMemoryCache(cacheKey);
  if (memoryCached) return memoryCached;

  // Return pending request if exists
  if (PENDING_REQUESTS.has(cacheKey)) {
    return PENDING_REQUESTS.get(cacheKey)!;
  }

  const promise = new Promise<string>((resolve, reject) => {
    batchQueue.push({ text, language: targetLanguage, resolve, reject });

    // Clear existing timeout and set new one
    if (batchTimeout) clearTimeout(batchTimeout);
    batchTimeout = setTimeout(processBatch, BATCH_DELAY);
  });

  PENDING_REQUESTS.set(cacheKey, promise);
  promise.finally(() => {
    PENDING_REQUESTS.delete(cacheKey);
  });

  return promise;
};

/**
 * Translate multiple texts in parallel with optimized batching
 * Useful for translating entire content sections
 */
export const translateBatch = async (
  texts: string[],
  targetLanguage: Language
): Promise<string[]> => {
  return Promise.all(texts.map(text => translateText(text, targetLanguage)));
};

/**
 * Pre-load translations for SEO-critical content
 * Call this during page generation for better SEO
 */
export const preloadCriticalTranslations = async (
  seoContent: { title: string; description: string; keywords?: string },
  targetLanguage: Language
): Promise<typeof seoContent> => {
  const [title, description, keywords] = await Promise.all([
    translateText(seoContent.title, targetLanguage),
    translateText(seoContent.description, targetLanguage),
    seoContent.keywords ? translateText(seoContent.keywords, targetLanguage) : Promise.resolve("")
  ]);

  return { title, description, keywords: keywords || seoContent.keywords };
};

/**
 * Get cache statistics for monitoring
 */
export const getTranslationStats = () => {
  return {
    memoryCacheSize: MEMORY_CACHE.size,
    pendingRequests: PENDING_REQUESTS.size,
    totalCached: MEMORY_CACHE.size,
  };
};

/**
 * Clear memory cache (keep localStorage for persistence)
 */
export const clearMemoryCache = (): void => {
  MEMORY_CACHE.clear();
};

/**
 * Clear all caches including localStorage
 */
export const clearAllCaches = (): void => {
  MEMORY_CACHE.clear();
  if (typeof window !== "undefined") {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith("trans_")) {
          localStorage.removeItem(key);
        }
      });
    } catch {
      // Ignore errors
    }
  }
};

/**
 * Check if translation is cached
 */
export const isTranslationCached = (text: string, language: Language): boolean => {
  const key = generateCacheKey(text, language);
  return getFromMemoryCache(key) !== null || getFromLocalStorage(key) !== null;
};

/**
 * Backward compatibility - alias for translateText
 * Use translateText directly for new code
 */
export const preloadTranslation = async (
  text: string,
  targetLanguage: Language
): Promise<string> => {
  return translateText(text, targetLanguage);
};
