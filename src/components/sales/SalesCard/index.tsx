/* eslint-disable @next/next/no-img-element */
import { FC } from "react";
import { iSalesCardProps } from "./types";
import Link from "next/link";
import { fireGAevent } from "@/lib/gtag";

const SalesCard: FC<iSalesCardProps> = ({ sales }) => {
  return (
    <div className="border-solid border-1 border-[#cbd5e1] w-full grid grid-cols-12">
      <div className="col-span-12 lg:col-span-4 border-0 lg:border-r lg:border-[#CBD5E1]">
        <div className="w-full h-full flex justify-center align-center p-[24px] ">
          <img
            src={sales.logo.url}
            alt={sales.name}
            className="h-[200px] object-contain"
          />
        </div>
      </div>
      <div className="col-span-12 lg:col-span-8">
        <div className="w-full h-full flex flex-col p-[24px]">
          <h6 className="text-[20px] lg:text-[24px] font-bold">{sales.name}</h6>
          <div className="grid grid-cols-12 gap-[24px] mt-[20px]">
            <div className="col-span-12 lg:col-span-6">
              <div className="flex flex-col gap-[20px]">
                <div className="flex align-start">
                  <img
                    src={"/icon/location_on_dark.svg"}
                    className="h-[24px] pr-[8px]"
                  />
                  <p
                    rel="noopener noreferrer"
                    className="text-[16px] font-semibold break-all"
                  >
                    {sales.address}
                  </p>
                </div>
                <div className="flex align-start">
                  <img
                    src={"/icon/whatsapp_dark.svg"}
                    className="h-[24px] pr-[8px]"
                  />
                  <Link
                    onClick={() => {
                      fireGAevent({
                        action: "partner_phone",
                        attribute: {
                          partner_name: sales.name,
                        },
                      });
                    }}
                    href={`https://wa.me/${sales.phone_number}?text=Hi Moxlite Team, I have a question regarding ...`}
                    passHref
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[16px] font-semibold break-all"
                  >
                    {sales.phone_number}
                  </Link>
                </div>
              </div>
            </div>
            <div className="col-span-12 lg:col-span-6">
              <div className="flex flex-col gap-[20px]">
                <div className="flex align-start ">
                  <img
                    src={"/icon/mail-dark.svg"}
                    className="h-[24px] pr-[8px]"
                  />
                  <a
                    onClick={() => {
                      fireGAevent({
                        action: "partner_email",
                        attribute: {
                          partner_name: sales.name,
                        },
                      });
                    }}
                    href={`mailto:${sales.email}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[16px] font-semibold break-all"
                  >
                    {sales.email}
                  </a>
                </div>
                <div className="flex align-start ">
                  <img
                    src={"/icon/instagram-dark.svg"}
                    className="h-[24px] pr-[8px]"
                  />
                  <a
                    onClick={() => {
                      fireGAevent({
                        action: "partner_social_media",
                        attribute: {
                          partner_name: sales.name,
                        },
                      });
                    }}
                    href={sales.instagram_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[16px] font-semibold break-all !underline"
                  >
                    {sales.instagram_username}
                  </a>
                </div>
                <div className="flex align-start ">
                  <img src={"/icon/globe.svg"} className="h-[24px] pr-[8px]" />
                  <a
                    onClick={() => {
                      fireGAevent({
                        action: "partner_website",
                        attribute: {
                          partner_name: sales.name,
                        },
                      });
                    }}
                    href={sales.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[16px] font-semibold break-all !underline"
                  >
                    {sales.website_url}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesCard;
