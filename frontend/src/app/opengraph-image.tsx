import { ImageResponse } from "next/og";

export const alt = "niwo - Practical web security for developers and small teams";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const BACKGROUND = "#0a0a0a";
const SURFACE = "#111113";
const BORDER = "rgba(255,255,255,0.08)";
const ACCENT = "#8c7fe0";
const MUTED = "#a1a1aa";
const KALI_GREEN = "#5fbf76";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: BACKGROUND,
          backgroundImage:
            "radial-gradient(circle at 18% 12%, rgba(140,127,224,0.18), transparent 42%), radial-gradient(circle at 88% 8%, rgba(95,98,184,0.14), transparent 38%)",
          padding: 80,
          fontFamily: "monospace",
          color: "#f4f4f5",
        }}
      >
        {/* terminal prompt eyebrow */}
        <div style={{ display: "flex", alignItems: "center", fontSize: 30 }}>
          <span style={{ color: KALI_GREEN }}>+--(</span>
          <span style={{ color: ACCENT }}>root@niwo</span>
          <span style={{ color: KALI_GREEN }}>)-[</span>
          <span style={{ color: "#f4f4f5" }}>~</span>
          <span style={{ color: KALI_GREEN }}>]</span>
        </div>

        {/* headline */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 76,
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
              maxWidth: 920,
            }}
          >
            Practical web security for developers and small teams
          </div>
          <div style={{ marginTop: 28, fontSize: 30, color: MUTED, maxWidth: 880 }}>
            Web app security reviews / practical guidance / pentest preparation
          </div>
        </div>

        {/* footer card */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            border: `1px solid ${BORDER}`,
            background: SURFACE,
            borderRadius: 16,
            padding: "24px 32px",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: 34, fontWeight: 600 }}>Nikita Wokurka</span>
            <span style={{ fontSize: 24, color: MUTED, marginTop: 6 }}>
              Cybersecurity / Bonn
            </span>
          </div>
          <span style={{ fontSize: 30, color: ACCENT }}>niwosystems.com</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
