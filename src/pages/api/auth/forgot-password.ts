import type { NextApiRequest, NextApiResponse } from "next";

type ResponseData = {
  message?: string;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { email } = req.body;
    const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    if (!apiKey) {
      return res.status(500).json({ error: "Firebase API key is not configured" });
    }

    await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requestType: "PASSWORD_RESET",
          email,
        }),
      }
    );

    return res.status(200).json({
      message: "If an account exists, a reset link has been sent",
    });
  } catch (error) {
    return res.status(500).json({
      error: error instanceof Error ? error.message : "Internal server error",
    });
  }
}
