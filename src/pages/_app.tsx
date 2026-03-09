import "@/styles/globals.css";
import "@/styles/strapi_styles.css";
import type { AppProps } from "next/app";
import Script from "next/script";
import { Inter, Saira } from "next/font/google";
import dynamic from "next/dynamic";
import { useEffect } from "react";
import { ReCaptchaProvider } from "next-recaptcha-v3";
import { ENV } from "@/constant/ENV";
import { SnackbarProvider } from "notistack";
import { initializeCriticalResourceHints } from "@/lib/resourceHints";
import { initializePerformanceMonitoring } from "@/lib/performanceMonitoring";

// initialize i18next (detection + react bindings)
import "@/i18n";

const ProgressBar: any = dynamic(
  () => import("@/components/common/ProgressBar"),
  {
    ssr: false,
  }
);

const FloatingChatButton: any = dynamic(
  () => import("@/components/chatbot/FloatingChatButton"),
  {
    ssr: false,
    loading: () => null,
  }
);


const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const saira = Saira({ subsets: ["latin"], variable: "--font-saira" });

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    // Initialize optimization systems
    try {
      initializeCriticalResourceHints();
      initializePerformanceMonitoring();
    } catch (error) {
      console.error("Failed to initialize optimizations:", error);
    }
  }, []);

  return (
    <>
      <Script
        id="optimize-performance"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            if ('requestIdleCallback' in window) {
              requestIdleCallback(function() {
                // Load non-critical resources in idle time
              });
            } else {
              setTimeout(function() {
                // Fallback for browsers that don't support requestIdleCallback
              }, 2);
            }
          `,
        }}
      />
      <SnackbarProvider autoHideDuration={3000} anchorOrigin={{horizontal:"center", vertical:"top"}}>
        <ReCaptchaProvider reCaptchaKey={ENV.NEXT_PUBLIC_RECAPTCHA_KEY}>
          <div className={`${inter.variable} ${saira.variable}`}>
            <Component {...pageProps} />
            <ProgressBar />
            <FloatingChatButton />
          </div>
        </ReCaptchaProvider>
      </SnackbarProvider>
    </>
  );
}
