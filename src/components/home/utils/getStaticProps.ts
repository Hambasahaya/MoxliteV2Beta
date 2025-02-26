import { GetStaticProps } from "next";
import { iHomeProps } from "../types";
import { getLatestNews, getLatestproducts, getLatestProjects } from "./api";

export const getStaticProps: GetStaticProps<iHomeProps> = async () => {
  try {
    const latestNews = await getLatestNews();
    const latestProducts = await getLatestproducts();
    const latestProjects = await getLatestProjects();

    return {
      props: {
        latestNews,
        latestProducts,
        latestProjects,
      },
    };
  } catch (error) {
    console.error("Error fetching posts:", error);

    return {
      props: {
        latestNews: [],
        latestProducts: [],
        latestProjects: [],
      },
    };
  }
};
