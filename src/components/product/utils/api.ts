import { ENV } from "@/constant/ENV";
import {
  iSearchProductRequest,
  iProduct,
  iProductFamily,
  iProductType,
} from "../types";

export const getProductTypes = async (): Promise<iProductType[]> => {
  try {
    const rawRes = await fetch(
      `${ENV.NEXT_PUBLIC_API_BASE_URL}/api/product-categories`
    );
    const result = await rawRes.json();
    const types: iProductType[] = result.data.map((e: any) => ({
      slug: e.slug,
      title: e.name,
      thumbnail: e.filter_button_image.url,
    }));

    return types;
  } catch (error) {
    throw error;
  }
};

export const getProductFamily = async (): Promise<iProductFamily[]> => {
  try {
    const rawRes = await fetch(
      `${ENV.NEXT_PUBLIC_API_BASE_URL}/api/product-families`
    );
    const result = await rawRes.json();
    const families: iProductFamily[] = result.data.map((e: any) => ({
      slug: e.slug,
      title: e.name,
    }));

    return families;
  } catch (error) {
    throw error;
  }
};

export const searchProducts = async ({
  q,
  typeQ,
  familyQ,
  page,
  pageSize,
}: iSearchProductRequest): Promise<{
  products: iProduct[];
  pageCount: number;
}> => {
  try {
    const urlParams = new URLSearchParams({
      ...(q ? { search: q } : {}),
      ...(typeQ ? { category: typeQ } : {}),
      ...(familyQ ? { family: familyQ } : {}),
      ...(page ? { "pagination[page]": page } : {}),
      ...(pageSize ? { "pagination[pageSize]": String(pageSize) } : {}),
    }).toString();

    const rawRes = await fetch(
      `${ENV.NEXT_PUBLIC_API_BASE_URL}/api/products?${urlParams}`
    );

    const result = await rawRes.json();
    const products: iProduct[] = result.data.map((e: any) => ({
      slug: e.slug,
      name: e.name,
      thumbnail: e.main_image.url,
      category: e.product_category.name,
      discontinue: e?.discontinued ?? false,
    }));
    const pageCount = result?.meta?.pagination?.pageCount ?? 0;

    return { products, pageCount };
  } catch (error) {
    throw error;
  }
};
