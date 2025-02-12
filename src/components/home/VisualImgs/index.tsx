import { cardMetadata } from "./schema";

const VisualImgs = () => {
  return (
    <div
      className="p-[24px] md:p-[120px] text-white"
      style={{
        background:
          "radial-gradient(116.01% 139.72% at 50% 100%, #020617 33.17%, #081F3B 62.23%, #3E9C92 100%)",
      }}
    >
      <div className="flex flex-col items-center">
        <h2 className="text-[36px] md:text-[48px] font-bold mb-[24px]">
          Visualizing Imaginations
        </h2>
        <p className="text-[20px] font-medium text-center">
          Reimagining Performance Spaces with Moxlite. From concert to intimate
          clubs, every stage deserves to shine. Moxlite’s versatile lighting
          solutions are designed to adapt and elevate, creating the perfect
          ambiance for any venue. With Moxlite, every performance is a
          masterpiece.
        </p>
        <button className="bg-[#FAFAFA] hover:bg-neutral-400 text-black py-[12px] px-[16px] mt-[40px] md:mt-[29px] rounded-md cursor-pointer text-[14px] font-medium">
          Explore product
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-[24px] md:mt-[40px]">
        {cardMetadata.map((e, i) => (
          <div
            key={i}
            className="h-[80px] w-full flex items-center justify-center bg-cover"
            style={{ backgroundImage: `url(${e.bgPath})` }}
          >
            <div className="bg-gray-950/40 size-full flex items-center justify-center px-2">
              <h3 className="text-white text-[24px] font-bold text-center">
                {e.title}
              </h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VisualImgs;
