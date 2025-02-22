import { specItemsMaps } from "./schema";
import SpecItem from "./SpecItem";

const TechSpec = () => {
  return (
    <>
      <div
        id="tech-specs"
        className="px-[24px] py-[40px] lg:px-[120px] lg:py-[80px]"
      >
        <h2 className="text-[30px] text-black font-bold mb-[40px]">
          Tech Specs
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 lg:gap-8">
          <div className="border-0 lg:border-r lg:border-[#CBD5E1]">
            {specItemsMaps.slice(0, 7).map((e, i) => (
              <SpecItem
                key={i}
                title={e.title}
                items={e.items}
                iconPath={e.iconPath}
              />
            ))}
          </div>
          <div>
            {specItemsMaps.slice(8, 12).map((e, i) => (
              <SpecItem
                key={i}
                title={e.title}
                items={e.items}
                iconPath={e.iconPath}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="border border-[#CBD5E1] mx-[24px] lg:mx-[120px]" />
    </>
  );
};

export default TechSpec;
