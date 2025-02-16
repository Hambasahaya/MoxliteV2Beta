import Accordion from "@/components/common/Accordion";
import Layout from "@/components/common/Layout";

const FAQ = () => {
  return (
    <Layout>
      <div className="w-full p-[24px] lg:px-[120px] lg:py-[40px] bg-[url(/image/faq_list_banner.png)] bg-cover">
        <h1 className="text-center text-white font-bold text-[36px] lg:text-[48px]">
          Frequently Asked Questions (FAQ)
        </h1>
      </div>

      <div className="p-[24px] lg:px-[120px] lg:py-[80px] grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Accordion
          title="How do I install my new Moxlite equipment?"
          content="Our products come with a detailed installation guide. For additional assistance, you can reach out to our support team."
        />
        <Accordion
          title="How do I install my new Moxlite equipment?"
          content="Our products come with a detailed installation guide. For additional assistance, you can reach out to our support team."
        />
        <Accordion
          title="How do I install my new Moxlite equipment?"
          content="Our products come with a detailed installation guide. For additional assistance, you can reach out to our support team."
        />
        <Accordion
          title="How do I install my new Moxlite equipment?"
          content="Our products come with a detailed installation guide. For additional assistance, you can reach out to our support team."
        />
        <Accordion
          title="How do I install my new Moxlite equipment?"
          content="Our products come with a detailed installation guide. For additional assistance, you can reach out to our support team."
        />
      </div>
    </Layout>
  );
};

export default FAQ;
