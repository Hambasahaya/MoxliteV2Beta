import { iGTagEvent } from "@/lib/gtag";

export type iAccordion = {
  title: string;
  content: string;
  invertColor?: boolean;
  GAevent?: iGTagEvent;
};
