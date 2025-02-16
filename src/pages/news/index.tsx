import { useState } from "react";
import Layout from "@/components/common/Layout";
import Pagination from "@/components/common/Pagination";
import Highlighted from "@/components/news/Highlighted";
import NewsCard from "@/components/common/NewsCard";

const News = () => {
  const [currPage, setCurrPage] = useState(1);

  return (
    <Layout>
      <div className="w-full p-[24px] lg:px-[120px] lg:py-[40px] bg-[url(/image/news_list_banner.png)] bg-cover">
        <h1 className="text-center text-white font-bold text-[36px] lg:text-[48px]">
          Explore Our Latest News
        </h1>
      </div>

      <Highlighted />
      <div className="border-t border-t-[#CBD5E1] mx-[24px] lg:mx-[120px]" />

      <div className="pt-[40px] pb-[40px] px-[24px] lg:px-[120px] lg:pt-[80px] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <NewsCard />
        <NewsCard />
        <NewsCard />
        <NewsCard />
        <NewsCard />
        <NewsCard />
      </div>

      <div className="w-full flex justify-end px-[24px] pb-[24px] lg:pb-[80px] lg:px-[120px]">
        <Pagination pageCount={10} onPageChange={setCurrPage} />
      </div>
    </Layout>
  );
};

export default News;
