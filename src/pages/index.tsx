import { useEffect } from "react";
import LatestProduct from "@/components/home/LatestProduct";
import MoxliteOnDuty from "@/components/home/MoxliteOnDuty";
import News from "@/components/home/News";
import VisualImgs from "@/components/home/VisualImgs";
import Layout from "@/components/common/Layout";
import MainBanner from "@/components/home/MainBanner";
import { iHomeProps } from "@/components/home/types";

export default function Home({ posts }: iHomeProps) {
  useEffect(() => {
    console.log("Fetched Posts:", posts);
  }, [posts]);

  return (
    <Layout>
      <MainBanner />
      <LatestProduct />
      <VisualImgs />
      <News />
      <MoxliteOnDuty />
    </Layout>
  );
}

export { getStaticProps } from "@/components/home/utils/getStaticProps";
