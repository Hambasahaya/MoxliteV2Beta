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
    canonical: `${DOMAIN}/lighting/${sanitizedCity}`,
    openGraph: {
      type: "website",
      locale: "id_ID",
      url: `${DOMAIN}/lighting/${sanitizedCity}`,
      title: `${SEO_KEYWORDS.primary} ${city} | Moxlite`,
      description: `Penyewa dan penjual ${SEO_KEYWORDS.primary.toLowerCase()} profesional di ${city}`,
      images: [
        {
          url: `${DOMAIN}/image/og-city-${sanitizedCity}.jpg`,
          width: 1200,
          height: 630,
          alt: `${SEO_KEYWORDS.primary} ${city}`,
        },
      ],
    },
    robotsProps: {
      noindex: false,
      nofollow: false,
      maxSnippet: -1,
      maxImagePreview: "large",
      maxVideoPreview: -1,
    },
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
    canonical: `${DOMAIN}/product/${slug}`,
    openGraph: {
      type: "product",
      locale: "id_ID",
      url: `${DOMAIN}/product/${slug}`,
      title: productName,
      description: description,
      images: [
        {
          url: `${DOMAIN}/image/product-${slug}.jpg`,
          width: 1200,
          height: 630,
          alt: productName,
        },
      ],
    },
    robotsProps: {
      noindex: false,
      nofollow: false,
      maxSnippet: -1,
      maxImagePreview: "large",
      maxVideoPreview: -1,
    },
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
    canonical: `${DOMAIN}/news/${slug}`,
    openGraph: {
      type: "article",
      locale: "id_ID",
      url: `${DOMAIN}/news/${slug}`,
      title: title,
      description: description,
      publishedTime: publishedDate,
      authors: author ? [author] : ["Moxlite"],
      images: [
        {
          url: `${DOMAIN}/image/news-${slug}.jpg`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    robotsProps: {
      noindex: false,
      nofollow: false,
      maxSnippet: -1,
      maxImagePreview: "large",
      maxVideoPreview: -1,
    },
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
