import { useState } from "react";
import { iPagination } from "./types";

const MobilePagination = ({ pageCount, onPageChange }: iPagination) => {
  const [statePage, setStatePage] = useState(1);

  const nextPage = () => {
    if (statePage == pageCount) return;
    onPageChange(statePage + 1);
    setStatePage((prev) => (prev < pageCount ? prev + 1 : prev));
  };

  const prevPage = () => {
    if (statePage == 1) return;
    onPageChange(statePage - 1);
    setStatePage((prev) => (prev > 1 ? prev - 1 : prev));
  };

  return (
    <div className="flex sm:hidden justify-between w-full">
      <div
        className={`flex items-center ${
          statePage == 1 ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
        }`}
        onClick={prevPage}
      >
        <img src="/icon/chevron-left.svg" className="size-[16px] mr-[4px]" />
        <p className="text-[20px] font-semibold text-black">Previous</p>
      </div>

      <div
        className={`flex items-center ${
          statePage == pageCount
            ? "opacity-50 cursor-not-allowed"
            : "cursor-pointer"
        }`}
        onClick={nextPage}
      >
        <p className="text-[20px] font-semibold text-black">Next</p>
        <img src="/icon/chevron-right.svg" className="size-[16px] pl-[4px]" />
      </div>
    </div>
  );
};

export default MobilePagination;
