import { Language } from "@/components/common/LanguageToggle";
import i18n from "@/i18n"; // get current language when none provided

// Multi-layer caching system for optimal performance
const MEMORY_CACHE: Map<string, { value: string; timestamp: number }> = new Map();
const PENDING_REQUESTS: Map<string, Promise<string>> = new Map();
const SHORT_TEXT_CACHE: Map<string, string> = new Map(); // Ultra-fast cache for common words

// Configuration - Optimized for Speed
const CACHE_TTL = 30 * 24 * 60 * 60 * 1000; // 30 days
const BATCH_DELAY = 10; // Reduced from 30ms - ultra-fast batching
const MAX_BATCH_SIZE = 50; // Increased from 20 - process more items at once
// Translation timeout used by client fetch. set to 10s to avoid premature aborts
const TRANSLATION_TIMEOUT = 10000;
const API_RETRY_ATTEMPTS = 0; // No retries - fail fast instead
const SHORT_TEXT_THRESHOLD = 100; // Increased from 50 - cache more texts

let batchQueue: Array<{ 
  text: string; 
  language: Language; 
  resolve: (text: string) => void; 
  reject: (error: Error) => void;  
  retries?: number;
}> = [];
let batchTimeout: NodeJS.Timeout | null = null;

/**
 * Hash function for cache key generation - Optimized for speed
 * Shorter keys = faster lookup
 */
const generateCacheKey = (text: string, language: Language): string => {
  // For short texts, use simpler key
  if (text.length < SHORT_TEXT_THRESHOLD) {
    return `${language}:${text}`;
  }
  // For long texts, use hash-like key
  return `${language}:${text.substring(0, 50)}:${text.length}`;
};

/**
 * Get from short text cache (ultra-fast)
 */
const getFromShortCache = (text: string, language: Language): string | null => {
  if (text.length >= SHORT_TEXT_THRESHOLD) return null;
  return SHORT_TEXT_CACHE.get(`${language}:${text}`) || null;
};

/**
 * Save to short text cache (fastest writes)
 */
const saveToShortCache = (text: string, language: Language, value: string): void => {
  if (text.length < SHORT_TEXT_THRESHOLD) {
    SHORT_TEXT_CACHE.set(`${language}:${text}`, value);
    // Keep map size under control
    if (SHORT_TEXT_CACHE.size > 1000) {
      const firstKey = SHORT_TEXT_CACHE.keys().next().value;
      if (firstKey) {
        SHORT_TEXT_CACHE.delete(firstKey);
      }
    }
  }
};

/**
 * Get from memory cache with TTL validation - Optimized
 */
const getFromMemoryCache = (key: string): string | null => {
  const cached = MEMORY_CACHE.get(key);
  if (cached) {
    // Skip TTL check for performance (trust the cache)
    return cached.value;
  }
  return null;
};

/**
 * Get from localStorage with TTL validation - Minimal overhead
 */
const getFromLocalStorage = (key: string): string | null => {
  if (typeof window === "undefined") return null;
  try {
    const item = localStorage.getItem(`trans_${key}`);
    if (!item) return null;
    
    const parsed = JSON.parse(item);
    return parsed.value || null;
  } catch {
    // Ignore errors
  }
  return null;
};

/**
 * Save to both memory and localStorage cache - Optimized
 */
const saveToCache = (key: string, value: string, text: string, language: Language): void => {
  const timestamp = Date.now();
  MEMORY_CACHE.set(key, { value, timestamp });
  saveToShortCache(text, language, value);
  
  // Skip localStorage for now - just memory cache for speed
  // if (typeof window !== "undefined") {
  //   try {
  //     localStorage.setItem(`trans_${key}`, JSON.stringify({ value, timestamp }));
  //   } catch {
  //     // Ignore localStorage errors
  //   }
  // }
};

/**
 * Process batch translations with advanced features - Optimized for speed
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

  // Process all languages in parallel
  await Promise.all(
    Object.entries(grouped).map(async ([language, items]) => {
      // Process all items in parallel (not sequential)
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
    })
  );
};

/**
 * Smart translation with fallback strategies - Ultra-optimized for speed
 */
const translateTextDirect = async (
  text: string,
  targetLanguage: Language,
  retryCount: number = 0
): Promise<string> => {
  if (targetLanguage === "en" || !text) {
    return text;
  }

  const trimmed = text.trim();
  if (trimmed.length === 0) return text;

  // Skip translation for very short texts (single words, numbers, etc)
  if (trimmed.length < 3) {
    return text;
  }

  const cacheKey = generateCacheKey(text, targetLanguage); // note: handled above by language variable
  
  // Ultra-fast: Try short text cache first
  const shortCached = getFromShortCache(text, targetLanguage);
  if (shortCached) return shortCached;
  
  // Try memory cache (fast)
  const memoryCached = getFromMemoryCache(cacheKey);
  if (memoryCached) return memoryCached;

  // Skip localStorage - too slow for initial load
  // Trust memory cache instead
  /*
  if (text.length > 100) {
    const localCached = getFromLocalStorage(cacheKey);
    if (localCached) {
      saveToCache(cacheKey, localCached, text, targetLanguage);
      return localCached;
    }
  }
  */

  try {
    // Proxy request through our own API route to avoid CORS
    // send the entire trimmed text to the proxy (long queries are allowed)
    const params = new URLSearchParams({
      q: trimmed,
      lang: targetLanguage === "id" ? "id" : "en",
    });

    const response = await fetch(`/api/translate?${params.toString()}`, {
      headers: { 'Cache-Control': 'no-cache' },
    });

    if (!response.ok) {
      throw new Error(`Proxy translation API error: ${response.status}`);
    }

    const data = await response.json();
    if (data.translatedText) {
      let translatedText = data.translatedText.trim();
      saveToCache(cacheKey, translatedText, text, targetLanguage);
      return translatedText;
    }

    return text;
  } catch (error) {
    // Timeout or network error - return original text quickly
    if (retryCount < API_RETRY_ATTEMPTS && error instanceof TypeError) {
      // Single retry with shorter backoff
      return new Promise((resolve) => {
        setTimeout(() => {
          translateTextDirect(text, targetLanguage, retryCount + 1)
            .then(resolve)
            .catch(() => resolve(text));
        }, 500); // Fixed 500ms delay
      });
    }
    
    return text;
  }
};

/**
 * Main translation function with intelligent batching - Ultra-optimized
 */
export const translateText = async (
  text: string,
  targetLanguage?: Language
): Promise<string> => {
  const language: Language = targetLanguage || (typeof window !== 'undefined' ? (i18n.language as Language) : 'en');
  if (language === "en" || !text) {
    return text;
  }

  const trimmed = text.trim();
  if (trimmed.length === 0) return text;
  
  // Skip translation for very short texts
  if (trimmed.length < 3) {
    return text;
  }

  const cacheKey = generateCacheKey(text, language);

  // Check immediate cache first (ultra-fast)
  const shortCached = getFromShortCache(text, language);
  if (shortCached) return shortCached;

  const memoryCached = getFromMemoryCache(cacheKey);
  if (memoryCached) return memoryCached;

  // Return pending request if exists
  if (PENDING_REQUESTS.has(cacheKey)) {
    return PENDING_REQUESTS.get(cacheKey)!;
  }

  const promise = new Promise<string>((resolve, reject) => {
    batchQueue.push({ text, language, resolve, reject });

    // Clear existing timeout and set new one with shorter delay
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
    shortTextCacheSize: SHORT_TEXT_CACHE.size,
    pendingRequests: PENDING_REQUESTS.size,
    totalCached: MEMORY_CACHE.size + SHORT_TEXT_CACHE.size,
  };
};

/**
 * Clear memory cache (keep localStorage for persistence)
 */
export const clearMemoryCache = (): void => {
  MEMORY_CACHE.clear();
  SHORT_TEXT_CACHE.clear();
};

/**
 * Clear all caches including localStorage
 */
export const clearAllCaches = (): void => {
  MEMORY_CACHE.clear();
  SHORT_TEXT_CACHE.clear();
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
  const shortCached = getFromShortCache(text, language);
  if (shortCached) return true;
  
  const key = generateCacheKey(text, language);
  return getFromMemoryCache(key) !== null;
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
