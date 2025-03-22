/* eslint-disable @typescript-eslint/no-explicit-any */
import { ENV } from "@/constant/ENV";
import { iGroupedLocation, iGroupedSales, iLocation, iSales } from "../types";

export const getSales = async (): Promise<iGroupedSales[]> => {
  try {
    const rawRes = await fetch(`${ENV.NEXT_PUBLIC_API_BASE_URL}/api/sales-partners`);
    const result = await rawRes.json();


    const sales: iSales[] = result.data.map((e: iSales) => ({
    id:e.id??"",
      documentId:e.documentId??"",
      name:e.name??"",
      address:e.address??"",
      phone_number:e.phone_number??"",
      email:e.email??"",
      website_url:e.website_url??"",
      instagram_username:e.instagram_username??"",
      instagram_url:e.instagram_url??"",
      createdAt:e.createdAt??"",
      logo:{
       id:e.logo?.id??"",
       documentId:e.logo.documentId??"",
       url:e.logo?.url??"",
      },
      location:{
        id:e.location?.id??"",
        documentId:e.location?.documentId??"",
        city:e.location?.city??'',
        country:e.location?.country??'',
        slug:e.location?.slug??'',
      }
    }));

    const salesObject = sales.reduce((r,a)=>{
      (r as any)[a.location.city] = (r as any)[a.location.city] || [];
      (r as any)[a.location.city].push(a);
      return r;
  }, {});

  const groupedSales = [] as iGroupedSales[];
  Object.keys(salesObject).forEach((item)=>{
    groupedSales.push({
      name:item,
      sales:(salesObject as any)[item]  || []
    })
  })


    return groupedSales;


  } catch (error) {
    throw error;
  }
};


export const getLocations = async (): Promise<iGroupedLocation[]> => {
  try {
    const rawRes = await fetch(`${ENV.NEXT_PUBLIC_API_BASE_URL}/api/locations`);
    const result = await rawRes.json();

    const locations: iLocation[] = result.data.map((e: iLocation) => ({
        id:e.id??"",
        documentId:e.documentId??"",
        city:e.city??'',
        country:e.country??'',
        slug:e.slug??'',
 
    }));

    const locationObject = locations.reduce((r,a)=>{
      (r as any)[a.country] = (r as any)[a.country] || [];
      (r as any)[a.country].push(a);
      return r;
  }, {});

  const groupedLocation = [] as iGroupedLocation[];
  Object.keys(locationObject).forEach((item)=>{
    groupedLocation.push({
      name:item,
      cities:(locationObject as any)[item]  || []
    })
  })


    return groupedLocation;
  } catch (error) {
    throw error;
  }
};

// {
//   Indonesia: [
//     {
//       id: 1,
//       documentId: 'ke3xq19nuu8tvg1ul100xbfa',
//       city: 'Jakarta',
//       country: 'Indonesia',
//       slug: 'jakarta-indonesia'
//     },
//     {
//       id: 2,
//       documentId: 'f9ufqoa13yhiumnzbkazzqmt',
//       city: 'Bandung',
//       country: 'Indonesia',
//       slug: 'bandung-indonesia'
//     }
//   ]
// }

// [
//   {
//     country:'indonesia',
//     city:[
//       {
//         name:'a'
//       }
//     ]
//   }
// ]