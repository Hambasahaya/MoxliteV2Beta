import StrapiTextRenderer from "@/components/common/StrapiTextRenderer";
import { iSpecItem } from "./types";

const SpecItem = ({ title, content, iconPath }: iSpecItem) => {
  return (
    <div className="mb-[40px]">
      <div className="flex items-center mb-[16px]">
        <img className="size-[24px]" src={iconPath} />
        <p className="text-black text-[20px] font-bold ml-[16px]">{title}</p>
      </div>

      <div className="pl-[40px]">
        <StrapiTextRenderer content={content} type="MARKDOWN" />
      </div>
    </div>
  );
};

export default SpecItem;
