import { ENV } from "@/constant/ENV";

interface iGTagEvent {
  action: string;
  category: string;
  label: string;
  value?: number;
}

declare const window: Window & { gtag?: Function };

export const GApageview = (url: string) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("config", ENV.NEXT_PUBLIC_GA_ID, {
      page_path: url,
    });
  }
};

export const GAevent = ({ action, category, label, value }: iGTagEvent) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", action, {
      event_category: category,
      event_label: label,
      value,
    });
  }
};
