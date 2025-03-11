import { iGTagEvent } from "@/lib/gtag";

export type iNewsCard = {
  url: string;
  name: string;
  thumbnail: string;
  desc: string;
  date: string;
  GAevent?: iGTagEvent;
};
