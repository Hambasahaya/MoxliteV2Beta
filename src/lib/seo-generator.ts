import { DOMAIN, SEO_CITIES, SEO_KEYWORDS, getLocalBusinessSchema } from "@/constant/seo.config";

/**
 * Generate SEO metadata for city-specific pages
 * Usage: generateCitySEO("Jakarta")
 */
export const generateCitySEO = (city: string) => {
  const sanitizedCity = city.toLowerCase();
  
  return {
    title: `${SEO_KEYWORDS.primary} ${city} | Moxlite - ${SEO_KEYWORDS.secondary[0]}`,
    description: `Jual dan sewa ${SEO_KEYWORDS.primary.toLowerCase()} di ${city}. Layanan ${SEO_KEYWORDS.secondary[0].toLowerCase()} profesional untuk event, konser, pertunjukan di ${city} dan sekitarnya.`,
    keywords: `${SEO_KEYWORDS.primary} ${city}, ${SEO_KEYWORDS.secondary[0]} ${city}`,
    ogTitle: `${SEO_KEYWORDS.primary} ${city} | Moxlite`,
    ogDescription: `Penyewa dan penjual ${SEO_KEYWORDS.primary.toLowerCase()} profesional di ${city}`,
    ogImage: `${DOMAIN}/image/og-city-${sanitizedCity}.jpg`,
    ogUrl: `${DOMAIN}/lighting/${sanitizedCity}`,
    canonical: `${DOMAIN}/lighting/${sanitizedCity}`,
  };
};

/**
 * Generate SEO metadata for product pages
 */
export const generateProductSEO = (
  productName: string,
  productCategory: string,
  description: string,
  slug: string
) => {
  return {
    title: `${productName} | Moxlite - ${productCategory}`,
    description: description,
    keywords: `${productName}, ${productCategory}, moxlite`,
    ogTitle: productName,
    ogDescription: description,
    ogImage: `${DOMAIN}/image/product-${slug}.jpg`,
    ogUrl: `${DOMAIN}/product/${slug}`,
    canonical: `${DOMAIN}/product/${slug}`,
  };
};

/**
 * Generate SEO metadata for news/article pages
 */
export const generateArticleSEO = (
  title: string,
  description: string,
  slug: string,
  publishedDate: string,
  author?: string
) => {
  return {
    title: `${title} | Moxlite News`,
    description: description,
    ogTitle: title,
    ogDescription: description,
    ogImage: `${DOMAIN}/image/news-${slug}.jpg`,
    ogUrl: `${DOMAIN}/news/${slug}`,
    canonical: `${DOMAIN}/news/${slug}`,
    publishedTime: publishedDate,
    author: author || "Moxlite",
  };
};

/**
 * Generate structured data for city pages
 */
export const generateCityStructuredData = (city: string) => {
  return getLocalBusinessSchema(city);
};

/**
 * Get all cities for sitemap
 */
export const getAllCitiesForSitemap = () => {
  return SEO_CITIES.map((city) => ({
    url: `${DOMAIN}/lighting/${city.toLowerCase()}`,
    changefreq: "weekly",
    priority: 0.8,
  }));
};

/**
 * Generate breadcrumb data
 */
export const generateBreadcrumb = (
  path: string
) => {
  const segments = path.split("/").filter(Boolean);
  const items = [
    {
      name: "Home",
      url: DOMAIN,
    },
  ];

  let currentPath = "";
  segments.forEach((segment) => {
    currentPath += `/${segment}`;
    items.push({
      name: segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " "),
      url: `${DOMAIN}${currentPath}`,
    });
  });

  return items;
};
