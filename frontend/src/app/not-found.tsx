import Link from "next/link";

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0a0a0a] px-6 py-20 text-center">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(95,98,184,0.16),transparent_32%),radial-gradient(circle_at_80%_20%,rgba(140,127,224,0.12),transparent_24%),#0a0a0a]" />
      <div className="absolute inset-0 opacity-40 [background-image:linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] [background-size:72px_72px]" />

      <div className="relative w-full max-w-2xl rounded-[1.75rem] border border-white/[0.08] bg-black/25 px-8 py-14 shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur-md sm:px-12">
        <div className="mx-auto max-w-xl space-y-6">
          <p className="font-mono text-sm font-medium uppercase tracking-[0.28em] text-[var(--color-accent-light)]">
            Terminal Closed
          </p>
          <h1 className="font-mono text-6xl font-bold tracking-tight text-white sm:text-7xl">
            404
          </h1>
          <div className="space-y-3">
            <h2 className="font-mono text-2xl font-semibold text-white sm:text-3xl">
              Not Found
            </h2>
            <p className="text-lg leading-8 text-zinc-400">
              Could not find the requested resource.
            </p>
          </div>

          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.03] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1}
              stroke="currentColor"
              className="h-12 w-12 text-[var(--color-accent-light)]"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z"
              />
            </svg>
          </div>

          <div className="flex items-center justify-center gap-4 pt-2">
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-lg bg-[var(--color-accent)] px-6 py-3 font-mono text-sm font-semibold text-white shadow-[0_0_24px_var(--color-accent-glow)] transition-all duration-200 hover:bg-[var(--color-accent-light)] hover:shadow-[0_0_32px_rgb(140_127_224/0.34)]"
            >
              Return Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
