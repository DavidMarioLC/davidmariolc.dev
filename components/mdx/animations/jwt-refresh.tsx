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
 * Why the pattern needs two tokens: the short one that nobody stores and the
 * long one that lives in a table, gets rotated on every use, and is the only
 * place the session can actually be cut.
 */
const STEP_SEQUENCE = [
  { id: "expired", label: "step-1-expired" },
  { id: "ask", label: "step-2-ask" },
  { id: "lookup", label: "step-3-lookup" },
  { id: "rotate", label: "step-4-rotate" },
  { id: "retry", label: "step-5-retry" },
  { id: "reuse", label: "step-6-reuse" },
] as const;

export function buildTimeline(root: SVGSVGElement) {
  const q = gsap.utils.selector(root);
  const tl = gsap.timeline({
    defaults: { duration: 0.5, ease: "power2.out" },
    paused: true,
  });

  tl.set(q("[id^='node-']"), { opacity: 0.35 });
  tl.set(q("[id^='edge-']"), { drawSVG: "0% 0%" });
  tl.set(q("[id^='pulse-']"), { autoAlpha: 0 });
  tl.set(q("#row-new"), { autoAlpha: 0 });
  tl.set(q("#row-old"), { opacity: 0.35 });
  tl.set(
    q(
      "#state-old-used, #state-new-revoked, #badge-api-401, #badge-api-200, #label-reuse"
    ),
    { autoAlpha: 0 }
  );

  tl.to(q("#node-client"), { opacity: 1 });
  tl.to(q("#edge-client-api"), { drawSVG: "100%" }, "<");
  tl.fromTo(
    q("#pulse-request"),
    { autoAlpha: 0 },
    {
      autoAlpha: 1,
      duration: 0.7,
      ease: "power1.inOut",
      motionPath: {
        align: "#edge-client-api",
        alignOrigin: [0.5, 0.5],
        path: "#edge-client-api",
      },
    },
    "<0.1"
  );
  tl.to(q("#pulse-request"), { autoAlpha: 0, duration: 0.2 });
  tl.to(q("#node-api"), { opacity: 1 }, "<");
  tl.to(q("#badge-api-401"), { autoAlpha: 1 }, "<0.1");
  tl.addLabel("step-1-expired");

  tl.to(q("#edge-client-auth"), { drawSVG: "100%" });
  tl.to(q("#node-auth"), { opacity: 1 }, "<0.15");
  tl.fromTo(
    q("#pulse-refresh"),
    { autoAlpha: 0 },
    {
      autoAlpha: 1,
      duration: 0.6,
      ease: "power1.inOut",
      motionPath: {
        align: "#edge-client-auth",
        alignOrigin: [0.5, 0.5],
        path: "#edge-client-auth",
      },
    },
    "<0.1"
  );
  tl.to(q("#pulse-refresh"), { autoAlpha: 0, duration: 0.2 });
  tl.addLabel("step-2-ask");

  tl.to(q("#edge-auth-store"), { drawSVG: "100%" });
  tl.to(q("#node-store"), { opacity: 1 }, "<0.15");
  tl.to(q("#row-old"), { opacity: 1 }, "<0.15");
  tl.addLabel("step-3-lookup");

  tl.to(q("#state-old-valid"), { autoAlpha: 0, duration: 0.3 });
  tl.to(q("#state-old-used"), { autoAlpha: 1, duration: 0.3 }, "<0.15");
  tl.to(q("#row-new"), { autoAlpha: 1 }, "<0.1");
  tl.addLabel("step-4-rotate");

  tl.to(q("#edge-store-client"), { drawSVG: "100%" });
  tl.fromTo(
    q("#pulse-access"),
    { autoAlpha: 0 },
    {
      autoAlpha: 1,
      duration: 0.8,
      ease: "power1.inOut",
      motionPath: {
        align: "#edge-store-client",
        alignOrigin: [0.5, 0.5],
        path: "#edge-store-client",
      },
    },
    "<0.1"
  );
  tl.to(q("#pulse-access"), { autoAlpha: 0, duration: 0.2 });
  tl.to(q("#badge-api-401"), { autoAlpha: 0, duration: 0.3 });
  tl.to(q("#badge-api-200"), { autoAlpha: 1, duration: 0.3 }, "<0.15");
  tl.addLabel("step-5-retry");

  tl.to(q("#label-reuse"), { autoAlpha: 1 });
  tl.to(q("#row-old rect, #row-new rect"), { stroke: "#ff7b72" }, "<");
  tl.to(q("#state-new-valid"), { autoAlpha: 0, duration: 0.3 }, "<");
  tl.to(q("#state-new-revoked"), { autoAlpha: 1, duration: 0.3 }, "<0.15");
  tl.addLabel("step-6-reuse");

  return tl;
}

export default function JwtRefresh() {
  const t = useTranslations("animations.jwtRefresh");

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
        aria-labelledby="title-jwt-refresh"
        className="h-auto w-full"
        role="img"
        viewBox="0 0 720 430"
      >
        <title id="title-jwt-refresh">{t("description")}</title>

        <g id="edges">
          <path
            d="M 202 176 C 320 176, 340 82, 500 82"
            fill="none"
            id="edge-client-api"
            stroke="#3d3d3d"
            strokeWidth="1.25"
          />
          <path
            d="M 202 210 C 224 210, 240 210, 262 210"
            fill="none"
            id="edge-client-auth"
            stroke="#3d3d3d"
            strokeWidth="1.25"
          />
          <path
            d="M 442 220 C 470 220, 476 300, 500 300"
            fill="none"
            id="edge-auth-store"
            stroke="#3d3d3d"
            strokeWidth="1.25"
          />
          <path
            d="M 500 360 C 380 408, 200 400, 117 246"
            fill="none"
            id="edge-store-client"
            stroke="#7ee787"
            strokeWidth="1.25"
          />
        </g>

        <g id="nodes">
          <g id="node-client">
            <rect
              fill="#111111"
              height="96"
              rx="12"
              stroke="#2a2a2a"
              strokeWidth="1"
              width="170"
              x="32"
              y="150"
            />
            <text fill="#fafafa" fontSize="13" fontWeight="600" x="50" y="180">
              {t("nodes.client")}
            </text>
            <text
              fill="#a1a1a1"
              fontFamily="monospace"
              fontSize="10"
              x="50"
              y="202"
            >
              access · 15 min
            </text>
            <text
              fill="#6b6b6b"
              fontFamily="monospace"
              fontSize="10"
              x="50"
              y="220"
            >
              refresh · 30 d
            </text>
          </g>

          <g id="node-api">
            <rect
              fill="#111111"
              height="84"
              rx="12"
              stroke="#2a2a2a"
              strokeWidth="1"
              width="188"
              x="500"
              y="40"
            />
            <text fill="#fafafa" fontSize="13" fontWeight="600" x="518" y="70">
              {t("nodes.api")}
            </text>
            <text
              fill="#ff7b72"
              fontFamily="monospace"
              fontSize="10"
              id="badge-api-401"
              x="518"
              y="96"
            >
              {t("nodes.api401")}
            </text>
            <text
              fill="#7ee787"
              fontFamily="monospace"
              fontSize="10"
              id="badge-api-200"
              x="518"
              y="96"
            >
              {t("nodes.api200")}
            </text>
          </g>

          <g id="node-auth">
            <rect
              fill="#111111"
              height="96"
              rx="12"
              stroke="#2a2a2a"
              strokeWidth="1"
              width="180"
              x="262"
              y="150"
            />
            <text fill="#fafafa" fontSize="13" fontWeight="600" x="280" y="180">
              POST /refresh
            </text>
            <text
              fill="#a1a1a1"
              fontFamily="monospace"
              fontSize="10"
              x="280"
              y="202"
            >
              cookie httpOnly
            </text>
            <text
              fill="#6b6b6b"
              fontFamily="monospace"
              fontSize="10"
              x="280"
              y="220"
            >
              {t("nodes.authMeta")}
            </text>
          </g>

          <g id="node-store">
            <rect
              fill="#111111"
              height="140"
              rx="12"
              stroke="#2a2a2a"
              strokeWidth="1"
              width="188"
              x="500"
              y="250"
            />
            <text fill="#fafafa" fontSize="13" fontWeight="600" x="516" y="278">
              refresh_tokens
            </text>

            <g id="row-old">
              <rect
                fill="#1a1a1a"
                height="34"
                rx="8"
                stroke="#2a2a2a"
                strokeWidth="1"
                width="160"
                x="514"
                y="290"
              />
              <text
                fill="#a1a1a1"
                fontFamily="monospace"
                fontSize="10"
                x="526"
                y="306"
              >
                rt_9f3c...
              </text>
              <text
                fill="#7ee787"
                fontFamily="monospace"
                fontSize="10"
                id="state-old-valid"
                x="526"
                y="320"
              >
                {t("nodes.stateValid")}
              </text>
              <text
                fill="#ff7b72"
                fontFamily="monospace"
                fontSize="10"
                id="state-old-used"
                x="526"
                y="320"
              >
                {t("nodes.stateUsed")}
              </text>
            </g>

            <g id="row-new">
              <rect
                fill="#1a1a1a"
                height="34"
                rx="8"
                stroke="#2a2a2a"
                strokeWidth="1"
                width="160"
                x="514"
                y="334"
              />
              <text
                fill="#a1a1a1"
                fontFamily="monospace"
                fontSize="10"
                x="526"
                y="350"
              >
                rt_a71b...
              </text>
              <text
                fill="#7ee787"
                fontFamily="monospace"
                fontSize="10"
                id="state-new-valid"
                x="526"
                y="364"
              >
                {t("nodes.stateValid")}
              </text>
              <text
                fill="#ff7b72"
                fontFamily="monospace"
                fontSize="10"
                id="state-new-revoked"
                x="526"
                y="364"
              >
                {t("nodes.stateRevoked")}
              </text>
            </g>
          </g>
        </g>

        <g id="labels">
          <g id="label-reuse">
            <rect
              fill="#0a0a0a"
              height="20"
              rx="10"
              stroke="#ff7b72"
              strokeWidth="1"
              width="214"
              x="474"
              y="212"
            />
            <text
              fill="#ff7b72"
              fontFamily="monospace"
              fontSize="10"
              x="488"
              y="226"
            >
              {t("nodes.reuseBadge")}
            </text>
          </g>
        </g>

        <g id="pulses">
          <circle fill="#fafafa" id="pulse-request" r="4" />
          <circle fill="#fafafa" id="pulse-refresh" r="4" />
          <circle fill="#7ee787" id="pulse-access" r="4" />
        </g>
      </svg>
    </ConceptAnimationFrame>
  );
}
