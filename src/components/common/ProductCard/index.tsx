import { useRouter } from "next/router";
import { iProductCard } from "./types";

const ProductCard = ({
  imgUrl,
  name,
  desc,
  url,
  discontinue = false,
}: iProductCard) => {
  const router = useRouter();

  return (
    <div
      onClick={() => {
        if (!url) return;
        router.push(url);
      }}
      className="max-w-[1200px] w-full h-full border border-[#CBD5E1] flex flex-col items-center cursor-pointer bg-white hover:bg-black text-black hover:text-white hover:shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)]"
    >
      <div className="bg-white w-full flex justify-center">
        <img
          src={imgUrl}
          className={`h-[200px] w-[200px] mt-[24px] mb-[20px] object-contain ${
            discontinue ? "opacity-30" : ""
          }`}
        />
      </div>
      <div className="p-[16px] w-full h-full flex flex-col justify-end">
        {discontinue && (
          <div className="mb-1 px-[16px] py-[4px] bg-[#CBD5E1] text-[#64748B] font-medium text-[12px] w-fit">
            DISCONTINUED
          </div>
        )}
        <p className="font-bold text-[20px]">{name}</p>
        <p className="text-[16px]">{desc}</p>
      </div>
    </div>
  );
};

export default ProductCard;
