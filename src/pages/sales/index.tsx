import Layout from "@/components/common/Layout";

import { ENV } from "@/constant/ENV";
import RegisterBanner from "@/components/sales/RegisterBanner";
import { iSalesProps } from "@/components/sales/types";
import { useState } from "react";
import SalesCard from "@/components/sales/SalesCard";
import Dropdown from "@/components/common/Dropdown";
import { iOption } from "@/components/common/Dropdown/types";
import { fireGAevent } from "@/lib/gtag";

const Sales = ({ sales, locations }: iSalesProps) => {
  const [selectedCity, setSelectedCity] = useState<iOption | null>(null);
  const cities = locations.flatMap((item) => item.cities);
  const cityOptions = cities.map((item) => {
    return { label: item.city, value: item.slug };
  });

  const handleCityOnChange = (slug: string, city: string) => {
    setSelectedCity({
      label: city,
      value: slug,
    });
    const selected = document.getElementById(city);
    selected?.scrollIntoView({
      behavior: "smooth",
    });
  };

  const handleDropdownOnChange = (tab: iOption) => {
    fireGAevent({
      action: "sales_partner_filter",
      attribute: {
        partner_category: cities.map((e) =>
          e.city == tab.label ? e.country : ""
        )[0],
        partner_location: tab.label,
      },
    });
    setSelectedCity(tab);
    const selected = document.getElementById(tab.label);
    selected?.scrollIntoView({
      behavior: "smooth",
    });
  };

  return (
    <Layout
      metadata={{
        title: "Sales - Moxlite",
        desc: "Browse official Moxlite sales partners across regions to get genuine Moxlite products and services.",
        thumbnail: `${ENV.NEXT_PUBLIC_FE_BASE_URL}/main_thumbnail.jpg`,
        url: `${ENV.NEXT_PUBLIC_FE_BASE_URL}/sales`,
      }}
    >
      <div className="w-full p-[24px] lg:px-[120px] lg:py-[40px] bg-[url(/image/sales_banner.png)] bg-cover">
        <h1 className="text-center text-white font-bold text-[36px] lg:text-[48px]">
          Browse Moxlite Sales Partner
        </h1>
      </div>

      <div className="p-[24px] lg:pt-[56px] lg:pb-[40px] lg:px-[120px] w-full flex flex-col items-center">
        <RegisterBanner />
      </div>

      <div className="grid grid-cols-12 gap-4 p-[24px] lg:px-[120px] lg:py-[40px]">
        <div className=" hidden lg:block col-span-12 lg:col-span-3">
          <div className="sticky top-25 border-0 lg:border-r lg:border-[#CBD5E1] pr-0 lg:pr-4">
            <div className="flex flex-col gap-[40px]">
              {locations.map((item) => {
                return (
                  <div className="flex flex-col" key={`location-${item.name}`}>
                    <p className="text-[#0F172A] text-[18px] font-semibold mb-[8px]">
                      {item.name}
                    </p>
                    <div className="flex flex-col mt-[16px] gap-[8px]">
                      {item.cities.map((city) => {
                        return (
                          <div
                            className={`rounded-[6px] ${
                              selectedCity?.value === city.slug
                                ? "bg-[#f4f4f5]"
                                : ""
                            } hover:bg-[#f4f4f5] py-[8px] px-[16px] cursor-pointer`}
                            key={`city-${item.name}-${city.city}`}
                            onClick={() => {
                              handleCityOnChange(city.slug, city.city);
                              fireGAevent({
                                action: "sales_partner_filter",
                                attribute: {
                                  partner_category: item.name,
                                  partner_location: city.city,
                                },
                              });
                            }}
                          >
                            <p className="text-[#09090B] text-[14px] font-semibold ">
                              {city.city}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-9">
          <div className="flex lg:hidden mb-[40px] sticky top-25">
            <Dropdown
              selectedValue={selectedCity}
              options={cityOptions}
              onChange={handleDropdownOnChange}
            />
          </div>
          {sales.length > 0 && (
            <div className="flex flex-col justify-between h-full">
              <div className="flex flex-col gap-[24px]">
                {sales.map((item) => (
                  <div
                    key={`item-${item.name}`}
                    className="border-0 border-b lg:border-[#CBD5E1]"
                    id={item.name}
                  >
                    <h6 className="text-[30px] font-bold mb-[24px]">
                      {item.name}
                    </h6>
                    <div className="flex flex-col gap-[24px] mb-[24px]">
                      {item.sales.map((sales) => {
                        return (
                          <SalesCard
                            sales={sales}
                            key={`item-${item.name}-${sales.name}`}
                          />
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {sales.length == 0 && (
            <div className="h-[60vh] w-full flex items-center justify-center">
              <p className="text-center font-medium">Data not found...</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Sales;

export { getServerSideProps } from "@/components/sales/utils/getServerProps";
