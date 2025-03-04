import Navbar from "./Navbar";
import Footer from "./Footer";
import { defaultMetadata } from "./schema";
import Header from "./Header";
import { iLayoutProps } from "./types";
import GoogleAnalytics from "./GoogleAnalytics";

const Layout = ({ children, metadata }: iLayoutProps) => {
  return (
    <>
      <GoogleAnalytics />
      <Header {...(metadata ? metadata : defaultMetadata)} />
      <Navbar />
      <div className="mt-[75px] lg:mt-[60px]">{children}</div>
      <Footer />
    </>
  );
};

export default Layout;
