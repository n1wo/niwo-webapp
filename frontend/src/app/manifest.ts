import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "niwo systems",
    short_name: "niwo",
    description: "Founder-led software, IT and cybersecurity consulting.",
    start_url: "/en",
    display: "standalone",
    background_color: "#292929",
    theme_color: "#292929",
    icons: [{ src: "/assets/logos/niwo-favicon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
