import { Language } from "@/components/common/LanguageToggle";
import { DOMAIN } from "@/constant/seo.config";
import { 
  preloadCriticalTranslations, 
  isTranslationCached,
  translateText 
} from "./translationService";

/**
 * SEO metadata for multiple languages
 */
export interface MultiLangSEOMeta {
  en: SEOMetaData;
  id: SEOMetaData;
}

export interface SEOMetaData {
  title: string;
  description: string;
  keywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  canonical: string;
  hreflang?: Array<{ lang: string; href: string }>;
}

/**
 * Generate multi-language SEO metadata with hreflang support
 * Optimized for SEO with pre-translated content
 */
export const generateMultiLangSEO = async (
  basePath: string,
  enContent: {
    title: string;
    description: string;
    keywords?: string;
    ogImage?: string;
  }
): Promise<MultiLangSEOMeta> => {
  const canonical = `${DOMAIN}${basePath}`;
  const canonicalId = `${DOMAIN}/id${basePath}`;

  // Translate content for Indonesian
  const idContent = await preloadCriticalTranslations(
    {
      title: enContent.title,
      description: enContent.description,
      keywords: enContent.keywords,
    },
    "id"
  );

  // Generate hreflang links for both languages
  const hrelangLinks = [
    { lang: "en", href: canonical },
    { lang: "id", href: canonicalId },
    { lang: "x-default", href: canonical },
  ];

  return {
    en: {
      title: enContent.title,
      description: enContent.description,
      keywords: enContent.keywords,
      ogTitle: enContent.title,
      ogDescription: enContent.description,
      ogImage: enContent.ogImage,
      canonical,
      hreflang: hrelangLinks,
    },
    id: {
      title: idContent.title,
      description: idContent.description,
      keywords: idContent.keywords,
      ogTitle: idContent.title,
      ogDescription: idContent.description,
      ogImage: enContent.ogImage,
      canonical: canonicalId,
      hreflang: hrelangLinks,
    },
  };
};

/**
 * Generate language-specific metadata for city pages
 * Used for SEO optimization on location-based pages
 */
export const generateCityMultiLangSEO = async (
  city: string,
  enTitle: string,
  enDescription: string
): Promise<MultiLangSEOMeta> => {
  const basePath = `/lighting/${city.toLowerCase()}`;
  const sanitizedCity = city.toLowerCase();

  return generateMultiLangSEO(basePath, {
    title: enTitle,
    description: enDescription,
    keywords: `${city}, lighting, event, sewa`,
    ogImage: `${DOMAIN}/image/og-city-${sanitizedCity}.jpg`,
  });
};

/**
 * Generate language-specific metadata for product pages
 */
export const generateProductMultiLangSEO = async (
  productName: string,
  slug: string,
  enDescription: string,
  category: string
): Promise<MultiLangSEOMeta> => {
  const basePath = `/product/${slug}`;

  const idTitle = await translateText(`${productName} | Professional Lighting`, "id");
  const idDesc = await translateText(enDescription, "id");

  return generateMultiLangSEO(basePath, {
    title: `${productName} | Moxlite - ${category}`,
    description: enDescription,
    keywords: `${productName}, ${category}, moxlite`,
    ogImage: `${DOMAIN}/image/product-${slug}.jpg`,
  });
};

/**
 * Get hreflang HTML tags for a specific page
 * Insert in <head> for SEO crawlers
 */
export const generateHrefLangTags = (
  hreflangLinks: Array<{ lang: string; href: string }>
): string => {
  return hreflangLinks
    .map(
      ({ lang, href }) =>
        `<link rel="alternate" hrefLang="${lang}" href="${href}" />`
    )
    .join("\n");
};

/**
 * Get language-specific canonical URL
 */
export const getCanonicalForLanguage = (
  basePath: string,
  language: Language
): string => {
  const path = language === "id" ? `/id${basePath}` : basePath;
  return `${DOMAIN}${path}`;
};

/**
 * Check if critical SEO content is cached
 * Returns true if translations are ready (for performance)
 */
export const isSEOContentCached = (
  titleEn: string,
  descriptionEn: string,
  language: Language
): boolean => {
  return (
    isTranslationCached(titleEn, language) &&
    isTranslationCached(descriptionEn, language)
  );
};

/**
 * Pre-cache critical SEO content for faster page loads
 * Call this during build time or server-side rendering
 */
export const preCacheSEOContent = async (
  pages: Array<{
    title: string;
    description: string;
    keywords?: string;
  }>,
  languages: Language[] = ["en", "id"]
): Promise<void> => {
  const tasks: Promise<any>[] = [];

  pages.forEach((page) => {
    languages.forEach((lang) => {
      if (lang === "en") return; // Skip English, it's the source

      tasks.push(
        preloadCriticalTranslations(
          {
            title: page.title,
            description: page.description,
            keywords: page.keywords,
          },
          lang
        )
      );
    });
  });

  await Promise.allSettled(tasks);
};

/**
 * Generate structured data for multi-language LocalBusiness schema
 */
export const generateMultiLangLocalBusinessSchema = (
  city: string,
  businessName: string = "Moxlite"
) => {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@graph": [
      {
        "@id": `${DOMAIN}/en#organization`,
        "@type": "Organization",
        name: businessName,
        url: `${DOMAIN}/en`,
        logo: `${DOMAIN}/image/moxlite-logo.png`,
        inLanguage: "en-ID",
      },
      {
        "@id": `${DOMAIN}/id#organization`,
        "@type": "Organization",
        name: businessName,
        url: `${DOMAIN}/id`,
        logo: `${DOMAIN}/image/moxlite-logo.png`,
        inLanguage: "id-ID",
      },
    ],
  };
};
