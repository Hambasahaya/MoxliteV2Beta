import Head from "next/head";
import {
  ProductJsonLd,
  ArticleJsonLd,
  FAQJsonLd,
  BreadcrumbJsonLd,
  LocalBusinessJsonLd,
  OrganizationJsonLd,
} from "next-seo";

interface StructuredDataProps {
  data: any;
}

/**
 * Generic component untuk render JSON-LD structured data
 */
export const StructuredData = ({ data }: StructuredDataProps) => {
  return (
    <Head>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(data),
        }}
      />
    </Head>
  );
};

// Export JSON-LD components dari next-seo untuk digunakan di pages
export { ProductJsonLd, ArticleJsonLd, FAQJsonLd, BreadcrumbJsonLd, LocalBusinessJsonLd, OrganizationJsonLd };
