// frontend/src/app/about/page.tsx
export default function AboutPage() {
  return (
    <main className="min-h-[75vh] bg-background text-foreground flex flex-col items-center justify-top p-8 pt-40 font-ibm">
      <section className="max-w-2xl text-center space-y-6">
        <h1 className="text-4xl font-bold tracking-tight">About Me</h1>
        <p className="text-lg leading-relaxed text-muted-foreground">
          Hi, I’m <strong>Nikita</strong> — a curious mind passionate about technology, 
          security, and clean design. I enjoy exploring how systems work, building 
          things that connect people, and creating simple, meaningful digital experiences.
        </p>
        <p className="text-lg leading-relaxed text-muted-foreground">
          This site is built with <strong>Next.js 16</strong>, <strong>React 19</strong>, 
          and <strong>Tailwind CSS</strong>, hosted on <strong>AWS Amplify</strong>. 
          It’s my little corner of the web where I share experiments, projects, and ideas.
        </p>
        <p className="text-lg text-muted-foreground">
          When I’m not coding, you’ll probably find me digging into security topics, 
          learning something new, or refining the small details that make a product shine.
        </p>
      </section>
    </main>
  );
}
