import { useState } from "react";
import Dropdown from "@/components/common/Dropdown";
import Layout from "@/components/common/Layout";
import ProductCard from "@/components/common/ProductCard";
import SearchBox from "@/components/common/SearchBox";
import Pagination from "@/components/common/Pagination";
import { ROUTES } from "@/constant/ROUTES";

const ProductList = () => {
  const [currPage, setCurrPage] = useState(1);

  return (
    <Layout>
      <div className="w-full p-[24px] lg:px-[120px] lg:py-[40px] bg-[url(/image/product_list_banner.png)] bg-cover">
        <h1 className="text-center text-white font-bold text-[36px] lg:text-[48px]">
          Get the Product for Your Next Show
        </h1>
      </div>

      <div className="grid grid-cols-12 gap-4 p-[24px] lg:px-[120px] lg:py-[40px]">
        <div className="col-span-12 lg:col-span-3">
          <div className="border-0 lg:border-r lg:border-[#CBD5E1] pr-0 lg:pr-4">
            <div className="mb-[40px]">
              <SearchBox />
            </div>
            <p className="text-[#64748B] text-[12px] font-semibold">
              FILTER BY PRODUCT TYPE
            </p>

            <div className="mb-[40px]">
              <div className="cursor-pointer mt-[8px] bg-[url(/image/product_list_banner.png)] bg-cover flex items-center justify-end">
                <h4 className="text-[14px] font-bold text-white text-right w-[60%] py-2 lg:py-1 px-4">
                  MOXLITE AMOS
                </h4>
              </div>
              <div className="cursor-pointer mt-[8px] bg-[url(/image/product_list_banner.png)] bg-cover flex items-center justify-end">
                <h4 className="text-[14px] font-bold text-white text-right w-[60%] py-2 lg:py-1 px-4">
                  MOXLITE AMOS
                </h4>
              </div>
              <div className="cursor-pointer mt-[8px] bg-[url(/image/product_list_banner.png)] bg-cover flex items-center justify-end">
                <h4 className="text-[14px] font-bold text-white text-right w-[60%] py-2 lg:py-1 px-4">
                  MOXLITE AMOS
                </h4>
              </div>
            </div>

            <p className="text-[#64748B] text-[12px] font-semibold mb-[8px]">
              FILTER BY FAMILY
            </p>
            <Dropdown
              selectedValue={null}
              options={[{ label: "Moving Heads", value: 1 }]}
              onChange={(_v) => {}}
            />
          </div>
        </div>

        <div className="col-span-12 lg:col-span-9">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <ProductCard
              imgUrl="/image/product_1.png"
              name="SCARLET I"
              desc="Moving Heads"
              url={`${ROUTES.PRODUCT.path}/sample`}
            />
            <ProductCard
              imgUrl="/image/product_2.png"
              name="SCARLET II"
              desc="Moving Heads"
              url={`${ROUTES.PRODUCT.path}/sample`}
            />
            <ProductCard
              imgUrl="/image/product_3.png"
              name="SCARLET III"
              desc="Moving Heads"
              url={`${ROUTES.PRODUCT.path}/sample`}
            />
          </div>

          <div className="mt-[24px] flex justify-end">
            <Pagination pageCount={10} onPageChange={setCurrPage} />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProductList;
