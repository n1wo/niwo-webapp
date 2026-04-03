import type { AppLocale } from "@/i18n/routing";
import type {
  DayOneMessage,
  DecisionRecord,
  IncidentChoice,
  IncidentOption,
  MetricScores,
  SummaryTone,
} from "@/components/trust-boundary/types";

const EN_MESSAGES: DayOneMessage[] = [
  {
    id: "internal-tool-update",
    category: "Internal Tool Notification",
    sender: "ops@niwo.local",
    subject: "Project board updated for Sprint 4",
    preview:
      "The internal board has been refreshed with today’s tasks and deployment reminders.",
    visibleClues: ["Internal sender", "Normal tone", "No urgent request"],
    investigateClues: [
      "The sender domain matches the internal mail host.",
      "No links or attachments are hidden in the message body.",
    ],
    bestAction: "allow",
    allowFeedback: "Routine internal update confirmed. Work keeps moving.",
    quarantineFeedback:
      "This was harmless. Blocking normal internal work slows the team down.",
  },
  {
    id: "fake-password-reset",
    category: "Fake Password Reset",
    sender: "m365-alerts@micr0soft-login.co",
    subject: "Urgent: Your Microsoft 365 password expires today",
    preview:
      "Your account will be disabled unless you confirm your credentials immediately.",
    visibleClues: ["Urgent language", "Login prompt link", "Slightly off sender domain"],
    investigateClues: [
      "The sender domain does not match the company provider.",
      "The linked destination resolves to a suspicious external domain.",
    ],
    bestAction: "quarantine",
    allowFeedback:
      "A fake login page was trusted. This can create trouble later in the day.",
    quarantineFeedback: "Good catch. The message was trying to steal credentials.",
    incidentTrigger: true,
  },
  {
    id: "customer-inquiry",
    category: "Real Customer Inquiry",
    sender: "r.holtz@kinetic-retail.com",
    subject: "Question about pricing for team rollout",
    preview:
      "A potential customer wants a callback and asks for rollout timing and pricing details.",
    visibleClues: ["External sender", "Clear business request", "No suspicious attachment"],
    investigateClues: [
      "The sender domain resolves to a normal corporate site.",
      "No link redirection or disguised attachments are present.",
    ],
    bestAction: "allow",
    allowFeedback: "Potential business opportunity preserved.",
    quarantineFeedback:
      "This was a real customer inquiry. The team may miss a lead now.",
  },
  {
    id: "shared-document-invite",
    category: "Shared Document Invite",
    sender: "jamie-docs@sharevault-access.net",
    subject: "Jamie shared a document with you",
    preview:
      "A collaboration-style message asks you to open a document and review it quickly.",
    visibleClues: [
      "Familiar collaboration pattern",
      "Generic wording",
      "Coworker name appears in the body",
    ],
    investigateClues: [
      "The sender address is not from the collaboration provider.",
      "The link preview uses a strange domain.",
      "Your coworker says they did not send anything.",
    ],
    bestAction: "quarantine",
    allowFeedback:
      "The fake document was opened. Something malicious may now be running.",
    quarantineFeedback:
      "The document invite was fake. Investigation prevented a likely compromise.",
    incidentTrigger: true,
  },
  {
    id: "supplier-delay-notice",
    category: "Supplier Delay Notice",
    sender: "dispatch@hafen-supply.eu",
    subject: "Updated delivery timeline for your equipment order",
    preview:
      "The formatting is rough, but the sender claims the startup’s equipment shipment slipped again.",
    visibleClues: ["Awkward formatting", "Unfamiliar sender name", "No direct pressure language"],
    investigateClues: [
      "The sender domain matches the actual supplier.",
      "Your coworker confirms equipment was expected this week.",
    ],
    bestAction: "allow",
    allowFeedback:
      "Strange-looking, but legitimate. Good judgment keeps work moving.",
    quarantineFeedback:
      "Not every rough-looking message is malicious. This blocks an important update.",
  },
  {
    id: "delivery-scam",
    category: "Package Delivery Scam",
    sender: "notice@quickdrop-track.info",
    subject: "Delivery failed - confirm address now",
    preview:
      "A courier-style alert pressures you to confirm the office address immediately.",
    visibleClues: ["Generic courier branding", "Urgent tone", "Immediate action request"],
    investigateClues: [
      "The sender domain is wrong for the courier.",
      "The link preview points to a suspicious tracking site.",
    ],
    bestAction: "quarantine",
    allowFeedback: "Another risky link was trusted. The day is getting messier.",
    quarantineFeedback: "Common scam pattern recognized and safely blocked.",
  },
];

const DE_MESSAGES: DayOneMessage[] = [
  {
    id: "internal-tool-update",
    category: "Interne Tool-Benachrichtigung",
    sender: "ops@niwo.local",
    subject: "Projektboard fuer Sprint 4 aktualisiert",
    preview:
      "Das interne Board wurde mit den Aufgaben und Deploy-Hinweisen fuer heute aktualisiert.",
    visibleClues: ["Interner Absender", "Normaler Ton", "Keine dringende Aufforderung"],
    investigateClues: [
      "Die Absender-Domain passt zum internen Mail-Host.",
      "Im Nachrichtentext sind keine versteckten Links oder Anhaenge enthalten.",
    ],
    bestAction: "allow",
    allowFeedback:
      "Normales internes Update bestaetigt. Die Arbeit kann weiterlaufen.",
    quarantineFeedback:
      "Das war harmlos. Normale interne Arbeit zu blockieren bremst das Team aus.",
  },
  {
    id: "fake-password-reset",
    category: "Gefaelschter Passwort-Reset",
    sender: "m365-alerts@micr0soft-login.co",
    subject: "Dringend: Dein Microsoft-365-Passwort laeuft heute ab",
    preview:
      "Dein Konto wird deaktiviert, wenn du deine Zugangsdaten nicht sofort bestaetigst.",
    visibleClues: ["Dringende Sprache", "Login-Link", "Leicht falsche Absender-Domain"],
    investigateClues: [
      "Die Absender-Domain passt nicht zum echten Provider.",
      "Das Link-Ziel fuehrt auf eine verdaechtige externe Domain.",
    ],
    bestAction: "quarantine",
    allowFeedback:
      "Eine gefaelschte Login-Seite wurde vertraut. Das kann spaeter Probleme ausloesen.",
    quarantineFeedback: "Gut erkannt. Die Nachricht wollte Zugangsdaten stehlen.",
    incidentTrigger: true,
  },
  {
    id: "customer-inquiry",
    category: "Echte Kundenanfrage",
    sender: "r.holtz@kinetic-retail.com",
    subject: "Frage zur Preisgestaltung fuer Team-Rollout",
    preview:
      "Ein potenzieller Kunde moechte einen Rueckruf und fragt nach Rollout-Timing und Preisen.",
    visibleClues: ["Externer Absender", "Klare Business-Anfrage", "Kein verdaechtiger Anhang"],
    investigateClues: [
      "Die Domain des Absenders fuehrt auf eine normale Firmenwebsite.",
      "Es gibt keine Weiterleitungen oder getarnten Anhaenge.",
    ],
    bestAction: "allow",
    allowFeedback: "Moegliche Geschaeftschance erhalten.",
    quarantineFeedback:
      "Das war eine echte Kundenanfrage. Das Team koennte jetzt einen Lead verlieren.",
  },
  {
    id: "shared-document-invite",
    category: "Freigegebene Dokumenteinladung",
    sender: "jamie-docs@sharevault-access.net",
    subject: "Jamie hat ein Dokument mit dir geteilt",
    preview:
      "Eine typische Kollaborationsnachricht fordert dich auf, schnell ein Dokument zu oeffnen.",
    visibleClues: [
      "Vertrautes Kollaborationsmuster",
      "Generische Formulierung",
      "Name des Coworkers im Nachrichtentext",
    ],
    investigateClues: [
      "Die Absenderadresse gehoert nicht zum echten Kollaborationsdienst.",
      "Die Link-Vorschau nutzt eine seltsame Domain.",
      "Dein Coworker sagt, dass er nichts geschickt hat.",
    ],
    bestAction: "quarantine",
    allowFeedback:
      "Das gefaelschte Dokument wurde geoeffnet. Jetzt koennte Schadcode laufen.",
    quarantineFeedback:
      "Die Dokumenteinladung war gefaelscht. Die Untersuchung hat einen wahrscheinlichen Kompromiss verhindert.",
    incidentTrigger: true,
  },
  {
    id: "supplier-delay-notice",
    category: "Lieferanten-Hinweis zur Verzoegerung",
    sender: "dispatch@hafen-supply.eu",
    subject: "Aktualisierte Lieferzeit fuer eure Hardware-Bestellung",
    preview:
      "Die Formatierung ist holprig, aber der Absender behauptet, dass sich die Lieferung erneut verzoegert.",
    visibleClues: ["Unsaubere Formatierung", "Unbekannter Absendername", "Keine direkte Drucksprache"],
    investigateClues: [
      "Die Domain passt zum echten Lieferanten.",
      "Dein Coworker bestaetigt, dass diese Woche Hardware erwartet wurde.",
    ],
    bestAction: "allow",
    allowFeedback:
      "Sieht komisch aus, ist aber legitim. Gutes Urteil haelt die Arbeit am Laufen.",
    quarantineFeedback:
      "Nicht jede seltsam wirkende Nachricht ist boesartig. So blockierst du ein wichtiges Update.",
  },
  {
    id: "delivery-scam",
    category: "Paket-Lieferbetrug",
    sender: "notice@quickdrop-track.info",
    subject: "Lieferung fehlgeschlagen - Adresse jetzt bestaetigen",
    preview:
      "Eine Kurier-Nachricht setzt dich unter Druck, die Bueroadresse sofort zu bestaetigen.",
    visibleClues: ["Generisches Kurier-Branding", "Dringender Ton", "Sofortige Aktion verlangt"],
    investigateClues: [
      "Die Absender-Domain passt nicht zum Kurier.",
      "Die Link-Vorschau fuehrt zu einer verdaechtigen Tracking-Seite.",
    ],
    bestAction: "quarantine",
    allowFeedback: "Wieder wurde ein riskanter Link vertraut. Der Tag wird unruhiger.",
    quarantineFeedback: "Typisches Scam-Muster erkannt und sicher blockiert.",
  },
];

const EN_INCIDENT_OPTIONS: IncidentOption[] = [
  {
    id: "reset-password",
    label: "Reset password",
    description: "Fast containment with minimal business disruption.",
  },
  {
    id: "disable-account",
    label: "Disable account",
    description: "Stops movement fast, but it hits continuity harder.",
  },
  {
    id: "check-mailbox-rules",
    label: "Check mailbox rules",
    description: "A careful response that looks for persistence and forwarding.",
  },
  {
    id: "ignore",
    label: "Ignore",
    description: "Hope it resolves itself and keep the day moving.",
  },
];

const DE_INCIDENT_OPTIONS: IncidentOption[] = [
  {
    id: "reset-password",
    label: "Passwort zuruecksetzen",
    description: "Schnelle Eindaemmung mit wenig Stoerung fuer den Betrieb.",
  },
  {
    id: "disable-account",
    label: "Konto deaktivieren",
    description: "Stoppt die Lage sofort, trifft aber die Kontinuitaet staerker.",
  },
  {
    id: "check-mailbox-rules",
    label: "Mailbox-Regeln pruefen",
    description: "Vorsichtige Reaktion, die nach Persistenz und Weiterleitungen sucht.",
  },
  {
    id: "ignore",
    label: "Ignorieren",
    description: "Darauf hoffen, dass es sich von selbst erledigt.",
  },
];

const INCIDENT_DELTAS: Record<IncidentChoice, MetricScores> = {
  "reset-password": { trust: 10, continuity: 4, judgment: 10 },
  "disable-account": { trust: 6, continuity: -6, judgment: 6 },
  "check-mailbox-rules": { trust: 8, continuity: 2, judgment: 12 },
  ignore: { trust: -12, continuity: -10, judgment: -14 },
};

function clampScore(value: number): number {
  return Math.max(0, Math.min(100, value));
}

export function getDayOneMessages(locale: AppLocale): DayOneMessage[] {
  return locale === "de" ? DE_MESSAGES : EN_MESSAGES;
}

export function getIncidentOptions(locale: AppLocale): IncidentOption[] {
  return locale === "de" ? DE_INCIDENT_OPTIONS : EN_INCIDENT_OPTIONS;
}

export function calculateMetrics(
  messages: DayOneMessage[],
  decisions: DecisionRecord[],
  incidentChoice: IncidentChoice | null,
): MetricScores {
  const scores: MetricScores = {
    trust: 52,
    continuity: 52,
    judgment: 52,
  };

  const messageMap = new Map(messages.map((message) => [message.id, message]));

  decisions.forEach((decision) => {
    const message = messageMap.get(decision.messageId);
    if (!message) return;

    const correct = decision.action === message.bestAction;
    const isLegitimate = message.bestAction === "allow";

    if (correct) {
      scores.judgment += message.id === "supplier-delay-notice" ? 14 : 10;
      scores.trust += isLegitimate ? 4 : 7;
      scores.continuity += isLegitimate ? 8 : 4;

      if (decision.investigated) {
        scores.judgment += 3;
        scores.trust += 1;
      }
    } else {
      scores.judgment -= message.id === "supplier-delay-notice" ? 12 : 10;
      scores.trust -= isLegitimate ? 7 : 12;
      scores.continuity -= isLegitimate ? 9 : 10;
    }
  });

  if (incidentChoice) {
    const delta = INCIDENT_DELTAS[incidentChoice];
    scores.trust += delta.trust;
    scores.continuity += delta.continuity;
    scores.judgment += delta.judgment;
  }

  return {
    trust: clampScore(scores.trust),
    continuity: clampScore(scores.continuity),
    judgment: clampScore(scores.judgment),
  };
}

export function getSummaryTone(scores: MetricScores): SummaryTone {
  const average = (scores.trust + scores.continuity + scores.judgment) / 3;

  if (average >= 68) return "strong";
  if (average >= 45) return "mixed";
  return "poor";
}

export function getSummaryNarrative(
  locale: AppLocale,
  tone: SummaryTone,
  incidentChoice: IncidentChoice | null,
): string {
  const narratives =
    locale === "de"
      ? {
          strong:
            "Der erste Tag fuehlt sich kontrolliert an. Du schuetzt die Arbeit, ohne in reine Paranoia zu kippen.",
          mixed:
            "Einige Entscheidungen waren stark, andere teuer. Der Grundgedanke sitzt, aber die Grauzonen bleiben gefaehrlich.",
          poor:
            "Der Tag ist ins Rutschen geraten. Zu viel Vertrauen oder zu viel Reibung hat dem Team sichtbar geschadet.",
          incident: {
            "reset-password":
              "Das Zuruecksetzen des Passworts hat die Lage stabilisiert, bevor sie weiter kippen konnte.",
            "disable-account":
              "Das Deaktivieren des Kontos hat den Schaden begrenzt, aber die Arbeit deutlich gestoert.",
            "check-mailbox-rules":
              "Das Pruefen der Mailbox-Regeln zeigt, dass du nicht nur reagierst, sondern sauber denkst.",
            ignore:
              "Das Ignorieren des Vorfalls hat die Lage offen gelassen und das Urteil am Ende deutlich geschwaecht.",
          },
        }
      : {
          strong:
            "The first day feels controlled. You protected the work without sliding into paranoia.",
          mixed:
            "Some calls were strong and some were costly. The core idea is there, but the gray areas still bite.",
          poor:
            "The day slipped away. Too much trust or too much friction hurt the team in visible ways.",
          incident: {
            "reset-password":
              "Resetting the password stabilized the situation before it could spread.",
            "disable-account":
              "Disabling the account contained damage, but it hit normal work hard.",
            "check-mailbox-rules":
              "Checking mailbox rules showed a more careful response than simple panic containment.",
            ignore:
              "Ignoring the incident left the situation exposed and dragged the final judgment down.",
          },
        };

  if (!incidentChoice) return narratives[tone];
  return `${narratives[tone]} ${narratives.incident[incidentChoice]}`;
}
