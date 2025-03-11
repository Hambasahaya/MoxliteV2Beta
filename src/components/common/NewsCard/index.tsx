import { useRouter } from "next/router";
import moment from "moment";
import { iNewsCard } from "./types";
import { fireGAevent } from "@/lib/gtag";

const NewsCard = ({ url, name, thumbnail, desc, date, GAevent }: iNewsCard) => {
  const router = useRouter();

  return (
    <div
      onClick={() => {
        if (GAevent) {
          fireGAevent(GAevent);
        }
        router.push(url);
      }}
      className="border border-[#CBD5E1] cursor-pointer bg-white hover:bg-black text-black hover:text-white hover:shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.3)] h-full"
    >
      <img src={thumbnail} className="h-[254px] w-full object-cover" />
      <div className="py-[27px] px-[24px]">
        <p className="text-[#64748B] text-[14px] font-medium">
          {moment(date).format("MMM DD, YYYY")}
        </p>
        <h2 className="font-bold text-[24px] my-[16px]">{name}</h2>
        <p className="font-medium text-[16px]">
          {desc.length > 100 ? desc.substring(0, 100) + "..." : desc}
        </p>
      </div>
    </div>
  );
};

export default NewsCard;
