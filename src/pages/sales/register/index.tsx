/* eslint-disable @typescript-eslint/no-explicit-any */
import Layout from "@/components/common/Layout";
import { ENV } from "@/constant/ENV";
import { useState } from "react";
import Link from "next/link";
import { ROUTES } from "@/constant/ROUTES";
import { countries } from "@/constant/countryOptions";
import { fireGAevent } from "@/lib/gtag";
import { useReCaptcha } from "next-recaptcha-v3";
import { useSnackbar } from "notistack";

const Register = ({}) => {
  const { executeRecaptcha } = useReCaptcha();
  const { enqueueSnackbar } = useSnackbar()

  const [data, setData] = useState<{
    picName:string;
    companyName: string;
    city: string;
    country: string;
    phone: string;
    email:string;
    website: string;
    instagram: string;
    comproLink: string;
    reason: string;
  }>({
    picName:'',
    companyName: "",
    city: "",
    country: "",
    email:'',
    phone: "",
    website: "",
    instagram: "",
    comproLink: "",
    reason: "",
  });

  const isUrlValid = (userInput:string) =>{
    const pattern = /^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/;
    return pattern.test(userInput);
}

  const isWebsiteLinkValid = isUrlValid(data.website);
  const isComproLinkValid = isUrlValid(data.comproLink);


  const handlePhoneOnChange = (e: any) => {
    const value = e.target.value;
    if (!isNaN(value)) {
      setData((prev) => ({ ...prev, phone: value }));
    }
  };

  const handleSubmit = async(e:any) => {
    e.preventDefault();
    if(!isWebsiteLinkValid || !isComproLinkValid) return;
    try{
      fireGAevent({
        action: "register_sales_partner_submit",
      });
      const token = await executeRecaptcha("form_submit");
  
      const payload = {
        "data": {
          "contact_person": data.picName,
          "company_name": data.companyName,
          "city": data.city,
          "country": data.country,
          "phone_number": data.phone,
          "email": data.email,
          "website": data.website,
          "instagram": data.instagram,
          "company_profile_gdrive_url": data.comproLink,
          "motivation": data.reason
      },
      "recaptchaToken": token
      }


      const response = await fetch(`${ENV.NEXT_PUBLIC_API_BASE_URL}/api/sales-partner-registrations`, { method: "POST",  headers: {'Content-Type':'application/json'}, body:JSON.stringify(payload) });
      const jsonRes = await response.json();
      if(jsonRes.data){
        enqueueSnackbar('Form submitted!', {
          variant:"success"
        },)
        setTimeout(()=>{
          window.location.reload();
        },3000)
      
      }
      else{
        enqueueSnackbar(jsonRes?.error?.message??"Something went wrong!", {
          variant:"error"
        },)
    
      }
    }
    catch(error){
      enqueueSnackbar("Something went wrong!", {
        variant:"error"
      },)
    }
     
  };

  return (
    <Layout
      metadata={{
        title: "Register - Moxlite",
        desc: "Apply to become an official Moxlite sales partner. Start your partnership with Moxlite today.",
        thumbnail: `${ENV.NEXT_PUBLIC_FE_BASE_URL}/main_thumbnail.jpg`,
        url: `${ENV.NEXT_PUBLIC_FE_BASE_URL}/sales/register`,
      }}
    >
      <div className="w-full p-[24px] lg:px-[120px] lg:py-[40px] bg-[url(/image/register_banner.png)] bg-cover">
        <h1 className="text-center text-white font-bold text-[36px] lg:text-[48px]">
          Sales Partner Registration
        </h1>
      </div>

      <div className="p-[24px] lg:pt-[40px] lg:pb-[40px] lg:px-[400px] w-full flex flex-col ">
        <Link href={ROUTES.SALES.path} className="size-fit">
          <div className="flex items-center mr-1 cursor-pointer mb-[40px]">
            <img
              src="/icon/chevron-left.svg"
              className="size-[16px] mr-[4px]"
            />
            <p className="text-[14px] font-semibold text-[#0F172A]">
              Back to Sales Partner
            </p>
          </div>
        </Link>

        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-[24px]">
          <div>
              <p className="text-[14px] font-semibold text-[#0F172A] mb-[6px]">
                PIC Name
              </p>
              <input
                type="text"
                placeholder="Enter here"
                value={data.picName}
                required
                
                onChange={(e) =>
                  setData((prev) => ({ ...prev, picName: e.target.value }))
                }
                className="w-full h-[40px] px-3 pr-10 text-[14px] text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <p className="text-[14px] font-semibold text-[#0F172A] mb-[6px]">
                Company Name
              </p>
              <input
                type="text"
                placeholder="Enter here"
                value={data.companyName}
                required
                onChange={(e) =>
                  setData((prev) => ({ ...prev, companyName: e.target.value }))
                }
                className="w-full h-[40px] px-3 pr-10 text-[14px] text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <p className="text-[14px] font-semibold text-[#0F172A] mb-[6px]">
                City
              </p>
              <input
                type="text"
                placeholder="Enter here"
                value={data.city}
                required
                onChange={(e) =>
                  setData((prev) => ({ ...prev, city: e.target.value }))
                }
                className="w-full h-[40px] px-3 pr-10 text-[14px] text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <p className="text-[14px] font-semibold text-[#0F172A] mb-[6px]">
                Country
              </p>
              <select
                required
                value={data.country}
                onChange={(e) =>
                  setData((prev) => ({ ...prev, country: e.target.value }))
                }
                name="country"
                className="w-full h-[40px] px-3 pr-10 text-[14px] text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Country</option>
                {countries.map((item, idx) => {
                  return (
                    <option value={item} key={`country-${idx}`}>
                      {item}
                    </option>
                  );
                })}
              </select>
            </div>
            <div>
              <p className="text-[14px] font-semibold text-[#0F172A] mb-[6px]">
                Email
              </p>
              <input
                type="email"
                placeholder="Enter here"
                value={data.email}
                required
                onChange={(e) =>
                  setData((prev) => ({ ...prev, email: e.target.value }))
                }
                className="w-full h-[40px] px-3 pr-10 text-[14px] text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <p className="text-[14px] font-semibold text-[#0F172A] mb-[6px]">
                Phone/WhatsApp Number
              </p>
              <input
                type="text"
                placeholder="Enter here"
                value={data.phone}
                required
                onChange={handlePhoneOnChange}
                className="w-full h-[40px] px-3 pr-10 text-[14px] text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <p className="text-[14px] font-semibold text-[#0F172A] mb-[6px]">
                Website
              </p>
              <input
                type="text"
                placeholder="Enter here"
                required
                value={data.website}
                onChange={(e) =>
                  setData((prev) => ({ ...prev, website: e.target.value }))
                }
                className="w-full h-[40px] px-3 pr-10 text-[14px] text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {
                data.website && !isWebsiteLinkValid ?  <p className="text-[12px]  text-[#ed4337] mt-[6px]">
            Please enter a valid website URL (e.g., https://example.com).
              </p>:null
              }
            </div>
            <div>
              <p className="text-[14px] font-semibold text-[#0F172A] mb-[6px]">
                Instagram Handle (no @)
              </p>
              <input
                type="text"
                placeholder="Enter here"
                required
                value={data.instagram}
                onChange={(e) =>
                  setData((prev) => ({ ...prev, instagram: e.target.value }))
                }
                className="w-full h-[40px] px-3 pr-10 text-[14px] text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <p className="text-[14px] font-semibold text-[#0F172A]">
                Company Profile Google Drive Link
              </p>
              <p className="text-[14px]  text-[#71717A] mb-[6px]">
                Make sure the file is accessible to anyone with the link
              </p>
              <input
                type="text"
                placeholder="Enter here"
                required
                value={data.comproLink}
                onChange={(e) =>
                  setData((prev) => ({ ...prev, comproLink: e.target.value }))
                }
                className="w-full h-[40px] px-3 pr-10 text-[14px] text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
               {
                data.comproLink && !isComproLinkValid ?  <p className="text-[12px]  text-[#ed4337] mt-[6px]">
         Please enter a valid URL (e.g., https://example.com).
              </p>:null
              }
            </div>
            <div>
              <p className="text-[14px] font-semibold text-[#0F172A] mb-[6px]">
                Why You Want to Become Moxlite Sales Partner
              </p>
              <textarea
                placeholder="Enter here"
                value={data.reason}
                required
                onChange={(e) =>
                  setData((prev) => ({ ...prev, reason: e.target.value }))
                }
                className="w-full h-[170px] px-3 pr-10 text-[14px] text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-[#FAFAFA] hover:bg-neutral-400 py-[12px] px-[16px] my-[40px] lg:my-[24px] rounded-md cursor-pointer text-[14px] font-medium"
              style={{
                background:
                  "radial-gradient(116.01% 139.72% at 50% 100%, #020617 33.17%, #081F3B 62.23%, #3E9C92 100%)",
                color: "white",
              }}
            >
              Register
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default Register;
