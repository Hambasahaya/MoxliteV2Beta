const GoboAndColors = ({ imgUrl }: { imgUrl: string }) => {
  return (
    <>
      <div
        id="gobo-colors"
        className="px-[24px] py-[40px] lg:px-[120px] lg:py-[80px]"
      >
        <h2 className="text-[30px] text-black font-bold mb-[40px]">
          Gobo & Colors
        </h2>

        <img src={imgUrl} className="w-full" />
      </div>
      <div className="border border-[#CBD5E1] mx-[24px] lg:mx-[120px]" />
    </>
  );
};

export default GoboAndColors;
