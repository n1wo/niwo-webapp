import { ImageResponse } from "next/og";

export const alt = "niwo systems — Software, IT and cybersecurity consulting";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const de = locale === "de";
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 76, color: "#f4f4f5", background: "#292929", backgroundImage: "radial-gradient(circle at 18% 12%, rgba(140,127,224,0.2), transparent 42%), radial-gradient(circle at 88% 8%, rgba(95,98,184,0.16), transparent 38%)", fontFamily: "monospace" }}>
      <div style={{ display: "flex", alignItems: "center", fontSize: 30 }}><span style={{ color: "#5fbf76" }}>+--(</span><span style={{ color: "#8c7fe0" }}>root@niwo</span><span style={{ color: "#5fbf76" }}>)-[~]</span></div>
      <div style={{ display: "flex", flexDirection: "column", maxWidth: 980 }}><div style={{ display: "flex", fontSize: 76, fontWeight: 700, lineHeight: 1.05, letterSpacing: "-0.02em" }}>{de ? "Sicher durch das digitale Zeitalter" : "Securely through the digital age"}</div><div style={{ display: "flex", marginTop: 28, fontSize: 30, color: "#a1a1aa" }}>{de ? "Beratung für Software / IT / Cybersecurity" : "Software / IT / Cybersecurity consulting"}</div></div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", border: "1px solid rgba(255,255,255,0.08)", background: "#202020", borderRadius: 16, padding: "24px 32px" }}><div style={{ display: "flex", flexDirection: "column" }}><span style={{ fontSize: 34, fontWeight: 600 }}>niwo systems</span><span style={{ fontSize: 24, color: "#a1a1aa", marginTop: 6 }}>{de ? "Inhabergeführte Beratung / Bonn" : "Founder-led consulting / Bonn"}</span></div><span style={{ fontSize: 30, color: "#8c7fe0" }}>niwosystems.com</span></div>
    </div>,
    size,
  );
}
