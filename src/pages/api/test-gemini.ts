import type { NextApiRequest, NextApiResponse } from "next";

interface TestResponse {
  apiKey: string;
  apiKeyValid: boolean;
  url: string;
  testMessage: string;
  geminiStatus?: number;
  geminiError?: string;
  geminiResponse?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<TestResponse>
) {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent";

  const apiKeyValid = !!GEMINI_API_KEY && GEMINI_API_KEY.length > 20;

  console.log("Debug endpoint called");
  console.log("GEMINI_API_KEY exists:", !!GEMINI_API_KEY);
  console.log("GEMINI_API_KEY length:", GEMINI_API_KEY?.length);

  const response: TestResponse = {
    apiKey: GEMINI_API_KEY ? `${GEMINI_API_KEY.substring(0, 10)}...${GEMINI_API_KEY.substring(GEMINI_API_KEY.length - 10)}` : "NOT SET",
    apiKeyValid,
    url: GEMINI_API_URL,
    testMessage: "Testing Gemini API connection",
  };

  if (!apiKeyValid) {
    return res.status(200).json({
      ...response,
      geminiError: "API Key not properly configured",
    });
  }

  try {
    console.log("Attempting to call Gemini API...");
    console.log("URL:", `${GEMINI_API_URL}?key=${GEMINI_API_KEY?.substring(0, 10)}...`);
    
    const geminiRes = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: "Halo, apa kabar? Jawab dengan singkat.",
              },
            ],
          },
        ],
      }),
    });

    console.log("Gemini API Response Status:", geminiRes.status);

    const responseText = await geminiRes.text();
    console.log("Gemini API Response:", responseText.substring(0, 500));

    return res.status(200).json({
      ...response,
      geminiStatus: geminiRes.status,
      geminiResponse: responseText.substring(0, 500),
      geminiError: !geminiRes.ok ? `HTTP ${geminiRes.status}` : undefined,
    });
  } catch (error) {
    console.error("Error testing Gemini API:", error);
    return res.status(200).json({
      ...response,
      geminiError: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
