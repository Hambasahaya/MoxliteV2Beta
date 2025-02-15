import DropdownLink from "@/components/common/DropdownLink";
import { useRouter } from "next/router";
import { aspectOptions } from "./schema";

const AspectTab = () => {
  const router = useRouter();
  const selectedAspect = aspectOptions.filter((e) => e.path == router.asPath)[0]
    ?.label;

  return (
    <div id="aspect" className="sticky top-[76px] lg:top-[63px] z-50">
      <div className="bg-[#213E77] py-[12px] hidden lg:flex justify-center">
        {aspectOptions.map((e, i) => (
          <p
            key={i}
            className={`font-bold text-white text-[16px] px-[27px] cursor-pointer ${
              e.label == selectedAspect ? "underline" : ""
            }`}
            onClick={() => {
              router.push(e.path);
            }}
          >
            {e.label}
          </p>
        ))}
      </div>

      <div className="py-[8px] px-[24px] bg-[#213E77] flex lg:hidden">
        <DropdownLink defaultValue options={aspectOptions} />
      </div>
    </div>
  );
};

export default AspectTab;
