import type { NextApiRequest, NextApiResponse } from "next";

interface DebugResponse {
  hasGeminiKey: boolean;
  hasPublicGeminiKey: boolean;
  geminiKeyLength?: number;
  publicGeminiKeyLength?: number;
  nodeEnv: string;
  allKeys: string[];
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<DebugResponse>
) {
  const hasGeminiKey = !!process.env.GEMINI_API_KEY;
  const hasPublicGeminiKey = !!process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  
  const allKeys = Object.keys(process.env)
    .filter(k => k.includes('GEMINI') || k.includes('API') || k.includes('KEY'))
    .sort();

  res.status(200).json({
    hasGeminiKey,
    hasPublicGeminiKey,
    geminiKeyLength: process.env.GEMINI_API_KEY?.length,
    publicGeminiKeyLength: process.env.NEXT_PUBLIC_GEMINI_API_KEY?.length,
    nodeEnv: process.env.NODE_ENV || "not set",
    allKeys,
  });
}
