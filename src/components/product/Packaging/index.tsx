import ProductCard from "@/components/common/ProductCard";

const Packaging = () => {
  return (
    <>
      <div
        id="packaging"
        className="px-[24px] py-[40px] lg:px-[120px] lg:py-[80px]"
      >
        <h2 className="text-[30px] text-black font-bold mb-[40px]">
          Packaging
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ProductCard
            imgUrl="/image/case_1.png"
            name="Flight case for 2 pcs of ASTRAHYB330"
            desc="Box"
          />
          <ProductCard
            imgUrl="/image/case_1.png"
            name="Flight case for 2 pcs of ASTRAHYB330"
            desc="Box"
          />
        </div>
      </div>
      <div className="border border-[#CBD5E1] mx-[24px] lg:mx-[120px]" />
    </>
  );
};

export default Packaging;
