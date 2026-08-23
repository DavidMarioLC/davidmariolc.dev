"use client";

import { useLocale, useTranslations } from "next-intl";
import {
  type ChangeEvent,
  type MouseEvent,
  useCallback,
  useId,
  useState,
} from "react";

/**
 * A JWT the reader can open with their hands.
 *
 * The token stays one string on one line — three coloured runs and the two dots
 * that separate them — because that is what a JWT *is*. Opening a run expands
 * its decoded JSON underneath rather than replacing the token, so the encoded
 * form and what it says are on screen at the same time.
 *
 * ```mdx
 * <TokenAnatomy token="eyJhbGciOi…" />
 * ```
 *
 * There is no editor pane and no playback controls: the demo is the object, not
 * a sandbox around it. The reader can still paste their own token, which is the
 * only interaction that earns extra chrome.
 */

const SEGMENT_COUNT = 3;
const JSON_INDENT = 2;
const MILLISECONDS_PER_SECOND = 1000;

type SegmentKey = "header" | "payload" | "signature";

const SEGMENT_KEYS: SegmentKey[] = ["header", "payload", "signature"];

/**
 * `atob` speaks base64, not the base64url a JWT is written in, and it hands
 * back latin1 — so a payload with an accent decodes to mojibake unless the
 * bytes go through `TextDecoder`.
 */
function decodeSegment(segment: string) {
  const base64 = segment.replace(/-/g, "+").replace(/_/g, "/");
  const padding = "=".repeat((4 - (base64.length % 4)) % 4);
  const binary = atob(base64 + padding);
  const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));

  return new TextDecoder().decode(bytes);
}

/** The decoded segment, pretty-printed, or `null` if it is not readable JSON. */
function decodeToJson(segment: string | undefined) {
  if (!segment) {
    return null;
  }

  try {
    return JSON.stringify(
      JSON.parse(decodeSegment(segment)),
      null,
      JSON_INDENT
    );
  } catch {
    return null;
  }
}

/**
 * The `exp` claim is a number, and a number does not read as a date. Formatting
 * it in UTC keeps the server and the client rendering the same string, which a
 * viewer's own time zone would not.
 */
function readExpiry(json: string | null, locale: string) {
  if (!json) {
    return null;
  }

  const claims: unknown = JSON.parse(json);

  if (
    typeof claims !== "object" ||
    claims === null ||
    !("exp" in claims) ||
    typeof claims.exp !== "number"
  ) {
    return null;
  }

  return new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "UTC",
  }).format(new Date(claims.exp * MILLISECONDS_PER_SECOND));
}

export function TokenAnatomy({ token }: { token: string }) {
  const t = useTranslations("tokenAnatomy");
  const locale = useLocale();
  const panelId = useId();
  const [value, setValue] = useState(token);
  const [open, setOpen] = useState<SegmentKey | null>(null);
  const [pasting, setPasting] = useState(false);

  const segments = value.trim().split(".");
  const isToken = segments.length === SEGMENT_COUNT;

  /** One handler for the three runs: which one was pressed rides on the node. */
  const handleToggle = useCallback((event: MouseEvent<HTMLButtonElement>) => {
    const key = event.currentTarget.dataset.segment as SegmentKey;

    setOpen((current) => (current === key ? null : key));
  }, []);

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLTextAreaElement>) => {
      setValue(event.target.value);
      setOpen(null);
    },
    []
  );

  const handlePaste = useCallback(() => setPasting(true), []);

  const handleReset = useCallback(() => {
    setValue(token);
    setOpen(null);
    setPasting(false);
  }, [token]);

  return (
    <div className="token-anatomy">
      <p className="token-anatomy-title">{t("title")}</p>

      <div className="token-anatomy-stage">
        {isToken ? (
          <p className="token-anatomy-token">
            {SEGMENT_KEYS.map((key, index) => (
              <span key={key}>
                {index > 0 ? (
                  <span className="token-anatomy-dot">.</span>
                ) : null}
                <button
                  aria-controls={`${panelId}-${key}`}
                  aria-expanded={open === key}
                  className="token-anatomy-run"
                  data-open={open === key}
                  data-segment={key}
                  onClick={handleToggle}
                  type="button"
                >
                  {segments[index]}
                </button>
              </span>
            ))}
          </p>
        ) : (
          <p className="token-anatomy-empty">{t("invalid")}</p>
        )}

        {isToken
          ? SEGMENT_KEYS.map((key, index) => (
              <Panel
                expiryLabel={t("expiryLabel")}
                id={`${panelId}-${key}`}
                json={
                  key === "signature" ? null : decodeToJson(segments[index])
                }
                key={key}
                label={t(key)}
                locale={locale}
                note={key === "signature" ? t("signatureNote") : undefined}
                open={open === key}
                segment={key}
                undecodable={t("undecodable")}
              />
            ))
          : null}

        {isToken && open === null ? (
          <p className="token-anatomy-hint">{t("hint")}</p>
        ) : null}
      </div>

      <div className="token-anatomy-footer">
        {pasting ? (
          <>
            <label className="token-anatomy-label" htmlFor={`${panelId}-input`}>
              {t("pasteLabel")}
            </label>
            <textarea
              className="token-anatomy-input"
              id={`${panelId}-input`}
              onChange={handleChange}
              rows={3}
              spellCheck={false}
              value={value}
            />
            <button
              className="token-anatomy-action"
              onClick={handleReset}
              type="button"
            >
              {t("reset")}
            </button>
          </>
        ) : (
          <button
            className="token-anatomy-action"
            onClick={handlePaste}
            type="button"
          >
            {t("paste")}
          </button>
        )}
      </div>
    </div>
  );
}

/**
 * The expanding panel. `grid-template-rows: 0fr → 1fr` animates a height the
 * component never has to measure, so the JSON stays in normal flow and keeps
 * its own line breaks.
 */
function Panel({
  id,
  label,
  open,
  segment,
  json,
  note,
  locale,
  expiryLabel,
  undecodable,
}: {
  id: string;
  label: string;
  open: boolean;
  segment: SegmentKey;
  json: string | null;
  note?: string;
  locale: string;
  expiryLabel: string;
  undecodable: string;
}) {
  const expiry = segment === "payload" ? readExpiry(json, locale) : null;

  return (
    <div className="token-anatomy-panel" data-open={open} id={id}>
      <div className="token-anatomy-panel-inner">
        <p className="token-anatomy-panel-label" data-segment={segment}>
          {label}
        </p>
        {note ? (
          <p className="token-anatomy-note">{note}</p>
        ) : (
          <pre className="token-anatomy-json">{json ?? undecodable}</pre>
        )}
        {expiry ? (
          <p className="token-anatomy-note">
            {expiryLabel} {expiry} UTC
          </p>
        ) : null}
      </div>
    </div>
  );
}
