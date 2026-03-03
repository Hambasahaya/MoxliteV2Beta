/**
 * Translation & SEO Configuration
 * Centralized settings untuk optimization
 */

export const TRANSLATION_CONFIG = {
  // Cache Configuration
  cache: {
    // TTL dalam milliseconds (30 hari)
    ttl: 30 * 24 * 60 * 60 * 1000,
    // Maximum entries di memory cache (auto-cleanup jika exceed)
    maxMemoryEntries: 5000,
    // Enable localStorage persistence
    enableLocalStorage: true,
  },

  // Batching Configuration
  batching: {
    // Delay sebelum processing batch (ms)
    delay: 100,
    // Max items per batch
    maxBatchSize: 10,
    // Timeout untuk API request (ms)
    timeout: 8000,
  },

  // API Configuration
  api: {
    // Primary API
    primary: "https://api.mymemory.translated.net/get",
    // Fallback API
    fallback: "https://translate.googleapis.com/translate_a/element.js",
    // Retry attempts untuk failed requests
    retryAttempts: 2,
    // Exponential backoff multiplier
    backoffMultiplier: 1000,
  },

  // Language Configuration
  languages: {
    default: "en",
    supported: ["en", "id"],
    rtl: [], // Right-to-left languages if any
  },

  // SEO Configuration
  seo: {
    // Enable automatic hreflang generation
    autoHreflang: true,
    // Enable structured data generation
    generateStructuredData: true,
    // Pre-translate critical content
    preCacheSeoContent: true,
    // Language-specific canonical URLs
    languageSpecificCanonical: true,
  },

  // Performance Configuration
  performance: {
    // Enable lazy loading for non-critical translations
    lazyLoad: true,
    // Intersection observer options
    intersectionOptions: {
      root: null,
      rootMargin: "200px",
      threshold: 0.1,
    },
    // Preload critical translations on init
    preloadOnInit: true,
  },

  // Text Processing
  textProcessing: {
    // Max text length to translate (characters)
    maxTextLength: 500,
    // Auto-trim whitespace
    autoTrim: true,
    // Remove extra spaces
    normalizeSpaces: true,
  },

  // Monitoring & Analytics
  monitoring: {
    // Enable translation metrics tracking
    trackMetrics: true,
    // Log translation errors
    logErrors: true,
    // Debug mode (verbose logging)
    debug: false,
  },
};

/**
 * SEO Keywords Configuration
 */
export const SEO_KEYWORDS_CONFIG = {
  primary: "Lampu Panggung LED",
  secondary: [
    "Lighting Konser",
    "Lighting Event",
    "Sewa Lighting",
    "Par LED",
    "Beam Light",
  ],
  cities: [
    "Jakarta",
    "Surabaya",
    "Bandung",
    "Medan",
    "Semarang",
    "Makassar",
    "Yogyakarta",
    "Batam",
  ],
};

/**
 * SEO Meta Tags Template
 */
export const SEO_META_TEMPLATES = {
  // Template untuk halaman utama
  homepage: {
    title: "Lampu Panggung Profesional | Moxlite - Sewa & Jual Lighting Konser",
    description:
      "Jual dan sewa lampu panggung, lighting konser, lampu beam dan par LED terbaik di Indonesia. Layanan profesional untuk event, konser, dan pertunjukan.",
    keywords:
      "lampu panggung, lighting konser, lampu LED, sewa lighting, par led, beam light, moxlite",
  },

  // Template untuk halaman produk
  product: {
    titleFormat: "{productName} | Moxlite - {category}",
    descriptionFormat:
      "{productName} dari Moxlite: {description}. Tersedia untuk dijual dan disewa dengan kualitas profesional.",
  },

  // Template untuk halaman kota
  city: {
    titleFormat: "{primaryKeyword} {city} | Moxlite - {secondaryKeyword}",
    descriptionFormat:
      "Jual dan sewa {primaryKeywordLower} di {city}. Layanan {secondaryKeywordLower} profesional untuk event, konser, pertunjukan di {city} dan sekitarnya.",
  },

  // Template untuk artikel
  article: {
    titleFormat: "{title} | Blog Moxlite",
    descriptionFormat:
      "{excerpt}... Baca selengkapnya di blog Moxlite untuk tips dan panduan lighting profesional.",
  },
};

/**
 * hreflang Configuration
 */
export const HREFLANG_CONFIG = {
  // Supported language codes untuk hreflang
  supportedLanguages: [
    { code: "en", name: "English" },
    { code: "id", name: "Indonesian" },
  ],

  // Default hreflang locale
  defaultLocale: "en-US",

  // Include x-default hreflang
  includeDefault: true,

  // Language-specific locales untuk Open Graph
  ogLocales: {
    en: "en_US",
    id: "id_ID",
  },
};

/**
 * Cache Invalidation Rules
 */
export const CACHE_INVALIDATION = {
  // Invalidate cache saat ada update
  rules: [
    {
      pattern: /content|article|product/,
      invalidateAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    },
    {
      pattern: /seo|meta|description/,
      invalidateAge: 14 * 24 * 60 * 60 * 1000, // 14 days
    },
  ],

  // Manual invalidation triggers
  triggers: ["product.updated", "content.published", "site.rebuilt"],
};

/**
 * Export all configurations sebagai single object
 */
export const CONFIG = {
  translation: TRANSLATION_CONFIG,
  seo: SEO_KEYWORDS_CONFIG,
  templates: SEO_META_TEMPLATES,
  hreflang: HREFLANG_CONFIG,
  cacheInvalidation: CACHE_INVALIDATION,
};
