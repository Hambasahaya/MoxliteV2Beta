import { useState, useEffect, useRef } from "react";

export default function FeatureOverlay() {
  const [isHovered, setIsHovered] = useState(false);
  const [position, setPosition] = useState("bottom");

  // Menentukan tipe elemen HTML
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
        <img
          src="/icon/signal.svg"
          className="size-[44px] mb-[4px] object-contain"
        />
        <p className="font-bold text-[#020617] text-[12px]">NFC</p>
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
            src="/image/bg_overlay.png"
            alt="Background"
            className="w-full h-[100px] object-cover"
          />
          <div className="p-[16px]">
            <h3 className="font-bold text-black text-[14px] mb-[8px]">NFC</h3>
            <p className="text-[#020617] text-[10px]">
              The Robe COM application is an app based on NFC (Near Field
              Communication). It can be used to access fixture’s settings of our
              NFC-based navigation display systems as well as reading out data
              of our TE™ Transferable Engines.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
