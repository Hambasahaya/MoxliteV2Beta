import { iAboutAttribute } from "../types";

export type iCounter = {
  maxCount: number;
  bgImgPath: string;
  label: string;
};

export type iCountingNumberProps = {
  data:iAboutAttribute | null;
}