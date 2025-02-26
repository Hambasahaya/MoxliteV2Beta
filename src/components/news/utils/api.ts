import { ENV } from "@/constant/ENV";
import { iNewsCard } from "@/components/common/NewsCard/types";
import { iGetNewsRequest } from "../types";

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
      slug: e?.slug ?? "",
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
