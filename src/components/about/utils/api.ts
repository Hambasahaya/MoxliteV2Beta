import { ENV } from "@/constant/ENV";
import { iAboutAttribute } from "../types";

export const getAbout = async (): Promise<iAboutAttribute> => {
  try {
    const rawResAboutAttr = await fetch(
      `${ENV.NEXT_PUBLIC_API_BASE_URL}/api/about`
    );
    const resultAboutAttr = await rawResAboutAttr.json();

    const rawResCustAttr = await fetch(
      `${ENV.NEXT_PUBLIC_API_BASE_URL}/api/customers`
    );
    const resultCustAttr = await rawResCustAttr.json();

    const about: iAboutAttribute = {
      totalInstalledFixtures:
        resultAboutAttr?.data?.num_installed_fixtures ?? 12000,
      totalCitiesInIndonesia:
        resultAboutAttr?.data?.num_cities_in_indonesia ?? 50,
      totalClients: resultAboutAttr?.data?.num_clients ?? 1000,
      content: resultAboutAttr?.data?.content ?? "",
      valueProposition: resultAboutAttr?.data?.value_proposition ?? [],
      customers:
        resultCustAttr?.data?.map?.((e: any) => ({
          name: e?.name ?? "",
          imgUrl: e?.logo?.url ?? "",
        })) ?? [],
    };
    return about;
  } catch (error) {
    throw error;
  }
};
