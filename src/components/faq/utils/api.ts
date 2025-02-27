import { ENV } from "@/constant/ENV";
import { iFaq } from "../types";

export const getFaqs = async (): Promise<iFaq[]> => {
  try {
    const rawRes = await fetch(`${ENV.NEXT_PUBLIC_API_BASE_URL}/api/faqs`);
    const result = await rawRes.json();

    const faqs: iFaq[] = result.data.map((e: iFaq) => ({
      documentId: e?.documentId ?? "",
      question: e?.question ?? "",
      answer: e?.answer ?? "",
    }));

    return faqs;
  } catch (error) {
    throw error;
  }
};
