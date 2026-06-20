'use client';

import { useState, type CSSProperties } from 'react';
import { useLocale } from 'next-intl';
import { labCopy, type LabCopy, type LabEmail } from './copy';

// ─── Design tokens ────────────────────────────────────────────────────────────

const SURFACE = '#111113';
const SURFACE_CHROME = '#17171c';
const SURFACE_INSET = '#151519';
const BORDER = 'rgb(255 255 255 / 0.08)';
const BORDER_SOFT = 'rgb(255 255 255 / 0.06)';
const BORDER_HOVER = 'rgb(255 255 255 / 0.16)';
const ACCENT = '#5f62b8';
const ACCENT_LIGHT = '#8c7fe0';
const ACCENT_WASH = 'rgb(95 98 184 / 0.06)';
const GREEN = '#5fbf76';
const TP = '#f4f4f5';
const TS = '#a1a1aa';
const TM = '#71717a';
const TF = '#52525b';
const DANGER = '#f87171';
const WARNING = '#fbbf24';
const SUCCESS = '#5fbf76';
const SHADOW_FLOAT = '0 24px 80px rgb(0 0 0 / 0.5)';
const MONO = '"IBM Plex Mono","SFMono-Regular",Consolas,"Liberation Mono",Menlo,monospace';
const SANS = '"Inter",ui-sans-serif,system-ui,-apple-system,sans-serif';

// ─── Types ────────────────────────────────────────────────────────────────────

type Screen = 'intro' | 'play' | 'done';

interface Result {
  correct: boolean;
  chosePhishing: boolean;
  isPhishing: boolean;
  damage: number;
  category: string;
  subject: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function initials(name: string): string {
  const cleaned = name.replace(/[·(].*/, '').trim();
  const words = cleaned.split(/\s+/).filter(Boolean);
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

function sampleEmails(emails: LabEmail[], count: number): LabEmail[] {
  return [...emails]
    .sort(() => Math.random() - 0.5)
    .slice(0, Math.min(count, emails.length));
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function Btn({
  variant = 'primary',
  size = 'lg',
  onClick,
  children,
  style,
}: {
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  children: React.ReactNode;
  style?: CSSProperties;
}) {
  const [hover, setHover] = useState(false);
  const sz: CSSProperties =
    size === 'sm' ? { padding: '0.5rem 0.875rem', fontSize: '0.8125rem' } :
    size === 'md' ? { padding: '0.625rem 1.25rem', fontSize: '0.875rem' } :
                   { padding: '0.8125rem 1.5rem', fontSize: '0.9375rem' };

  const base: CSSProperties = {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
    fontFamily: SANS, fontWeight: 600, lineHeight: 1, borderRadius: '8px',
    cursor: 'pointer', border: '1px solid transparent', textDecoration: 'none',
    whiteSpace: 'nowrap', transition: 'background 150ms ease, border-color 150ms ease, box-shadow 150ms ease, color 150ms ease',
    ...sz,
  };

  const varStyle: CSSProperties = variant === 'primary'
    ? { background: hover ? ACCENT_LIGHT : ACCENT, color: '#fff',
        boxShadow: hover ? '0 0 32px rgb(140 127 224 / 0.34)' : '0 0 24px rgb(95 98 184 / 0.24)' }
    : { background: hover ? 'rgb(255 255 255 / 0.07)' : 'rgb(255 255 255 / 0.04)', color: TP,
        borderColor: hover ? BORDER_HOVER : 'rgb(255 255 255 / 0.12)' };

  return (
    <button type="button" onClick={onClick}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ ...base, ...varStyle, ...style }}>
      {children}
    </button>
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', padding: '6px 11px', borderRadius: '999px',
      background: 'rgb(255 255 255 / 0.04)', border: `1px solid ${BORDER}`,
      fontFamily: MONO, fontSize: '0.72rem', color: TS }}>
      {children}
    </span>
  );
}

// ─── Intro screen ─────────────────────────────────────────────────────────────

function IntroScreen({ onStart, c }: {
  onStart: () => void;
  c: LabCopy;
}) {

  return (
    <div style={{ minHeight: 'calc(100vh - 4rem)', display: 'flex', alignItems: 'center',
      justifyContent: 'center', padding: '7rem 24px 56px', background: '#0a0a0a' }}>
      <div style={{ width: '100%', maxWidth: '660px', animation: 'niwoUp 0.5s ease both' }}>

        <div style={{ fontFamily: MONO, fontSize: '0.7rem', letterSpacing: '0.22em',
          textTransform: 'uppercase', color: ACCENT_LIGHT, marginBottom: '20px' }}>
          {c.eyebrow}
        </div>

        <h1 style={{ fontFamily: MONO, fontWeight: 700, fontSize: 'clamp(2rem, 5vw, 2.7rem)',
          lineHeight: 1.1, letterSpacing: '-0.02em', margin: '0 0 18px', color: TP }}>
          {c.title}
          <span style={{ color: ACCENT_LIGHT, animation: 'niwoBlink 1.1s steps(1) infinite' }}>_</span>
        </h1>

        <p style={{ fontSize: '1.05rem', lineHeight: 1.7, color: TS, margin: '0 0 28px', maxWidth: '56ch' }}>
          {c.description}
        </p>

        <div style={{ border: `1px solid ${BORDER}`, borderRadius: '1.05rem', background: SURFACE,
          padding: '18px 20px', fontFamily: MONO, fontSize: '0.84rem', lineHeight: 1.85,
          marginBottom: '28px', boxShadow: '0 20px 56px rgb(0 0 0 / 0.42)' }}>
          <div>
            <span style={{ color: GREEN }}>&#9484;&#9472;&#9472;(</span>
            <span style={{ color: ACCENT_LIGHT }}>root@niwo</span>
            <span style={{ color: GREEN }}>)-[</span>
            <span style={{ color: TP }}>~</span>
            <span style={{ color: GREEN }}>]</span>
          </div>
          <div>
            <span style={{ color: GREEN }}>&#9492;&#9472;</span>
            <span style={{ color: ACCENT_LIGHT, marginLeft: '0.5rem' }}>$</span>
            <span style={{ color: TP, marginLeft: '0.5rem' }}>{c.terminalCmd}</span>
          </div>
          <div style={{ color: TS, marginTop: '6px' }}>
            <span style={{ color: ACCENT_LIGHT }}>[+]</span> {c.tip1.replace('[+] ', '')}
          </div>
          <div style={{ color: TS }}>
            <span style={{ color: ACCENT_LIGHT }}>[+]</span> {c.tip2.replace('[+] ', '')}
          </div>
          <div style={{ color: TS }}>
            <span style={{ color: WARNING }}>[!]</span> {c.warn1.replace('[!] ', '')}
          </div>
          <div style={{ color: TS }}>
            <span style={{ color: WARNING }}>[!]</span> {c.warn2.replace('[!] ', '')}
          </div>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '30px' }}>
          {c.pills.map((p, i) => <Pill key={i}>{p}</Pill>)}
        </div>

        <Btn variant="primary" size="lg" onClick={onStart}>
          {c.startButton} &rarr;
        </Btn>
      </div>
    </div>
  );
}

// ─── Play screen ──────────────────────────────────────────────────────────────


function ScenarioBody({
  email,
  setHoverUrl,
}: {
  email: LabEmail;
  setHoverUrl: (url: string | null) => void;
}) {
  const renderAction = (block: LabEmail['body'][number], key: string | number) => (
    <a key={key} href="#" onClick={e => e.preventDefault()}
      onMouseEnter={() => setHoverUrl(block.url ?? null)}
      onMouseLeave={() => setHoverUrl(null)}
      style={{ display: 'inline-block', margin: '4px 0 18px', padding: '11px 20px',
        borderRadius: '6px', background: ACCENT, color: '#fff', fontFamily: MONO,
        fontSize: '0.85rem', fontWeight: 600, textDecoration: 'none', cursor: 'pointer' }}>
      {block.text}
    </a>
  );

  const cta = email.body.find(block => block.type === 'cta');
  const textBlocks = email.body.filter(block => block.type === 'text');

  if (email.channel === 'sms') {
    return (
      <div style={{ padding: '22px 30px 8px', flex: 1 }}>
        <div style={{ maxWidth: '390px', border: `1px solid ${BORDER}`, borderRadius: '18px',
          background: '#0f0f12', padding: '16px', boxShadow: 'inset 0 1px 0 rgb(255 255 255 / 0.04)' }}>
          <div style={{ fontFamily: MONO, fontSize: '0.72rem', color: TM, marginBottom: '12px',
            textAlign: 'center' }}>
            {email.fromAddr}
          </div>
          {textBlocks.map((block, bi) => (
            <div key={bi} style={{ margin: '0 0 10px auto', maxWidth: '88%', padding: '10px 13px',
              borderRadius: '16px 16px 4px 16px', background: 'rgb(95 98 184 / 0.18)',
              border: '1px solid rgb(95 98 184 / 0.32)', color: TS, fontSize: '0.93rem',
              lineHeight: 1.55 }}>
              {block.text}
            </div>
          ))}
          {cta ? renderAction(cta, 'sms-cta') : null}
        </div>
      </div>
    );
  }

  if (email.channel === 'qr') {
    return (
      <div style={{ padding: '22px 30px 8px', flex: 1 }}>
        {textBlocks.map((block, bi) => (
          <p key={bi} style={{ margin: '0 0 14px', fontSize: '0.95rem', lineHeight: 1.75, color: TS }}>
            {block.text}
          </p>
        ))}
        <div style={{ display: 'flex', alignItems: 'center', gap: '18px', flexWrap: 'wrap',
          border: `1px solid ${BORDER}`, background: '#f4f4f5', color: '#111113',
          borderRadius: '10px', padding: '18px', maxWidth: '520px', margin: '8px 0 18px' }}>
          <div style={{ width: '132px', height: '132px', display: 'grid',
            gridTemplateColumns: 'repeat(9, 1fr)', gap: '4px', background: '#fff',
            border: '8px solid #fff' }}>
            {Array.from({ length: 81 }).map((_, i) => {
              const x = i % 9;
              const y = Math.floor(i / 9);
              const finder =
                (x < 3 && y < 3) ||
                (x > 5 && y < 3) ||
                (x < 3 && y > 5);
              const filled = finder || ((x * 3 + y * 5 + i) % 4 === 0);
              return <span key={i} style={{ background: filled ? '#111113' : '#fff' }} />;
            })}
          </div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ fontFamily: MONO, fontSize: '0.72rem', letterSpacing: '0.12em',
              textTransform: 'uppercase', color: '#5f62b8', marginBottom: '8px' }}>
              QR destination preview
            </div>
            {cta ? renderAction(cta, 'qr-cta') : null}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '22px 30px 8px', flex: 1 }}>
      {email.body.map((block, bi) => {
        if (block.type === 'text') {
          return (
            <p key={bi} style={{ margin: '0 0 14px', fontSize: '0.95rem', lineHeight: 1.75, color: TS }}>
              {block.text}
            </p>
          );
        }
        if (block.type === 'cta') return renderAction(block, bi);
        return (
          <a key={bi} href="#" onClick={e => e.preventDefault()}
            onMouseEnter={() => setHoverUrl(block.url ?? null)}
            onMouseLeave={() => setHoverUrl(null)}
            style={{ color: ACCENT_LIGHT, textDecoration: 'underline', cursor: 'pointer' }}>
            {block.text}
          </a>
        );
      })}
    </div>
  );
}

function PlayScreen({
  index, results, emails, onAnswer, onNext, c, fmt,
}: {
  index: number;
  results: Result[];
  emails: LabEmail[];
  onAnswer: (chosePhishing: boolean) => void;
  onNext: () => void;
  c: LabCopy;
  fmt: (n: number) => string;
}) {
  const [hoverUrl, setHoverUrl] = useState<string | null>(null);
  const total = emails.length;
  const email = emails[index];
  const answered = results.length > index;
  const result = answered ? results[index] : null;

  const liveCaught = results.filter(r => r.correct && r.isPhishing).length;
  const liveMissed = results.filter(r => !r.correct && r.isPhishing).length;
  const liveLost = results.filter(r => !r.correct).reduce((s, r) => s + r.damage, 0);

  const isSafeUrl = (url: string) => {
    if (!url.startsWith('https://')) return false;
    const trustedHosts = [
      'microsoft.com',
      'stripe.com',
      'github.com',
      'google.com',
      'slack.com',
      'zoom.us',
      'docusign.com',
      'docusign.net',
      'dropbox.com',
      'myworkday.com',
      'northwind-tools.com',
      'workday.com',
      'atlassian.com',
    ];
    try {
      const { hostname } = new URL(url);
      return trustedHosts.some(host => hostname === host || hostname.endsWith(`.${host}`));
    } catch {
      return false;
    }
  };

  const nextLabel = index + 1 >= total ? c.seeResults : c.nextEmail;

  return (
    <div style={{ minHeight: 'calc(100vh - 4rem)', padding: '7rem 24px 56px',
      display: 'flex', flexDirection: 'column', alignItems: 'center', background: '#0a0a0a' }}>

      {/* status row */}
      <div style={{ width: '100%', maxWidth: '1040px', display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', gap: '16px', marginBottom: '18px', flexWrap: 'wrap' }}>
        <div style={{ fontFamily: MONO, fontSize: '0.78rem', letterSpacing: '0.06em', color: TM }}>
          <span style={{ color: ACCENT_LIGHT }}>niwo</span> {c.statusLabel}
        </div>
        <div style={{ display: 'flex', gap: '18px', fontFamily: MONO, fontSize: '0.78rem' }}>
          <span style={{ color: TM }}>{c.caughtLabel} <span style={{ color: SUCCESS }}>{liveCaught}</span></span>
          <span style={{ color: TM }}>{c.missedLabel} <span style={{ color: DANGER }}>{liveMissed}</span></span>
          <span style={{ color: TM }}>{c.exposureLabel} <span style={{ color: DANGER }}>{fmt(liveLost)}</span></span>
        </div>
      </div>

      {/* mail window */}
      <div style={{ width: '100%', maxWidth: '1040px', border: `1px solid ${BORDER}`,
        borderRadius: '14px', background: SURFACE, boxShadow: SHADOW_FLOAT, overflow: 'hidden' }}>

        {/* chrome bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '11px 16px',
          background: SURFACE_CHROME, borderBottom: `1px solid ${BORDER}`,
          boxShadow: 'inset 0 1px 0 rgb(255 255 255 / 0.04)' }}>
          <span style={{ color: TF, fontFamily: MONO, fontSize: '0.9rem' }}>&#8962;</span>
          <span style={{ flex: 1, textAlign: 'center', fontFamily: MONO, fontSize: '0.78rem', color: TM }}>
            {c.mailChromeTitle}
          </span>
          <span style={{ width: '11px', height: '11px', borderRadius: '50%',
            background: '#22222a', border: `1px solid ${BORDER_HOVER}` }} />
          <span style={{ width: '11px', height: '11px', borderRadius: '50%',
            background: '#22222a', border: `1px solid ${BORDER_HOVER}` }} />
          <span style={{ width: '11px', height: '11px', borderRadius: '50%',
            background: 'rgb(95 98 184 / 0.4)', border: `1px solid ${ACCENT}` }} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '262px 1fr' }}>

          {/* inbox sidebar */}
          <div style={{ borderRight: `1px solid ${BORDER}`, background: SURFACE_INSET, minHeight: '560px' }}>
            <div style={{ padding: '16px 18px 12px', borderBottom: `1px solid ${BORDER_SOFT}` }}>
              <div style={{ fontFamily: MONO, fontSize: '0.74rem', letterSpacing: '0.16em',
                textTransform: 'uppercase', color: TS }}>{c.inboxLabel}</div>
              <div style={{ fontFamily: MONO, fontSize: '0.72rem', color: TF, marginTop: '4px' }}>
                {c.reviewed(results.length, total)}
              </div>
            </div>
            {emails.map((e, i) => {
              const done = i < results.length;
              const cur = i === index;
              const ok = done && results[i].correct;
              const glyph = done ? (ok ? '✓' : '✗') : cur ? '▸' : '·';
              const glyphColor = done ? (ok ? SUCCESS : DANGER) : cur ? ACCENT_LIGHT : TF;
              return (
                <div key={i} style={{
                  padding: '11px 16px 12px',
                  borderBottom: `1px solid ${BORDER_SOFT}`,
                  borderLeft: cur ? `2px solid ${ACCENT}` : '2px solid transparent',
                  background: cur ? ACCENT_WASH : 'transparent',
                  opacity: !done && !cur ? 0.5 : 1,
                }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                    <span style={{ color: glyphColor, fontFamily: MONO, fontSize: '0.8rem',
                      lineHeight: 1.3, flex: 'none', width: '12px', textAlign: 'center' }}>
                      {glyph}
                    </span>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div style={{ fontFamily: MONO, fontSize: '0.76rem', color: TP,
                        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {e.fromName}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: TS, whiteSpace: 'nowrap',
                        overflow: 'hidden', textOverflow: 'ellipsis', marginTop: '1px' }}>
                        {e.subject}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: TF, whiteSpace: 'nowrap',
                        overflow: 'hidden', textOverflow: 'ellipsis', marginTop: '2px' }}>
                        {e.preview}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* reading pane */}
          <div style={{ display: 'flex', flexDirection: 'column', minHeight: '560px' }}>

            {/* header */}
            <div style={{ padding: '26px 30px 0' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px' }}>
                <h2 style={{ fontFamily: MONO, fontSize: '1.18rem', fontWeight: 600, lineHeight: 1.4,
                  margin: 0, color: TP }}>
                  {email.subject}
                </h2>
                <div style={{ display: 'flex', gap: '6px', flex: 'none' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', padding: '4px 9px',
                    borderRadius: '6px', background: ACCENT_WASH, border: '1px solid rgb(95 98 184 / 0.3)',
                    fontFamily: MONO, fontSize: '0.66rem', letterSpacing: '0.06em',
                    color: ACCENT_LIGHT, whiteSpace: 'nowrap' }}>
                    {email.category}
                  </span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', padding: '4px 9px',
                    borderRadius: '6px', background: 'rgb(255 255 255 / 0.04)',
                    border: `1px solid ${BORDER}`, fontFamily: MONO, fontSize: '0.66rem',
                    letterSpacing: '0.06em', color: TM, whiteSpace: 'nowrap' }}>
                    {email.difficulty}
                  </span>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '18px 0 0',
                paddingBottom: '20px', borderBottom: `1px solid ${BORDER_SOFT}` }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%',
                  background: '#18181b', border: `1px solid ${BORDER_HOVER}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: MONO, fontSize: '0.8rem', color: ACCENT_LIGHT, flex: 'none' }}>
                  {initials(email.fromName)}
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: '0.9rem', color: TP, fontWeight: 500 }}>{email.fromName}</div>
                  <div style={{ fontFamily: MONO, fontSize: '0.76rem', color: TM,
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    &lt;{email.fromAddr}&gt;
                  </div>
                </div>
                <div style={{ marginLeft: 'auto', fontFamily: MONO, fontSize: '0.74rem',
                  color: TF, flex: 'none' }}>
                  {email.time}
                </div>
              </div>
            </div>

            {/* body */}
            <ScenarioBody email={email} setHoverUrl={setHoverUrl} />

            {/* link preview bar */}
            <div style={{ padding: '9px 30px', borderTop: `1px solid ${BORDER_SOFT}`,
              background: SURFACE_INSET, fontFamily: MONO, fontSize: '0.74rem',
              minHeight: '36px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              {hoverUrl ? (
                <>
                  <span style={{ color: TF }}>{c.linkArrow} &rarr;</span>
                  <span style={{ color: isSafeUrl(hoverUrl) ? GREEN : DANGER, wordBreak: 'break-all' }}>
                    {hoverUrl}
                  </span>
                </>
              ) : (
                <span style={{ color: TF }}>{c.linkTip}</span>
              )}
            </div>

            {/* action area */}
            <div style={{ padding: '20px 30px 26px', borderTop: `1px solid ${BORDER}` }}>
              {!answered ? (
                <>
                  <div style={{ fontFamily: MONO, fontSize: '0.82rem', color: TS, marginBottom: '14px' }}>
                    {c.question}
                  </div>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <Btn variant="secondary" size="lg" onClick={() => onAnswer(true)}
                      style={{ flex: 1, justifyContent: 'center',
                        borderColor: 'rgb(248 113 113 / 0.45)', color: DANGER }}>
                      &#9873; {c.reportPhishing}
                    </Btn>
                    <Btn variant="secondary" size="lg" onClick={() => onAnswer(false)}
                      style={{ flex: 1, justifyContent: 'center',
                        borderColor: 'rgb(95 191 118 / 0.45)', color: SUCCESS }}>
                      &#10003; {c.looksLegit}
                    </Btn>
                  </div>
                </>
              ) : (
                <VerdictBox email={email} result={result!} onNext={onNext} nextLabel={nextLabel} c={c} fmt={fmt} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function VerdictBox({ email, result, onNext, nextLabel, c, fmt }: {
  email: LabEmail;
  result: Result;
  onNext: () => void;
  nextLabel: string;
  c: LabCopy;
  fmt: (n: number) => string;
}) {
  const ok = result.correct;
  const boxBorder = ok ? 'rgb(95 191 118 / 0.32)' : 'rgb(248 113 113 / 0.32)';
  const boxBg = ok ? 'rgb(95 191 118 / 0.05)' : 'rgb(248 113 113 / 0.05)';
  const titleColor = ok ? SUCCESS : DANGER;
  const title = ok ? c.goodCall : (email.isPhishing ? c.trap : c.falseAlarm);
  const sub = email.isPhishing ? c.wasPhishingVerdict : c.wasLegitVerdict;
  const cluesLabel = email.isPhishing ? c.redFlags : c.signsSafe;
  const lossText = email.isPhishing
    ? c.lossPhishing(fmt(email.damage), email.lossType)
    : c.lossLegit(fmt(email.damage));
  const lossBg = email.isPhishing ? 'rgb(248 113 113 / 0.08)' : 'rgb(251 191 36 / 0.08)';
  const lossBorder = email.isPhishing ? 'rgb(248 113 113 / 0.3)' : 'rgb(251 191 36 / 0.3)';
  const lossColor = email.isPhishing ? DANGER : WARNING;

  return (
    <>
      <div style={{ border: `1px solid ${boxBorder}`, background: boxBg, borderRadius: '10px', padding: '18px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
          <span style={{ color: titleColor, fontFamily: MONO, fontSize: '1.05rem', fontWeight: 700 }}>
            {ok ? '✓' : '✗'}
          </span>
          <span style={{ fontFamily: MONO, fontWeight: 600, fontSize: '1rem', color: titleColor }}>{title}</span>
          <span style={{ fontFamily: MONO, fontSize: '0.78rem', color: TM }}>&mdash; {sub}</span>
        </div>
        <p style={{ margin: '0 0 14px', fontSize: '0.92rem', lineHeight: 1.7, color: TS }}>{email.explain}</p>
        <div style={{ fontFamily: MONO, fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase',
          color: TM, marginBottom: '8px' }}>{cluesLabel}</div>
        <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '7px' }}>
          {email.clues.map((clue, i) => (
            <li key={i} style={{ display: 'flex', gap: '9px', fontSize: '0.9rem', lineHeight: 1.55, color: TS }}>
              <span style={{ color: ACCENT_LIGHT, fontFamily: MONO }}>&rsaquo;</span>
              <span>{clue}</span>
            </li>
          ))}
        </ul>
        {!ok && (
          <div style={{ marginTop: '14px', padding: '11px 14px', borderRadius: '8px', fontFamily: MONO,
            fontSize: '0.82rem', lineHeight: 1.55, background: lossBg,
            border: `1px solid ${lossBorder}`, color: lossColor }}>
            {lossText}
          </div>
        )}
      </div>
      <div style={{ marginTop: '18px' }}>
        <Btn variant="primary" size="lg" onClick={onNext}>
          {nextLabel} &rarr;
        </Btn>
      </div>
    </>
  );
}

// ─── Done screen ──────────────────────────────────────────────────────────────

function DoneScreen({ results, emails, onRestart, c, fmt }: {
  results: Result[];
  emails: LabEmail[];
  onRestart: () => void;
  c: LabCopy;
  fmt: (n: number) => string;
}) {
  const total = emails.length;
  const correctCount = results.filter(r => r.correct).length;
  const lost = results.filter(r => !r.correct).reduce((s, r) => s + r.damage, 0);
  const avoided = results.filter(r => r.correct && r.isPhishing).reduce((s, r) => s + r.damage, 0);
  const pct = total ? correctCount / total : 0;
  const grade =
    pct >= 0.875 ? c.grades.champion :
    pct >= 0.625 ? c.grades.solid :
    pct >= 0.375 ? c.grades.practice :
                   c.grades.risk;

  return (
    <div style={{ minHeight: 'calc(100vh - 4rem)', padding: '7rem 24px 56px', display: 'flex',
      justifyContent: 'center', background: '#0a0a0a' }}>
      <div style={{ width: '100%', maxWidth: '760px', animation: 'niwoUp 0.5s ease both' }}>

        <div style={{ fontFamily: MONO, fontSize: '0.7rem', letterSpacing: '0.22em',
          textTransform: 'uppercase', color: ACCENT_LIGHT, marginBottom: '14px' }}>{c.resultsEyebrow}</div>

        <h1 style={{ fontFamily: MONO, fontWeight: 700, fontSize: '2.2rem', lineHeight: 1.15,
          margin: '0 0 6px', color: grade.color }}>{grade.label}</h1>
        <p style={{ fontSize: '1.02rem', lineHeight: 1.65, color: TS, margin: '0 0 28px' }}>{grade.blurb}</p>

        {/* stat cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '14px', marginBottom: '30px' }}>
          <div style={{ border: `1px solid ${BORDER}`, borderRadius: '10px', background: SURFACE, padding: '20px' }}>
            <div style={{ fontFamily: MONO, fontSize: '1.9rem', fontWeight: 700, color: TP }}>
              {correctCount} / {total}
            </div>
            <div style={{ fontFamily: MONO, fontSize: '0.72rem', letterSpacing: '0.1em',
              textTransform: 'uppercase', color: TM, marginTop: '4px' }}>{c.spottedLabel}</div>
          </div>
          <div style={{ border: '1px solid rgb(95 191 118 / 0.25)', borderRadius: '10px',
            background: 'rgb(95 191 118 / 0.05)', padding: '20px' }}>
            <div style={{ fontFamily: MONO, fontSize: '1.9rem', fontWeight: 700, color: SUCCESS }}>
              {fmt(avoided)}
            </div>
            <div style={{ fontFamily: MONO, fontSize: '0.72rem', letterSpacing: '0.1em',
              textTransform: 'uppercase', color: TM, marginTop: '4px' }}>{c.stoppedLabel}</div>
          </div>
          <div style={{ border: '1px solid rgb(248 113 113 / 0.25)', borderRadius: '10px',
            background: 'rgb(248 113 113 / 0.05)', padding: '20px' }}>
            <div style={{ fontFamily: MONO, fontSize: '1.9rem', fontWeight: 700, color: DANGER }}>
              {fmt(lost)}
            </div>
            <div style={{ fontFamily: MONO, fontSize: '0.72rem', letterSpacing: '0.1em',
              textTransform: 'uppercase', color: TM, marginTop: '4px' }}>{c.damageLabel}</div>
          </div>
        </div>

        {/* breakdown */}
        <div style={{ border: `1px solid ${BORDER}`, borderRadius: '12px', background: SURFACE,
          overflow: 'hidden', marginBottom: '30px' }}>
          <div style={{ padding: '14px 20px', borderBottom: `1px solid ${BORDER_SOFT}`,
            fontFamily: MONO, fontSize: '0.74rem', letterSpacing: '0.14em',
            textTransform: 'uppercase', color: TS }}>{c.breakdownTitle}</div>
          {results.map((r, i) => {
            const email = emails[i];
            const wrong = !r.correct;
            return (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '14px',
                padding: '13px 20px', borderBottom: `1px solid ${BORDER_SOFT}` }}>
                <span style={{ fontFamily: MONO, fontSize: '0.85rem', fontWeight: 700,
                  color: r.correct ? SUCCESS : DANGER, flex: 'none', width: '16px', textAlign: 'center' }}>
                  {r.correct ? '✓' : '✗'}
                </span>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ fontSize: '0.88rem', color: TP, whiteSpace: 'nowrap',
                    overflow: 'hidden', textOverflow: 'ellipsis' }}>{email.subject}</div>
                  <div style={{ fontFamily: MONO, fontSize: '0.72rem', color: TM, marginTop: '2px' }}>
                    {c.breakdownMeta(r.category, r.chosePhishing, r.isPhishing)}
                  </div>
                </div>
                <span style={{ fontFamily: MONO, fontSize: '0.8rem', fontWeight: 600, flex: 'none',
                  color: wrong ? DANGER : TM }}>
                  {wrong ? `−${fmt(r.damage)}` : (r.isPhishing ? c.threatStopped : c.keptCorrectly)}
                </span>
              </div>
            );
          })}
        </div>

        {/* tips */}
        <div style={{ border: `1px solid ${BORDER}`, borderRadius: '12px', background: SURFACE,
          padding: '24px 26px', marginBottom: '22px' }}>
          <div style={{ fontFamily: MONO, fontSize: '0.74rem', letterSpacing: '0.14em',
            textTransform: 'uppercase', color: ACCENT_LIGHT, marginBottom: '16px' }}>
            {c.tipsTitle}
          </div>
          <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '13px' }}>
            {c.tips.map(tip => (
              <li key={tip.n} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <span style={{ fontFamily: MONO, fontSize: '0.72rem', color: ACCENT_LIGHT,
                  border: '1px solid rgb(95 98 184 / 0.3)', borderRadius: '5px', minWidth: '24px',
                  height: '24px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  flex: 'none', marginTop: '1px' }}>{tip.n}</span>
                <span style={{ fontSize: '0.93rem', lineHeight: 1.6, color: TS }}>{tip.text}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* next steps */}
        <div style={{ border: `1px solid ${BORDER}`, borderRadius: '12px', background: SURFACE,
          padding: '24px 26px', marginBottom: '30px' }}>
          <div style={{ fontFamily: MONO, fontSize: '0.74rem', letterSpacing: '0.14em',
            textTransform: 'uppercase', color: TS, marginBottom: '14px' }}>{c.nextStepsTitle}</div>
          <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '11px' }}>
            {c.nextSteps.map((step, i) => (
              <li key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start',
                fontSize: '0.93rem', lineHeight: 1.6, color: TS }}>
                <span style={{ color: GREEN, fontFamily: MONO }}>[&rsaquo;]</span>
                <span>{step}</span>
              </li>
            ))}
          </ul>
        </div>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <Btn variant="primary" size="lg" onClick={onRestart}>
            {c.runAgain}
          </Btn>
        </div>
      </div>
    </div>
  );
}

// ─── Root component ───────────────────────────────────────────────────────────

export default function PhishingLab() {
  const locale = useLocale();
  const c = labCopy[locale] ?? labCopy['en'];
  const fmt = (n: number) => '€' + Number(n).toLocaleString(c.dateLocale);

  const [screen, setScreen] = useState<Screen>('intro');
  const [index, setIndex] = useState(0);
  const [results, setResults] = useState<Result[]>([]);
  const [sessionEmails, setSessionEmails] = useState<LabEmail[]>(() => sampleEmails(c.emails, 8));

  const start = () => {
    setSessionEmails(sampleEmails(c.emails, 8));
    setScreen('play');
    setIndex(0);
    setResults([]);
  };

  const answer = (chosePhishing: boolean) => {
    if (results.length > index) return;
    const email = sessionEmails[index];
    setResults(prev => [...prev, {
      correct: chosePhishing === email.isPhishing,
      chosePhishing,
      isPhishing: email.isPhishing,
      damage: email.damage,
      category: email.category,
      subject: email.subject,
    }]);
  };

  const next = () => {
    if (index + 1 >= sessionEmails.length) setScreen('done');
    else setIndex(i => i + 1);
  };

  const restart = () => {
    setScreen('intro');
    setIndex(0);
    setResults([]);
  };

  if (screen === 'intro') return <IntroScreen onStart={start} c={c} />;
  if (screen === 'play') return <PlayScreen index={index} results={results} emails={sessionEmails} onAnswer={answer} onNext={next} c={c} fmt={fmt} />;
  return <DoneScreen results={results} emails={sessionEmails} onRestart={restart} c={c} fmt={fmt} />;
}
