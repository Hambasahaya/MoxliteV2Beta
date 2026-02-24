import Head from "next/head";
import { iHeader } from "./types";

const Header = ({ title, desc, thumbnail, url }: iHeader) => {
  // Ensure canonical URL is without www
  const canonicalUrl = url?.replace(/^https?:\/\/www\./, "https://") || url;

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="title" content={title} />
        <meta name="description" content={desc} />
        
        {/* Canonical URL for SEO - prevents duplicate content issues */}
        <link rel="canonical" href={canonicalUrl} />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={desc} />
        <meta property="og:image" content={thumbnail} />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={canonicalUrl} />
        <meta property="twitter:title" content={title} />
        <meta property="twitter:description" content={desc} />
        <meta property="twitter:image" content={thumbnail} />
      </Head>
    </>
  );
};

export default Header;
