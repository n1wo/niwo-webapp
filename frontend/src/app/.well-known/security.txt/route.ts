import { SITE_URL } from "@/i18n/metadata";

const EXPIRES = "2027-06-04T23:59:59Z";

export function GET() {
  return new Response(
    [
      "Contact: mailto:security@niwosystems.com",
      `Policy: ${SITE_URL}/en/pages/vdp`,
      "Preferred-Languages: en, de",
      `Canonical: ${SITE_URL}/.well-known/security.txt`,
      `Expires: ${EXPIRES}`,
      "# Optional: add once available",
      "# Encryption: https://niwosystems.com/pgp.txt",
      "# Hiring: https://niwosystems.com/careers",
      "# Acknowledgments: https://niwosystems.com/hall-of-fame",
      "",
    ].join("\n"),
    {
      headers: {
        "content-type": "text/plain; charset=utf-8",
      },
    },
  );
}
