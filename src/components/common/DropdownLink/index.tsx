import { useState } from "react";
import { motion } from "framer-motion";
import { iDropdownLink } from "./types";
import { useEffect } from "react";

const DropdownLink = ({
  options,
  defaultValue,
  placeholder = "Please select an option",
}: iDropdownLink) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<{
    label: string;
    docId: string;
  } | null>(null);

  useEffect(() => {
    if (!selectedOption) return;

    const targetElement = document.getElementById(selectedOption.docId);
    if (targetElement) {
      const targetPosition =
        targetElement.getBoundingClientRect().top + window.scrollY;
      const startPosition = window.scrollY;
      const distance = targetPosition - startPosition - 100;
      const duration = 500; // 0.5 detik
      let startTime: number | null = null;

      const smoothScroll = (currentTime: number) => {
        if (!startTime) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / duration, 1);

        window.scrollTo(0, startPosition + distance * easeInOutQuad(progress));

        if (timeElapsed < duration) {
          requestAnimationFrame(smoothScroll);
        }
      };

      const easeInOutQuad = (t: number) =>
        t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

      requestAnimationFrame(smoothScroll);
    }
  }, [JSON.stringify(selectedOption)]);

  return (
    <div className="relative w-full">
      <button
        className={`cursor-pointer w-full px-4 py-2 ${
          selectedOption ? "text-black" : "text-gray-500"
        }  bg-white border border-gray-300 rounded-lg flex justify-between items-center`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedOption
          ? selectedOption.label
          : defaultValue
          ? options[0].label
          : placeholder}

        <motion.img
          src="/icon/chevron-down.svg"
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="w-4 h-4"
        />
      </button>
      {isOpen && (
        <motion.ul
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="absolute w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-md overflow-hidden"
        >
          {options.map((e, i) => (
            <li
              key={i}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                setSelectedOption(e);
                setIsOpen(false);
              }}
            >
              {e.label}
            </li>
          ))}
        </motion.ul>
      )}
    </div>
  );
};

export default DropdownLink;
