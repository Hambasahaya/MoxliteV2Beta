import { Html, Head, Main, NextScript } from "next/document";
import { organizationSchema } from "@/constant/seo.config";

export default function Document() {
  return (
    <Html lang="id">
      <Head>
        <link rel="icon" href="/favicon_new.ico" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32_new.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16_new.png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon_new.png" />
        <link rel="manifest" href="/site.webmanifest" />
        
        {/* Organization Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        
        {/* Google Site Verification */}
        <meta name="google-site-verification" content="J1ptSsXzWwUPHbbVb-fUPAQ8Xwopy4Hev89C0ndfAxU" />
        
        {/* Google Analytics */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-XBRMX19Q9L"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-XBRMX19Q9L');
            `,
          }}
        />
        <script src="https://analytics.ahrefs.com/analytics.js" data-key="VtWljmW0BhHFallVUeDxzA" async></script>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
