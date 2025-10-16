export const metadata = {
  title: "Vulnerability Disclosure Policy | niwo",
  description: "How to responsibly report vulnerabilities to the niwo security team.",
};

export default function VdpPage() {
  return (
    <main className="min-h-[75vh] bg-white text-gray-900 dark:bg-neutral-950 dark:text-gray-100 px-6 py-26">
      <section className="max-w-3xl mx-auto space-y-6">
        <h1 className="text-4xl font-bold tracking-tight">Vulnerability Disclosure Policy</h1>

        <p>
          Security is a top priority for us at <strong>niwo</strong>. We appreciate the contributions of
          security researchers and the responsible disclosure of potential vulnerabilities.
        </p>

        <h2 className="text-2xl font-semibold mt-8">Scope</h2>
        <p>
          This policy applies to any digital assets owned, operated, or maintained by niwo, including
          <code className="px-2 py-0.5 bg-gray-100 dark:bg-neutral-800 rounded">niwosystems.com</code>
          and its associated subdomains.
        </p>

        <h2 className="text-2xl font-semibold mt-8">Guidelines</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>Do not exploit vulnerabilities beyond what is necessary to demonstrate them.</li>
          <li>Do not access or modify user data without consent.</li>
          <li>Do not disrupt or degrade our services.</li>
          <li>Provide sufficient details so we can reproduce and validate the issue.</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8">Reporting</h2>
        <p>
          If you discover a vulnerability, please report it responsibly by emailing us at
          <a
            href="mailto:security@niwosystems.com"
            className="text-blue-600 dark:text-blue-400 underline ml-1"
          >
            security@niwosystems.com
          </a>.
        </p>

        <p>
          Include the following information where possible:
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Description of the vulnerability</li>
            <li>Steps to reproduce</li>
            <li>Potential impact</li>
            <li>Suggested remediation (if available)</li>
          </ul>
        </p>

        <h2 className="text-2xl font-semibold mt-8">Acknowledgement</h2>
        <p>
          We may publicly acknowledge valid reports that help us improve our security posture.
          Thank you for helping keep niwo and its users safe.
        </p>
      </section>
    </main>
  );
}