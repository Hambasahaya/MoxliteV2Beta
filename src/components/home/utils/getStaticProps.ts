import { GetStaticProps } from "next";
import { iHomeProps, iPost } from "../types";

export const getStaticProps: GetStaticProps<iHomeProps> = async () => {
  try {
    const res = await fetch("https://jsonplaceholder.typicode.com/posts");
    const posts: iPost[] = await res.json();

    return {
      props: { posts }, // Kirim data sebagai props ke Home
    };
  } catch (error) {
    console.error("Error fetching posts:", error);

    return {
      props: { posts: [] }, // Return array kosong jika gagal fetch
    };
  }
};
