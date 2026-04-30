import "@/styles/globals.css";
import "@/styles/strapi_styles.css";
import type { AppProps } from "next/app";
import Script from "next/script";
import { Inter, Saira } from "next/font/google";
import dynamic from "next/dynamic";
import { useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { ReCaptchaProvider } from "next-recaptcha-v3";
import { ENV } from "@/constant/ENV";
import { SnackbarProvider } from "notistack";
import { initializeCriticalResourceHints } from "@/lib/resourceHints";
import { initializePerformanceMonitoring } from "@/lib/performanceMonitoring";
import { AuthProvider, useAuth } from "@/lib/authContext";
import { activityTracker } from "@/lib/activityTracker";

// initialize i18next (detection + react bindings)
import "@/i18n";

const EXCLUDED_ACTIVITY_TRACKING_PATHS = new Set(["/admin/activity-history"]);

const getPathnameFromRoute = (url: string) => {
  try {
    return new URL(url, "http://localhost").pathname;
  } catch {
    return url.split("?")[0].split("#")[0];
  }
};

const ProgressBar = dynamic(
  () => import("@/components/common/ProgressBar"),
  {
    ssr: false,
  }
);

const FloatingChatButton = dynamic(
  () => import("@/components/chatbot/FloatingChatButton"),
  {
    ssr: false,
    loading: () => null,
  }
);


const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const saira = Saira({ subsets: ["latin"], variable: "--font-saira" });

const GlobalActivityTracker = () => {
  const router = useRouter();
  const { user, loading } = useAuth();
  const trackedRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (loading || !router.isReady) {
      return;
    }

    const trackPage = (url: string) => {
      if (EXCLUDED_ACTIVITY_TRACKING_PATHS.has(getPathnameFromRoute(url))) {
        return;
      }

      const key = `${user?.uid || "anonymous"}:${url}`;

      if (trackedRef.current.has(key)) {
        return;
      }

      trackedRef.current.add(key);
      activityTracker.trackPageAccess(user, url, {
        title: typeof document !== "undefined" ? document.title : undefined,
        referrer: typeof document !== "undefined" ? document.referrer : undefined,
      });
    };

    trackPage(router.asPath);
    router.events.on("routeChangeComplete", trackPage);

    return () => {
      router.events.off("routeChangeComplete", trackPage);
    };
  }, [loading, router, router.asPath, router.isReady, user]);

  return null;
};

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
          <AuthProvider>
            <div className={`${inter.variable} ${saira.variable}`}>
              <GlobalActivityTracker />
              <Component {...pageProps} />
              <ProgressBar />
              <FloatingChatButton />
            </div>
          </AuthProvider>
        </ReCaptchaProvider>
      </SnackbarProvider>
    </>
  );
}
