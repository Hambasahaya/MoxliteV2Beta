import { GetServerSideProps } from "next";
import { getNewsDetail, getNews } from "./api";
import { iNewsDetailProps, iNewsProps } from "../types";

export const getServerSidePropsList: GetServerSideProps<iNewsProps> = async (
  context
) => {
  try {
    const { page } = context.query;
    const { news, pageCount } = await getNews({
      page: page as string,
      pageSize: 10,
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
        pageCount: 0,
      },
    };
  }
};

export const getServerSidePropsDetail: GetServerSideProps<
  iNewsDetailProps
> = async (context) => {
  const { slug } = context.params as any;
  try {
    const news = await getNewsDetail(slug);

    return {
      props: {
        news,
      },
    };
  } catch (error) {
    console.error("Error fetching posts:", error);

    return { notFound: true };
  }
};
