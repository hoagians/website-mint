"use client";

export default function Unauthorized() {
  return (
    <main>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <h1 style={{ fontSize: "28px" }}>401 Unauthorized</h1>
        <h4 style={{ marginLeft: "25px", marginRight: "25px", textAlign: "center" }}>
          You are not authorized to access this resource.
        </h4>
        {/* <footer style={{ fontSize: "12px", opacity: "1", marginTop: "10px", textAlign: "center" }}>
          © {new Date().getFullYear()} Hoagians
        </footer> */}
      </div>
    </main>
  );
}
