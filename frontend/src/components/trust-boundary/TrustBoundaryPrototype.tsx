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

const SCORE_STYLES: Array<{ key: keyof MetricScores; accent: string; rail: string }> = [
  {
    key: "trust",
    accent: "text-[var(--color-accent-light)]",
    rail: "bg-[linear-gradient(90deg,rgba(140,127,224,0.9),rgba(140,127,224,0.2))]",
  },
  {
    key: "continuity",
    accent: "text-zinc-100",
    rail: "bg-[linear-gradient(90deg,rgba(244,244,245,0.9),rgba(244,244,245,0.18))]",
  },
  {
    key: "judgment",
    accent: "text-[#7fd6a2]",
    rail: "bg-[linear-gradient(90deg,rgba(127,214,162,0.9),rgba(127,214,162,0.2))]",
  },
];

export default function TrustBoundaryPrototype() {
  const locale = useLocale() as AppLocale;
  const t = useTranslations("TrustBoundaryPrototype");
  const prefersReducedMotion = useReducedMotion();
  const messages = useMemo(() => getDayOneMessages(locale), [locale]);
  const incidentOptions = useMemo(() => getIncidentOptions(locale), [locale]);

  const [mode, setMode] = useState<PrototypeMode>("office");
  const [deskNearby, setDeskNearby] = useState(false);
  const [notesOpen, setNotesOpen] = useState(false);
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
  const motionEase: [number, number, number, number] = [0.22, 1, 0.36, 1];

  const getEntranceMotion = (delay = 0) =>
    prefersReducedMotion
      ? {}
      : {
          initial: { opacity: 0, y: 18 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.52, delay, ease: motionEase },
        };

  const getSurfaceMotion = (delay = 0, y = 14, scale = 0.985) =>
    prefersReducedMotion
      ? {}
      : {
          initial: { opacity: 0, y, scale },
          animate: { opacity: 1, y: 0, scale: 1 },
          transition: { duration: 0.34, delay, ease: motionEase },
        };

  const hoverLift = prefersReducedMotion ? undefined : { y: -2, scale: 1.01 };
  const tapPress = prefersReducedMotion ? undefined : { scale: 0.985 };

  useEffect(() => {
    if (mode !== "desk" || pendingResolution) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMode("office");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mode, pendingResolution]);

  const objectiveText =
    mode === "office"
      ? deskNearby
        ? t("game.objectives.officeReady")
        : t("game.objectives.office")
      : mode === "desk"
        ? t("game.objectives.desk")
        : mode === "incident"
          ? t("game.objectives.incident")
          : t("game.objectives.summary");

  const modeChip =
    mode === "office"
      ? t("game.mode.office")
      : mode === "desk"
        ? t("game.mode.desk")
        : mode === "incident"
          ? t("game.mode.incident")
          : t("game.mode.summary");

  const handleDeskInteract = () => {
    if (mode !== "office") return;
    setNotesOpen(false);
    setMode("desk");
  };

  const handleInvestigate = () => {
    if (!currentMessage || investigated) return;
    setInvestigatedIds((previous) => [...previous, currentMessage.id]);
  };

  const handleMessageAction = (action: MessageAction) => {
    if (!currentMessage) return;

    const nextDecision: DecisionRecord = {
      messageId: currentMessage.id,
      action,
      investigated,
    };

    setDecisions((previous) => [...previous, nextDecision]);
    setPendingResolution({
      title:
        action === currentMessage.bestAction
          ? t("game.feedback.good")
          : t("game.feedback.risk"),
      text:
        action === "allow"
          ? currentMessage.allowFeedback
          : currentMessage.quarantineFeedback,
    });

    if (currentMessage.incidentTrigger && action === "allow") {
      setIncidentTriggered(true);
    }
  };

  const advanceFlow = () => {
    setPendingResolution(null);

    if (currentMessageIndex < messages.length - 1) {
      setCurrentMessageIndex((previous) => previous + 1);
      return;
    }

    if (incidentTriggered) {
      setMode("incident");
      return;
    }

    setMode("summary");
  };

  const handleIncidentResolution = (choice: IncidentChoice) => {
    setIncidentChoice(choice);
    setMode("summary");
  };

  const handleReplay = () => {
    setMode("office");
    setDeskNearby(false);
    setNotesOpen(false);
    setCurrentMessageIndex(0);
    setInvestigatedIds([]);
    setDecisions([]);
    setPendingResolution(null);
    setIncidentTriggered(false);
    setIncidentChoice(null);
  };

  const renderMetrics = (dense: boolean) => (
    <div className={dense ? "space-y-3" : "grid gap-4 sm:grid-cols-3"}>
      {SCORE_STYLES.map((item, index) => (
        <motion.div
          key={item.key}
          {...getSurfaceMotion(index * 0.06, 10, 0.99)}
          className="rounded-2xl border border-white/[0.08] bg-white/[0.02] px-4 py-4"
        >
          <div className="flex items-center justify-between gap-3">
            <p className="font-mono text-[0.68rem] uppercase tracking-[0.22em] text-zinc-500">
              {t(`game.metrics.${item.key}`)}
            </p>
            <p className={`font-mono text-sm ${item.accent}`}>{scores[item.key]}</p>
          </div>
          <div className="mt-4 h-2 rounded-full bg-white/[0.06]">
            <motion.div
              initial={prefersReducedMotion ? false : { width: 0 }}
              animate={{ width: `${scores[item.key]}%` }}
              transition={
                prefersReducedMotion
                  ? { duration: 0 }
                  : { duration: 0.72, ease: motionEase, delay: 0.08 }
              }
              className={`h-2 rounded-full ${item.rail}`}
              style={{ width: `${scores[item.key]}%` }}
            />
          </div>
        </motion.div>
      ))}
    </div>
  );

  return (
    <main className="h-[100dvh] overflow-hidden bg-[#05060a] text-foreground">
      <section className="mx-auto flex h-full max-w-[100rem] min-h-0 flex-col gap-4 px-3 py-3 sm:px-5 sm:py-5">
        <motion.div
          {...getEntranceMotion(0)}
          className="rounded-[1.45rem] border border-white/[0.08] bg-[#111113] px-4 py-4 shadow-[0_20px_64px_rgba(0,0,0,0.34)] sm:px-5"
        >
          <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
            <div className="max-w-4xl">
              <p className="font-mono text-[0.68rem] uppercase tracking-[0.24em] text-zinc-500">
                /lab/trust-boundry-prototype
              </p>
              <p className="mt-3 font-mono text-[0.72rem] font-medium uppercase tracking-[0.3em] text-[var(--color-accent-light)]">
                {t("eyebrow")}
              </p>
              <h1 className="mt-3 max-w-4xl font-mono text-xl font-semibold leading-[1.08] tracking-tight text-white sm:text-[2.1rem] lg:text-[2.5rem]">
                {t("title")}
              </h1>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-zinc-300 sm:text-[0.95rem]">
                {t("intro")}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 font-mono">
              <span className="rounded-full border border-[rgb(140_127_224/0.28)] bg-[rgb(95_98_184/0.14)] px-3 py-1.5 text-[0.68rem] uppercase tracking-[0.22em] text-zinc-100">
                {t("status")}
              </span>
              <span className="rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-[0.68rem] uppercase tracking-[0.22em] text-zinc-400">
                {t("buildLabel")}
              </span>
              <span className="rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-[0.68rem] uppercase tracking-[0.22em] text-zinc-300">
                {modeChip}
              </span>
              <button
                type="button"
                onClick={() => setNotesOpen((previous) => !previous)}
                className="rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-[0.68rem] uppercase tracking-[0.22em] text-zinc-300 transition-colors hover:border-[rgb(95_98_184/0.28)] hover:text-white"
              >
                {notesOpen ? t("game.closeNotes") : t("game.openNotes")}
              </button>
            </div>
          </div>
        </motion.div>

        <motion.div
          {...getEntranceMotion(0.06)}
          className="relative min-h-0 flex-1 overflow-hidden rounded-[1.8rem] border border-white/[0.08] bg-[#111113] shadow-[0_28px_90px_rgba(0,0,0,0.34)]"
        >
          <motion.div
            aria-hidden="true"
            className="trust-boundary-ambient-sweep pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(circle_at_22%_18%,rgba(95,98,184,0.2),transparent_22%),radial-gradient(circle_at_78%_82%,rgba(127,214,162,0.08),transparent_24%),linear-gradient(180deg,rgba(255,255,255,0.02),transparent_28%,rgba(0,0,0,0.08))]"
            animate={
              prefersReducedMotion
                ? { opacity: mode === "desk" ? 0.32 : 0.5 }
                : {
                    opacity: mode === "desk" ? 0.32 : [0.44, 0.6, 0.44],
                    scale: mode === "desk" ? 1 : [1, 1.015, 1],
                  }
            }
            transition={
              prefersReducedMotion
                ? { duration: 0.2 }
                : { duration: 7.2, repeat: Infinity, ease: "easeInOut" }
            }
          />
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-[2] bg-[radial-gradient(circle_at_center,transparent_16%,rgba(4,5,10,0.12)_38%,rgba(4,5,10,0.74)_100%)]"
            animate={
              prefersReducedMotion
                ? { opacity: mode === "desk" ? 1 : 0.14 }
                : {
                    opacity: mode === "desk" ? 1 : 0.14,
                    scale: mode === "desk" ? 1.02 : 1,
                  }
            }
            transition={
              prefersReducedMotion
                ? { duration: 0.12 }
                : { duration: 0.42, ease: motionEase }
            }
          />
          <div className="absolute inset-x-0 top-0 z-20 flex flex-wrap items-start justify-between gap-3 px-4 pt-4 sm:px-6 sm:pt-5">
            <div className="max-w-md rounded-2xl border border-white/[0.08] bg-black/48 px-4 py-3 backdrop-blur-sm">
              <p className="font-mono text-[0.68rem] uppercase tracking-[0.22em] text-zinc-500">
                {t("game.objectiveEyebrow")}
              </p>
              <p className="mt-2 text-sm leading-7 text-zinc-200">{objectiveText}</p>
            </div>

            <div className="flex flex-wrap items-center justify-end gap-2">
              {mode === "office" && deskNearby ? (
                <motion.button
                  type="button"
                  onClick={handleDeskInteract}
                  animate={
                    prefersReducedMotion
                      ? {}
                      : {
                          boxShadow: [
                            "0 0 0 rgba(95,98,184,0)",
                            "0 0 24px rgba(95,98,184,0.28)",
                            "0 0 0 rgba(95,98,184,0)",
                          ],
                          y: [0, -2, 0],
                        }
                  }
                  transition={
                    prefersReducedMotion
                      ? { duration: 0 }
                      : { duration: 2.6, repeat: Infinity, ease: "easeInOut" }
                  }
                  whileHover={prefersReducedMotion ? undefined : { scale: 1.02 }}
                  whileTap={prefersReducedMotion ? undefined : { scale: 0.985 }}
                  className="rounded-full border border-[rgb(140_127_224/0.28)] bg-[rgb(95_98_184/0.16)] px-4 py-2 font-mono text-[0.74rem] uppercase tracking-[0.18em] text-zinc-100 transition-colors hover:bg-[rgb(95_98_184/0.24)]"
                >
                  {t("game.enterDesk")}
                </motion.button>
              ) : null}
            </div>
          </div>

          <motion.div
            className="absolute inset-0"
            animate={
              prefersReducedMotion
                ? { opacity: 1, scale: 1 }
                : {
                    opacity: mode === "desk" ? 0.76 : 1,
                    scale: mode === "desk" ? 1.08 : deskNearby ? 1.015 : 1,
                  }
            }
            transition={
              prefersReducedMotion
                ? { duration: 0.12 }
                : { duration: 0.52, ease: motionEase }
            }
          >
            <TrustBoundaryCanvas
              deskMode={mode !== "office"}
              onDeskRangeChange={setDeskNearby}
              onDeskInteract={handleDeskInteract}
            />
          </motion.div>

          <AnimatePresence>
            {mode === "office" ? (
              <motion.div
                initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={prefersReducedMotion ? {} : { opacity: 0, y: 18 }}
                transition={
                  prefersReducedMotion
                    ? { duration: 0.12 }
                    : { duration: 0.34, ease: motionEase }
                }
                className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex flex-wrap items-end justify-between gap-3 bg-gradient-to-t from-[#05060a] via-[#05060abf] to-transparent px-4 pb-4 pt-18 sm:px-6 sm:pb-6"
              >
                <motion.div
                  {...getSurfaceMotion(0.04, 16, 0.99)}
                  className="max-w-sm rounded-2xl border border-white/[0.08] bg-black/54 px-4 py-3 backdrop-blur-sm"
                >
                  <p className="font-mono text-[0.68rem] uppercase tracking-[0.22em] text-[var(--color-accent-light)]">
                    {t("game.roomEyebrow")}
                  </p>
                  <p className="mt-2 text-sm leading-7 text-zinc-200">
                    {deskNearby ? t("game.deskPrompt") : t("game.roomPrompt")}
                  </p>
                </motion.div>

                <motion.div
                  {...getSurfaceMotion(0.1, 16, 0.99)}
                  className="max-w-xs rounded-2xl border border-white/[0.08] bg-black/46 px-4 py-3 backdrop-blur-sm"
                >
                  <p className="font-mono text-[0.68rem] uppercase tracking-[0.22em] text-zinc-500">
                    {t("game.coworkerEyebrow")}
                  </p>
                  <p className="mt-2 text-sm leading-7 text-zinc-300">
                    {t("game.coworkerHint")}
                  </p>
                </motion.div>
              </motion.div>
            ) : null}
          </AnimatePresence>

          <AnimatePresence>
            {notesOpen && mode === "office" ? (
              <motion.div
                initial={prefersReducedMotion ? false : { opacity: 0, x: 28 }}
                animate={{ opacity: 1, x: 0 }}
                exit={prefersReducedMotion ? {} : { opacity: 0, x: 24 }}
                transition={
                  prefersReducedMotion
                    ? { duration: 0.16 }
                    : { duration: 0.34, ease: motionEase }
                }
                className="absolute inset-y-0 right-0 z-30 flex w-full max-w-sm border-l border-white/[0.08] bg-[#090b11]/96 backdrop-blur-xl"
              >
                <div className="flex h-full w-full flex-col overflow-y-auto p-5">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-mono text-[0.68rem] uppercase tracking-[0.22em] text-[var(--color-accent-light)]">
                      {t("game.briefEyebrow")}
                    </p>
                    <h2 className="mt-3 font-mono text-lg font-semibold leading-7 text-white">
                      {t("game.briefTitle")}
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => setNotesOpen(false)}
                    className="rounded-full border border-white/[0.08] px-3 py-1 font-mono text-[0.68rem] uppercase tracking-[0.18em] text-zinc-300 transition-colors hover:border-[rgb(95_98_184/0.28)] hover:text-white"
                  >
                    {t("game.closeNotes")}
                  </button>
                </div>

                <p className="mt-4 text-sm leading-7 text-zinc-300">{t("game.briefText")}</p>

                <div className="mt-6 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4">
                  <p className="font-mono text-[0.68rem] uppercase tracking-[0.22em] text-zinc-500">
                    {t("game.controlsTitle")}
                  </p>
                  <ul className="mt-4 space-y-3 text-sm leading-7 text-zinc-300">
                    <li>{t("game.controls.move")}</li>
                    <li>{t("game.controls.interact")}</li>
                    <li>{t("game.controls.closeDesk")}</li>
                    <li>{t("game.controls.investigate")}</li>
                  </ul>
                </div>

                <div className="mt-6">
                  <p className="font-mono text-[0.68rem] uppercase tracking-[0.22em] text-zinc-500">
                    {t("game.metricsEyebrow")}
                  </p>
                  <div className="mt-4">{renderMetrics(true)}</div>
                </div>

                <div className="mt-6 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4">
                  <p className="font-mono text-[0.68rem] uppercase tracking-[0.22em] text-zinc-500">
                    {t("game.dayPlanEyebrow")}
                  </p>
                  <ol className="mt-4 space-y-4 text-sm leading-7 text-zinc-300">
                    {[
                      t("game.dayPlan.enter"),
                      t("game.dayPlan.sit"),
                      t("game.dayPlan.review"),
                      t("game.dayPlan.incident"),
                      t("game.dayPlan.summary"),
                    ].map((step, index) => (
                      <li key={step} className="flex gap-3">
                        <span className="mt-1 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.03] font-mono text-[0.72rem] text-zinc-400">
                          {index + 1}
                        </span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {mode === "desk" ? (
              <motion.div
                initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.975, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={prefersReducedMotion ? {} : { opacity: 0, scale: 0.985, y: 10 }}
                transition={
                  prefersReducedMotion
                    ? { duration: 0.16 }
                    : { duration: 0.38, ease: motionEase }
                }
                className="absolute inset-3 z-30 rounded-[1.75rem] border border-white/[0.08] bg-[#06080f]/92 shadow-[0_24px_80px_rgba(0,0,0,0.5)] backdrop-blur-sm sm:inset-6"
              >
                <motion.div
                  initial={prefersReducedMotion ? false : { opacity: 0.7 }}
                  animate={{ opacity: 1 }}
                  transition={prefersReducedMotion ? { duration: 0.12 } : { duration: 0.26 }}
                  className="trust-boundary-monitor flex h-full flex-col overflow-hidden rounded-[1.55rem] border border-white/[0.06] bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.01)),#0d1016]"
                >
                  <motion.div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-10 top-0 z-0 h-20 rounded-b-[2rem] bg-[radial-gradient(circle_at_center,rgba(140,127,224,0.18),transparent_72%)]"
                    animate={
                      prefersReducedMotion
                        ? { opacity: 0.45 }
                        : { opacity: [0.24, 0.52, 0.24] }
                    }
                    transition={
                      prefersReducedMotion
                        ? { duration: 0.12 }
                        : { duration: 3.2, repeat: Infinity, ease: "easeInOut" }
                    }
                  />
                  <div className="relative flex h-full flex-col">
                    <motion.div
                      {...getSurfaceMotion(0.04, 10, 0.995)}
                      className="flex items-center justify-between border-b border-white/[0.06] px-5 py-4 font-mono text-[0.74rem] uppercase tracking-[0.22em] text-zinc-400"
                    >
                      <div className="flex items-center gap-2">
                        <span className="h-2.5 w-2.5 rounded-full bg-[var(--color-accent-light)]/80" />
                        <span>{t("game.inboxShell")}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-[var(--color-accent-light)]">
                          {t("game.currentMessage", {
                            current: currentMessageIndex + 1,
                            total: messages.length,
                          })}
                        </span>
                        <motion.button
                          type="button"
                          onClick={() => setMode("office")}
                          whileHover={hoverLift}
                          whileTap={tapPress}
                          className="rounded-full border border-white/[0.08] px-3 py-1 transition-colors hover:border-[rgb(95_98_184/0.28)] hover:text-white"
                        >
                          {t("game.leaveDesk")}
                        </motion.button>
                      </div>
                    </motion.div>

                    {currentMessage ? (
                      <AnimatePresence mode="wait" initial={false}>
                        <motion.div
                          key={currentMessage.id}
                          initial={
                            prefersReducedMotion
                              ? false
                              : { opacity: 0, x: 22, scale: 0.992 }
                          }
                          animate={{ opacity: 1, x: 0, scale: 1 }}
                          exit={
                            prefersReducedMotion
                              ? {}
                              : { opacity: 0, x: -22, scale: 0.992 }
                          }
                          transition={
                            prefersReducedMotion
                              ? { duration: 0.12 }
                              : { duration: 0.32, ease: motionEase }
                          }
                          className="grid flex-1 gap-5 overflow-auto p-5 lg:grid-cols-[minmax(0,1.5fr)_19rem]"
                        >
                          <motion.article
                            {...getSurfaceMotion(0.02, 14, 0.992)}
                            className="rounded-2xl border border-white/[0.08] bg-[#0f1117] p-5 shadow-[0_16px_48px_rgba(0,0,0,0.24)]"
                          >
                            <p className="font-mono text-[0.68rem] uppercase tracking-[0.22em] text-zinc-500">
                              {currentMessage.category}
                            </p>
                            <div className="mt-5 space-y-4">
                              <div>
                                <p className="font-mono text-[0.68rem] uppercase tracking-[0.22em] text-zinc-500">
                                  {t("game.sender")}
                                </p>
                                <p className="mt-2 text-sm leading-7 text-zinc-200">
                                  {currentMessage.sender}
                                </p>
                              </div>

                              <div>
                                <p className="font-mono text-[0.68rem] uppercase tracking-[0.22em] text-zinc-500">
                                  {t("game.subject")}
                                </p>
                                <p className="mt-2 text-lg leading-8 text-white sm:text-xl">
                                  {currentMessage.subject}
                                </p>
                              </div>

                              <motion.p
                                {...getSurfaceMotion(0.06, 12, 0.995)}
                                className="rounded-2xl border border-white/[0.06] bg-white/[0.02] px-4 py-4 text-sm leading-7 text-zinc-300 sm:text-[0.96rem]"
                              >
                                {currentMessage.preview}
                              </motion.p>
                            </div>

                            <div className="mt-6 grid gap-3 sm:grid-cols-3">
                              <motion.button
                                type="button"
                                onClick={() => handleMessageAction("allow")}
                                disabled={Boolean(pendingResolution)}
                                whileHover={hoverLift}
                                whileTap={tapPress}
                                className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 font-mono text-[0.76rem] uppercase tracking-[0.18em] text-zinc-100 transition-colors hover:border-[rgb(95_98_184/0.28)] hover:bg-[rgb(95_98_184/0.08)] disabled:cursor-not-allowed disabled:opacity-60"
                              >
                                {t("game.allow")}
                              </motion.button>
                              <motion.button
                                type="button"
                                onClick={() => handleMessageAction("quarantine")}
                                disabled={Boolean(pendingResolution)}
                                whileHover={hoverLift}
                                whileTap={tapPress}
                                className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 font-mono text-[0.76rem] uppercase tracking-[0.18em] text-zinc-100 transition-colors hover:border-[rgb(95_98_184/0.28)] hover:bg-[rgb(95_98_184/0.08)] disabled:cursor-not-allowed disabled:opacity-60"
                              >
                                {t("game.quarantine")}
                              </motion.button>
                              <motion.button
                                type="button"
                                onClick={handleInvestigate}
                                disabled={investigated || Boolean(pendingResolution)}
                                whileHover={hoverLift}
                                whileTap={tapPress}
                                className="rounded-xl border border-[rgb(140_127_224/0.28)] bg-[rgb(95_98_184/0.14)] px-4 py-3 font-mono text-[0.76rem] uppercase tracking-[0.18em] text-zinc-100 transition-colors hover:bg-[rgb(95_98_184/0.24)] disabled:cursor-not-allowed disabled:opacity-60"
                              >
                                {investigated ? t("game.investigated") : t("game.investigate")}
                              </motion.button>
                            </div>
                          </motion.article>

                          <motion.div
                            {...getSurfaceMotion(0.08, 16, 0.992)}
                            className="space-y-4"
                          >
                            <motion.article
                              {...getSurfaceMotion(0.1, 12, 0.995)}
                              className="rounded-2xl border border-white/[0.08] bg-[#0f1117] p-5"
                            >
                              <p className="font-mono text-[0.68rem] uppercase tracking-[0.22em] text-zinc-500">
                                {t("game.visibleClues")}
                              </p>
                              <div className="mt-4 space-y-3 text-sm leading-7 text-zinc-300">
                                {currentMessage.visibleClues.map((clue, index) => (
                                  <motion.div
                                    key={clue}
                                    {...getSurfaceMotion(0.12 + index * 0.04, 10, 0.995)}
                                    className="rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3"
                                  >
                                    {clue}
                                  </motion.div>
                                ))}
                              </div>
                            </motion.article>

                            <motion.article
                              {...getSurfaceMotion(0.16, 12, 0.995)}
                              className="rounded-2xl border border-white/[0.08] bg-[#0f1117] p-5"
                            >
                              <p className="font-mono text-[0.68rem] uppercase tracking-[0.22em] text-zinc-500">
                                {t("game.investigation")}
                              </p>
                              <AnimatePresence mode="wait" initial={false}>
                                {investigated ? (
                                  <motion.ul
                                    key="investigated"
                                    initial={
                                      prefersReducedMotion
                                        ? false
                                        : { opacity: 0, y: 10 }
                                    }
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={
                                      prefersReducedMotion
                                        ? {}
                                        : { opacity: 0, y: -8 }
                                    }
                                    transition={
                                      prefersReducedMotion
                                        ? { duration: 0.12 }
                                        : { duration: 0.24, ease: motionEase }
                                    }
                                    className="mt-4 space-y-3 text-sm leading-7 text-zinc-300"
                                  >
                                    {currentMessage.investigateClues.map((clue, index) => (
                                      <motion.li
                                        key={clue}
                                        {...getSurfaceMotion(index * 0.05, 10, 0.995)}
                                        className="rounded-xl border border-[rgb(95_98_184/0.18)] bg-[rgb(95_98_184/0.08)] px-4 py-3"
                                      >
                                        {clue}
                                      </motion.li>
                                    ))}
                                  </motion.ul>
                                ) : (
                                  <motion.p
                                    key="hint"
                                    initial={
                                      prefersReducedMotion
                                        ? false
                                        : { opacity: 0, y: 8 }
                                    }
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={
                                      prefersReducedMotion
                                        ? {}
                                        : { opacity: 0, y: -6 }
                                    }
                                    transition={
                                      prefersReducedMotion
                                        ? { duration: 0.12 }
                                        : { duration: 0.22, ease: motionEase }
                                    }
                                    className="mt-4 text-sm leading-7 text-zinc-400"
                                  >
                                    {t("game.investigationHint")}
                                  </motion.p>
                                )}
                              </AnimatePresence>
                            </motion.article>
                          </motion.div>
                        </motion.div>
                      </AnimatePresence>
                    ) : null}
                  </div>

                <AnimatePresence>
                  {pendingResolution ? (
                    <motion.div
                      initial={prefersReducedMotion ? false : { opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={prefersReducedMotion ? {} : { opacity: 0 }}
                      transition={prefersReducedMotion ? { duration: 0.12 } : { duration: 0.2 }}
                      className="absolute inset-0 flex items-center justify-center bg-[#04050a]/78 px-6 backdrop-blur-sm"
                    >
                      <motion.div
                        initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.96, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={prefersReducedMotion ? {} : { opacity: 0, scale: 0.98, y: 8 }}
                        transition={
                          prefersReducedMotion
                            ? { duration: 0.12 }
                            : { duration: 0.24, ease: motionEase }
                        }
                        className="w-full max-w-xl rounded-2xl border border-white/[0.08] bg-[#111113] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.44)]"
                      >
                      <p className="font-mono text-[0.68rem] uppercase tracking-[0.22em] text-[var(--color-accent-light)]">
                        {pendingResolution.title}
                      </p>
                      <p className="mt-4 text-base leading-8 text-zinc-200">
                        {pendingResolution.text}
                      </p>
                      <button
                        type="button"
                        onClick={advanceFlow}
                        className="mt-6 inline-flex items-center justify-center rounded-full border border-[rgb(140_127_224/0.28)] bg-[rgb(95_98_184/0.14)] px-4 py-2 font-mono text-[0.78rem] uppercase tracking-[0.18em] text-zinc-100 transition-colors hover:bg-[rgb(95_98_184/0.24)]"
                      >
                        {t("game.continue")}
                      </button>
                      </motion.div>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
                </motion.div>
              </motion.div>
            ) : null}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {mode === "incident" ? (
              <motion.div
                initial={prefersReducedMotion ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={prefersReducedMotion ? {} : { opacity: 0 }}
                transition={prefersReducedMotion ? { duration: 0.12 } : { duration: 0.24 }}
                className="absolute inset-0 z-30 flex items-center justify-center bg-[#04050a]/84 px-6 backdrop-blur-sm"
              >
                <motion.div
                  initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.965, y: 12 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={prefersReducedMotion ? {} : { opacity: 0, scale: 0.985, y: 8 }}
                  transition={
                    prefersReducedMotion
                      ? { duration: 0.12 }
                      : { duration: 0.3, ease: motionEase }
                  }
                  className="w-full max-w-3xl rounded-[1.7rem] border border-white/[0.08] bg-[#111113] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.44)] sm:p-8"
                >
                <p className="font-mono text-[0.68rem] uppercase tracking-[0.22em] text-[var(--color-accent-light)]">
                  {t("game.incidentEyebrow")}
                </p>
                <h2 className="mt-4 font-mono text-2xl font-semibold leading-9 text-white sm:text-3xl">
                  {t("game.incidentTitle")}
                </h2>
                <p className="mt-4 max-w-2xl text-sm leading-8 text-zinc-300 sm:text-[0.98rem]">
                  {t("game.incidentPrompt")}
                </p>

                <div className="mt-8 grid gap-4 md:grid-cols-2">
                  {incidentOptions.map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => handleIncidentResolution(option.id)}
                      className="rounded-2xl border border-white/[0.08] bg-white/[0.02] px-5 py-5 text-left transition-colors hover:border-[rgb(95_98_184/0.28)] hover:bg-[rgb(95_98_184/0.08)]"
                    >
                      <p className="font-mono text-[0.78rem] uppercase tracking-[0.18em] text-zinc-100">
                        {option.label}
                      </p>
                      <p className="mt-3 text-sm leading-7 text-zinc-300">{option.description}</p>
                    </button>
                  ))}
                </div>
                </motion.div>
              </motion.div>
            ) : null}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {mode === "summary" ? (
              <motion.div
                initial={prefersReducedMotion ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={prefersReducedMotion ? {} : { opacity: 0 }}
                transition={prefersReducedMotion ? { duration: 0.12 } : { duration: 0.24 }}
                className="absolute inset-0 z-30 flex items-center justify-center bg-[#04050a]/88 px-6 backdrop-blur-sm"
              >
                <motion.div
                  initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.96, y: 12 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={prefersReducedMotion ? {} : { opacity: 0, scale: 0.985, y: 8 }}
                  transition={
                    prefersReducedMotion
                      ? { duration: 0.12 }
                      : { duration: 0.32, ease: motionEase }
                  }
                  className="w-full max-w-3xl rounded-[1.7rem] border border-white/[0.08] bg-[#111113] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.44)] sm:p-8"
                >
                <p className="font-mono text-[0.68rem] uppercase tracking-[0.22em] text-[var(--color-accent-light)]">
                  {t("game.summaryEyebrow")}
                </p>
                <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                  <div>
                    <h2 className="font-mono text-2xl font-semibold leading-9 text-white sm:text-3xl">
                      {t("game.summaryTitle")}
                    </h2>
                    <p className="mt-3 max-w-2xl text-sm leading-8 text-zinc-300 sm:text-[0.98rem]">
                      {summaryTone === "strong"
                        ? t("game.summaryStrong")
                        : summaryTone === "mixed"
                          ? t("game.summaryMixed")
                          : t("game.summaryPoor")}
                    </p>
                  </div>

                  <span className="rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 font-mono text-[0.68rem] uppercase tracking-[0.22em] text-zinc-300">
                    {modeChip}
                  </span>
                </div>

                <div className="mt-8">{renderMetrics(false)}</div>

                <p className="mt-8 max-w-3xl text-sm leading-8 text-zinc-300 sm:text-[0.98rem]">
                  {summaryNarrative}
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={handleReplay}
                    className="inline-flex items-center justify-center rounded-full border border-[rgb(140_127_224/0.28)] bg-[rgb(95_98_184/0.14)] px-4 py-2 font-mono text-[0.78rem] uppercase tracking-[0.18em] text-zinc-100 transition-colors hover:bg-[rgb(95_98_184/0.24)]"
                  >
                    {t("game.replay")}
                  </button>
                  <Link
                    href="/"
                    className="inline-flex items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.03] px-4 py-2 font-mono text-[0.78rem] uppercase tracking-[0.18em] text-zinc-300 transition-colors hover:border-[rgb(95_98_184/0.28)] hover:text-white"
                  >
                    {t("game.backHome")}
                  </Link>
                </div>
                </motion.div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </motion.div>
      </section>
    </main>
  );
}
