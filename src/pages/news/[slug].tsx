import { useState, useEffect } from "react";
import Head from "next/head";
import Layout from "@/components/common/Layout";
import TranslatedContent from "@/components/common/TranslatedContent";
import LanguageToggle, { Language } from "@/components/common/LanguageToggle";
import NewsCarousel from "@/components/news/NewsCarousel";
import { iNewsDetailProps } from "@/components/news/types";
import { ENV } from "@/constant/ENV";
import { preloadTranslation } from "@/lib/translationService";
import moment from "moment";
import { useRouter } from "next/router";

const NewsDetail = ({ news }: iNewsDetailProps) => {
  const router = useRouter();
  const [language, setLanguage] = useState<Language>("en");
  const [translatedTitle, setTranslatedTitle] = useState(news.title);

  useEffect(() => {
    const savedLanguage = localStorage.getItem("newsLanguage") as Language | null;
    if (savedLanguage) {
      setLanguage(savedLanguage);
      // Preload translation for better UX
      if (savedLanguage === "id") {
        preloadTranslation(news.title, savedLanguage).then(setTranslatedTitle).catch(() => {});
      }
    }
  }, [news.title]);

  const handleLanguageChange = async (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem("newsLanguage", lang);

    if (lang === "en") {
      setTranslatedTitle(news.title);
    } else {
      // Preload translation
      preloadTranslation(news.title, lang).then(setTranslatedTitle).catch(() => {});
    }
  };

  const currentUrl = `${ENV.NEXT_PUBLIC_FE_BASE_URL}${router.asPath}`;
  const enUrl = `${ENV.NEXT_PUBLIC_FE_BASE_URL}/news/${news.slug}`;
  const idUrl = `${ENV.NEXT_PUBLIC_FE_BASE_URL}/news/${news.slug}?lang=id`;

  return (
    <>
      <Head>
        {/* Language Alternate Links for SEO */}
        <link rel="alternate" hrefLang="en" href={enUrl} />
        <link rel="alternate" hrefLang="id" href={idUrl} />
        <link rel="alternate" hrefLang="x-default" href={enUrl} />
        
        {/* Language Meta Tag */}
        <meta httpEquiv="content-language" content={language} />
        
        {/* Open Graph Tags with Language */}
        <meta property="og:url" content={currentUrl} />
        <meta property="og:type" content="article" />
        <meta property="og:title" content={`${translatedTitle} - Moxlite`} />
        <meta property="og:description" content={news.summary.substring(0, 160)} />
        <meta property="og:image" content={news.thumbnail} />
        <meta property="og:locale" content={language === "id" ? "id_ID" : "en_US"} />
        
        {/* Structured Data for Article with Language */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "NewsArticle",
              "headline": translatedTitle,
              "description": news.summary,
              "image": news.thumbnail,
              "datePublished": news.published_at,
              "inLanguage": language === "id" ? "id" : "en",
              "author": {
                "@type": "Organization",
                "name": "Moxlite"
              },
              "publisher": {
                "@type": "Organization",
                "name": "Moxlite",
                "logo": {
                  "@type": "ImageObject",
                  "url": `${ENV.NEXT_PUBLIC_FE_BASE_URL}/Moxlite_Logo.png`
                }
              }
            })
          }}
        />
      </Head>
      <Layout
        metadata={{
          title: `${news.title} - Moxlite`,
          desc:
            news.summary.length > 100
              ? news.summary.substring(0, 100) + "..."
              : news.summary,
          thumbnail: news.thumbnail,
          url: enUrl,
        }}
      >
        <>
          <LanguageToggle onLanguageChange={handleLanguageChange} currentLanguage={language} position="floating" />
          <div className="w-full flex justify-center">
            <div className="relative p-[24px] md:p-0 lg:pt-[56px] lg:pb-[80px] w-full md:w-[80%] lg:w-[60%] flex flex-col items-center">
              <div className="relative w-full">
                <NewsCarousel imgUrls={news.gallery} />
              </div>
            
              <div className="w-full my-[40px]">
                <p className="mb-[8px]">
                  {moment(news.published_at).format("DD MMMM YYYY")}
                </p>
                <h1 className="text-[36px] lg:text-[48px] font-bold leading-[1.2em]">
                  {translatedTitle}
                </h1>
              </div>
              <div className="w-full">
                <TranslatedContent content={news.content} language={language} type="HTML" />
              </div>
            </div>
          </div>
        </>
      </Layout>
    </>
  );
};

export default NewsDetail;

export { getServerSidePropsDetail as getServerSideProps } from "@/components/news/utils/getServerProps";
