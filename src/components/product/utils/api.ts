import { ENV } from "@/constant/ENV";
import {
  iSearchProductRequest,
  iProductCard,
  iProductFamily,
  iProductType,
  iProductDetail,
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
  products: iProductCard[];
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
    const products: iProductCard[] = result.data.map((e: any) => ({
      slug: e.slug,
      name: e.name,
      thumbnail: e?.main_image?.url ?? "",
      category: e.product_category.name,
      discontinue: e?.discontinued ?? false,
    }));
    const pageCount = result?.meta?.pagination?.pageCount ?? 0;

    return { products, pageCount };
  } catch (error) {
    throw error;
  }
};

export const getProductDetails = async (
  slug: string
): Promise<iProductDetail> => {
  try {
    const rawRes = await fetch(
      `${ENV.NEXT_PUBLIC_API_BASE_URL}/api/products/${slug}`
    );
    const result = await rawRes.json();

    const details: iProductDetail = {
      name: result?.data?.name ?? "",
      slug: result?.data?.slug ?? "",
      desc: result?.data?.description ?? "",
      thumbnail: result?.data?.main_image?.url ?? "",
      gallery: result?.data?.image_gallery?.map((e: any) => e?.url) ?? [],
      discontinued: result?.data?.discontinued ?? false,
      keyFeatures:
        result?.data?.key_features?.map((e: any) => ({
          name: e?.name ?? "",
          desc: e?.summary ?? "",
          logoUrl: e?.logo?.url ?? "",
          bgUrl: e?.hover_image?.url ?? "",
        })) ?? [],
      techSpecs: {
        lightSource: result?.data?.light_source ?? "",
        movement: result?.data?.movement ?? "",
        powerSupply: result?.data?.power_supply ?? "",
        colors: result?.data?.colours ?? "",
        prism: result?.data?.prism ?? "",
        optics: result?.data?.optics ?? "",
        control: result?.data?.control ?? "",
        coolingSystem: result?.data?.cooling_system ?? "",
        gobos: result?.data?.gobos ?? "",
        effects: result?.data?.effects ?? "",
        dimmerOrStrobe: result?.data?.dimmer_strobe ?? "",
        boxContent: result?.data?.box_content ?? "",
        sizeAndWeight: result?.data?.size_weight ?? "",
      },
      goboColorsImgUrl: result?.data?.gobo_colours?.url ?? "",
      archDimImgUrl: result?.data?.architectural_dimension?.url ?? "",
      packaging:
        result?.data?.packings?.map((e: any) => ({
          name: e?.name ?? "",
          imgUrl: e?.image?.url ?? "",
        })) ?? [],
      techDocs:
        result?.data?.technical_files?.map((e: any) => ({
          name: e?.name ?? "",
          type: e?.type ?? "",
          files:
            e?.files?.map((file: any) => ({
              name: file?.name ?? "",
              url: file?.url ?? "",
            })) ?? [],
        })) ?? [],
      previewVideo: result?.data?.video_youtube_url ?? "",
    };

    return details;
  } catch (error) {
    throw error;
  }
};
