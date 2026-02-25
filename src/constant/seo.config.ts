export const DOMAIN = "https://moxlite.com";

/**
 * Metadata untuk halaman - gunakan di <head> dengan next/head atau metadata API
 */
export const getDefaultSEOMeta = () => ({
  title: "Lampu Panggung Profesional | Moxlite",
  description:
    "Jual dan sewa lampu panggung, lighting konser, lampu beam dan par LED terbaik di Indonesia.",
  keywords:
    "lampu panggung, lighting konser, lampu LED, sewa lighting, par led, beam light",
  ogTitle: "Lampu Panggung Profesional | Moxlite",
  ogDescription:
    "Jual dan sewa lampu panggung, lighting konser, lampu beam dan par LED terbaik di Indonesia.",
  ogImage: `${DOMAIN}/image/og-image.jpg`,
  ogUrl: DOMAIN,
  twitterHandle: "@moxlite",
  canonical: DOMAIN,
});

export const SEO_KEYWORDS = {
  primary: "Lampu Panggung LED",
  secondary: ["Lighting Konser", "Lighting Event", "Sewa Lighting", "Par LED", "Beam Light"],
  brands: ["Moxlite"],
};

export const SEO_CITIES = [
  "Jakarta",
  "Surabaya",
  "Bandung",
  "Medan",
  "Semarang",
  "Makassar",
  "Yogyakarta",
  "Batam",
];

// Schema untuk LocalBusiness
export const getLocalBusinessSchema = (city: string) => ({
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Moxlite",
  image: `${DOMAIN}/image/moxlite-logo.png`,
  description: "Jual dan sewa lampu panggung profesional",
  url: DOMAIN,
  telephone: "+62",
  address: {
    "@type": "PostalAddress",
    addressLocality: city,
    addressCountry: "ID",
  },
  areaServed: {
    "@type": "City",
    name: city,
  },
  priceRange: "$$",
});

// Schema untuk Product
export const getProductSchema = (
  productName: string,
  description: string,
  image: string,
  price?: number,
  rating?: number
) => ({
  "@context": "https://schema.org/",
  "@type": "Product",
  name: productName,
  image: image,
  description: description,
  brand: {
    "@type": "Brand",
    name: "Moxlite",
  },
  ...(price && {
    offers: {
      "@type": "Offer",
      url: DOMAIN,
      priceCurrency: "IDR",
      price: price.toString(),
      availability: "https://schema.org/InStock",
    },
  }),
  ...(rating && {
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: rating.toString(),
      reviewCount: "100",
    },
  }),
});

// Schema untuk FAQ
export const getFAQSchema = (
  faqs: Array<{ question: string; answer: string }>
) => ({
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
});

// Schema untuk Breadcrumb
export const getBreadcrumbSchema = (
  items: Array<{ name: string; url: string }>
) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, index) => ({
    "@type": "ListItem",
    position: (index + 1).toString(),
    name: item.name,
    item: item.url,
  })),
});

// Schema untuk Organization
export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Moxlite",
  url: DOMAIN,
  logo: `${DOMAIN}/image/moxlite-logo.png`,
  description: "Penyedia lampu panggung dan lighting profesional di Indonesia",
  sameAs: [
    "https://www.instagram.com/moxlite",
    "https://www.facebook.com/moxlite",
    "https://www.tiktok.com/@moxlite",
  ],
  address: {
    "@type": "PostalAddress",
    addressCountry: "ID",
  },
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "Sales",
    telephone: "+62",
  },
};
