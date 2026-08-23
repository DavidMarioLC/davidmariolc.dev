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
 * The payoff of the whole post: logging out deletes what the server stores and
 * what the client holds, and a copy of the access token outlives both — unless
 * you put state back in front of every request.
 */
const STEP_SEQUENCE = [
  { id: "clear", label: "step-1-clear" },
  { id: "revoke", label: "step-2-revoke" },
  { id: "copy", label: "step-3-copy" },
  { id: "denylist", label: "step-4-denylist" },
  { id: "tradeoff", label: "step-5-tradeoff" },
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
  tl.set(
    q(
      "#badge-cleared, #state-deleted, #badge-api-200, #badge-api-401, #badge-stateful, #label-window"
    ),
    { autoAlpha: 0 }
  );

  tl.to(q("#node-client"), { opacity: 1 });
  tl.to(q("#badge-cleared"), { autoAlpha: 1 }, "<0.2");
  tl.addLabel("step-1-clear");

  tl.to(q("#edge-client-store"), { drawSVG: "100%" });
  tl.to(q("#node-store"), { opacity: 1 }, "<0.15");
  tl.to(q("#state-deleted"), { autoAlpha: 1 }, "<0.2");
  tl.addLabel("step-2-revoke");

  tl.to(q("#node-copy"), { opacity: 1 });
  tl.to(q("#edge-copy-api"), { drawSVG: "100%" }, "<0.15");
  tl.fromTo(
    q("#pulse-copy"),
    { autoAlpha: 0 },
    {
      autoAlpha: 1,
      duration: 0.6,
      ease: "power1.inOut",
      motionPath: {
        align: "#edge-copy-api",
        alignOrigin: [0.5, 0.5],
        path: "#edge-copy-api",
      },
    },
    "<0.1"
  );
  tl.to(q("#pulse-copy"), { autoAlpha: 0, duration: 0.2 });
  tl.to(q("#node-api"), { opacity: 1 }, "<");
  tl.to(q("#badge-api-200"), { autoAlpha: 1 }, "<0.1");
  tl.addLabel("step-3-copy");

  tl.to(q("#edge-api-denylist"), { drawSVG: "100%" });
  tl.to(q("#node-denylist"), { opacity: 1 }, "<0.15");
  tl.to(q("#badge-api-200"), { autoAlpha: 0, duration: 0.3 }, "<0.2");
  tl.to(q("#badge-api-401"), { autoAlpha: 1, duration: 0.3 }, "<0.15");
  tl.addLabel("step-4-denylist");

  tl.to(q("#badge-stateful"), { autoAlpha: 1 });
  tl.to(q("#label-window"), { autoAlpha: 1 }, "<0.1");
  tl.addLabel("step-5-tradeoff");

  return tl;
}

export default function JwtLogout() {
  const t = useTranslations("animations.jwtLogout");

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
        aria-labelledby="title-jwt-logout"
        className="h-auto w-full"
        role="img"
        viewBox="0 0 720 400"
      >
        <title id="title-jwt-logout">{t("description")}</title>

        <g id="edges">
          <path
            d="M 220 92 C 250 92, 270 92, 300 92"
            fill="none"
            id="edge-client-store"
            stroke="#3d3d3d"
            strokeWidth="1.25"
          />
          <path
            d="M 232 298 C 254 298, 278 298, 300 298"
            fill="none"
            id="edge-copy-api"
            stroke="#3d3d3d"
            strokeWidth="1.25"
          />
          <path
            d="M 470 298 C 492 298, 508 298, 530 298"
            fill="none"
            id="edge-api-denylist"
            stroke="#3d3d3d"
            strokeWidth="1.25"
          />
        </g>

        <g id="nodes">
          <g id="node-client">
            <rect
              fill="#111111"
              height="88"
              rx="12"
              stroke="#2a2a2a"
              strokeWidth="1"
              width="188"
              x="32"
              y="48"
            />
            <text fill="#fafafa" fontSize="13" fontWeight="600" x="50" y="78">
              {t("nodes.client")}
            </text>
            <text
              fill="#a1a1a1"
              fontFamily="monospace"
              fontSize="10"
              x="50"
              y="100"
            >
              POST /logout
            </text>
            <text
              fill="#6b6b6b"
              fontFamily="monospace"
              fontSize="10"
              id="badge-cleared"
              x="50"
              y="118"
            >
              {t("nodes.cleared")}
            </text>
          </g>

          <g id="node-store">
            <rect
              fill="#111111"
              height="88"
              rx="12"
              stroke="#2a2a2a"
              strokeWidth="1"
              width="200"
              x="300"
              y="48"
            />
            <text fill="#fafafa" fontSize="13" fontWeight="600" x="318" y="78">
              refresh_tokens
            </text>
            <text
              fill="#a1a1a1"
              fontFamily="monospace"
              fontSize="10"
              x="318"
              y="100"
            >
              DELETE rt_9f3c...
            </text>
            <text
              fill="#7ee787"
              fontFamily="monospace"
              fontSize="10"
              id="state-deleted"
              x="318"
              y="118"
            >
              {t("nodes.revoked")}
            </text>
          </g>

          <g id="node-copy">
            <rect
              fill="#111111"
              height="100"
              rx="12"
              stroke="#2a2a2a"
              strokeWidth="1"
              width="200"
              x="32"
              y="248"
            />
            <text fill="#fafafa" fontSize="13" fontWeight="600" x="50" y="278">
              {t("nodes.copy")}
            </text>
            <text
              fill="#a1a1a1"
              fontFamily="monospace"
              fontSize="10"
              x="50"
              y="300"
            >
              {t("nodes.copyMeta")}
            </text>
            <text
              fill="#6b6b6b"
              fontFamily="monospace"
              fontSize="10"
              x="50"
              y="318"
            >
              exp - now = 11 min
            </text>
          </g>

          <g id="node-api">
            <rect
              fill="#111111"
              height="100"
              rx="12"
              stroke="#2a2a2a"
              strokeWidth="1"
              width="170"
              x="300"
              y="248"
            />
            <text fill="#fafafa" fontSize="13" fontWeight="600" x="318" y="278">
              {t("nodes.api")}
            </text>
            <text
              fill="#ff7b72"
              fontFamily="monospace"
              fontSize="10"
              id="badge-api-200"
              x="318"
              y="302"
            >
              {t("nodes.api200")}
            </text>
            <text
              fill="#7ee787"
              fontFamily="monospace"
              fontSize="10"
              id="badge-api-401"
              x="318"
              y="302"
            >
              {t("nodes.api401")}
            </text>
          </g>

          <g id="node-denylist">
            <rect
              fill="#111111"
              height="100"
              rx="12"
              stroke="#2a2a2a"
              strokeWidth="1"
              width="170"
              x="530"
              y="248"
            />
            <text fill="#fafafa" fontSize="13" fontWeight="600" x="548" y="278">
              denylist
            </text>
            <text
              fill="#a1a1a1"
              fontFamily="monospace"
              fontSize="10"
              x="548"
              y="300"
            >
              jti : ttl = exp
            </text>
            <text
              fill="#6b6b6b"
              fontFamily="monospace"
              fontSize="10"
              id="badge-stateful"
              x="548"
              y="318"
            >
              {t("nodes.stateful")}
            </text>
          </g>
        </g>

        <g id="labels">
          <g id="label-window">
            <rect
              fill="#0a0a0a"
              height="20"
              rx="10"
              stroke="#2a2a2a"
              strokeWidth="1"
              width="320"
              x="200"
              y="180"
            />
            <text
              fill="#a1a1a1"
              fontFamily="monospace"
              fontSize="10"
              x="216"
              y="194"
            >
              {t("nodes.tradeoff")}
            </text>
          </g>
        </g>

        <g id="pulses">
          <circle fill="#fafafa" id="pulse-copy" r="4" />
        </g>
      </svg>
    </ConceptAnimationFrame>
  );
}
