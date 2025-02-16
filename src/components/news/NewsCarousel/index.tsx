import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const images = ["/image/news_1.png", "/image/news_2.png"];

const variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 100 : -100,
    opacity: 0,
  }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({
    x: direction > 0 ? -100 : 100,
    opacity: 0,
  }),
};

const NewsCarousel = () => {
  const [index, setIndex] = useState(0);
  const directionRef = useRef(1); // 1: next, -1: prev
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const nextSlide = () => {
    directionRef.current = 1;
    setIndex((prev) => (prev + 1) % images.length);
  };

  const prevSlide = () => {
    directionRef.current = -1;
    setIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  useEffect(() => {
    const startAutoSlide = () => {
      intervalRef.current = setInterval(nextSlide, 2000);
    };

    startAutoSlide();

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  // Pause saat hover
  const stopAutoSlide = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const resumeAutoSlide = () => {
    stopAutoSlide();
    intervalRef.current = setInterval(nextSlide, 2000);
  };

  return (
    <div
      className="relative w-full lg:max-w-[640px] overflow-hidden"
      onMouseEnter={stopAutoSlide}
      onMouseLeave={resumeAutoSlide}
    >
      <div className="relative w-full h-[228px] sm:h-[300px] lg:h-[426px]">
        <AnimatePresence custom={directionRef.current}>
          <motion.img
            key={index}
            src={images[index]}
            className="absolute w-full h-full object-cover"
            custom={directionRef.current}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.5 }}
          />
        </AnimatePresence>
      </div>

      {/* Tombol Next & Prev */}
      <img
        onClick={prevSlide}
        className="cursor-pointer absolute left-2 top-1/2 -translate-y-1/2 bg-gray-400/50 h-[40px] rounded-full hover:shadow-lg"
        src="/icon/prev.svg"
      />
      <img
        onClick={nextSlide}
        className="cursor-pointer absolute right-2 top-1/2 -translate-y-1/2 bg-gray-400/50 h-[40px] rounded-full hover:shadow-lg"
        src="/icon/next.svg"
      />

      {/* Indikator Dots */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2 p-2">
        {images.map((_, i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full ${
              i === index ? "bg-white" : "bg-gray-500"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default NewsCarousel;
