"use client";

export default function ManyRequests() {
  return (
    <main>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <h1 style={{ fontSize: "28px" }}>429 Too Many Requests</h1>
        <h4 style={{ marginLeft: "25px", marginRight: "25px", textAlign: "center" }}>
          You have sent too many requests in a short time. Your IP address has been temporarily blocked.
        </h4>
        {/* <footer style={{ fontSize: "12px", opacity: "1", marginTop: "10px", textAlign: "center" }}>
          © {new Date().getFullYear()} Hoagians
        </footer> */}
      </div>
    </main>
  );
}
