import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Script from "next/script";
import { fireGApageview } from "@/lib/gtag";
import { ENV } from "@/constant/ENV";

export default function GoogleAnalytics() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname) {
      fireGApageview(pathname);
    }
  }, [pathname]);

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${ENV.NEXT_PUBLIC_GA_ID}`}
      />
      <Script
        id="gtag-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${ENV.NEXT_PUBLIC_GA_ID}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
      <Script
        id="ahrefs-analytics-gtm"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            var ahrefs_analytics_script = document.createElement('script');
            ahrefs_analytics_script.async = true;
            ahrefs_analytics_script.src = 'https://analytics.ahrefs.com/analytics.js';
            ahrefs_analytics_script.setAttribute('data-key', 'VtWljmW0BhHFallVUeDxzA');
            document.getElementsByTagName('head')[0].appendChild(ahrefs_analytics_script);
          `,
        }}
      />
    </>
  );
}
