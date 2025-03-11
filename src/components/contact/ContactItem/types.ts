import { iGTagEvent } from "@/lib/gtag";

export type iContactItem = {
  title: string;
  content: {
    label: string;
    iconUrl: string;
    redirectUrl: string;
    GAevent?: iGTagEvent;
  }[];
};
