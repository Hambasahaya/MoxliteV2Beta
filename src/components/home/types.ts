import { iNewsCard } from "../common/NewsCard/types";

export type iLatestProduct = {
  slug: string;
  name: string;
  thumbnail: string;
  category: string;
  discontinue: boolean;
};

export type iLatestNews = iNewsCard;

export type iLatestProject = {
  slug: string;
  name: string;
  thumbnail: string;
};

export type iHomeProps = {
  latestProducts: iLatestProduct[];
  latestNews: iLatestNews[];
  latestProjects: iLatestProject[];
};
