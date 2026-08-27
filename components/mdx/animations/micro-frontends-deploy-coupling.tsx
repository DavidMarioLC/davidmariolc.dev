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
 * Why five teams that share one deployment unit stop being five teams: the
 * cost is never in the code, it is in the single moment of publishing.
 */
const STEP_SEQUENCE = [
  { id: "change", label: "step-1-change" },
  { id: "rebuild", label: "step-2-rebuild" },
  { id: "publish", label: "step-3-publish" },
  { id: "blocked", label: "step-4-blocked" },
  { id: "rollback", label: "step-5-rollback" },
] as const;

const UNTOUCHED_TEAMS =
  "#node-team-home, #node-team-catalog, #node-team-cart, #node-team-account";
const UNTOUCHED_EDGES =
  "#edge-home-build, #edge-catalog-build, #edge-cart-build, #edge-account-build";
const REBUILT_BADGES =
  "#badge-home-rebuilt, #badge-catalog-rebuilt, #badge-cart-rebuilt, #badge-account-rebuilt";

export function buildTimeline(root: SVGSVGElement) {
  const q = gsap.utils.selector(root);
  const tl = gsap.timeline({
    defaults: { duration: 0.5, ease: "power2.out" },
    paused: true,
  });

  // Resting state. Idempotent, so `seek(0)` always lands back here.
  tl.set(q("[id^='node-']"), { opacity: 0.35 });
  tl.set(q("[id^='edge-']"), { drawSVG: "0% 0%", opacity: 1 });
  tl.set(q("[id^='badge-']"), { autoAlpha: 0 });
  tl.set(q("[id^='pulse-']"), { autoAlpha: 0 });
  tl.set(q("#rect-build"), { stroke: "#2a2a2a" });

  tl.to(q("#node-team-search"), { opacity: 1 });
  tl.to(q("#badge-search-touched"), { autoAlpha: 1 }, "<0.15");
  tl.to(q("#edge-search-build"), { drawSVG: "100%" }, "<");
  tl.addLabel("step-1-change");

  tl.to(q(UNTOUCHED_TEAMS), { opacity: 1, stagger: 0.08 });
  tl.to(q(UNTOUCHED_EDGES), { drawSVG: "100%", stagger: 0.08 }, "<");
  tl.to(q("#node-build"), { opacity: 1 }, "<0.15");
  tl.to(q(REBUILT_BADGES), { autoAlpha: 1, stagger: 0.08 }, "<0.2");
  tl.addLabel("step-2-rebuild");

  tl.to(q("#edge-build-prod"), { drawSVG: "100%" });
  tl.fromTo(
    q("#pulse-release"),
    { autoAlpha: 0 },
    {
      autoAlpha: 1,
      duration: 0.7,
      ease: "power1.inOut",
      motionPath: {
        align: "#edge-build-prod",
        alignOrigin: [0.5, 0.5],
        path: "#edge-build-prod",
      },
    },
    "<0.1"
  );
  tl.to(q("#pulse-release"), { autoAlpha: 0, duration: 0.2 });
  tl.to(q("#node-prod"), { opacity: 1 }, "<");
  tl.to(q("#badge-prod-shipped"), { autoAlpha: 1 }, "<0.1");
  tl.addLabel("step-3-publish");

  tl.to(q("#badge-cart-rebuilt"), { autoAlpha: 0, duration: 0.3 });
  tl.to(q("#badge-cart-failing"), { autoAlpha: 1 }, "<0.2");
  tl.to(q("#rect-build"), { stroke: "#ff7b72" }, "<");
  tl.to(q("#badge-build-blocked"), { autoAlpha: 1 }, "<0.1");
  tl.to(q("#badge-prod-shipped"), { autoAlpha: 0, duration: 0.3 }, "<");
  tl.to(q("#edge-build-prod"), { opacity: 0.2 }, "<");
  tl.to(q("#node-prod"), { opacity: 0.35 }, "<");
  tl.addLabel("step-4-blocked");

  tl.to(q("#badge-cart-failing, #badge-build-blocked"), {
    autoAlpha: 0,
    duration: 0.3,
  });
  tl.to(q("#rect-build"), { stroke: "#2a2a2a" }, "<");
  tl.to(q("#edge-build-prod"), { opacity: 1 }, "<");
  tl.to(q("#node-prod"), { opacity: 1 }, "<");
  tl.fromTo(
    q("#pulse-revert"),
    { autoAlpha: 0 },
    {
      autoAlpha: 1,
      duration: 0.7,
      ease: "power1.inOut",
      motionPath: {
        align: "#edge-build-prod",
        alignOrigin: [0.5, 0.5],
        end: 0,
        path: "#edge-build-prod",
        start: 1,
      },
    },
    "<0.1"
  );
  tl.to(q("#pulse-revert"), { autoAlpha: 0, duration: 0.2 });
  tl.to(
    q(`#badge-search-touched, ${REBUILT_BADGES}`),
    { autoAlpha: 0, duration: 0.3 },
    "<"
  );
  tl.to(q("[id$='-reverted']"), { autoAlpha: 1, stagger: 0.08 }, "<0.1");
  tl.addLabel("step-5-rollback");

  return tl;
}

const TEAMS = [
  { id: "home", y: 40 },
  { id: "search", y: 92 },
  { id: "catalog", y: 144 },
  { id: "cart", y: 196 },
  { id: "account", y: 248 },
] as const;

export default function MicroFrontendsDeployCoupling() {
  const t = useTranslations("animations.microFrontendsDeployCoupling");

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
        aria-labelledby="title-micro-frontends-deploy-coupling"
        className="h-auto w-full"
        role="img"
        viewBox="0 0 720 320"
      >
        <title id="title-micro-frontends-deploy-coupling">
          {t("description")}
        </title>

        <g id="edges">
          <path
            d="M 250 62 C 284 62, 288 165, 320 165"
            fill="none"
            id="edge-home-build"
            stroke="#3d3d3d"
            strokeWidth="1.25"
          />
          <path
            d="M 250 114 C 284 114, 288 165, 320 165"
            fill="none"
            id="edge-search-build"
            stroke="#3d3d3d"
            strokeWidth="1.25"
          />
          <path
            d="M 250 166 C 276 166, 296 165, 320 165"
            fill="none"
            id="edge-catalog-build"
            stroke="#3d3d3d"
            strokeWidth="1.25"
          />
          <path
            d="M 250 218 C 284 218, 288 165, 320 165"
            fill="none"
            id="edge-cart-build"
            stroke="#3d3d3d"
            strokeWidth="1.25"
          />
          <path
            d="M 250 270 C 284 270, 288 165, 320 165"
            fill="none"
            id="edge-account-build"
            stroke="#3d3d3d"
            strokeWidth="1.25"
          />
          <path
            d="M 480 165 C 500 165, 512 165, 532 165"
            fill="none"
            id="edge-build-prod"
            stroke="#3d3d3d"
            strokeWidth="1.25"
          />
        </g>

        <g id="nodes">
          {TEAMS.map((team) => (
            <g id={`node-team-${team.id}`} key={team.id}>
              <rect
                fill="#111111"
                height="44"
                rx="12"
                stroke="#2a2a2a"
                strokeWidth="1"
                width="226"
                x="24"
                y={team.y}
              />
              <text
                fill="#fafafa"
                fontSize="13"
                fontWeight="600"
                x="40"
                y={team.y + 27}
              >
                {t(`teams.${team.id}`)}
              </text>
            </g>
          ))}

          <g id="node-build">
            <rect
              fill="#111111"
              height="110"
              id="rect-build"
              rx="12"
              stroke="#2a2a2a"
              strokeWidth="1"
              width="160"
              x="320"
              y="110"
            />
            <text fill="#fafafa" fontSize="13" fontWeight="600" x="336" y="142">
              {t("nodes.build")}
            </text>
            <text
              fill="#a1a1a1"
              fontFamily="monospace"
              fontSize="10"
              x="336"
              y="164"
            >
              {t("nodes.buildMeta")}
            </text>
          </g>

          <g id="node-prod">
            <rect
              fill="#111111"
              height="110"
              rx="12"
              stroke="#2a2a2a"
              strokeWidth="1"
              width="168"
              x="532"
              y="110"
            />
            <text fill="#fafafa" fontSize="13" fontWeight="600" x="548" y="142">
              {t("nodes.production")}
            </text>
            <text
              fill="#a1a1a1"
              fontFamily="monospace"
              fontSize="10"
              x="548"
              y="164"
            >
              {t("nodes.productionMeta")}
            </text>
          </g>
        </g>

        <g id="labels">
          {TEAMS.map((team) => (
            <g id={`badge-${team.id}-rebuilt`} key={team.id}>
              <rect
                fill="#1a1a1a"
                height="20"
                rx="10"
                stroke="#2a2a2a"
                strokeWidth="1"
                width="88"
                x="158"
                y={team.y + 12}
              />
              <text
                fill="#a1a1a1"
                fontFamily="monospace"
                fontSize="10"
                x="168"
                y={team.y + 26}
              >
                {t("badges.rebuilt")}
              </text>
            </g>
          ))}

          {TEAMS.map((team) => (
            <g id={`badge-${team.id}-reverted`} key={team.id}>
              <rect
                fill="#1a1a1a"
                height="20"
                rx="10"
                stroke="#ff7b72"
                strokeWidth="1"
                width="88"
                x="158"
                y={team.y + 12}
              />
              <text
                fill="#ff7b72"
                fontFamily="monospace"
                fontSize="10"
                x="168"
                y={team.y + 26}
              >
                {t("badges.reverted")}
              </text>
            </g>
          ))}

          <g id="badge-search-touched">
            <rect
              fill="#1a1a1a"
              height="20"
              rx="10"
              stroke="#ffa657"
              strokeWidth="1"
              width="88"
              x="158"
              y="104"
            />
            <text
              fill="#ffa657"
              fontFamily="monospace"
              fontSize="10"
              x="168"
              y="118"
            >
              {t("badges.changed")}
            </text>
          </g>

          <g id="badge-cart-failing">
            <rect
              fill="#1a1a1a"
              height="20"
              rx="10"
              stroke="#ff7b72"
              strokeWidth="1"
              width="88"
              x="158"
              y="208"
            />
            <text
              fill="#ff7b72"
              fontFamily="monospace"
              fontSize="10"
              x="168"
              y="222"
            >
              {t("badges.failing")}
            </text>
          </g>

          <g id="badge-build-blocked">
            <rect
              fill="#1a1a1a"
              height="20"
              rx="10"
              stroke="#ff7b72"
              strokeWidth="1"
              width="128"
              x="336"
              y="184"
            />
            <text
              fill="#ff7b72"
              fontFamily="monospace"
              fontSize="10"
              x="346"
              y="198"
            >
              {t("badges.blocked")}
            </text>
          </g>

          <g id="badge-prod-shipped">
            <rect
              fill="#1a1a1a"
              height="20"
              rx="10"
              stroke="#2a2a2a"
              strokeWidth="1"
              width="138"
              x="548"
              y="184"
            />
            <text
              fill="#a1a1a1"
              fontFamily="monospace"
              fontSize="10"
              x="558"
              y="198"
            >
              {t("badges.shipped")}
            </text>
          </g>
        </g>

        <g id="pulses">
          <circle fill="#ffa657" id="pulse-release" r="4" />
          <circle fill="#ff7b72" id="pulse-revert" r="4" />
        </g>
      </svg>
    </ConceptAnimationFrame>
  );
}
