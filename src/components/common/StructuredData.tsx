import Head from "next/head";

interface StructuredDataProps {
  data: any;
}

/**
 * Component untuk render JSON-LD structured data
 * Gunakan untuk menambahkan schema di halaman tertentu
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

// ============= Component Khusus =============

interface ProductJsonLdProps {
  productName: string;
  description: string;
  images: string[];
  brand: string;
  price?: number;
  priceCurrency?: string;
  availability?: "InStock" | "OutOfStock" | "PreOrder";
  rating?: number;
  reviewCount?: number;
  url?: string;
}

export const ProductJsonLd = ({
  productName,
  description,
  images,
  brand,
  price,
  priceCurrency = "IDR",
  availability = "InStock",
  rating,
  reviewCount,
  url,
}: ProductJsonLdProps) => {
  const schema = {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: productName,
    image: images,
    description: description,
    brand: {
      "@type": "Brand",
      name: brand,
    },
    ...(price && {
      offers: {
        "@type": "Offer",
        url: url,
        priceCurrency: priceCurrency,
        price: price.toString(),
        availability: `https://schema.org/${availability}`,
      },
    }),
    ...(rating && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: rating.toString(),
        reviewCount: reviewCount?.toString() || "0",
      },
    }),
  };

  return (
    <Head>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema),
        }}
      />
    </Head>
  );
};

interface FAQJsonLdProps {
  faqs: Array<{
    question: string;
    answer: string;
  }>;
}

export const FAQJsonLd = ({ faqs }: FAQJsonLdProps) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <Head>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema),
        }}
      />
    </Head>
  );
};

interface BreadcrumbJsonLdProps {
  items: Array<{
    name: string;
    url: string;
  }>;
}

export const BreadcrumbJsonLd = ({ items }: BreadcrumbJsonLdProps) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: (index + 1).toString(),
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <Head>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema),
        }}
      />
    </Head>
  );
};

interface LocalBusinessJsonLdProps {
  name: string;
  address: string;
  city: string;
  telephone: string;
  url: string;
  description?: string;
  image?: string;
}

export const LocalBusinessJsonLd = ({
  name,
  address,
  city,
  telephone,
  url,
  description,
  image,
}: LocalBusinessJsonLdProps) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: name,
    image: image,
    description: description,
    url: url,
    telephone: telephone,
    address: {
      "@type": "PostalAddress",
      streetAddress: address,
      addressLocality: city,
      addressCountry: "ID",
    },
    areaServed: {
      "@type": "City",
      name: city,
    },
    priceRange: "$$",
  };

  return (
    <Head>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema),
        }}
      />
    </Head>
  );
};

interface ArticleJsonLdProps {
  title: string;
  description: string;
  image: string;
  url: string;
  datePublished: string;
  dateModified?: string;
  author: string;
  publisherName?: string;
  publisherImage?: string;
}

export const ArticleJsonLd = ({
  title,
  description,
  image,
  url,
  datePublished,
  dateModified,
  author,
  publisherName = "Moxlite",
  publisherImage,
}: ArticleJsonLdProps) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: title,
    description: description,
    image: image,
    url: url,
    datePublished: datePublished,
    dateModified: dateModified || datePublished,
    author: {
      "@type": "Person",
      name: author,
    },
    publisher: {
      "@type": "Organization",
      name: publisherName,
      ...(publisherImage && {
        logo: {
          "@type": "ImageObject",
          url: publisherImage,
        },
      }),
    },
  };

  return (
    <Head>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema),
        }}
      />
    </Head>
  );
};
