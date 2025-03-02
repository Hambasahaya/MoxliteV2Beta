import Accordion from "@/components/common/Accordion";
import Layout from "@/components/common/Layout";
import { iFaqProps } from "@/components/faq/types";
import { ENV } from "@/constant/ENV";

const FAQ = ({ faqs }: iFaqProps) => {
  return (
    <Layout
      metadata={{
        title: "FAQ - Moxlite",
        desc: "Find answers to common questions about Moxlite's products",
        thumbnail: `${ENV.NEXT_PUBLIC_FE_BASE_URL}/main_thumbnail.jpg`,
        url: `${ENV.NEXT_PUBLIC_FE_BASE_URL}/news`,
      }}
    >
      <div className="w-full p-[24px] lg:px-[120px] lg:py-[40px] bg-[url(/image/faq_list_banner.png)] bg-cover">
        <h1 className="text-center text-white font-bold text-[36px] lg:text-[48px]">
          Frequently Asked Questions (FAQ)
        </h1>
      </div>

      <div className="p-[24px] lg:px-[120px] lg:py-[80px] grid grid-cols-1 lg:grid-cols-2 gap-5">
        {faqs.map((item) => (
          <Accordion
            key={item.documentId}
            title={item.question}
            content={item.answer}
          />
        ))}
      </div>
    </Layout>
  );
};

export default FAQ;

export { getServerSideProps } from "@/components/faq/utils/getServerProps";
