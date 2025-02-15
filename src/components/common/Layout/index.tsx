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
      <div className="mt-[75px] lg:mt-[60px]">{children}</div>
      <Footer />
    </>
  );
};

export default Layout;
