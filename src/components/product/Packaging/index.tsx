import ProductCard from "@/components/common/ProductCard";
import { iPackaging } from "./types";

const Packaging = ({ items }: iPackaging) => {
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
          {items.map((e, i) => (
            <ProductCard key={i} imgUrl={e.imgUrl} name={e.name} desc="Box" />
          ))}
        </div>
      </div>
      <div className="border border-[#CBD5E1] mx-[24px] lg:mx-[120px]" />
    </>
  );
};

export default Packaging;
