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
        desc: "Adaptive Lighting Solutions -For All Stage Sizes Learn more Reimagining Performance Spaces with Moxlite From concert to intimate clubs, every stage deserves to shine. Moxlite's versatile lighting solutions are designed to adapt and elevate, creating the perfect ambiance for any venue. With Moxlite, every performance is a masterpiece. Explore our products Nightclub/Bar Touring/Concert Houses of ...",
        thumbnail: `${ENV.NEXT_PUBLIC_FE_BASE_URL}/main_thumbnail.jpg`,
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
