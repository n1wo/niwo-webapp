export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center text-center px-6 py-24 sm:px-12 md:px-20 min-h-[80vh]">
      {/* Hero Section */}
      <section className="max-w-3xl space-y-6">
        <h1 className="text-5xl sm:text-6xl font-bold text-white tracking-tight drop-shadow-[0_0_12px_rgba(255,255,255,0.15)]">
          Securing the Digital World, One Line of Code at a Time.
        </h1>

        <p className="text-lg text-zinc-400 leading-relaxed">
          I’m <span className="text-white font-medium">Nikita</span> — a
          cybersecurity student and freelance ethical hacker. I help startups,
          developers, and small businesses identify and fix vulnerabilities
          before attackers find them.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <a
            href="/contact"
            className="rounded-md border border-zinc-700 px-6 py-3 text-lg font-semibold text-zinc-200 hover:border-white hover:text-white transition-all duration-200 cursor-pointer"
          >
            Get in Touch
          </a>
          <a
            href="/services"
            className="rounded-md bg-white text-black px-6 py-3 text-lg font-semibold hover:bg-zinc-200 transition-all duration-200 cursor-pointer"
          >
            View Services
          </a>
        </div>
      </section>

      {/* Subsection */}
      <section className="max-w-3xl mt-24 text-zinc-400 space-y-4">
        <h2 className="text-2xl font-semibold text-white">What I Do</h2>
        <p className="leading-relaxed">
          My focus is on{" "}
          <span className="text-white">web application security</span>,
          <span className="text-white"> bug bounty hunting</span>, and
          <span className="text-white"> security automation</span>. I blend
          technical precision with creative problem-solving to protect digital
          systems and build user trust.
        </p>
      </section>
    </main>
  );
}
