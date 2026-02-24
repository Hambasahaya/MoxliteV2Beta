import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ROUTES } from "@/constant/ROUTES";
import { fireGAevent } from "@/lib/gtag";
import HLSVideo from "./HLSVideo";

const texts = ["Nightclub", "Concert", "Architectural"];

const MainBanner = () => {
  const [index, setIndex] = useState(0);
  const [showOverlay, setShowOverlay] = useState(true); // State untuk overlay

  useEffect(() => {
    // Interval untuk teks animasi
    const textInterval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % texts.length);
    }, 500);

    // Timer untuk menghilangkan overlay setelah 1 detik
    const overlayTimeout = setTimeout(() => {
      setShowOverlay(false);
    }, 1000);

    return () => {
      clearInterval(textInterval);
      clearTimeout(overlayTimeout);
    };
  }, []);

  return (
    <>
      {/* Overlay yang Menutupi Selama 1 Detik */}
      <AnimatePresence>
        {showOverlay && (
          <motion.div
            initial={{ opacity: 1, y: 0 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0.5, y: -700 }} // Efek tarik ke atas
            transition={{ duration: 0.8, ease: "circOut" }}
            className="absolute h-screen inset-0 flex justify-center items-center z-[200]"
            style={{
              background:
                "radial-gradient(116.0069560407267% 139.71710502756912% at 50% 0%, #020617 33.16662609577179%, rgba(8, 31, 59, 1) 62.23050355911255%, rgba(62, 156, 146, 1) 100%)",
            }}
          >
            {/* Logo Animasi */}
            <motion.img
              src="/icon/moxlite-icon-1.svg"
              className="h-[36px] lg:h-[58px]"
              alt="Moxlite Stage Lighting Logo"
              initial={{ opacity: 0, y: 50 }} // Muncul dari bawah
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Konten Utama */}
      <div className="relative h-[calc(97vh-50px)] lg:h-[calc(100vh-60px)]">
        {/* Video Background */}
        <HLSVideo />
        {/* Overlay & Content */}
        <div className="absolute inset-0 bg-gray-950/40 flex flex-col justify-between px-[24px] lg:px-[120px] lg:pt-0">
          <div className="w-full h-10" />

          <motion.div
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.5 } } }}
          >
            {/* Main Heading - Only H1 for SEO */}
            <motion.div
              className="flex flex-wrap items-center"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, ease: "easeOut", delay: 1 }}
            >
              <h1 className="text-white text-[40px] lg:text-[72px] font-bold mr-0 lg:mr-[24px]">
                Reimagining
              </h1>
              <div className="bg-white w-fit px-[16px] lg:px-[24px]">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={texts[index]}
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -10, opacity: 0 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    className="text-black text-[40px] lg:text-[60px] font-bold inline-block"
                  >
                    {texts[index]}
                  </motion.span>
                </AnimatePresence>
              </div>
            </motion.div>

            {/* Secondary Heading - Changed to H2 for SEO */}
            <motion.h2
              className="text-white text-[40px] lg:text-[72px] font-bold"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, ease: "easeOut", delay: 1.2 }}
            >
              with Moxlite
            </motion.h2>

            {/* Bagian Ketiga - Button */}
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, ease: "easeOut", delay: 1.3 }}
            >
              <Link href={ROUTES.PRODUCT.path}>
                <button
                  className="bg-[#FAFAFA] hover:bg-neutral-400 py-[12px] px-[16px] my-[40px] lg:my-[24px] rounded-md cursor-pointer text-[14px] font-medium"
                  onClick={() => {
                    fireGAevent({
                      action: "homepage_explore_product_headline",
                    });
                  }}
                >
                  Explore product
                </button>
              </Link>
            </motion.div>
          </motion.div>

          <div className="w-full flex justify-center">
            <img src="/icon/chevrons-down.svg" className="h-[48px] pb-2" alt="Scroll Down" />
          </div>
        </div>
      </div>
    </>
  );
};

export default MainBanner;
