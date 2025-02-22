import AboutArticle from "@/components/about/AboutArticle";
import Banner from "@/components/about/Banner";
import CountingNumber from "@/components/about/CountingNumber";
import DoBest from "@/components/about/DoBest";
import ProductDistribution from "@/components/about/ProductDistribution";
import Layout from "@/components/common/Layout";

const About = () => {
  return (
    <Layout>
      <Banner />
      <AboutArticle />
      <CountingNumber />
      <img
        id="client"
        src="/image/patners-grid.png"
        className="w-full px-[24px] py-[40px] lg:pt-[80px] lg:pb-[120px] lg:px-[120px]"
      />
      <DoBest />
      <ProductDistribution />
    </Layout>
  );
};

export default About;
