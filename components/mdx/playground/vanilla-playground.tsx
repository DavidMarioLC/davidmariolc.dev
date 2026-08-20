"use client";

import { Playground } from "@/components/mdx/playground/playground";

/**
 * The common case for this blog: a bit of markup, a bit of style and a bit of
 * behaviour, with a live preview. Saves declaring the three paths every time.
 *
 * ```mdx
 * <VanillaPlayground
 *   title="Copy button"
 *   html={`<button id="copy">Copy</button>`}
 *   css={`#copy { font: 14px monospace }`}
 *   js={`document.getElementById("copy").onclick = () => {}`}
 * />
 * ```
 *
 * The three strings are template literals, so JavaScript unescapes them before
 * the sandbox ever sees them: a `\n` inside the code has to be written `\\n`,
 * and a literal backtick has to be escaped. Symptom of getting it wrong is a
 * syntax error thrown from inside the preview, not from the build.
 */
export function VanillaPlayground({
  html,
  css,
  js,
  title,
}: {
  html: string;
  css?: string;
  js?: string;
  title?: string;
}) {
  const head = [css ? '<link rel="stylesheet" href="/styles.css" />' : ""].join(
    ""
  );
  const body = [html, js ? '<script src="/index.js"></script>' : ""].join("\n");

  return (
    <Playground
      files={{
        "/index.html": `<!doctype html>\n<html>\n<head>${head}</head>\n<body>\n${body}\n</body>\n</html>`,
        ...(css ? { "/styles.css": css } : {}),
        ...(js ? { "/index.js": js } : {}),
      }}
      template="static"
      title={title}
    />
  );
}
