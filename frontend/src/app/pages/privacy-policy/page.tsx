import type { Metadata } from "next";
import Link from "next/link";
import LegalPageLayout from "@/components/legal/LegalPageLayout";

export const metadata: Metadata = {
  title: "Privacy Policy | niwo",
  description:
    "Privacy policy for this website covering email contact, hosting, and locally hosted fonts.",
};

const lastUpdated = "13 October 2025";

const sections = [
  { id: "intro", title: "1. Introduction" },
  { id: "controller", title: "2. Data Controller" },
  { id: "data-we-collect", title: "3. Data We Collect" },
  { id: "purpose-legal-basis", title: "4. Purpose & Legal Basis" },
  { id: "storage-retention", title: "5. Data Storage & Retention" },
  { id: "third-parties", title: "6. Use of Third-Party Services" },
  { id: "sharing", title: "7. Data Sharing" },
  { id: "rights", title: "8. Your GDPR Rights" },
  { id: "security", title: "9. Data Security" },
  { id: "cookies", title: "10. Cookies & Tracking" },
  { id: "changes", title: "11. Changes to This Policy" },
  { id: "contact", title: "12. Contact" },
];

export default function PrivacyPolicyPage() {
  return (
    <LegalPageLayout
      eyebrow="Legal"
      title="Privacy Policy"
      lastUpdated={lastUpdated}
      sections={sections}
    >
          <section id="intro" className="rounded-lg border border-white/10 bg-white/5/0 p-6">
            <h2 className="text-2xl pb-1">1. Introduction</h2>
            <p>
              This Privacy Policy explains how we collect, use, and protect personal
              data when you visit this website or contact us by email. We aim to handle
              information responsibly and transparently in line with applicable data
              protection law, including the EU General Data Protection Regulation
              (GDPR).
            </p>
          </section>

          <section id="controller" className="mt-8 rounded-lg border border-white/10 p-6">
            <h2 className="text-2xl pb-1">2. Data Controller</h2>
            <p>
              <strong>Controller:</strong> niwo systems
              <br />
              <strong>Email:</strong>{" "}
              <Link href="mailto:legal@niwosystems.com">legal@niwosystems.com</Link>
              <br />
              <strong>Address:</strong> Based in Germany
            </p>
            <p>
              If you have questions about this Privacy Policy or your personal data,
              you can contact us using the details above.
            </p>
          </section>

          <section id="data-we-collect" className="mt-8 rounded-lg border border-white/10 p-6">
            <h2 className="text-2xl pb-1">3. Data We Collect</h2>
            <h3>a) Information you provide voluntarily</h3>
            <p>When you contact us by email, we may process:</p>
            <ul>
              <li>Your email address</li>
              <li>Your name or signature, if you include it</li>
              <li>
                Your company name, phone number, or other contact details, if you
                include them
              </li>
              <li>The content of your message and any attachments you send</li>
            </ul>
            <p>This information is used solely to review and respond to your inquiry.</p>

            <h3>b) Automatically collected data</h3>
            <p>
              When you visit the website, basic technical data may be processed
              automatically:
            </p>
            <ul>
              <li>Your IP address</li>
              <li>Browser type and version</li>
              <li>Operating system</li>
              <li>Date and time of access</li>
              <li>Referring website, if applicable</li>
            </ul>
            <p>
              This data is collected for security, error monitoring, and performance
              purposes and is not used by us to identify individual visitors directly.
            </p>
          </section>

          <section id="purpose-legal-basis" className="mt-8 rounded-lg border border-white/10 p-6">
            <h2 className="text-2xl pb-1">4. Purpose & Legal Basis for Processing</h2>
            <ul>
              <li>
                To respond to inquiries sent by email (Art. 6(1)(b) GDPR - performance
                of a contract or pre-contractual measures).
              </li>
              <li>
                To ensure technical operation and website security (Art. 6(1)(f) GDPR
                - legitimate interest).
              </li>
            </ul>
            <p>
              We do not use your data for marketing purposes without your explicit
              consent.
            </p>
          </section>

          <section id="storage-retention" className="mt-8 rounded-lg border border-white/10 p-6">
            <h2 className="text-2xl pb-1">5. Data Storage & Retention</h2>
            <p>
              If you contact us by email, your message may be stored in our email inbox
              and related mail systems for as long as necessary to handle your inquiry
              and any related follow-up, unless legal retention requirements apply.
            </p>
          </section>

          <section id="third-parties" className="mt-8 rounded-lg border border-white/10 p-6">
            <h2 className="text-2xl pb-1">6. Use of Third-Party Services</h2>
            <h3>a) AWS Amplify</h3>
            <p>
              Our website is hosted using Amazon Web Services (AWS) Amplify, provided
              by Amazon Web Services EMEA SARL (Luxembourg). Technical connection data
              and website delivery data may be processed on servers within the EU or,
              if necessary, in other regions under appropriate safeguards such as
              <em> Standard Contractual Clauses</em> (SCCs).
            </p>

            <h3>b) Fonts hosted locally</h3>
            <p>
              This website uses IBM Plex Mono. The font is hosted locally with the
              website assets, so no font requests are sent to Google when the page
              loads.
            </p>
          </section>

          <section id="sharing" className="mt-8 rounded-lg border border-white/10 p-6">
            <h2 className="text-2xl pb-1">7. Data Sharing</h2>
            <p>
              We do not share, sell, or rent personal data to third parties. Data may
              be shared only when required by law or to comply with a valid legal
              request.
            </p>
          </section>

          <section id="rights" className="mt-8 rounded-lg border border-white/10 p-6">
            <h2 className="text-2xl pb-1">8. Your GDPR Rights</h2>
            <ul>
              <li>
                <strong>Right of access</strong> (Art. 15 GDPR)
              </li>
              <li>
                <strong>Right to rectification</strong> (Art. 16 GDPR)
              </li>
              <li>
                <strong>Right to erasure</strong> (Art. 17 GDPR)
              </li>
              <li>
                <strong>Right to restriction of processing</strong> (Art. 18 GDPR)
              </li>
              <li>
                <strong>Right to data portability</strong> (Art. 20 GDPR)
              </li>
              <li>
                <strong>Right to object</strong> (Art. 21 GDPR)
              </li>
            </ul>
            <p>
              You also have the right to lodge a complaint with your local data
              protection authority if you believe your data is processed unlawfully.
            </p>
          </section>

          <section id="security" className="mt-8 rounded-lg border border-white/10 p-6">
            <h2 className="text-2xl pb-1">9. Data Security</h2>
            <p>
              We use HTTPS encryption and appropriate technical measures to protect
              data from unauthorized access, alteration, or loss.
            </p>
          </section>

          <section id="cookies" className="mt-8 rounded-lg border border-white/10 p-6">
            <h2 className="text-2xl pb-1">10. Cookies & Tracking</h2>
            <p>
              Currently, this website does not use cookies or tracking tools. If
              analytics or cookies are added in the future, we will update this policy
              and implement any additional user-facing controls that may be required.
            </p>
          </section>

          <section id="changes" className="mt-8 rounded-lg border border-white/10 p-6">
            <h2 className="text-2xl pb-1">11. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy occasionally to reflect new features or
              legal requirements. The latest version will always be available on this
              page.
            </p>
          </section>

          <section id="contact" className="mt-8 rounded-lg border border-white/10 p-6">
            <h2 className="text-2xl pb-1">12. Contact</h2>
            <p>
              If you have questions or requests related to your personal data, please
              contact:{" "}
              <Link href="mailto:legal@niwosystems.com">legal@niwosystems.com</Link>
              <br />
              <em>Subject line: &quot;Privacy Request&quot;</em>
            </p>
          </section>
    </LegalPageLayout>
  );
}
