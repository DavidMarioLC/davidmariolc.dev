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

gsap.registerPlugin(DrawSVGPlugin, MotionPathPlugin);

/**
 * A "reason to change" is a group of people, not a function. The diagram shows
 * three of them landing on the same file, and what the seam buys once it is
 * there: a change from one of them stops reaching the other two.
 */
const STEP_SEQUENCE = [
  { id: "endpoint", label: "step-1-endpoint" },
  { id: "pileUp", label: "step-2-pile-up" },
  { id: "conflict", label: "step-3-conflict" },
  { id: "split", label: "step-4-split" },
  { id: "isolated", label: "step-5-isolated" },
] as const;

const MONOLITH_EDGES =
  "#edge-backend-table, #edge-billing-table, #edge-design-table";
const PIECE_NODES = "#node-piece-data, #node-piece-money, #node-piece-view";
const PIECE_EDGES =
  "#edge-backend-data, #edge-billing-money, #edge-design-view";
const OTHER_ACTORS = "#node-actor-billing, #node-actor-design";

export function buildTimeline(root: SVGSVGElement) {
  const q = gsap.utils.selector(root);
  const tl = gsap.timeline({
    defaults: { duration: 0.5, ease: "power2.out" },
    paused: true,
  });

  // Resting state. Idempotent, so `seek(0)` always lands back here.
  tl.set(q("[id^='node-']"), { opacity: 0.35 });
  tl.set(q(PIECE_NODES), { autoAlpha: 0 });
  tl.set(q("[id^='edge-']"), { drawSVG: "0% 0%", opacity: 1 });
  tl.set(q("[id^='badge-']"), { autoAlpha: 0 });
  tl.set(q("[id^='pulse-']"), { autoAlpha: 0 });
  tl.set(q("#rect-table"), { stroke: "#2a2a2a" });

  tl.to(q("#node-actor-backend"), { opacity: 1 });
  tl.to(q("#edge-backend-table"), { drawSVG: "100%" }, "<");
  tl.to(q("#node-table"), { opacity: 1 }, "<0.15");
  tl.to(q("#badge-table-edited"), { autoAlpha: 1 }, "<0.2");
  tl.addLabel("step-1-endpoint");

  tl.to(q(OTHER_ACTORS), { opacity: 1, stagger: 0.08 });
  tl.to(
    q("#edge-billing-table, #edge-design-table"),
    { drawSVG: "100%", stagger: 0.08 },
    "<"
  );
  tl.to(q("#badge-table-edited"), { autoAlpha: 0, duration: 0.3 }, "<0.2");
  tl.to(q("#badge-table-reasons"), { autoAlpha: 1 }, "<0.15");
  tl.addLabel("step-2-pile-up");

  tl.to(q("#rect-table"), { stroke: "#ff7b72" });
  tl.to(q("#badge-table-reasons"), { autoAlpha: 0, duration: 0.3 }, "<");
  tl.to(q("#badge-table-conflict"), { autoAlpha: 1 }, "<0.15");
  tl.addLabel("step-3-conflict");

  tl.to(q("#badge-table-conflict"), { autoAlpha: 0, duration: 0.3 });
  tl.to(q("#rect-table"), { stroke: "#2a2a2a" }, "<");
  tl.to(q("#node-table"), { autoAlpha: 0 }, "<0.1");
  tl.to(q(MONOLITH_EDGES), { autoAlpha: 0, duration: 0.3 }, "<");
  tl.to(q(PIECE_NODES), { autoAlpha: 1, stagger: 0.08 }, "<0.2");
  tl.to(q(PIECE_EDGES), { drawSVG: "100%", stagger: 0.08 }, "<");
  tl.addLabel("step-4-split");

  tl.to(q(OTHER_ACTORS), { opacity: 0.35 });
  tl.to(
    q("#edge-billing-money, #edge-design-view"),
    { duration: 0.4, opacity: 0.2 },
    "<"
  );
  tl.to(q("#node-piece-money, #node-piece-view"), { opacity: 0.35 }, "<");
  tl.fromTo(
    q("#pulse-change"),
    { autoAlpha: 0 },
    {
      autoAlpha: 1,
      duration: 0.7,
      ease: "power1.inOut",
      motionPath: {
        align: "#edge-backend-data",
        alignOrigin: [0.5, 0.5],
        path: "#edge-backend-data",
      },
    },
    "<0.1"
  );
  tl.to(q("#pulse-change"), { autoAlpha: 0, duration: 0.2 });
  tl.to(q("#node-piece-data"), { opacity: 1 }, "<");
  tl.addLabel("step-5-isolated");

  return tl;
}

const ACTORS = [
  { id: "backend", y: 42 },
  { id: "billing", y: 142 },
  { id: "design", y: 242 },
] as const;

const PIECES = [
  { edge: "edge-backend-data", id: "data", y: 42 },
  { edge: "edge-billing-money", id: "money", y: 142 },
  { edge: "edge-design-view", id: "view", y: 242 },
] as const;

export default function SrpReasonsToChange() {
  const t = useTranslations("animations.srpReasonsToChange");

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
        aria-labelledby="title-srp-reasons-to-change"
        className="h-auto w-full"
        role="img"
        viewBox="0 0 720 340"
      >
        <title id="title-srp-reasons-to-change">{t("description")}</title>

        <g id="edges">
          <path
            d="M 250 70 C 310 70, 340 170, 400 170"
            fill="none"
            id="edge-backend-table"
            stroke="#3d3d3d"
            strokeWidth="1.25"
          />
          <path
            d="M 250 170 C 300 170, 350 170, 400 170"
            fill="none"
            id="edge-billing-table"
            stroke="#3d3d3d"
            strokeWidth="1.25"
          />
          <path
            d="M 250 270 C 310 270, 340 170, 400 170"
            fill="none"
            id="edge-design-table"
            stroke="#3d3d3d"
            strokeWidth="1.25"
          />
          <path
            d="M 250 70 C 300 70, 350 70, 400 70"
            fill="none"
            id="edge-backend-data"
            stroke="#3d3d3d"
            strokeWidth="1.25"
          />
          <path
            d="M 250 170 C 300 170, 350 170, 400 170"
            fill="none"
            id="edge-billing-money"
            stroke="#3d3d3d"
            strokeWidth="1.25"
          />
          <path
            d="M 250 270 C 300 270, 350 270, 400 270"
            fill="none"
            id="edge-design-view"
            stroke="#3d3d3d"
            strokeWidth="1.25"
          />
        </g>

        <g id="nodes">
          {ACTORS.map((actor) => (
            <g id={`node-actor-${actor.id}`} key={actor.id}>
              <rect
                fill="#111111"
                height="56"
                rx="12"
                stroke="#2a2a2a"
                strokeWidth="1"
                width="210"
                x="40"
                y={actor.y}
              />
              <text
                fill="#fafafa"
                fontSize="13"
                fontWeight="600"
                x="56"
                y={actor.y + 24}
              >
                {t(`actors.${actor.id}`)}
              </text>
              <text
                fill="#a1a1a1"
                fontFamily="monospace"
                fontSize="10"
                x="56"
                y={actor.y + 42}
              >
                {t(`actorsMeta.${actor.id}`)}
              </text>
            </g>
          ))}

          <g id="node-table">
            <rect
              fill="#111111"
              height="200"
              id="rect-table"
              rx="12"
              stroke="#2a2a2a"
              strokeWidth="1"
              width="280"
              x="400"
              y="70"
            />
            <text fill="#fafafa" fontSize="13" fontWeight="600" x="416" y="110">
              {t("nodes.table")}
            </text>
            <text
              fill="#a1a1a1"
              fontFamily="monospace"
              fontSize="10"
              x="416"
              y="132"
            >
              {t("nodes.tableMeta")}
            </text>
          </g>

          {PIECES.map((piece) => (
            <g id={`node-piece-${piece.id}`} key={piece.id}>
              <rect
                fill="#111111"
                height="56"
                rx="12"
                stroke="#2a2a2a"
                strokeWidth="1"
                width="280"
                x="400"
                y={piece.y}
              />
              <text
                fill="#fafafa"
                fontFamily="monospace"
                fontSize="12"
                x="416"
                y={piece.y + 24}
              >
                {t(`pieces.${piece.id}`)}
              </text>
              <text fill="#a1a1a1" fontSize="10" x="416" y={piece.y + 42}>
                {t(`piecesMeta.${piece.id}`)}
              </text>
            </g>
          ))}
        </g>

        <g id="labels">
          <g id="badge-table-edited">
            <rect
              fill="#1a1a1a"
              height="20"
              rx="10"
              stroke="#ffa657"
              strokeWidth="1"
              width="248"
              x="416"
              y="214"
            />
            <text
              fill="#ffa657"
              fontFamily="monospace"
              fontSize="10"
              x="430"
              y="228"
            >
              {t("badges.edited")}
            </text>
          </g>

          <g id="badge-table-reasons">
            <rect
              fill="#1a1a1a"
              height="20"
              rx="10"
              stroke="#ffa657"
              strokeWidth="1"
              width="248"
              x="416"
              y="214"
            />
            <text
              fill="#ffa657"
              fontFamily="monospace"
              fontSize="10"
              x="430"
              y="228"
            >
              {t("badges.reasons")}
            </text>
          </g>

          <g id="badge-table-conflict">
            <rect
              fill="#1a1a1a"
              height="20"
              rx="10"
              stroke="#ff7b72"
              strokeWidth="1"
              width="248"
              x="416"
              y="214"
            />
            <text
              fill="#ff7b72"
              fontFamily="monospace"
              fontSize="10"
              x="430"
              y="228"
            >
              {t("badges.conflict")}
            </text>
          </g>
        </g>

        <g id="pulses">
          <circle fill="#ffa657" id="pulse-change" r="4" />
        </g>
      </svg>
    </ConceptAnimationFrame>
  );
}
