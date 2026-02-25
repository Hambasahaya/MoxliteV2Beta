# Next-SEO Implementation Guide

Dokumentasi setup dan penggunaan **next-seo** di Moxlite Web.

## ✅ Yang Sudah Dilakukan

### 1. **Instalasi Package**

```bash
npm install next-seo
```

### 2. **File & Struktur yang Dibuat**

#### `src/constant/seo.config.ts`

- **defaultSEO**: Konfigurasi SEO global (meta tags, OG, Twitter Card)
- **Schemas**: LocalBusiness, Product, FAQ, Breadcrumb, Organization
- **SEO_KEYWORDS**: Kata kunci utama & sekunder
- **SEO_CITIES**: Daftar kota untuk programmatic SEO

#### `src/lib/seo-generator.ts`

Helper functions untuk generate SEO metadata dinamis:

- `generateCitySEO()` - SEO untuk halaman kota
- `generateProductSEO()` - SEO untuk halaman produk
- `generateArticleSEO()` - SEO untuk artikel/berita
- `generateBreadcrumb()` - Generate breadcrumb navigation
- `getAllCitiesForSitemap()` - Semua kota untuk sitemap

#### `src/components/common/StructuredData.tsx`

React components untuk JSON-LD structured data:

- `StructuredData` - Generic component
- `ProductJsonLd` - Schema Product
- `FAQJsonLd` - Schema FAQ
- `BreadcrumbJsonLd` - Schema Breadcrumb
- `LocalBusinessJsonLd` - Schema LocalBusiness
- `ArticleJsonLd` - Schema NewsArticle

#### `src/pages/_app.tsx`

- SEO diterapkan per-page menggunakan komponen NextSeo
- Gunakan `getDefaultSEO()` untuk mendapatkan konfigurasi default

#### `src/pages/_document.tsx`

- Tambah Organization schema JSON-LD
- Change lang dari "en" ke "id" (Indonesian)

---

## 🚀 Cara Penggunaan

### **1. Untuk Halaman Produk**

```tsx
import { NextSeo } from "next-seo";
import {
  ProductJsonLd,
  BreadcrumbJsonLd,
} from "@/components/common/StructuredData";
import { generateProductSEO, generateBreadcrumb } from "@/lib/seo-generator";

const ProductPage = ({ product }) => {
  const seoData = generateProductSEO(
    product.name,
    "Lampu Panggung",
    product.description,
    product.slug,
  );

  return (
    <>
      <NextSeo {...seoData} />
      <ProductJsonLd
        productName={product.name}
        description={product.description}
        images={[product.image]}
        brand="Moxlite"
        price={product.price}
        rating={product.rating}
        reviewCount={product.reviews}
      />
      <BreadcrumbJsonLd
        items={generateBreadcrumb(`/product/${product.slug}`)}
      />

      {/* Page content */}
    </>
  );
};
```

### **2. Untuk Halaman Kota (Programmatic SEO)**

```tsx
import { NextSeo } from "next-seo";
import { LocalBusinessJsonLd } from "@/components/common/StructuredData";
import {
  generateCitySEO,
  generateCityStructuredData,
} from "@/lib/seo-generator";

const CityPage = ({ city }) => {
  const seoData = generateCitySEO(city);
  const schema = generateCityStructuredData(city);

  return (
    <>
      <NextSeo {...seoData} />
      <LocalBusinessJsonLd
        name="Moxlite"
        address="Alamat kantor"
        city={city}
        telephone="+62..."
        url="https://moxlite.com"
        description="Jual dan sewa lampu panggung"
      />

      {/* Page content */}
    </>
  );
};

export const getStaticPaths = async () => {
  const { SEO_CITIES } = await import("@/constant/seo.config");
  return {
    paths: SEO_CITIES.map((city) => ({
      params: { city: city.toLowerCase() },
    })),
    fallback: "blocking",
  };
};
```

### **3. Untuk Halaman Artikel/Berita**

```tsx
import { NextSeo } from "next-seo";
import { ArticleJsonLd } from "@/components/common/StructuredData";
import { generateArticleSEO } from "@/lib/seo-generator";

const NewsPage = ({ article }) => {
  const seoData = generateArticleSEO(
    article.title,
    article.excerpt,
    article.slug,
    article.publishedDate,
  );

  return (
    <>
      <NextSeo {...seoData} />
      <ArticleJsonLd
        title={article.title}
        description={article.excerpt}
        image={article.image}
        url={`https://moxlite.com/news/${article.slug}`}
        datePublished={article.publishedDate}
        author={article.author || "Tim Moxlite"}
      />

      {/* Article content */}
    </>
  );
};
```

### **4. Untuk Halaman FAQ**

```tsx
import { NextSeo } from "next-seo";
import { FAQJsonLd } from "@/components/common/StructuredData";

const FAQPage = ({ faqs }) => {
  return (
    <>
      <NextSeo
        title="FAQ - Moxlite"
        description="Pertanyaan yang sering diajukan tentang layanan Moxlite"
      />
      <FAQJsonLd faqs={faqs} />

      {/* FAQ content */}
    </>
  );
};
```

### **5. Override SEO di Halaman Tertentu**

```tsx
import { NextSeo } from "next-seo";

const SpecialPage = () => {
  return (
    <>
      <NextSeo
        title="Title Custom Page"
        description="Custom description"
        canonical="https://moxlite.com/special"
        openGraph={{
          type: "website",
          url: "https://moxlite.com/special",
          title: "Title Custom",
          description: "Description custom",
          images: [{ url: "https://moxlite.com/image/special.jpg" }],
        }}
      />

      {/* Content */}
    </>
  );
};
```

---

## 📋 SEO Checklist

- [x] **Default SEO Configuration** - Global meta tags, OG, Twitter Card
- [x] **Organization Schema** - Di \_document.tsx
- [x] **Product Schema** - Untuk halaman produk
- [x] **Local Business Schema** - Untuk halaman kota
- [x] **Article/NewsArticle Schema** - Untuk halaman berita
- [x] **FAQ Schema** - Untuk halaman FAQ
- [x] **Breadcrumb Schema** - Untuk navigasi
- [x] **Dynamic SEO Generator** - Functions untuk generate SEO dinamis
- [ ] **Sitemap.xml** - Generate sitemap dengan semua halaman
- [ ] **robots.txt** - Konfigurasi crawl/index
- [ ] **Canonical Tags** - Prevent duplicate content
- [ ] **OG Images** - Optimized untuk social media
- [ ] **Page-specific SEO** - Update setiap page dengan NextSeo

---

## 🔧 Keywords Setup

### **Primary Keyword**

```
Lampu Panggung LED
```

### **Secondary Keywords**

```
- Lighting Konser
- Lighting Event
- Sewa Lighting
- Par LED
- Beam Light
```

### **Cities (Programmatic SEO)**

```
Jakarta, Surabaya, Bandung, Medan, Semarang, Makassar, Yogyakarta, Batam
```

### **Example URL Pattern**

```
/lighting/jakarta - Lampu Panggung LED Jakarta | Lighting Event Profesional | Moxlite
/lighting/surabaya - Lampu Panggung LED Surabaya | ...
/lighting/bandung - Lampu Panggung LED Bandung | ...
```

---

## 🎯 Next Steps

1. **Update setiap page** dengan NextSeo dan structured data
2. **Generate sitemap.xml** dengan semua path
3. **Buat robots.txt** configuration
4. **Optimize OG images** untuk social media
5. **Setup canonical tags** untuk page utama
6. **Monitor di Google Search Console** - Submit sitemap
7. **Test structured data** di [Schema.org Validator](https://schema.org/docs/schemas.html)
8. **Monitor di Google PageSpeed** - Mobile & Desktop

---

## 📚 Referensi Util

- **SEO Config**: `src/constant/seo.config.ts`
- **SEO Generator**: `src/lib/seo-generator.ts`
- **Structured Data Components**: `src/components/common/StructuredData.tsx`
- **Example**: `src/pages/examples/seo-example.tsx`

---

## ⚙️ Konfigurasi yang Perlu Diupdate

Di `src/constant/seo.config.ts`:

- [ ] Update `DOMAIN` dengan domain Anda yang sebenarnya
- [ ] Update `twitter.handle` dan `twitter.site`
- [ ] Update `openGraph.site_name`
- [ ] Update image paths (OG, logo, etc)
- [ ] Update `SEO_CITIES` dengan kota yg relevan
- [ ] Update `organizationSchema` dengan info lengkap

---

**Status**: ✅ Setup Complete - Ready to implement on pages
