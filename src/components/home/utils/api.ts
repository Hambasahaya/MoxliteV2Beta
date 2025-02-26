import { ENV } from "@/constant/ENV";
import { iLatestNews, iLatestProduct, iLatestProject } from "../types";

export const getLatestproducts = async (): Promise<iLatestProduct[]> => {
  try {
    const rawRes = await fetch(
      `${ENV.NEXT_PUBLIC_API_BASE_URL}/api/products?sort=name:desc&pagination[pageSize]=3`
    );
    const result = await rawRes.json();
    const products: iLatestProduct[] = result.data.map((e: any) => ({
      slug: e.slug,
      name: e.name,
      thumbnail: e.main_image.url,
      category: e.product_category.name,
      discontinue: e?.discontinued ?? false,
    }));

    return products;
  } catch (error) {
    throw error;
  }
};

export const getLatestNews = async (): Promise<iLatestNews[]> => {
  try {
    const rawRes = await fetch(
      `${ENV.NEXT_PUBLIC_API_BASE_URL}/api/news?sort=publishedAt:desc&pagination[pageSize]=3`
    );
    const result = await rawRes.json();
    const news: iLatestNews[] = result.data.map((e: any) => ({
      slug: e.slug,
      name: e.title,
      thumbnail: e.main_image.url,
      desc: e.summary,
      date: e.publishedAt,
    }));

    return news;
  } catch (error) {
    throw error;
  }
};

export const getLatestProjects = async (): Promise<iLatestProject[]> => {
  try {
    const rawRes = await fetch(
      `${ENV.NEXT_PUBLIC_API_BASE_URL}/api/projects?sort=publishedAt:desc&pagination[pageSize]=3`
    );
    const result = await rawRes.json();
    const projects: iLatestProject[] = result.data.map((e: any) => ({
      slug: e.slug,
      name: e.title,
      thumbnail: e.main_image.url,
    }));

    return projects;
  } catch (error) {
    throw error;
  }
};
