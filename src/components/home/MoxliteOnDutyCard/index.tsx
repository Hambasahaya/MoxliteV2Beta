import { ROUTES } from "@/constant/ROUTES";
import { useRouter } from "next/router";
import { iLatestProject } from "../types";

const MoxliteOnDutyCard = ({ slug, name, thumbnail }: iLatestProject) => {
  const router = useRouter();

  return (
    <div
      onClick={() => {
        router.push(`${ROUTES.NEWS.path}/${slug}`);
      }}
      className="h-[285px] cursor-pointer bg-cover flex flex-col justify-end"
      style={{
        backgroundImage: `url(${thumbnail})`,
      }}
    >
      <h4 className="font-bold text-[24px] text-white hover:text-black p-[16px] bg-none hover:bg-gray-300/90">
        {name}
      </h4>
    </div>
  );
};

export default MoxliteOnDutyCard;
