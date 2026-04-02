"use client";

import type { JSX, KeyboardEvent, ReactNode } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import NextLink from "next/link";
import { Link, useRouter } from "@/i18n/navigation";

type TerminalCopy = {
  label: string;
  complete: string;
  lines: {
    command: string;
    scanning: string;
    findings: string;
    severity: string;
    recommendation: string;
  };
};

type TerminalEntry = {
  text: string;
  tone: "muted" | "prompt" | "status" | "default";
  promptLine?: "top" | "bottom";
};

type InteractiveTerminalProps = {
  copy: TerminalCopy;
};

const PROMPT = "root@niwo";
const HOME_PATH = "~";
const KALI_GREEN = "#5fbf76";

const PAGE_TARGETS: Record<string, string> = {
  "/": "/",
  "~": "/",
  home: "/",
  services: "/#what-i-do",
  about: "/pages/about",
  vdp: "/pages/vdp",
  privacy: "/pages/privacy-policy",
  "privacy-policy": "/pages/privacy-policy",
  imprint: "/pages/imprint",
  contact: "mailto:info@niwosystems.com",
};

export default function InteractiveTerminal({
  copy,
}: InteractiveTerminalProps): JSX.Element {
  const router = useRouter();
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [command, setCommand] = useState("");
  const [historyIndex, setHistoryIndex] = useState<number | null>(null);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [entries, setEntries] = useState<TerminalEntry[]>([
    { text: "interactive mode enabled. type 'help' to explore.", tone: "muted" },
  ]);

  const helpLines = useMemo(
    () => [
      "available commands:",
      "help",
      "whoami",
      "hostname",
      "pwd",
      "ls",
      "cd home",
      "cd services",
      "cd about",
      "cd vdp",
      "cd privacy-policy",
      "cd imprint",
      "cd contact",
      "cat findings.txt",
      "scan",
      "contact",
      "clear",
    ],
    [],
  );

  const menuLinks = useMemo(
    () => [
      { label: "Session", href: "/#what-i-do", external: false },
      { label: "Actions", href: "mailto:info@niwosystems.com", external: true },
      { label: "Edit", href: "/pages/about", external: false },
      { label: "View", href: "/#what-i-do", external: false },
      { label: "Help", href: "/pages/vdp", external: false },
    ],
    [],
  );

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [entries]);

  const focusInput = () => {
    inputRef.current?.focus();
  };

  const appendEntries = (nextEntries: TerminalEntry[]) => {
    setEntries((prev) => [...prev, ...nextEntries]);
  };

  const navigateToTarget = (target: string) => {
    if (target.startsWith("mailto:")) {
      window.location.href = target;
      return;
    }

    router.push(target);
  };

  const renderPromptLine = (line: "top" | "bottom", value?: string): ReactNode => {
    if (line === "top") {
      return (
        <span className="font-mono">
          <span style={{ color: KALI_GREEN }}>{`┌──(`}</span>
          <span className="text-[var(--color-accent-light)]">{PROMPT}</span>
          <span style={{ color: KALI_GREEN }}>{`)-[`}</span>
          <span className="text-white">{HOME_PATH}</span>
          <span style={{ color: KALI_GREEN }}>]</span>
        </span>
      );
    }

    return (
      <span className="font-mono">
        <span style={{ color: KALI_GREEN }}>{`└─`}</span>
        <span className="ml-2 text-[var(--color-accent-light)]">$</span>
        {value ? <span className="ml-2 text-zinc-100">{value}</span> : null}
      </span>
    );
  };

  const executeCommand = (rawCommand: string) => {
    const nextEntries: TerminalEntry[] = [
      { text: "", tone: "prompt", promptLine: "top" },
      { text: rawCommand, tone: "prompt", promptLine: "bottom" },
    ];
    const trimmed = rawCommand.trim();

    if (!trimmed) {
      appendEntries(nextEntries);
      return;
    }

    const normalized = trimmed.toLowerCase();

    if (normalized === "clear") {
      setEntries([]);
      return;
    }

    if (normalized === "help") {
      appendEntries([
        ...nextEntries,
        ...helpLines.map((line) => ({ text: line, tone: "default" as const })),
      ]);
      return;
    }

    if (normalized === "whoami") {
      appendEntries([...nextEntries, { text: "root", tone: "default" }]);
      return;
    }

    if (normalized === "hostname") {
      appendEntries([...nextEntries, { text: "niwo", tone: "default" }]);
      return;
    }

    if (normalized === "pwd") {
      appendEntries([...nextEntries, { text: HOME_PATH, tone: "default" }]);
      return;
    }

    if (normalized === "ls") {
      appendEntries([
        ...nextEntries,
        {
          text: "home  services  about  vdp  privacy-policy  imprint  contact  findings.txt",
          tone: "default",
        },
      ]);
      return;
    }

    if (normalized === "cat findings.txt") {
      appendEntries([
        ...nextEntries,
        { text: copy.lines.findings, tone: "status" },
        { text: copy.lines.severity, tone: "status" },
        { text: copy.lines.recommendation, tone: "status" },
      ]);
      return;
    }

    if (
      normalized === "scan" ||
      normalized === "./security_scan --target webapp && cat findings.txt"
    ) {
      appendEntries([
        ...nextEntries,
        { text: copy.lines.scanning, tone: "prompt" },
        { text: copy.lines.findings, tone: "status" },
        { text: copy.lines.severity, tone: "status" },
        { text: copy.lines.recommendation, tone: "status" },
      ]);
      return;
    }

    if (normalized === "contact") {
      appendEntries([...nextEntries, { text: "info@niwosystems.com", tone: "default" }]);
      return;
    }

    if (normalized.startsWith("cd ")) {
      const destination = normalized.slice(3).trim().replace(/^\/+/, "");
      const resolvedTarget =
        PAGE_TARGETS[destination] ??
        PAGE_TARGETS[`/${destination}`] ??
        (destination === ".." ? "/" : undefined);

      if (!resolvedTarget) {
        appendEntries([
          ...nextEntries,
          { text: `zsh: no such file or directory: ${destination}`, tone: "muted" },
        ]);
        return;
      }

      appendEntries([
        ...nextEntries,
        { text: `navigating to ${destination || "home"}...`, tone: "muted" },
      ]);
      window.setTimeout(() => navigateToTarget(resolvedTarget), 160);
      return;
    }

    appendEntries([
      ...nextEntries,
      { text: `zsh: command not found: ${trimmed}`, tone: "muted" },
    ]);
  };

  const submitCommand = () => {
    const nextCommand = command;
    if (nextCommand.trim()) {
      setCommandHistory((prev) => [...prev, nextCommand]);
    }
    executeCommand(nextCommand);
    setCommand("");
    setHistoryIndex(null);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      submitCommand();
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      if (commandHistory.length === 0) return;
      const nextIndex =
        historyIndex === null ? commandHistory.length - 1 : Math.max(historyIndex - 1, 0);
      setHistoryIndex(nextIndex);
      setCommand(commandHistory[nextIndex] ?? "");
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (commandHistory.length === 0 || historyIndex === null) return;

      const nextIndex = historyIndex + 1;
      if (nextIndex >= commandHistory.length) {
        setHistoryIndex(null);
        setCommand("");
        return;
      }

      setHistoryIndex(nextIndex);
      setCommand(commandHistory[nextIndex] ?? "");
    }
  };

  const entryToneClass = (tone: TerminalEntry["tone"]) => {
    if (tone === "prompt") return "text-[var(--color-accent-light)]";
    if (tone === "status") return "text-zinc-100";
    if (tone === "muted") return "text-zinc-300";
    return "text-zinc-100";
  };

  return (
    <div
      className="overflow-hidden rounded-[1.05rem] border border-white/[0.08] bg-[#111113] shadow-[0_20px_56px_rgb(0_0_0/0.42)]"
      onClick={focusInput}
    >
      <div className="relative flex items-center justify-between border-b border-white/[0.06] bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.01)),#17171c] px-4 py-2 text-[0.72rem] text-zinc-200">
        <div className="text-[var(--color-accent-light)]">⌂</div>
        <span className="absolute left-1/2 -translate-x-1/2 font-mono font-semibold text-zinc-100">
          {copy.label}
        </span>
        <div className="flex items-center gap-1.5">
          <span className="h-4 w-4 rounded-full border border-white/[0.08] bg-[#22222a]" />
          <span className="h-4 w-4 rounded-full border border-white/[0.08] bg-[#22222a]" />
          <Link
            href="/terminal-closed"
            aria-label="Close terminal"
            className="flex h-4 w-4 items-center justify-center rounded-full border border-white/[0.08] bg-[#303445] text-[0.7rem] leading-none text-[var(--color-accent-light)] transition-colors hover:bg-[#3a4157] hover:text-white"
          >
            ×
          </Link>
        </div>
      </div>

      <div className="border-b border-white/[0.06] bg-[#151519] px-4 py-2">
        <div className="flex items-center gap-5 font-mono text-[0.92rem] text-zinc-100">
          {menuLinks.map((item) =>
            item.external ? (
              <NextLink
                key={item.label}
                href={item.href}
                className="transition-colors duration-150 hover:text-[var(--color-accent-light)]"
              >
                {item.label}
              </NextLink>
            ) : (
              <Link
                key={item.label}
                href={item.href}
                className="transition-colors duration-150 hover:text-[var(--color-accent-light)]"
              >
                {item.label}
              </Link>
            ),
          )}
        </div>
      </div>

      <div
        ref={scrollRef}
        className="terminal-scrollbar min-h-[12.5rem] max-h-[18rem] overflow-y-auto bg-[#111113] p-5 font-mono text-sm leading-7 text-zinc-100 [scrollbar-color:rgba(95,98,184,0.45)_#151519] [scrollbar-width:thin] sm:min-h-[13.25rem] sm:text-[0.95rem]"
        style={{
          scrollbarGutter: "stable",
        }}
      >
        <div className="space-y-1.5">
          {entries.map((entry, index) => (
            <p
              key={`${entry.text}-${entry.promptLine ?? "text"}-${index}`}
              className={entryToneClass(entry.tone)}
            >
              {entry.promptLine ? renderPromptLine(entry.promptLine, entry.text) : entry.text}
            </p>
          ))}

          <div className="space-y-0.5">
            <p>{renderPromptLine("top")}</p>
            <div className="flex items-center gap-2">
              <span style={{ color: KALI_GREEN }}>{`└─`}</span>
              <span className="text-[var(--color-accent-light)]">$</span>
              <input
                ref={inputRef}
                value={command}
                onChange={(event) => setCommand(event.target.value)}
                onKeyDown={handleKeyDown}
                spellCheck={false}
                autoCapitalize="off"
                autoCorrect="off"
                className="min-w-0 flex-1 border-0 bg-transparent font-mono text-zinc-100 outline-none placeholder:text-zinc-500"
                placeholder="help"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
