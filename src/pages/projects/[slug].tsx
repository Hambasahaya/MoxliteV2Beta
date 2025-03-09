import Layout from "@/components/common/Layout";
import StrapiTextRenderer from "@/components/common/StrapiTextRenderer";
import NewsCarousel from "@/components/news/NewsCarousel";
import { iProjectDetailProps } from "@/components/projects/types";
import { ENV } from "@/constant/ENV";
import moment from "moment";

const ProjectDetail = ({ project }: iProjectDetailProps) => {
  return (
    <Layout
      metadata={{
        title: `${project.title} - Moxlite`,
        desc:
          project.summary.length > 100
            ? project.summary.substring(0, 100) + "..."
            : project.summary,
        thumbnail: project.thumbnail,
        url: `${ENV.NEXT_PUBLIC_FE_BASE_URL}/projects/${project.slug}`,
      }}
    >
      <div className="w-full flex justify-center">
        <div className="p-[24px] md:p-0 lg:pt-[56px] lg:pb-[80px] w-full md:w-[80%] lg:w-[60%] flex flex-col items-center">
          <NewsCarousel imgUrls={project.gallery} />
          <div className="w-full my-[40px]">
            <p className="mb-[8px]">
              {moment(project.published_at).format("DD MMMM YYYY")}
            </p>
            <h1 className="text-[36px] lg:text-[48px] font-bold leading-[1.2em]">
              {project.title}
            </h1>
          </div>
          <div className="w-full">
            <StrapiTextRenderer content={project.content} type="HTML" />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProjectDetail;

export { getServerSidePropsDetail as getServerSideProps } from "@/components/projects/utils/getServerProps";
