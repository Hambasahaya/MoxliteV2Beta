# 🚀 Translation & SEO Quick Reference

## 📚 Core Files (Copy-Paste Snippets)

### 1️⃣ Translate Single Text

```tsx
import { useTranslation } from "@/lib/useTranslation";

const { translated, isLoading } = useTranslation("Hello", "id");
// Result: translated = "Halo", isLoading = false
```

### 2️⃣ Translate Multiple Texts (Faster)

```tsx
import { useTranslationBatch } from "@/lib/useTranslation";

const { translations } = useTranslationBatch(
  ["Hello", "World", "Welcome"],
  "id",
);
// Result: ["Halo", "Dunia", "Selamat Datang"]
```

### 3️⃣ SEO Meta Tags (Recommended)

```tsx
import { SEOHead } from "@/components/common/SEOHead";

<SEOHead
  title="Page Title"
  description="Page description"
  canonical="https://moxlite.com/page"
  hreflangs={[
    { lang: "en", href: "https://moxlite.com/page" },
    { lang: "id", href: "https://moxlite.com/id/page" },
  ]}
/>;
```

### 4️⃣ Multi-Language SEO (Best for Pages)

```typescript
import { GetStaticProps } from "next";
import { generatePageSEO } from "@/lib/translation-seo.server";

export const getStaticProps: GetStaticProps = async () => {
  const seo = await generatePageSEO({
    basePath: "/page",
    enTitle: "English Title",
    enDescription: "English description",
  });

  return { props: { seo }, revalidate: 86400 };
};
```

---

## ⚡ Performance Comparison

| Method                  | Speed            | Use Case                 |
| ----------------------- | ---------------- | ------------------------ |
| `useTranslation()`      | Instant (cached) | Single text, client-side |
| `useTranslationBatch()` | 100-200ms        | Multiple texts, batch    |
| `generatePageSEO()`     | 200-500ms        | Pre-render, server       |
| `useLazyTranslation()`  | On-demand        | Below-the-fold content   |

---

## 🎯 Common Patterns

### Homepage

```typescript
// ✅ Best Practice
const seo = await generatePageSEO({
  basePath: "/",
  enTitle: "Professional Stage Lighting | Moxlite",
  enDescription: "Buy and rent...",
});

return {
  props: { seo },
  revalidate: 86400, // ISR
};
```

### Product Pages

```typescript
// ✅ Mix server + client
const seo = await generatePageSEO({
  basePath: `/product/${slug}`,
  enTitle: `${product.name} - Moxlite`,
  enDescription: product.description,
});

// Client-side updates
const { seoTranslated } = useSEOTranslation(
  {
    title: seo.en.title,
    description: seo.en.description,
  },
  language,
);
```

### City Pages

```typescript
// ✅ Batch generate for all cities
const seoResults = await batchGeneratePagesSEO(cities);

return {
  props: { seoResults },
  revalidate: 604800, // 7 days
};
```

### Dynamic Content (Client-Only)

```typescript
// ✅ Use hooks
const { translated, isLoading } = useTranslation(text, language);

// ✅ Lazy load if not visible
const { translated, ref } = useLazyTranslation(text, language);
<div ref={ref}>{translated}</div>
```

---

## 🔍 Debugging

### Check Cache

```typescript
import { getTranslationStats } from "@/lib/translationService";

const stats = getTranslationStats();
console.log(stats);
// { memoryCacheSize: 150, pendingRequests: 0, totalCached: 150 }
```

### Validate SEO

```typescript
import { validatePageSEO } from "@/lib/translation-seo.server";

const errors = validatePageSEO(seo);
errors.forEach((e) => console.log(e));
// ✅ Title OK: 45/60 chars
// ✅ Description OK: 120/160 chars
// ✅ Canonical: https://...
```

### Check Translation Health

```typescript
import { checkTranslationHealth } from "@/lib/translation-seo.server";

const health = await checkTranslationHealth();
console.log(`API: ${health.apiStatus} (${health.latency}ms)`);
// API: ok (245ms)
```

---

## ❌ Common Mistakes

```typescript
// ❌ DON'T - Loop translation (SLOW!)
for (const item of items) {
  const trans = await translateText(item.title, "id");
}

// ✅ DO - Batch (FAST!)
const titles = items.map((i) => i.title);
const translated = await translateBatch(titles, "id");
```

```typescript
// ❌ DON'T - Translate SEO at render
useEffect(() => {
  const title = await translateText(enTitle, language);
  setTitle(title); // Layout shift!
}, []);

// ✅ DO - Pre-translate at build
const seo = await generatePageSEO({...});
// No layout shift, instant SEO content
```

```tsx
// ❌ DON'T - Missing hreflang
<SEOHead title="..." description="..." />

// ✅ DO - Include hreflang
<SEOHead
  hreflangs={[
    { lang: "en", href: "..." },
    { lang: "id", href: "..." },
  ]}
/>
```

---

## 📋 Checklist for New Page

- [ ] Import `generatePageSEO` for server-side
- [ ] Generate SEO data in `getStaticProps` or `getServerSideProps`
- [ ] Add hreflang tags to `<SEOHead>`
- [ ] Use `useTranslation` hooks for dynamic content
- [ ] Test in DevTools > Network tab
- [ ] Verify hreflang in page source
- [ ] Check Google Search Console

---

## 🚀 Quick Commands

```bash
# Clear translation cache
localStorage.clear() // in browser console

# Verify files created
ls -la src/lib/{translationService,useTranslation,seo-multilang,translation-seo.server}.ts

# Check cache size
const { memoryCacheSize } = await getTranslationStats()

# Test translation
await translateText("Hello", "id")
// Returns: "Halo"
```

---

## 📊 Expected Results

| Metric            | Before            | After            |
| ----------------- | ----------------- | ---------------- |
| Translation Speed | 300-500ms         | 10-50ms (cached) |
| API Calls         | Many              | 70% less         |
| SEO Issues        | Duplicate content | None (hreflang)  |
| Cache Hit Rate    | N/A               | 80%+             |
| Core Web Vitals   | Fair              | Good             |

---

## 🆘 When Something Goes Wrong

1. **Translation returns English (not translated)**
   → Check API status: `await checkTranslationHealth()`

2. **Layout shifts when text translates**
   → Use `getStaticProps` to pre-translate or `useLazyTranslation`

3. **Cache too full/memory issues**
   → Run `clearMemoryCache()` or check with `getTranslationStats()`

4. **hreflang not showing in GSC**
   → Verify `<SEOHead hreflangs={[...]} />`

5. **Pages not found by Google**
   → Check sitemap includes both /en and /id paths

---

## 📚 Full Documentation

- **Complete Guide:** `TRANSLATION_SEO_OPTIMIZATION.md`
- **Examples:** `TRANSLATION_EXAMPLES.md`
- **Implementation:** `IMPLEMENTATION_SUMMARY.md`
- **Source Code:** `src/lib/translationService.ts` (well-commented)

---

## 📞 Need Help?

1. Check the full docs first
2. Look at code examples
3. Use DevTools to inspect
4. Monitor translation stats

**Files ready to copy-paste from examples file!**

---

**Last Updated:** March 3, 2025  
**Status:** ✅ Production Ready
