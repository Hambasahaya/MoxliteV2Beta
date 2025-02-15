import { useState } from "react";
import { motion } from "framer-motion";
import { iDropdown } from "./types";

const Dropdown = ({
  selectedValue,
  options,
  placeholder = "Please select an option",
  onChange,
}: iDropdown) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedLabel = selectedValue
    ? options.filter((e) => e.value == selectedValue.value)[0]?.label
    : null;

  return (
    <div className="relative w-full">
      <button
        className={`cursor-pointer w-full px-4 py-2 text-[14px] ${
          selectedLabel ? "text-black" : "text-gray-500"
        }  bg-white border border-gray-300 rounded-lg flex justify-between items-center`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedLabel ? selectedLabel : placeholder}

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
                onChange(e);
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

export default Dropdown;
