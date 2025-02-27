import { ENV } from "@/constant/ENV";
import { iNewsCard } from "@/components/common/NewsCard/types";
import { iGetProjectsRequest, iProjectsDetail } from "../types";
import { ROUTES } from "@/constant/ROUTES";

export const getProjects = async ({
  page,
  pageSize,
}: iGetProjectsRequest): Promise<{
  projects: iNewsCard[];
  pageCount: number;
}> => {
  try {
    const rawRes = await fetch(
      `${
        ENV.NEXT_PUBLIC_API_BASE_URL
      }/api/projects?pagination[pageSize]=${pageSize}&pagination[page]=${
        page ?? 1
      }`
    );

    const result = await rawRes.json();
    const projects: iNewsCard[] =
      result.data.map((e: any) => ({
        url: `${ROUTES.PROJECT.path}/${e?.slug ?? "undefined"}`,
        name: e?.title ?? "",
        thumbnail: e?.main_image?.url ?? "",
        desc: e?.summary ?? "",
        date: e?.publishedAt ?? "",
      })) ?? [];

    const pageCount = result?.meta?.pagination?.pageCount ?? 0;

    return { projects, pageCount };
  } catch (error) {
    throw error;
  }
};

export const getProjectDetail = async (
  slug: string
): Promise<iProjectsDetail> => {
  try {
    const rawRes = await fetch(
      `${ENV.NEXT_PUBLIC_API_BASE_URL}/api/projects/${slug}`
    );

    const result = await rawRes.json();
    const projects: iProjectsDetail = {
      title: result?.data?.title ?? "",
      slug: result?.data?.slug ?? "",
      summary: result?.data?.summry ?? "",
      thumbnail: result?.data?.main_image?.url ?? "",
      gallery: result?.data?.image_gallery?.map((e: any) => e?.url ?? "") ?? [],
      published_at: result?.data?.publishedAt ?? "",
      content: result?.data?.content ?? "",
    };

    return projects;
  } catch (error) {
    throw error;
  }
};
