import "@/styles/globals.css";
import "@/styles/strapi_styles.css";
import type { AppProps } from "next/app";
import { Inter, Saira } from "next/font/google";
import dynamic from "next/dynamic";
import { ReCaptchaProvider } from "next-recaptcha-v3";
import { ENV } from "@/constant/ENV";

const ProgressBar: any = dynamic(
  () => import("@/components/common/ProgressBar"),
  {
    ssr: false,
  }
);

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const saira = Saira({ subsets: ["latin"], variable: "--font-saira" });

export default function App({ Component, pageProps }: AppProps) {
  return (
  <ReCaptchaProvider reCaptchaKey={ENV.NEXT_PUBLIC_RECAPTCHA_KEY}>
    <div className={`${inter.variable} ${saira.variable}`}>
        
      <Component {...pageProps} />
      <ProgressBar />
    </div>
    </ReCaptchaProvider>
  );
}
