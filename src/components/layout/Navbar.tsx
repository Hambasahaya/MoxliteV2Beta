import { useState } from "react";

const Navbar = () => {
  const [isExpand, setIsExpand] = useState(false);

  return (
    <>
      <div className="sticky top-0">
        <div className="bg-black text-[#f8fafc] px-[120px] py-[22px] hidden md:flex justify-between items-center">
          <img src="/icon/moxlite-icon-1.svg" className="h-[20px]" />
          <div className="flex justify-between">
            <div className="pl-[36px] font-[500] text-[15px] cursor-pointer leading-[16.94px]">
              Home
            </div>
            <div className="pl-[36px] font-[500] text-[15px] cursor-pointer leading-[16.94px]">
              About
            </div>
            <div className="pl-[36px] font-[500] text-[15px] cursor-pointer leading-[16.94px]">
              Product
            </div>
            <div className="pl-[36px] font-[500] text-[15px] cursor-pointer leading-[16.94px]">
              Project
            </div>
            <div className="pl-[36px] font-[500] text-[15px] cursor-pointer leading-[16.94px]">
              News
            </div>
            <div className="pl-[36px] font-[500] text-[15px] cursor-pointer leading-[16.94px]">
              Contact
            </div>
            <div className="pl-[36px] font-[500] text-[15px] cursor-pointer leading-[16.94px]">
              FAQ
            </div>
          </div>
        </div>

        <div className="bg-black text-[#f8fafc] px-[20px] py-[24px] flex-none md:hidden">
          <div className="flex justify-between items-center">
            <img src="/icon/moxlite-icon-1.svg" className="h-[20px]" />
            <img
              src="/file.svg"
              className="h-[20px]"
              onClick={() => {
                setIsExpand(!isExpand);
              }}
            />
          </div>

          <div
            className={`px-[20px] pb-[10px] overflow-hidden transition-all duration-500 ${
              isExpand
                ? "max-h-[390px] opacity-100 pt-[40px]"
                : "max-h-0 opacity-0 pt-[0px]"
            }`}
          >
            <div
              className={`pb-[10px] font-[500] text-[15px] cursor-pointer leading-[16.94px] overflow-hidden transition-all duration-500 ${
                isExpand ? "max-h-[200px] opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              Home
            </div>
            <div
              className={`pb-[10px] font-[500] text-[15px] cursor-pointer leading-[16.94px] overflow-hidden transition-all duration-500 ${
                isExpand ? "max-h-[200px] opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              About
            </div>
            <div
              className={`pb-[10px] font-[500] text-[15px] cursor-pointer leading-[16.94px] overflow-hidden transition-all duration-500 ${
                isExpand ? "max-h-[200px] opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              Product
            </div>
            <div
              className={`pb-[10px] font-[500] text-[15px] cursor-pointer leading-[16.94px] overflow-hidden transition-all duration-500 ${
                isExpand ? "max-h-[200px] opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              Project
            </div>
            <div
              className={`pb-[10px] font-[500] text-[15px] cursor-pointer leading-[16.94px] overflow-hidden transition-all duration-500 ${
                isExpand ? "max-h-[200px] opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              News
            </div>
            <div
              className={`pb-[10px] font-[500] text-[15px] cursor-pointer leading-[16.94px] overflow-hidden transition-all duration-500 ${
                isExpand ? "max-h-[200px] opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              Contact
            </div>
            <div
              className={`pb-[10px] font-[500] text-[15px] cursor-pointer leading-[16.94px] overflow-hidden transition-all duration-500 ${
                isExpand ? "max-h-[200px] opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              FAQ
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
