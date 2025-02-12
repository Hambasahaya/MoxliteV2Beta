import LatestProduct from "@/components/home/LatestProduct";
import MainBanner from "@/components/home/MainBanner";
import MoxliteOnDuty from "@/components/home/MoxliteOnDuty";
import News from "@/components/home/News";
import VisualImgs from "@/components/home/VisualImgs";
import Layout from "@/components/layout";

export default function Home() {
  return (
    <>
      <Layout>
        <MainBanner />
        <LatestProduct />
        <VisualImgs />
        <News />
        <MoxliteOnDuty />
      </Layout>
    </>
  );
}
