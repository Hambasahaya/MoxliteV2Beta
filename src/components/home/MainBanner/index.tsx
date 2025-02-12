import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const texts = ["Nightclub", "Concert", "Architectural"];

const MainBanner = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % texts.length);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-[calc(100vh-65px)] bg-[url('/image/home_palceholder_hero.jpg')] bg-cover bg-no-repeat bg-center">
      <div className="px-[24px] md:px-[120px] h-full w-full bg-gray-950/40 flex md:items-center pt-[168px] md:pt-0">
        <div>
          <div>
            <div className="flex flex-wrap items-center">
              <div>
                <h1 className="text-white text-[40px] md:text-[72px] font-bold mr-0 md:mr-[24px]">
                  Reimagining
                </h1>
              </div>
              <div className="bg-white w-fit px-[16px] md:px-[24px] ">
                <AnimatePresence mode="wait">
                  <motion.h1
                    key={texts[index]}
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -10, opacity: 0 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    className="text-black text-[40px] md:text-[60px] font-bold"
                  >
                    {texts[index]}
                  </motion.h1>
                </AnimatePresence>
              </div>
            </div>

            <div>
              <h1 className="text-white text-[40px] md:text-[72px] font-bold">
                with Moxlite
              </h1>
            </div>
          </div>

          <button className="bg-[#FAFAFA] py-[12px] px-[16px] mt-[40px] md:mt-[29px] rounded-md cursor-pointer text-[14px] font-medium">
            Explore product
          </button>
        </div>
      </div>
    </div>
  );
};

export default MainBanner;
