import { fireGAevent } from "@/lib/gtag";
import Link from "next/link";

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
          <Link
            onClick={() => {
              fireGAevent({ action: "Footer_instagram" });
            }}
            href={"https://www.instagram.com/moxlite.prolight/"}
            passHref
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src="/icon/instagram.svg" className="h-[20px] mr-[27px]" />
          </Link>
          <Link
            onClick={() => {
              fireGAevent({ action: "Footer_youtube" });
            }}
            href={"https://www.youtube.com/channel/UCJtLlfDGiT_KiAN261740xA"}
            passHref
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src="/icon/youtube.svg" className="h-[20px] mr-[27px]" />
          </Link>
          <Link
            onClick={() => {
              fireGAevent({ action: "Footer_Ecommerce" });
            }}
            href={"https://tokopedia.link/zWC7yylrNHb"}
            passHref
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src="/icon/shopping-bag.svg" className="h-[20px] mr-[27px]" />
          </Link>
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
        <Link
          onClick={() => {
            fireGAevent({ action: "Footer_Whatsapp" });
          }}
          href={
            "https://wa.me/6285215676696?text=Hi Moxlite Team, just visited your website, and we would like to learn more about moxlite products!"
          }
          passHref
          target="_blank"
          rel="noopener noreferrer"
        >
          <div className="mb-[16px] flex">
            <img src="/icon/whatsapp.svg" className="h-[20px] mr-1" />
            <p>+62 852 1567 6696</p>
          </div>
        </Link>

        <Link
          onClick={() => {
            fireGAevent({ action: "Footer_email" });
          }}
          href={
            "mailto:info@moxlite.com?subject=Need Support&body=Hi Moxlite Team, just visited your website, and we would like to learn more about moxlite products!"
          }
          passHref
          target="_blank"
          rel="noopener noreferrer"
        >
          <div className="mb-[16px] flex">
            <img src="/icon/mail.svg" className="h-[20px] mr-1" />
            <p>info@moxlite.com</p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Footer;
