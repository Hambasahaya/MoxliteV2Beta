const ProductDistribution = () => {
  return (
    <div
      id="distributions"
      className="px-[24px] py-[40px] lg:px-[120px] lg:pt-[80px] lg:pb-[120px]"
    >
      <h1 className="font-bold text-[36px] lg:text-[48px] text-black mb-[18px] lg:mb-[40px]">
        Product Distribution
      </h1>

      <div className="w-full h-[600px] mt-[16px] lg:mt-[40px]">
        <iframe
          src="https://www.google.com/maps/d/embed?mid=1pX0Yjf754qaGkozzB8qQTJ8ZykLVpe0&ehbc=2E312F"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
    </div>
  );
};

export default ProductDistribution;
