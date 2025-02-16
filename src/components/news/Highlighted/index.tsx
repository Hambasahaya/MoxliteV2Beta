const Highlighted = () => {
  return (
    <div className="m-[24px] lg:my-[80px] lg:mx-[120px] bg-[#020617] text-[#F8FAFC] grid grid-cols-12 gap-0 cursor-pointer hover:shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.7)]">
      <div className="min-h-[228px] lg:min-h-[400px] max-h-full col-span-12 lg:col-span-6">
        <img src="/image/news_2.png" className="size-full object-cover" />
      </div>
      <div className="col-span-12 lg:col-span-6">
        <div className="p-[24px] lg:p-[40px] flex flex-col justify-center h-full">
          <p className="text-[#94A3B8] text-[14px] font-medium mb-[16px]">
            JAN 12, 2025
          </p>
          <h2 className="text-[24px] lg:text-[30px] font-bold">
            PROLIGHTS Enhances SÖZCÜ TV's Istanbul Studios with Modern LED
            Technology
          </h2>
          <p className="text-[16px] font-medium hidden sm:flex mt-[16px]">
            SÖZCÜ TV, one of Turkey's prominent news channels headquartered in
            Istanbul, has upgraded its studio lighting to enhance its visual
            appeal and broadcast quality.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Highlighted;
