import type { SandpackTheme } from "@codesandbox/sandpack-react";

/**
 * Matches the blog's code blocks: the surfaces come from the site tokens and the
 * syntax colours are the same github-dark-dimmed values Shiki emits, so a
 * snippet and a playground of the same code look identical.
 */
export const playgroundTheme: SandpackTheme = {
  colors: {
    accent: "var(--brand)",
    base: "var(--foreground)",
    clickable: "var(--muted-foreground)",
    disabled: "var(--muted-foreground)",
    error: "var(--destructive)",
    errorSurface: "var(--muted)",
    hover: "var(--foreground)",
    surface1: "var(--card)",
    surface2: "var(--border)",
    surface3: "var(--muted)",
  },
  font: {
    body: "var(--font-sans)",
    lineHeight: "20px",
    mono: "var(--font-mono)",
    size: "13px",
  },
  syntax: {
    comment: { color: "#768390", fontStyle: "italic" },
    definition: "#F69D50",
    keyword: "#F47067",
    plain: "#ADBAC7",
    property: "#6CB6FF",
    punctuation: "#ADBAC7",
    static: "#DCBDFB",
    string: "#96D0FF",
    tag: "#8DDB8C",
  },
};
