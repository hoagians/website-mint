"use server";

import { Reader } from "@maxmind/geoip2-node";
import * as Sentry from "@sentry/nextjs";
import path from "path";

export const getIpLocation = async (ip: string): Promise<any> => {
  try {
    // Opens database readers concurrently
    const [cityReader, asnReader] = await Promise.all([
      Reader.open(path.join(process.cwd(), "../../GeoLite2-City.mmdb")),
      Reader.open(path.join(process.cwd(), "../../GeoLite2-ASN.mmdb")),
    ]);
    // Get city and ASN information in parallel
    const [cityData, asnData] = await Promise.all([cityReader.city(ip), asnReader.asn(ip)]);

    const city = cityData.city?.names.en || "N/A";
    const country = cityData.country?.names.en || "N/A";
    const asnNumber = asnData.autonomousSystemNumber;
    const asnName = asnData.autonomousSystemOrganization;
    const asOrg = asnNumber ? `AS${asnNumber} ${asnName}` : "N/A";
    const timezone = cityData.location?.timeZone || "N/A";

    // console.log("🟡 Response fetching location:", { city, country, asOrg, timezone });
    return { city, country, asOrg, timezone };
  } catch (error) {
    // console.error("🔴 Error fetching location:", (error as Error).message);
    Sentry.captureException(error);
  }
};
