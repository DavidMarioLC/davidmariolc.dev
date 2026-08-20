"use client";

import gsap from "gsap";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { useTranslations } from "next-intl";
import { useMemo } from "react";
import {
  ConceptAnimationFrame,
  type ConceptStep,
} from "@/components/mdx/concept-animation-frame";

/**
 * A model router that picks between a fast model and a powerful one based on
 * the request's latency budget.
 *
 * This is also the mold for every other concept animation: steps first, then a
 * pure timeline builder, then the inline SVG, then the component that wires
 * them together.
 */

gsap.registerPlugin(DrawSVGPlugin, MotionPathPlugin);

/**
 * The order and the timeline labels; the prose lives in the message catalogs so
 * the same diagram reads in the locale of the post embedding it.
 */
const STEP_SEQUENCE = [
  { id: "request", label: "step-1-request" },
  { id: "budget", label: "step-2-budget" },
  { id: "fast", label: "step-3-fast" },
  { id: "strong", label: "step-4-strong" },
  { id: "response", label: "step-5-response" },
] as const;

const DIM = 0.35;
const LIT = 1;
/** A step with no tweens of its own still needs length, or its label collapses
 *  onto the previous one and navigation skips it. */
const EMPTY_BEAT = 0.01;

export function buildTimeline(root: SVGSVGElement) {
  const q = gsap.utils.selector(root);
  const tl = gsap.timeline({ paused: true });

  // The starting state lives here rather than in the JSX so the markup keeps
  // describing the finished diagram: what the animation dims is its own
  // business, and nothing has to be undone by hand to read the SVG.
  gsap.set(q("#node-router, #node-fast, #node-strong, #badge-budget"), {
    opacity: DIM,
  });
  gsap.set(q("#edge-client-router, #edge-router-fast, #edge-router-strong"), {
    drawSVG: "0%",
  });
  gsap.set(q("#pulses circle"), { opacity: 0 });

  // Step 1 — the request arrives.
  tl.to(q("#edge-client-router"), {
    drawSVG: "100%",
    duration: 0.5,
    ease: "power2.out",
  });
  tl.to(q("#node-router"), { duration: 0.4, opacity: LIT }, "<0.2");
  // The label goes *after* the step's tweens. Before them, `tweenTo` stops just
  // short of the step: every control replays the previous one and the last step
  // never runs at all.
  tl.addLabel("step-1-request");

  // Step 2 — the latency budget is read.
  tl.to({}, { duration: EMPTY_BEAT });
  tl.to(q("#badge-budget"), {
    duration: 0.4,
    ease: "power2.out",
    opacity: LIT,
  });
  tl.addLabel("step-2-budget");

  // Step 3 — the fast path.
  tl.to(q("#edge-router-fast"), {
    drawSVG: "100%",
    duration: 0.5,
    ease: "power2.out",
  });
  tl.to(q("#node-fast"), { duration: 0.4, opacity: LIT }, "<0.2");
  tl.to(q("#pulse-router-fast"), { duration: 0.2, opacity: 1 }, "<");
  tl.to(q("#pulse-router-fast"), {
    duration: 0.7,
    ease: "power1.inOut",
    motionPath: {
      align: "#edge-router-fast",
      // Without this the pulse rides the path by its own origin, which for a
      // circle at cx/cy 0 sits a radius off the line.
      alignOrigin: [0.5, 0.5],
      path: "#edge-router-fast",
    },
  });
  tl.addLabel("step-3-fast");

  // Step 4 — the powerful path takes over and the fast one dims.
  tl.to(q("#pulse-router-fast"), { duration: 0.2, opacity: 0 });
  tl.to(q("#node-fast"), { duration: 0.4, opacity: DIM }, "<");
  tl.to(q("#edge-router-strong"), {
    drawSVG: "100%",
    duration: 0.5,
    ease: "power2.out",
  });
  tl.to(q("#node-strong"), { duration: 0.4, opacity: LIT }, "<0.2");
  tl.to(q("#pulse-router-strong"), { duration: 0.2, opacity: 1 }, "<");
  tl.to(q("#pulse-router-strong"), {
    duration: 0.7,
    ease: "power1.inOut",
    motionPath: {
      align: "#edge-router-strong",
      alignOrigin: [0.5, 0.5],
      path: "#edge-router-strong",
    },
  });
  tl.addLabel("step-4-strong");

  // Step 5 — the response travels back down the same edge it came in on.
  tl.to(q("#pulse-router-strong"), { duration: 0.2, opacity: 0 });
  tl.to(q("#pulse-response"), { duration: 0.2, opacity: 1 }, "<");
  tl.to(q("#pulse-response"), {
    duration: 0.7,
    ease: "power1.inOut",
    motionPath: {
      align: "#edge-client-router",
      alignOrigin: [0.5, 0.5],
      end: 0,
      path: "#edge-client-router",
      start: 1,
    },
  });
  tl.addLabel("step-5-response");

  return tl;
}

export default function ModelRouterAnimation() {
  const t = useTranslations("animations.modelRouter");

  // Memoised because the frame keys its timeline off `steps`: a new array every
  // render would rebuild the timeline and drop the reader back to step one.
  const steps: readonly ConceptStep[] = useMemo(
    () =>
      STEP_SEQUENCE.map(({ id, label }) => ({
        id,
        label,
        text: t(`steps.${id}`),
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
        aria-labelledby="title-model-router"
        className="h-auto w-full"
        role="img"
        viewBox="0 0 720 300"
      >
        <title id="title-model-router">{t("description")}</title>

        <g id="edges">
          <path
            d="M 150 150 C 200 150, 210 150, 260 150"
            fill="none"
            id="edge-client-router"
            stroke="#2a2a2a"
            strokeWidth="1.25"
          />
          <path
            d="M 450 132 C 500 132, 510 70, 560 70"
            fill="none"
            id="edge-router-fast"
            stroke="#2a2a2a"
            strokeWidth="1.25"
          />
          <path
            d="M 450 168 C 500 168, 510 230, 560 230"
            fill="none"
            id="edge-router-strong"
            stroke="#2a2a2a"
            strokeWidth="1.25"
          />
        </g>

        <g id="nodes">
          <g id="node-client">
            <rect
              fill="#111111"
              height="60"
              rx="12"
              stroke="#2a2a2a"
              strokeWidth="1"
              width="130"
              x="20"
              y="120"
            />
            <text fill="#fafafa" fontSize="13" fontWeight="600" x="36" y="146">
              {t("nodes.client")}
            </text>
            <text
              fill="#a1a1a1"
              fontFamily="monospace"
              fontSize="10"
              x="36"
              y="164"
            >
              POST /v1/chat
            </text>
          </g>

          <g id="node-router">
            <rect
              fill="#111111"
              height="84"
              rx="12"
              stroke="#2a2a2a"
              strokeWidth="1"
              width="190"
              x="260"
              y="112"
            />
            <text fill="#fafafa" fontSize="13" fontWeight="600" x="276" y="134">
              {t("nodes.router")}
            </text>
            <text
              fill="#a1a1a1"
              fontFamily="monospace"
              fontSize="10"
              x="276"
              y="152"
            >
              {t("nodes.routerMeta")}
            </text>
          </g>

          {/* The budget is a value the router reads, not a semantic state, so it
              stays neutral: the emphasis comes from it lighting up on its step,
              not from a colour competing with the travelling pulses. `rx` is half
              the height — an `rx` wider than half the width is clamped and the
              pill degrades into an ellipse. */}
          <g id="badge-budget">
            <rect
              fill="#1a1a1a"
              height="20"
              rx="10"
              stroke="#3d3d3d"
              strokeWidth="1"
              width="90"
              x="276"
              y="160"
            />
            <text
              fill="#d4d4d4"
              fontFamily="monospace"
              fontSize="10"
              x="288"
              y="174"
            >
              p95 &lt; 400ms
            </text>
          </g>

          <g id="node-fast">
            <rect
              fill="#111111"
              height="60"
              rx="12"
              stroke="#2a2a2a"
              strokeWidth="1"
              width="140"
              x="560"
              y="40"
            />
            <text fill="#fafafa" fontSize="13" fontWeight="600" x="576" y="66">
              {t("nodes.fast")}
            </text>
            <text
              fill="#a1a1a1"
              fontFamily="monospace"
              fontSize="10"
              x="576"
              y="84"
            >
              ~200ms
            </text>
          </g>

          <g id="node-strong">
            <rect
              fill="#111111"
              height="60"
              rx="12"
              stroke="#2a2a2a"
              strokeWidth="1"
              width="140"
              x="560"
              y="200"
            />
            <text fill="#fafafa" fontSize="13" fontWeight="600" x="576" y="226">
              {t("nodes.strong")}
            </text>
            <text
              fill="#a1a1a1"
              fontFamily="monospace"
              fontSize="10"
              x="576"
              y="244"
            >
              ~1.8s
            </text>
          </g>
        </g>

        <g id="labels">
          <text
            fill="#6b6b6b"
            fontFamily="monospace"
            fontSize="10"
            x="486"
            y="92"
          >
            true
          </text>
          <text
            fill="#6b6b6b"
            fontFamily="monospace"
            fontSize="10"
            x="486"
            y="212"
          >
            false
          </text>
        </g>

        {/* Two accents, and each one means something: the request travelling out
            and the response coming back. Both branches carry the *same* request,
            so colouring them differently would imply two kinds of data. */}
        <g id="pulses">
          <circle fill="#ffa657" id="pulse-router-fast" r="4" />
          <circle fill="#ffa657" id="pulse-router-strong" r="4" />
          <circle fill="#7ee787" id="pulse-response" r="4" />
        </g>
      </svg>
    </ConceptAnimationFrame>
  );
}
