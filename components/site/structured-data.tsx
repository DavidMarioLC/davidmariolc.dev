/**
 * JSON-LD for search engines. The payload is serialised here rather than
 * assembled as markup, which is the one case where injecting raw HTML is the
 * documented way to do it: a `<script type="application/ld+json">` must contain
 * text, not React children.
 */
export function StructuredData({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD has to be script text, and the value is serialised JSON built on the server
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
      type="application/ld+json"
    />
  );
}
