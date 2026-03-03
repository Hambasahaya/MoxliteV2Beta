import Head from "next/head";
import { ReactNode } from "react";

interface HrefLangLink {
  lang: string;
  href: string;
}

interface SEOHeadProps {
  title: string;
  description: string;
  canonical: string;
  ogImage?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogUrl?: string;
  twitterHandle?: string;
  keywords?: string;
  publishedTime?: string;
  author?: string;
  hreflangs?: HrefLangLink[];
  locale?: string;
  charset?: string;
  children?: ReactNode;
}

/**
 * SEO Head Component - Optimized for Multi-Language Support
 * Supports hreflang tags for better SEO in multiple languages
 * 
 * Usage:
 * <SEOHead
 *   title="Page Title"
 *   description="Page description"
 *   canonical="https://moxlite.com/page"
 *   ogImage="https://moxlite.com/image.jpg"
 *   hreflangs={[
 *     { lang: 'en', href: 'https://moxlite.com/page' },
 *     { lang: 'id', href: 'https://moxlite.com/id/page' },
 *   ]}
 * />
 */
export const SEOHead = ({
  title,
  description,
  canonical,
  ogImage,
  ogTitle = title,
  ogDescription = description,
  ogUrl = canonical,
  twitterHandle = "@moxlite",
  keywords,
  publishedTime,
  author,
  hreflangs = [],
  locale = "id_ID",
  charset = "utf-8",
  children,
}: SEOHeadProps) => {
  return (
    <Head>
      {/* Basic Meta Tags */}
      <meta charSet={charset} />
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="canonical" content={canonical} />
      {keywords && <meta name="keywords" content={keywords} />}

      {/* Viewport and Compatibility */}
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      <meta httpEquiv="x-ua-compatible" content="IE=edge" />
      <meta name="theme-color" content="#000000" />

      {/* Open Graph Tags - Optimized for Social Sharing */}
      <meta property="og:title" content={ogTitle} />
      <meta property="og:description" content={ogDescription} />
      <meta property="og:url" content={ogUrl} />
      <meta property="og:type" content="website" />
      <meta property="og:locale" content={locale} />
      {ogImage && (
        <>
          <meta property="og:image" content={ogImage} />
          <meta property="og:image:width" content="1200" />
          <meta property="og:image:height" content="630" />
          <meta property="og:image:type" content="image/jpeg" />
        </>
      )}

      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      {twitterHandle && <meta name="twitter:site" content={twitterHandle} />}
      <meta name="twitter:title" content={ogTitle} />
      <meta name="twitter:description" content={ogDescription} />
      {ogImage && <meta name="twitter:image" content={ogImage} />}

      {/* Article Tags for News/Blog Content */}
      {publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {author && <meta property="article:author" content={author} />}

      {/* Canonical Link - Single preferred URL */}
      <link rel="canonical" href={canonical} />

      {/* hreflang Tags - Critical for SEO Multi-language Support */}
      {hreflangs && hreflangs.length > 0 && (
        <>
          {hreflangs.map((link) => (
            <link
              key={`hreflang-${link.lang}`}
              rel="alternate"
              hrefLang={link.lang}
              href={link.href}
            />
          ))}
        </>
      )}

      {/* SEO Best Practices */}
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <meta name="googlebot" content="index, follow" />
      <meta name="language" content="Indonesian" />
      <meta httpEquiv="refresh" content="30" />

      {/* Mobile App Meta Tags */}
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />

      {/* Preload Critical Resources */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="dns-prefetch" href="https://api.mymemory.translated.net" />

      {/* Custom children for additional meta tags */}
      {children}
    </Head>
  );
};
