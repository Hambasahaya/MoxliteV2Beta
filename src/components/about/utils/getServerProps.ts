import { GetServerSideProps } from "next";
import { iAboutProps, } from "../types";
import { getAbout } from "./api";

export const getServerSideProps: GetServerSideProps<iAboutProps> = async () => {
  try {
    const about = await getAbout();

    return {
      props: {
        data:about
      },
    };
  } catch (error) {
    console.error("Error fetching about:", error);

    return {
      props: {
        data: null,
       
      },
    };
  }
};
