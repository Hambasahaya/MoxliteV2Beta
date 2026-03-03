import { useEffect, useState, useCallback } from "react";
import { Language } from "@/components/common/LanguageToggle";
import {
  translateText,
  translateBatch,
  isTranslationCached,
} from "@/lib/translationService";

/**
 * Hook for translating content with cache awareness
 * Returns cached value immediately, translates in background
 */
export const useTranslation = (text: string, language: Language) => {
  const [translated, setTranslated] = useState<string>(text);
  const [isLoading, setIsLoading] = useState(false);
  const [isCached, setIsCached] = useState(
    isTranslationCached(text, language)
  );

  useEffect(() => {
    // Skip if source language
    if (language === "en") {
      setTranslated(text);
      setIsCached(true);
      return;
    }

    // Check cache
    const cached = isTranslationCached(text, language);
    setIsCached(cached);

    // Always attempt translation
    setIsLoading(true);
    translateText(text, language)
      .then((result) => {
        setTranslated(result);
        setIsCached(true);
      })
      .catch(() => {
        // Fallback to original text on error
        setTranslated(text);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [text, language]);

  return { translated, isLoading, isCached };
};

/**
 * Hook for translating multiple texts efficiently
 * Batch process translations for better performance
 */
export const useTranslationBatch = (
  texts: string[],
  language: Language
) => {
  const [translations, setTranslations] = useState<string[]>(texts);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (language === "en" || !texts || texts.length === 0) {
      setTranslations(texts);
      return;
    }

    setIsLoading(true);
    translateBatch(texts, language)
      .then(setTranslations)
      .catch(() => {
        // Fallback to original texts
        setTranslations(texts);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [texts, language]);

  return { translations, isLoading };
};

/**
 * Hook for SEO-critical content with preload
 * Prioritizes title and description for faster SEO crawling
 */
export const useSEOTranslation = (
  seoData: {
    title: string;
    description: string;
    keywords?: string;
  },
  language: Language
) => {
  const [seoTranslated, setSEOTranslated] = useState(seoData);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (language === "en") {
      setSEOTranslated(seoData);
      return;
    }

    setIsLoading(true);

    // Translate in priority order (title first, then description, then keywords)
    Promise.all([
      translateText(seoData.title, language),
      translateText(seoData.description, language),
      seoData.keywords
        ? translateText(seoData.keywords, language)
        : Promise.resolve(""),
    ]).then(([title, description, keywords]) => {
      setSEOTranslated({
        title,
        description,
        keywords: keywords || seoData.keywords,
      });
      setIsLoading(false);
    });
  }, [seoData, language]);

  return { seoTranslated, isLoading };
};

/**
 * Hook to check if translation content is cached
 * Useful for showing loading indicators or pre-cache triggers
 */
export const useTranslationCache = (text: string, language: Language) => {
  const [cached, setCached] = useState(
    isTranslationCached(text, language)
  );

  useEffect(() => {
    setCached(isTranslationCached(text, language));
  }, [text, language]);

  return cached;
};

/**
 * Hook for lazy loading translations (intersection observer pattern)
 * Only translates when element comes into view
 */
export const useLazyTranslation = (
  text: string,
  language: Language,
  options?: IntersectionObserverInit
) => {
  const [translated, setTranslated] = useState<string>(text);
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const ref = useCallback(
    (node: HTMLElement | null) => {
      if (!node) return;

      const observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
          observer.disconnect();
        }
      }, options);

      observer.observe(node);

      return () => observer.disconnect();
    },
    [options, isVisible]
  );

  useEffect(() => {
    if (!isVisible || language === "en") {
      setTranslated(text);
      return;
    }

    setIsLoading(true);
    translateText(text, language)
      .then(setTranslated)
      .catch(() => setTranslated(text))
      .finally(() => setIsLoading(false));
  }, [isVisible, text, language]);

  return { translated, isLoading, isVisible, ref };
};

interface TranslationStats {
  cacheSize: number;
  pendingRequests: number;
  translationTime: number;
}

/**
 * Hook to monitor translation performance
 * Useful for debugging and optimization
 */
export const useTranslationStats = () => {
  const [stats, setStats] = useState<TranslationStats>({
    cacheSize: 0,
    pendingRequests: 0,
    translationTime: 0,
  });

  const trackTranslation = useCallback((text: string, startTime: number) => {
    setStats((prev) => ({
      ...prev,
      translationTime: Date.now() - startTime,
    }));
  }, []);

  return { stats, trackTranslation };
};
