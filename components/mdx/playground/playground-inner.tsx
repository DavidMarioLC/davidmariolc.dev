"use client";

import {
  SandpackCodeEditor,
  SandpackLayout,
  SandpackPreview,
  SandpackProvider,
  useSandpack,
} from "@codesandbox/sandpack-react";
import { RotateCcw } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCallback } from "react";
import { playgroundTheme } from "@/components/mdx/playground/theme";
import type { PlaygroundProps } from "@/components/mdx/playground/types";

function ResetButton() {
  const { sandpack } = useSandpack();
  const t = useTranslations("playground");
  const reset = useCallback(() => sandpack.resetAllFiles(), [sandpack]);

  return (
    <button
      className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-2 py-1 font-mono text-muted-foreground text-xs transition-colors hover:text-foreground"
      onClick={reset}
      type="button"
    >
      <RotateCcw aria-hidden="true" className="size-3.5" />
      {t("reset")}
    </button>
  );
}

export default function PlaygroundInner({
  template = "static",
  files,
  title,
  showPreview = true,
}: PlaygroundProps) {
  const t = useTranslations("playground");

  return (
    <figure className="playground">
      {/* The provider wraps the toolbar too: the reset button reads sandbox
          state through context, so it has to sit inside it. */}
      <SandpackProvider
        files={files}
        options={{ initMode: "user-visible" }}
        template={template}
        theme={playgroundTheme}
      >
        <div className="playground-bar">
          <span className="font-mono text-muted-foreground text-xs">
            {title ?? t("label")}
          </span>
          <ResetButton />
        </div>
        <SandpackLayout>
          <SandpackCodeEditor showLineNumbers showTabs wrapContent />
          {showPreview ? (
            <SandpackPreview showOpenInCodeSandbox={false} />
          ) : null}
        </SandpackLayout>
      </SandpackProvider>
    </figure>
  );
}
