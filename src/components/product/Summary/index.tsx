import StrapiTextRenderer from "@/components/common/StrapiTextRenderer";
import FeatureOverlay from "../FetureOverlay";
import Carousel from "./Carousel";
import { iSummary } from "./types";

const Summary = ({
  name,
  desc,
  gallery,
  discontinued,
  keyFeatures,
}: iSummary) => {
  return (
    <div className="p-[24px] lg:pt-[56px] lg:pb-[80px] lg:px-[120px] ">
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 lg:col-span-5">
          <Carousel imgUrls={gallery} />
        </div>
        <div className="col-span-12 lg:col-span-7">
          <div className="flex items-center mb-[16px]">
            <h1 className="font-bold text-[36px] mr-[16px]">{name}</h1>
            {discontinued && (
              <div className="bg-[#cbd5e1] px-[16px] py-[4px] text-[12px] text-[#64748B] font-medium h-fit">
                DISCONTINUE
              </div>
            )}
          </div>

          <StrapiTextRenderer content={desc} type="MARKDOWN" />

          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mt-[24px] lg:mt-[40px]">
            {keyFeatures.map((e, i) => (
              <FeatureOverlay
                key={i}
                name={e.name}
                desc={e.desc}
                logoUrl={e.logoUrl}
                bgUrl={e.bgUrl}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Summary;
