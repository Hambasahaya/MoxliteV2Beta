import Layout from "@/components/common/Layout";
import ContactItem from "@/components/contact/ContactItem/indext";
import { ENV } from "@/constant/ENV";
import { fireGAevent } from "@/lib/gtag";
import { useEffect, useRef } from "react";

const Contact = () => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const handlePointerEnter = () => {
      fireGAevent({
        action: "contact_office map_location",
      });
    };

    if (iframeRef.current) {
      iframeRef.current.addEventListener("pointerenter", handlePointerEnter);
    }

    return () => {
      if (iframeRef.current) {
        iframeRef.current.removeEventListener(
          "pointerenter",
          handlePointerEnter
        );
      }
    };
  }, []);

  return (
    <Layout
      metadata={{
        title: "Contact Us - Moxlite",
        desc: "Shaping the future ofentertainment lighting! Reach Out to Moxlite -We're Here to Help Looking for guidance in choosing the perfect lighting solution for your stage? Have questions about our product range or services? We're ready to assist. Connect with us through our contact form, email, or phone. +62 812-1117-5907 info@moxlite.com @moxlite.prolight",
        thumbnail: `${ENV.NEXT_PUBLIC_FE_BASE_URL}/Moxlite_Logo.png`,
        url: `${ENV.NEXT_PUBLIC_FE_BASE_URL}/contact`,
      }}
    >
      <div className="w-full p-[24px] lg:px-[120px] lg:py-[40px] bg-[url(/image/contact_banner.png)] bg-cover">
        <h1 className="text-center text-white font-bold text-[36px] lg:text-[48px]">
          Reach Out to Moxlite
        </h1>
      </div>

      <div className="p-[24px] lg:px-[120px] lg:py-[80px] grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div>
          <div className="mb-[40px] lg:mb-[64px]">
            <ContactItem
              title="Contact Person"
              content={[
                {
                  label: "+62 852 1567 6696",
                  iconUrl: "/icon/whatsapp.svg",
                  redirectUrl:
                    "https://wa.me/6285215676696?text=Hi Moxlite Team, just visited your website, and we would like to learn more about moxlite products!",
                  GAevent: {
                    action: "contact_whatsapp",
                  },
                },
                {
                  label: "info@moxlite.com",
                  iconUrl: "/icon/mail.svg",
                  redirectUrl:
                    "mailto:info@moxlite.com?subject=Need Support&body=Hi Moxlite Team, just visited your website, and we would like to learn more about moxlite products!",
                  GAevent: {
                    action: "contact_email",
                  },
                },
              ]}
            />
          </div>

          <div className="mb-[40px] lg:mb-[64px]">
            <ContactItem
              title="Social Media"
              content={[
                {
                  label: "@moxlite.prolight",
                  iconUrl: "/icon/instagram.svg",
                  redirectUrl: "https://www.instagram.com/moxlite.prolight",
                  GAevent: {
                    action: "contact_instagram",
                  },
                },
                {
                  label: "Moxlite Prolight",
                  iconUrl: "/icon/youtube.svg",
                  redirectUrl: "https://www.youtube.com/@MoxliteProlight",
                  GAevent: {
                    action: "contact_youtube",
                  },
                },
              ]}
            />
          </div>
        </div>

        <div className="w-full h-[400px]">
          <iframe
            ref={iframeRef}
            title="Moxlite Lighting Location"
            className="w-full h-full border-0 rounded-lg"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d63463.41985961862!2d106.63296990371094!3d-6.202391377983057!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f9a5901566e3%3A0xededc616007328e9!2sMoxlite%20Lighting!5e0!3m2!1sen!2sid!4v1739719217413!5m2!1sen!2sid"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
    </Layout>
  );
};

export default Contact;
