import Head from "next/head";

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
}

/**
 * SEO Head Component
 * Gantikan NextSeo untuk set meta tags di head
 * 
 * Usage:
 * <SEOHead
 *   title="Page Title"
 *   description="Page description"
 *   canonical="https://moxlite.com/page"
 *   ogImage="https://moxlite.com/image.jpg"
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
}: SEOHeadProps) => {
  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="canonical" content={canonical} />
      {keywords && <meta name="keywords" content={keywords} />}

      {/* Open Graph Tags */}
      <meta property="og:title" content={ogTitle} />
      <meta property="og:description" content={ogDescription} />
      <meta property="og:url" content={ogUrl} />
      <meta property="og:type" content="website" />
      <meta property="og:locale" content="id_ID" />
      {ogImage && (
        <>
          <meta property="og:image" content={ogImage} />
          <meta property="og:image:width" content="1200" />
          <meta property="og:image:height" content="630" />
        </>
      )}

      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      {twitterHandle && <meta name="twitter:site" content={twitterHandle} />}
      <meta name="twitter:title" content={ogTitle} />
      <meta name="twitter:description" content={ogDescription} />
      {ogImage && <meta name="twitter:image" content={ogImage} />}

      {/* Article Tags */}
      {publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {author && <meta property="article:author" content={author} />}

      {/* Other Meta Tags */}
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta httpEquiv="x-ua-compatible" content="IE=edge" />
      <meta name="theme-color" content="#000000" />

      {/* Canonical Link */}
      <link rel="canonical" href={canonical} />
    </Head>
  );
};
