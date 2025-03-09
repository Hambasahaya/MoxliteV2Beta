import Dropdown from "@/components/common/Dropdown";
import Layout from "@/components/common/Layout";
import ProductCard from "@/components/common/ProductCard";
import SearchBox from "@/components/common/SearchBox";
import Pagination from "@/components/common/Pagination";
import { ROUTES } from "@/constant/ROUTES";
import { iProductProps } from "@/components/product/types";
import { useRouter } from "next/router";
import { ENV } from "@/constant/ENV";
import { fireGAevent } from "@/lib/gtag";

const ProductList = ({
  productTypes,
  productFamily,
  products,
  pageCount,
}: iProductProps) => {
  const router = useRouter();
  const { typeQ, familyQ, q, page } = router?.query;

  const updateQueryParams = (updates: { [key: string]: any }): void => {
    let tmpQuery = router.query;

    Object.keys(updates).forEach((key) => {
      if (updates[key] === null) {
        delete tmpQuery[key];
      } else if (tmpQuery[key] === updates[key]) {
        delete tmpQuery[key];
      } else {
        tmpQuery[key] = updates[key];
      }
    });

    router.push(
      {
        pathname: router.pathname,
        query: tmpQuery,
      },
      undefined,
      { shallow: false }
    );
  };

  const onSearch = (value: string) => {
    if (value == q) return;

    if (!value) {
      updateQueryParams({ q });
    } else {
      updateQueryParams({ q: value });
    }
  };

  return (
    <Layout
      metadata={{
        title: "Product - Moxlite",
        desc: "Moxlite Product Range A Diverse Selection of Stage Lighting Solutions Tailored to Your Needs View More HADES View More SCARLET I View More CATRICE View More AMOS+ View More OPTIC IV View More POSEIDON View More MOREEN View More MEDUSA+ View More MAXINE View More LIME View More ATHEN ZOOM View More APHRODITE View More ...",
        thumbnail: `${ENV.NEXT_PUBLIC_FE_BASE_URL}/main_thumbnail.jpg`,
        url: `${ENV.NEXT_PUBLIC_FE_BASE_URL}/product`,
      }}
    >
      <div className="w-full p-[24px] lg:px-[120px] lg:py-[40px] bg-[url(/image/product_list_banner.png)] bg-cover">
        <h1 className="text-center text-white font-bold text-[36px] lg:text-[48px]">
          Get the Product for Your Next Show
        </h1>
      </div>

      <div className="grid grid-cols-12 gap-4 p-[24px] lg:px-[120px] lg:py-[40px]">
        <div className="col-span-12 lg:col-span-3">
          <div className="border-0 lg:border-r lg:border-[#CBD5E1] pr-0 lg:pr-4">
            <div className="mb-[40px]">
              <SearchBox
                onEnter={(value) => {
                  fireGAevent({
                    action: "product_search_enter",
                  });
                  onSearch(value);
                }}
                onClickSearch={(value) => {
                  fireGAevent({
                    action: "product_search",
                  });
                  onSearch(value);
                }}
              />
            </div>
            <p className="text-[#64748B] text-[12px] font-semibold">
              FILTER BY PRODUCT TYPE
            </p>

            <div className="mb-[40px]">
              {productTypes.map((e, i) => (
                <div
                  key={i}
                  className={`cursor-pointer mt-[8px] bg-cover flex items-center justify-end ${
                    typeQ == e.slug ? "" : "grayscale hover:grayscale-0"
                  }`}
                  style={{
                    backgroundImage: `url(${e.thumbnail})`,
                  }}
                  onClick={() => {
                    fireGAevent({
                      action: "product_filter_category",
                      attribute: {
                        category_title: e.title,
                      },
                    });

                    updateQueryParams({ typeQ: e.slug });
                  }}
                >
                  <div className="h-[67px] max-w-[50%] mr-4 flex items-center justify-end">
                    <h4 className="text-[14px] font-bold text-white text-right">
                      {e.title}
                    </h4>
                  </div>
                </div>
              ))}
            </div>

            <p className="text-[#64748B] text-[12px] font-semibold mb-[8px]">
              FILTER BY FAMILY
            </p>
            <Dropdown
              selectedValue={{ label: "", value: familyQ }}
              options={[
                {
                  label: "Please select an option",
                  value: "",
                },
                ...productFamily.map((e) => ({
                  label: e.title,
                  value: e.slug,
                })),
              ]}
              onChange={(option) => {
                if (!option.value && familyQ) {
                  updateQueryParams({ familyQ });
                  return;
                }

                fireGAevent({
                  action: "product_filter_family",
                  attribute: {
                    family_title: option.label,
                  },
                });
                updateQueryParams({ familyQ: option.value });
              }}
            />
          </div>
        </div>

        <div className="col-span-12 lg:col-span-9">
          {products.length > 0 && (
            <div className="flex flex-col justify-between h-full">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {products.map((e, i) => (
                  <ProductCard
                    key={i}
                    imgUrl={e.thumbnail}
                    name={e.name}
                    desc={e.category}
                    url={`${ROUTES.PRODUCT.path}/${e.slug}`}
                    discontinue={e.discontinue}
                  />
                ))}
              </div>

              <div className="mt-[24px] flex justify-end">
                <Pagination
                  pageCount={pageCount}
                  onPageChange={(currPage) => {
                    if (currPage.toString() == page) return;
                    updateQueryParams({ page: currPage });
                  }}
                />
              </div>
            </div>
          )}

          {products.length == 0 && (
            <div className="h-[60vh] w-full flex items-center justify-center">
              <p className="text-center font-medium">
                Data not found please use other filters...
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ProductList;

export { getServerPropsList as getServerSideProps } from "@/components/product/utils/getServerProps";
