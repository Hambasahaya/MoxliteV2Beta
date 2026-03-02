import { Language } from "@/components/common/LanguageToggle";

const TRANSLATION_CACHE: { [key: string]: string } = {};
const PENDING_REQUESTS: { [key: string]: Promise<string> } = {};

// Batch translate requests to reduce API calls
const BATCH_DELAY = 300; // Reduced from 500ms for better performance
let batchQueue: Array<{ text: string; language: Language; resolve: (text: string) => void; reject: (error: Error) => void }> = [];
let batchTimeout: NodeJS.Timeout | null = null;

const processBatch = async () => {
  if (batchQueue.length === 0) return;

  const queue = batchQueue;
  batchQueue = [];
  batchTimeout = null;

  // Group by language
  const grouped = queue.reduce((acc, item) => {
    if (!acc[item.language]) acc[item.language] = [];
    acc[item.language].push(item);
    return acc;
  }, {} as Record<Language, typeof queue>);

  for (const [language, items] of Object.entries(grouped)) {
    // Process in smaller batches (max 5 at a time)
    for (let i = 0; i < items.length; i += 5) {
      const batch = items.slice(i, i + 5);
      await Promise.all(
        batch.map(async (item) => {
          try {
            const result = await translateTextDirect(item.text, item.language as Language);
            item.resolve(result);
          } catch (error) {
            item.reject(error instanceof Error ? error : new Error("Translation failed"));
          }
        })
      );
    }
  }
};

const translateTextDirect = async (
  text: string,
  targetLanguage: Language
): Promise<string> => {
  if (targetLanguage === "en" || !text || text.length === 0) {
    return text;
  }

  const cacheKey = `${text}_${targetLanguage}`;
  if (TRANSLATION_CACHE[cacheKey]) {
    return TRANSLATION_CACHE[cacheKey];
  }

  try {
    const response = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
        text.substring(0, 500) // Limit text length
      )}&langpair=en|${targetLanguage === "id" ? "id" : "en"}`,
      { signal: AbortSignal.timeout(5000) } // 5 second timeout
    );

    if (!response.ok) return text;
    const data = await response.json();

    if (data.responseStatus === 200 && data.responseData?.translatedText) {
      const translatedText = data.responseData.translatedText;
      TRANSLATION_CACHE[cacheKey] = translatedText;
      return translatedText;
    }

    return text;
  } catch (error) {
    console.error("Translation error:", error);
    return text;
  }
};

export const translateText = async (
  text: string,
  targetLanguage: Language
): Promise<string> => {
  if (targetLanguage === "en" || !text || text.length === 0) {
    return text;
  }

  const cacheKey = `${text}_${targetLanguage}`;

  // Check cache first
  if (TRANSLATION_CACHE[cacheKey]) {
    return TRANSLATION_CACHE[cacheKey];
  }

  // Check if request is already pending
  if (PENDING_REQUESTS[cacheKey]) {
    return PENDING_REQUESTS[cacheKey];
  }

  // Create batched request
  const promise = new Promise<string>((resolve, reject) => {
    batchQueue.push({ text, language: targetLanguage, resolve, reject });

    // Clear existing timeout and set new one
    if (batchTimeout) clearTimeout(batchTimeout);
    batchTimeout = setTimeout(processBatch, BATCH_DELAY);
  });

  PENDING_REQUESTS[cacheKey] = promise;
  promise.finally(() => {
    delete PENDING_REQUESTS[cacheKey];
  });

  return promise;
};

// Pre-translate critical content for SEO (titles, descriptions)
export const preloadTranslation = async (
  text: string,
  targetLanguage: Language
): Promise<string> => {
  return translateText(text, targetLanguage);
};

// Cache management for debugging
export const getTranslationCacheSize = (): number => {
  return Object.keys(TRANSLATION_CACHE).length;
};

export const clearTranslationCache = (): void => {
  Object.keys(TRANSLATION_CACHE).forEach(key => {
    delete TRANSLATION_CACHE[key];
  });
};
