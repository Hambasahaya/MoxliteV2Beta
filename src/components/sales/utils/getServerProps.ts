import { GetServerSideProps } from "next";

import { iSalesProps } from "../types";
import { getLocations, getSales } from "./api";

export const getServerSideProps: GetServerSideProps<iSalesProps> = async () => {
  try {
    const sales = await getSales();
    const locations = await getLocations();
 
    return {
      props: {
        sales,
        locations,
      },
    };
  } catch (error) {
    console.error("Error fetching locations:", error);

    return {
      props: {
        sales:[],
        locations:[],
       
      },
    };
  }
};
