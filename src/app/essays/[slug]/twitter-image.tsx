import { ImageResponse } from "next/og";
import { getEssaysIndex } from "@/app/utils";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

type Props = { params: Promise<{ slug: string }> };

export default async function Image({ params }: Props) {
  const { slug } = await params;
  const essays = await getEssaysIndex();
  const entry = essays.find((e) => e.slug === slug);
  const rawTitle = entry ? String(entry.metadata.title || slug) : slug;
  const title =
    rawTitle.length > 90 ? `${rawTitle.slice(0, 87).trim()}…` : rawTitle;

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
          background:
            "linear-gradient(135deg, #0f172a 0%, #312e81 45%, #4f46e5 100%)",
          color: "white",
          padding: 48,
        }}
      >
        <div
          style={{
            fontSize: title.length > 60 ? 38 : 48,
            fontWeight: 700,
            letterSpacing: "-0.02em",
            textAlign: "center",
            lineHeight: 1.2,
            maxWidth: 1000,
          }}
        >
          {title}
        </div>
        <div
          style={{
            marginTop: 28,
            fontSize: 24,
            fontWeight: 400,
            opacity: 0.9,
          }}
        >
          Essay · Arvind Prakash
        </div>
      </div>
    ),
    { ...size }
  );
}
