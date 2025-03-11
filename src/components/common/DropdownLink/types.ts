import { iGTagEvent } from "@/lib/gtag";

export type iDropdownLink = {
  options: {
    label: string;
    docId: string;
    GAevent?: iGTagEvent;
  }[];
  defaultValue?: boolean;
  placeholder?: string;
};
