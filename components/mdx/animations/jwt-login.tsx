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
 * How credentials become a signed token — the one moment in the whole pattern
 * where the password takes part, and the moment the server stops keeping
 * anything.
 */
const STEP_SEQUENCE = [
  { id: "credentials", label: "step-1-credentials" },
  { id: "verify", label: "step-2-verify" },
  { id: "sign", label: "step-3-sign" },
  { id: "deliver", label: "step-4-deliver" },
  { id: "forget", label: "step-5-forget" },
] as const;

export function buildTimeline(root: SVGSVGElement) {
  const q = gsap.utils.selector(root);
  const tl = gsap.timeline({
    defaults: { duration: 0.5, ease: "power2.out" },
    paused: true,
  });

  // Resting state. Idempotent, so `seek(0)` always lands back here.
  tl.set(q("[id^='node-']"), { opacity: 0.35 });
  tl.set(q("#node-token"), { autoAlpha: 0 });
  tl.set(q("[id^='edge-']"), { drawSVG: "0% 0%", opacity: 1 });
  tl.set(q("[id^='pulse-']"), { autoAlpha: 0 });
  tl.set(q("[id^='seg-']"), { opacity: 0 });
  tl.set(q("#badge-stateless, #label-compare"), { autoAlpha: 0 });

  tl.to(q("#node-browser"), { opacity: 1 });
  tl.to(q("#edge-browser-server"), { drawSVG: "100%" }, "<");
  tl.fromTo(
    q("#pulse-credentials"),
    { autoAlpha: 0 },
    {
      autoAlpha: 1,
      duration: 0.7,
      ease: "power1.inOut",
      motionPath: {
        align: "#edge-browser-server",
        alignOrigin: [0.5, 0.5],
        path: "#edge-browser-server",
      },
    },
    "<0.1"
  );
  tl.to(q("#pulse-credentials"), { autoAlpha: 0, duration: 0.2 });
  tl.addLabel("step-1-credentials");

  tl.to(q("#node-server"), { opacity: 1 });
  tl.to(q("#edge-server-db"), { drawSVG: "100%" }, "<");
  tl.to(q("#node-db"), { opacity: 1 }, "<0.15");
  tl.to(q("#label-compare"), { autoAlpha: 1 }, "<0.15");
  tl.addLabel("step-2-verify");

  tl.to(q("#edge-server-token"), { drawSVG: "100%" });
  tl.to(q("#node-token"), { autoAlpha: 1 }, "<0.2");
  tl.to(q("#seg-header, #seg-payload"), { opacity: 1, stagger: 0.08 }, "<0.2");
  tl.to(q("#seg-signature"), { opacity: 1 });
  tl.addLabel("step-3-sign");

  tl.to(q("#edge-token-browser"), { drawSVG: "100%" });
  tl.fromTo(
    q("#pulse-token"),
    { autoAlpha: 0 },
    {
      autoAlpha: 1,
      duration: 0.8,
      ease: "power1.inOut",
      motionPath: {
        align: "#edge-token-browser",
        alignOrigin: [0.5, 0.5],
        path: "#edge-token-browser",
      },
    },
    "<0.1"
  );
  tl.to(q("#pulse-token"), { autoAlpha: 0, duration: 0.2 });
  tl.addLabel("step-4-deliver");

  tl.to(q("#badge-stateless"), { autoAlpha: 1 });
  tl.to(q("#node-db"), { opacity: 0.35 }, "<");
  tl.to(q("#edge-server-db, #edge-browser-server"), { opacity: 0.25 }, "<");
  tl.addLabel("step-5-forget");

  return tl;
}

export default function JwtLogin() {
  const t = useTranslations("animations.jwtLogin");

  // Memoised: the frame keys its timeline on `steps`, so a fresh array on every render
  // would rebuild it and drop the reader back on step one.
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
        aria-labelledby="title-jwt-login"
        className="h-auto w-full"
        role="img"
        viewBox="0 0 720 400"
      >
        <title id="title-jwt-login">{t("description")}</title>

        <g id="edges">
          <path
            d="M 216 98 C 240 98, 248 98, 272 98"
            fill="none"
            id="edge-browser-server"
            stroke="#3d3d3d"
            strokeWidth="1.25"
          />
          <path
            d="M 448 98 C 472 98, 480 98, 504 98"
            fill="none"
            id="edge-server-db"
            stroke="#3d3d3d"
            strokeWidth="1.25"
          />
          <path
            d="M 360 140 C 360 180, 360 200, 360 232"
            fill="none"
            id="edge-server-token"
            stroke="#3d3d3d"
            strokeWidth="1.25"
          />
          <path
            d="M 250 298 C 170 298, 128 224, 128 140"
            fill="none"
            id="edge-token-browser"
            stroke="#3d3d3d"
            strokeWidth="1.25"
          />
        </g>

        <g id="nodes">
          <g id="node-browser">
            <rect
              fill="#111111"
              height="84"
              rx="12"
              stroke="#2a2a2a"
              strokeWidth="1"
              width="176"
              x="40"
              y="56"
            />
            <text fill="#fafafa" fontSize="13" fontWeight="600" x="58" y="88">
              {t("nodes.browser")}
            </text>
            <text
              fill="#a1a1a1"
              fontFamily="monospace"
              fontSize="10"
              x="58"
              y="110"
            >
              POST /login
            </text>
            <text
              fill="#6b6b6b"
              fontFamily="monospace"
              fontSize="10"
              x="58"
              y="126"
            >
              {t("nodes.browserMeta")}
            </text>
          </g>

          <g id="node-server">
            <rect
              fill="#111111"
              height="84"
              rx="12"
              stroke="#2a2a2a"
              strokeWidth="1"
              width="176"
              x="272"
              y="56"
            />
            <text fill="#fafafa" fontSize="13" fontWeight="600" x="290" y="88">
              {t("nodes.server")}
            </text>
            <text
              fill="#a1a1a1"
              fontFamily="monospace"
              fontSize="10"
              x="290"
              y="110"
            >
              {t("nodes.serverMeta")}
            </text>
          </g>

          <g id="node-db">
            <rect
              fill="#111111"
              height="84"
              rx="12"
              stroke="#2a2a2a"
              strokeWidth="1"
              width="176"
              x="504"
              y="56"
            />
            <text fill="#fafafa" fontSize="13" fontWeight="600" x="522" y="88">
              {t("nodes.users")}
            </text>
            <text
              fill="#a1a1a1"
              fontFamily="monospace"
              fontSize="10"
              x="522"
              y="110"
            >
              {t("nodes.usersMeta")}
            </text>
          </g>

          <g id="node-token">
            <rect
              fill="#111111"
              height="132"
              rx="12"
              stroke="#2a2a2a"
              strokeWidth="1"
              width="220"
              x="250"
              y="232"
            />
            <text fill="#fafafa" fontSize="13" fontWeight="600" x="266" y="260">
              {t("nodes.token")}
            </text>
            <g id="seg-header">
              <rect
                fill="#1a1a1a"
                height="24"
                rx="6"
                stroke="#2a2a2a"
                strokeWidth="1"
                width="188"
                x="266"
                y="272"
              />
              <text
                fill="#a1a1a1"
                fontFamily="monospace"
                fontSize="10"
                x="278"
                y="288"
              >
                header · alg: HS256
              </text>
            </g>
            <g id="seg-payload">
              <rect
                fill="#1a1a1a"
                height="24"
                rx="6"
                stroke="#2a2a2a"
                strokeWidth="1"
                width="188"
                x="266"
                y="302"
              />
              <text
                fill="#a1a1a1"
                fontFamily="monospace"
                fontSize="10"
                x="278"
                y="318"
              >
                payload · sub, exp
              </text>
            </g>
            <g id="seg-signature">
              <rect
                fill="#1a1a1a"
                height="24"
                rx="6"
                stroke="#d2a8ff"
                strokeWidth="1"
                width="188"
                x="266"
                y="332"
              />
              <text
                fill="#d2a8ff"
                fontFamily="monospace"
                fontSize="10"
                x="278"
                y="348"
              >
                signature · HMAC(secret)
              </text>
            </g>
          </g>
        </g>

        <g id="labels">
          <g id="label-compare">
            <rect
              fill="#0a0a0a"
              height="20"
              rx="10"
              stroke="#2a2a2a"
              strokeWidth="1"
              width="146"
              x="504"
              y="22"
            />
            <text
              fill="#a1a1a1"
              fontFamily="monospace"
              fontSize="10"
              x="518"
              y="36"
            >
              bcrypt.compare(...)
            </text>
          </g>
          <g id="badge-stateless">
            <rect
              fill="#0a0a0a"
              height="20"
              rx="10"
              stroke="#2a2a2a"
              strokeWidth="1"
              width="176"
              x="272"
              y="154"
            />
            <text
              fill="#a1a1a1"
              fontFamily="monospace"
              fontSize="10"
              x="286"
              y="168"
            >
              {t("nodes.statelessBadge")}
            </text>
          </g>
        </g>

        <g id="pulses">
          <circle fill="#ffa657" id="pulse-credentials" r="4" />
          <circle fill="#d2a8ff" id="pulse-token" r="4" />
        </g>
      </svg>
    </ConceptAnimationFrame>
  );
}
