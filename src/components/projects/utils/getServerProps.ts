import { GetServerSideProps } from "next";
import { getProjectDetail, getProjects } from "./api";
import { iProjectDetailProps, iProjectsProps } from "../types";

export const getServerSidePropsList: GetServerSideProps<
  iProjectsProps
> = async (context) => {
  try {
    const { page } = context.query;
    const { projects, pageCount } = await getProjects({
      page: page as string,
      pageSize: 10,
    });

    return {
      props: {
        projects,
        pageCount,
      },
    };
  } catch (error) {
    console.error("Error fetching posts:", error);

    return {
      props: {
        projects: [],
        pageCount: 1,
      },
    };
  }
};

export const getServerSidePropsDetail: GetServerSideProps<
  iProjectDetailProps
> = async (context) => {
  const { slug } = context.params as any;

  try {
    const project = await getProjectDetail(slug);

    return {
      props: {
        project,
      },
    };
  } catch (error) {
    console.error("Error fetching posts:", error);

    return { notFound: true };
  }
};
