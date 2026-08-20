import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import {
  EntryRows,
  HardwareGrid,
  SetupBlock,
} from "@/components/setup/setup-block";
import { routing } from "@/i18n/routing";
import { getSetupBlock, isLocale, SETUP_BLOCKS } from "@/lib/content";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function SetupPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  if (!isLocale(locale)) {
    notFound();
  }

  const t = await getTranslations("setup");
  const blocks = SETUP_BLOCKS.map((block) => ({
    items: getSetupBlock(locale, block),
    name: block,
  }));

  const isEmpty = blocks.every((block) => block.items.length === 0);

  return (
    <div className="space-y-10">
      <header className="space-y-2">
        <h1 className="font-mono text-2xl">{t("title")}</h1>
        <p className="text-muted-foreground">{t("subtitle")}</p>
      </header>

      {isEmpty ? (
        <p className="text-muted-foreground text-sm">{t("empty")}</p>
      ) : (
        // A block with nothing in it is dropped rather than left as a bare
        // heading over empty space.
        blocks
          .filter((block) => block.items.length > 0)
          .map((block) => (
            <SetupBlock key={block.name} title={t(block.name)}>
              {block.name === "hardware" ? (
                <HardwareGrid items={block.items} />
              ) : (
                <EntryRows items={block.items} />
              )}
            </SetupBlock>
          ))
      )}
    </div>
  );
}
