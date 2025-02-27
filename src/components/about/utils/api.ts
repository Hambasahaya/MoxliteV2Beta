import { ENV } from "@/constant/ENV";
import { iAboutAttribute,  } from "../types";

export const getAbout = async (): Promise<iAboutAttribute> => {
  try {
    const rawRes = await fetch(
      `${ENV.NEXT_PUBLIC_API_BASE_URL}/api/about`
    );
    const result = await rawRes.json();
  
    const about: iAboutAttribute= {
       totalInstalledFixtures:result.data.num_installed_fixtures,
          totalCitiesInIndonesia:result.data.num_cities_in_indonesia,
          totalClients:result.data.num_clients,
          content:result.data.content,
          valueProposition:result.data.value_proposition 
    }
    return about;
  } catch (error) {
    throw error;
  }
};
