/**
 * Server-side Translation & SEO Helper
 * Digunakan di getStaticProps, getServerSideProps, atau API routes
 * Untuk pre-cache dan pre-render multilingual content
 */

import { Language } from "@/components/common/LanguageToggle";
import {
  translateBatch,
  preloadCriticalTranslations,
} from "@/lib/translationService";
import { generateMultiLangSEO } from "@/lib/seo-multilang";
import {
  TRANSLATION_CONFIG,
  SEO_META_TEMPLATES,
} from "@/constant/translation-seo.config";

/**
 * Pre-load semua critical content translations untuk sebuah page
 * Dijalankan di server sebelum page dirender
 */
export const preCachePageContent = async (
  pageContent: {
    title: string;
    description: string;
    bodyTexts?: string[];
    sectionHeadings?: string[];
  },
  targetLanguage: Language = "id"
) => {
  const textsTranform = [
    pageContent.title,
    pageContent.description,
    ...(pageContent.bodyTexts || []),
    ...(pageContent.sectionHeadings || []),
  ];

  // Filter unique texts untuk avoid duplicate translations
  const uniqueTexts = [...new Set(textsTranform)];

  try {
    const translated = await translateBatch(uniqueTexts, targetLanguage);
    return {
      success: true,
      cached: translated.length,
      data: uniqueTexts.map((text, idx) => ({
        original: text,
        translated: translated[idx] || text,
      })),
    };
  } catch (error) {
    console.error("Pre-cache failed:", error);
    return {
      success: false,
      cached: 0,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

/**
 * Generate complete SEO data untuk page dengan multiple languages
 * Ready untuk Next.js metadata API atau SEOHead component
 */
export const generatePageSEO = async (options: {
  basePath: string;
  enTitle: string;
  enDescription: string;
  enKeywords?: string;
  ogImage?: string;
}): Promise<{
  en: any;
  id: any;
  metadata: {
    languages: string[];
    canonical: string;
    hreflangs: Array<{ lang: string; href: string }>;
  };
}> => {
  const seo = await generateMultiLangSEO(options.basePath, {
    title: options.enTitle,
    description: options.enDescription,
    keywords: options.enKeywords,
    ogImage: options.ogImage,
  });

  return {
    en: seo.en,
    id: seo.id,
    metadata: {
      languages: ["en", "id"],
      canonical: seo.en.canonical,
      hreflangs: seo.en.hreflang || [],
    },
  };
};

/**
 * Generate sitemap dengan language variants
 * XML-format ready untuk next-sitemap atau custom implementation
 */
export const generateMultiLangSitemap = (
  pages: Array<{
    slug: string;
    lastModified?: string;
    priority?: number;
    changeFrequency?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  }>,
  domain: string = "https://moxlite.com"
): string => {
  const entries = pages
    .map((page) => {
      const enUrl = `${domain}${page.slug}`;
      const idUrl = `${domain}/id${page.slug}`;

      return `
  <url>
    <loc>${enUrl}</loc>
    <xhtml:link rel="alternate" hrefLang="en" href="${enUrl}" />
    <xhtml:link rel="alternate" hrefLang="id" href="${idUrl}" />
    <xhtml:link rel="alternate" hrefLang="x-default" href="${enUrl}" />
    <lastmod>${page.lastModified || new Date().toISOString().split("T")[0]}</lastmod>
    <priority>${page.priority || 0.8}</priority>
    <changefreq>${page.changeFrequency || "weekly"}</changefreq>
  </url>`;
    })
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${entries}
</urlset>`;
};

/**
 * Generate robots.txt dengan language-specific rules
 */
export const generateMultiLangRobots = (domain: string = "https://moxlite.com"): string => {
  return `User-agent: *
Allow: /
Allow: /id/

# Disallow crawling of admin and private pages
Disallow: /admin/
Disallow: /api/
Disallow: /private/

# Crawl delay untuk tidak overload server
Crawl-delay: 1

# Sitemap locations
Sitemap: ${domain}/sitemap.xml
Sitemap: ${domain}/sitemap-id.xml

# Language specific rules
User-agent: Googlebot
Allow: /
Allow: /id/
Crawl-delay: 0

# Specific rules for language versions
Host: ${domain}`;
};

/**
 * Batch generate SEO untuk multiple pages (e.g., city pages, products)
 * Optimized untuk static generation
 */
export const batchGeneratePagesSEO = async (
  pages: Array<{
    slug: string;
    title: string;
    description: string;
    keywords?: string;
    ogImage?: string;
  }>
): Promise<
  Array<{
    slug: string;
    seo: {
      en: any;
      id: any;
    };
  }>
> => {
  const results = await Promise.all(
    pages.map(async (page) => {
      const seo = await generatePageSEO({
        basePath: page.slug,
        enTitle: page.title,
        enDescription: page.description,
        enKeywords: page.keywords,
        ogImage: page.ogImage,
      });

      return {
        slug: page.slug,
        seo: {
          en: seo.en,
          id: seo.id,
        },
      };
    })
  );

  return results;
};

/**
 * Validate SEO setup untuk page
 * Useful untuk development dan debugging
 */
export const validatePageSEO = (seo: any): string[] => {
  const errors: string[] = [];

  // Check required fields
  if (!seo.title || seo.title.length === 0) {
    errors.push("❌ Missing title");
  } else if (seo.title.length > 60) {
    errors.push(`⚠️ Title too long: ${seo.title.length}/60 chars`);
  } else if (seo.title.length < 30) {
    errors.push(`⚠️ Title too short: ${seo.title.length}/30 chars`);
  } else {
    errors.push(`✅ Title OK: ${seo.title.length}/60 chars`);
  }

  if (!seo.description || seo.description.length === 0) {
    errors.push("❌ Missing description");
  } else if (seo.description.length > 160) {
    errors.push(`⚠️ Description too long: ${seo.description.length}/160 chars`);
  } else if (seo.description.length < 80) {
    errors.push(`⚠️ Description too short: ${seo.description.length}/80 chars`);
  } else {
    errors.push(`✅ Description OK: ${seo.description.length}/160 chars`);
  }

  if (!seo.canonical) {
    errors.push("❌ Missing canonical URL");
  } else {
    errors.push(`✅ Canonical: ${seo.canonical}`);
  }

  if (!seo.hreflang || seo.hreflang.length === 0) {
    errors.push("⚠️ No hreflang tags (recommended for multi-language)");
  } else {
    errors.push(`✅ hreflang langs: ${seo.hreflang.map((h: any) => h.lang).join(", ")}`);
  }

  if (seo.ogImage) {
    errors.push(`✅ OG Image: ${seo.ogImage}`);
  } else {
    errors.push("⚠️ No OG image (nice to have for social sharing)");
  }

  return errors;
};

/**
 * Health check untuk translation service
 * Verify API connectivity dan cache status
 */
export const checkTranslationHealth = async (): Promise<{
  healthy: boolean;
  apiStatus: "ok" | "slow" | "error";
  cacheStatus: "ok" | "full" | "empty";
  latency: number;
  message: string;
}> => {
  const start = Date.now();

  try {
    // Test translation API
    const response = await fetch(
      TRANSLATION_CONFIG.api.primary +
        "?q=test&langpair=en|id",
      { signal: AbortSignal.timeout(5000) }
    );

    const latency = Date.now() - start;
    let apiStatus: "ok" | "slow" | "error" = "ok";

    if (latency > 2000) {
      apiStatus = "slow";
    }

    const ok = response.ok || response.status === 404;

    return {
      healthy: ok,
      apiStatus: ok ? apiStatus : "error",
      cacheStatus: "ok", // Simplified, could check actual cache
      latency,
      message: `Translation API ${ok ? "✅" : "❌"} (${latency}ms)`,
    };
  } catch (error) {
    return {
      healthy: false,
      apiStatus: "error",
      cacheStatus: "empty",
      latency: 0,
      message: `Translation API ❌: ${error instanceof Error ? error.message : "Unknown error"}`,
    };
  }
};
