import { useState } from "react";
import { motion } from "framer-motion";
import { iAccordion } from "./types";

const Accordion = ({ title, content }: iAccordion) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-t border-gray-300">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center py-[24px] cursor-pointer"
      >
        <h4 className="font-semibold text-[18px]">{title}</h4>
        {isOpen ? (
          <img src="/icon/chevron-up-small.svg" className="size-[16px]" />
        ) : (
          <img src="/icon/chevron-down-small.svg" className="size-[16px]" />
        )}
      </button>

      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="overflow-hidden"
      >
        <p className="text-[#09090B] text-[16px] pb-[24px]">{content}</p>
      </motion.div>
    </div>
  );
};

export default Accordion;
