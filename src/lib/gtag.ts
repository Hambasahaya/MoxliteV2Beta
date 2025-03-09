import { ENV } from "@/constant/ENV";

export interface iGTagEvent {
  action: string;
  attribute?: {
    [key: string]: any;
  };
}

declare const window: Window & { gtag?: Function };

export const fireGApageview = (url: string) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("config", ENV.NEXT_PUBLIC_GA_ID, {
      page_path: url,
    });
  }
};

export const fireGAevent = ({ action, attribute }: iGTagEvent) => {
  console.log("GA action :: ", action, attribute);
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag(
      "event",
      action,
      attribute
        ? {
            ...attribute,
          }
        : undefined
    );
  }
};
