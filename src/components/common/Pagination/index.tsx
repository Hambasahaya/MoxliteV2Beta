import ReactPaginate from "react-paginate";
import { iPagination } from "./types";
import MobilePagination from "./MobilePagination";

const Pagination = ({ pageCount, onPageChange }: iPagination) => {
  return (
    <>
      <div className="hidden sm:flex">
        <ReactPaginate
          previousLabel={
            <div className="flex items-center mr-2 cursor-pointer">
              <img
                src="/icon/chevron-left.svg"
                className="size-[16px] mr-[4px]"
              />
              <p className="text-[20px] font-semibold text-black">Previous</p>
            </div>
          }
          nextLabel={
            <div className="flex items-center cursor-pointer">
              <p className="text-[20px] font-semibold text-black">Next</p>
              <img
                src="/icon/chevron-right.svg"
                className="size-[16px] pl-[4px]"
              />
            </div>
          }
          breakLabel="..."
          pageCount={pageCount}
          marginPagesDisplayed={1}
          pageRangeDisplayed={2}
          onPageChange={({ selected }) => {
            onPageChange(selected + 1);
          }}
          containerClassName="flex items-center space-x-2 text-black"
          pageClassName="cursor-pointer text-[14px]"
          pageLinkClassName="px-3 py-1"
          activeClassName="bg-white rounded-md p-1 border border-gray-300"
          breakClassName="text-gray-500"
          disabledClassName="opacity-50 cursor-not-allowed"
        />
      </div>

      <MobilePagination {...{ pageCount, onPageChange }} />
    </>
  );
};

export default Pagination;
