import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import ProductCard from "../../common/ProductCard";
import { ROUTES } from "@/constant/ROUTES";
import Link from "next/link";
import { iLatestProduct } from "../types";

const LatestProduct = ({ contents }: { contents: iLatestProduct[] }) => {
  if (contents.length == 0) {
    return <></>;
  }

  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, margin: "-100px" });

  return (
    <div className="p-[24px] lg:p-[120px] bg-[#F8FAFC]">
      <motion.div
        ref={ref}
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      >
        <div className="flex justify-between items-center font-bold">
          <div>
            <h2 className="text-[36px] lg:text-[48px] font-bold w-[50%] sm:w-full">
              Latest Products
            </h2>
          </div>
          <div>
            <Link
              className="text-[14px] cursor-pointer font-medium"
              href={`${ROUTES.PRODUCT.path}`}
            >
              View All
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {contents.map((e, i) => (
            <ProductCard
              key={i}
              imgUrl={e.thumbnail}
              name={e.name}
              desc={e.category}
              url={`${ROUTES.PRODUCT.path}/${e.slug}`}
              discontinue={e.discontinue}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default LatestProduct;
