import { useState, useEffect, useRef } from "react";
import { iFeatureOverlay } from "./types";

export default function FeatureOverlay({
  name,
  desc,
  logoUrl,
  bgUrl,
}: iFeatureOverlay) {
  const [isHovered, setIsHovered] = useState(false);
  const [position, setPosition] = useState("bottom");

  const boxRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isHovered && boxRef.current && overlayRef.current) {
      const rect = boxRef.current.getBoundingClientRect();
      const overlayHeight = overlayRef.current.offsetHeight;
      const viewportHeight = window.innerHeight;

      if (rect.top < overlayHeight + 20) {
        setPosition("bottom");
      } else if (viewportHeight - rect.bottom < overlayHeight + 20) {
        setPosition("top");
      } else {
        setPosition("bottom");
      }
    }
  }, [isHovered]);

  return (
    <div className="w-full h-full relative" ref={boxRef}>
      {/* Box Atas */}
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="border border-[#CBD5E1] bg-white w-full py-[13px] flex flex-col items-center"
      >
        <img src={logoUrl} className="size-[44px] mb-[4px] object-contain" />
        <p className="font-bold text-[#020617] text-[12px]">{name}</p>
      </div>

      {/* Overlay */}
      {isHovered && (
        <div
          ref={overlayRef}
          className={`absolute ${
            position === "top" ? "bottom-full mb-1.5" : "top-full mt-1.5"
          } w-[200px] bg-white rounded-lg shadow-xl overflow-hidden z-[55] md:left-1/2 md:-translate-x-1/2`}
        >
          <img
            src={bgUrl}
            alt="Background"
            className="w-full h-[100px] object-cover"
          />
          <div className="p-[16px]">
            <h3 className="font-bold text-black text-[14px] mb-[8px]">
              {name}
            </h3>
            <p className="text-[#020617] text-[10px]">{desc}</p>
          </div>
        </div>
      )}
    </div>
  );
}
