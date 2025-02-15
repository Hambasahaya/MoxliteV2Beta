import Layout from "@/components/common/Layout";
import AspectTab from "@/components/product/AspectTab";
import GoboAndColors from "@/components/product/GoboAndColors";
import Packaging from "@/components/product/Packaging";
import PreviewVideo from "@/components/product/PreviewVideo";
import TechDocs from "@/components/product/TechDocs";
import TechSpec from "@/components/product/TechSpec";
import dynamic from "next/dynamic";

const Summary = dynamic(() => import("@/components/product/Summary"), {
  ssr: false,
});

const Product = () => {
  return (
    <Layout>
      <Summary />
      <AspectTab />
      <TechSpec />
      <GoboAndColors />
      <Packaging />
      <TechDocs />
      <PreviewVideo />
    </Layout>
  );
};

export default Product;
