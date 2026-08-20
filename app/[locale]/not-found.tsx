import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";

export default async function LocaleNotFound() {
  const t = await getTranslations("notFound");

  return (
    <div className="space-y-4">
      <h1 className="text-2xl">{t("title")}</h1>
      <p className="text-muted-foreground">{t("description")}</p>
      <Link className="font-mono text-sm underline underline-offset-4" href="/">
        {t("backHome")}
      </Link>
    </div>
  );
}
