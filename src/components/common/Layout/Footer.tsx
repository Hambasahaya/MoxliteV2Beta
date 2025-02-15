const Footer = () => {
  return (
    <div className="px-[24px] py-[40px] lg:px-[120px] lg:py-[120px] flex flex-col lg:flex-row lg:justify-between text-[#f8fafc] text-[16px] font-medium leading-[1.2] bg-[radial-gradient(65.83%_240.71%_at_50%_-18.88%,#030408_40%,#081F3B_60%,#3E9C92_92.17%)]">
      <div className="max-w-[400px]">
        <img src="/icon/moxlite-icon-1.svg" className="h-[20px]" />
        <p className="my-[24px]">
          Moxlite provides lighting solutions for stage performances,
          architectural installations, and entertainment venues, offering a wide
          range of fixtures from moving heads to static washes.
        </p>
        <div className="flex items-center">
          <img src="/icon/instagram.svg" className="h-[20px] mr-[27px]" />
          <img src="/icon/youtube.svg" className="h-[20px] mr-[27px]" />
          <img src="/icon/shopping-bag.svg" className="h-[20px] mr-[27px]" />
        </div>
      </div>

      <div className="max-w-[400px] mt-[40px] lg:mt-0">
        <h4 className="mb-[16px] font-bold leading-[120%] text-[24px]">
          Contact
        </h4>

        <div className="mb-[16px] flex">
          <img src="/icon/location_on.svg" className="h-[20px] mr-1" />
          <p>
            Rukan Crown, Jl. Green Lake City Boulevard No.25, RT.005/RW.008,
            Petir, Kec. Cipondoh, Kota Tangerang, Banten 15147
          </p>
        </div>

        <div className="mb-[16px] flex">
          <img src="/icon/whatsapp.svg" className="h-[20px] mr-1" />
          <p>+62 821 1654 9906</p>
        </div>

        <div className="mb-[16px] flex">
          <img src="/icon/mail.svg" className="h-[20px] mr-1" />
          <p>info@moxlite.com</p>
        </div>
      </div>
    </div>
  );
};

export default Footer;
