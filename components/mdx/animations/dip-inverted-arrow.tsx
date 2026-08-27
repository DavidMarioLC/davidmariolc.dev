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
 * Dependency inversion is literally an arrow turning around: the screens stop
 * naming the provider, and the provider starts naming a contract the screens
 * own. Every step is about the direction of an arrowhead.
 */
const STEP_SEQUENCE = [
  { id: "importing", label: "step-1-importing" },
  { id: "everyScreen", label: "step-2-every-screen" },
  { id: "swap", label: "step-3-swap" },
  { id: "contract", label: "step-4-contract" },
  { id: "invert", label: "step-5-invert" },
] as const;

const OTHER_SCREENS = "#node-invoice-list, #node-customer-list";
const SCREEN_RECTS =
  "#rect-order-list, #rect-invoice-list, #rect-customer-list";
const OTHER_DIRECT_EDGES =
  "#edge-invoicelist-supabase, #edge-customerlist-supabase";
const DIRECT_EDGES = `#edge-orderlist-supabase, ${OTHER_DIRECT_EDGES}`;
const DIRECT_ARROWS =
  "#arrow-orderlist-supabase, #arrow-invoicelist-supabase, #arrow-customerlist-supabase";

export function buildTimeline(root: SVGSVGElement) {
  const q = gsap.utils.selector(root);
  const tl = gsap.timeline({
    defaults: { duration: 0.5, ease: "power2.out" },
    paused: true,
  });

  // Resting state. Idempotent, so `seek(0)` always lands back here.
  tl.set(q("[id^='node-']"), { opacity: 0.35 });
  tl.set(q("#node-contract"), { autoAlpha: 0 });
  tl.set(q("[id^='edge-']"), { drawSVG: "0% 0%", opacity: 1 });
  tl.set(q("[id^='arrow-']"), { autoAlpha: 0 });
  tl.set(q("[id^='badge-']"), { autoAlpha: 0 });
  tl.set(q(SCREEN_RECTS), { stroke: "#2a2a2a" });

  tl.to(q("#node-order-list"), { opacity: 1 });
  tl.to(q("#badge-orderlist-import"), { autoAlpha: 1 }, "<0.15");
  tl.to(q("#edge-orderlist-supabase"), { drawSVG: "100%", duration: 0.6 }, "<");
  tl.to(q("#node-supabase"), { opacity: 1 }, "<0.2");
  tl.to(q("#arrow-orderlist-supabase"), { autoAlpha: 1, duration: 0.3 });
  tl.addLabel("step-1-importing");

  tl.to(q(OTHER_SCREENS), { opacity: 1, stagger: 0.08 });
  tl.to(
    q(OTHER_DIRECT_EDGES),
    { drawSVG: "100%", duration: 0.6, stagger: 0.08 },
    "<"
  );
  tl.to(
    q("#arrow-invoicelist-supabase, #arrow-customerlist-supabase"),
    { autoAlpha: 1, duration: 0.3, stagger: 0.08 },
    "<0.4"
  );
  tl.addLabel("step-2-every-screen");

  tl.to(q("#badge-supabase-swap"), { autoAlpha: 1 });
  tl.to(q(SCREEN_RECTS), { stagger: 0.08, stroke: "#ff7b72" }, "<");
  tl.addLabel("step-3-swap");

  tl.to(q("#badge-supabase-swap"), { autoAlpha: 0, duration: 0.3 });
  tl.to(q(SCREEN_RECTS), { stroke: "#2a2a2a" }, "<");
  tl.to(q(DIRECT_EDGES), { autoAlpha: 0, duration: 0.4 }, "<");
  tl.to(q(DIRECT_ARROWS), { autoAlpha: 0, duration: 0.3 }, "<");
  tl.to(q(OTHER_SCREENS), { opacity: 0.35 }, "<");
  tl.to(q("#node-contract"), { autoAlpha: 1 }, "<0.2");
  tl.to(q("#edge-orderlist-contract"), { drawSVG: "100%" }, "<0.1");
  tl.to(q("#arrow-orderlist-contract"), { autoAlpha: 1, duration: 0.3 });
  tl.addLabel("step-4-contract");

  tl.to(q("#edge-supabase-contract"), { drawSVG: "100%" });
  tl.to(q("#arrow-supabase-contract"), { autoAlpha: 1, duration: 0.3 });
  tl.to(q("#badge-supabase-implements"), { autoAlpha: 1 }, "<0.1");
  tl.addLabel("step-5-invert");

  return tl;
}

export default function DipInvertedArrow() {
  const t = useTranslations("animations.dipInvertedArrow");

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
        aria-labelledby="title-dip-inverted-arrow"
        className="h-auto w-full"
        role="img"
        viewBox="0 0 720 300"
      >
        <title id="title-dip-inverted-arrow">{t("description")}</title>

        <g id="edges">
          <path
            d="M 220 74 C 350 74, 400 112, 510 112"
            fill="none"
            id="edge-orderlist-supabase"
            stroke="#3d3d3d"
            strokeWidth="1.25"
          />
          <path
            d="M 220 152 C 350 152, 400 132, 510 132"
            fill="none"
            id="edge-invoicelist-supabase"
            stroke="#3d3d3d"
            strokeWidth="1.25"
          />
          <path
            d="M 220 226 C 350 226, 400 152, 510 152"
            fill="none"
            id="edge-customerlist-supabase"
            stroke="#3d3d3d"
            strokeWidth="1.25"
          />
          <path
            d="M 220 74 C 246 74, 252 100, 278 116"
            fill="none"
            id="edge-orderlist-contract"
            stroke="#79c0ff"
            strokeWidth="1.25"
          />
          <path
            d="M 510 148 C 494 148, 478 148, 462 148"
            fill="none"
            id="edge-supabase-contract"
            stroke="#79c0ff"
            strokeWidth="1.25"
          />
        </g>

        <g id="nodes">
          <g id="node-order-list">
            <rect
              fill="#111111"
              height="76"
              id="rect-order-list"
              rx="12"
              stroke="#2a2a2a"
              strokeWidth="1"
              width="190"
              x="30"
              y="36"
            />
            <text fill="#fafafa" fontSize="13" fontWeight="600" x="46" y="62">
              {t("nodes.orderList")}
            </text>
          </g>

          <g id="node-invoice-list">
            <rect
              fill="#111111"
              height="52"
              id="rect-invoice-list"
              rx="12"
              stroke="#2a2a2a"
              strokeWidth="1"
              width="190"
              x="30"
              y="126"
            />
            <text fill="#fafafa" fontSize="13" fontWeight="600" x="46" y="157">
              {t("nodes.invoiceList")}
            </text>
          </g>

          <g id="node-customer-list">
            <rect
              fill="#111111"
              height="52"
              id="rect-customer-list"
              rx="12"
              stroke="#2a2a2a"
              strokeWidth="1"
              width="190"
              x="30"
              y="200"
            />
            <text fill="#fafafa" fontSize="13" fontWeight="600" x="46" y="231">
              {t("nodes.customerList")}
            </text>
          </g>

          <g id="node-contract">
            <rect
              fill="#111111"
              height="68"
              rx="12"
              stroke="#79c0ff"
              strokeWidth="1"
              width="180"
              x="280"
              y="98"
            />
            <text
              fill="#fafafa"
              fontFamily="monospace"
              fontSize="12"
              x="296"
              y="126"
            >
              {t("nodes.contract")}
            </text>
            <text
              fill="#a1a1a1"
              fontFamily="monospace"
              fontSize="10"
              x="296"
              y="146"
            >
              {t("nodes.contractMeta")}
            </text>
          </g>

          <g id="node-supabase">
            <rect
              fill="#111111"
              height="80"
              rx="12"
              stroke="#2a2a2a"
              strokeWidth="1"
              width="180"
              x="510"
              y="98"
            />
            <text fill="#fafafa" fontSize="13" fontWeight="600" x="526" y="128">
              {t("nodes.supabase")}
            </text>
          </g>
        </g>

        <g id="labels">
          <g id="badge-orderlist-import">
            <rect
              fill="#1a1a1a"
              height="20"
              rx="10"
              stroke="#79c0ff"
              strokeWidth="1"
              width="158"
              x="46"
              y="78"
            />
            <text
              fill="#79c0ff"
              fontFamily="monospace"
              fontSize="10"
              x="58"
              y="92"
            >
              {t("badges.import")}
            </text>
          </g>

          <g id="badge-supabase-swap">
            <rect
              fill="#1a1a1a"
              height="20"
              rx="10"
              stroke="#ff7b72"
              strokeWidth="1"
              width="148"
              x="526"
              y="142"
            />
            <text
              fill="#ff7b72"
              fontFamily="monospace"
              fontSize="10"
              x="538"
              y="156"
            >
              {t("badges.swap")}
            </text>
          </g>

          <g id="badge-supabase-implements">
            <rect
              fill="#1a1a1a"
              height="20"
              rx="10"
              stroke="#79c0ff"
              strokeWidth="1"
              width="148"
              x="526"
              y="142"
            />
            <text
              fill="#79c0ff"
              fontFamily="monospace"
              fontSize="10"
              x="538"
              y="156"
            >
              {t("badges.implements")}
            </text>
          </g>

          <polygon
            fill="#3d3d3d"
            id="arrow-orderlist-supabase"
            points="500,108 508,112 500,116"
          />
          <polygon
            fill="#3d3d3d"
            id="arrow-invoicelist-supabase"
            points="500,128 508,132 500,136"
          />
          <polygon
            fill="#3d3d3d"
            id="arrow-customerlist-supabase"
            points="500,148 508,152 500,156"
          />
          <polygon
            fill="#79c0ff"
            id="arrow-orderlist-contract"
            points="270,110 280,117 269,120"
          />
          <polygon
            fill="#79c0ff"
            id="arrow-supabase-contract"
            points="470,144 460,148 470,152"
          />
        </g>
      </svg>
    </ConceptAnimationFrame>
  );
}
