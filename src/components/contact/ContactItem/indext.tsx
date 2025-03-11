import { fireGAevent } from "@/lib/gtag";
import { iContactItem } from "./types";

const ContactItem = ({ title, content }: iContactItem) => {
  return (
    <>
      <h4 className="text-[24px] text-black font-bold">{title}</h4>
      {content.map((e, i) => (
        <div
          className="flex items-center mt-[16px]"
          key={i}
          onClick={() => {
            if (e.GAevent) {
              fireGAevent(e.GAevent);
            }
          }}
        >
          <img src={e.iconUrl} className="h-[24px] invert filter pr-[8px]" />
          <a
            href={e.redirectUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[16px]"
          >
            {e.label}
          </a>
        </div>
      ))}
    </>
  );
};

export default ContactItem;
