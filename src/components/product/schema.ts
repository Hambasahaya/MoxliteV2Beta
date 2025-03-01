import { ROUTES } from "@/constant/ROUTES";

export const aspectOptions = (slug: string) => [
  {
    label: "Technical Specification",
    path: `${ROUTES.PRODUCT.path}/${slug}?sec=tech-specs`,
  },
  {
    label: "Gobo & Colors",
    path: `${ROUTES.PRODUCT.path}/${slug}?sec=gobo-colors`,
  },
  {
    label: "Architectural Dimension",
    path: `${ROUTES.PRODUCT.path}/${slug}?sec=arch-dim`,
  },
  {
    label: "Packaging",
    path: `${ROUTES.PRODUCT.path}/${slug}?sec=packaging`,
  },
  {
    label: "Technical Documents",
    path: `${ROUTES.PRODUCT.path}/${slug}?sec=tech-docs`,
  },
  {
    label: "Preview Video",
    path: `${ROUTES.PRODUCT.path}/${slug}?sec=prev-vid`,
  },
];
