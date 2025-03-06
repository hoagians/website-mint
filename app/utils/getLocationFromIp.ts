"use server";

import * as Sentry from "@sentry/nextjs";
import { CustomLocation } from "../lib/interfaces";

export const getLocationFromIp = async (ip: string): Promise<CustomLocation> => {
  try {
    const response = await fetch(`http://ip-api.com/json/${ip}`);
    if (!response.ok) throw new Error("Failed to fetch data");

    const data = await response.json();
    if (data.status !== "success") throw new Error(data.message || "Unknown error");

    const city = data.city || "N/A";
    const country = data.country || "N/A";
    const asOrg = data.as || "N/A";
    const timezone = data.timezone || "N/A";

    // console.log("🟡 Response fetching location:", { city, country, asOrg, timezone });
    return { city, country, asOrg, timezone };
  } catch (error) {
    console.error("🔴 API ERROR fetching location:", (error as Error).message);
    Sentry.captureException(error);
    return { city: "N/A", country: "N/A", asOrg: "N/A", timezone: "N/A" };
  }
};
