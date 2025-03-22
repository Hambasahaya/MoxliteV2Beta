
export type iLocation  = {
    id:number;
    documentId:string;
    city:string;
    country:string;
    slug:string;
}
export type iSales = {
   id:number;
   documentId:number;
   contact_person?:string;
   name:string;
   address:string;
   phone_number:string;
   email:string;
   website_url:string;
   instagram_username:string;
   instagram_url:string;
   createdAt:string;
   logo:{
    id:number;
    documentId:string;
    url:string;
   }
   location:iLocation;
}

export type iGroupedSales = {
    name:string;
    sales:iSales[];
}

export type iGroupedLocation = {
    name:string;
    cities:iLocation[];
}

export type iSalesProps = {
 sales:iGroupedSales[];
 locations: iGroupedLocation[]
};