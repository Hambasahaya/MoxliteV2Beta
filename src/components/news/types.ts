import { iNewsCard } from "../common/NewsCard/types";

export type iNewsProps = {
  news: iNewsCard[];
  pageCount: number;
};

export type iGetNewsRequest = {
  page: string;
  pageSize: number;
};
