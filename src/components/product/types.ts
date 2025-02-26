export type iProductType = {
  title: string;
  slug: string;
  thumbnail: string;
};

export type iProductFamily = {
  title: string;
  slug: string;
};

export type iProduct = {
  slug: string;
  name: string;
  thumbnail: string;
  category: string;
  discontinue: boolean;
};

export type iSearchProductRequest = {
  q?: string;
  typeQ?: string;
  familyQ?: string;
  page?: string;
  pageSize: number;
};

export type iProductProps = {
  productTypes: iProductType[];
  productFamily: iProductFamily[];
  products: iProduct[];
  pageCount: number;
};
