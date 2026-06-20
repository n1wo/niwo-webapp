// All user-visible text for the Phishing Defense Lab, keyed by locale.
// Kept as TypeScript (not next-intl JSON) to avoid ICU escaping issues
// with apostrophes in the email body copy.

import { extraLabEmails } from './extra-scenarios';

export interface EmailBlock {
  type: 'text' | 'cta' | 'link';
  text: string;
  url?: string;
}

export interface LabEmail {
  channel?: 'email' | 'sms' | 'qr';
  category: string;
  difficulty: string;
  time: string;
  fromName: string;
  fromAddr: string;
  subject: string;
  preview: string;
  isPhishing: boolean;
  damage: number;
  lossType: string;
  body: EmailBlock[];
  explain: string;
  clues: string[];
}

export interface Grade {
  label: string;
  color: string;
  short: string;
  blurb: string;
}

export interface LabCopy {
  // intro
  eyebrow: string;
  title: string;
  description: string;
  terminalCmd: string;
  tip1: string;
  tip2: string;
  warn1: string;
  warn2: string;
  pills: [string, string, string, string];
  startButton: string;
  // play
  statusLabel: string;
  caughtLabel: string;
  missedLabel: string;
  exposureLabel: string;
  mailChromeTitle: string;
  inboxLabel: string;
  reviewed: (done: number, total: number) => string;
  linkTip: string;
  linkArrow: string;
  question: string;
  reportPhishing: string;
  looksLegit: string;
  // verdict
  goodCall: string;
  trap: string;
  falseAlarm: string;
  wasPhishingVerdict: string;
  wasLegitVerdict: string;
  redFlags: string;
  signsSafe: string;
  lossPhishing: (amount: string, type: string) => string;
  lossLegit: (amount: string) => string;
  nextEmail: string;
  seeResults: string;
  // done
  resultsEyebrow: string;
  grades: { champion: Grade; solid: Grade; practice: Grade; risk: Grade };
  spottedLabel: string;
  stoppedLabel: string;
  damageLabel: string;
  breakdownTitle: string;
  breakdownMeta: (category: string, chosePhishing: boolean, isPhishing: boolean) => string;
  threatStopped: string;
  keptCorrectly: string;
  dateLocale: string;
  tipsTitle: string;
  tips: { n: string; text: string }[];
  nextStepsTitle: string;
  nextSteps: string[];
  runAgain: string;
  emails: LabEmail[];
}

// ─── English ──────────────────────────────────────────────────────────────────

const en: LabCopy = {
  eyebrow: 'Training · Inbox simulation',
  title: 'Phishing Defense Lab',
  description: 'A hands-on inbox simulation. Eight emails, one at a time — you decide which ones are genuine and which are phishing attempts. Get an explanation afterwards, and see the money impact of every decision.',
  terminalCmd: './start-briefing.sh',
  tip1: '[+] read each email like it landed in your inbox',
  tip2: '[+] hover any link to preview where it really goes',
  warn1: '[!] some are perfectly safe',
  warn2: '[!] every wrong call adds to your damage bill',
  pills: ['8 emails', '~5 minutes', 'Real-world examples', 'No links are live'],
  startButton: 'Start the simulation',

  statusLabel: 'phishing defense lab',
  caughtLabel: 'caught',
  missedLabel: 'missed',
  exposureLabel: 'exposure',
  mailChromeTitle: 'mail — secure-inbox',
  inboxLabel: 'Inbox',
  reviewed: (done, total) => `${done} / ${total} reviewed`,
  linkTip: 'Tip: hover a link to preview where it really points.',
  linkArrow: 'link',
  question: "What's your call on this email?",
  reportPhishing: 'Report as phishing',
  looksLegit: 'Looks legitimate',

  goodCall: 'Good call',
  trap: 'That one was a trap',
  falseAlarm: 'False alarm',
  wasPhishingVerdict: 'this was a phishing email.',
  wasLegitVerdict: 'this was a legitimate email.',
  redFlags: 'Red flags to spot',
  signsSafe: 'Signs it was safe',
  lossPhishing: (amount, type) =>
    `If you'd trusted this, it could have cost about ${amount} — ${type}.`,
  lossLegit: (amount) =>
    `No money lost, but flagging real mail wastes time and trains you to ignore genuine warnings (about ${amount} in lost productivity).`,
  nextEmail: 'Next email',
  seeResults: 'See your results',

  resultsEyebrow: 'Results',
  grades: {
    champion: { label: 'Security champion', color: '#5fbf76', short: 'Champion', blurb: 'Sharp eyes. You spotted nearly everything and kept the money in the bank.' },
    solid:    { label: 'Solid instincts',   color: '#8c7fe0', short: 'Solid',    blurb: "A good baseline. A few tells slipped past — review them below and you'll be hard to fool." },
    practice: { label: 'Needs practice',    color: '#fbbf24', short: 'Developing', blurb: 'You caught some, but enough got through to hurt. The habits below close most of the gap fast.' },
    risk:     { label: 'High risk',         color: '#f87171', short: 'At risk',  blurb: "Plenty got through. That's exactly why this practice matters — run through the tells and try again." },
  },
  spottedLabel: 'Spotted correctly',
  stoppedLabel: 'Threats stopped',
  damageLabel: 'Damage taken',
  breakdownTitle: 'Email by email',
  breakdownMeta: (cat, chose, is) =>
    `${cat} · you ${chose ? 'reported it' : 'trusted it'} · was ${is ? 'phishing' : 'legit'}`,
  threatStopped: 'threat stopped',
  keptCorrectly: 'kept, correctly',

  dateLocale: 'en-GB',

  tipsTitle: 'Five habits that stop most phishing',
  tips: [
    { n: '1', text: "Check the sender's full address, not just the display name — look-alike and free-email domains are the giveaway." },
    { n: '2', text: "Hover links before clicking. If the real destination doesn't match the brand, don't click." },
    { n: '3', text: "Treat urgency and secrecy as warning signs — real organisations rarely give you a countdown." },
    { n: '4', text: 'Never enter your password from an email link. Open the site yourself from a bookmark.' },
    { n: '5', text: "Verify any money or bank-detail request by phone, using a number you already have — never one from the email." },
  ],
  nextStepsTitle: 'Where to go next',
  nextSteps: [
    'Run this lab with your team — compare scores and talk through the misses together.',
    'Turn on multi-factor authentication everywhere, so a stolen password isn\'t enough.',
    'Agree a simple rule: any change to payment details gets a phone call to confirm.',
    'Set up an easy way for staff to report suspicious emails without fear of blame.',
  ],
  runAgain: 'Run it again',

  emails: [
    {
      category: 'Delivery', difficulty: 'Easy', time: '9:14 AM',
      fromName: 'DHL Express', fromAddr: 'noreply@dhl-delivery-support.com',
      subject: 'Your parcel is on hold — action required',
      preview: 'A customs fee of €2.99 is outstanding…',
      isPhishing: true, damage: 540, lossType: 'card details skimmed on a fake payment page',
      body: [
        { type: 'text', text: 'Dear Customer,' },
        { type: 'text', text: 'Your parcel (tracking #DH-48201-DE) is on hold at our depot. A customs fee of €2.99 is outstanding. Please confirm payment within 24 hours, otherwise your package will be returned to sender.' },
        { type: 'cta', text: 'Pay €2.99 and release my parcel', url: 'http://dhl-parcel-verify.com/pay' },
        { type: 'text', text: 'Thank you for choosing DHL Express.' },
      ],
      explain: "Real couriers don't chase tiny 'customs fees' by email with a countdown. The pay button points to dhl-parcel-verify.com — not dhl.com — where your card details would be captured.",
      clues: [
        'Sender is dhl-delivery-support.com, not the real dhl.com',
        'A 24-hour countdown built to pressure you',
        'Asks for a small payment to grab your card number',
        "Generic 'Dear Customer' — no name, no real tracking page",
      ],
    },
    {
      category: 'Banking', difficulty: 'Medium', time: 'Yesterday',
      fromName: 'Online Banking Security', fromAddr: 'alerts@secure-bankverify.com',
      subject: 'Unusual sign-in detected on your account',
      preview: 'Sign-in from a new device detected…',
      isPhishing: true, damage: 3200, lossType: 'your banking login stolen and the account drained',
      body: [
        { type: 'text', text: 'We detected a sign-in to your online banking from a new device in another country.' },
        { type: 'text', text: "If this wasn't you, please verify your identity now to avoid a temporary hold on your account." },
        { type: 'cta', text: 'Verify my identity', url: 'http://bankverify-login.com/secure' },
        { type: 'text', text: "If we don't hear from you within 24 hours, account access may be suspended." },
      ],
      explain: "Your bank already knows who you are — it won't make you 'verify your identity' through an email link or threaten to suspend you in 24 hours. The link leads to bankverify-login.com, a fake login built to steal your credentials.",
      clues: [
        "Domain secure-bankverify.com isn't your bank's real address",
        'Threatens to suspend access to rush you',
        "The 'verify' link leads to a fake login page",
        "Vague 'Online Banking' branding, not your actual bank",
      ],
    },
    {
      category: 'IT Support', difficulty: 'Medium', time: '7:42 AM',
      fromName: 'IT Helpdesk', fromAddr: 'it-support@mail-quota-service.net',
      subject: '[Action Required] Your mailbox is almost full',
      preview: 'Your mailbox has reached 98%…',
      isPhishing: true, damage: 12000, lossType: 'your password stolen, leading to a ransomware lockout',
      body: [
        { type: 'text', text: 'Your mailbox has reached 98% of its storage limit.' },
        { type: 'text', text: 'You will stop receiving new messages unless you re-validate your account within 12 hours.' },
        { type: 'cta', text: 'Re-validate my mailbox', url: 'http://webmail-quota-reset.net/login' },
        { type: 'text', text: '— IT Helpdesk' },
      ],
      explain: "IT will never ask you to 're-validate' a password through an outside web link. The 'mailbox full' story plus a 12-hour deadline is a classic trick to harvest your work login.",
      clues: [
        'From mail-quota-service.net — an outside domain, not your IT team',
        '12-hour deadline to create panic',
        "'Re-validate' really means: type your password into a fake page",
        'Storage warnings normally appear inside your mail app, not via a link',
      ],
    },
    {
      category: 'Invoice', difficulty: 'Hard', time: '11:03 AM',
      fromName: 'Martina Weber · Hartmann GmbH', fromAddr: 'm.weber@hartmann-gmbh.co',
      subject: 'RE: Invoice 2024-0837 — updated bank details',
      preview: "We've changed banks — new IBAN…",
      isPhishing: true, damage: 45000, lossType: "an expected invoice paid into a fraudster's account (wire fraud)",
      body: [
        { type: 'text', text: 'Hi,' },
        { type: 'text', text: "Hope you're well. Please note we've recently changed banks, so could you send payment for the outstanding invoice (€8,420) to our new account from now on?" },
        { type: 'text', text: 'New IBAN: DE21 5001 0517 0648 9870 21 — Hartmann GmbH' },
        { type: 'text', text: "Sorry for any inconvenience. Let me know once the transfer's done — thanks!" },
        { type: 'text', text: 'Best, Martina' },
      ],
      explain: "This is invoice (BEC) fraud — the costliest scam for small businesses. A real-looking reply asks you to redirect an expected payment to a 'new' account. The domain is hartmann-gmbh.co, not the supplier's real .de address.",
      clues: [
        'Look-alike domain: hartmann-gmbh.co instead of the real .de',
        "'We changed banks — pay this new account' is the #1 fraud signal",
        'No phone call to confirm — always verify bank changes by calling a known number',
        'Pressure to redirect a genuine, expected payment',
      ],
    },
    {
      category: 'Account', difficulty: 'Medium', time: '6:20 AM',
      fromName: 'Microsoft account team', fromAddr: 'account-security-noreply@accountprotection.microsoft.com',
      subject: 'New sign-in to your Microsoft account',
      preview: 'New sign-in on a Windows device…',
      isPhishing: false, damage: 150, lossType: '',
      body: [
        { type: 'text', text: 'We noticed a new sign-in to your Microsoft account on a Windows device.' },
        { type: 'text', text: "If this was you, you can safely ignore this email. If you don't recognise this activity, review it and secure your account." },
        { type: 'cta', text: 'Review recent activity', url: 'https://account.microsoft.com/activity' },
        { type: 'text', text: 'Thanks, The Microsoft account team' },
      ],
      explain: "This one is genuine. The link points to the real account.microsoft.com, there's no pressure and no request for your password, and it offers a calm 'if this was you, ignore it' path — exactly how real security notices read.",
      clues: [
        'Link goes to the real account.microsoft.com domain',
        'No urgency, no threats, no password request',
        "Offers a safe 'ignore if this was you' option",
        'Sent from a verified microsoft.com address',
      ],
    },
    {
      category: 'Internal', difficulty: 'Easy', time: 'Mon 08:30',
      fromName: 'People Team', fromAddr: 'hr@northwind-tools.com',
      subject: 'Q3 benefits enrolment opens Monday',
      preview: 'Open enrolment runs 1–15 July…',
      isPhishing: false, damage: 120, lossType: '',
      body: [
        { type: 'text', text: 'Hi team,' },
        { type: 'text', text: 'Open enrolment for health and pension benefits runs 1–15 July. Log in to the usual Workday portal (use your bookmark or the intranet link) to review your options.' },
        { type: 'text', text: 'No action needed today — just a heads up. Any questions, reach out to the People Team, happy to help.' },
        { type: 'text', text: '— People Team' },
      ],
      explain: 'This is a normal internal heads-up. It comes from your own company domain, asks for nothing today, and tells you to use your usual bookmarked portal rather than clicking a link — a healthy sign.',
      clues: [
        'From your own company domain (northwind-tools.com)',
        "No login link — it tells you to use your usual bookmark",
        "No urgency or threat; 'no action needed today'",
        'Plain, specific info (dates, team) you can verify',
      ],
    },
    {
      category: 'CEO request', difficulty: 'Medium', time: '10:48 AM',
      fromName: 'Tom Becker (CEO)', fromAddr: 'tom.becker.office@gmail.com',
      subject: 'Quick favour',
      preview: 'Are you at your desk? Quick favour…',
      isPhishing: true, damage: 2400, lossType: 'gift card codes sent straight to a scammer',
      body: [
        { type: 'text', text: 'Are you at your desk?' },
        { type: 'text', text: "I'm heading into back-to-back meetings and need a quick favour. I need to send Apple gift cards to a few clients today. Could you buy 4 × €100 cards and email me the codes? I'll reimburse you straight away." },
        { type: 'text', text: "Keep this between us for now — it's a surprise. Thanks!" },
        { type: 'text', text: 'Tom' },
      ],
      explain: "This is CEO fraud. A 'boss' messages from a personal address, invents urgency and secrecy, and asks for gift cards or codes — money that can't be traced. Real executives don't run errands this way.",
      clues: [
        "The CEO's 'address' is a personal gmail.com",
        "Urgency plus secrecy: 'keep it between us'",
        'Gift cards / codes by email = untraceable money',
        'Pushes you to act before you can check in person',
      ],
    },
    {
      category: 'Receipt', difficulty: 'Easy', time: '2:15 AM',
      fromName: 'Stripe', fromAddr: 'receipts@stripe.com',
      subject: 'Your receipt from Northwind Tools [#2941-0058]',
      preview: 'Receipt for your monthly subscription…',
      isPhishing: false, damage: 90, lossType: '',
      body: [
        { type: 'text', text: "Thanks for your payment. Here's your receipt for your monthly subscription to Northwind Tools." },
        { type: 'text', text: 'Amount paid: €49.00 · Visa ending 4242 · 19 June 2026' },
        { type: 'cta', text: 'View receipt in your dashboard', url: 'https://dashboard.stripe.com/receipts' },
        { type: 'text', text: 'Questions? Reply to this email or visit our help centre.' },
      ],
      explain: 'This is a real receipt for a payment you actually make. It links to the real dashboard.stripe.com, contains no urgency or login demand, and matches a subscription you recognise.',
      clues: [
        'From the real stripe.com domain',
        'Matches a payment you genuinely expect',
        'Links to the real dashboard.stripe.com',
        'No urgency, no password or card request',
      ],
    },
    ...extraLabEmails.en,
  ],
};

// ─── German ───────────────────────────────────────────────────────────────────

const de: LabCopy = {
  eyebrow: 'Training · Posteingangs-Simulation',
  title: 'Was ist eigentlich Phishing?',
  description: 'Phishing ist, wenn dich jemand mit einer gefälschten E-Mail täuschen will, meist als Bank, Chef oder bekannte Firma getarnt, um an deine Passwörter, Daten oder dein Geld zu kommen.',
  terminalCmd: './briefing-starten.sh',
  tip1: '[+] Lies jede E-Mail so, als wäre sie wirklich bei dir angekommen',
  tip2: '[+] Fahre über einen Link, um zu sehen, wohin er wirklich führt',
  warn1: '[!] Manche sind völlig harmlos',
  warn2: '[!] Jede falsche Entscheidung erhöht deinen Schaden',
  pills: ['8 E-Mails', '~5 Minuten', 'Realistische Beispiele', 'Keine Links sind aktiv'],
  startButton: 'Simulation starten',

  statusLabel: 'phishing defense lab',
  caughtLabel: 'erkannt',
  missedLabel: 'übersehen',
  exposureLabel: 'Schaden',
  mailChromeTitle: 'mail — sicherer-posteingang',
  inboxLabel: 'Posteingang',
  reviewed: (done, total) => `${done} / ${total} geprüft`,
  linkTip: 'Tipp: Fahre über einen Link, um zu sehen, wohin er wirklich führt.',
  linkArrow: 'Link',
  question: 'Was ist deine Einschätzung zu dieser E-Mail?',
  reportPhishing: 'Als Phishing melden',
  looksLegit: 'Sieht legitim aus',

  goodCall: 'Richtig erkannt',
  trap: 'Das war eine Falle',
  falseAlarm: 'Falscher Alarm',
  wasPhishingVerdict: 'das war eine Phishing-E-Mail.',
  wasLegitVerdict: 'das war eine legitime E-Mail.',
  redFlags: 'Warnsignale im Überblick',
  signsSafe: 'Zeichen, dass sie sicher war',
  lossPhishing: (amount, type) =>
    `Wenn du darauf hereingefallen wärst, hätte das etwa ${amount} kosten können – ${type}.`,
  lossLegit: (amount) =>
    `Kein Geldschaden, aber das Melden echter E-Mails kostet Zeit und trainiert dich, echte Warnungen zu ignorieren (etwa ${amount} in verlorener Produktivität).`,
  nextEmail: 'Nächste E-Mail',
  seeResults: 'Ergebnisse anzeigen',

  resultsEyebrow: 'Ergebnis',
  grades: {
    champion: { label: 'Sicherheits-Champion',  color: '#5fbf76', short: 'Champion',    blurb: 'Scharfe Augen. Du hast fast alles erkannt und das Geld in der Bank behalten.' },
    solid:    { label: 'Solide Instinkte',       color: '#8c7fe0', short: 'Solide',      blurb: 'Eine gute Basis. Ein paar Signale sind durch – schau sie dir unten an, dann wirst du schwerer zu täuschen.' },
    practice: { label: 'Mehr Übung nötig',       color: '#fbbf24', short: 'In Übung',   blurb: 'Du hast einiges erkannt, aber genug ist durchgekommen. Die Gewohnheiten unten schließen die meisten Lücken schnell.' },
    risk:     { label: 'Hohes Risiko',           color: '#f87171', short: 'Gefährdet',  blurb: 'Viel ist durchgekommen. Genau deshalb ist diese Übung wichtig – geh die Warnsignale durch und versuche es nochmal.' },
  },
  spottedLabel: 'Richtig erkannt',
  stoppedLabel: 'Bedrohungen gestoppt',
  damageLabel: 'Entstandener Schaden',
  breakdownTitle: 'E-Mail für E-Mail',
  breakdownMeta: (cat, chose, is) =>
    `${cat} · ${chose ? 'gemeldet' : 'akzeptiert'} · war ${is ? 'Phishing' : 'legitim'}`,
  threatStopped: 'Bedrohung gestoppt',
  keptCorrectly: 'korrekt behalten',

  dateLocale: 'de-DE',

  tipsTitle: 'Fünf Gewohnheiten, die die meisten Phishing-Angriffe stoppen',
  tips: [
    { n: '1', text: "Prüfe die vollständige Absenderadresse, nicht nur den Anzeigenamen – ähnlich aussehende Domains und Gratismail-Adressen sind das Hauptwarnsignal." },
    { n: '2', text: "Fahre vor dem Klicken über Links. Wenn das echte Ziel nicht zur Marke passt, nicht klicken." },
    { n: '3', text: "Behandle Dringlichkeit und Geheimhaltung als Warnsignale – echte Organisationen geben dir selten einen Countdown." },
    { n: '4', text: "Gib dein Passwort nie über einen E-Mail-Link ein. Öffne die Website selbst über ein Lesezeichen." },
    { n: '5', text: "Überprüfe Geld- oder Bankänderungsanfragen telefonisch – immer mit einer Nummer, die du bereits kennst, nicht mit einer aus der E-Mail." },
  ],
  nextStepsTitle: 'Die nächsten Schritte',
  nextSteps: [
    'Mach dieses Lab mit deinem Team – vergleiche Ergebnisse und besprecht die Fehler gemeinsam.',
    'Aktiviere Zwei-Faktor-Authentifizierung überall, damit ein gestohlenes Passwort nicht reicht.',
    'Vereinbare eine einfache Regel: Jede Änderung von Bankdaten wird telefonisch bestätigt.',
    'Schafft einen einfachen Weg, verdächtige E-Mails zu melden – ohne Angst vor Konsequenzen.',
  ],
  runAgain: 'Nochmal starten',

  emails: [
    {
      category: 'Zustellung', difficulty: 'Einfach', time: '9:14 Uhr',
      fromName: 'DHL Express', fromAddr: 'noreply@dhl-delivery-support.com',
      subject: 'Ihr Paket liegt fest – bitte handeln Sie',
      preview: 'Zollgebühr von 2,99 € noch offen…',
      isPhishing: true, damage: 540, lossType: 'Kartendaten auf einer gefälschten Zahlungsseite gestohlen',
      body: [
        { type: 'text', text: 'Sehr geehrte Damen und Herren,' },
        { type: 'text', text: 'Ihr Paket (Sendungsnummer #DH-48201-DE) liegt in unserem Depot fest. Eine Zollgebühr von 2,99 € ist noch offen. Bitte bestätigen Sie die Zahlung innerhalb von 24 Stunden, andernfalls wird Ihr Paket an den Absender zurückgeschickt.' },
        { type: 'cta', text: '2,99 € zahlen und Paket freigeben', url: 'http://dhl-parcel-verify.com/pay' },
        { type: 'text', text: 'Vielen Dank, dass Sie DHL Express nutzen.' },
      ],
      explain: "Echte Paketdienstleister mahnen keine kleinen 'Zollgebühren' per E-Mail mit Countdown an. Der Zahlen-Button führt zu dhl-parcel-verify.com – nicht zu dhl.com – wo deine Kartendaten abgegriffen würden.",
      clues: [
        'Absender ist dhl-delivery-support.com, nicht die echte dhl.com',
        'Ein 24-Stunden-Countdown, der dich unter Druck setzen soll',
        'Kleine Zahlung soll deine Kartennummer abgreifen',
        "'Sehr geehrte Damen und Herren' – kein Name, keine echte Paketnachverfolgung",
      ],
    },
    {
      category: 'Banking', difficulty: 'Mittel', time: 'Gestern',
      fromName: 'Online-Banking Sicherheit', fromAddr: 'alerts@secure-bankverify.com',
      subject: 'Unbekannte Anmeldung auf Ihrem Konto erkannt',
      preview: 'Anmeldung von neuem Gerät erkannt…',
      isPhishing: true, damage: 3200, lossType: 'Banking-Zugangsdaten gestohlen und Konto geleert',
      body: [
        { type: 'text', text: 'Wir haben eine Anmeldung bei Ihrem Online-Banking von einem neuen Gerät in einem anderen Land erkannt.' },
        { type: 'text', text: 'Falls Sie das nicht waren, bestätigen Sie jetzt Ihre Identität, um eine vorübergehende Sperrung Ihres Kontos zu vermeiden.' },
        { type: 'cta', text: 'Identität bestätigen', url: 'http://bankverify-login.com/secure' },
        { type: 'text', text: 'Falls wir innerhalb von 24 Stunden keine Antwort erhalten, kann der Kontozugriff gesperrt werden.' },
      ],
      explain: "Deine Bank weiß bereits, wer du bist – sie wird dich nicht auffordern, deine Identität über einen E-Mail-Link zu 'bestätigen', und auch nicht drohen, dein Konto in 24 Stunden zu sperren. Der Link führt zu bankverify-login.com, einer gefälschten Anmeldeseite.",
      clues: [
        'Domain secure-bankverify.com ist nicht die echte Adresse deiner Bank',
        'Drohung der Kontosperrung, um dich zu hetzen',
        "Der 'Bestätigungs'-Link führt zu einer gefälschten Anmeldeseite",
        "Vages 'Online-Banking'-Branding, nicht deine tatsächliche Bank",
      ],
    },
    {
      category: 'IT-Support', difficulty: 'Mittel', time: '7:42 Uhr',
      fromName: 'IT-Helpdesk', fromAddr: 'it-support@mail-quota-service.net',
      subject: '[Handlung erforderlich] Ihr Postfach ist fast voll',
      preview: 'Ihr Postfach hat 98 % erreicht…',
      isPhishing: true, damage: 12000, lossType: 'Passwort gestohlen, was zu einer Ransomware-Sperrung führt',
      body: [
        { type: 'text', text: 'Ihr Postfach hat 98 % seines Speicherlimits erreicht.' },
        { type: 'text', text: 'Sie werden keine neuen Nachrichten mehr empfangen, wenn Sie Ihr Konto nicht innerhalb von 12 Stunden re-validieren.' },
        { type: 'cta', text: 'Postfach re-validieren', url: 'http://webmail-quota-reset.net/login' },
        { type: 'text', text: '— IT-Helpdesk' },
      ],
      explain: "Die IT fordert dich nie auf, ein Passwort über einen externen Weblink zu 're-validieren'. Die Geschichte vom vollen Postfach plus 12-Stunden-Frist ist ein klassischer Trick, um deine Arbeitszugangsdaten zu stehlen.",
      clues: [
        'Von mail-quota-service.net – einer externen Domain, nicht deiner IT-Abteilung',
        '12-Stunden-Frist soll Panik erzeugen',
        "'Re-validieren' bedeutet: Passwort in eine gefälschte Seite eingeben",
        'Speicherwarnungen erscheinen normalerweise in deiner Mail-App, nicht per Link',
      ],
    },
    {
      category: 'Rechnung', difficulty: 'Schwer', time: '11:03 Uhr',
      fromName: 'Martina Weber · Hartmann GmbH', fromAddr: 'm.weber@hartmann-gmbh.co',
      subject: 'RE: Rechnung 2024-0837 – neue Bankverbindung',
      preview: 'Wir haben die Bank gewechselt – neue IBAN…',
      isPhishing: true, damage: 45000, lossType: 'eine erwartete Rechnung auf das Betrügerkonto überwiesen (Überweisungsbetrug)',
      body: [
        { type: 'text', text: 'Hallo,' },
        { type: 'text', text: 'Ich hoffe, es geht Ihnen gut. Wir haben kürzlich die Bank gewechselt. Könnten Sie bitte die ausstehende Rechnung (8.420 €) auf unser neues Konto überweisen?' },
        { type: 'text', text: 'Neue IBAN: DE21 5001 0517 0648 9870 21 – Hartmann GmbH' },
        { type: 'text', text: 'Entschuldigung für die Umstände. Bitte geben Sie kurz Bescheid, wenn die Überweisung erfolgt ist – vielen Dank!' },
        { type: 'text', text: 'Beste Grüße, Martina' },
      ],
      explain: "Das ist Rechnungsbetrug (BEC) – die teuerste Masche für kleine Unternehmen. Eine echt aussehende Antwort bittet darum, eine erwartete Zahlung auf ein 'neues' Konto umzuleiten. Die Domain ist hartmann-gmbh.co, nicht die echte .de-Adresse des Lieferanten.",
      clues: [
        'Look-alike-Domain: hartmann-gmbh.co statt der echten .de',
        "'Wir haben die Bank gewechselt – zahlen Sie auf dieses neue Konto' ist das stärkste Warnsignal",
        'Kein Anruf zur Bestätigung – Bankänderungen immer telefonisch verifizieren',
        'Druck, eine genuine, erwartete Zahlung umzuleiten',
      ],
    },
    {
      category: 'Konto', difficulty: 'Mittel', time: '6:20 Uhr',
      fromName: 'Microsoft-Kontoteam', fromAddr: 'account-security-noreply@accountprotection.microsoft.com',
      subject: 'Neue Anmeldung bei Ihrem Microsoft-Konto',
      preview: 'Neue Anmeldung auf einem Windows-Gerät…',
      isPhishing: false, damage: 150, lossType: '',
      body: [
        { type: 'text', text: 'Wir haben eine neue Anmeldung bei Ihrem Microsoft-Konto auf einem Windows-Gerät festgestellt.' },
        { type: 'text', text: 'Falls Sie das waren, können Sie diese E-Mail ignorieren. Falls Sie diese Aktivität nicht kennen, überprüfen Sie sie und sichern Sie Ihr Konto.' },
        { type: 'cta', text: 'Letzte Aktivität prüfen', url: 'https://account.microsoft.com/activity' },
        { type: 'text', text: 'Vielen Dank, Ihr Microsoft-Kontoteam' },
      ],
      explain: "Diese E-Mail ist echt. Der Link verweist auf die echte Domain account.microsoft.com, es gibt keinen Druck und keine Passwortanfrage. Sie bietet einen ruhigen 'Falls du das warst, ignoriere die Mail'-Weg – genau wie echte Sicherheitsmeldungen.",
      clues: [
        'Link führt zur echten Domain account.microsoft.com',
        'Keine Dringlichkeit, keine Bedrohungen, keine Passwortanfrage',
        "Bietet sichere 'Ignorieren, falls du das warst'-Option",
        'Gesendet von einer verifizierten microsoft.com-Adresse',
      ],
    },
    {
      category: 'Intern', difficulty: 'Einfach', time: 'Mo 08:30',
      fromName: 'People Team', fromAddr: 'hr@northwind-tools.com',
      subject: 'Anmeldezeitraum für Q3-Benefits startet Montag',
      preview: 'Anmeldung läuft vom 1.–15. Juli…',
      isPhishing: false, damage: 120, lossType: '',
      body: [
        { type: 'text', text: 'Hallo Team,' },
        { type: 'text', text: 'Der Anmeldezeitraum für Gesundheits- und Rentenleistungen läuft vom 1. bis 15. Juli. Bitte logge dich im gewohnten Workday-Portal ein (Lesezeichen oder Intranet-Link nutzen), um deine Optionen zu prüfen.' },
        { type: 'text', text: 'Heute ist noch nichts zu tun – nur zur Vorabinformation. Bei Fragen wende dich gern an das People Team.' },
        { type: 'text', text: '— People Team' },
      ],
      explain: "Das ist eine normale interne Vorankündigung. Sie kommt von der eigenen Unternehmens-Domain, verlangt heute nichts und verweist darauf, das gewohnte Lesezeichen zu nutzen statt auf einen Link zu klicken – ein gutes Zeichen.",
      clues: [
        'Von der eigenen Unternehmens-Domain (northwind-tools.com)',
        'Kein Login-Link – Hinweis auf das gewohnte Lesezeichen',
        "Keine Dringlichkeit; 'heute ist noch nichts zu tun'",
        'Klare, spezifische Angaben (Daten, Team), die man überprüfen kann',
      ],
    },
    {
      category: 'GF-Anfrage', difficulty: 'Mittel', time: '10:48 Uhr',
      fromName: 'Tom Becker (Geschäftsführer)', fromAddr: 'tom.becker.office@gmail.com',
      subject: 'Kurze Bitte',
      preview: 'Bist du gerade am Schreibtisch? Kurze Bitte…',
      isPhishing: true, damage: 2400, lossType: 'Gutschein-Codes direkt an einen Betrüger geschickt',
      body: [
        { type: 'text', text: 'Bist du gerade am Schreibtisch?' },
        { type: 'text', text: 'Ich sitze gleich in aufeinanderfolgenden Meetings und brauche einen kleinen Gefallen. Ich muss heute Apple-Gutscheinkarten an ein paar Kunden verschicken. Könntest du 4 × 100-€-Karten kaufen und mir die Codes per E-Mail schicken? Ich erstatte dir den Betrag sofort.' },
        { type: 'text', text: "Behalte das bitte vorerst für dich – es ist eine Überraschung. Danke!" },
        { type: 'text', text: 'Tom' },
      ],
      explain: "Das ist CEO-Betrug. Ein 'Vorgesetzter' schreibt von einer privaten Adresse, erfindet Dringlichkeit und Geheimhaltung und fordert Gutscheinkarten oder Codes – Geld, das nicht zurückverfolgt werden kann. Echte Führungskräfte erledigen Besorgungen nicht auf diese Weise.",
      clues: [
        "Die 'Adresse' des Geschäftsführers ist eine private gmail.com",
        "Dringlichkeit plus Geheimhaltung: 'behalte es für dich'",
        'Gutscheinkarten per E-Mail = nicht nachverfolgbares Geld',
        'Druck zu handeln, bevor du persönlich nachfragen kannst',
      ],
    },
    {
      category: 'Quittung', difficulty: 'Einfach', time: '2:15 Uhr',
      fromName: 'Stripe', fromAddr: 'receipts@stripe.com',
      subject: 'Deine Quittung von Northwind Tools [#2941-0058]',
      preview: 'Quittung für dein Monatsabonnement…',
      isPhishing: false, damage: 90, lossType: '',
      body: [
        { type: 'text', text: 'Vielen Dank für deine Zahlung. Hier ist deine Quittung für dein Monatsabonnement bei Northwind Tools.' },
        { type: 'text', text: 'Gezahlter Betrag: 49,00 € · Visa endend auf 4242 · 19. Juni 2026' },
        { type: 'cta', text: 'Quittung im Dashboard ansehen', url: 'https://dashboard.stripe.com/receipts' },
        { type: 'text', text: 'Fragen? Antworte auf diese E-Mail oder besuche unser Hilfecenter.' },
      ],
      explain: 'Das ist eine echte Quittung für eine Zahlung, die du tatsächlich leistest. Der Link verweist auf die echte Domain dashboard.stripe.com, enthält keine Dringlichkeit oder Login-Anforderung und passt zu einem Abonnement, das du kennst.',
      clues: [
        'Von der echten stripe.com-Domain',
        'Entspricht einer Zahlung, die du tatsächlich erwartest',
        'Link führt zur echten Domain dashboard.stripe.com',
        'Keine Dringlichkeit, keine Passwort- oder Kartenanfrage',
      ],
    },
    ...extraLabEmails.de,
  ],
};

// ─── Export ───────────────────────────────────────────────────────────────────

export const labCopy: Record<string, LabCopy> = { en, de };
