import { ENV } from "@/constant/ENV";
import { iNewsCard } from "@/components/common/NewsCard/types";
import { iGetNewsRequest, iNewsDetail } from "../types";
import { ROUTES } from "@/constant/ROUTES";

export const getNews = async ({
  page,
  pageSize,
}: iGetNewsRequest): Promise<{ news: iNewsCard[]; pageCount: number }> => {
  try {
    const rawRes = await fetch(
      `${
        ENV.NEXT_PUBLIC_API_BASE_URL
      }/api/news?pagination[pageSize]=${pageSize}&pagination[page]=${page ?? 1}`
    );

    const result = await rawRes.json();
    const news: iNewsCard[] = result.data.map((e: any) => ({
      url: `${ROUTES.NEWS.path}/${e?.slug ?? "undefined"}`,
      name: e?.title ?? "",
      thumbnail: e?.main_image?.url ?? "",
      desc: e?.summary ?? "",
      date: e?.publishedAt ?? "",
    }));

    const pageCount = result?.meta?.pagination?.pageCount ?? 0;

    return { news, pageCount };
  } catch (error) {
    throw error;
  }
};

export const getNewsDetail = async (slug: string): Promise<iNewsDetail> => {
  try {
    const rawRes = await fetch(
      `${ENV.NEXT_PUBLIC_API_BASE_URL}/api/news/${slug}`
    );

    const result = await rawRes.json();
    const news: iNewsDetail = {
      title: result?.data?.title ?? "",
      slug: result?.data?.slug ?? "",
      summary: result?.data?.summry ?? "",
      thumbnail: result?.data?.main_image?.formats?.thumbnail?.url ?? "",
      gallery: result?.data?.image_gallery?.map((e: any) => e?.url ?? "") ?? [],
      published_at: result?.data?.publishedAt ?? "",
      content: result?.data?.content ?? "",
    };

    return news;
  } catch (error) {
    throw error;
  }
};
