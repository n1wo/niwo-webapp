export default function AboutPage() {
  return (
    <main className="min-h-[75vh] bg-background px-6 pb-24 pt-28 text-foreground font-ibm sm:px-10 lg:px-16">
      <section className="mx-auto max-w-6xl">
        <div className="rounded-xl border border-white/10 bg-black/20 p-8 shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-[3px] sm:p-10">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-medium uppercase tracking-[0.32em] text-zinc-500">
              ABOUT
            </p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              The person behind the system
            </h1>
            <p className="mt-6 text-base leading-8 text-zinc-300 sm:text-lg">
              Hey, I&apos;m Nikita. I tend to get pulled toward cybersecurity, AI,
              systems, and product design for the same reason: I like seeing how
              things actually work once you get past the surface. Most of the time
              that turns into thinking about trust, failure points, and how to build
              things that are useful without being careless.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[0.68rem] uppercase tracking-[0.22em] text-zinc-400">
                operator profile
              </span>
              <span className="rounded-full border border-emerald-300/15 bg-emerald-300/8 px-3 py-1 text-[0.68rem] uppercase tracking-[0.22em] text-zinc-300">
                status: building
              </span>
            </div>
          </div>
        </div>

        <div className="mx-auto mt-12 max-w-5xl">
          <div className="flex items-center gap-4 text-xs uppercase tracking-[0.28em] text-zinc-500">
            <span className="h-px flex-1 bg-white/10" />
            <span>Signal</span>
            <span className="h-px flex-1 bg-white/10" />
          </div>
          <p className="mt-5 text-center text-sm leading-7 text-zinc-400 sm:text-base">
            I care about whether something actually holds up — whether it feels trustworthy, makes sense, and works the way it should when it matters.
          </p>
        </div>

        <div className="mx-auto mt-12 grid max-w-6xl gap-5 md:grid-cols-2 xl:grid-cols-3">
          <article className="rounded-xl border border-white/10 bg-black/25 p-6 shadow-[0_18px_50px_rgba(0,0,0,0.24)] backdrop-blur-[3px]">
            <p className="text-[0.7rem] uppercase tracking-[0.24em] text-zinc-500">
              What drives me
            </p>
            <h2 className="mt-4 text-xl font-semibold text-white">
              I like understanding the architecture behind the surface.
            </h2>
            <p className="mt-4 text-sm leading-7 text-zinc-300">
              Curiosity is a lot of it, honestly. I like following a system to the point where it starts to show its edges: where it breaks, where it gets fragile, and where the security assumptions stop being theoretical.
            </p>
          </article>

          <article className="rounded-xl border border-white/10 bg-black/25 p-6 shadow-[0_18px_50px_rgba(0,0,0,0.24)] backdrop-blur-[3px]">
            <p className="text-[0.7rem] uppercase tracking-[0.24em] text-zinc-500">
              What I&apos;m building
            </p>
            <h2 className="mt-4 text-xl font-semibold text-white">
              I&apos;m interested in building things that are useful, secure, and clear.
            </h2>
            <p className="mt-4 text-sm leading-7 text-zinc-300">
              Lately I keep coming back to the overlap between security, AI, and
              product design. I like building in that space because it forces better
              questions: not just whether something works, but whether it holds up,
              makes sense, and can be trusted.
            </p>
          </article>

          <article className="rounded-xl border border-white/10 bg-black/25 p-6 shadow-[0_18px_50px_rgba(0,0,0,0.24)] backdrop-blur-[3px] md:col-span-2 xl:col-span-1">
            <p className="text-[0.7rem] uppercase tracking-[0.24em] text-zinc-500">
              Outside the screen
            </p>
            <h2 className="mt-4 text-xl font-semibold text-white">
              I notice the small things that make something easier to trust and use.
            </h2>
            <p className="mt-4 text-sm leading-7 text-zinc-300">
              Things like clarity, pacing, and friction stand out to me, mostly because
              they affect whether something feels intuitive or frustrating. I like clean
              interfaces, but only when they actually help something feel easier to use
              and better thought through.
            </p>
          </article>
        </div>
      </section>
    </main>
  );
}
