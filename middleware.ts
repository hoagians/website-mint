import * as Sentry from "@sentry/nextjs";
import { InteractionResponseType, InteractionType, verifyKey } from "discord-interactions";
import { LRUCache } from "lru-cache";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const DISCORD_PUBLIC_KEY = String(process.env.DISCORD_PUBLIC_KEY);
const RATE_LIMIT = 5;

const rateLimitOptions = {
  uniqueTokenPerInterval: 500,
  interval: 1800000, // 30 minutes in ms (1000ms * 60s * 30m)
};

const tokenCache = new LRUCache<string, number>({
  max: rateLimitOptions.uniqueTokenPerInterval,
  ttl: rateLimitOptions.interval,
});

export async function middleware(request: NextRequest) {
  const ipAddress = request.headers.get("x-forwarded-for") || String(request.ip);
  const { host, hostname, pathname, protocol } = request.nextUrl;

  // Logging
  const method = request.method;
  console.log(`🔵 [${new Date().toISOString()}] ${method} request to ${pathname} from ${ipAddress}`);

  // Redirect HTTP to HTTPS
  if (protocol === "http:" && hostname !== "localhost") {
    const httpsUrl = `https://${host}${pathname}`;
    return NextResponse.redirect(httpsUrl, 301);
  }

  // Verify allowed IP addresses
  const allowedIps = ["35.196.132.85", "35.227.62.178", "35.237.4.214"];
  if (!allowedIps.includes(ipAddress)) {
    console.log(`🔵 [${new Date().toISOString()}] Unauthorized request from ${ipAddress}`);
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Discord Request Signature Check and Rate Limiting
  if (pathname.startsWith("/api/whitelisting")) {
    const signature = request.headers.get("x-signature-ed25519") || "";
    const timestamp = request.headers.get("x-signature-timestamp") || "";
    const requestText = await request.text();
    const data = JSON.parse(requestText);
    const { type } = data;

    if (type === InteractionType.PING) {
      try {
        const isValidRequest = await verifyKey(requestText, signature, timestamp, DISCORD_PUBLIC_KEY);

        if (!isValidRequest) throw new Error("Invalid request.");

        return NextResponse.json({ type: InteractionResponseType.PONG });
      } catch (error) {
        console.error("🔴 ERROR while verifying Discord Bot request:", (error as Error).message);
        Sentry.captureException((error as Error).message);
        return NextResponse.json({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: { content: (error as Error).message },
        });
      }
    }

    if (type === InteractionType.APPLICATION_COMMAND) {
      const { member } = data;
      const { id: userId } = member.user;

      const token = tokenCache.get(userId) ?? 0;
      // console.log("⚪ tokenBefore discord:", token);

      try {
        if (RATE_LIMIT <= token)
          throw new Error("You have sent too many requests in a short time. You has been temporarily blocked.");

        const isValidRequest = await verifyKey(requestText, signature, timestamp, DISCORD_PUBLIC_KEY);

        if (!isValidRequest) throw new Error("Invalid request.");

        return NextResponse.next();
      } catch (error) {
        console.error("🔴 ERROR while verifying Discord App request:", (error as Error).message);
        Sentry.captureException((error as Error).message);
        return NextResponse.json({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: { content: (error as Error).message },
        });
      } finally {
        tokenCache.set(userId, token + 1);
        // const tokenAfter = tokenCache.get(userId) ?? 0;
        // console.log("⚪ tokenAfter discord:", tokenAfter);
      }
    }
  }
}

export const config = {
  matcher: ["/api/:path*"],
};
