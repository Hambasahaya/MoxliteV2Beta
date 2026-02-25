# Quick Reference: Next-SEO Implementation

## 📦 Installed Package

- `next-seo` - SEO management for Next.js

## 📁 File Structure

```
src/
├── constant/
│   └── seo.config.ts          # Global SEO config & schemas
├── lib/
│   ├── seo-generator.ts       # Dynamic SEO generators
│   └── sitemap-generator.ts   # Sitemap generator
├── components/common/
│   └── StructuredData.tsx     # JSON-LD components
└── pages/
    ├── _app.tsx              # DefaultSeo wrapper
    ├── _document.tsx         # Organization schema
    └── examples/
        └── seo-example.tsx   # Example implementations

public/
└── robots.txt                # Updated with disallow rules
```

---

## 🎯 Quick Start Templates

### Template 1: Product Page

```tsx
import { NextSeo } from "next-seo";
import { ProductJsonLd } from "@/components/common/StructuredData";
import { generateProductSEO } from "@/lib/seo-generator";

export default function ProductPage({ product }) {
  const seo = generateProductSEO(
    product.name,
    "Kategori",
    product.desc,
    product.slug,
  );

  return (
    <>
      <NextSeo {...seo} />
      <ProductJsonLd
        productName={product.name}
        description={product.desc}
        images={[product.image]}
        brand="Moxlite"
        price={product.price}
      />
      {/* Content */}
    </>
  );
}
```

### Template 2: City Page (Programmatic SEO)

```tsx
import { NextSeo } from "next-seo";
import {
  generateCitySEO,
  generateCityStructuredData,
} from "@/lib/seo-generator";
import { StructuredData } from "@/components/common/StructuredData";

export default function CityPage({ city }) {
  const seo = generateCitySEO(city);

  return (
    <>
      <NextSeo {...seo} />
      <StructuredData data={generateCityStructuredData(city)} />
      {/* Content */}
    </>
  );
}

export const getStaticPaths = async () => {
  const { SEO_CITIES } = await import("@/constant/seo.config");
  return {
    paths: SEO_CITIES.map((city) => ({ params: { city: city.toLowerCase() } })),
    fallback: "blocking",
  };
};
```

### Template 3: Article Page

```tsx
import { NextSeo } from "next-seo";
import { ArticleJsonLd } from "@/components/common/StructuredData";
import { generateArticleSEO } from "@/lib/seo-generator";

export default function ArticlePage({ article }) {
  const seo = generateArticleSEO(
    article.title,
    article.excerpt,
    article.slug,
    article.date,
  );

  return (
    <>
      <NextSeo {...seo} />
      <ArticleJsonLd
        title={article.title}
        description={article.excerpt}
        image={article.image}
        url={`https://moxlite.com/news/${article.slug}`}
        datePublished={article.date}
        author={article.author}
      />
      {/* Content */}
    </>
  );
}
```

### Template 4: FAQ Page

```tsx
import { NextSeo } from "next-seo";
import { FAQJsonLd } from "@/components/common/StructuredData";

export default function FAQPage({ faqs }) {
  return (
    <>
      <NextSeo
        title="FAQ - Moxlite"
        description="Pertanyaan yang sering diajukan"
      />
      <FAQJsonLd faqs={faqs} />
      {/* FAQ content */}
    </>
  );
}
```

### Template 5: Custom SEO Override

```tsx
import { NextSeo } from "next-seo";

export default function CustomPage() {
  return (
    <>
      <NextSeo
        title="Custom Title"
        description="Custom description"
        canonical="https://moxlite.com/custom"
        openGraph={{
          type: "website",
          url: "https://moxlite.com/custom",
          title: "Custom Title",
          description: "Custom description",
          images: [{ url: "https://moxlite.com/image/custom.jpg" }],
        }}
        additionalMetaTags={[
          { name: "keywords", content: "keyword1, keyword2" },
        ]}
      />
      {/* Content */}
    </>
  );
}
```

---

## 🔧 Import Statements

```tsx
// From next-seo
import { NextSeo, DefaultSeo } from "next-seo";

// From constant
import {
  getDefaultSEO,
  organizationSchema,
  SEO_CITIES,
  SEO_KEYWORDS,
} from "@/constant/seo.config";

// From lib
import {
  generateCitySEO,
  generateProductSEO,
  generateArticleSEO,
  generateBreadcrumb,
  generateCityStructuredData,
  getAllCitiesForSitemap,
} from "@/lib/seo-generator";

// Components
import {
  StructuredData,
  ProductJsonLd,
  ArticleJsonLd,
  FAQJsonLd,
  BreadcrumbJsonLd,
  LocalBusinessJsonLd,
} from "@/components/common/StructuredData";
```

---

## 🌐 Keywords & Cities Reference

**Primary Keyword**: Lampu Panggung LED

**Secondary Keywords**:

- Lighting Konser
- Lighting Event
- Sewa Lighting
- Par LED
- Beam Light

**Cities**:

- Jakarta
- Surabaya
- Bandung
- Medan
- Semarang
- Makassar
- Yogyakarta
- Batam

---

## ✅ SEO Checklist Per Page

- [ ] Add `<NextSeo>` component with title, description, canonical
- [ ] Add Open Graph (OG) tags for social sharing
- [ ] Add JSON-LD structured data (ProductJsonLd, ArticleJsonLd, etc.)
- [ ] Add breadcrumb if applicable
- [ ] Add robots props (noindex, nofollow)
- [ ] Test with Google Schema Validator
- [ ] Verify OG image is properly sized (1200x630px)
- [ ] Check canonical URL is correct
- [ ] Verify keywords are natural in content

---

## 🧪 Testing & Validation

1. **Structured Data**: https://schema.org/docs/schemas.html
2. **OG Tags**: https://ogp.me/
3. **Google PageSpeed**: https://pagespeed.web.dev/
4. **Mobile-Friendly**: https://search.google.com/test/mobile-friendly
5. **Google Search Console**: https://search.google.com/search-console

---

## 📝 Common SEO Issues & Fixes

### Issue: Duplicate Meta Tags

**Solution**: Ensure only one `<NextSeo>` per page at root level

### Issue: Missing OG Images

**Solution**: Always include at least one image in `openGraph.images`

### Issue: Poor Breadcrumb

**Solution**: Use `BreadcrumbJsonLd` component with proper hierarchy

### Issue: Missing Product Schema

**Solution**: Add `ProductJsonLd` on product pages

### Issue: Canonicalization Issues

**Solution**: Always specify canonical URL in NextSeo

---

## 🚀 Best Practices

1. **Always lowercase URLs** when generating city paths
2. **Use DOMAIN constant** from seo.config for all URLs
3. **Test OG images** are exactly 1200x630px
4. **Keep descriptions 120-160 characters**
5. **Use primary keyword once** in title and once in first paragraph
6. **Update lastmod** in sitemap for dynamic content
7. **Monitor GSC** for crawl errors and coverage

---

## 📚 Full Documentation

See `NEXT_SEO_SETUP.md` for complete setup guide
