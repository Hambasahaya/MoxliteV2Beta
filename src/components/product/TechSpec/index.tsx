import { specItems } from "./schema";
import SpecItem from "./SpecItem";

const TechSpec = () => {
  return (
    <div
      id="tech-specs"
      className="px-[24px] py-[40px] lg:px-[120px] lg:py-[80px] border border-[#CBD5E1]"
    >
      <h2 className="text-[30px] text-black font-bold mb-[40px]">Tech Specs</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 lg:gap-8">
        <div className="border-0 lg:border-r lg:border-[#CBD5E1]">
          <SpecItem title={specItems[0].title} items={specItems[0].items} />
          <SpecItem title={specItems[0].title} items={specItems[0].items} />
          <SpecItem title={specItems[0].title} items={specItems[0].items} />
          <SpecItem title={specItems[0].title} items={specItems[0].items} />
        </div>
        <div>
          <SpecItem title={specItems[0].title} items={specItems[0].items} />
          <SpecItem title={specItems[0].title} items={specItems[0].items} />
          <SpecItem title={specItems[0].title} items={specItems[0].items} />
          <SpecItem title={specItems[0].title} items={specItems[0].items} />
        </div>
      </div>
    </div>
  );
};

export default TechSpec;
