export type iProductType = {
  title: string;
  slug: string;
  thumbnail: string;
};

export type iProductFamily = {
  title: string;
  slug: string;
};

export type iProductCard = {
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
  products: iProductCard[];
  pageCount: number;
};

export type iProductDetail = {
  name: string;
  slug: string;
  desc: string;
  thumbnail: string;
  gallery: string[];
  discontinued: boolean;
  keyFeatures: {
    name: string;
    desc: string;
    logoUrl: string;
    bgUrl: string;
  }[];
  techSpecs: {
    lightSource: string;
    movement: string;
    powerSupply: string;
    colors: string;
    prism: string;
    optics: string;
    control: string;
    coolingSystem: string;
    gobos: string;
    effects: string;
    dimmerOrStrobe: string;
    boxContent: string;
    sizeAndWeight: string;
  };
  goboColorsImgUrl: string;
  archDimImgUrl: string;
  packaging: {
    name: string;
    imgUrl: string;
  }[];
  techDocs: {
    name: string;
    type: "User Manual" | "Personalities" | "Drawings" | "Firmware";
    files: {
      name: string;
      url: string;
      size: number;
    }[];
  }[];
  previewVideo: string;
};

export type iProductDetailProps = {
  content: iProductDetail;
};
