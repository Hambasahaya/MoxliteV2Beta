/**
 * API Route: Admin Authentication
 * Handles login for admin panel
 */

import type { NextApiRequest, NextApiResponse } from "next";

type ResponseData = {
  success: boolean;
  token?: string;
  error?: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  const { password } = req.body;

  // Default admin password (change this to environment variable in production)
  const adminPassword =
    process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "admin123";
  const adminToken = process.env.NEXT_PUBLIC_ADMIN_TOKEN || "moxlite-admin-2024";

  if (password === adminPassword) {
    res.status(200).json({ success: true, token: adminToken });
  } else {
    res.status(401).json({ success: false, error: "Invalid password" });
  }
}
