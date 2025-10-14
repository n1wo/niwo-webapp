import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy | niwo",
  description:
    "GDPR-compliant privacy policy for this website covering contact form submissions, hosting, and locally hosted Google Fonts.",
};

const lastUpdated = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "long",
  year: "numeric",
}).format(new Date("2025-10-13"));

const sections = [
  { id: "intro", title: "1. Introduction" },
  { id: "controller", title: "2. Data Controller" },
  { id: "data-we-collect", title: "3. Data We Collect" },
  { id: "purpose-legal-basis", title: "4. Purpose & Legal Basis" },
  { id: "storage-retention", title: "5. Data Storage & Retention" },
  { id: "third-parties", title: "6. Use of Third‑Party Services" },
  { id: "sharing", title: "7. Data Sharing" },
  { id: "rights", title: "8. Your GDPR Rights" },
  { id: "security", title: "9. Data Security" },
  { id: "cookies", title: "10. Cookies & Tracking" },
  { id: "changes", title: "11. Changes to This Policy" },
  { id: "contact", title: "12. Contact" },
];

export default function PrivacyPolicyPage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-12 lg:py-16">
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/5 to-transparent p-8 sm:p-10">
        <div className="relative z-10">
          <p className="text-xs uppercase tracking-widest text-white/60">Legal</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Privacy Policy</h1>
          <p className="mt-2 text-sm text-white/60">Last updated: {lastUpdated}</p>
        </div>
        <div className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/5 blur-2xl" />
      </div>

      {/* Layout */}
      <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Sidebar TOC */}
        <aside className="lg:col-span-4 xl:col-span-3">
          <nav className="sticky top-20 rounded-2xl border border-white/10 p-4">
            <p className="mb-3 text-xs font-medium uppercase tracking-widest text-white/60">On this page</p>
            <ul className="space-y-2 text-sm leading-6 [&_a:hover]:text-white">
              {sections.map((s) => (
                <li key={s.id}>
                  <a className="block truncate text-white/70 transition" href={`#${s.id}`}>
                    {s.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* Content */}
        <article className="prose prose-invert 
        prose-headings:font-semibold 
        prose-h3:text-base prose-p:text-[15px] prose-li:marker:text-white/60 lg:col-span-8 xl:col-span-9">
          <section id="intro" className="rounded-2xl border border-white/10 bg-white/5/0 p-6">
            <h2 className="text-2xl pb-1">1. Introduction</h2>
            <p>
              This Privacy Policy explains how we collect, use, and protect personal data when you visit this website. We are
              committed to complying with the <strong>EU General Data Protection Regulation (GDPR)</strong> and to handling your
              information responsibly and transparently.
            </p>
          </section>

          <section id="controller" className="mt-8 rounded-2xl border border-white/10 p-6">
            <h2 className="text-2xl pb-1">2. Data Controller</h2>
            <p>
              <strong>Controller:</strong> niwo systems
              <br />
              <strong>Email:</strong> <Link href="mailto:info@niwosystems.com">info@niwosystems.com</Link>
              <br />
              <strong>Address:</strong> Based in Germany
            </p>
            <p>
              If you have any questions about this Privacy Policy or your personal data, you can contact us using the details above.
            </p>
          </section>

          <section id="data-we-collect" className="mt-8 rounded-2xl border border-white/10 p-6">
            <h2 className="text-2xl pb-1">3. Data We Collect</h2>
            <h3>a) Information you provide voluntarily</h3>
            <p>When you use the <strong>contact form</strong>, we collect:</p>
            <ul>
              <li>First and last name</li>
              <li>Company name (optional)</li>
              <li>Email address</li>
              <li>Phone number (optional)</li>
              <li>Message content</li>
            </ul>
            <p>This information is used solely to respond to your inquiry.</p>
            <h3>b) Automatically collected data</h3>
            <p>When you visit the website, basic technical data may be processed automatically:</p>
            <ul>
              <li>Your IP address</li>
              <li>Browser type and version</li>
              <li>Operating system</li>
              <li>Date and time of access</li>
              <li>Referring website (if applicable)</li>
            </ul>
            <p>
              This data is collected for security, error monitoring, and performance purposes and is not used to identify individual
              visitors.
            </p>
          </section>

          <section id="purpose-legal-basis" className="mt-8 rounded-2xl border border-white/10 p-6">
            <h2 className="text-2xl pb-1">4. Purpose & Legal Basis for Processing</h2>
            <ul>
              <li>
                To respond to inquiries submitted via the contact form (Art. 6(1)(b) GDPR – performance of a contract or
                pre‑contractual measures).
              </li>
              <li>
                To ensure technical operation and website security (Art. 6(1)(f) GDPR – legitimate interest).
              </li>
            </ul>
            <p>We do not use your data for marketing purposes without your explicit consent.</p>
          </section>

          <section id="storage-retention" className="mt-8 rounded-2xl border border-white/10 p-6">
            <h2 className="text-2xl pb-1">5. Data Storage & Retention</h2>
            <p>
              Your contact form submissions are transmitted securely and may be stored temporarily in our <strong>email inbox</strong>
              hosted through AWS services or another secure email provider. We keep your messages only as long as necessary to handle
              your inquiry, unless legal retention requirements apply.
            </p>
          </section>

          <section id="third-parties" className="mt-8 rounded-2xl border border-white/10 p-6">
            <h2 className="text-2xl pb-1">6. Use of Third‑Party Services</h2>
            <h3>a) AWS Amplify</h3>
            <p>
              Our website is hosted using Amazon Web Services (AWS) Amplify, provided by Amazon Web Services EMEA SARL (Luxembourg).
              Data may be processed on servers within the EU or, if necessary, in other regions under appropriate safeguards such as
              <em>Standard Contractual Clauses</em> (SCCs).
            </p>
            <h3>b) Google Fonts (locally hosted)</h3>
            <p>
              This website uses the font “IBM Plex Mono.” Fonts are hosted locally on our server, ensuring that no data is
              transmitted to Google when loading the font. If we previously used the <code>next/font/google</code> import, we have
              adjusted the setup to store fonts locally to comply with GDPR.
            </p>
          </section>

          <section id="sharing" className="mt-8 rounded-2xl border border-white/10 p-6">
            <h2 className="text-2xl pb-1">7. Data Sharing</h2>
            <p>
              We do not share, sell, or rent personal data to third parties. Data may be shared only when required by law or to
              comply with a valid legal request.
            </p>
          </section>

          <section id="rights" className="mt-8 rounded-2xl border border-white/10 p-6">
            <h2 className="text-2xl pb-1">8. Your GDPR Rights</h2>
            <ul>
              <li><strong>Right of access</strong> (Art. 15 GDPR)</li>
              <li><strong>Right to rectification</strong> (Art. 16 GDPR)</li>
              <li><strong>Right to erasure</strong> (Art. 17 GDPR)</li>
              <li><strong>Right to restriction of processing</strong> (Art. 18 GDPR)</li>
              <li><strong>Right to data portability</strong> (Art. 20 GDPR)</li>
              <li><strong>Right to object</strong> (Art. 21 GDPR)</li>
            </ul>
            <p>
              You also have the right to lodge a complaint with your local Data Protection Authority if you believe your data is
              processed unlawfully.
            </p>
          </section>

          <section id="security" className="mt-8 rounded-2xl border border-white/10 p-6">
            <h2 className="text-2xl pb-1">9. Data Security</h2>
            <p>We use HTTPS encryption and appropriate technical measures to protect your data from unauthorized access, alteration, or loss.</p>
          </section>

          <section id="cookies" className="mt-8 rounded-2xl border border-white/10 p-6">
            <h2 className="text-2xl pb-1">10. Cookies & Tracking</h2>
            <p>
              Currently, this website does not use cookies or tracking tools. If analytics or cookies are added in the future, we
              will update this policy and provide a cookie consent banner in compliance with GDPR and the ePrivacy Directive.
            </p>
          </section>

          <section id="changes" className="mt-8 rounded-2xl border border-white/10 p-6">
            <h2 className="text-2xl pb-1">11. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy occasionally to reflect new features or legal requirements. The latest version will
              always be available on this page.
            </p>
          </section>

          <section id="contact" className="mt-8 rounded-2xl border border-white/10 p-6">
            <h2 className="text-2xl pb-1">12. Contact</h2>
            <p>
              If you have questions or requests related to your personal data, please contact: <Link href="mailto:info@niwosystems.com">info@niwosystems.com</Link>
              <br />
              <em>Subject line: “Privacy Request”</em>
            </p>
            <div className="mt-6 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-200">
              By submitting our contact form, you agree that your data will be used to contact you regarding your inquiry. See this
              Privacy Policy for details.
            </div>
          </section>
        </article>
      </div>
    </main>
  );
}
