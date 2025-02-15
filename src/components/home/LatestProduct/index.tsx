import ProductCard from "../../common/ProductCard";

const LatestProduct = () => {
  return (
    <div className="p-[24px] lg:p-[120px] bg-[#F8FAFC]">
      <div className="flex justify-between items-center font-bold">
        <div>
          <h2 className="text-[36px] lg:text-[48px] font-bold">
            Latest Products
          </h2>
        </div>
        <div>
          <p className="text-[14px] cursor-pointer font-medium">View All</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <ProductCard
          imgUrl="/image/product_1.png"
          name="SCARLET I"
          desc="Moving Heads"
          url="/product/ok"
        />
        <ProductCard
          imgUrl="/image/product_2.png"
          name="SCARLET II"
          desc="Moving Heads"
          url="/product/ok"
        />
        <ProductCard
          imgUrl="/image/product_3.png"
          name="SCARLET III"
          desc="Moving Heads"
          url="/product/ok"
        />
        <ProductCard
          imgUrl="/image/product_1.png"
          name="SCARLET I"
          desc="Moving Heads"
          url="/product/ok"
        />
      </div>
    </div>
  );
};

export default LatestProduct;
