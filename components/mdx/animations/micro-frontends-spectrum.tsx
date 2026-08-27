"use client";

import gsap from "gsap";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { useTranslations } from "next-intl";
import { useMemo } from "react";
import {
  ConceptAnimationFrame,
  type ConceptStep,
} from "@/components/mdx/concept-animation-frame";

gsap.registerPlugin(DrawSVGPlugin);

/**
 * The spectrum has one variable — when the pieces are joined — and every tool
 * on it is a different answer to that one question.
 */
const STEP_SEQUENCE = [
  { id: "axis", label: "step-1-axis" },
  { id: "never", label: "step-2-never" },
  { id: "build", label: "step-3-build" },
  { id: "server", label: "step-4-server" },
  { id: "browser", label: "step-5-browser" },
  { id: "tradeoff", label: "step-6-tradeoff" },
] as const;

/** One column per joining point, left to right in the order they happen. */
const COLUMNS = [
  { center: 101, id: "never", x: 22 },
  { center: 279, id: "build", x: 200 },
  { center: 457, id: "server", x: 378 },
  { center: 635, id: "browser", x: 556 },
] as const;

const TOOL_LINES = [1, 2, 3, 4] as const;

/** Lights one stop: its tick, the line down to its card, and the card. */
function revealColumn(
  tl: gsap.core.Timeline,
  q: gsap.utils.SelectorFunc,
  id: string
) {
  tl.to(q(`#node-tick-${id}`), { opacity: 1 });
  tl.to(q(`#edge-tick-${id}`), { drawSVG: "100%" }, "<");
  tl.to(q(`#node-col-${id}`), { opacity: 1 }, "<0.15");
}

export function buildTimeline(root: SVGSVGElement) {
  const q = gsap.utils.selector(root);
  const tl = gsap.timeline({
    defaults: { duration: 0.5, ease: "power2.out" },
    paused: true,
  });

  // Resting state. Idempotent, so `seek(0)` always lands back here.
  tl.set(q("[id^='node-']"), { opacity: 0.35 });
  tl.set(q("[id^='edge-']"), { drawSVG: "0% 0%", opacity: 1 });
  tl.set(q("[id^='label-']"), { autoAlpha: 0 });

  tl.to(q("#edge-axis"), { drawSVG: "100%", duration: 0.7 });
  tl.to(q("#label-axis, #label-axis-early, #label-axis-late"), {
    autoAlpha: 1,
  });
  tl.addLabel("step-1-axis");

  revealColumn(tl, q, "never");
  tl.addLabel("step-2-never");

  revealColumn(tl, q, "build");
  tl.addLabel("step-3-build");

  revealColumn(tl, q, "server");
  tl.addLabel("step-4-server");

  revealColumn(tl, q, "browser");
  tl.addLabel("step-5-browser");

  tl.to(q("#edge-trade-independence"), { drawSVG: "100%", duration: 0.7 });
  tl.to(
    q("#label-trade-independence, #label-arrow-independence"),
    { autoAlpha: 1 },
    "<0.2"
  );
  tl.to(q("#edge-trade-checks"), { drawSVG: "100%", duration: 0.7 }, "<0.1");
  tl.to(
    q("#label-trade-checks, #label-arrow-checks"),
    { autoAlpha: 1 },
    "<0.2"
  );
  tl.addLabel("step-6-tradeoff");

  return tl;
}

export default function MicroFrontendsSpectrum() {
  const t = useTranslations("animations.microFrontendsSpectrum");

  // Memoised: the frame keys its timeline on `steps`, so a fresh array on every
  // render would rebuild it and drop the reader back on step one.
  const steps: readonly ConceptStep[] = useMemo(
    () =>
      STEP_SEQUENCE.map((step) => ({
        ...step,
        text: t(`steps.${step.id}`),
      })),
    [t]
  );

  return (
    <ConceptAnimationFrame
      buildTimeline={buildTimeline}
      steps={steps}
      title={t("title")}
    >
      <svg
        aria-labelledby="title-micro-frontends-spectrum"
        className="h-auto w-full"
        role="img"
        viewBox="0 0 720 410"
      >
        <title id="title-micro-frontends-spectrum">{t("description")}</title>

        <g id="edges">
          <path
            d="M 60 70 C 240 70, 480 70, 660 70"
            fill="none"
            id="edge-axis"
            stroke="#3d3d3d"
            strokeWidth="1.25"
          />
          {COLUMNS.map((column) => (
            <path
              d={`M ${column.center} 76 C ${column.center} 90, ${column.center} 96, ${column.center} 110`}
              fill="none"
              id={`edge-tick-${column.id}`}
              key={column.id}
              stroke="#3d3d3d"
              strokeWidth="1.25"
            />
          ))}
          <path
            d="M 101 358 C 280 358, 460 358, 635 358"
            fill="none"
            id="edge-trade-independence"
            stroke="#d2a8ff"
            strokeWidth="1.25"
          />
          <path
            d="M 635 392 C 460 392, 280 392, 101 392"
            fill="none"
            id="edge-trade-checks"
            stroke="#ffa657"
            strokeWidth="1.25"
          />
        </g>

        <g id="nodes">
          {COLUMNS.map((column) => (
            <circle
              cx={column.center}
              cy="70"
              fill="#1a1a1a"
              id={`node-tick-${column.id}`}
              key={column.id}
              r="5"
              stroke="#3d3d3d"
              strokeWidth="1"
            />
          ))}

          {COLUMNS.map((column) => (
            <g id={`node-col-${column.id}`} key={column.id}>
              <rect
                fill="#111111"
                height="210"
                rx="12"
                stroke="#2a2a2a"
                strokeWidth="1"
                width="158"
                x={column.x}
                y="110"
              />
              <text
                fill="#fafafa"
                fontSize="13"
                fontWeight="600"
                x={column.x + 14}
                y="138"
              >
                {t(`columns.${column.id}.title`)}
              </text>
              <text
                fill="#a1a1a1"
                fontFamily="monospace"
                fontSize="10"
                x={column.x + 14}
                y="158"
              >
                {t(`columns.${column.id}.contract`)}
              </text>
              <path
                d={`M ${column.x + 14} 172 L ${column.x + 144} 172`}
                stroke="#2a2a2a"
                strokeWidth="1"
              />
              <text
                fill="#6b6b6b"
                fontFamily="monospace"
                fontSize="10"
                x={column.x + 14}
                y="192"
              >
                {t("headings.tools")}
              </text>
              {TOOL_LINES.map((line) => (
                <text
                  fill="#a1a1a1"
                  fontFamily="monospace"
                  fontSize="10"
                  key={line}
                  x={column.x + 14}
                  y={192 + line * 14}
                >
                  {t(`columns.${column.id}.tool${line}`)}
                </text>
              ))}
              <text
                fill="#6b6b6b"
                fontFamily="monospace"
                fontSize="10"
                x={column.x + 14}
                y="276"
              >
                {t("headings.price")}
              </text>
              <text
                fill="#a1a1a1"
                fontFamily="monospace"
                fontSize="10"
                x={column.x + 14}
                y="292"
              >
                {t(`columns.${column.id}.price1`)}
              </text>
              <text
                fill="#a1a1a1"
                fontFamily="monospace"
                fontSize="10"
                x={column.x + 14}
                y="306"
              >
                {t(`columns.${column.id}.price2`)}
              </text>
            </g>
          ))}
        </g>

        <g id="labels">
          <g id="label-axis">
            <rect
              fill="#0a0a0a"
              height="22"
              rx="11"
              stroke="#2a2a2a"
              strokeWidth="1"
              width="260"
              x="230"
              y="18"
            />
            <text
              fill="#a1a1a1"
              fontFamily="monospace"
              fontSize="10"
              textAnchor="middle"
              x="360"
              y="33"
            >
              {t("axis.question")}
            </text>
          </g>
          <text
            fill="#6b6b6b"
            fontFamily="monospace"
            fontSize="10"
            id="label-axis-early"
            x="60"
            y="58"
          >
            {t("axis.early")}
          </text>
          <text
            fill="#6b6b6b"
            fontFamily="monospace"
            fontSize="10"
            id="label-axis-late"
            textAnchor="end"
            x="660"
            y="58"
          >
            {t("axis.late")}
          </text>

          <text
            fill="#d2a8ff"
            fontFamily="monospace"
            fontSize="10"
            id="label-trade-independence"
            x="101"
            y="350"
          >
            {t("trade.independence")}
          </text>
          <polygon
            fill="#d2a8ff"
            id="label-arrow-independence"
            points="635,353 646,358 635,363"
          />
          <text
            fill="#ffa657"
            fontFamily="monospace"
            fontSize="10"
            id="label-trade-checks"
            textAnchor="end"
            x="635"
            y="384"
          >
            {t("trade.checks")}
          </text>
          <polygon
            fill="#ffa657"
            id="label-arrow-checks"
            points="101,387 90,392 101,397"
          />
        </g>
      </svg>
    </ConceptAnimationFrame>
  );
}
