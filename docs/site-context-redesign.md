# niwo systems Site Context Redesign

Status: draft design direction
Date: 2026-06-04

## Problem Framing

The current website presents niwo systems as a security-focused independent
business with strong visual identity, but the content still reads mostly like
one individual expert offering direct help. The desired direction is broader:
niwo systems should feel like a cybersecurity consulting and research company
that explains security topics clearly in German and English, can grow into
future penetration-testing offers, and has room for academic work, projects,
and blog-style writing.

The site should not pretend to be a large mature pentest firm before that is
true. It should instead communicate serious technical focus, practical
security thinking, and a credible path toward future services.

## Target State

niwo systems becomes a bilingual cybersecurity consulting and research site.

The first impression should be:

- this is a cybersecurity company, not a generic agency
- the company explains difficult security topics clearly
- penetration testing is part of the direction, but not overclaimed
- research, writing, and technical projects are first-class parts of the brand
- German and English content are equally intentional

Recommended positioning:

> niwo systems is a cybersecurity consulting and research company focused on
> application security, security education, technical analysis, and future
> penetration-testing services.

## Voice

Use a company voice, but keep it grounded.

Recommended default voice:

- use `we` for company-level pages
- use `I` only where personal authorship matters, such as blog posts,
  research notes, or author bios
- write plainly, with enough technical depth to be credible
- avoid startup hype, vague security theater, and inflated claims
- explain terms before selling them
- make German copy native, not a literal translation of the English version

Tone examples:

- Good: "We explain what the test checks, where the limits are, and what a
  useful result looks like."
- Good: "Penetration testing is not magic. It is a structured attempt to find
  weaknesses before someone else does."
- Avoid: "We deliver world-class cyber resilience for next-generation digital
  transformation."

## Information Architecture

Recommended top-level navigation:

- Home
- Services
- Learn
- Research
- Blog
- About
- Contact

The current site can reach this gradually. The first implementation does not
need every page to be fully built.

### Home

Purpose: introduce niwo systems as a cybersecurity consulting and research
company.

Core sections:

- hero: company identity and security focus
- focus areas: application security, penetration testing direction, secure
  development, security explanations
- explanation block: how niwo systems thinks about security
- featured research or paper placeholder
- latest writing or project placeholder
- call to action: contact or start a conversation

Homepage should shift from "I help startups..." to "niwo systems helps teams
understand, assess, and improve security."

### Services

Purpose: explain consulting areas without overclaiming maturity.

Recommended service model:

- Web Application Security
- Penetration Testing
- Secure Development
- Security Reviews
- Security Education and Explanation

Current services can stay, but the copy should change from direct sales copy
to explanatory consulting copy.

Each service page should answer:

- what this topic means
- when it is useful
- what is usually checked or discussed
- what the output looks like
- what the limits are
- how to start a conversation

Penetration testing should be framed carefully:

- current wording: future-focused or selected engagements
- avoid promising broad full-scope enterprise pentesting until the offer is
  clearly defined
- emphasize web application and application security focus first

### Learn

Purpose: educational pages for readers who want to understand cybersecurity
topics before buying anything.

Recommended first topics:

- What is penetration testing?
- What is web application security?
- What is a vulnerability?
- What is threat modeling?
- What does a security review include?

These pages should be bilingual and written for technical-but-not-expert
readers: founders, developers, students, and small teams.

### Research

Purpose: show academic and serious technical work.

This should be separate from the blog. A paper deserves a more permanent,
credible location than a normal post.

Recommended structure:

- Research overview page
- Featured paper page
- Optional downloadable PDF or external publication link
- Short summary in English and German
- Author/context note
- Related project or blog links

The first paper can be presented even before publication if clearly labeled as
draft, working paper, thesis, or publication, depending on its real status.

### Blog

Purpose: ongoing writing, projects, learning notes, and commentary.

Blog categories:

- Security Notes
- Projects
- Research Diary
- Tools and Automation
- Commentary

The blog should sound more personal than service pages. It can use `I` when
Nikita is writing directly.

### About

Purpose: explain niwo systems and Nikita without making the site only a
personal profile.

Recommended angle:

- niwo systems is the company/practice
- Nikita is the founder/operator/researcher
- cybersecurity, systems, AI, and product thinking are part of the background
- credibility comes from clear thinking and technical work, not big-company
  pretending

## Content Model

### Service Page

Fields:

- title
- plain-language definition
- short technical explanation
- when it is useful
- what is included
- expected outputs
- limitations
- call to action

### Learn Page

Fields:

- title
- short answer
- why it matters
- how it works
- common misunderstandings
- practical example
- related services or research

### Research Item

Fields:

- title
- status
- abstract or summary
- author
- date
- language
- publication or institution context
- PDF or external link
- related notes

### Blog Post

Fields:

- title
- date
- author
- category
- summary
- body
- related links

## Staged Delivery

### Stage 1: Context and Copy Foundation

- rewrite homepage positioning
- change navigation labels if needed
- adjust service copy to company voice
- keep existing routes mostly intact
- preserve German and English parity

### Stage 2: Learn Section

- add `/learn`
- add first explanatory page: "What is penetration testing?"
- add at least one German equivalent page
- link learn content from service pages

### Stage 3: Research Section

- add `/research`
- add first academic paper placeholder or paper page
- support PDF or external links when ready

### Stage 4: Blog Section

- add `/blog`
- add first project or security note
- decide whether posts should be stored as JSON, MDX, or another content layer

### Stage 5: Service Expansion

- refine penetration-testing offer once scope is real
- add security review or education-focused offers
- add clearer contact flow

## Boundaries and Non-Goals

Do not redesign the entire visual identity first. The current dark,
terminal-inspired direction still fits cybersecurity well.

Do not overclaim team size, certifications, enterprise maturity, or pentest
scope that is not yet real.

Do not make every page sound like a sales page. The educational and research
sections should build trust by explaining things clearly.

Do not treat German as secondary. For this site, bilingual credibility is part
of the product.

## Assumptions

- niwo systems should remain the public brand name.
- The site can use company voice even if the company is still small, as long as
  it avoids pretending to be a large team.
- Penetration testing is a future or developing offer, not necessarily the
  fully mature core offer today.
- Academic work should be presented seriously and separately from casual blog
  posts.

## Risks and Design Pressure Test

Main risk: the site could become too broad too quickly. Consulting, education,
research, blog, projects, and pentesting are all useful, but implementing all
of them at once would dilute focus.

Recommended constraint: make Stage 1 and Stage 2 strong first. A clear
homepage plus one excellent explanatory page will improve the site more than a
large empty structure.

Second risk: using `we` can feel fake if the copy implies a large team.

Recommended constraint: use `we` for the brand and process, but keep "about"
copy transparent about niwo systems being founder-led.

Third risk: bilingual content can drift.

Recommended constraint: every new content type should have matching English
and German fields from the beginning.

## Open Decisions

- Should the site say "consulting company", "cybersecurity studio",
  "security research and consulting", or "cybersecurity practice"?
- Should penetration testing be listed as an active service, a future offering,
  or an explanatory topic first?
- Should the academic paper be published as a page, a downloadable PDF, or
  both?
- Should blog posts use MDX, JSON messages, or a small content collection
  model?

## Recommended Next Handoff

Move to implementation planning for Stage 1 only:

- update homepage copy in English and German
- update service copy tone
- adjust navigation from personal/about-heavy framing toward company framing
- keep visual structure mostly unchanged

After Stage 1 is approved, plan the first Learn page around "What is
penetration testing?"
