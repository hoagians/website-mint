"use client";

import * as Sentry from "@sentry/nextjs";

export const getIpAddress = async () => {
  try {
    const response = await fetch("https://api.ipify.org?format=json");
    if (!response.ok) {
      throw new Error("Server error. Please try again later.");
    }
    const data = await response.json();
    return data.ip;
  } catch (error) {
    // console.error("🔴 API ERROR [getIpAddress]:", (error as Error).message);
    Sentry.captureException(error);
    throw error;
  }
};
