import Layout from "@/components/common/Layout";
import Pagination from "@/components/common/Pagination";
import Highlighted from "@/components/news/Highlighted";
import NewsCard from "@/components/common/NewsCard";
import { iProjectsProps } from "@/components/projects/types";
import { useRouter } from "next/router";
import { ENV } from "@/constant/ENV";

const ProjectList = ({ projects, pageCount }: iProjectsProps) => {
  const router = useRouter();
  const highlightedProject = projects[0];

  const movePage = (page: number) => {
    router.push(
      {
        pathname: router.pathname,
        query: { page },
      },
      undefined,
      { shallow: false }
    );
  };

  return (
    <Layout
      metadata={{
        title: "Projects - Moxlite",
        desc: "Discover Moxlite's innovative projects and see how we bring ideas to life",
        thumbnail: `${ENV.NEXT_PUBLIC_FE_BASE_URL}/Moxlite_Logo.png`,
        url: `${ENV.NEXT_PUBLIC_FE_BASE_URL}/projects`,
      }}
    >
      <div className="w-full p-[24px] lg:px-[120px] lg:py-[40px] bg-[url(/image/project_list_banner.png)] bg-cover">
        <h1 className="text-center text-white font-bold text-[36px] lg:text-[48px]">
          Explore Our Latest Projects
        </h1>
      </div>

      {highlightedProject && (
        <>
          <Highlighted
            {...{
              ...highlightedProject,
              GAevent: {
                action: "project_headline",
                attribute: {
                  project_title: highlightedProject?.name,
                },
              },
            }}
          />
          <div className="border-t border-t-[#CBD5E1] mx-[24px] lg:mx-[120px]" />
        </>
      )}

      <div className="pt-[40px] pb-[40px] px-[24px] lg:px-[120px] lg:pt-[80px] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects?.slice(1)?.map((e, i) => (
          <NewsCard
            key={i}
            {...{
              ...e,
              GAevent: {
                action: "project_other_projects",
                attribute: {
                  project_title: e.name,
                },
              },
            }}
          />
        )) ?? null}
      </div>

      {pageCount > 0 && (
        <div className="w-full flex justify-end px-[24px] pb-[24px] lg:pb-[80px] lg:px-[120px]">
          <Pagination pageCount={pageCount} onPageChange={movePage} />
        </div>
      )}
    </Layout>
  );
};

export default ProjectList;

export { getServerSidePropsList as getServerSideProps } from "@/components/projects/utils/getServerProps";
