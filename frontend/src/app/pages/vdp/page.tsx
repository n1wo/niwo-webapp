import LegalPageLayout from "@/components/legal/LegalPageLayout";

export const metadata = {
  title: "Vulnerability Disclosure Policy | niwo",
  description: "How to responsibly report vulnerabilities to the niwo security team.",
};

const sections = [
  { id: "overview", title: "1. Overview" },
  { id: "scope", title: "2. Scope" },
  { id: "guidelines", title: "3. Guidelines" },
  { id: "reporting", title: "4. Reporting" },
  { id: "acknowledgement", title: "5. Acknowledgement" },
];

export default function VdpPage() {
  return (
    <LegalPageLayout
      eyebrow="Security"
      title="Vulnerability Disclosure Policy"
      description="Responsible disclosure guidance for researchers reporting potential security issues."
      sections={sections}
    >
          <section id="overview" className="rounded-lg border border-white/10 bg-white/5/0 p-6">
            <h2 className="text-2xl pb-1">1. Overview</h2>
            <p>
              Security is a top priority for us at <strong>niwo</strong>. We
              appreciate the work of security researchers and the responsible
              disclosure of potential vulnerabilities.
            </p>
          </section>

          <section id="scope" className="mt-8 rounded-lg border border-white/10 p-6">
            <h2 className="text-2xl pb-1">2. Scope</h2>
            <p>
              This policy applies to digital assets owned, operated, or maintained by
              niwo, including{" "}
              <code className="rounded bg-white/8 px-2 py-0.5 text-white">
                niwosystems.com
              </code>{" "}
              and associated subdomains.
            </p>
          </section>

          <section id="guidelines" className="mt-8 rounded-lg border border-white/10 p-6">
            <h2 className="text-2xl pb-1">3. Guidelines</h2>
            <ul>
              <li>Do not exploit vulnerabilities beyond what is necessary to demonstrate them.</li>
              <li>Do not access or modify user data without consent.</li>
              <li>Do not disrupt or degrade our services.</li>
              <li>Provide sufficient detail so we can reproduce and validate the issue.</li>
            </ul>
          </section>

          <section id="reporting" className="mt-8 rounded-lg border border-white/10 p-6">
            <h2 className="text-2xl pb-1">4. Reporting</h2>
            <p>
              If you discover a vulnerability, please report it responsibly by
              emailing{" "}
              <a
                href="mailto:security@niwosystems.com"
                className="text-white underline decoration-white/30 underline-offset-4"
              >
                security@niwosystems.com
              </a>
              .
            </p>
            <div className="mt-6 rounded-lg border border-white/10 bg-white/5 p-4 text-sm text-white/80">
              Include the following information where possible:
              <ul className="mt-3">
                <li>Description of the vulnerability</li>
                <li>Steps to reproduce</li>
                <li>Potential impact</li>
                <li>Suggested remediation, if available</li>
              </ul>
            </div>
          </section>

          <section
            id="acknowledgement"
            className="mt-8 rounded-lg border border-white/10 p-6"
          >
            <h2 className="text-2xl pb-1">5. Acknowledgement</h2>
            <p>
              We may publicly acknowledge valid reports that help us improve our
              security posture. Thank you for helping keep niwo and its users safe.
            </p>
          </section>
    </LegalPageLayout>
  );
}
