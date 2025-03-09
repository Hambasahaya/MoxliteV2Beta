import { iGTagEvent } from "@/lib/gtag";

export type iAspectTab = {
  options: {
    label: string;
    docId: string;
    GAevent?: iGTagEvent;
  }[];
};
