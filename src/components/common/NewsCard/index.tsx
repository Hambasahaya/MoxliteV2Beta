const NewsCard = () => {
  return (
    <div className="border border-[#CBD5E1] cursor-pointer bg-white hover:bg-black text-black hover:text-white hover:shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.3)]">
      <img src="/image/news_1.png" className="h-[254px] w-full object-cover" />
      <div className="py-[27px] px-[24px]">
        <p className="text-[#64748B] text-[14px] font-medium">JAN 28, 2025</p>
        <h2 className="font-bold text-[24px] my-[16px]">
          Moxlite Helps Lift the Mask in South Africa
        </h2>
        <p className="font-medium text-[16px]">
          The second series of The Masked Singer SA was one of the most
          successful music TV shows of 2024...
        </p>
      </div>
    </div>
  );
};

export default NewsCard;
