import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/router";
import { ROUTES } from "@/constant/ROUTES";
import Link from "next/link";
import { fireGAevent } from "@/lib/gtag";

const Navbar = () => {
  const [isExpand, setIsExpand] = useState(false);
  const router = useRouter();
  const currPath = router.asPath;
  const menuMobileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuMobileRef.current &&
        !menuMobileRef.current.contains(event.target as Node)
      ) {
        setIsExpand(false);
      }
    };

    if (isExpand) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isExpand]);

  return (
    <>
      <div className="fixed top-0 left-0 w-full z-[100]">
        <div className="bg-black text-[#f8fafc] px-[120px] py-[22px] hidden lg:flex justify-between items-center">
          <Link href={ROUTES.HOME.path}>
            <img src="/icon/moxlite-icon-1.svg" className="h-[20px]" alt="Moxlite Home" />
          </Link>
          <div className="flex justify-between">
            <Link
              onClick={() => {
                fireGAevent({ action: "navigation_home" });
              }}
              href={ROUTES.HOME.path}
              className="pl-[36px] cursor-pointer"
            >
              <span
                className={`font-[500] text-[15px] leading-[16.94px] hover:text-[#3E9C92] ${
                  currPath == ROUTES.HOME.path ? "text-[#3E9C92]" : ""
                }`}
              >
                {ROUTES.HOME.label}
              </span>
            </Link>

            <Link
              onClick={() => {
                fireGAevent({ action: "navigation_about" });
              }}
              href={ROUTES.ABOUT.path}
              className="pl-[36px] cursor-pointer"
            >
              <span
                className={`font-[500] text-[15px] leading-[16.94px] hover:text-[#3E9C92] ${
                  currPath.includes(ROUTES.ABOUT.path) ? "text-[#3E9C92]" : ""
                }`}
              >
                {ROUTES.ABOUT.label}
              </span>
            </Link>
            <Link
              onClick={() => {
                fireGAevent({ action: "navigation_products" });
              }}
              href={ROUTES.PRODUCT.path}
              className="pl-[36px] cursor-pointer"
            >
              <span
                className={`font-[500] text-[15px] leading-[16.94px] hover:text-[#3E9C92] ${
                  currPath.includes(ROUTES.PRODUCT.path) ? "text-[#3E9C92]" : ""
                }`}
              >
                {ROUTES.PRODUCT.label}
              </span>
            </Link>
            <Link
              onClick={() => {
                fireGAevent({ action: "navigation_partners" });
              }}
              href={ROUTES.SALES.path}
              className="pl-[36px] cursor-pointer"
            >
              <span
                className={`font-[500] text-[15px] leading-[16.94px] hover:text-[#3E9C92] ${
                  currPath.includes(ROUTES.SALES.path) ? "text-[#3E9C92]" : ""
                }`}
              >
                {ROUTES.SALES.label}
              </span>
            </Link>
            <Link
              onClick={() => {
                fireGAevent({ action: "navigation_projects" });
              }}
              href={ROUTES.PROJECT.path}
              className="pl-[36px] cursor-pointer"
            >
              <span
                className={`font-[500] text-[15px] leading-[16.94px] hover:text-[#3E9C92] ${
                  currPath.includes(ROUTES.PROJECT.path) ? "text-[#3E9C92]" : ""
                }`}
              >
                {ROUTES.PROJECT.label}
              </span>
            </Link>

            <Link
              onClick={() => {
                fireGAevent({ action: "navigation_news" });
              }}
              href={ROUTES.NEWS.path}
              className="pl-[36px] cursor-pointer"
            >
              <span
                className={`font-[500] text-[15px] leading-[16.94px] hover:text-[#3E9C92] ${
                  currPath.includes(ROUTES.NEWS.path) ? "text-[#3E9C92]" : ""
                }`}
              >
                {ROUTES.NEWS.label}
              </span>
            </Link>
            <Link
              onClick={() => {
                fireGAevent({ action: "navigation_contact" });
              }}
              href={ROUTES.CONTACT.path}
              className="pl-[36px] cursor-pointer"
            >
              <span
                className={`font-[500] text-[15px] leading-[16.94px] hover:text-[#3E9C92] ${
                  currPath.includes(ROUTES.CONTACT.path) ? "text-[#3E9C92]" : ""
                }`}
              >
                {ROUTES.CONTACT.label}
              </span>
            </Link>

            <Link
              onClick={() => {
                fireGAevent({ action: "navigation_faq" });
              }}
              href={ROUTES.FAQ.path}
              className="pl-[36px] cursor-pointer"
            >
              <span
                className={`font-[500] text-[15px] leading-[16.94px] hover:text-[#3E9C92] ${
                  currPath.includes(ROUTES.FAQ.path) ? "text-[#3E9C92]" : ""
                }`}
              >
                {ROUTES.FAQ.label}
              </span>
            </Link>
          </div>
        </div>

        <div
          ref={menuMobileRef}
          className="bg-black text-[#f8fafc] px-[20px] py-[24px] flex-none lg:hidden"
        >
          <div className="flex justify-between items-center">
            <Link
              onClick={() => {
                fireGAevent({ action: "navigation_home" });
              }}
              href={ROUTES.HOME.path}
            >
              <img src="/icon/moxlite-icon-1.svg" className="h-[20px]" alt="Moxlite Mobile Home" />
            </Link>
            <div className="relative h-[30px] w-[30px] overflow-hidden">
              <AnimatePresence>
                {!isExpand ? (
                  <motion.img
                    key="hamburger"
                    src="/icon/hamburger.svg"
                    className="absolute h-[30px] cursor-pointer"
                    alt="Open Menu"
                    initial={{ x: 30, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -30, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    onClick={() => setIsExpand(true)}
                  />
                ) : (
                  <motion.img
                    key="close"
                    src="/icon/x.svg"
                    className="absolute h-[30px] cursor-pointer"
                    initial={{ x: 30, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -30, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    onClick={() => setIsExpand(false)}
                  />
                )}
              </AnimatePresence>
            </div>
          </div>

          <div
            className={`px-[20px] overflow-hidden transition-all duration-500 ${
              isExpand
                ? "max-h-[390px] opacity-100 pt-[40px] pb-[10px]"
                : "max-h-0 opacity-0 pt-[0px]"
            }`}
          >
            <div
              onClick={() => {
                fireGAevent({ action: "navigation_home" });
                router.push(ROUTES.HOME.path);
              }}
              className={`${
                currPath == ROUTES.HOME.path ? "text-[#3E9C92]" : ""
              } pb-[10px] font-[500] text-[15px] cursor-pointer leading-[16.94px] hover:text-[#3E9C92] overflow-hidden transition-all duration-500 ${
                isExpand ? "max-h-[200px] opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              {ROUTES.HOME.label}
            </div>
            <div
              onClick={() => {
                fireGAevent({ action: "navigation_about" });
                router.push(ROUTES.ABOUT.path);
              }}
              className={`${
                currPath.includes(ROUTES.ABOUT.path) ? "text-[#3E9C92]" : ""
              } pb-[10px] font-[500] text-[15px] cursor-pointer leading-[16.94px] hover:text-[#3E9C92] overflow-hidden transition-all duration-500 ${
                isExpand ? "max-h-[200px] opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              {ROUTES.ABOUT.label}
            </div>
            <div
              onClick={() => {
                fireGAevent({ action: "navigation_products" });
                router.push(ROUTES.PRODUCT.path);
              }}
              className={`${
                currPath.includes(ROUTES.PRODUCT.path) ? "text-[#3E9C92]" : ""
              } pb-[10px] font-[500] text-[15px] cursor-pointer leading-[16.94px] hover:text-[#3E9C92] overflow-hidden transition-all duration-500 ${
                isExpand ? "max-h-[200px] opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              {ROUTES.PRODUCT.label}
            </div>
            <div
              onClick={() => {
                fireGAevent({ action: "navigation_partners" });
                router.push(ROUTES.SALES.path);
              }}
              className={`${
                currPath.includes(ROUTES.SALES.path) ? "text-[#3E9C92]" : ""
              } pb-[10px] font-[500] text-[15px] cursor-pointer leading-[16.94px] hover:text-[#3E9C92] overflow-hidden transition-all duration-500 ${
                isExpand ? "max-h-[200px] opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              {ROUTES.SALES.label}
            </div>
            <div
              onClick={() => {
                fireGAevent({ action: "navigation_projects" });
                router.push(ROUTES.PROJECT.path);
              }}
              className={`${
                currPath.includes(ROUTES.PROJECT.path) ? "text-[#3E9C92]" : ""
              } pb-[10px] font-[500] text-[15px] cursor-pointer leading-[16.94px] hover:text-[#3E9C92] overflow-hidden transition-all duration-500 ${
                isExpand ? "max-h-[200px] opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              {ROUTES.PROJECT.label}
            </div>
            <div
              onClick={() => {
                fireGAevent({ action: "navigation_news" });
                router.push(ROUTES.NEWS.path);
              }}
              className={`${
                currPath.includes(ROUTES.NEWS.path) ? "text-[#3E9C92]" : ""
              } pb-[10px] font-[500] text-[15px] cursor-pointer leading-[16.94px] hover:text-[#3E9C92] overflow-hidden transition-all duration-500 ${
                isExpand ? "max-h-[200px] opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              {ROUTES.NEWS.label}
            </div>
            <div
              onClick={() => {
                fireGAevent({ action: "navigation_contact" });
                router.push(ROUTES.CONTACT.path);
              }}
              className={`${
                currPath.includes(ROUTES.CONTACT.path) ? "text-[#3E9C92]" : ""
              } pb-[10px] font-[500] text-[15px] cursor-pointer leading-[16.94px] hover:text-[#3E9C92] overflow-hidden transition-all duration-500 ${
                isExpand ? "max-h-[200px] opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              {ROUTES.CONTACT.label}
            </div>
            <div
              onClick={() => {
                fireGAevent({ action: "navigation_faq" });
                router.push(ROUTES.FAQ.path);
              }}
              className={`${
                currPath.includes(ROUTES.FAQ.path) ? "text-[#3E9C92]" : ""
              } pb-[10px] font-[500] text-[15px] cursor-pointer leading-[16.94px] hover:text-[#3E9C92] overflow-hidden transition-all duration-500 ${
                isExpand ? "max-h-[200px] opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              {ROUTES.FAQ.label}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
