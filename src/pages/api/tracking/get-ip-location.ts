/**
 * API Route: Get User IP Address and Geolocation
 * Returns client IP address and approximate geolocation
 */

import type { NextApiRequest, NextApiResponse } from "next";

interface IPLocationResponse {
  ip: string;
  country?: string;
  region?: string;
  city?: string;
  latitude?: number;
  longitude?: number;
  timezone?: string;
  isp?: string;
  error?: string;
}

const getClientIP = (req: NextApiRequest): string => {
  // Check for IP from various headers (for proxied requests)
  const forwardedFor = req.headers["x-forwarded-for"];
  if (forwardedFor) {
    // x-forwarded-for can be comma separated list
    return Array.isArray(forwardedFor) ? forwardedFor[0] : forwardedFor.split(",")[0].trim();
  }

  const realIp = req.headers["x-real-ip"];
  if (realIp) {
    return Array.isArray(realIp) ? realIp[0] : realIp;
  }

  // Fallback to socket remote address
  return req.socket.remoteAddress || "unknown";
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<IPLocationResponse>
) {
  if (req.method !== "GET") {
    return res.status(405).json({ ip: "unknown", error: "Method not allowed" });
  }

  try {
    const clientIP = getClientIP(req);

    // Try to get geolocation from multiple services
    let locationData: IPLocationResponse = {
      ip: clientIP,
    };

    // Try ipinfo.io (free tier available)
    try {
      const ipinfoResponse = await fetch(`https://ipinfo.io/${clientIP}?token=${process.env.IPINFO_TOKEN || ""}`);
      if (ipinfoResponse.ok) {
        const data = await ipinfoResponse.json();
        locationData = {
          ip: clientIP,
          country: data.country,
          region: data.region,
          city: data.city,
          latitude: data.loc ? parseFloat(data.loc.split(",")[0]) : undefined,
          longitude: data.loc ? parseFloat(data.loc.split(",")[1]) : undefined,
          timezone: data.timezone,
          isp: data.org,
        };
        return res.status(200).json(locationData);
      }
    } catch (error) {
      console.error("Error fetching from ipinfo.io:", error);
    }

    // Fallback to ip-api.com (free tier)
    try {
      const ipApiResponse = await fetch(`http://ip-api.com/json/${clientIP}?fields=status,country,region,city,lat,lon,timezone,isp`);
      if (ipApiResponse.ok) {
        const data = await ipApiResponse.json();
        if (data.status === "success") {
          locationData = {
            ip: clientIP,
            country: data.country,
            region: data.region,
            city: data.city,
            latitude: data.lat,
            longitude: data.lon,
            timezone: data.timezone,
            isp: data.isp,
          };
          return res.status(200).json(locationData);
        }
      }
    } catch (error) {
      console.error("Error fetching from ip-api.com:", error);
    }

    // If all geolocation services fail, return just IP
    return res.status(200).json(locationData);
  } catch (error) {
    console.error("Error getting IP location:", error);
    return res.status(500).json({
      ip: "unknown",
      error: "Failed to get location",
    });
  }
}
