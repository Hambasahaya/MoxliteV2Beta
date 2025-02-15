import { useState } from "react";
import { motion } from "framer-motion";
import { tabs, files } from "./schema";
import Dropdown from "@/components/common/Dropdown";

const TechDocs = () => {
  const [activeTab, setActiveTab] = useState(tabs[0]);

  return (
    <div
      id="tech-docs"
      className="px-[24px] py-[40px] lg:px-[120px] lg:py-[80px] border border-[#CBD5E1]"
    >
      <h2 className="text-[30px] text-black font-bold mb-[40px]">
        Technical Documents
      </h2>

      <div className="w-full bg-[#CBD5E1] p-2 rounded-lg hidden lg:flex justify-between relative">
        {tabs.map((tab) => (
          <div
            key={tab.value}
            className="relative px-2 grow cursor-pointer"
            onClick={() => setActiveTab(tab)}
          >
            {activeTab === tab && (
              <motion.div
                layoutId="active-tab"
                className="absolute inset-0 bg-white rounded-md shadow-md z-0"
                transition={{ duration: 0.2 }}
              />
            )}
            <div
              className={`relative px-6 py-2 text-[16px] transition-colors z-10 text-center ${
                activeTab === tab
                  ? "text-black font-bold"
                  : "text-[#334155] font-medium"
              }`}
            >
              {tab.label}
            </div>
          </div>
        ))}
      </div>

      <div className="flex lg:hidden">
        <Dropdown
          selectedValue={activeTab}
          options={tabs}
          defaultValue
          onChange={(tab) => setActiveTab(tab)}
        />
      </div>

      <div className="grid grid-cols-12 gap-0 border-b border-gray-500/30 mt-[40px]">
        <div className="col-span-1 hidden lg:flex" />
        <div className="col-span-12 lg:col-span-6 p-[14px] text-[#71717A] text-[14px]">
          Filename
        </div>
        <div className="col-span-3 hidden lg:flex p-[14px] text-[#71717A] text-[14px]">
          File Size
        </div>
        <div className="col-span-2 hidden lg:flex" />
      </div>

      {files.map((e, i) => (
        <div className="grid grid-cols-12 gap-0" key={i}>
          <div className="col-span-1 hidden lg:flex p-[14px] font-medium text-[#09090B] text-[14px]">
            {i + 1}
          </div>
          <div className="col-span-8 lg:col-span-6 p-[14px] font-medium text-[#09090B] text-[14px]">
            {e.name}
          </div>
          <div className="col-span-3 hidden lg:flex p-[14px] font-medium text-[#09090B] text-[14px]">
            {e.size}
          </div>
          <div className="col-span-4 lg:col-span-2 p-[14px] font-medium text-[#0284C7] text-[14px] w-full text-end cursor-pointer hover:font-bold hover:underline">
            Download
          </div>
        </div>
      ))}
    </div>
  );
};

export default TechDocs;
