import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

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
            className="absolute h-screen inset-0 flex justify-center items-center z-200"
            style={{
              background:
                "radial-gradient(116.0069560407267% 139.71710502756912% at 50% 0%, #020617 33.16662609577179%, rgba(8, 31, 59, 1) 62.23050355911255%, rgba(62, 156, 146, 1) 100%)",
            }}
          >
            {/* 🔵 Logo Animasi: Muncul dari bawah sebelum overlay naik */}
            <motion.img
              src="/icon/moxlite-icon-1.svg"
              className="h-[36px] lg:h-[58px]"
              initial={{ opacity: 0, y: 50 }} // Muncul dari bawah
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }} // Delay sebelum overlay bergerak
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🔵 Konten Utama Setelah Overlay Hilang */}
      <div className="relative h-[calc(97vh-60px)] lg:h-[calc(100vh-60px)]">
        {/* Video Background */}
        <video
          className="absolute top-0 left-0 w-full h-full object-cover"
          autoPlay
          loop
          muted
          playsInline
        >
          <source src="/video/main_hero_banner.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Overlay & Content */}
        <div className="absolute inset-0 bg-gray-950/40 flex flex-col justify-between px-[24px] lg:px-[120px] lg:pt-0">
          <div className="w-full h-10" />
          <div>
            <div className="flex flex-wrap items-center">
              <h1 className="text-white text-[40px] lg:text-[72px] font-bold mr-0 lg:mr-[24px]">
                Reimagining
              </h1>
              <div className="bg-white w-fit px-[16px] lg:px-[24px]">
                <AnimatePresence mode="wait">
                  <motion.h1
                    key={texts[index]}
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -10, opacity: 0 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    className="text-black text-[40px] lg:text-[60px] font-bold"
                  >
                    {texts[index]}
                  </motion.h1>
                </AnimatePresence>
              </div>
            </div>

            <h1 className="text-white text-[40px] lg:text-[72px] font-bold">
              with Moxlite
            </h1>

            <button className="bg-[#FAFAFA] hover:bg-neutral-400 py-[12px] px-[16px] my-[40px] lg:my-[24px] rounded-md cursor-pointer text-[14px] font-medium">
              Explore product
            </button>
          </div>

          <div className="w-full flex justify-center">
            <img src="/icon/chevrons-down.svg" className="h-[48px] pb-2" />
          </div>
        </div>
      </div>
    </>
  );
};

export default MainBanner;
