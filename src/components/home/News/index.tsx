import NewsCard from "../NewsCard";

const News = () => {
  return (
    <div className="p-[24px] lg:p-[120px] bg-[#F8FAFC]">
      <div className="flex justify-between items-center font-bold mb-[40px]">
        <div>
          <h2 className="text-[36px] lg:text-[48px] font-bold">News</h2>
        </div>
        <div>
          <p className="text-[14px] cursor-pointer font-medium">View All</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 lg:grid-cols-3 gap-6">
        <NewsCard />
        <NewsCard />
        <NewsCard />
      </div>
    </div>
  );
};

export default News;
