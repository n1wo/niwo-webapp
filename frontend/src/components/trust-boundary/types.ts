export type MessageAction = "allow" | "quarantine";

export type PrototypeMode = "office" | "desk" | "incident" | "summary";

export type SummaryTone = "strong" | "mixed" | "poor";

export type IncidentChoice =
  | "reset-password"
  | "disable-account"
  | "check-mailbox-rules"
  | "ignore";

export type DayOneMessage = {
  id: string;
  category: string;
  sender: string;
  subject: string;
  preview: string;
  visibleClues: string[];
  investigateClues: string[];
  bestAction: MessageAction;
  allowFeedback: string;
  quarantineFeedback: string;
  incidentTrigger?: boolean;
};

export type DecisionRecord = {
  messageId: string;
  action: MessageAction;
  investigated: boolean;
};

export type MetricScores = {
  trust: number;
  continuity: number;
  judgment: number;
};

export type IncidentOption = {
  id: IncidentChoice;
  label: string;
  description: string;
};
