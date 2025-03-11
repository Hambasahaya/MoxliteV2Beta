export type iTechDocs = {
  productName: string;
  productCategory: string;
  productFamily: string;
  items: {
    name: string;
    type: "User Manual" | "Personalities" | "Drawings" | "Firmware";
    files: {
      name: string;
      url: string;
      size: number;
    }[];
  }[];
};
