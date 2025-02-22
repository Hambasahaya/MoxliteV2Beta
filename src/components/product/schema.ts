import { ROUTES } from "@/constant/ROUTES";

export const aspectOptions = (slug: string) => [
  {
    label: "Technical Specification",
    path: `${ROUTES.PRODUCT.path}/${slug}#tech-specs`,
  },
  {
    label: "Gobo & Colors",
    path: `${ROUTES.PRODUCT.path}/${slug}#gobo-colors`,
  },
  {
    label: "Architectural Dimension",
    path: `${ROUTES.PRODUCT.path}/${slug}#arch-dim`,
  },
  {
    label: "Packaging",
    path: `${ROUTES.PRODUCT.path}/${slug}#packaging`,
  },
  {
    label: "Technical Documents",
    path: `${ROUTES.PRODUCT.path}/${slug}#tech-docs`,
  },
  {
    label: "Preview Video",
    path: `${ROUTES.PRODUCT.path}/${slug}#prev-vid`,
  },
];
