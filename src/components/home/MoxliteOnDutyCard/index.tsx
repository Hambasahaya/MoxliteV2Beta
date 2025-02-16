import { ROUTES } from "@/constant/ROUTES";
import { useRouter } from "next/router";

const MoxliteOnDutyCard = () => {
  const router = useRouter();

  return (
    <div
      onClick={() => {
        router.push(`${ROUTES.NEWS.path}/slug-sample`);
      }}
      className="h-[285px] cursor-pointer bg-[url(/image/home_palceholder_hero.jpg)] bg-cover flex flex-col justify-end"
    >
      <h4 className="font-bold text-[24px] text-white hover:text-black p-[16px] bg-none hover:bg-gray-300/90">
        Lighting Show The Brotherhood Jakarta
      </h4>
    </div>
  );
};

export default MoxliteOnDutyCard;
