import { GetServerSideProps } from "next";
import { DOMAIN, SEO_CITIES } from "@/constant/seo.config";

/**
 * Sitemap Generator
 * Generates /sitemap.xml with all static and dynamic routes
 * Auto-includes city routes untuk programmatic SEO
 */

function Sitemap() {}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  // Static routes
  const staticRoutes = [
    { url: "", changefreq: "daily", priority: 1.0 },
    { url: "/product", changefreq: "weekly", priority: 0.9 },
    { url: "/news", changefreq: "daily", priority: 0.8 },
    { url: "/projects", changefreq: "weekly", priority: 0.8 },
    { url: "/about", changefreq: "monthly", priority: 0.8 },
    { url: "/contact", changefreq: "monthly", priority: 0.7 },
    { url: "/faq", changefreq: "monthly", priority: 0.7 },
    { url: "/planner", changefreq: "monthly", priority: 0.6 },
  ];

  // Dynamic city routes untuk programmatic SEO
  const cityRoutes = SEO_CITIES.map((city) => ({
    url: `/lighting/${city.toLowerCase()}`,
    changefreq: "weekly",
    priority: 0.8,
  }));

  // Combine all routes
  const allRoutes = [...staticRoutes, ...cityRoutes];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     ${allRoutes
       .map(({ url, changefreq, priority }) => {
         return `
       <url>
           <loc>${DOMAIN}${url}</loc>
           <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
           <changefreq>${changefreq}</changefreq>
           <priority>${priority}</priority>
       </url>
     `;
       })
       .join("")}
   </urlset>
 `;

  res.setHeader("Content-Type", "text/xml; charset=utf-8");
  res.setHeader("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
};

export default Sitemap;
