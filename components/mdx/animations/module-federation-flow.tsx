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
 * How a bundle imports a module from another bundle it never met: two builds
 * that share nothing but a URL, and a negotiation that happens in the browser.
 */
const STEP_SEQUENCE = [
  { id: "expose", label: "step-1-expose" },
  { id: "reference", label: "step-2-reference" },
  { id: "boot", label: "step-3-boot" },
  { id: "fetch", label: "step-4-fetch" },
  { id: "shared", label: "step-5-shared" },
  { id: "mount", label: "step-6-mount" },
] as const;

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
  tl.set(q("[id^='label-']"), { autoAlpha: 0 });
  tl.set(q("[id^='pulse-']"), { autoAlpha: 0 });

  tl.to(q("#node-remote-build"), { opacity: 1 });
  tl.to(q("#edge-remote-entry"), { drawSVG: "100%" }, "<0.15");
  tl.to(q("#node-remote-entry"), { opacity: 1 }, "<0.2");
  tl.addLabel("step-1-expose");

  tl.to(q("#node-host-build"), { opacity: 1 });
  tl.to(q("#edge-host-bundle"), { drawSVG: "100%" }, "<0.15");
  tl.to(q("#node-host-bundle"), { opacity: 1 }, "<0.2");
  tl.to(q("#label-separate"), { autoAlpha: 1 }, "<0.1");
  tl.addLabel("step-2-reference");

  tl.to(q("#edge-bundle-browser"), { drawSVG: "100%" });
  tl.fromTo(
    q("#pulse-host"),
    { autoAlpha: 0 },
    {
      autoAlpha: 1,
      duration: 0.7,
      ease: "power1.inOut",
      motionPath: {
        align: "#edge-bundle-browser",
        alignOrigin: [0.5, 0.5],
        path: "#edge-bundle-browser",
      },
    },
    "<0.1"
  );
  tl.to(q("#pulse-host"), { autoAlpha: 0, duration: 0.2 });
  tl.to(q("#node-browser"), { opacity: 1 }, "<");
  tl.to(q("#badge-host-running"), { autoAlpha: 1 }, "<0.1");
  tl.addLabel("step-3-boot");

  tl.to(q("#edge-entry-browser"), { drawSVG: "100%" });
  tl.fromTo(
    q("#pulse-entry"),
    { autoAlpha: 0 },
    {
      autoAlpha: 1,
      duration: 0.7,
      ease: "power1.inOut",
      motionPath: {
        align: "#edge-entry-browser",
        alignOrigin: [0.5, 0.5],
        path: "#edge-entry-browser",
      },
    },
    "<0.1"
  );
  tl.to(q("#pulse-entry"), { autoAlpha: 0, duration: 0.2 });
  tl.to(q("#badge-fetch"), { autoAlpha: 1 }, "<");
  tl.addLabel("step-4-fetch");

  tl.to(q("#badge-shared"), { autoAlpha: 1 });
  tl.addLabel("step-5-shared");

  tl.to(q("#badge-mount"), { autoAlpha: 1 });
  tl.to(q("#badge-seam"), { autoAlpha: 1 }, "<0.15");
  tl.addLabel("step-6-mount");

  return tl;
}

export default function ModuleFederationFlow() {
  const t = useTranslations("animations.moduleFederationFlow");

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
        aria-labelledby="title-module-federation-flow"
        className="h-auto w-full"
        role="img"
        viewBox="0 0 720 450"
      >
        <title id="title-module-federation-flow">{t("description")}</title>

        <g id="edges">
          <path
            d="M 129 116 C 129 128, 129 138, 129 150"
            fill="none"
            id="edge-remote-entry"
            stroke="#3d3d3d"
            strokeWidth="1.25"
          />
          <path
            d="M 591 116 C 591 128, 591 138, 591 150"
            fill="none"
            id="edge-host-bundle"
            stroke="#3d3d3d"
            strokeWidth="1.25"
          />
          <path
            d="M 591 222 C 591 248, 528 252, 500 274"
            fill="none"
            id="edge-bundle-browser"
            stroke="#3d3d3d"
            strokeWidth="1.25"
          />
          <path
            d="M 129 222 C 129 248, 192 252, 220 274"
            fill="none"
            id="edge-entry-browser"
            stroke="#79c0ff"
            strokeWidth="1.25"
          />
        </g>

        <g id="nodes">
          <g id="node-remote-build">
            <rect
              fill="#111111"
              height="86"
              rx="12"
              stroke="#2a2a2a"
              strokeWidth="1"
              width="210"
              x="24"
              y="30"
            />
            <text fill="#fafafa" fontSize="13" fontWeight="600" x="40" y="60">
              {t("nodes.remoteBuild")}
            </text>
            <text
              fill="#a1a1a1"
              fontFamily="monospace"
              fontSize="10"
              x="40"
              y="80"
            >
              exposes: ./Summary
            </text>
            <text
              fill="#6b6b6b"
              fontFamily="monospace"
              fontSize="10"
              x="40"
              y="96"
            >
              {t("nodes.remoteBuildMeta")}
            </text>
          </g>

          <g id="node-remote-entry">
            <rect
              fill="#111111"
              height="72"
              rx="12"
              stroke="#2a2a2a"
              strokeWidth="1"
              width="210"
              x="24"
              y="150"
            />
            <text
              fill="#d2a8ff"
              fontFamily="monospace"
              fontSize="12"
              x="40"
              y="180"
            >
              remoteEntry.js
            </text>
            <text
              fill="#a1a1a1"
              fontFamily="monospace"
              fontSize="10"
              x="40"
              y="200"
            >
              {t("nodes.manifestMeta")}
            </text>
          </g>

          <g id="node-host-build">
            <rect
              fill="#111111"
              height="86"
              rx="12"
              stroke="#2a2a2a"
              strokeWidth="1"
              width="210"
              x="486"
              y="30"
            />
            <text fill="#fafafa" fontSize="13" fontWeight="600" x="502" y="60">
              {t("nodes.hostBuild")}
            </text>
            <text
              fill="#a1a1a1"
              fontFamily="monospace"
              fontSize="10"
              x="502"
              y="80"
            >
              remotes: cart
            </text>
            <text
              fill="#6b6b6b"
              fontFamily="monospace"
              fontSize="10"
              x="502"
              y="96"
            >
              {t("nodes.hostBuildMeta")}
            </text>
          </g>

          <g id="node-host-bundle">
            <rect
              fill="#111111"
              height="72"
              rx="12"
              stroke="#2a2a2a"
              strokeWidth="1"
              width="210"
              x="486"
              y="150"
            />
            <text fill="#fafafa" fontSize="13" fontWeight="600" x="502" y="180">
              {t("nodes.hostBundle")}
            </text>
            <text
              fill="#a1a1a1"
              fontFamily="monospace"
              fontSize="10"
              x="502"
              y="200"
            >
              {t("nodes.hostBundleMeta")}
            </text>
          </g>

          <g id="node-browser">
            <rect
              fill="#111111"
              height="164"
              rx="12"
              stroke="#2a2a2a"
              strokeWidth="1"
              width="440"
              x="140"
              y="274"
            />
            <text fill="#fafafa" fontSize="13" fontWeight="600" x="160" y="302">
              {t("nodes.browser")}
            </text>
          </g>
        </g>

        <g id="labels">
          <g id="label-separate">
            <path
              d="M 360 24 L 360 240"
              stroke="#2a2a2a"
              strokeDasharray="4 4"
              strokeWidth="1"
            />
            <rect
              fill="#0a0a0a"
              height="20"
              rx="10"
              stroke="#2a2a2a"
              strokeWidth="1"
              width="196"
              x="262"
              y="122"
            />
            <text
              fill="#6b6b6b"
              fontFamily="monospace"
              fontSize="10"
              textAnchor="middle"
              x="360"
              y="136"
            >
              {t("labels.separateBuilds")}
            </text>
          </g>

          <g id="badge-host-running">
            <rect
              fill="#1a1a1a"
              height="20"
              rx="10"
              stroke="#2a2a2a"
              strokeWidth="1"
              width="182"
              x="378"
              y="288"
            />
            <text
              fill="#a1a1a1"
              fontFamily="monospace"
              fontSize="10"
              x="390"
              y="302"
            >
              {t("badges.hostRunning")}
            </text>
          </g>

          <g id="badge-fetch">
            <rect
              fill="#1a1a1a"
              height="22"
              rx="11"
              stroke="#79c0ff"
              strokeWidth="1"
              width="256"
              x="160"
              y="320"
            />
            <text
              fill="#79c0ff"
              fontFamily="monospace"
              fontSize="10"
              x="172"
              y="335"
            >
              GET /cart/remoteEntry.js
            </text>
          </g>

          <g id="badge-shared">
            <rect
              fill="#1a1a1a"
              height="22"
              rx="11"
              stroke="#2a2a2a"
              strokeWidth="1"
              width="380"
              x="160"
              y="352"
            />
            <text
              fill="#a1a1a1"
              fontFamily="monospace"
              fontSize="10"
              x="172"
              y="367"
            >
              {t("badges.shared")}
            </text>
          </g>

          <g id="badge-mount">
            <rect
              fill="#1a1a1a"
              height="22"
              rx="11"
              stroke="#d2a8ff"
              strokeWidth="1"
              width="220"
              x="160"
              y="384"
            />
            <text
              fill="#d2a8ff"
              fontFamily="monospace"
              fontSize="10"
              x="172"
              y="399"
            >
              {t("badges.mounted")}
            </text>
          </g>

          <text
            fill="#6b6b6b"
            fontFamily="monospace"
            fontSize="10"
            id="badge-seam"
            x="160"
            y="428"
          >
            {t("badges.seam")}
          </text>
        </g>

        <g id="pulses">
          <circle fill="#d2a8ff" id="pulse-host" r="4" />
          <circle fill="#79c0ff" id="pulse-entry" r="4" />
        </g>
      </svg>
    </ConceptAnimationFrame>
  );
}
