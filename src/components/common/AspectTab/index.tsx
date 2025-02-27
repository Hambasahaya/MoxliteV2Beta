import DropdownLink from "@/components/common/DropdownLink";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const AspectTab = ({ options }: iAspectTab) => {
  const router = useRouter();
  const [selectedAspect, setSelectedAspect] = useState("");

  useEffect(() => {
    if (router.asPath.includes("#")) {
      setSelectedAspect(
        options.filter((e) => e.path == router.asPath)[0]?.label ?? ""
      );

      const elementId = router.asPath.split("#")[1];
      const targetElement = document.getElementById(elementId);

      if (targetElement) {
        targetElement.scrollIntoView({ behavior: "smooth", block: "start" });

        setTimeout(() => {
          window.scrollBy({ top: -100, behavior: "smooth" });
        }, 0);
      }
    }
  }, [router.asPath]);

  return (
    <div id="aspect" className="sticky top-[76px] lg:top-[63px] z-50">
      <div className="bg-[#213E77] py-[12px] hidden lg:flex justify-center">
        {options.map((e, i) => (
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
        <DropdownLink
          defaultValue
          options={options.map((e) => ({
            label: e.label,
            path: e.path,
          }))}
        />
      </div>
    </div>
  );
};

export default AspectTab;
