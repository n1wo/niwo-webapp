export const metadata = {
  title: "Imprint | niwo systems",
  description:
    "Legal notice for niwo systems. Non-commercial informational website. Professional offers handled privately, outside this platform.",
  robots: { index: true, follow: true },
};

export default function ImprintPage() {
  return (
    <main className="min-h-[75vh] bg-white text-gray-900 dark:bg-neutral-950 dark:text-gray-100">
      <section className="mx-auto max-w-3xl px-6 py-26">
        <header className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight">Imprint</h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Last updated: 16 Oct 2025
          </p>
        </header>

        <div className="space-y-8">
          <section className="space-y-3">
            <h2 className="text-2xl font-semibold">Provider Identification</h2>
            <p>
              <strong>Responsible according to § 5 TMG / EU eCommerce Directive</strong>
              <br />
              niwo systems
              <br />
              Owner: N. W.
              <br />
              Email:{" "}
              <a
                href="mailto:legal@niwosystems.com"
                className="underline text-blue-600 dark:text-blue-400"
              >
                legal@niwosystems.com
              </a>
              <br />
              Address: available upon request
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold">Nature of the Website</h2>
            <p>
              This website is a <strong>non-commercial informational project</strong> focused on
              technology and security research. <em>No goods or services are sold</em> directly
              through this platform.
            </p>
            <p className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm dark:border-neutral-800 dark:bg-neutral-900">
              <strong>Disclaimer:</strong> This website does not directly offer paid services. Any
              professional collaboration or offer resulting from private contact is{" "}
              <strong>handled outside this platform</strong> (e.g., via email or a separate
              contract).
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold">Contact</h2>
            <p>
              For legal notices or formal correspondence, please reach out via{" "}
              <a
                href="mailto:legal@niwosystems.com"
                className="underline text-blue-600 dark:text-blue-400"
              >
                legal@niwosystems.com
              </a>
              . If a physical mailing address is required for formal service, it will be provided
              upon request.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold">Liability for Content</h2>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Content is created with care; however, no warranty is given for completeness or
              accuracy. Links to external sites are provided for convenience; responsibility for
              their content lies with the respective providers.
            </p>
          </section>
        </div>
      </section>
    </main>
  );
}