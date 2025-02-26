import { GetServerSideProps } from "next";
import { getNews } from "./api";
import { iNewsProps } from "../types";

export const getServerSidePropsList: GetServerSideProps<iNewsProps> = async (
  context
) => {
  try {
    const { page } = context.query;
    const { news, pageCount } = await getNews({
      page: page as string,
      pageSize: 2,
    });

    return {
      props: {
        news,
        pageCount,
      },
    };
  } catch (error) {
    console.error("Error fetching posts:", error);

    return {
      props: {
        news: [],
        pageCount: 1,
      },
    };
  }
};
