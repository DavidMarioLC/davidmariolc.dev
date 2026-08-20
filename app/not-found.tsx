import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import "./globals.css";

const fontSans = Geist({ subsets: ["latin"], variable: "--font-sans" });
const fontMono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono" });

/**
 * Renders for paths that never reached the `[locale]` segment, so it has no
 * locale layout above it and must carry its own document shell. It answers in
 * the default locale rather than redirecting, which would guess at a language
 * and cost the visitor a round trip.
 */
export default async function GlobalNotFound() {
  const locale = routing.defaultLocale;
  const messages = await getMessages({ locale });
  const t = await getTranslations({ locale, namespace: "notFound" });

  return (
    <html
      // The site has one theme. This class is a constant marker, not a toggle:
      // shadcn components ship `dark:` variants that only resolve under it.
      className={cn("dark antialiased", fontSans.variable, fontMono.variable)}
      lang={locale}
    >
      <body className="min-h-svh bg-background font-sans text-foreground">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <main className="mx-auto w-full max-w-content space-y-4 px-6 py-16">
            <h1 className="text-2xl">{t("title")}</h1>
            <p className="text-muted-foreground">{t("description")}</p>
            <Link
              className="font-mono text-sm underline underline-offset-4"
              href={`/${locale}`}
            >
              {t("backHome")}
            </Link>
          </main>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
