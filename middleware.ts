import * as Sentry from "@sentry/nextjs";
import { InteractionResponseType, InteractionType, verifyKey } from "discord-interactions";
import { LRUCache } from "lru-cache";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const DISCORD_PUBLIC_KEY = String(process.env.DISCORD_PUBLIC_KEY);
const RATE_LIMIT = 10;

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
  if (hostname !== "localhost" && protocol === "http:") {
    const httpsUrl = `https://${host}${pathname}`;
    return NextResponse.redirect(httpsUrl, 301);
  }

  // Discord Request Signature Check and Rate Limiting
  if (pathname.startsWith("/api/whitelisting")) {
    const signature = request.headers.get("x-signature-ed25519") || "";
    const timestamp = request.headers.get("x-signature-timestamp") || "";
    const requestText = await request.text();
    const { member, type } = JSON.parse(requestText);
    const { id: userId } = member.user;

    const token = tokenCache.get(userId) ?? 0;
    // console.log("⚪ tokenBefore discord:", token);

    try {
      if (RATE_LIMIT <= token)
        throw new Error("You have sent too many requests in a short time. You has been temporarily blocked.");

      const isValidRequest = await verifyKey(requestText, signature, timestamp, DISCORD_PUBLIC_KEY);
      // console.log("🟡 Discord request is valid:", isValidRequest);

      if (!isValidRequest) throw new Error("Invalid request.");

      if (type === InteractionType.PING) {
        return NextResponse.json({ type: InteractionResponseType.PONG });
      }

      return NextResponse.next();
    } catch (error) {
      // console.error("🔴 ERROR verifying Discord request:", (error as Error).message);
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

export const config = {
  matcher: ["/api/:path*"],
};
