# Quick Reference: Next-SEO Implementation

## 📦 Installed Package

- `next-seo` v7.2.0 - JSON-LD Structured Data

## 📁 Core Files

```
src/
├── constant/
│   └── seo.config.ts          # Config & schemas
├── lib/
│   ├── seo-generator.ts       # SEO generators
│   └── sitemap-generator.ts   # Reference
├── components/common/
│   ├── SEOHead.tsx            # Meta tags
│   └── StructuredData.tsx     # JSON-LD
└── pages/
    ├── _document.tsx          # Organization schema
    └── sitemap.xml.ts         # Dynamic sitemap

public/
└── robots.txt                 # Crawl config
```

---

## 🎯 Quick Templates

### Product Page

```tsx
import { SEOHead } from "@/components/common/SEOHead";
import { ProductJsonLd } from "@/components/common/StructuredData";
import { generateProductSEO } from "@/lib/seo-generator";

export default function Product({ product }) {
  const seo = generateProductSEO(
    product.name,
    "Kategori",
    product.desc,
    product.slug,
  );
  return (
    <>
      <SEOHead {...seo} />
      <ProductJsonLd
        productName={product.name}
        description={product.desc}
        images={[product.image]}
        brand="Moxlite"
        price={product.price}
      />
    </>
  );
}
```

### City Page

```tsx
import { SEOHead } from "@/components/common/SEOHead";
import {
  generateCitySEO,
  generateCityStructuredData,
} from "@/lib/seo-generator";
import { StructuredData } from "@/components/common/StructuredData";

export default function City({ city }) {
  const seo = generateCitySEO(city);
  return (
    <>
      <SEOHead {...seo} />
      <StructuredData data={generateCityStructuredData(city)} />
    </>
  );
}
```

### Article Page

```tsx
import { SEOHead } from "@/components/common/SEOHead";
import { ArticleJsonLd } from "@/components/common/StructuredData";
import { generateArticleSEO } from "@/lib/seo-generator";

export default function Article({ article }) {
  const seo = generateArticleSEO(
    article.title,
    article.excerpt,
    article.slug,
    article.date,
  );
  return (
    <>
      <SEOHead {...seo} />
      <ArticleJsonLd {...seo} />
    </>
  );
}
```

### FAQ Page

```tsx
import { SEOHead } from "@/components/common/SEOHead";
import { FAQJsonLd } from "@/components/common/StructuredData";

export default function FAQ({ faqs }) {
  return (
    <>
      <SEOHead
        title="FAQ"
        description="FAQ"
        canonical="https://moxlite.com/faq"
      />
      <FAQJsonLd faqs={faqs} />
    </>
  );
}
```

---

## 🔧 Imports

```tsx
// Components
import { SEOHead } from "@/components/common/SEOHead";
import {
  StructuredData,
  ProductJsonLd,
  ArticleJsonLd,
  FAQJsonLd,
  BreadcrumbJsonLd,
  LocalBusinessJsonLd,
} from "@/components/common/StructuredData";

// Generators
import {
  generateCitySEO,
  generateProductSEO,
  generateArticleSEO,
  generateBreadcrumb,
  generateCityStructuredData,
} from "@/lib/seo-generator";

// Config
import {
  getDefaultSEOMeta,
  organizationSchema,
  DOMAIN,
  SEO_CITIES,
  SEO_KEYWORDS,
} from "@/constant/seo.config";
```

---

## 📋 SEOHead Props

```tsx
<SEOHead
  title="Title" // Required
  description="Description" // Required
  canonical="https://..." // Required
  ogImage="image.jpg" // Optional
  ogTitle="OG Title" // Optional
  ogDescription="OG Desc" // Optional
  ogUrl="https://..." // Optional
  twitterHandle="@moxlite" // Optional
  keywords="kw1, kw2" // Optional
  publishedTime="2024-01-01" // Optional (article)
  author="Name" // Optional (article)
/>
```

---

## 📚 Documentation

Full guide: [NEXT_SEO_SETUP.md](NEXT_SEO_SETUP.md)

---

**Status**: ✅ Ready for implementation
