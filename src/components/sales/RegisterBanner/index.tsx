import Link from "next/link";
import { ROUTES } from "@/constant/ROUTES";
import { fireGAevent } from "@/lib/gtag";

const RegisterBanner = () => {
  return (
    <div
      className="p-[16px] lg:p-[40px] text-white w-full"
      style={{
        background:
          "radial-gradient(116.01% 139.72% at 50% 100%, #020617 33.17%, #081F3B 62.23%, #3E9C92 100%)",
      }}
    >
      <div className="flex flex-col items-center">
        <h3 className="text-[24px] lg:text-[30px] font-bold mb-[10px] text-center">
          Join as a Sales Partner
        </h3>
        <p className="text-[14px] lg:text-[16px] font-medium text-center">
          If you&apos;re interested in joining us as a sales partner, the first
          step is to register directly
        </p>
        <Link
          onClick={() => {
            fireGAevent({
              action: "register_sales_partner",
            });
          }}
          href={ROUTES.REGISTER_SALES.path}
        >
          <button className="bg-[#FAFAFA] hover:bg-neutral-400 text-black py-[12px] px-[16px] mt-[10px]  rounded-md cursor-pointer text-[14px] font-medium">
            Register
          </button>
        </Link>
      </div>
    </div>
  );
};

export default RegisterBanner;
