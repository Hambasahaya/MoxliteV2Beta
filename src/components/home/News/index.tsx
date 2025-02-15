import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import NewsCard from "../NewsCard";

const News = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, margin: "-50px" });

  return (
    <div className="p-[24px] lg:p-[120px] bg-[#F8FAFC]">
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 150 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 150 }}
        exit={{ opacity: 0, y: 150 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <div className="flex justify-between items-center font-bold mb-[40px]">
          <div>
            <h2 className="text-[36px] lg:text-[48px] font-bold">News</h2>
          </div>
          <div>
            <p className="text-[14px] cursor-pointer font-medium">View All</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <NewsCard />
          <NewsCard />
          <NewsCard />
        </div>
      </motion.div>
    </div>
  );
};

export default News;
