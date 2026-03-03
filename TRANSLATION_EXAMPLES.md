/\*\*

- PRAKTICAL EXAMPLES - Cara Menggunakan Translation & SEO Optimization
- Copy-paste dan sesuaikan untuk halaman Anda
  \*/

// ============================================================================
// EXAMPLE 1: Homepage dengan Multi-Language SEO (Recommended)
// ============================================================================

// pages/index.tsx
import { GetStaticProps } from "next";
import { SEOHead } from "@/components/common/SEOHead";
import { useLanguage } from "@/contexts/LanguageContext"; // sesuaikan
import { generatePageSEO } from "@/lib/translation-seo.server";

interface HomePageProps {
seoData: any;
}

export default function HomePage({ seoData }: HomePageProps) {
const { language } = useLanguage();
const currentSEO = seoData[language];

return (
<>
<SEOHead
        title={currentSEO.title}
        description={currentSEO.description}
        canonical={currentSEO.canonical}
        ogImage={currentSEO.ogImage}
        keywords={currentSEO.keywords}
        hreflangs={currentSEO.hreflang}
      />

      <main>
        {/* Your homepage content */}
      </main>
    </>

);
}

export const getStaticProps: GetStaticProps = async () => {
// Pre-generate SEO untuk kedua languages
const seoData = await generatePageSEO({
basePath: "/",
enTitle: "Professional Stage Lighting | Moxlite - Event Lighting Solutions",
enDescription:
"Buy and rent professional stage lighting, concert lighting, LED beam and par lights in Indonesia.",
enKeywords: "stage lighting, concert lighting, LED lights, lighting rental",
ogImage: "https://moxlite.com/image/og-home.jpg",
});

return {
props: { seoData },
revalidate: 86400, // Revalidate setiap 24 jam untuk ISR
};
};

// ============================================================================
// EXAMPLE 2: Product Page dengan Dynamic Translation (SSR)
// ============================================================================

// pages/product/[slug].tsx
import { GetServerSideProps } from "next";
import { useSEOTranslation } from "@/lib/useTranslation";
import { SEOHead } from "@/components/common/SEOHead";
import { useLanguage } from "@/contexts/LanguageContext";

interface ProductPageProps {
product: {
name: string;
description: string;
slug: string;
category: string;
};
initialSEO: any;
}

export default function ProductPage({
product,
initialSEO,
}: ProductPageProps) {
const { language } = useLanguage();

// Use hook untuk client-side translation updates
const { seoTranslated } = useSEOTranslation(
{
title: initialSEO.en.title,
description: initialSEO.en.description,
},
language as any
);

const seo = language === "en" ? initialSEO.en : initialSEO.id;

return (
<>
<SEOHead
title={seoTranslated.title || seo.title}
description={seoTranslated.description || seo.description}
canonical={seo.canonical}
hreflangs={seo.hreflang}
/>

      <main>
        <h1>{product.name}</h1>
        <p>{product.description}</p>
      </main>
    </>

);
}

export const getServerSideProps: GetServerSideProps = async ({ params, locale }) => {
const slug = params?.slug as string;

// Fetch product data
const product = await fetch(`/api/products/${slug}`).then((r) => r.json());

// Generate SEO dengan translated content
const seoData = await generatePageSEO({
basePath: `/product/${slug}`,
enTitle: `${product.name} | Moxlite - ${product.category}`,
enDescription: product.description,
ogImage: product.image,
});

return {
props: {
product,
initialSEO: seoData,
},
};
};

// ============================================================================
// EXAMPLE 3: City Pages (Static Generation dengan Default Props untuk semua kota)
// ============================================================================

// pages/lighting/[city].tsx
import { GetStaticProps, GetStaticPaths } from "next";
import { SEOHead } from "@/components/common/SEOHead";
import { useLanguage } from "@/contexts/LanguageContext";
import { batchGeneratePagesSEO } from "@/lib/translation-seo.server";
import { SEO_KEYWORDS_CONFIG } from "@/constant/translation-seo.config";

interface CityPageProps {
city: string;
seoData: any;
}

export default function CityPage({ city, seoData }: CityPageProps) {
const { language } = useLanguage();
const seo = seoData[language];

return (
<>
<SEOHead
        title={seo.title}
        description={seo.description}
        canonical={seo.canonical}
        hreflangs={seo.hreflang}
      />

      <main>
        <h1>{city} Lighting Solutions</h1>
        {/* City-specific content */}
      </main>
    </>

);
}

export const getStaticPaths: GetStaticPaths = async () => {
const paths = SEO_KEYWORDS_CONFIG.cities.map((city) => ({
params: { city: city.toLowerCase() },
locale: "en", // atau both "en" dan "id"
}));

return {
paths,
fallback: "blocking", // ISR untuk new cities
};
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
const city = params?.city as string;
const capitalCity = city.charAt(0).toUpperCase() + city.slice(1);

// Batch generate SEO untuk city page dan related content
const seoData = await generatePageSEO({
basePath: `/lighting/${city}`,
enTitle: `${SEO_KEYWORDS_CONFIG.primary} ${capitalCity} | Moxlite`,
enDescription: `Buy and rent ${SEO_KEYWORDS_CONFIG.primary.toLowerCase()} in ${capitalCity}. Professional ${SEO_KEYWORDS_CONFIG.secondary[0].toLowerCase()} for events and concerts.`,
enKeywords: `${capitalCity}, lighting, event, rental`,
ogImage: `https://moxlite.com/image/og-city-${city}.jpg`,
});

return {
props: {
city: capitalCity,
seoData,
},
revalidate: 604800, // Revalidate setiap 7 hari
};
};

// ============================================================================
// EXAMPLE 4: Menggunakan useTranslation Hook untuk Client-Side
// ============================================================================

// components/PageSection.tsx
import { useTranslationBatch } from "@/lib/useTranslation";
import { useLanguage } from "@/contexts/LanguageContext";

export function PageSection() {
const { language } = useLanguage();

const textContent = {
heading: "Welcome to Our Lighting Solutions",
subheading: "Professional equipment for every event",
cta: "Learn More",
};

// Batch translate multiple texts
const { translations, isLoading } = useTranslationBatch(
Object.values(textContent),
language as any
);

// Map translations back ke keys
const translatedContent = Object.keys(textContent).reduce(
(acc, key, idx) => ({
...acc,
[key]: translations[idx] || textContent[key as keyof typeof textContent],
}),
{} as typeof textContent
);

return (
<section>
{isLoading && <div>Loading translations...</div>}
<h1>{translatedContent.heading}</h1>
<p>{translatedContent.subheading}</p>
<button>{translatedContent.cta}</button>
</section>
);
}

// ============================================================================
// EXAMPLE 5: Lazy Loading untuk Non-Critical Content
// ============================================================================

// components/LazyTranslatedContent.tsx
import { useLazyTranslation } from "@/lib/useTranslation";
import { useLanguage } from "@/contexts/LanguageContext";

export function LazyTranslatedContent({ text }: { text: string }) {
const { language } = useLanguage();

const { translated, isVisible, isLoading, ref } = useLazyTranslation(
text,
language as any,
{
rootMargin: "200px", // Start loading 200px before element comes into view
}
);

return (
<div ref={ref}>
{isLoading && isVisible ? <div>Loading...</div> : translated}
</div>
);
}

// ============================================================================
// EXAMPLE 6: API Route untuk Prebuild Translations
// ============================================================================

// pages/api/translate/prebuild.ts
import { NextApiRequest, NextApiResponse } from "next";
import { preCachePageContent } from "@/lib/translation-seo.server";

export default async function handler(
req: NextApiRequest,
res: NextApiResponse
) {
if (req.method !== "POST") {
return res.status(405).json({ error: "Method not allowed" });
}

const { pageContent, language = "id" } = req.body;

const result = await preCachePageContent(pageContent, language);

return res.status(result.success ? 200 : 500).json(result);
}

// Usage:
// POST /api/translate/prebuild
// {
// "pageContent": {
// "title": "Page Title",
// "description": "Page description",
// "bodyTexts": ["text1", "text2"]
// },
// "language": "id"
// }

// ============================================================================
// EXAMPLE 7: Meta Tags Component untuk Article/Blog
// ============================================================================

// components/ArticleSEOHead.tsx
import { SEOHead } from "@/components/common/SEOHead";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSEOTranslation } from "@/lib/useTranslation";
import { generatePageSEO } from "@/lib/translation-seo.server";

interface ArticleData {
title: string;
description: string;
slug: string;
publishedDate: string;
author: string;
image: string;
}

export async function ArticleSEOHead({ article }: { article: ArticleData }) {
const { language } = useLanguage();

// Pre-generate SEO
const seoData = await generatePageSEO({
basePath: `/articles/${article.slug}`,
enTitle: article.title,
enDescription: article.description,
ogImage: article.image,
});

const currentSEO = seoData[language];

return (
<SEOHead
      title={currentSEO.title}
      description={currentSEO.description}
      canonical={currentSEO.canonical}
      ogImage={currentSEO.ogImage}
      hreflangs={currentSEO.hreflang}
      publishedTime={article.publishedDate}
      author={article.author}
    />
);
}

// ============================================================================
// EXAMPLE 8: Monitoring Translation Performance
// ============================================================================

// utils/translationMonitor.ts
import { getTranslationStats } from "@/lib/translationService";

export function logTranslationStats() {
const stats = getTranslationStats();

console.log("📊 Translation Stats:", {
"Memory Cache Size": stats.memoryCacheSize,
"Pending Requests": stats.pendingRequests,
"Total Cached": stats.totalCached,
"Cache Hit Ratio": "~80%+ on repeat visits",
});
}

// Gunakan di development:
// if (process.env.NODE_ENV === "development") {
// logTranslationStats();
// }

// ============================================================================
// BEST PRACTICES SUMMARY
// ============================================================================

/\*\*

- ✅ DO:
- 1.  Pre-generate SEO untuk static pages (homepage, city pages)
- 2.  Use batch translation untuk multiple texts
- 3.  Include hreflang tags untuk multi-language
- 4.  Cache critical translations (title, description)
- 5.  Use lazy loading untuk non-critical content
-
- ❌ DON'T:
- 1.  Translate dalam loops (use batch instead)
- 2.  Skip hreflang tags
- 3.  Translate SEO content client-side
- 4.  Make unlimited API calls (use caching)
- 5.  Ignore cache size monitoring
      \*/
