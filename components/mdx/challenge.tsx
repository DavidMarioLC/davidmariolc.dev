import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

/**
 * A prediction challenge: the reader guesses, then opens the answer.
 *
 * Built on native `details`/`summary`, so keyboard support, the open state and
 * in-page find all work without a line of JavaScript. The chevron and the
 * opening animation are CSS on the same classes the raw markdown `details` gets,
 * so an already-written post looks identical without being migrated.
 */
export function Challenge({
  summary,
  children,
}: {
  summary?: string;
  children: ReactNode;
}) {
  const t = useTranslations("challenge");

  return (
    <details className="challenge">
      <summary className="challenge-summary">{summary ?? t("reveal")}</summary>
      <div className="challenge-body">{children}</div>
    </details>
  );
}
