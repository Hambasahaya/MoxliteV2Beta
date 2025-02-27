import { useMotionValue, useSpring, useInView } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { iCounter } from "./types";

const Counter = ({ maxCount, bgImgPath, label }: iCounter) => {
  const count = useMotionValue(0);
  const springCount = useSpring(count, { stiffness: 100, damping: 10 });
  const [displayCount, setDisplayCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: "0px 0px -100px 0px" });

  useEffect(() => {
    if (isInView) {
      count.set(maxCount); // Mulai animasi ketika terlihat
    } else {
      count.set(0); // Reset ke 0 ketika keluar dari layar
    }
  }, [isInView, count, maxCount]);

  useEffect(() => {
    const updateCount = () => {
      setDisplayCount(Math.round(springCount.get()));
      requestAnimationFrame(updateCount);
    };
    requestAnimationFrame(updateCount);
  }, [springCount]);

  return (
    <div
      ref={ref}
      style={{
        backgroundImage: `url('${bgImgPath}')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="w-full h-full bg-black/45 flex justify-between items-center px-[24px] py-[16px]">
        <h3 className="text-[#F8FAFC] text-[36px] font-bold">
          {displayCount}+
        </h3>
        <p className="text-[#F8FAFC] text-[14px] font-medium text-end">
          {label}
        </p>
      </div>
    </div>
  );
};

export default Counter;
