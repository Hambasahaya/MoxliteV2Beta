import AboutArticle from "@/components/about/AboutArticle";
import Banner from "@/components/about/Banner";
import CountingNumber from "@/components/about/CountingNumber";
import DoBest from "@/components/about/DoBest";
import ProductDistribution from "@/components/about/ProductDistribution";
import { iAboutProps } from "@/components/about/types";
import Layout from "@/components/common/Layout";
import { ENV } from "@/constant/ENV";

const About = ({ data }: iAboutProps) => {
  return (
    <Layout
      metadata={{
        title: "About Us - Moxlite",
        desc: "Discover Moxlite 0 + Installed Fixtures 0 + Cities in Indonesia 0 + Pleased Client Discover Our Journey, Our Values, and Our Commitment to You Illuminating Spaces, Amplifying Experiences Moxlite began with a simple vision: to create high-performance stage lighting solutions that transform environments and create unforgettable experiences. From our humble beginnings in Indonesia, we've ...",
        thumbnail: `${ENV.NEXT_PUBLIC_FE_BASE_URL}/Moxlite_Logo.png`,
        url: `${ENV.NEXT_PUBLIC_FE_BASE_URL}/about`,
      }}
    >
      <Banner customers={data?.customers ?? []} />
      <AboutArticle data={data} />
      <CountingNumber data={data} />
      <div
        className="grid grid-cols-2 lg:grid-cols-4 gap-[50px] lg:gap-[80px] w-full px-[24px] py-[40px] lg:pt-[80px] lg:pb-[120px] lg:px-[120px]"
        id="client"
      >
        {data?.customers?.map((e, i) => (
          <div key={i} className="flex justify-center">
            <img
              src={e.imgUrl}
              alt={e.name}
              className="h-[120px] object-contain"
            />
          </div>
        ))}
      </div>
      <DoBest data={data} />
      <ProductDistribution />
    </Layout>
  );
};

export default About;

export { getServerSideProps } from "@/components/about/utils/getServerProps";
