import DropdownLink from "@/components/common/DropdownLink";
import { useEffect, useState } from "react";
import { iAspectTab } from "./types";
import { fireGAevent } from "@/lib/gtag";

const AspectTab = ({ options }: iAspectTab) => {
  const [selectedOption, setSelectedOption] = useState<{
    label: string;
    docId: string;
  } | null>(null);

  useEffect(() => {
    if (!selectedOption) return;

    const targetElement = document.getElementById(selectedOption.docId);
    if (targetElement) {
      const targetPosition =
        targetElement.getBoundingClientRect().top + window.scrollY;
      const startPosition = window.scrollY;
      const distance = targetPosition - startPosition - 100;
      const duration = 500; // 0.5 detik
      let startTime: number | null = null;

      const smoothScroll = (currentTime: number) => {
        if (!startTime) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / duration, 1);

        window.scrollTo(0, startPosition + distance * easeInOutQuad(progress));

        if (timeElapsed < duration) {
          requestAnimationFrame(smoothScroll);
        }
      };

      const easeInOutQuad = (t: number) =>
        t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

      requestAnimationFrame(smoothScroll);
    }
  }, [JSON.stringify(selectedOption)]);

  return (
    <div className="sticky top-[76px] lg:top-[63px] z-50">
      <div className="bg-[#213E77] py-[12px] hidden lg:flex justify-center">
        {options.map((e, i) => (
          <p
            key={i}
            className={`font-bold text-white text-[16px] px-[27px] cursor-pointer ${
              e.docId === selectedOption?.docId ? "underline" : ""
            }`}
            onClick={() => {
              if (e.GAevent) {
                fireGAevent(e.GAevent);
              }

              setSelectedOption(e);
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
            docId: e.docId,
            GAevent: e.GAevent,
          }))}
        />
      </div>
    </div>
  );
};

export default AspectTab;
