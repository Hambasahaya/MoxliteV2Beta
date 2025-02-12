import ProductCard from "../ProductCard";

const LatestProduct = () => {
  return (
    <div className="p-[24px] md:p-[120px] bg-[#F8FAFC]">
      <div className="flex justify-between items-center font-bold">
        <div>
          <h2 className="text-[36px] md:text-[48px] font-bold">
            Latest Products
          </h2>
        </div>
        <div>
          <p className="text-[14px] cursor-pointer font-medium">View All</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <ProductCard />
        <ProductCard />
        <ProductCard />
        <ProductCard />
      </div>
    </div>
  );
};

export default LatestProduct;
