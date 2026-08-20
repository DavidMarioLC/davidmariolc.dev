"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";

export default function LocaleError({ reset }: { reset: () => void }) {
  const t = useTranslations("error");

  return (
    <div className="space-y-4">
      <h1 className="text-2xl">{t("title")}</h1>
      <p className="text-muted-foreground">{t("description")}</p>
      <div className="flex items-center gap-4 font-mono text-sm">
        <button
          className="underline underline-offset-4"
          onClick={reset}
          type="button"
        >
          {t("retry")}
        </button>
        <Link className="underline underline-offset-4" href="/">
          {t("backHome")}
        </Link>
      </div>
    </div>
  );
}
