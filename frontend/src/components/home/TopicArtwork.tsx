import type { JSX } from "react";
import type { TopicArticleKey } from "@/data/topicArticles";
import styles from "./TopicArtwork.module.css";

export type TopicArtworkType = TopicArticleKey;

function PipelineArtwork(): JSX.Element {
  return (
    <svg
      className={styles.svg}
      viewBox="0 0 640 320"
      width="640"
      height="320"
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
      width="640"
      height="320"
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
      width="640"
      height="320"
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

function WebAppSecurityArtwork(): JSX.Element {
  return (
    <svg
      className={styles.svg}
      viewBox="0 0 640 320"
      width="640"
      height="320"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
      focusable="false"
    >
      <path className={styles.guide} d="M34 58H606M34 262H606" />
      <rect className={styles.trustBoundary} x="188" y="44" width="278" height="232" rx="30" />
      <rect className={styles.dataBoundary} x="494" y="92" width="112" height="136" rx="26" />

      <path className={styles.connection} d="M166 160H550" />
      <path
        className={`${styles.motionPath} ${styles.requestFlow}`}
        d="M166 160H550"
        pathLength="100"
      />
      <path className={styles.connectionDim} d="M326 184C326 224 380 238 437 238" />
      <circle className={styles.nodeOutline} cx="437" cy="238" r="7" />
      <path className={styles.nodeDetail} d="M433 234l8 8M441 234l-8 8" />
      <path className={styles.containmentStop} d="M446 218V258" />

      <rect className={styles.nodeOutline} x="44" y="104" width="122" height="112" rx="14" />
      <path className={styles.nodeDetail} d="M44 130H166M62 151h84M62 174h58M62 197h72" />
      <circle className={styles.evidenceMarker} cx="62" cy="117" r="3" />
      <circle className={styles.evidenceMarker} cx="74" cy="117" r="3" />
      <circle className={styles.evidenceMarker} cx="86" cy="117" r="3" />

      <circle className={styles.nodeOutline} cx="238" cy="160" r="24" />
      <circle className={styles.nodeDetailRing} cx="238" cy="151" r="6" />
      <path className={styles.nodeDetail} d="M226 173c3-8 21-8 24 0" />
      <circle className={`${styles.webControlSignal} ${styles.webControlOne}`} cx="238" cy="160" r="3" />

      <path className={styles.nodeAccent} d="M326 132l28 28-28 28-28-28z" />
      <path className={styles.nodeDetail} d="M314 160l8 8 17-18" />
      <circle className={`${styles.webControlSignal} ${styles.webControlTwo}`} cx="326" cy="160" r="3" />

      <rect className={styles.nodeOutline} x="388" y="136" width="52" height="48" rx="10" />
      <path className={styles.nodeDetail} d="M400 151h28M400 160h18M400 169h24" />
      <circle className={`${styles.webControlSignal} ${styles.webControlThree}`} cx="414" cy="160" r="3" />
      <path className={styles.connectionDim} d="M414 136V112M414 184V208" />
      <rect className={styles.evidenceMarker} x="410" y="104" width="8" height="8" rx="1" />
      <circle className={styles.evidenceMarker} cx="414" cy="214" r="4" />

      <circle className={styles.nodeOutline} cx="550" cy="160" r="28" />
      <ellipse className={styles.nodeDetailRing} cx="550" cy="151" rx="16" ry="7" />
      <path className={styles.nodeDetail} d="M534 151v18c0 4 7 7 16 7s16-3 16-7v-18" />
    </svg>
  );
}

function SecureDevelopmentArtwork(): JSX.Element {
  const lifecyclePath =
    "M112 160C112 86 202 52 320 52C438 52 528 86 528 160C528 234 438 268 320 268C202 268 112 234 112 160Z";

  return (
    <svg
      className={styles.svg}
      viewBox="0 0 640 320"
      width="640"
      height="320"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
      focusable="false"
    >
      <path className={styles.guide} d="M42 34H598M42 286H598" />
      <path className={styles.lifecyclePath} d={lifecyclePath} />
      <path
        className={`${styles.motionPath} ${styles.lifecycleMotion}`}
        d={lifecyclePath}
        pathLength="100"
      />
      <path className={styles.feedbackPath} d="M450 246C384 300 172 296 112 176" />
      <circle className={styles.evidenceMarker} cx="374" cy="276" r="4" />
      <path className={styles.evidenceMarker} d="M202 274l5 5-5 5-5-5z" />

      <circle className={styles.nodeOutline} cx="112" cy="160" r="24" />
      <path className={styles.nodeDetail} d="M100 160h24M112 148v24" />
      <circle className={`${styles.lifecycleSignal} ${styles.signalOne}`} cx="112" cy="160" r="3" />

      <rect className={styles.nodeOutline} x="140" y="62" width="52" height="52" rx="10" />
      <path className={styles.nodeDetail} d="M153 88h26M153 78h17M153 98h21" />
      <circle className={`${styles.lifecycleSignal} ${styles.signalTwo}`} cx="166" cy="88" r="3" />

      <path className={styles.nodeAccent} d="M268 30l24 24-24 24-24-24z" />
      <path className={styles.nodeDetail} d="M256 54l8 8 17-18" />
      <circle className={`${styles.lifecycleSignal} ${styles.signalThree}`} cx="268" cy="54" r="3" />

      <circle className={styles.nodeOutline} cx="386" cy="64" r="23" />
      <path className={styles.nodeDetail} d="M374 64h24M386 52v24" />
      <circle className={`${styles.lifecycleSignal} ${styles.signalFour}`} cx="386" cy="64" r="3" />

      <rect className={styles.nodeOutline} x="456" y="78" width="52" height="52" rx="10" />
      <path className={styles.nodeDetail} d="M469 104l8 8 18-20" />
      <circle className={`${styles.lifecycleSignal} ${styles.signalFive}`} cx="482" cy="104" r="3" />

      <path className={styles.nodeAccent} d="M528 154l26 26-26 26-26-26z" />
      <path className={styles.nodeDetail} d="M516 180h24M528 168v24" />
      <circle className={`${styles.lifecycleSignal} ${styles.signalSix}`} cx="528" cy="180" r="3" />

      <circle className={styles.nodeOutline} cx="450" cy="246" r="24" />
      <circle className={styles.nodeDetailRing} cx="450" cy="246" r="13" />
      <circle className={`${styles.lifecycleSignal} ${styles.signalSeven}`} cx="450" cy="246" r="3" />

      <rect className={styles.nodeOutline} x="256" y="240" width="52" height="48" rx="10" />
      <path className={styles.nodeDetail} d="M268 264h28M282 252v24" />
      <circle className={`${styles.lifecycleSignal} ${styles.signalEight}`} cx="282" cy="264" r="3" />
    </svg>
  );
}

function PentestPreparationArtwork(): JSX.Element {
  const testPath =
    "M54 156H112C146 156 154 106 194 106C236 106 238 156 278 156C322 156 320 208 362 208C410 208 426 156 474 156H570";

  return (
    <svg
      className={styles.svg}
      viewBox="0 0 640 320"
      width="640"
      height="320"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
      focusable="false"
    >
      <rect className={styles.scopeBoundary} x="112" y="54" width="330" height="202" rx="30" />
      <path className={styles.connection} d={testPath} />
      <path
        className={`${styles.motionPath} ${styles.authorizedTestFlow}`}
        d={testPath}
        pathLength="100"
      />

      <circle className={styles.nodeOutline} cx="54" cy="156" r="24" />
      <path className={styles.nodeDetail} d="M43 156h22M54 145v22" />

      <circle className={styles.approvalHalo} cx="112" cy="156" r="44" />
      <path className={styles.nodeAccent} d="M112 130l26 26-26 26-26-26z" />
      <path className={styles.nodeDetail} d="M100 156l8 8 17-18" />

      <rect className={styles.nodeOutline} x="170" y="82" width="48" height="48" rx="10" />
      <path className={styles.nodeDetail} d="M182 106h24M194 94v24" />
      <circle className={`${styles.checkpointSignal} ${styles.checkpointOne}`} cx="194" cy="106" r="3" />

      <circle className={styles.nodeOutline} cx="278" cy="156" r="24" />
      <circle className={styles.nodeDetailRing} cx="278" cy="156" r="13" />
      <circle className={`${styles.checkpointSignal} ${styles.checkpointTwo}`} cx="278" cy="156" r="3" />

      <path className={styles.nodeAccent} d="M362 182l26 26-26 26-26-26z" />
      <path className={styles.nodeDetail} d="M350 208l8 8 17-18" />
      <circle className={`${styles.checkpointSignal} ${styles.checkpointThree}`} cx="362" cy="208" r="3" />

      <rect className={styles.nodeOutline} x="458" y="126" width="64" height="60" rx="10" />
      <path className={styles.nodeDetail} d="M472 143h36M472 155h27M472 167h31" />
      <circle className={styles.reportSignal} cx="508" cy="167" r="3" />

      <circle className={styles.nodeOutline} cx="570" cy="156" r="25" />
      <circle className={styles.nodeDetailRing} cx="570" cy="156" r="14" />
      <path className={styles.nodeDetail} d="M559 156h22M570 145v22" />

      <circle className={styles.scopeExcluded} cx="510" cy="76" r="18" />
      <rect className={styles.scopeExcluded} x="492" y="218" width="36" height="36" rx="8" />

      <path className={styles.testWindow} d="M78 286H568" />
      <path className={styles.testWindowActive} d="M166 286H424" />
      <path className={styles.connectionDim} d="M166 276V296M424 276V296" />
      <circle className={styles.timelineMarker} cx="166" cy="286" r="5" />
      <circle className={styles.timelineMarker} cx="424" cy="286" r="5" />
    </svg>
  );
}

const artworkByType: Record<TopicArtworkType, () => JSX.Element> = {
  aiDevSecOps: PipelineArtwork,
  agenticEngineering: AgenticArtwork,
  incidentResponse: IncidentArtwork,
  webAppSecurity: WebAppSecurityArtwork,
  secureDevelopment: SecureDevelopmentArtwork,
  pentestPreparation: PentestPreparationArtwork,
};

export default function TopicArtwork({ type }: { type: TopicArtworkType }): JSX.Element {
  const Artwork = artworkByType[type];

  return (
    <div className={styles.root} data-topic-artwork={type} aria-hidden="true">
      <Artwork />
    </div>
  );
}
