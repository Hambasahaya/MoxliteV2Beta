# 📋 Step-by-Step Implementation Guide

## Phase 1: Setup & Verification (1-2 hours)

### Step 1: Verify All Files Created

```bash
# Check core translation files
ls src/lib/translationService.ts
ls src/lib/useTranslation.ts
ls src/lib/seo-multilang.ts
ls src/lib/translation-seo.server.ts
ls src/constant/translation-seo.config.ts
ls src/components/common/SEOHead.tsx

# Check documentation
ls QUICK_REFERENCE.md
ls TRANSLATION_SEO_OPTIMIZATION.md
ls TRANSLATION_EXAMPLES.md
ls IMPLEMENTATION_SUMMARY.md
```

### Step 2: No Additional Dependencies Needed!

```bash
# ✅ Already available in Next.js projects:
# - React hooks (useEffect, useState, useCallback)
# - Next.js API (GetStaticProps, GetServerSideProps, Head)
# - Browser APIs (localStorage, IntersectionObserver)

# Run existing build to verify no issues
npm run build
```

### Step 3: Read Quick Reference

- Open `QUICK_REFERENCE.md` untuk quick lookup
- Copy-paste snippets sesuai kebutuhan
- Bookmark untuk future reference

---

## Phase 2: Homepage Update (1-2 hours)

### Step 1: Open Homepage File

```bash
# Find and open your homepage
# Usually pages/index.tsx or pages/home.tsx
code pages/index.tsx
```

### Step 2: Add Server-Side SEO Generation

```typescript
import { GetStaticProps } from "next";
import { generatePageSEO } from "@/lib/translation-seo.server";

// Add at end of file:
export const getStaticProps: GetStaticProps = async () => {
  const seoData = await generatePageSEO({
    basePath: "/",
    enTitle: "Professional Stage Lighting | Moxlite",
    enDescription:
      "Buy and rent stage lighting, concert lighting, and LED lighting equipment in Indonesia.",
    enKeywords: "stage lighting, concert lighting, LED, professional",
    ogImage: "https://moxlite.com/image/og-home.jpg",
  });

  return {
    props: { seoData },
    revalidate: 86400, // Regenerate every 24 hours
  };
};
```

### Step 3: Update Component to Use SEO Data

```typescript
import { SEOHead } from "@/components/common/SEOHead";
import { useLanguage } from "@/contexts/LanguageContext"; // or your language hook

interface HomePageProps {
  seoData: any; // Type this properly in your code
}

export default function HomePage({ seoData }: HomePageProps) {
  const { language } = useLanguage();
  const currentSEO = seoData[language];

  return (
    <>
      <SEOHead
        title={currentSEO.title}
        description={currentSEO.description}
        keywords={currentSEO.keywords}
        canonical={currentSEO.canonical}
        ogImage={currentSEO.ogImage}
        hreflangs={currentSEO.hreflang}
      />

      <main>
        {/* Your existing homepage content */}
      </main>
    </>
  );
}
```

### Step 4: Test Build

```bash
npm run build
# ✅ Should build without errors
```

---

## Phase 3: Update Other Pages (2-4 hours)

### For Each Page:

1. **City Pages** (if have `/lighting/[city]` routes)

```typescript
// pages/lighting/[city].tsx
export const getStaticProps = async ({ params }) => {
  const seoData = await generatePageSEO({
    basePath: `/lighting/${params.city}`,
    enTitle: `Stage Lighting ${city} | Moxlite`,
    enDescription: `Professional stage lighting rental and sales in ${city}...`,
  });

  return {
    props: { seoData },
    revalidate: 604800, // 7 days
  };
};
```

2. **Product Pages** (if have `/product/[slug]` routes)

```typescript
// pages/product/[slug].tsx
export const getServerSideProps = async ({ params }) => {
  const product = await fetchProduct(params.slug);
  const seoData = await generatePageSEO({
    basePath: `/product/${params.slug}`,
    enTitle: `${product.name} | Moxlite`,
    enDescription: product.description,
  });

  return {
    props: { product, seoData },
  };
};
```

3. **Blog/Article Pages**

```typescript
// pages/blog/[slug].tsx - similar pattern
```

---

## Phase 4: Add Translation Hooks (2-3 hours)

### For Dynamic Content (Client-Side):

```tsx
// In any component that has text to translate:
import { useTranslation } from "@/lib/useTranslation";
import { useLanguage } from "@/contexts/LanguageContext";

export function MyComponent() {
  const { language } = useLanguage();

  // Single text
  const { translated: heading } = useTranslation(
    "Professional Lighting",
    language as any,
  );

  // Multiple texts (faster)
  const { translations } = useTranslationBatch(
    ["Text 1", "Text 2", "Text 3"],
    language as any,
  );

  return (
    <div>
      <h1>{heading}</h1>
      <p>{translations[0]}</p>
    </div>
  );
}
```

### For Below-The-Fold Content (Lazy):

```tsx
import { useLazyTranslation } from "@/lib/useTranslation";

export function LazySection() {
  const { language } = useLanguage();
  const { translated, ref } = useLazyTranslation(
    "Long article text...",
    language as any,
    { rootMargin: "200px" }, // Start loading 200px before visible
  );

  return <div ref={ref}>{translated}</div>;
}
```

---

## Phase 5: Verification & Testing (1-2 hours)

### In Browser:

```javascript
// Open DevTools Console and run:

// 1. Check translation stats
import { getTranslationStats } from "@/lib/translationService";
getTranslationStats();
// Expected output:
// { memoryCacheSize: 50+, pendingRequests: 0, totalCached: 50+ }

// 2. Check hreflang tags
document.querySelectorAll("link[hreflang]");
// Should see multiple links with hreflang attributes

// 3. Check localStorage cache
Object.keys(localStorage).filter((k) => k.startsWith("trans_"));
// Should see 20+ entries after 1st visit
```

### Inspect Page Source:

```html
<!-- Should see hreflang tags in <head>: -->
<link rel="alternate" hreflang="en" href="https://moxlite.com/page" />
<link rel="alternate" hreflang="id" href="https://moxlite.com/id/page" />
<link rel="alternate" hreflang="x-default" href="https://moxlite.com/page" />
```

### Google Search Console:

1. Submit updated sitemap
2. Check "URL Inspection" tool
3. Verify hreflang shows correctly
4. Monitor "Coverage" for duplicate content issues
5. Check "Core Web Vitals" improving

---

## Phase 6: Performance Monitoring (Ongoing)

### Weekly Check:

```typescript
// Add to a monitoring page or API route:
import { checkTranslationHealth } from "@/lib/translation-seo.server";

const health = await checkTranslationHealth();
console.log(`Translation API: ${health.apiStatus} (${health.latency}ms)`);

// Expected:
// ✅ API Status: ok (latency < 1000ms)
// ✅ Cache hits: 80%+
// ⚠️ Pending requests: 0
```

### Monthly Review:

```bash
# 1. Check Google Search Console
# - Verify all pages indexed
# - No duplicate content warnings
# - Click-through rate improved

# 2. Check Core Web Vitals
# - CLS (Cumulative Layout Shift) < 0.1 ✅
# - FCP (First Contentful Paint) < 1.8s ✅
# - LCP (Largest Contentful Paint) < 2.5s ✅

# 3. Review analytics
# - Bounce rate from language/content mismatch reduced
# - Engagement metrics improved
# - User flow between language versions verified
```

---

## Troubleshooting

### Build Fails

```bash
# Solution: Clear node_modules and rebuild
rm -rf node_modules
npm install
npm run build
```

### hreflang Not Showing

```typescript
// Check: SEOHead component has hreflangs prop
<SEOHead
  // ... other props
  hreflangs={seo.hreflang} // This line required!
/>
```

### Translations Slow

```javascript
// Check: Cache hit rate
const stats = getTranslationStats();
console.log(`Cache hit ratio: ${stats.totalCached}/${stats.memoryCacheSize}`);

// Clear if needed
clearMemoryCache();
```

### Pages Not Crawlable

```bash
# Solution: Pre-translate SEO content
# Don't translate in client-side useEffect
# Use getStaticProps/getServerSideProps instead
```

---

## Rollback Plan

If issues occur, you can rollback easily:

```bash
# Check git history
git log --oneline | head -10

# Revert to previous version
git revert [commit-hash]

# Or reset completely
git reset --hard HEAD~1
```

Old translation service still available at `translationService.ts` (updated, not deleted).

---

## Success Criteria

After implementation, verify:

- [ ] Homepage builds without errors
- [ ] `npm run build` completes successfully
- [ ] hreflang tags visible in page source
- [ ] Translation cache grows (localStorage > 20 entries)
- [ ] Translations instant on 2nd visit (cached)
- [ ] Google Search Console shows hreflang
- [ ] No console errors in DevTools
- [ ] Core Web Vitals: Green in lighthouse

---

## Timeline Estimate

| Phase                   | Duration | Priority  |
| ----------------------- | -------- | --------- |
| Setup & Verification    | 1-2 hrs  | 🔴 MUST   |
| Homepage Update         | 1-2 hrs  | 🔴 MUST   |
| Other Pages             | 2-4 hrs  | 🟡 SHOULD |
| Translation Hooks       | 2-3 hrs  | 🟢 NICE   |
| Testing & Verification  | 1-2 hrs  | 🔴 MUST   |
| Deployment & Monitoring | 1 hr     | 🔴 MUST   |

**Total: 8-14 hours for full implementation**

---

## Questions?

1. **Read docs** - All files well-commented
2. **Check examples** - `TRANSLATION_EXAMPLES.md` has code samples
3. **Review src code** - `translationService.ts` is well-documented
4. **Test in browser** - Use DevTools to inspect

**Everything you need is in the files!** 🚀

---

**Ready?** Start with Phase 1! ✅
