"use client";

import type { JSX } from "react";
import { useEffect, useRef } from "react";
import styles from "./LivingTrustGraph.module.css";
import {
  VIEW_BOX,
  scanRoutePath,
  trustBoundaryPath,
  trustBoundaryTicks,
  trustGraphEdges,
  trustGraphFlows,
  trustGraphLabels,
  trustGraphNodes,
  type TrustGraphFlow,
  type TrustGraphNode,
} from "./trustGraphData";

const FLOW_CLASS: Record<TrustGraphFlow["variant"], string> = {
  a: styles.flowA,
  b: styles.flowB,
  c: styles.flowC,
};

function classNames(...names: (string | false | undefined)[]): string {
  return names.filter(Boolean).join(" ");
}

function GraphNode({ node }: { node: TrustGraphNode }): JSX.Element {
  const cls = classNames(
    node.shape === "diamond" ? styles.nodeDiamond : node.accent ? styles.nodeAccent : styles.node,
    node.detail && styles.detail,
  );

  if (node.shape === "circle") {
    return <circle cx={node.x} cy={node.y} r={node.size / 2} className={cls} />;
  }
  return (
    <rect
      x={node.x - node.size / 2}
      y={node.y - node.size / 2}
      width={node.size}
      height={node.size}
      className={cls}
      transform={node.shape === "diamond" ? `rotate(45 ${node.x} ${node.y})` : undefined}
    />
  );
}

function GraphLayer({ withLabels = false }: { withLabels?: boolean }): JSX.Element {
  return (
    <svg
      className={styles.svg}
      viewBox={VIEW_BOX}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      focusable="false"
    >
      <path className={styles.boundary} d={trustBoundaryPath} />
      {trustBoundaryTicks.map((d) => (
        <path key={d} className={styles.tick} d={d} />
      ))}
      {trustGraphEdges.map((edge) => (
        <path
          key={edge.id}
          className={classNames(
            styles.edge,
            edge.dashed && styles.dashed,
            edge.breath && styles.breath,
            edge.breathAlt && styles.breathAlt,
            edge.detail && styles.detail,
          )}
          d={edge.d}
        />
      ))}
      {trustGraphNodes.map((node) => (
        <GraphNode key={node.id} node={node} />
      ))}
      {!withLabels && (
        <>
          <path className={styles.perimeter} d={trustBoundaryPath} pathLength={100} />
          {trustGraphFlows.map((flow) => (
            <path
              key={flow.id}
              className={classNames(styles.flow, FLOW_CLASS[flow.variant])}
              d={flow.d}
              pathLength={100}
            />
          ))}
          <path className={styles.scan} d={scanRoutePath} pathLength={100} />
        </>
      )}
      {withLabels &&
        trustGraphLabels.map((label) => (
          <text
            key={label.text}
            x={label.x}
            y={label.y}
            className={classNames(
              styles.label,
              label.accent && styles.labelAccent,
              label.detail && styles.detail,
            )}
          >
            {label.text}
          </text>
        ))}
    </svg>
  );
}

export default function LivingTrustGraph(): JSX.Element {
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const hero = root.closest("header") ?? root.parentElement;
    if (!hero) return;

    let frame = 0;
    let pointerX = 0;
    let pointerY = 0;

    const applyPosition = () => {
      frame = 0;
      root.style.setProperty("--gx", `${pointerX}px`);
      root.style.setProperty("--gy", `${pointerY}px`);
    };

    const handleMove = (event: PointerEvent) => {
      const rect = root.getBoundingClientRect();
      pointerX = event.clientX - rect.left;
      pointerY = event.clientY - rect.top;
      root.style.setProperty("--inspect-o", "1");
      if (!frame) frame = requestAnimationFrame(applyPosition);
    };

    const handleLeave = () => {
      root.style.setProperty("--inspect-o", "0");
    };

    hero.addEventListener("pointermove", handleMove);
    hero.addEventListener("pointerleave", handleLeave);

    return () => {
      hero.removeEventListener("pointermove", handleMove);
      hero.removeEventListener("pointerleave", handleLeave);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div ref={rootRef} className={styles.root} aria-hidden="true">
      <GraphLayer />
      <div className={styles.inspect}>
        <GraphLayer withLabels />
      </div>
    </div>
  );
}
