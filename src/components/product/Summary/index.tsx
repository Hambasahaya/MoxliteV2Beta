import Carousel from "./Carousel";

const Summary = () => {
  return (
    <div className="p-[24px] lg:pt-[56px] lg:pb-[80px] lg:px-[120px] ">
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 lg:col-span-5">
          <Carousel />
        </div>
        <div className="col-span-12 lg:col-span-7">
          <div className="flex items-center mb-[16px]">
            <h1 className="font-bold text-[36px] mr-[16px]">SCARLET I</h1>
            <div className="bg-[#cbd5e1] px-[16px] py-[4px] text-[12px] text-[#272c34] font-medium h-fit">
              DISCONTINUE
            </div>
          </div>

          <p>
            Experience the mesmerizing charm of Scarlet I, the ultimate LED
            light fixture for vibrant and unforgettable event lighting. With its
            potent 200W output and an 80W Osram LED chip, Scarlet I ensures
            bright and accurate illumination. The additional 40*0.5W RGB 5050SMD
            LEDs amplify the allure with a striking halo effect.Embrace the
            dynamic PAN and TILT functions for flexible light shows whether you
            prefer DMX512 control, self-propelled, or sound activation modes,
            Scarlet I easily caters to your preference.Perfect for concerts,
            stage shows, or architectural highlights, Scarlet I takes your
            events from ordinary to extraordinary with its captivating light
            display. Illuminate your world with the unmatched radiance of
            Scarlet I.
          </p>

          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mt-[24px] lg:mt-[40px]">
            <div className="border border-[#CBD5E1] bg-white px-[14px] py-[13px] flex flex-col items-center">
              <img
                src="/icon/signal.svg"
                className="size-[44px] mb-[4px] object-contain"
              />
              <p className="font-bold text-[#020617] text-[12px]">NFC</p>
            </div>
            <div className="border border-[#CBD5E1] bg-white px-[14px] py-[13px] flex flex-col items-center">
              <img
                src="/icon/signal.svg"
                className="size-[44px] mb-[4px] object-contain"
              />
              <p className="font-bold text-[#020617] text-[12px]">NFC</p>
            </div>
            <div className="border border-[#CBD5E1] bg-white px-[14px] py-[13px] flex flex-col items-center">
              <img
                src="/icon/signal.svg"
                className="size-[44px] mb-[4px] object-contain"
              />
              <p className="font-bold text-[#020617] text-[12px]">NFC</p>
            </div>
            <div className="border border-[#CBD5E1] bg-white px-[14px] py-[13px] flex flex-col items-center">
              <img
                src="/icon/signal.svg"
                className="size-[44px] mb-[4px] object-contain"
              />
              <p className="font-bold text-[#020617] text-[12px]">NFC</p>
            </div>
            <div className="border border-[#CBD5E1] bg-white px-[14px] py-[13px] flex flex-col items-center">
              <img
                src="/icon/signal.svg"
                className="size-[44px] mb-[4px] object-contain"
              />
              <p className="font-bold text-[#020617] text-[12px]">NFC</p>
            </div>
            <div className="border border-[#CBD5E1] bg-white px-[14px] py-[13px] flex flex-col items-center">
              <img
                src="/icon/signal.svg"
                className="size-[44px] mb-[4px] object-contain"
              />
              <p className="font-bold text-[#020617] text-[12px]">NFC</p>
            </div>
            <div className="border border-[#CBD5E1] bg-white px-[14px] py-[13px] flex flex-col items-center">
              <img
                src="/icon/signal.svg"
                className="size-[44px] mb-[4px] object-contain"
              />
              <p className="font-bold text-[#020617] text-[12px]">NFC</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Summary;
