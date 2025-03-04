"use client";

import * as Sentry from "@sentry/nextjs";
import Error from "next/error";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function GlobalError({ error }: { error: Error & { digest?: string } }) {
  const router = useRouter();

  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html>
      <body>
        <main>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <h1 style={{ fontSize: "28px" }}>Something went wrong!</h1>
            <button
              type="button"
              onClick={() => router.push("/")}
              style={{ borderRadius: "5px", fontSize: "13px", height: "28px", width: "80px" }}
            >
              Try again
            </button>
          </div>
        </main>
      </body>
    </html>
  );
}
