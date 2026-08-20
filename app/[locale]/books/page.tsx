import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { BookGrid } from "@/components/books/book-grid";
import { routing } from "@/i18n/routing";
import { getBooksByStatus, isLocale } from "@/lib/content";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function BooksPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  if (!isLocale(locale)) {
    notFound();
  }

  const t = await getTranslations("books");
  // Already in reading-state order, with empty states dropped.
  const groups = getBooksByStatus(locale);

  return (
    <div className="space-y-10">
      <header className="space-y-2">
        <h1 className="font-mono text-2xl">{t("title")}</h1>
        <p className="text-muted-foreground">{t("subtitle")}</p>
      </header>

      <p className="text-muted-foreground leading-relaxed">{t("intro")}</p>

      {groups.length === 0 ? (
        <p className="text-muted-foreground text-sm">{t("empty")}</p>
      ) : (
        groups.map((group) => (
          <section aria-labelledby={`books-${group.status}`} key={group.status}>
            <h2 className="font-mono text-xl" id={`books-${group.status}`}>
              {t(group.status)}
            </h2>
            <div className="mt-6">
              <BookGrid books={group.books} />
            </div>
          </section>
        ))
      )}
    </div>
  );
}
