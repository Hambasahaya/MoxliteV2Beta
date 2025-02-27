import { iNewsCard } from "../common/NewsCard/types";

export type iProjectsProps = {
  projects: iNewsCard[];
  pageCount: number;
};

export type iGetProjectsRequest = {
  page: string;
  pageSize: number;
};

export type iProjectsDetail = {
  title: string;
  slug: string;
  summary: string;
  thumbnail: string;
  gallery: string[];
  published_at: string;
  content: string;
};

export type iProjectDetailProps = {
  project: iProjectsDetail;
};
