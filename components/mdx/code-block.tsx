"use client";

import { Check, Copy } from "lucide-react";
import { useTranslations } from "next-intl";
import type { ComponentPropsWithoutRef } from "react";
import { useCallback, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const COPIED_FEEDBACK_MS = 2000;
/** Written by shiki's diff transformer; see `transformers` in velite.config.ts. */
const DIFF_CLASS = "has-diff";
const REMOVED_LINE_CLASS = "remove";
const TRAILING_SPACE = /\s+$/;

/**
 * Wraps the figure rehype-pretty-code emits for a fenced code block and adds a
 * copy button. The title bar, line highlighting and line numbers are styling on
 * the markup the plugin already produces; only the button needs a client.
 */
export function CodeBlock({
  className,
  children,
  ...props
}: ComponentPropsWithoutRef<"figure">) {
  const containerRef = useRef<HTMLElement>(null);
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");
  const t = useTranslations("code");

  const copy = useCallback(async () => {
    // Reading the rendered text rather than a prop keeps the copy honest: line
    // numbers and diff signs are CSS pseudo-elements, so they are never part of
    // it.
    const pre = containerRef.current?.querySelector("pre");

    if (!pre) {
      return;
    }

    // A diff block shows both sides, but what is worth pasting is the result:
    // the removed lines are dropped and only the final code is copied. The
    // trailing space is what the stripped `[!code ++]` marker leaves behind.
    const code = pre.classList.contains(DIFF_CLASS)
      ? Array.from(pre.querySelectorAll<HTMLElement>("[data-line]"))
          .filter((line) => !line.classList.contains(REMOVED_LINE_CLASS))
          .map((line) => line.innerText.replace(TRAILING_SPACE, ""))
          .join("\n")
      : pre.innerText;

    if (!code) {
      return;
    }

    try {
      await navigator.clipboard.writeText(code);
      setState("copied");
    } catch {
      setState("failed");
    }

    setTimeout(() => setState("idle"), COPIED_FEEDBACK_MS);
  }, []);

  const label = {
    copied: t("copied"),
    failed: t("copyFailed"),
    idle: t("copy"),
  }[state];

  return (
    <figure
      className={cn("code-block group", className)}
      ref={containerRef}
      {...props}
    >
      <button
        aria-label={t("copyLabel")}
        className={cn(
          "absolute top-2 right-2 z-10 inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-2 py-1 font-mono text-muted-foreground text-xs transition-all hover:text-foreground",
          // Always reachable on touch, quiet on desktop until the reader
          // interacts with the block.
          "opacity-100 md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100 md:focus-visible:opacity-100"
        )}
        onClick={copy}
        type="button"
      >
        {state === "copied" ? (
          <Check aria-hidden="true" className="size-3.5 text-brand" />
        ) : (
          <Copy aria-hidden="true" className="size-3.5" />
        )}
        <span aria-live="polite">{label}</span>
      </button>
      {children}
    </figure>
  );
}
