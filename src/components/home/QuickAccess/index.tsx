import { motion, useInView } from "framer-motion";
import { useRef } from "react";

interface QuickAccessCard {
  icon: string;
  title: string;
  description: string;
}


const QuickAccessCards: QuickAccessCard[] = [
  {
    icon: "/icon/book-down_moxlite.svg",
    title: "Catalog",
    description: "Explore Moxlite Partners for sales, rental, service and solutions",
  },
  {
    icon: "/icon/package-plus_moxlite.svg",
    title: "Software",
    description: "Find your recent downloads and available updates for Moxlite software",
  },
  {
    icon: "/icon/messages-square_export.svg",
    title: "Support",
    description: "Looking for help or information? Get in touch!",
  },

];

const QuickAccess = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full mx-auto"
    >
      {QuickAccessCards.map((card, index) => (
        <motion.div
          key={index}
          whileHover={{ y: -5 }}
          className="group p-6 rounded-lg bg-[#0f172a] border border-[#1e293b] cursor-pointer transition-all duration-300 hover:bg-[#D3D3D3]/[.12] hover:border-[#D3D3D3]/[.15]"
        >
          <div className="flex items-center gap-4 mb-8">
            <img src={card.icon} alt={card.title} className="w-16 h-16 flex-shrink-0" />
            <h3 className="text-white text-lg font-semibold group-hover:text-black transition-colors duration-300">
              {card.title}
            </h3>
          </div>
          <p className="text-[#94a3b8] text-sm group-hover:text-black/80 transition-colors duration-300">
            {card.description}
          </p>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default QuickAccess;
