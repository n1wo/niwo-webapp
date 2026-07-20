import type { AppLocale } from "@/i18n/routing";

export const serviceSlugs = [
  "incident-response-guidance",
  "microsoft-365-security-review",
  "web-application-security-review",
  "ai-security-readiness-review",
] as const;

export type ServiceSlug = (typeof serviceSlugs)[number];

type LocalizedService = {
  title: string;
  shortTitle: string;
  description: string;
  eyebrow: string;
  directAnswer: string;
  audience: string[];
  situations: string[];
  included: string[];
  excluded: string[];
  process: string[];
  deliverables: string[];
  prerequisites: string[];
  availability: string;
  nextAction: string;
};

export type ServiceDefinition = {
  slug: ServiceSlug;
  topicSlugs: string[];
  content: Record<AppLocale, LocalizedService>;
};

export const serviceDefinitions: ServiceDefinition[] = [
  {
    slug: "incident-response-guidance",
    topicSlugs: ["incident-response", "web-app-security"],
    content: {
      en: {
        title: "Incident-response triage and first digital guidance",
        shortTitle: "Incident guidance",
        description: "Free initial digital guidance after a suspected cyberattack: clarify immediate priorities, actions to avoid, and sensible next contacts without promising forensic investigation or recovery.",
        eyebrow: "First orientation after a suspected incident",
        directAnswer: "NIWO helps individuals and small organizations structure the first decisions after a suspected cyberattack. The initial conversation is free digital guidance, not a 24/7 hotline, forensic investigation, legal advice, managed response retainer, or guarantee of containment or recovery.",
        audience: ["Individuals who suspect an account or device compromise", "Startups and SMEs without an established incident-response contact", "Decision-makers who need to identify the safest immediate next step"],
        situations: ["Suspicious account activity, phishing, or possible credential theft", "Unexpected system behavior or a possible data exposure", "Uncertainty about evidence preservation, isolation, and who to contact"],
        included: ["A structured initial description of what is known and unknown", "Prioritization of immediate damage-limitation and evidence-preservation steps", "Guidance on suitable specialist, provider, insurer, legal, or authority escalation"],
        excluded: ["Guaranteed emergency availability or response times", "Digital forensics, malware eradication, legal advice, or representation", "A promise to contain, restore, or recover systems"],
        process: ["Share only the minimum non-sensitive facts needed for orientation", "Separate observed facts from assumptions and identify urgent risks", "Agree on safe immediate actions and the appropriate next professional contact"],
        deliverables: ["A concise written priority list when appropriate", "Documented unknowns and escalation triggers", "Pointers to suitable next-step resources or specialists"],
        prerequisites: ["Authority to discuss the affected account or system", "No credentials, private logs, patient data, or unnecessary incident details by email", "Emergency or immediate physical-safety risks must go to the appropriate emergency service"],
        availability: "Initial guidance can be provided remotely from Germany. Availability is agreed individually and is not continuous emergency coverage.",
        nextAction: "Request initial incident guidance",
      },
      de: {
        title: "Incident-Triage und erste digitale Orientierung",
        shortTitle: "Incident-Orientierung",
        description: "Kostenlose erste digitale Orientierung nach einem vermuteten Cyberangriff: Prioritäten, zu vermeidende Schritte und sinnvolle Anlaufstellen klären – ohne Forensik oder Wiederherstellung zu versprechen.",
        eyebrow: "Erste Orientierung nach einem möglichen Vorfall",
        directAnswer: "NIWO hilft Privatpersonen und kleinen Organisationen, die ersten Entscheidungen nach einem vermuteten Cyberangriff zu strukturieren. Das erste Gespräch ist kostenlose digitale Orientierung – keine 24/7-Hotline, forensische Untersuchung, Rechtsberatung, Managed-Response-Leistung oder Garantie für Eindämmung und Wiederherstellung.",
        audience: ["Privatpersonen mit Verdacht auf kompromittierte Konten oder Geräte", "Start-ups und KMU ohne feste Incident-Response-Anlaufstelle", "Entscheidungsverantwortliche, die den sichersten nächsten Schritt bestimmen müssen"],
        situations: ["Verdächtige Kontoaktivität, Phishing oder möglicher Zugangsdaten-Diebstahl", "Unerwartetes Systemverhalten oder mögliche Datenoffenlegung", "Unsicherheit zu Beweissicherung, Isolation und passenden Anlaufstellen"],
        included: ["Strukturierte Erfassung der bekannten und unbekannten Fakten", "Priorisierung erster Schritte zur Schadensbegrenzung und Beweissicherung", "Orientierung zur Eskalation an Spezialisten, Provider, Versicherer, Recht oder Behörden"],
        excluded: ["Garantierte Notfallverfügbarkeit oder Reaktionszeiten", "Digitale Forensik, Malware-Beseitigung, Rechtsberatung oder Vertretung", "Zusagen zur Eindämmung, Wiederherstellung oder Rettung von Systemen"],
        process: ["Nur die für die Orientierung nötigen, nicht sensiblen Fakten teilen", "Beobachtungen von Annahmen trennen und dringende Risiken benennen", "Sichere Sofortmaßnahmen und die passende nächste Fachstelle festlegen"],
        deliverables: ["Bei Bedarf eine kurze schriftliche Prioritätenliste", "Dokumentierte Unklarheiten und Eskalationskriterien", "Hinweise auf geeignete Ressourcen oder Fachstellen"],
        prerequisites: ["Berechtigung, über das betroffene Konto oder System zu sprechen", "Keine Zugangsdaten, privaten Logs, Patientendaten oder unnötigen Vorfalldetails per E-Mail", "Akute Gefahren gehören an die zuständigen Notfallstellen"],
        availability: "Die erste Orientierung kann remote aus Deutschland erfolgen. Verfügbarkeit wird individuell vereinbart und ist keine dauerhafte Notfallabdeckung.",
        nextAction: "Erste Incident-Orientierung anfragen",
      },
    },
  },
  {
    slug: "microsoft-365-security-review",
    topicSlugs: ["incident-response", "secure-development"],
    content: {
      en: {
        title: "Microsoft 365 Security Review",
        shortTitle: "Microsoft 365 review",
        description: "A focused review of Microsoft 365 identity, access, sharing, and security configuration for startups and SMEs, with prioritized findings and practical recommendations.",
        eyebrow: "Identity and collaboration security",
        directAnswer: "NIWO reviews selected Microsoft 365 security settings with a startup or SME, explains the material risks, and delivers prioritized recommendations. It is a scoped configuration review; remediation, continuous monitoring, licensing, and managed administration are separate decisions.",
        audience: ["Startups and SMEs using Microsoft 365", "Organizations without a recent independent configuration review", "Teams preparing to improve identity and access controls"],
        situations: ["Unclear administrator and privileged-role exposure", "Inconsistent MFA, guest access, sharing, or email-security settings", "A need for a practical security baseline before broader changes"],
        included: ["Agreed identity, access, sharing, and security-control review", "Risk-ranked findings with supporting observations", "A practical remediation sequence and ownership discussion"],
        excluded: ["Continuous monitoring or managed Microsoft 365 administration", "Guaranteed detection of every compromise or misconfiguration", "Remediation changes unless separately agreed and authorized"],
        process: ["Agree scope, tenant access method, and evidence handling", "Review selected controls using least-privilege access or guided screen sharing", "Discuss findings and deliver a prioritized action plan"],
        deliverables: ["Scoped findings report", "Prioritized remediation backlog", "Review call explaining risk, limitations, and next steps"],
        prerequisites: ["Authorized tenant contact and agreed read-only or guided access", "Current licensing and relevant business constraints", "A secure channel for any exported configuration evidence"],
        availability: "Delivered remotely for organizations that can lawfully authorize access. Geographic or regulatory constraints are confirmed during scoping.",
        nextAction: "Discuss a Microsoft 365 review",
      },
      de: {
        title: "Microsoft 365 Sicherheitsreview",
        shortTitle: "Microsoft-365-Review",
        description: "Fokussierte Prüfung von Identitäten, Zugriff, Freigaben und Sicherheitskonfiguration in Microsoft 365 für Start-ups und KMU – mit priorisierten Befunden und praktischen Empfehlungen.",
        eyebrow: "Sicherheit für Identität und Zusammenarbeit",
        directAnswer: "NIWO prüft gemeinsam mit einem Start-up oder KMU ausgewählte Microsoft-365-Sicherheitseinstellungen, erklärt wesentliche Risiken und liefert priorisierte Empfehlungen. Es handelt sich um eine klar abgegrenzte Konfigurationsprüfung; Umsetzung, laufendes Monitoring, Lizenzen und Managed Administration sind getrennte Entscheidungen.",
        audience: ["Start-ups und KMU mit Microsoft 365", "Organisationen ohne aktuelle unabhängige Konfigurationsprüfung", "Teams, die Identitäts- und Zugriffsschutz gezielt verbessern wollen"],
        situations: ["Unklare Risiken durch Administratoren und privilegierte Rollen", "Uneinheitliche MFA-, Gastzugriffs-, Freigabe- oder E-Mail-Sicherheitseinstellungen", "Bedarf an einer praktischen Sicherheitsbaseline vor größeren Änderungen"],
        included: ["Abgestimmte Prüfung von Identität, Zugriff, Freigaben und Sicherheitskontrollen", "Nach Risiko priorisierte Befunde mit nachvollziehbaren Beobachtungen", "Praktische Reihenfolge für Maßnahmen und Zuständigkeiten"],
        excluded: ["Laufendes Monitoring oder Managed Microsoft 365 Administration", "Garantie, jede Kompromittierung oder Fehlkonfiguration zu erkennen", "Konfigurationsänderungen ohne separate Vereinbarung und Freigabe"],
        process: ["Scope, Zugriffsmethode und Umgang mit Nachweisen festlegen", "Ausgewählte Kontrollen mit minimalen Leserechten oder per begleitetem Screensharing prüfen", "Befunde besprechen und priorisierten Maßnahmenplan übergeben"],
        deliverables: ["Abgegrenzter Befundbericht", "Priorisierter Maßnahmen-Backlog", "Review-Termin zu Risiken, Grenzen und nächsten Schritten"],
        prerequisites: ["Autorisierter Tenant-Kontakt und vereinbarter Lesezugriff oder begleitete Prüfung", "Aktuelle Lizenzlage und relevante geschäftliche Einschränkungen", "Sicherer Kanal für exportierte Konfigurationsnachweise"],
        availability: "Remote für Organisationen, die den Zugriff rechtmäßig autorisieren können. Geografische oder regulatorische Grenzen werden im Scoping geklärt.",
        nextAction: "Microsoft-365-Review besprechen",
      },
    },
  },
  {
    slug: "web-application-security-review",
    topicSlugs: ["web-app-security", "secure-development", "penetration-testing"],
    content: {
      en: {
        title: "Web application and secure-development review",
        shortTitle: "Web security review",
        description: "A scoped review for startups and small teams that connects web application risks, architecture, and development practices to prioritized improvements.",
        eyebrow: "Application security for small teams",
        directAnswer: "NIWO reviews an authorized web application, selected code or architecture, and the way security is handled during development. The exact depth is agreed in advance; a review is not proof that an application has no vulnerabilities and is not automatically a penetration test.",
        audience: ["Startups preparing a product or security milestone", "Small development teams without dedicated application-security capacity", "Teams that need an independent view of a specific risk area"],
        situations: ["Unclear trust boundaries, authorization, session, or data-handling decisions", "Security checks happen late or without a repeatable method", "A release, customer review, or future penetration test needs better preparation"],
        included: ["Agreed review of application flows, architecture, code samples, or controls", "Evidence-backed findings with severity and context", "Secure-development recommendations connected to team workflow"],
        excluded: ["Unlimited testing or an assurance that no vulnerabilities exist", "Testing without written authorization and an agreed scope", "Automatic remediation, compliance certification, or continuous monitoring"],
        process: ["Define assets, authorization, objectives, exclusions, and safe test boundaries", "Review the selected application and development evidence", "Validate findings and present prioritized improvements"],
        deliverables: ["Findings and limitations report", "Prioritized remediation and verification suggestions", "Technical walkthrough for the responsible team"],
        prerequisites: ["Written authorization and named technical owner", "A test environment or explicitly approved production boundaries", "Relevant architecture, code, and deployment context"],
        availability: "Remote delivery is available. Testing scope, jurisdiction, data handling, and production safety must be agreed before work starts.",
        nextAction: "Scope a web security review",
      },
      de: {
        title: "Webanwendungs- und Secure-Development-Review",
        shortTitle: "Web-Security-Review",
        description: "Abgegrenzte Prüfung für Start-ups und kleine Teams, die Webanwendungsrisiken, Architektur und Entwicklungspraktiken mit priorisierten Verbesserungen verbindet.",
        eyebrow: "Application Security für kleine Teams",
        directAnswer: "NIWO prüft eine autorisierte Webanwendung, ausgewählte Code- oder Architekturteile und den Umgang mit Sicherheit in der Entwicklung. Die Prüftiefe wird vorab vereinbart; ein Review beweist keine Schwachstellenfreiheit und ist nicht automatisch ein Penetrationstest.",
        audience: ["Start-ups vor einem Produkt- oder Sicherheitsmeilenstein", "Kleine Entwicklungsteams ohne eigene Application-Security-Rolle", "Teams, die eine unabhängige Sicht auf einen bestimmten Risikobereich brauchen"],
        situations: ["Unklare Trust Boundaries, Berechtigungen, Sessions oder Datenverarbeitung", "Sicherheitsprüfungen erfolgen spät oder ohne wiederholbare Methode", "Release, Kundenprüfung oder künftiger Penetrationstest sollen besser vorbereitet werden"],
        included: ["Abgestimmte Prüfung von Anwendungsflüssen, Architektur, Codeausschnitten oder Kontrollen", "Nachvollziehbare Befunde mit Schweregrad und Kontext", "Secure-Development-Empfehlungen passend zum Team-Workflow"],
        excluded: ["Unbegrenzte Tests oder Zusicherung, dass keine Schwachstellen existieren", "Tests ohne schriftliche Freigabe und vereinbarten Scope", "Automatische Behebung, Compliance-Zertifizierung oder laufendes Monitoring"],
        process: ["Assets, Freigabe, Ziele, Ausschlüsse und sichere Testgrenzen definieren", "Ausgewählte Anwendung und Entwicklungsnachweise prüfen", "Befunde validieren und priorisierte Verbesserungen vorstellen"],
        deliverables: ["Befund- und Grenzenbericht", "Priorisierte Hinweise zu Behebung und Verifikation", "Technische Besprechung mit dem verantwortlichen Team"],
        prerequisites: ["Schriftliche Autorisierung und benannte technische Verantwortung", "Testumgebung oder ausdrücklich freigegebene Produktionsgrenzen", "Relevanter Architektur-, Code- und Deployment-Kontext"],
        availability: "Remote möglich. Testumfang, Rechtsraum, Datenverarbeitung und Produktionssicherheit müssen vor Beginn vereinbart sein.",
        nextAction: "Web-Security-Review abgrenzen",
      },
    },
  },
  {
    slug: "ai-security-readiness-review",
    topicSlugs: ["ai-in-devsecops", "agentic-engineering", "secure-development"],
    content: {
      en: {
        title: "AI Security Readiness Review",
        shortTitle: "AI readiness review",
        description: "A security-first readiness review for teams introducing AI: secure the environment, identify data and control risks, and design bounded AI-assisted workflows.",
        eyebrow: "Controlled adoption of AI",
        directAnswer: "NIWO helps a startup or SME assess whether its environment, data handling, access controls, and operating process are ready for a proposed AI-assisted workflow. The review prioritizes security and control before automation; it does not guarantee model accuracy, compliance, or business outcomes.",
        audience: ["Teams planning their first controlled AI workflow", "Organizations already using public AI tools without a shared risk model", "Product teams adding model or agent capabilities"],
        situations: ["Sensitive data may reach an unapproved model or connector", "Tool permissions and human approval boundaries are unclear", "The team needs a proportionate security baseline before a pilot"],
        included: ["Use-case, data-flow, access, provider, and threat review", "Control gaps and prioritized safeguards", "A bounded pilot shape with human approval and monitoring points"],
        excluded: ["Legal or regulatory certification", "Guarantees about model output, provider behavior, or return on investment", "Building an unrestricted autonomous agent or bypassing existing controls"],
        process: ["Describe the intended outcome, data, users, providers, and integrations", "Map trust boundaries, failure modes, and existing safeguards", "Define a controlled pilot and prioritized readiness actions"],
        deliverables: ["AI use-case risk and readiness summary", "Data, access, logging, and approval control recommendations", "Pilot guardrails and verification checklist"],
        prerequisites: ["A specific proposed use case rather than a generic AI ambition", "Known data categories, intended users, providers, and integrations", "Named ownership for security, privacy, and operational approval"],
        availability: "Remote advisory is available for scoped use cases. Legal and sector-specific compliance questions require qualified specialists.",
        nextAction: "Discuss AI security readiness",
      },
      de: {
        title: "KI-Sicherheitsbereitschaft prüfen",
        shortTitle: "AI-Readiness-Review",
        description: "Security-first-Readiness-Review für die Einführung von KI: Umgebung absichern, Daten- und Kontrollrisiken erkennen und begrenzte KI-gestützte Workflows entwerfen.",
        eyebrow: "Kontrollierte Einführung von KI",
        directAnswer: "NIWO unterstützt Start-ups und KMU bei der Prüfung, ob Umgebung, Datenverarbeitung, Zugriffskontrollen und Betriebsprozess für einen geplanten KI-gestützten Workflow bereit sind. Sicherheit und Kontrolle kommen vor Automatisierung; Modellgenauigkeit, Compliance oder Geschäftserfolg werden nicht garantiert.",
        audience: ["Teams vor ihrem ersten kontrollierten KI-Workflow", "Organisationen, die öffentliche KI-Werkzeuge bereits ohne gemeinsames Risikomodell nutzen", "Produktteams, die Modell- oder Agentenfunktionen ergänzen"],
        situations: ["Sensible Daten könnten ein nicht freigegebenes Modell oder einen Connector erreichen", "Werkzeugrechte und menschliche Freigabegrenzen sind unklar", "Vor einem Pilotprojekt wird eine angemessene Sicherheitsbaseline benötigt"],
        included: ["Prüfung von Use Case, Datenfluss, Zugriff, Provider und Bedrohungen", "Kontrolllücken und priorisierte Schutzmaßnahmen", "Begrenztes Pilotmodell mit menschlichen Freigaben und Monitoringpunkten"],
        excluded: ["Rechtliche oder regulatorische Zertifizierung", "Garantien für Modellausgaben, Providerverhalten oder wirtschaftlichen Erfolg", "Bau eines unbeschränkten autonomen Agenten oder Umgehung bestehender Kontrollen"],
        process: ["Ziel, Daten, Nutzer, Provider und Integrationen beschreiben", "Trust Boundaries, Fehlermodi und bestehende Schutzmaßnahmen abbilden", "Kontrollierten Pilot und priorisierte Readiness-Maßnahmen definieren"],
        deliverables: ["Risiko- und Readiness-Zusammenfassung zum KI-Use-Case", "Empfehlungen zu Daten-, Zugriffs-, Logging- und Freigabekontrollen", "Pilot-Guardrails und Verifikationscheckliste"],
        prerequisites: ["Konkreter Use Case statt allgemeiner KI-Absicht", "Bekannte Datenkategorien, Nutzer, Provider und Integrationen", "Benannte Verantwortung für Sicherheit, Datenschutz und operative Freigabe"],
        availability: "Remote-Beratung für abgegrenzte Use Cases. Rechtliche und branchenspezifische Compliance-Fragen benötigen qualifizierte Fachleute.",
        nextAction: "AI Security Readiness besprechen",
      },
    },
  },
];

export function getServiceBySlug(slug: string): ServiceDefinition | undefined {
  return serviceDefinitions.find((service) => service.slug === slug);
}
