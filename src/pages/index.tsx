import LatestProduct from "@/components/home/LatestProduct";
import MoxliteOnDuty from "@/components/home/MoxliteOnDuty";
import News from "@/components/home/News";
import VisualImgs from "@/components/home/VisualImgs";
import Layout from "@/components/common/Layout";
import MainBanner from "@/components/home/MainBanner";
import { iHomeProps } from "@/components/home/types";

export default function Home({
  latestNews,
  latestProducts,
  latestProjects,
}: iHomeProps) {
  return (
    <Layout>
      <MainBanner />
      <LatestProduct contents={latestProducts} />
      <VisualImgs />
      <News contents={latestNews} />
      <MoxliteOnDuty contents={latestProjects} />
    </Layout>
  );
}

export { getServerSideProps } from "@/components/home/utils/getServerProps";
