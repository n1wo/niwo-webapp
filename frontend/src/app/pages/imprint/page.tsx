import LegalPageLayout from "@/components/legal/LegalPageLayout";

export const metadata = {
  title: "Imprint | niwo systems",
  description:
    "Legal notice for niwo systems. Non-commercial informational website. Professional offers handled privately, outside this platform.",
  robots: { index: true, follow: true },
};

const sections = [
  { id: "provider-identification", title: "1. Provider Identification" },
  { id: "nature-of-website", title: "2. Nature of the Website" },
  { id: "contact", title: "3. Contact" },
  { id: "liability", title: "4. Liability for Content" },
];

export default function ImprintPage() {
  return (
    <LegalPageLayout
      eyebrow="Legal"
      title="Imprint"
      lastUpdated="16 Oct 2025"
      sections={sections}
    >
          <section
            id="provider-identification"
            className="rounded-lg border border-white/10 bg-white/5/0 p-6"
          >
            <h2 className="text-2xl pb-1">1. Provider Identification</h2>
            <p>
              <strong>Responsible according to Section 5 TMG / EU eCommerce Directive</strong>
              <br />
              niwo systems
              <br />
              Owner: N. W.
              <br />
              Email:{" "}
              <a
                href="mailto:legal@niwosystems.com"
                className="text-white underline decoration-white/30 underline-offset-4"
              >
                legal@niwosystems.com
              </a>
              <br />
              Address: available upon request
            </p>
          </section>

          <section
            id="nature-of-website"
            className="mt-8 rounded-lg border border-white/10 p-6"
          >
            <h2 className="text-2xl pb-1">2. Nature of the Website</h2>
            <p>
              This website is a <strong>non-commercial informational project</strong>{" "}
              focused on technology and security research. <em>No goods or services are
              sold</em> directly through this platform.
            </p>
            <div className="mt-6 rounded-lg border border-white/10 bg-white/5 p-4 text-sm text-white/80">
              <strong>Disclaimer:</strong> This website does not directly offer paid
              services. Any professional collaboration or offer resulting from private
              contact is <strong>handled outside this platform</strong>, for example by
              email or a separate contract.
            </div>
          </section>

          <section id="contact" className="mt-8 rounded-lg border border-white/10 p-6">
            <h2 className="text-2xl pb-1">3. Contact</h2>
            <p>
              For legal notices or formal correspondence, please reach out via{" "}
              <a
                href="mailto:legal@niwosystems.com"
                className="text-white underline decoration-white/30 underline-offset-4"
              >
                legal@niwosystems.com
              </a>
              . If a physical mailing address is required for formal service, it will
              be provided upon request.
            </p>
          </section>

          <section id="liability" className="mt-8 rounded-lg border border-white/10 p-6">
            <h2 className="text-2xl pb-1">4. Liability for Content</h2>
            <p>
              Content is created with care; however, no warranty is given for
              completeness or accuracy. Links to external sites are provided for
              convenience, and responsibility for their content lies with the
              respective providers.
            </p>
          </section>
    </LegalPageLayout>
  );
}
