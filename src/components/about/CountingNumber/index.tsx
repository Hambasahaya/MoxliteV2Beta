import Counter from "./Counter";

const CountingNumber = () => {
  return (
    <div className="grid grid-cols-1 ms:grid-col-2 md:grid-cols-3 gap-4 px-[24px] lg:px-[120px]">
      <Counter
        maxCount={12000}
        bgImgPath="/image/bg_cnt_1.png"
        label="INSTALLED FIXTURES"
      />
      <Counter
        maxCount={50}
        bgImgPath="/image/bg_cnt_2.png"
        label="CITIES IN INDONESIA"
      />
      <Counter
        maxCount={1000}
        bgImgPath="/image/bg_cnt_3.png"
        label="PLEASED CLIENTS"
      />
    </div>
  );
};

export default CountingNumber;
