import type { ComponentType, SVGProps } from "react";
import { Angular } from "@/components/ui/svgs/angular";
import { AstroIconDark } from "@/components/ui/svgs/astroIconDark";
import { AwsDark } from "@/components/ui/svgs/awsDark";
import { Biomejs } from "@/components/ui/svgs/biomejs";
import { ClaudeAiIcon } from "@/components/ui/svgs/claudeAiIcon";
import { Docker } from "@/components/ui/svgs/docker";
import { Fastapi } from "@/components/ui/svgs/fastapi";
import { Figma } from "@/components/ui/svgs/figma";
import { GithubDark } from "@/components/ui/svgs/githubDark";
import { Google } from "@/components/ui/svgs/google";
import { GoogleCloud } from "@/components/ui/svgs/googleCloud";
import { Intellijidea } from "@/components/ui/svgs/intellijidea";
import { Java } from "@/components/ui/svgs/java";
import { Jest } from "@/components/ui/svgs/jest";
import { Linkedin } from "@/components/ui/svgs/linkedin";
import { N8n } from "@/components/ui/svgs/n8n";
import { Nestjs } from "@/components/ui/svgs/nestjs";
// svgl ships only a black icon for Next.js; the Logo variants are wordmarks.
import { NextjsIconDark } from "@/components/ui/svgs/nextjsIconDark";
import { Notion } from "@/components/ui/svgs/notion";
import { Playwright } from "@/components/ui/svgs/playwright";
import { Postgresql } from "@/components/ui/svgs/postgresql";
import { Python } from "@/components/ui/svgs/python";
import { SanityDark } from "@/components/ui/svgs/sanityDark";
import { ShadcnUiDark } from "@/components/ui/svgs/shadcnUiDark";
import { Slack } from "@/components/ui/svgs/slack";
import { Spring } from "@/components/ui/svgs/spring";
import { Strapi } from "@/components/ui/svgs/strapi";
import { Supabase } from "@/components/ui/svgs/supabase";
import { Tailwindcss } from "@/components/ui/svgs/tailwindcss";
import { Twitter } from "@/components/ui/svgs/twitter";
import { Typescript } from "@/components/ui/svgs/typescript";
import { Vitest } from "@/components/ui/svgs/vitest";
import { Vscode } from "@/components/ui/svgs/vscode";
import { Vue } from "@/components/ui/svgs/vue";
import { Warp } from "@/components/ui/svgs/warp";
import { Wordpress } from "@/components/ui/svgs/wordpress";

type Svg = ComponentType<SVGProps<SVGSVGElement>>;

/**
 * Content refers to brands by name. The site is dark-only, so each brand maps to
 * the single variant that reads on a dark background.
 */
const LOGOS = {
  angular: Angular,
  astro: AstroIconDark,
  aws: AwsDark,
  biome: Biomejs,
  claude: ClaudeAiIcon,
  docker: Docker,
  fastapi: Fastapi,
  figma: Figma,
  gcp: GoogleCloud,
  github: GithubDark,
  google: Google,
  intellij: Intellijidea,
  java: Java,
  jest: Jest,
  linkedin: Linkedin,
  n8n: N8n,
  nestjs: Nestjs,
  nextjs: NextjsIconDark,
  notion: Notion,
  playwright: Playwright,
  postgresql: Postgresql,
  python: Python,
  sanity: SanityDark,
  shadcn: ShadcnUiDark,
  slack: Slack,
  spring: Spring,
  strapi: Strapi,
  supabase: Supabase,
  tailwindcss: Tailwindcss,
  typescript: Typescript,
  vitest: Vitest,
  vscode: Vscode,
  vue: Vue,
  warp: Warp,
  wordpress: Wordpress,
  x: Twitter,
} as const satisfies Record<string, Svg>;

export type LogoName = keyof typeof LOGOS;

/**
 * Marks svgl has no entry for, supplied as files in `public/`. Same contract as
 * the svgl ones: referenced by name from content, resolved here.
 */
interface LocalLogo {
  height: number;
  src: string;
  width: number;
}

const LOCAL_LOGOS = {
  forma: { height: 200, src: "/forma.png", width: 200 },
  gdg: { height: 972, src: "/gdg.svg", width: 1573 },
  nasa: { height: 3840, src: "/nasa.webp", width: 3840 },
} as const satisfies Record<string, LocalLogo>;

export type LocalLogoName = keyof typeof LOCAL_LOGOS;

export type ResolvedLogo =
  | { kind: "svg"; entry: Svg }
  | { kind: "image"; entry: LocalLogo };

/**
 * An identifier that is absent is fine - the caller renders the name as text.
 * An identifier that is present but unknown is a typo and must fail the build.
 */
export function resolveLogo(
  name: string | undefined
): ResolvedLogo | undefined {
  if (!name) {
    return;
  }

  if (name in LOGOS) {
    return { entry: LOGOS[name as LogoName], kind: "svg" };
  }

  if (name in LOCAL_LOGOS) {
    return { entry: LOCAL_LOGOS[name as LocalLogoName], kind: "image" };
  }

  throw new Error(
    `Unknown logo "${name}". Install it with \`pnpm dlx shadcn@latest add @svgl/${name}\` and register it in LOGOS, or drop the file in public/ and register it in LOCAL_LOGOS.`
  );
}
