import Accordion from "@/components/common/Accordion";
import Layout from "@/components/common/Layout";
import { iFaqProps } from "@/components/faq/types";

const FAQ = ({ faqs }: iFaqProps) => {
  return (
    <Layout>
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
