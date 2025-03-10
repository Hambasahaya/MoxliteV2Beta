import { fireGAevent } from "@/lib/gtag";

const WAFloatingButton = ({
  productName,
  productCategory,
  productFamily,
}: {
  productName: string;
  productCategory: string;
  productFamily: string;
}) => {
  const whatsappNumber = "6282116549906";
  const message = "Hi Moxlite Team, I have a question regarding ...";

  return (
    <>
      <a
        onClick={() => {
          fireGAevent({
            action: "product_detail_contact_whatsapp",
            attribute: {
              product_name: productName,
              product_category: productCategory,
              productFamily: productFamily,
            },
          });
        }}
        href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
          message
        )}`}
        target="_blank"
        rel="noopener noreferrer"
        className="z-[100] fixed bottom-[16px] right-[16px] md:bottom-[40px] md:right-[40px] flex items-center gap-[8px] bg-gradient-to-r from-[#0c2941] to-[#1a4858] py-[4px] pl-[16px] pr-[4px] rounded-full shadow-lg hover:shadow-xl transition duration-300 ease-in-out"
      >
        <p className="text-white font-semibold text-[16px]">Contact Us</p>
        <img src="/icon/whatsapp-big.svg" className="h-[44px]" />
      </a>
    </>
  );
};

export default WAFloatingButton;
