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

export const metadata: Metadata = {
  title: "David Licla - Software Engineer",
  description:
    "Portafolio de David Licla, Software Engineer especializado en desarrollo web y productos digitales.",
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
