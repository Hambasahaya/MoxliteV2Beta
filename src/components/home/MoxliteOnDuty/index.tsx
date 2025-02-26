import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import MoxliteOnDutyCard from "../MoxliteOnDutyCard";
import { ROUTES } from "@/constant/ROUTES";
import Link from "next/link";
import { iLatestProject } from "../types";

const MoxliteOnDuty = ({ contents }: { contents: iLatestProject[] }) => {
  if (contents.length == 0) {
    return <></>;
  }

  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, margin: "-100px" });

  return (
    <div
      className="p-[24px] lg:p-[120px]"
      style={{
        background:
          "radial-gradient(116.01% 139.72% at 50% 100%, #020617 33.17%, rgba(8, 31, 59, 1) 62.23%, rgba(62, 156, 146, 1) 100%)",
      }}
    >
      <motion.div
        ref={ref}
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      >
        <div className="flex justify-between items-center font-bold text-white mb-[40px]">
          <div>
            <h2 className="text-[36px] lg:text-[48px] font-bold  w-[80%] sm:w-full">
              Moxlite On Duty
            </h2>
          </div>
          <div>
            <Link
              className="text-[14px] cursor-pointer font-medium"
              href={`${ROUTES.NEWS.path}`}
            >
              View All
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {contents.map((e, i) => (
            <MoxliteOnDutyCard key={i} {...e} />
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default MoxliteOnDuty;
