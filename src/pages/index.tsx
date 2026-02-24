import LatestProduct from "@/components/home/LatestProduct";
import MoxliteOnDuty from "@/components/home/MoxliteOnDuty";
import News from "@/components/home/News";
import VisualImgs from "@/components/home/VisualImgs";
import Layout from "@/components/common/Layout";
import MainBanner from "@/components/home/MainBanner";
import { iHomeProps } from "@/components/home/types";
import { ENV } from "@/constant/ENV";

export default function Home({
  latestNews,
  latestProducts,
  latestProjects,
}: iHomeProps) {
  return (
    <Layout
      metadata={{
        title: "Home - Moxlite",
        desc: "Professional stage lighting solutions for all venues. From concerts to clubs, adaptive lighting transforms any performance space into a masterpiece.",
        thumbnail: `${ENV.NEXT_PUBLIC_FE_BASE_URL}/Moxlite_Logo.png`,
        url: `${ENV.NEXT_PUBLIC_FE_BASE_URL}`,
      }}
    >
      <MainBanner />
      <LatestProduct contents={latestProducts} />
      <VisualImgs />
      <MoxliteOnDuty contents={latestProjects} />
      <News contents={latestNews} />
    </Layout>
  );
}

export { getServerSideProps } from "@/components/home/utils/getServerProps";
