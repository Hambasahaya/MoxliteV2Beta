import Layout from "@/components/common/Layout";
import ContactItem from "@/components/contact/ContactItem/indext";
import { ENV } from "@/constant/ENV";
import { fireGAevent } from "@/lib/gtag";
import { useState } from "react";

const Contact = () => {
  const [showMap, setShowMap] = useState(false);

  const handleMapClick = () => {
    fireGAevent({
      action: "contact_office_map_location",
    });
    setShowMap(true);
  };

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

        <div className="w-full h-[400px] rounded-lg overflow-hidden cursor-pointer relative group">
          <a
            href="https://maps.google.com/maps?q=Moxlite+Lighting,+Tangerang"
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleMapClick}
            className="w-full h-full block"
          >
            <img
              src="https://maps.googleapis.com/maps/api/staticmap?center=-6.202391,106.632970&zoom=14&size=600x400&markers=color:blue%7Clabel:M%7C-6.202391,106.632970&key=AIzaSyDO0GvchJG-4e0FVT8fV0f5V5YC3zvgIew&style=feature:water|color:0xcad2f5&style=feature:land|color:0xf3f3f3"
              alt="Moxlite Lighting office location at Rukan Crown, Tangerang, Banten"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all flex items-center justify-center">
              <div className="text-white text-center opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="text-sm font-semibold">View Full Map</p>
              </div>
            </div>
          </a>
        </div>
      </div>
    </Layout>
  );
};

export default Contact;
