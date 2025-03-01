import DropdownLink from "@/components/common/DropdownLink";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const AspectTab = ({ options }: iAspectTab) => {
  const router = useRouter();
  const [selectedAspect, setSelectedAspect] = useState("");

  useEffect(() => {
    if (router.query?.sec) {
      const docId = router.query.sec as string;
      setSelectedAspect(
        options.find((e) => e.path === router.asPath)?.label ?? ""
      );

      const targetElement = document.getElementById(docId);
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

          window.scrollTo(
            0,
            startPosition + distance * easeInOutQuad(progress)
          );

          if (timeElapsed < duration) {
            requestAnimationFrame(smoothScroll);
          }
        };

        const easeInOutQuad = (t: number) =>
          t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

        requestAnimationFrame(smoothScroll);
      }
    }
  }, [router.asPath, options]);

  return (
    <div className="sticky top-[76px] lg:top-[63px] z-50">
      <div className="bg-[#213E77] py-[12px] hidden lg:flex justify-center">
        {options.map((e, i) => (
          <p
            key={i}
            className={`font-bold text-white text-[16px] px-[27px] cursor-pointer ${
              e.label === selectedAspect ? "underline" : ""
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
