import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import { tabs } from "./schema";
import Dropdown from "@/components/common/Dropdown";
import { iTechDocs } from "./types";
import Link from "next/link";
import { fireGAevent } from "@/lib/gtag";
import { useAuth } from "@/lib/authContext";
import { activityTracker } from "@/lib/activityTracker";
import { useSnackbar } from "notistack";

const TechDocs = ({
  productName,
  productFamily,
  productCategory,
  items,
}: iTechDocs) => {
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const handleDownloadClick = async (
    e: React.MouseEvent,
    fileName: string,
    fileUrl: string,
    documentType: string
  ) => {
    e.preventDefault();

    const fileSize =
      items
        .find((doc) => doc.type === activeTab.value)
        ?.files.find((file) => file.name === fileName)?.size || 0;

    if (authLoading) {
      enqueueSnackbar("Checking your login session...", { variant: "info" });
      return;
    }

    if (!isAuthenticated) {
      await activityTracker.trackDownloadBlocked(user, fileName, documentType, {
        productName,
        productCategory,
        productFamily,
        fileSize,
      });
      enqueueSnackbar("Please login to download files", { variant: "warning" });
      router.push(
        `/auth/login?redirect=${encodeURIComponent(router.asPath)}`
      );
      return;
    }

    // Track download activity
    await activityTracker.trackDownload(
      user,
      fileName,
      documentType,
      {
        productName,
        productCategory,
        productFamily,
        fileSize,
      }
    );

    // Track GA event
    fireGAevent({
      action:
        activeTab.value
          .replace(/\s+/g, "_")
          .replace(/([a-z])([A-Z])/g, "$1_$2")
          .replace(/[^a-zA-Z0-9_]/g, "")
          .toLowerCase() + "_download",
      attribute: {
        product_name: productName,
        product_category: productCategory,
        product_family: productFamily,
        downloaded_filename: fileName,
      },
    });

    window.open(fileUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <>
      <div
        id="tech-docs"
        className="px-[24px] py-[40px] lg:px-[120px] lg:py-[80px]"
      >
        <h2 className="text-[30px] text-black font-bold mb-[40px]">
          Technical Documents
        </h2>

        {!authLoading && !isAuthenticated && (
          <div className="bg-[#FEF3C7] border border-[#FCD34D] rounded-lg p-4 mb-6">
            <p className="text-[14px] text-[#92400E] mb-2">
              <strong>Login Required:</strong> You need to login to download technical documents.
            </p>
            <Link
              href={`/auth/login?redirect=${encodeURIComponent(router.asPath)}`}
              className="inline-block mt-2 px-4 py-2 bg-[#FBBF24] text-[#1F2937] text-[14px] font-medium rounded hover:bg-[#F59E0B] transition"
            >
              Login Now
            </Link>
          </div>
        )}

        <div className="w-full bg-[#CBD5E1] p-2 rounded-lg hidden lg:flex justify-between relative">
          {tabs.map((tab) => (
            <div
              key={tab.value}
              className="relative px-2 grow cursor-pointer"
              onClick={() => setActiveTab(tab)}
            >
              {activeTab === tab && (
                <motion.div
                  layoutId="active-tab"
                  className="absolute inset-0 bg-white rounded-md shadow-md z-0"
                  transition={{ duration: 0.2 }}
                />
              )}
              <div
                className={`relative px-6 py-2 text-[16px] transition-colors z-10 text-center ${
                  activeTab === tab
                    ? "text-black font-bold"
                    : "text-[#334155] font-medium"
                }`}
              >
                {tab.label}
              </div>
            </div>
          ))}
        </div>

        <div className="flex lg:hidden">
          <Dropdown
            selectedValue={activeTab}
            options={tabs}
            onChange={(tab) => setActiveTab(tab)}
          />
        </div>

        {items?.filter((e) => e.type == activeTab.value)[0]?.files.length >
        0 ? (
          <div className="grid grid-cols-12 gap-0 border-b border-gray-500/30 mt-[40px]">
            <div className="col-span-1 hidden lg:flex" />
            <div className="col-span-12 lg:col-span-6 p-[14px] text-[#71717A] text-[14px]">
              Filename
            </div>
            <div className="col-span-3 hidden lg:flex p-[14px] text-[#71717A] text-[14px]">
              File Size
            </div>
            <div className="col-span-2 hidden lg:flex" />
          </div>
        ) : (
          <div className="w-full mt-4">
            <p className="text-center">No documents yet...</p>
          </div>
        )}

        {items
          ?.filter((e) => e.type == activeTab.value)[0]
          ?.files?.map((e, i) => (
            <div className="grid grid-cols-12 gap-0" key={i}>
              <div className="col-span-1 hidden lg:flex p-[14px] font-medium text-[#09090B] text-[14px]">
                {i + 1}
              </div>
              <div className="col-span-8 lg:col-span-6 p-[14px] font-medium text-[#09090B] text-[14px]">
                {e.name}
              </div>
              <div className="col-span-3 hidden lg:flex p-[14px] font-medium text-[#09090B] text-[14px]">
                {e.size} KB
              </div>
              <div className="col-span-4 lg:col-span-2 p-[14px] font-medium text-[#0284C7] text-[14px] w-full text-end">
                <button
                  type="button"
                  onClick={(event) =>
                    handleDownloadClick(event, e.name, e.url, activeTab.value)
                  }
                  disabled={authLoading}
                  className={`text-right hover:font-bold hover:underline ${
                    !isAuthenticated ? "opacity-70" : ""
                  } ${authLoading ? "cursor-wait" : "cursor-pointer"}`}
                >
                  {authLoading
                    ? "Checking..."
                    : isAuthenticated
                      ? "Download"
                      : "Login to Download"}
                </button>
              </div>
            </div>
          ))}
      </div>
      <div className="border border-[#CBD5E1] mx-[24px] lg:mx-[120px]" />
    </>
  );
};

export default TechDocs;
