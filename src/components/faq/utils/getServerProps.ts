import { GetServerSideProps } from "next";
import { iFaqProps } from "../types";
import { getFaqs } from "./api";

export const getServerSideProps: GetServerSideProps<iFaqProps> = async () => {
  try {
    const faqs = await getFaqs();
 
    return {
      props: {
        faqs
      },
    };
  } catch (error) {
    console.error("Error fetching faqs:", error);

    return {
      props: {
        faqs: [],
       
      },
    };
  }
};
