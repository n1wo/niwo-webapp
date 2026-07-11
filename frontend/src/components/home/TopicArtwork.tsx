import type { JSX } from "react";
import styles from "./TopicArtwork.module.css";

export type TopicArtworkType =
  | "aiDevSecOps"
  | "agenticEngineering"
  | "incidentResponse"
  | "webAppSecurity"
  | "secureDevelopment"
  | "pentestPreparation";

function PipelineArtwork(): JSX.Element {
  return (
    <svg
      className={styles.svg}
      viewBox="0 0 640 320"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
      focusable="false"
    >
      <path className={styles.guide} d="M48 82H592M48 238H592" />
      <path className={styles.connection} d="M88 160H552" pathLength="100" />
      <path
        className={`${styles.motionPath} ${styles.pipelineMotion}`}
        d="M88 160H552"
        pathLength="100"
      />

      <path className={styles.connectionDim} d="M88 184V220M204 184V220M320 184V220M436 184V220M552 184V220" />
      <circle className={styles.evidenceMarker} cx="88" cy="220" r="3" />
      <rect className={styles.evidenceMarker} x="201" y="217" width="6" height="6" rx="1" />
      <path className={styles.evidenceMarker} d="M320 216l4 4-4 4-4-4z" />
      <circle className={styles.evidenceMarker} cx="436" cy="220" r="3" />
      <rect className={styles.evidenceMarker} x="549" y="217" width="6" height="6" rx="1" />

      <g>
        <circle className={styles.nodeOutline} cx="88" cy="160" r="25" />
        <circle className={`${styles.stageSignal} ${styles.stageOne}`} cx="88" cy="160" r="7" />
        <path className={styles.nodeDetail} d="M88 124v11M88 185v11M52 160h11M113 160h11" />
      </g>

      <g>
        <rect className={styles.nodeOutline} x="178" y="134" width="52" height="52" rx="9" />
        <path className={styles.nodeDetail} d="M192 153l-7 7 7 7M216 153l7 7-7 7" />
        <circle className={`${styles.stageSignal} ${styles.stageTwo}`} cx="204" cy="160" r="4" />
      </g>

      <g>
        <path className={styles.nodeAccent} d="M320 130l30 30-30 30-30-30z" />
        <path className={styles.nodeDetail} d="M307 160l9 9 18-19" />
        <circle className={`${styles.stageSignal} ${styles.stageThree}`} cx="320" cy="160" r="4" />
      </g>

      <g>
        <circle className={styles.nodeOutline} cx="436" cy="160" r="25" />
        <path className={styles.nodeDetail} d="M424 172l24-24M430 148h18v18" />
        <circle className={`${styles.stageSignal} ${styles.stageFour}`} cx="436" cy="160" r="4" />
      </g>

      <g>
        <circle className={styles.nodeOutline} cx="552" cy="160" r="27" />
        <circle className={styles.nodeDetailRing} cx="552" cy="160" r="16" />
        <circle className={`${styles.stageSignal} ${styles.stageFive}`} cx="552" cy="160" r="5" />
      </g>
    </svg>
  );
}

function AgenticArtwork(): JSX.Element {
  return (
    <svg
      className={styles.svg}
      viewBox="0 0 640 320"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
      focusable="false"
    >
      <rect className={styles.boundary} x="366" y="38" width="216" height="244" rx="34" />
      <path className={styles.connection} d="M151 160H276" />
      <path className={styles.connection} d="M344 160C395 160 414 82 488 82" />
      <path className={styles.connection} d="M344 160H504" />
      <path className={styles.connection} d="M344 160C395 160 414 238 488 238" />

      <path
        className={`${styles.motionPath} ${styles.agentFlowOne}`}
        d="M151 160H276"
        pathLength="100"
      />
      <path
        className={`${styles.motionPath} ${styles.agentFlowTwo}`}
        d="M344 160C395 160 414 82 488 82"
        pathLength="100"
      />
      <path
        className={`${styles.motionPath} ${styles.agentFlowThree}`}
        d="M344 160H504"
        pathLength="100"
      />
      <path
        className={`${styles.motionPath} ${styles.agentFlowFour}`}
        d="M344 160C395 160 414 238 488 238"
        pathLength="100"
      />

      <circle className={styles.nodeAccent} cx="116" cy="160" r="35" />
      <circle className={styles.nodeOutline} cx="116" cy="160" r="18" />
      <circle className={styles.nodeSolid} cx="116" cy="160" r="5" />
      <circle className={styles.evidenceMarker} cx="82" cy="116" r="4" />
      <circle className={styles.evidenceMarker} cx="82" cy="204" r="4" />
      <path className={styles.connectionDim} d="M85 119l17 23M85 201l17-23" />

      <circle className={styles.approvalHalo} cx="310" cy="160" r="48" />
      <path className={styles.nodeAccent} d="M310 126l34 34-34 34-34-34z" />
      <path className={styles.approvalCheck} d="M292 160l12 12 25-27" />

      <rect className={styles.nodeOutline} x="488" y="58" width="48" height="48" rx="10" />
      <path className={styles.nodeDetail} d="M501 82h22M512 71v22" />
      <circle className={styles.nodeOutline} cx="528" cy="160" r="25" />
      <path className={styles.nodeDetail} d="M516 160h24M528 148v24" />
      <path className={styles.nodeOutline} d="M512 212l27 26-27 26-27-26z" />
      <circle className={styles.nodeSolid} cx="512" cy="238" r="5" />

      <path className={styles.observationLine} d="M78 270H330" />
      <circle className={styles.observationMarker} cx="92" cy="270" r="4" />
      <rect className={styles.observationMarker} x="168" y="266" width="8" height="8" rx="1" />
      <path className={styles.observationMarker} d="M252 265l5 5-5 5-5-5z" />
      <circle className={styles.observationMarker} cx="326" cy="270" r="4" />
    </svg>
  );
}

function IncidentArtwork(): JSX.Element {
  return (
    <svg
      className={styles.svg}
      viewBox="0 0 640 320"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
      focusable="false"
    >
      <rect className={styles.containmentBoundary} x="74" y="32" width="356" height="216" rx="28" />
      <path className={styles.containmentBarrier} d="M392 52V228" />

      <circle className={`${styles.detectionRing} ${styles.detectionRingOne}`} cx="230" cy="137" r="38" />
      <circle className={`${styles.detectionRing} ${styles.detectionRingTwo}`} cx="230" cy="137" r="68" />
      <circle className={`${styles.detectionRing} ${styles.detectionRingThree}`} cx="230" cy="137" r="98" />
      <path className={styles.nodeAccent} d="M230 116l21 21-21 21-21-21z" />
      <circle className={styles.incidentCore} cx="230" cy="137" r="6" />

      <rect className={`${styles.evidenceMarker} ${styles.evidenceOne}`} x="108" y="76" width="9" height="9" rx="1" />
      <path className={`${styles.evidenceMarker} ${styles.evidenceTwo}`} d="M329 52l6 6-6 6-6-6z" />
      <circle className={`${styles.evidenceMarker} ${styles.evidenceThree}`} cx="334" cy="214" r="5" />
      <path className={styles.connectionDim} d="M117 83l40 22M323 63l-32 28M329 209l-34-24" />

      <path className={styles.connection} d="M252 137H392C442 137 452 104 500 104" />
      <path className={styles.connection} d="M392 137C444 137 458 184 510 184" />
      <path
        className={`${styles.motionPath} ${styles.responseMotion}`}
        d="M252 137H392C442 137 452 104 500 104"
        pathLength="100"
      />
      <rect className={styles.nodeOutline} x="500" y="80" width="48" height="48" rx="12" />
      <path className={styles.approvalCheck} d="M511 104l9 9 18-20" />
      <circle className={styles.nodeOutline} cx="534" cy="184" r="23" />
      <path className={styles.nodeDetail} d="M522 184h24M534 172v24" />

      <path className={styles.timeline} d="M72 278H576" pathLength="100" />
      <path
        className={`${styles.motionPath} ${styles.timelineMotion}`}
        d="M72 278H576"
        pathLength="100"
      />
      <circle className={styles.timelineMarker} cx="96" cy="278" r="5" />
      <rect className={styles.timelineMarker} x="222" y="273" width="10" height="10" rx="2" />
      <path className={styles.timelineMarker} d="M360 271l7 7-7 7-7-7z" />
      <circle className={styles.timelineMarker} cx="514" cy="278" r="5" />
    </svg>
  );
}

export default function TopicArtwork({ type }: { type: TopicArtworkType }): JSX.Element {
  return (
    <div className={styles.root} aria-hidden="true">
      {type === "aiDevSecOps" ? <PipelineArtwork /> : null}
      {type === "agenticEngineering" ? <AgenticArtwork /> : null}
      {type === "incidentResponse" ? <IncidentArtwork /> : null}
    </div>
  );
}
