import { ImageResponse } from "next/og";

export const alt = "Arvind Prakash";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0f172a 0%, #312e81 45%, #4f46e5 100%)",
          color: "white",
        }}
      >
        <div
          style={{
            fontSize: 56,
            fontWeight: 700,
            letterSpacing: "-0.02em",
          }}
        >
          Arvind Prakash
        </div>
        <div
          style={{
            marginTop: 16,
            fontSize: 26,
            fontWeight: 400,
            opacity: 0.92,
          }}
        >
          Essays, projects, and notes
        </div>
      </div>
    ),
    { ...size }
  );
}
