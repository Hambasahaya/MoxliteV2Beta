import { ReactNode } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

type iLayoutProps = {
  children: ReactNode;
};

const Layout = ({ children }: iLayoutProps) => {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
};

export default Layout;
