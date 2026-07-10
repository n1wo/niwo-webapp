export type TrustGraphNodeShape = "square" | "circle" | "diamond";

export type TrustGraphNode = {
  id: string;
  x: number;
  y: number;
  shape: TrustGraphNodeShape;
  size: number;
  accent?: boolean;
  detail?: boolean;
};

export type TrustGraphEdge = {
  id: string;
  d: string;
  dashed?: boolean;
  breath?: boolean;
  breathAlt?: boolean;
  detail?: boolean;
};

export type TrustGraphFlow = {
  id: string;
  d: string;
  variant: "a" | "b" | "c";
};

export type TrustGraphLabel = {
  text: string;
  x: number;
  y: number;
  accent?: boolean;
  detail?: boolean;
};

export const VIEW_BOX = "0 0 1200 800";

/*
 * Coordinates are normalized to the 1200x800 viewBox and rendered with
 * preserveAspectRatio="slice", so narrow viewports crop to the center
 * column (roughly x 440-760). Everything essential — the trust boundary,
 * application cluster, and scan spine — lives inside that column; the
 * identity and dependency clusters extend outward for wide screens.
 */

export const trustGraphNodes: TrustGraphNode[] = [
  { id: "user", x: 110, y: 230, shape: "circle", size: 10 },
  { id: "partner", x: 110, y: 380, shape: "circle", size: 10 },
  { id: "ext-input", x: 150, y: 610, shape: "square", size: 10 },
  { id: "gateway", x: 300, y: 300, shape: "square", size: 12 },
  { id: "app-core", x: 560, y: 250, shape: "square", size: 14, accent: true },
  { id: "auth", x: 480, y: 340, shape: "square", size: 9 },
  { id: "api", x: 650, y: 340, shape: "square", size: 9 },
  { id: "data", x: 600, y: 480, shape: "square", size: 11 },
  { id: "log", x: 700, y: 480, shape: "square", size: 7, detail: true },
  { id: "review", x: 640, y: 110, shape: "diamond", size: 13, accent: true },
  { id: "repo", x: 900, y: 200, shape: "square", size: 11 },
  { id: "dep-1", x: 1020, y: 300, shape: "square", size: 7, detail: true },
  { id: "dep-2", x: 1080, y: 380, shape: "square", size: 7, detail: true },
  { id: "dep-3", x: 990, y: 450, shape: "square", size: 7 },
  { id: "ci", x: 900, y: 560, shape: "square", size: 9 },
  { id: "host", x: 560, y: 660, shape: "square", size: 9 },
  { id: "dns", x: 260, y: 660, shape: "square", size: 7, detail: true },
];

/*
 * Every edge endpoint sits exactly on a node border (node center ± size/2;
 * the review diamond's vertices are at center ± size/√2). Interior waypoints
 * are free. Keep this invariant when editing — a stray coordinate reads as a
 * gap between the line and its node.
 */
export const trustGraphEdges: TrustGraphEdge[] = [
  { id: "user-gateway", d: "M115 230 H240 V300 H294" },
  { id: "partner-gateway", d: "M115 380 H270 V304 H294" },
  { id: "ext-gateway", d: "M155 610 H300 V306", dashed: true },
  { id: "gateway-auth", d: "M306 300 H420 V340 H475.5", breathAlt: true },
  { id: "gateway-app", d: "M300 294 V250 H553" },
  { id: "auth-app", d: "M480 335.5 V300 H556 V257" },
  { id: "api-app", d: "M650 335.5 V250 H567" },
  { id: "app-data", d: "M560 257 V480 H594.5", breath: true },
  { id: "api-data", d: "M650 344.5 V420 H600 V474.5" },
  { id: "data-log", d: "M605.5 480 H696.5", detail: true },
  { id: "review-app", d: "M640 119.2 V180 H560 V243", breath: true },
  { id: "review-repo", d: "M649.2 110 H900 V194.5" },
  { id: "repo-api", d: "M900 205.5 V340 H654.5" },
  { id: "dep1-repo", d: "M1020 296.5 V200 H905.5", breathAlt: true },
  { id: "dep2-dep1", d: "M1080 376.5 V300 H1023.5", detail: true },
  // Intentionally stops short of the boundary: an unreviewed dependency.
  { id: "dep3-boundary", d: "M986.5 450 H770", dashed: true },
  { id: "ci-dep3", d: "M900 555.5 V450 H986.5" },
  { id: "data-host", d: "M600 485.5 V660 H564.5" },
  { id: "host-dns", d: "M555.5 660 H263.5", detail: true },
  { id: "ci-host", d: "M900 564.5 V672 H560 V664.5" },
];

export const trustBoundaryPath = "M450 150 H750 V560 H450 Z";

export const trustBoundaryTicks = [
  "M450 170 V150 H470",
  "M730 150 H750 V170",
  "M750 540 V560 H730",
  "M470 560 H450 V540",
];

export const scanRoutePath = "M640 119.2 V180 H560 V480 H600 V660 H564.5";

/*
 * Traffic pulses that ride existing edges: a request entering from an
 * identity, a dependency pull from the repo, and an API write to storage.
 * Staggered via per-variant delays so at most one or two move at a time.
 */
export const trustGraphFlows: TrustGraphFlow[] = [
  { id: "flow-user-app", d: "M115 230 H240 V300 H300 V250 H553", variant: "a" },
  { id: "flow-repo-api", d: "M900 205.5 V340 H654.5", variant: "b" },
  { id: "flow-api-data", d: "M650 344.5 V420 H600 V474.5", variant: "c" },
];

export const trustGraphLabels: TrustGraphLabel[] = [
  { text: "identity", x: 84, y: 206 },
  { text: "ingress", x: 272, y: 278 },
  { text: "app.core", x: 536, y: 230 },
  { text: "data", x: 616, y: 468 },
  { text: "review", x: 662, y: 102, accent: true },
  { text: "repo", x: 874, y: 180 },
  { text: "deps", x: 1006, y: 278, detail: true },
  { text: "infra", x: 582, y: 692 },
  { text: "trust_boundary", x: 458, y: 174, accent: true },
];
