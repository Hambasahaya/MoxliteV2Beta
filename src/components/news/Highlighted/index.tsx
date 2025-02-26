import { iNewsCard } from "@/components/common/NewsCard/types";
import { ROUTES } from "@/constant/ROUTES";
import { useRouter } from "next/router";
import moment from "moment";

const Highlighted = ({ slug, name, thumbnail, desc, date }: iNewsCard) => {
  const router = useRouter();

  return (
    <div
      onClick={() => {
        router.push(`${ROUTES.NEWS.path}/${slug}`);
      }}
      className="m-[24px] lg:my-[80px] lg:mx-[120px] bg-[#020617] text-[#F8FAFC] grid grid-cols-12 gap-0 cursor-pointer hover:shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.7)]"
    >
      <div className="min-h-[228px] lg:min-h-[400px] max-h-full col-span-12 lg:col-span-6">
        <img src={thumbnail} className="size-full object-cover" />
      </div>
      <div className="col-span-12 lg:col-span-6">
        <div className="p-[24px] lg:p-[40px] flex flex-col justify-center h-full">
          <p className="text-[#94A3B8] text-[14px] font-medium mb-[16px]">
            {moment(date).format("MMM DD, YYYY")}
          </p>
          <h2 className="text-[24px] lg:text-[30px] font-bold">{name}</h2>
          <p className="text-[16px] font-medium hidden sm:flex mt-[16px]">
            {desc}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Highlighted;
