import { ROUTES } from "@/constant/ROUTES";
import { useRouter } from "next/router";
import { iLatestProject } from "../types";
import { fireGAevent } from "@/lib/gtag";

const MoxliteOnDutyCard = ({ slug, name, thumbnail }: iLatestProject) => {
  const router = useRouter();

  return (
    <div
      onClick={() => {
        fireGAevent({
          action: "homepage_project",
          attribute: {
            project_name: name,
          },
        });
        router.push(`${ROUTES.PROJECT.path}/${slug}`);
      }}
      className="h-[285px] cursor-pointer bg-cover flex flex-col justify-end text-white hover:text-black group"
      style={{
        backgroundImage: `url(${thumbnail})`,
      }}
    >
      <h4 className="font-bold text-[24px]  p-[16px] group-hover:bg-gray-300/90">
        {name}
      </h4>
    </div>
  );
};

export default MoxliteOnDutyCard;
