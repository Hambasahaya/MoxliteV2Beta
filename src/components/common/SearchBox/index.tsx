const SearchBox = () => {
  return (
    <div className="relative w-full">
      <input
        type="text"
        placeholder="Search by Name"
        className="w-full h-[40px] px-3 pr-10 text-[14px] text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <img
        src="/icon/search.svg"
        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 size-[20px]"
      />
    </div>
  );
};

export default SearchBox;
