import type { Metadata } from "next";
import { Inter } from "next/font/google";
import ClickSpark from "@/components/ClickSpark";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";
import { Header } from "@/components/Header";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://davidlicla.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "David Licla - Software Engineer",
    template: "%s | David Licla",
  },
  description:
    "Portafolio de David Licla, Software Engineer especializado en desarrollo web y productos digitales.",
  keywords: [
    "David Licla",
    "Software Engineer",
    "Desarrollador Web",
    "Full Stack",
    "Frontend Developer",
    "React",
    "Next.js",
    "TypeScript",
  ],
  authors: [{ name: "David Licla" }],
  creator: "David Licla",
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: siteUrl,
    title: "David Licla - Software Engineer",
    description:
      "Portafolio de David Licla, Software Engineer especializado en desarrollo web y productos digitales.",
    siteName: "David Licla Portfolio",
    images: [
      {
        url: "/opengraph.png",
        width: 1200,
        height: 630,
        alt: "David Licla - Software Engineer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "David Licla - Software Engineer",
    description:
      "Portafolio de David Licla, Software Engineer especializado en desarrollo web y productos digitales.",
    images: ["/opengraph.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${inter.variable} antialiased dark bg-[#060010]`}>
        <ClickSpark
          sparkColor="#fff"
          sparkSize={10}
          sparkRadius={15}
          sparkCount={8}
          duration={400}
        >
          <TooltipProvider>
            <Header />
            {children}
          </TooltipProvider>
        </ClickSpark>
      </body>
    </html>
  );
}
