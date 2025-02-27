import Counter from "./Counter";
import { iCountingNumberProps } from "./types";

const CountingNumber = ({data}:iCountingNumberProps) => {
 

  return (
    <div className="grid grid-cols-1 ms:grid-col-2 md:grid-cols-3 gap-4 px-[24px] lg:px-[120px]">
      <Counter
        maxCount={data?.totalInstalledFixtures??0}
        bgImgPath="/image/bg_cnt_1.png"
        label="INSTALLED FIXTURES"
      />
      <Counter
        maxCount={data?.totalCitiesInIndonesia??0}
        bgImgPath="/image/bg_cnt_2.png"
        label="CITIES IN INDONESIA"
      />
      <Counter
        maxCount={data?.totalClients??0}
        bgImgPath="/image/bg_cnt_3.png"
        label="PLEASED CLIENTS"
      />
    </div>
  );
};

export default CountingNumber;
