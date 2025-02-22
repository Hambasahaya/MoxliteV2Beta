import Layout from "@/components/common/Layout";
import AspectTab from "@/components/common/AspectTab";
import GoboAndColors from "@/components/product/GoboAndColors";
import ArchitecturalDimension from "@/components/product/ArchitecturalDimension";
import Packaging from "@/components/product/Packaging";
import PreviewVideo from "@/components/product/PreviewVideo";
import TechDocs from "@/components/product/TechDocs";
import TechSpec from "@/components/product/TechSpec";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { aspectOptions } from "@/components/product/schema";

const Summary = dynamic(() => import("@/components/product/Summary"), {
  ssr: false,
});

const Product = () => {
  const router = useRouter();
  const { slug } = router.query;

  return (
    <Layout>
      <Summary />
      <AspectTab options={aspectOptions(slug as string)} />
      <TechSpec />
      <GoboAndColors />
      <ArchitecturalDimension />
      <Packaging />
      <TechDocs />
      <PreviewVideo />
    </Layout>
  );
};

export default Product;
