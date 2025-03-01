import AspectTab from "@/components/common/AspectTab";
import { motion } from "framer-motion";
import { useRef } from "react";
import { aspectOptions } from "./schema";

const Banner = ({
  customers,
}: {
  customers: { name: string; imgUrl: string }[];
}) => {
  const ref = useRef(null);

  return (
    <>
      <div ref={ref}>
        <motion.div
          initial={{ scale: 1.5 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="w-full bg-[url(/image/about_banner.jpg)] bg-cover"
        >
          <div className="w-full px-[24px] py-[93px] lg:px-[120px] lg:py-[130px] bg-gray-950/40">
            <motion.h1
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="text-start text-white font-bold text-[40px] lg:text-[72px]"
            >
              Shaping the Future of Entertainment Lighting
            </motion.h1>
          </div>
        </motion.div>

        {/* Bagian Logo Partners dengan Animasi Scroll */}
        <div className="bg-black overflow-hidden relative">
          <motion.div
            className="flex whitespace-nowrap"
            animate={{ x: ["0%", "-100%"] }}
            transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
          >
            {customers.length == 0 && (
              <div className="flex">
                <img
                  src="/image/patners.png"
                  className="h-[80px] object-cover"
                />
                <img
                  src="/image/patners.png"
                  className="h-[80px] object-cover"
                />
              </div>
            )}

            {customers.length > 0 &&
              [...customers, ...customers, ...customers, ...customers].map(
                (e, i) => (
                  <img
                    key={i}
                    src={e.imgUrl}
                    alt={e.name}
                    className="h-[40px] md:h-[60px] my-[15px] mx-[40px] object-cover invert"
                  />
                )
              )}
          </motion.div>
          <div className="absolute left-0 top-0 h-full w-[120px] bg-gradient-to-r from-black to-transparent pointer-events-none"></div>
          <div className="absolute right-0 top-0 h-full w-[120px] bg-gradient-to-l from-black to-transparent pointer-events-none"></div>
        </div>
      </div>

      <AspectTab options={aspectOptions} />
    </>
  );
};

export default Banner;
