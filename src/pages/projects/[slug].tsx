import Layout from "@/components/common/Layout";
import StrapiTextRenderer from "@/components/common/StrapiTextRenderer";
import NewsCarousel from "@/components/news/NewsCarousel";
import { iProjectDetailProps } from "@/components/projects/types";
import moment from "moment";

const ProjectDetail = ({ project }: iProjectDetailProps) => {
  return (
    <Layout>
      <div className="p-[24px] lg:pt-[56px] lg:pb-[80px] lg:px-[120px] w-full flex flex-col items-center">
        <NewsCarousel imgUrls={project.gallery} />
        <div className="w-full lg:max-w-[640px] my-[40px]">
          <p className="mb-[8px]">
            {moment(project.published_at).format("DD MMMM YYYY")}
          </p>
          <h1 className="text-[36px] lg:text-[48px] font-bold leading-[1.2em]">
            {project.title}
          </h1>
        </div>
        <div className="w-full lg:max-w-[640px]">
          <StrapiTextRenderer content={project.content} type="HTML" />
        </div>
      </div>
    </Layout>
  );
};

export default ProjectDetail;

export { getServerSidePropsDetail as getServerSideProps } from "@/components/projects/utils/getServerProps";
