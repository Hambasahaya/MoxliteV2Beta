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
import { iProductDetailProps } from "@/components/product/types";
import { ENV } from "@/constant/ENV";

const Summary = dynamic(() => import("@/components/product/Summary"), {
  ssr: false,
});

const Product = ({ content }: iProductDetailProps) => {
  const router = useRouter();
  const { slug } = router.query;

  return (
    <Layout
      metadata={{
        title: `${content.name} - Moxlite`,
        desc:
          content.desc.length > 100
            ? content.desc.substring(0, 100) + "..."
            : content.desc,
        thumbnail: content.thumbnail,
        url: `${ENV.NEXT_PUBLIC_FE_BASE_URL}/product/${content.slug}`,
      }}
    >
      <img src={content.thumbnail} />
      <Summary
        name={content.name}
        desc={content.desc}
        gallery={content.gallery}
        keyFeatures={content.keyFeatures}
        discontinued={content.discontinued}
      />
      <AspectTab options={aspectOptions(slug as string)} />
      <TechSpec items={content.techSpecs} />
      <GoboAndColors imgUrl={content.goboColorsImgUrl} />
      <ArchitecturalDimension imgUrl={content.archDimImgUrl} />
      <Packaging items={content.packaging} />
      <TechDocs items={content.techDocs} />
      <PreviewVideo videoUrl={content.previewVideo} />
    </Layout>
  );
};

export default Product;

export { getServerPropsDetail as getServerSideProps } from "@/components/product/utils/getServerProps";
