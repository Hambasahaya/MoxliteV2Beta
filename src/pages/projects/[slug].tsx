import { useState, useEffect } from "react";
import Head from "next/head";
import Layout from "@/components/common/Layout";
import TranslatedContent from "@/components/common/TranslatedContent";
import LanguageToggle, { Language } from "@/components/common/LanguageToggle";
import NewsCarousel from "@/components/news/NewsCarousel";
import { iProjectDetailProps } from "@/components/projects/types";
import { ENV } from "@/constant/ENV";
import { preloadTranslation } from "@/lib/translationService";
import moment from "moment";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";

const ProjectDetail = ({ project }: iProjectDetailProps) => {
  const router = useRouter();
  const { i18n } = useTranslation();
  const language = i18n.language as Language;
  const [translatedTitle, setTranslatedTitle] = useState(project.title);

  useEffect(() => {
    if (language === "id") {
      preloadTranslation(project.title, "id").then(setTranslatedTitle).catch(() => {});
    } else {
      setTranslatedTitle(project.title);
    }
  }, [project.title, language]);

  const currentUrl = `${ENV.NEXT_PUBLIC_FE_BASE_URL}${router.asPath}`;
  const enUrl = `${ENV.NEXT_PUBLIC_FE_BASE_URL}/projects/${project.slug}`;
  const idUrl = `${ENV.NEXT_PUBLIC_FE_BASE_URL}/projects/${project.slug}?lang=id`;

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
        <meta property="og:description" content={project.summary.substring(0, 160)} />
        <meta property="og:image" content={project.thumbnail} />
        <meta property="og:locale" content={language === "id" ? "id_ID" : "en_US"} />
        
        {/* Structured Data for CreativeWork with Language */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "CreativeWork",
              "headline": translatedTitle,
              "description": project.summary,
              "image": project.thumbnail,
              "datePublished": project.published_at,
              "inLanguage": language === "id" ? "id" : "en",
              "creator": {
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
          title: `${project.title} - Moxlite`,
          desc:
            project.summary.length > 100
              ? project.summary.substring(0, 100) + "..."
              : project.summary,
          thumbnail: project.thumbnail,
          url: enUrl,
        }}
      >
        <>
          <LanguageToggle position="floating" />
          <div className="w-full flex justify-center">
            <div className="relative p-[24px] md:p-0 lg:pt-[56px] lg:pb-[80px] w-full md:w-[80%] lg:w-[60%] flex flex-col items-center">
              <div className="relative w-full">
                <NewsCarousel imgUrls={project.gallery} />
              </div>
            
              <div className="w-full my-[40px]">
                <p className="mb-[8px]">
                  {moment(project.published_at).format("DD MMMM YYYY")}
                </p>
                <h1 className="text-[36px] lg:text-[48px] font-bold leading-[1.2em]">
                  {translatedTitle}
                </h1>
              </div>
              <div className="w-full">
                <TranslatedContent content={project.content} type="HTML" />
              </div>
            </div>
          </div>
        </>
      </Layout>
    </>
  );
};

export default ProjectDetail;

export { getServerSidePropsDetail as getServerSideProps } from "@/components/projects/utils/getServerProps";
