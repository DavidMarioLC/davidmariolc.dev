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
 * What the server actually does with a token on every request — three checks
 * that touch nothing but the token itself and the secret already in memory.
 */
const STEP_SEQUENCE = [
  { id: "arrive", label: "step-1-arrive" },
  { id: "split", label: "step-2-split" },
  { id: "signature", label: "step-3-signature" },
  { id: "expiry", label: "step-4-expiry" },
  { id: "serve", label: "step-5-serve" },
  { id: "stateless", label: "step-6-stateless" },
] as const;

export function buildTimeline(root: SVGSVGElement) {
  const q = gsap.utils.selector(root);
  const tl = gsap.timeline({
    defaults: { duration: 0.5, ease: "power2.out" },
    paused: true,
  });

  tl.set(q("[id^='node-']"), { opacity: 0.35 });
  tl.set(q("#node-db"), { autoAlpha: 0 });
  tl.set(q("[id^='edge-']"), { drawSVG: "0% 0%" });
  tl.set(q("[id^='pulse-']"), { autoAlpha: 0 });
  tl.set(q("[id^='check-']"), { opacity: 0.25 });
  tl.set(q("#reason-signature, #reason-expiry"), { autoAlpha: 0 });

  tl.to(q("#node-request"), { opacity: 1 });
  tl.to(q("#edge-request-verify"), { drawSVG: "100%" }, "<");
  tl.to(q("#node-verify"), { opacity: 1 }, "<0.15");
  tl.fromTo(
    q("#pulse-request"),
    { autoAlpha: 0 },
    {
      autoAlpha: 1,
      duration: 0.6,
      ease: "power1.inOut",
      motionPath: {
        align: "#edge-request-verify",
        alignOrigin: [0.5, 0.5],
        path: "#edge-request-verify",
      },
    },
    "<0.1"
  );
  tl.to(q("#pulse-request"), { autoAlpha: 0, duration: 0.2 });
  tl.addLabel("step-1-arrive");

  tl.to(q("#check-format"), { opacity: 1 });
  tl.addLabel("step-2-split");

  tl.to(q("#check-signature"), { opacity: 1 });
  tl.to(q("#edge-verify-denied"), { drawSVG: "100%" }, "<0.15");
  tl.to(q("#node-denied"), { opacity: 1 }, "<0.15");
  tl.to(q("#reason-signature"), { autoAlpha: 1 }, "<0.15");
  tl.addLabel("step-3-signature");

  tl.to(q("#check-expiry"), { opacity: 1 });
  tl.to(q("#reason-expiry"), { autoAlpha: 1 }, "<0.15");
  tl.addLabel("step-4-expiry");

  tl.to(q("#edge-verify-ok"), { drawSVG: "100%" });
  tl.to(q("#node-ok"), { opacity: 1 }, "<0.15");
  tl.addLabel("step-5-serve");

  tl.to(q("#node-db"), { autoAlpha: 0.55 });
  tl.addLabel("step-6-stateless");

  return tl;
}

export default function JwtValidation() {
  const t = useTranslations("animations.jwtValidation");

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
        aria-labelledby="title-jwt-validation"
        className="h-auto w-full"
        role="img"
        viewBox="0 0 720 420"
      >
        <title id="title-jwt-validation">{t("description")}</title>

        <g id="edges">
          <path
            d="M 222 188 C 234 188, 240 188, 252 188"
            fill="none"
            id="edge-request-verify"
            stroke="#3d3d3d"
            strokeWidth="1.25"
          />
          <path
            d="M 448 160 C 480 160, 496 132, 524 132"
            fill="none"
            id="edge-verify-ok"
            stroke="#7ee787"
            strokeWidth="1.25"
          />
          <path
            d="M 448 216 C 480 216, 496 262, 524 262"
            fill="none"
            id="edge-verify-denied"
            stroke="#ff7b72"
            strokeWidth="1.25"
          />
        </g>

        <g id="nodes">
          <g id="node-request">
            <rect
              fill="#111111"
              height="96"
              rx="12"
              stroke="#2a2a2a"
              strokeWidth="1"
              width="190"
              x="32"
              y="140"
            />
            <text fill="#fafafa" fontSize="13" fontWeight="600" x="50" y="170">
              {t("nodes.request")}
            </text>
            <text
              fill="#a1a1a1"
              fontFamily="monospace"
              fontSize="10"
              x="50"
              y="192"
            >
              GET /orders
            </text>
            <text
              fill="#6b6b6b"
              fontFamily="monospace"
              fontSize="10"
              x="50"
              y="210"
            >
              Authorization: Bearer
            </text>
          </g>

          <g id="node-verify">
            <rect
              fill="#111111"
              height="256"
              rx="12"
              stroke="#2a2a2a"
              strokeWidth="1"
              width="196"
              x="252"
              y="60"
            />
            <text fill="#fafafa" fontSize="13" fontWeight="600" x="268" y="88">
              {t("nodes.verify")}
            </text>

            <g id="check-format">
              <rect
                fill="#1a1a1a"
                height="60"
                rx="8"
                stroke="#2a2a2a"
                strokeWidth="1"
                width="168"
                x="266"
                y="100"
              />
              <text
                fill="#fafafa"
                fontFamily="monospace"
                fontSize="11"
                x="280"
                y="124"
              >
                token.split(&apos;.&apos;)
              </text>
              <text
                fill="#6b6b6b"
                fontFamily="monospace"
                fontSize="10"
                x="280"
                y="144"
              >
                {t("checks.formatMeta")}
              </text>
            </g>

            <g id="check-signature">
              <rect
                fill="#1a1a1a"
                height="60"
                rx="8"
                stroke="#2a2a2a"
                strokeWidth="1"
                width="168"
                x="266"
                y="168"
              />
              <text
                fill="#fafafa"
                fontFamily="monospace"
                fontSize="11"
                x="280"
                y="192"
              >
                hmac(...) == sig
              </text>
              <text
                fill="#6b6b6b"
                fontFamily="monospace"
                fontSize="10"
                x="280"
                y="212"
              >
                {t("checks.signatureMeta")}
              </text>
            </g>

            <g id="check-expiry">
              <rect
                fill="#1a1a1a"
                height="60"
                rx="8"
                stroke="#2a2a2a"
                strokeWidth="1"
                width="168"
                x="266"
                y="236"
              />
              <text
                fill="#fafafa"
                fontFamily="monospace"
                fontSize="11"
                x="280"
                y="260"
              >
                exp &gt; now()
              </text>
              <text
                fill="#6b6b6b"
                fontFamily="monospace"
                fontSize="10"
                x="280"
                y="280"
              >
                {t("checks.expiryMeta")}
              </text>
            </g>
          </g>

          <g id="node-ok">
            <rect
              fill="#111111"
              height="72"
              rx="12"
              stroke="#2a2a2a"
              strokeWidth="1"
              width="170"
              x="524"
              y="96"
            />
            <text
              fill="#7ee787"
              fontFamily="monospace"
              fontSize="13"
              fontWeight="600"
              x="542"
              y="128"
            >
              200 OK
            </text>
            <text
              fill="#6b6b6b"
              fontFamily="monospace"
              fontSize="10"
              x="542"
              y="148"
            >
              {t("nodes.okMeta")}
            </text>
          </g>

          <g id="node-denied">
            <rect
              fill="#111111"
              height="96"
              rx="12"
              stroke="#2a2a2a"
              strokeWidth="1"
              width="170"
              x="524"
              y="224"
            />
            <text
              fill="#ff7b72"
              fontFamily="monospace"
              fontSize="13"
              fontWeight="600"
              x="542"
              y="254"
            >
              401
            </text>
            <text
              fill="#a1a1a1"
              fontFamily="monospace"
              fontSize="10"
              id="reason-signature"
              x="542"
              y="278"
            >
              {t("nodes.reasonSignature")}
            </text>
            <text
              fill="#a1a1a1"
              fontFamily="monospace"
              fontSize="10"
              id="reason-expiry"
              x="542"
              y="298"
            >
              {t("nodes.reasonExpiry")}
            </text>
          </g>

          <g id="node-db">
            <rect
              fill="#0a0a0a"
              height="52"
              rx="12"
              stroke="#2a2a2a"
              strokeDasharray="4 4"
              strokeWidth="1"
              width="196"
              x="252"
              y="344"
            />
            <text
              fill="#6b6b6b"
              fontFamily="monospace"
              fontSize="11"
              x="268"
              y="376"
            >
              {t("nodes.dbMeta")}
            </text>
          </g>
        </g>

        <g id="pulses">
          <circle fill="#fafafa" id="pulse-request" r="4" />
        </g>
      </svg>
    </ConceptAnimationFrame>
  );
}
