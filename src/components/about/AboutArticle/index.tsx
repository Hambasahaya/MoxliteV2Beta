import StrapiTextRenderer from "@/components/common/StrapiTextRenderer";
import { iAboutArticleProps } from "./types";

const AboutArticle = ({data}: iAboutArticleProps) => {
  return (
    <div
      className="bg-[#F8FAFC] px-[24px] py-[40px] lg:px-[120px] lg:py-[80px]"
      id="about"
    >
      <StrapiTextRenderer content={data?.content??""} type="HTML" />
     
    </div>
  );
};

export default AboutArticle;
