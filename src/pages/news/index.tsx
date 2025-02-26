import { useState } from "react";
import Layout from "@/components/common/Layout";
import Pagination from "@/components/common/Pagination";
import Highlighted from "@/components/news/Highlighted";
import NewsCard from "@/components/common/NewsCard";
import { iNewsProps } from "@/components/news/types";
import { useRouter } from "next/router";

const News = ({ news, pageCount }: iNewsProps) => {
  const router = useRouter();
  const highlightedNews = news[0];

  const movePage = (page: number) => {
    router.push(
      {
        pathname: router.pathname,
        query: { page },
      },
      undefined,
      { shallow: false }
    );
  };

  return (
    <Layout>
      <div className="w-full p-[24px] lg:px-[120px] lg:py-[40px] bg-[url(/image/news_list_banner.png)] bg-cover">
        <h1 className="text-center text-white font-bold text-[36px] lg:text-[48px]">
          Explore Our Latest News
        </h1>
      </div>

      <Highlighted {...highlightedNews} />
      <div className="border-t border-t-[#CBD5E1] mx-[24px] lg:mx-[120px]" />

      <div className="pt-[40px] pb-[40px] px-[24px] lg:px-[120px] lg:pt-[80px] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {news?.slice(1)?.map((e, i) => <NewsCard key={i} {...e} />) ?? null}
      </div>

      {news.length > 1 && (
        <div className="w-full flex justify-end px-[24px] pb-[24px] lg:pb-[80px] lg:px-[120px]">
          <Pagination pageCount={pageCount} onPageChange={movePage} />
        </div>
      )}
    </Layout>
  );
};

export default News;

export { getServerSidePropsList as getServerSideProps } from "@/components/news/utils/getServerProps";
