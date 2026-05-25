"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";
import {
  calculateMetrics,
  getDayOneMessages,
  getIncidentOptions,
  getSummaryNarrative,
  getSummaryTone,
} from "@/components/trust-boundary/day-one-content";
import TrustBoundaryCanvas from "@/components/trust-boundary/TrustBoundaryCanvas";
import type {
  DecisionRecord,
  IncidentChoice,
  MessageAction,
  MetricScores,
  PrototypeMode,
} from "@/components/trust-boundary/types";

type PendingResolution = {
  title: string;
  text: string;
};

const SCORE_STYLES: Array<{ key: keyof MetricScores; accent: string; bar: string }> = [
  { key: "trust", accent: "text-indigo-400", bar: "bg-indigo-500" },
  { key: "continuity", accent: "text-zinc-300", bar: "bg-zinc-400" },
  { key: "judgment", accent: "text-emerald-400", bar: "bg-emerald-500" },
];

/* ─────────────────────────────────────────────────────────────── */

export default function TrustBoundaryPrototype() {
  const locale = useLocale() as AppLocale;
  const t = useTranslations("TrustBoundaryPrototype");
  const reduced = useReducedMotion();
  const messages = useMemo(() => getDayOneMessages(locale), [locale]);
  const incidentOptions = useMemo(() => getIncidentOptions(locale), [locale]);

  const [mode, setMode] = useState<PrototypeMode>("office");
  const [deskNearby, setDeskNearby] = useState(false);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [investigatedIds, setInvestigatedIds] = useState<string[]>([]);
  const [decisions, setDecisions] = useState<DecisionRecord[]>([]);
  const [pendingResolution, setPendingResolution] = useState<PendingResolution | null>(null);
  const [incidentTriggered, setIncidentTriggered] = useState(false);
  const [incidentChoice, setIncidentChoice] = useState<IncidentChoice | null>(null);

  const currentMessage = messages[currentMessageIndex];
  const investigated = currentMessage ? investigatedIds.includes(currentMessage.id) : false;
  const scores = useMemo(
    () => calculateMetrics(messages, decisions, incidentChoice),
    [decisions, incidentChoice, messages],
  );
  const summaryTone = getSummaryTone(scores);
  const summaryNarrative = getSummaryNarrative(locale, summaryTone, incidentChoice);

  const ease: [number, number, number, number] = [0.22, 1, 0.36, 1];
  const dur = reduced ? 0.1 : 0.3;

  useEffect(() => {
    if (mode !== "desk" || pendingResolution) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMode("office");
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mode, pendingResolution]);

  const handleDeskInteract = () => {
    if (mode !== "office") return;
    setMode("desk");
  };

  const handleInvestigate = () => {
    if (!currentMessage || investigated) return;
    setInvestigatedIds((prev) => [...prev, currentMessage.id]);
  };

  const handleMessageAction = (action: MessageAction) => {
    if (!currentMessage) return;
    setDecisions((prev) => [...prev, { messageId: currentMessage.id, action, investigated }]);
    setPendingResolution({
      title: action === currentMessage.bestAction ? t("game.feedback.good") : t("game.feedback.risk"),
      text: action === "allow" ? currentMessage.allowFeedback : currentMessage.quarantineFeedback,
    });
    if (currentMessage.incidentTrigger && action === "allow") setIncidentTriggered(true);
  };

  const advanceFlow = () => {
    setPendingResolution(null);
    if (currentMessageIndex < messages.length - 1) {
      setCurrentMessageIndex((prev) => prev + 1);
      return;
    }
    setMode(incidentTriggered ? "incident" : "summary");
  };

  const handleIncidentResolution = (choice: IncidentChoice) => {
    setIncidentChoice(choice);
    setMode("summary");
  };

  const handleReplay = () => {
    setMode("office");
    setDeskNearby(false);
    setCurrentMessageIndex(0);
    setInvestigatedIds([]);
    setDecisions([]);
    setPendingResolution(null);
    setIncidentTriggered(false);
    setIncidentChoice(null);
  };

  /* ── Shared animation helpers ─────────────────────────── */
  const fadeIn = (delay = 0) =>
    reduced ? {} : {
      initial: { opacity: 0, y: 10 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: dur, delay, ease },
    };

  /* ── Metric bars ──────────────────────────────────────── */
  const renderMetrics = (compact: boolean) => (
    <div className={compact ? "space-y-2.5" : "grid gap-3 sm:grid-cols-3"}>
      {SCORE_STYLES.map((s) => (
        <div key={s.key} className="rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[0.65rem] font-medium uppercase tracking-widest text-zinc-500">
              {t(`game.metrics.${s.key}`)}
            </span>
            <span className={`text-xs font-semibold tabular-nums ${s.accent}`}>{scores[s.key]}</span>
          </div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
            <motion.div
              initial={reduced ? false : { width: 0 }}
              animate={{ width: `${scores[s.key]}%` }}
              transition={reduced ? { duration: 0 } : { duration: 0.6, ease }}
              className={`h-full rounded-full ${s.bar}`}
              style={{ width: `${scores[s.key]}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );

  /* ── Objective text ───────────────────────────────────── */
  const objectiveText =
    mode === "office"
      ? deskNearby ? t("game.objectives.officeReady") : t("game.objectives.office")
      : mode === "desk" ? t("game.objectives.desk")
      : mode === "incident" ? t("game.objectives.incident")
      : t("game.objectives.summary");

  /* ─────────────────────────────────────────────────────── */
  return (
    <main className="h-[100dvh] overflow-hidden bg-[#0a0b10] text-zinc-100">
      <div className="flex h-full flex-col">

        {/* ── Top bar ──────────────────────────────────────── */}
        <header className="flex items-center justify-between border-b border-white/[0.06] bg-[#0e0f14] px-4 py-2.5 sm:px-6">
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold tracking-tight text-white">Trust Boundary</span>
            <span className="rounded bg-indigo-500/20 px-1.5 py-0.5 text-[0.6rem] font-semibold uppercase tracking-wider text-indigo-400">
              Prototype
            </span>
          </div>
          <div className="flex items-center gap-2 text-[0.65rem] font-medium uppercase tracking-wider text-zinc-500">
            <span className="rounded border border-white/[0.06] bg-white/[0.03] px-2 py-1">
              {mode === "office" ? t("game.mode.office") : mode === "desk" ? t("game.mode.desk") : mode === "incident" ? t("game.mode.incident") : t("game.mode.summary")}
            </span>
          </div>
        </header>

        {/* ── Main area ────────────────────────────────────── */}
        <div className="relative min-h-0 flex-1">

          {/* Phaser canvas */}
          <motion.div
            className="absolute inset-0"
            animate={reduced ? {} : {
              opacity: mode === "desk" ? 0.6 : 1,
              scale: mode === "desk" ? 1.05 : 1,
              filter: mode === "desk" ? "blur(4px)" : "blur(0px)",
            }}
            transition={{ duration: 0.4, ease }}
          >
            <TrustBoundaryCanvas
              deskMode={mode !== "office"}
              onDeskRangeChange={setDeskNearby}
              onDeskInteract={handleDeskInteract}
            />
          </motion.div>

          {/* ── Office mode HUD ────────────────────────────── */}
          <AnimatePresence>
            {mode === "office" && (
              <>
                {/* Objective */}
                <motion.div
                  {...fadeIn()}
                  exit={reduced ? {} : { opacity: 0, y: -8 }}
                  className="absolute left-4 top-4 z-20 max-w-xs rounded-lg border border-white/[0.06] bg-black/60 px-3 py-2.5 backdrop-blur-md sm:left-6 sm:top-5"
                >
                  <p className="text-[0.6rem] font-semibold uppercase tracking-widest text-zinc-500">
                    {t("game.objectiveEyebrow")}
                  </p>
                  <p className="mt-1.5 text-sm leading-relaxed text-zinc-200">{objectiveText}</p>
                </motion.div>

                {/* Interact prompt */}
                {deskNearby && (
                  <motion.button
                    type="button"
                    onClick={handleDeskInteract}
                    initial={reduced ? false : { opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={reduced ? {} : { opacity: 0, scale: 0.95 }}
                    className="absolute right-4 top-4 z-20 rounded-lg border border-indigo-500/30 bg-indigo-500/15 px-3.5 py-2 text-xs font-semibold uppercase tracking-wider text-indigo-300 backdrop-blur-md transition-colors hover:bg-indigo-500/25 sm:right-6 sm:top-5"
                  >
                    {t("game.enterDesk")}
                  </motion.button>
                )}

                {/* Bottom bar */}
                <motion.div
                  {...fadeIn(0.05)}
                  exit={reduced ? {} : { opacity: 0, y: 12 }}
                  className="absolute inset-x-0 bottom-0 z-10 flex items-end justify-between gap-3 bg-gradient-to-t from-[#0a0b10] via-[#0a0b10cc] to-transparent px-4 pb-4 pt-16 sm:px-6 sm:pb-5"
                >
                  <div className="max-w-sm rounded-lg border border-white/[0.06] bg-black/50 px-3 py-2.5 backdrop-blur-md">
                    <p className="text-[0.6rem] font-semibold uppercase tracking-widest text-indigo-400">
                      {t("game.roomEyebrow")}
                    </p>
                    <p className="mt-1.5 text-sm leading-relaxed text-zinc-300">
                      {deskNearby ? t("game.deskPrompt") : t("game.roomPrompt")}
                    </p>
                  </div>
                  <div className="max-w-xs rounded-lg border border-white/[0.06] bg-black/50 px-3 py-2.5 backdrop-blur-md">
                    <p className="text-[0.6rem] font-semibold uppercase tracking-widest text-zinc-500">
                      {t("game.coworkerEyebrow")}
                    </p>
                    <p className="mt-1.5 text-sm leading-relaxed text-zinc-400">
                      {t("game.coworkerHint")}
                    </p>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* ── Desk mode: Email client ────────────────────── */}
          <AnimatePresence mode="wait">
            {mode === "desk" && (
              <motion.div
                initial={reduced ? false : { opacity: 0, scale: 0.97, y: 16 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={reduced ? {} : { opacity: 0, scale: 0.98, y: 10 }}
                transition={{ duration: 0.35, ease }}
                className="absolute inset-3 z-30 flex flex-col overflow-hidden rounded-xl border border-white/[0.08] bg-[#0e0f14] shadow-2xl sm:inset-5"
              >
                {/* Email client header */}
                <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-2.5">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-7 w-7 items-center justify-center rounded-md bg-indigo-500/20">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-400">
                        <rect x="2" y="4" width="20" height="16" rx="2" />
                        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                      </svg>
                    </div>
                    <span className="text-sm font-semibold text-white">Inbox</span>
                    <span className="rounded-full bg-indigo-500/20 px-1.5 py-0.5 text-[0.6rem] font-bold tabular-nums text-indigo-400">
                      {messages.length - currentMessageIndex}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs tabular-nums text-zinc-500">
                      {currentMessageIndex + 1} / {messages.length}
                    </span>
                    <button
                      type="button"
                      onClick={() => setMode("office")}
                      className="rounded-md border border-white/[0.06] bg-white/[0.03] px-2.5 py-1.5 text-[0.65rem] font-medium uppercase tracking-wider text-zinc-400 transition-colors hover:bg-white/[0.06] hover:text-zinc-200"
                    >
                      {t("game.leaveDesk")}
                    </button>
                  </div>
                </div>

                {/* Email client body */}
                {currentMessage && (
                  <div className="flex min-h-0 flex-1">
                    {/* ── Message list sidebar ─────────────── */}
                    <div className="hidden w-56 flex-shrink-0 overflow-y-auto border-r border-white/[0.06] bg-[#0b0c11] lg:block">
                      {messages.map((msg, i) => {
                        const decided = decisions.some((d) => d.messageId === msg.id);
                        const active = i === currentMessageIndex;
                        return (
                          <div
                            key={msg.id}
                            className={`border-b border-white/[0.04] px-3 py-3 ${
                              active
                                ? "border-l-2 border-l-indigo-500 bg-indigo-500/[0.06]"
                                : "border-l-2 border-l-transparent"
                            } ${i > currentMessageIndex ? "opacity-40" : ""}`}
                          >
                            <div className="flex items-center gap-2">
                              {decided ? (
                                <span className="h-1.5 w-1.5 rounded-full bg-zinc-600" />
                              ) : active ? (
                                <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
                              ) : (
                                <span className="h-1.5 w-1.5 rounded-full bg-zinc-700" />
                              )}
                              <span className="truncate text-[0.65rem] font-medium text-zinc-400">
                                {msg.sender.split("@")[0]}
                              </span>
                            </div>
                            <p className={`mt-1 truncate text-xs leading-tight ${active ? "font-medium text-zinc-200" : "text-zinc-500"}`}>
                              {msg.subject}
                            </p>
                          </div>
                        );
                      })}
                    </div>

                    {/* ── Reading pane ──────────────────────── */}
                    <AnimatePresence mode="wait" initial={false}>
                      <motion.div
                        key={currentMessage.id}
                        initial={reduced ? false : { opacity: 0, x: 16 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={reduced ? {} : { opacity: 0, x: -16 }}
                        transition={{ duration: 0.25, ease }}
                        className="flex min-h-0 flex-1 flex-col overflow-y-auto lg:flex-row"
                      >
                        {/* Email content */}
                        <div className="flex min-w-0 flex-1 flex-col p-4 sm:p-5">
                          {/* Email header */}
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2">
                                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-zinc-800 text-xs font-bold uppercase text-zinc-400">
                                  {currentMessage.sender[0]}
                                </div>
                                <div className="min-w-0">
                                  <p className="truncate text-sm font-medium text-zinc-200">
                                    {currentMessage.sender}
                                  </p>
                                  <p className="text-[0.65rem] text-zinc-500">{currentMessage.category}</p>
                                </div>
                              </div>
                              <h2 className="mt-3 text-base font-semibold leading-snug text-white sm:text-lg">
                                {currentMessage.subject}
                              </h2>
                            </div>
                          </div>

                          {/* Email body */}
                          <div className="mt-4 rounded-lg border border-white/[0.04] bg-white/[0.02] px-4 py-4 text-sm leading-relaxed text-zinc-300">
                            {currentMessage.preview}
                          </div>

                          {/* Action buttons */}
                          <div className="mt-4 flex flex-wrap gap-2">
                            <button
                              type="button"
                              onClick={() => handleMessageAction("allow")}
                              disabled={Boolean(pendingResolution)}
                              className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-emerald-400 transition-colors hover:bg-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                              {t("game.allow")}
                            </button>
                            <button
                              type="button"
                              onClick={() => handleMessageAction("quarantine")}
                              disabled={Boolean(pendingResolution)}
                              className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-red-400 transition-colors hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                              {t("game.quarantine")}
                            </button>
                            <button
                              type="button"
                              onClick={handleInvestigate}
                              disabled={investigated || Boolean(pendingResolution)}
                              className="rounded-lg border border-indigo-500/20 bg-indigo-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-indigo-400 transition-colors hover:bg-indigo-500/20 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                              {investigated ? t("game.investigated") : t("game.investigate")}
                            </button>
                          </div>

                          {/* Spacer to push content up on small screens */}
                          <div className="flex-1" />
                        </div>

                        {/* ── Clues sidebar ───────────────────── */}
                        <div className="w-full flex-shrink-0 space-y-3 border-t border-white/[0.06] bg-[#0b0c11] p-4 sm:p-5 lg:w-64 lg:border-l lg:border-t-0 xl:w-72">
                          {/* Visible clues */}
                          <div>
                            <p className="text-[0.6rem] font-semibold uppercase tracking-widest text-zinc-500">
                              {t("game.visibleClues")}
                            </p>
                            <div className="mt-2.5 space-y-2">
                              {currentMessage.visibleClues.map((clue) => (
                                <div
                                  key={clue}
                                  className="rounded-md border border-white/[0.04] bg-white/[0.02] px-3 py-2 text-xs leading-relaxed text-zinc-400"
                                >
                                  {clue}
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Investigation clues */}
                          <div>
                            <p className="text-[0.6rem] font-semibold uppercase tracking-widest text-zinc-500">
                              {t("game.investigation")}
                            </p>
                            <AnimatePresence mode="wait" initial={false}>
                              {investigated ? (
                                <motion.div
                                  key="clues"
                                  initial={reduced ? false : { opacity: 0, y: 6 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  className="mt-2.5 space-y-2"
                                >
                                  {currentMessage.investigateClues.map((clue) => (
                                    <div
                                      key={clue}
                                      className="rounded-md border border-indigo-500/15 bg-indigo-500/[0.06] px-3 py-2 text-xs leading-relaxed text-indigo-300"
                                    >
                                      {clue}
                                    </div>
                                  ))}
                                </motion.div>
                              ) : (
                                <p className="mt-2.5 text-xs text-zinc-600">
                                  {t("game.investigationHint")}
                                </p>
                              )}
                            </AnimatePresence>
                          </div>
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                )}

                {/* ── Feedback overlay ───────────────────── */}
                <AnimatePresence>
                  {pendingResolution && (
                    <motion.div
                      initial={reduced ? false : { opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={reduced ? {} : { opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="absolute inset-0 z-10 flex items-center justify-center bg-black/70 backdrop-blur-sm"
                    >
                      <motion.div
                        initial={reduced ? false : { opacity: 0, scale: 0.96, y: 8 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={reduced ? {} : { opacity: 0, scale: 0.98, y: 6 }}
                        transition={{ duration: 0.2, ease }}
                        className="mx-4 w-full max-w-md rounded-xl border border-white/[0.08] bg-[#12131a] p-5 shadow-2xl"
                      >
                        <p className={`text-xs font-bold uppercase tracking-wider ${
                          pendingResolution.title === t("game.feedback.good") ? "text-emerald-400" : "text-amber-400"
                        }`}>
                          {pendingResolution.title}
                        </p>
                        <p className="mt-3 text-sm leading-relaxed text-zinc-300">
                          {pendingResolution.text}
                        </p>
                        <button
                          type="button"
                          onClick={advanceFlow}
                          className="mt-4 rounded-lg bg-indigo-500/20 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-indigo-300 transition-colors hover:bg-indigo-500/30"
                        >
                          {t("game.continue")}
                        </button>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Incident mode ──────────────────────────────── */}
          <AnimatePresence mode="wait">
            {mode === "incident" && (
              <motion.div
                initial={reduced ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={reduced ? {} : { opacity: 0 }}
                transition={{ duration: dur }}
                className="absolute inset-0 z-30 flex items-center justify-center bg-black/80 px-4 backdrop-blur-sm"
              >
                <motion.div
                  initial={reduced ? false : { opacity: 0, scale: 0.96, y: 12 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.3, ease }}
                  className="w-full max-w-2xl rounded-xl border border-white/[0.08] bg-[#12131a] p-6 shadow-2xl sm:p-8"
                >
                  <p className="text-xs font-bold uppercase tracking-wider text-red-400">
                    {t("game.incidentEyebrow")}
                  </p>
                  <h2 className="mt-3 text-xl font-bold text-white sm:text-2xl">
                    {t("game.incidentTitle")}
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-zinc-400">
                    {t("game.incidentPrompt")}
                  </p>
                  <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    {incidentOptions.map((option) => (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => handleIncidentResolution(option.id)}
                        className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-4 text-left transition-colors hover:border-indigo-500/30 hover:bg-indigo-500/[0.06]"
                      >
                        <p className="text-sm font-semibold text-zinc-200">{option.label}</p>
                        <p className="mt-2 text-xs leading-relaxed text-zinc-500">{option.description}</p>
                      </button>
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Summary mode ───────────────────────────────── */}
          <AnimatePresence mode="wait">
            {mode === "summary" && (
              <motion.div
                initial={reduced ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={reduced ? {} : { opacity: 0 }}
                transition={{ duration: dur }}
                className="absolute inset-0 z-30 flex items-center justify-center bg-black/85 px-4 backdrop-blur-sm"
              >
                <motion.div
                  initial={reduced ? false : { opacity: 0, scale: 0.96, y: 12 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.3, ease }}
                  className="w-full max-w-2xl rounded-xl border border-white/[0.08] bg-[#12131a] p-6 shadow-2xl sm:p-8"
                >
                  <p className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                    {t("game.summaryEyebrow")}
                  </p>
                  <h2 className="mt-3 text-xl font-bold text-white sm:text-2xl">
                    {t("game.summaryTitle")}
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                    {summaryTone === "strong"
                      ? t("game.summaryStrong")
                      : summaryTone === "mixed"
                        ? t("game.summaryMixed")
                        : t("game.summaryPoor")}
                  </p>

                  <div className="mt-6">{renderMetrics(false)}</div>

                  <p className="mt-6 text-sm leading-relaxed text-zinc-400">{summaryNarrative}</p>

                  <div className="mt-6 flex gap-2">
                    <button
                      type="button"
                      onClick={handleReplay}
                      className="rounded-lg bg-indigo-500/20 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-indigo-300 transition-colors hover:bg-indigo-500/30"
                    >
                      {t("game.replay")}
                    </button>
                    <Link
                      href="/"
                      className="rounded-lg border border-white/[0.06] bg-white/[0.03] px-4 py-2 text-xs font-semibold uppercase tracking-wider text-zinc-400 transition-colors hover:text-zinc-200"
                    >
                      {t("game.backHome")}
                    </Link>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}
