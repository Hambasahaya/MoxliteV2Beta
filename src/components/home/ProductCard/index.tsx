const ProductCard = () => {
  return (
    <div className="border border-[#CBD5E1] flex flex-col items-center cursor-pointer bg-white">
      <img
        src="/image/product_1.png"
        className="h-[200px] w-[200px] mt-[24px] mb-[40px]"
      />
      <div className="bg-white hover:bg-black text-black hover:text-white p-[16px] w-full">
        <p className="font-bold text-[20px]">SCARET I</p>
        <p className="text-[16px]">Moving Heads</p>
      </div>
    </div>
  );
};

export default ProductCard;
