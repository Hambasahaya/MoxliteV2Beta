import type { NextApiRequest, NextApiResponse } from "next";

type ResponseData = {
  message?: string;
  error?: string;
  token?: string;
  refreshToken?: string;
  expiresIn?: string;
  uid?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { email, password } = req.body;
    const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    if (!apiKey) {
      return res.status(500).json({ error: "Firebase API key is not configured" });
    }

    const response = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          returnSecureToken: true,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(401).json({
        error: data?.error?.message || "Login failed",
      });
    }

    return res.status(200).json({
      message: "Login successful",
      token: data.idToken,
      refreshToken: data.refreshToken,
      expiresIn: data.expiresIn,
      uid: data.localId,
    });
  } catch (error) {
    return res.status(500).json({
      error: error instanceof Error ? error.message : "Internal server error",
    });
  }
}
