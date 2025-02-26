export type iTechDocs = {
  items: {
    name: string;
    type: "User Manual" | "Personalities" | "Drawings" | "Firmware";
    files: {
      name: string;
      url: string;
    }[];
  }[];
};
