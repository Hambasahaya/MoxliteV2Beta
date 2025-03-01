import Layout from "@/components/common/Layout";
import StrapiTextRenderer from "@/components/common/StrapiTextRenderer";
import NewsCarousel from "@/components/news/NewsCarousel";
import { iNewsDetailProps } from "@/components/news/types";
import { ENV } from "@/constant/ENV";
import moment from "moment";

const NewsDetail = ({ news }: iNewsDetailProps) => {
  return (
    <Layout
      metadata={{
        title: `${news.title} - Moxlite`,
        desc:
          news.summary.length > 100
            ? news.summary.substring(0, 100) + "..."
            : news.summary,
        thumbnail: news.thumbnail,
        url: `${ENV.NEXT_PUBLIC_FE_BASE_URL}/product/${news.slug}`,
      }}
    >
      <div className="p-[24px] lg:pt-[56px] lg:pb-[80px] lg:px-[120px] w-full flex flex-col items-center">
        <NewsCarousel imgUrls={news.gallery} />
        <div className="w-full lg:max-w-[640px] my-[40px]">
          <p className="mb-[8px]">
            {moment(news.published_at).format("DD MMMM YYYY")}
          </p>
          <h1 className="text-[36px] lg:text-[48px] font-bold leading-[1.2em]">
            {news.title}
          </h1>
        </div>
        <div className="w-full lg:max-w-[640px]">
          <StrapiTextRenderer content={news.content} type="HTML" />
        </div>
      </div>
    </Layout>
  );
};

export default NewsDetail;

export { getServerSidePropsDetail as getServerSideProps } from "@/components/news/utils/getServerProps";
