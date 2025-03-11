export const aspectOptions = (
  name: string,
  family: string,
  category: string
) => [
  {
    label: "Technical Specification",
    docId: `tech-specs`,
    GAevent: {
      action: "product_detail_technical_specs",
      attribute: {
        product_name: name,
        product_family: family,
        product_category: category,
      },
    },
  },
  {
    label: "Gobo & Colors",
    docId: `gobo-colors`,
    GAevent: {
      action: "product_detail_gobo",
      attribute: {
        product_name: name,
        product_family: family,
        product_category: category,
      },
    },
  },
  {
    label: "Architectural Dimension",
    docId: `arch-dim`,
    GAevent: {
      action: "product_detail_architec_dimension",
      attribute: {
        product_name: name,
        product_family: family,
        product_category: category,
      },
    },
  },
  {
    label: "Packaging",
    docId: `packaging`,
    GAevent: {
      action: "product_detail_packaging",
      attribute: {
        product_name: name,
        product_family: family,
        product_category: category,
      },
    },
  },
  {
    label: "Technical Documents",
    docId: `tech-docs`,
    GAevent: {
      action: "product_detail_tech_docs",
      attribute: {
        product_name: name,
        product_family: family,
        product_category: category,
      },
    },
  },
  {
    label: "Preview Video",
    docId: `prev-vid`,
    GAevent: {
      action: "product_detail_preview_video",
      attribute: {
        product_name: name,
        product_family: family,
        product_category: category,
      },
    },
  },
];
