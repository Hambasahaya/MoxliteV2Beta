import { GetServerSideProps } from "next";
import { iProductProps } from "../types";
import { getProductTypes, getProductFamily, searchProducts } from "./api";

export const getServerPropsList: GetServerSideProps<iProductProps> = async (
  context
) => {
  try {
    const { typeQ, familyQ, q, page } = context.query;
    const productTypes = await getProductTypes();
    const productFamily = await getProductFamily();
    const { products, pageCount } = await searchProducts({
      q: q ? String(q) : undefined,
      typeQ: typeQ ? String(typeQ) : undefined,
      familyQ: familyQ ? String(familyQ) : undefined,
      page: page ? String(page) : undefined,
      pageSize: 3,
    });

    return {
      props: {
        productTypes,
        productFamily,
        products,
        pageCount,
      },
    };
  } catch (error) {
    console.error("Error fetching posts:", error);

    return {
      props: {
        productTypes: [],
        productFamily: [],
        products: [],
        pageCount: 1,
      },
    };
  }
};
