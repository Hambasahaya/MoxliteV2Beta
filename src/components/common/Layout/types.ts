import { ReactNode } from "react";

export type iHeader = {
  title: string;
  desc: string;
  thumbnail: string;
  url: string;
};

export type iLayoutProps = {
  children: ReactNode;
  metadata?: iHeader;
};
