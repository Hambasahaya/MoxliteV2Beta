import type { NextApiRequest, NextApiResponse } from "next";
import { getFirebaseAdminAuth } from "@/lib/server/firebaseAdmin";

type ResponseData = {
  message?: string;
  error?: string;
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
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    if (password.length < 8) {
      return res
        .status(400)
        .json({ error: "Password must be at least 8 characters" });
    }

    const user = await getFirebaseAdminAuth().createUser({
      displayName: fullName,
      email,
      password,
    });

    return res.status(201).json({
      message: "Account created successfully",
      uid: user.uid,
    });
  } catch (error) {
    return res.status(500).json({
      error: error instanceof Error ? error.message : "Internal server error",
    });
  }
}
