/**
 * Sitemap Generator
 * Letakkan di: src/pages/sitemap.xml.ts
 *
 * Atau copy kode dari file ini ke pages/sitemap.xml.ts
 */

import { DOMAIN, SEO_CITIES } from "@/constant/seo.config";

const generateSiteMap = (routes: any[]) => {
  return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     ${routes
       .map(({ url, changefreq, priority, lastmod }) => {
         return `
       <url>
           <loc>${url}</loc>
           <changefreq>${changefreq}</changefreq>
           <priority>${priority}</priority>
           ${lastmod ? `<lastmod>${lastmod}</lastmod>` : ""}
       </url>
     `;
       })
       .join("")}
   </urlset>
 `;
};

// Static routes
const staticRoutes = [
  {
    url: DOMAIN,
    changefreq: "weekly",
    priority: 1.0,
  },
  {
    url: `${DOMAIN}/about`,
    changefreq: "monthly",
    priority: 0.8,
  },
  {
    url: `${DOMAIN}/product`,
    changefreq: "weekly",
    priority: 0.9,
  },
  {
    url: `${DOMAIN}/news`,
    changefreq: "daily",
    priority: 0.8,
  },
  {
    url: `${DOMAIN}/contact`,
    changefreq: "monthly",
    priority: 0.7,
  },
  {
    url: `${DOMAIN}/faq`,
    changefreq: "monthly",
    priority: 0.7,
  },
];

// Dynamic city routes
const cityRoutes = SEO_CITIES.map((city) => ({
  url: `${DOMAIN}/lighting/${city.toLowerCase()}`,
  changefreq: "weekly",
  priority: 0.8,
}));

// Combine all routes
const allRoutes = [...staticRoutes, ...cityRoutes];

const Sitemap = () => {};

export const getServerSideProps = async ({ res }: any) => {
  const sitemap = generateSiteMap(allRoutes);
  res.setHeader("Content-Type", "text/xml");
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
};

export default Sitemap;

/**
 * IMPLEMENTASI:
 * 1. Copy kode di atas ke src/pages/sitemap.xml.ts
 * 2. Atau tinggalkan file ini sebagai referensi
 * 3. Sitemap akan generate di /sitemap.xml
 */
