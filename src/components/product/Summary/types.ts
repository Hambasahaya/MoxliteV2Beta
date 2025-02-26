export type iSummary = {
  name: string;
  desc: string;
  gallery: string[];
  discontinued: boolean;
  keyFeatures: {
    name: string;
    desc: string;
    logoUrl: string;
    bgUrl: string;
  }[];
};

export type iCarousel = {
  imgUrls: string[];
};
