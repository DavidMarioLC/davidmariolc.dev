"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ChevronLeft, ChevronRight, Play, RotateCcw } from "lucide-react";
import { useTranslations } from "next-intl";
import { type ReactNode, useCallback, useRef, useState } from "react";

/**
 * The chrome every concept animation shares: caption, controls and the step
 * indicator. It knows nothing about any particular diagram — each animation
 * supplies its own SVG and a pure `buildTimeline` that labels one point per
 * step.
 *
 * The timeline is the single source of truth for what the diagram looks like;
 * React only tracks which step is current, to paint the caption and the
 * indicator. Two sources of truth for "which step are we on" is the reliable
 * way to have the diagram and the text drift apart when the reader goes back.
 */

export interface ConceptStep {
  /** Slug of the step, unique within the animation. */
  id: string;
  /** GSAP label placed *after* this step's tweens: `step-1-request`. */
  label: string;
  /** One or two sentences: what the reader understands once this step ends. */
  text: string;
}

interface ConceptAnimationFrameProps {
  buildTimeline: (root: SVGSVGElement) => gsap.core.Timeline;
  /** The inline SVG for this animation. */
  children: ReactNode;
  steps: readonly ConceptStep[];
  title: string;
}

export function ConceptAnimationFrame({
  title,
  steps,
  buildTimeline,
  children,
}: ConceptAnimationFrameProps) {
  const t = useTranslations("conceptAnimation");
  const containerRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const [step, setStep] = useState(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useGSAP(
    () => {
      const svg = containerRef.current?.querySelector("svg");

      if (!svg) {
        return;
      }

      // Read here, not during render: there is no `window` on the server.
      setPrefersReducedMotion(
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
      );

      const timeline = buildTimeline(svg);
      timelineRef.current = timeline;
      timeline.seek(steps[0].label);
    },
    { dependencies: [buildTimeline, steps], scope: containerRef }
  );

  /**
   * Reduced motion changes how the reader reaches a step, never whether they
   * can: `seek` lands on exactly the state the tween would have produced.
   */
  const goTo = useCallback(
    (index: number) => {
      const timeline = timelineRef.current;

      // biome-ignore lint/suspicious/noUnnecessaryConditions: Biome cannot resolve gsap's global namespace and reads the ref as never-null; it is null between first render and the effect
      if (!timeline) {
        return;
      }

      // Kills an in-flight `tweenTo`, so navigating mid-playback lands on the
      // requested step instead of stranding the diagram between two states.
      gsap.killTweensOf(timeline);
      setStep(index);

      if (prefersReducedMotion) {
        timeline.seek(steps[index].label);
        return;
      }

      timeline.tweenTo(steps[index].label);
    },
    [prefersReducedMotion, steps]
  );

  const play = useCallback(() => {
    const timeline = timelineRef.current;

    // biome-ignore lint/suspicious/noUnnecessaryConditions: Biome cannot resolve gsap's global namespace and reads the ref as never-null; it is null between first render and the effect
    if (!timeline) {
      return;
    }

    gsap.killTweensOf(timeline);
    timeline.seek(steps[0].label);
    setStep(0);

    const last = steps.length - 1;

    timeline.tweenTo(steps[last].label, {
      // The indicator and the caption follow the playhead rather than jumping
      // to the end, so the reader can read along while it runs.
      onUpdate: () => {
        const reached = steps.findLastIndex(
          (candidate) => timeline.time() >= timeline.labels[candidate.label]
        );

        if (reached >= 0) {
          setStep(reached);
        }
      },
    });
  }, [steps]);

  const goPrevious = useCallback(() => goTo(step - 1), [goTo, step]);
  const goNext = useCallback(() => goTo(step + 1), [goTo, step]);
  const restart = useCallback(() => goTo(0), [goTo]);

  const isFirst = step === 0;
  const isLast = step === steps.length - 1;

  return (
    <figure className="concept-animation" ref={containerRef}>
      <figcaption className="concept-animation-title">{title}</figcaption>

      {/* Below the diagram's minimum width the stage scrolls rather than
          shrinking the labels into illegibility, so it is a named region and
          reachable by keyboard — the same contract `.table-wrapper` has. */}
      <section
        aria-label={t("scrollHint")}
        className="concept-animation-stage"
        // biome-ignore lint/a11y/noNoninteractiveTabindex: a scrollable region must be focusable, or its overflowing diagram is reachable only with a pointer
        tabIndex={0}
      >
        {children}
      </section>

      <p aria-live="polite" className="concept-animation-caption">
        {steps[step].text}
      </p>

      {/* Icon-only controls: the diagram is the content, and four text buttons
          under it compete with it. These four are the most conventional controls
          there are, so the icon carries the meaning and `aria-label` carries the
          name. No `title`: it would repeat the label as a description and some
          screen readers announce both. */}
      <div className="concept-animation-controls">
        <button
          aria-label={t("previous")}
          className="concept-animation-button"
          disabled={isFirst}
          onClick={goPrevious}
          type="button"
        >
          <ChevronLeft aria-hidden="true" className="size-4" />
        </button>
        <button
          aria-label={t("next")}
          className="concept-animation-button"
          disabled={isLast}
          onClick={goNext}
          type="button"
        >
          <ChevronRight aria-hidden="true" className="size-4" />
        </button>
        {/* Continuous playback exists only for the motion, so reduced motion
            drops it rather than replaying it instantly. */}
        <button
          aria-label={t("play")}
          className="concept-animation-button"
          disabled={prefersReducedMotion}
          onClick={play}
          type="button"
        >
          <Play aria-hidden="true" className="size-4" />
        </button>
        <button
          aria-label={t("restart")}
          className="concept-animation-button"
          onClick={restart}
          type="button"
        >
          <RotateCcw aria-hidden="true" className="size-4" />
        </button>
        <span className="concept-animation-indicator">
          {t("stepIndicator", { current: step + 1, total: steps.length })}
        </span>
      </div>
    </figure>
  );
}
