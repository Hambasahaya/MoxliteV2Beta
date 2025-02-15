"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const images = [
  "/image/product_1.png",
  "/image/product_2.png",
  "/image/product_3.png",
  "/image/product_2.png",
];

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

const Carousel = () => {
  const [index, setIndex] = useState(0);
  const directionRef = useRef(1); // 1: next, -1: prev

  const nextSlide = () => {
    directionRef.current = 1;
    setIndex((prev) => (prev + 1) % images.length);
  };

  const prevSlide = () => {
    directionRef.current = -1;
    setIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="relative w-full max-w-lg mx-auto overflow-hidden">
      {/* Carousel */}
      <div className="relative w-full h-[300px] lg:h-[480px]">
        <AnimatePresence custom={directionRef.current}>
          <motion.img
            key={index}
            src={images[index]}
            className="absolute w-full h-full object-contain rounded-lg"
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
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 p-2 bg-gray-300 rounded-full">
        {images.map((_, i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full ${
              i === index ? "bg-white" : "bg-gray-200"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel;
