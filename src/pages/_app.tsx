import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Inter, Saira } from "next/font/google";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const saira = Saira({ subsets: ["latin"], variable: "--font-saira" });

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className={`${inter.variable} ${saira.variable}`}>
      <Component {...pageProps} />
    </div>
  );
}
