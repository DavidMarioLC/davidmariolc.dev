import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import type { ReactNode } from "react";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { routing } from "@/i18n/routing";
import { SITE_URL } from "@/lib/metadata";
import { cn } from "@/lib/utils";
import "../globals.css";

const fontSans = Geist({ subsets: ["latin"], variable: "--font-sans" });
const fontMono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono" });

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

/**
 * `metadataBase` is what lets every page below declare relative canonicals and
 * OG image paths and still emit absolute URLs. The title template is here so a
 * page only ever states its own name.
 */
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "davidmariolc.dev",
    template: "%s · davidmariolc.dev",
  },
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  // Opts the whole subtree into static rendering; without it every page that
  // reads a translation is server-rendered on demand.
  setRequestLocale(locale);

  return (
    <html
      // The site has one theme. This class is a constant marker, not a toggle:
      // shadcn components ship `dark:` variants that only resolve under it.
      className={cn("dark antialiased", fontSans.variable, fontMono.variable)}
      lang={locale}
    >
      <body className="min-h-svh bg-background font-sans text-foreground">
        <NextIntlClientProvider>
          <SiteHeader />
          <main className="mx-auto w-full max-w-3xl px-6 py-16" id="content">
            {children}
          </main>
          <SiteFooter />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
