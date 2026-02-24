import { GetServerSideProps } from "next";

function Sitemap() {}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  // Base URL without www
  const baseUrl = "https://moxlite.com";

  // Define all static routes
  const staticRoutes = [
    { url: "", changefreq: "weekly", priority: 1.0 },
    { url: "/product", changefreq: "weekly", priority: 0.8 },
    { url: "/news", changefreq: "daily", priority: 0.8 },
    { url: "/projects", changefreq: "monthly", priority: 0.7 },
    { url: "/about", changefreq: "monthly", priority: 0.7 },
    { url: "/contact", changefreq: "monthly", priority: 0.7 },
    { url: "/faq", changefreq: "monthly", priority: 0.6 },
    { url: "/sales", changefreq: "monthly", priority: 0.6 },
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     ${staticRoutes
       .map(({ url, changefreq, priority }) => {
         return `
       <url>
           <loc>${baseUrl}${url}</loc>
           <lastmod>${new Date().toISOString()}</lastmod>
           <changefreq>${changefreq}</changefreq>
           <priority>${priority}</priority>
       </url>
     `;
       })
       .join("")}
   </urlset>
 `;

  res.setHeader("Content-Type", "text/xml");
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
};

export default Sitemap;
