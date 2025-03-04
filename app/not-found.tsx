"use client";

import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  return (
    <main>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <h1 style={{ fontSize: "28px" }}>404 Not Found</h1>
        <h4 style={{ marginLeft: "25px", marginRight: "25px", textAlign: "center" }}>
          The server cannot find the requested resource.
        </h4>
        <button
          type="button"
          onClick={() => router.push("/")}
          style={{ borderRadius: "5px", fontSize: "13px", height: "28px", width: "80px" }}
        >
          RETURN
        </button>
      </div>
    </main>
  );
}
