import { iSpecItem } from "./types";

const SpecItem = ({ title, items, iconPath }: iSpecItem) => {
  return (
    <div className="mb-[40px]">
      <div className="flex items-center mb-[16px]">
        <img className="size-[24px]" src={iconPath} />
        <p className="text-black text-[20px] font-bold ml-[16px]">{title}</p>
      </div>

      {items.map((text, i) => (
        <div className="pl-[40px] flex items-center" key={i}>
          <div className="size-[5px] rounded-full bg-gray-500 mr-2" />
          <p className="text-[#666666] text-[16px]">{text}</p>
        </div>
      ))}
    </div>
  );
};

export default SpecItem;
