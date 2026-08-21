import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getFormatter,
  getTranslations,
  setRequestLocale,
} from "next-intl/server";
import { AchievementRow } from "@/components/home/achievement-row";
import { CommunityGallery } from "@/components/home/community-gallery";
import { Intro } from "@/components/home/intro";
import { PostRow } from "@/components/home/post-row";
import { ProfileHeader } from "@/components/home/profile-header";
import { ProjectCard } from "@/components/home/project-card";
import { Section } from "@/components/site/section";
import { StructuredData } from "@/components/site/structured-data";
import {
  getAchievements,
  getCommunity,
  getFeaturedProjects,
  getPosts,
  getProfile,
  isLocale,
} from "@/lib/content";
import { env } from "@/lib/env";
import { absoluteUrl, pageMetadata } from "@/lib/metadata";

const HOME_COMMUNITY_LIMIT = 4;
const HOME_POSTS_LIMIT = 3;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  if (!isLocale(locale)) {
    return {};
  }

  const t = await getTranslations({ locale, namespace: "meta" });

  return pageMetadata({
    description: t("homeDescription"),
    locale,
    path: "",
    title: t("homeTitle"),
  });
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  if (!isLocale(locale)) {
    notFound();
  }

  const profile = getProfile(locale);

  if (!profile) {
    notFound();
  }

  const t = await getTranslations("home");
  const format = await getFormatter();
  const formatDate = (date: string) =>
    format.dateTime(new Date(date), { month: "short", year: "numeric" });

  const projects = getFeaturedProjects(locale);
  const posts = getPosts(locale);
  const achievements = getAchievements(locale);
  const community = getCommunity(locale).slice(0, HOME_COMMUNITY_LIMIT);

  // Describes the author once, from the same profile the page renders.
  const person = {
    "@context": "https://schema.org",
    "@type": "Person",
    image: `https://res.cloudinary.com/${env.cloudinaryCloudName}/image/upload/${profile.avatar.publicId}`,
    name: profile.name,
    sameAs: profile.social.map((link) => link.url),
    url: absoluteUrl(locale),
  };

  return (
    <div className="space-y-20">
      <StructuredData data={person} />
      <div className="space-y-8">
        <ProfileHeader
          avatar={profile.avatar}
          country={profile.country}
          name={profile.name}
        />
        <Intro paragraphs={profile.intro} />
      </div>

      <Section
        title={t("projects")}
        viewAllAriaLabel={t("viewAllOf", { section: t("projects") })}
        viewAllHref="/projects"
        viewAllLabel={t("viewAll")}
      >
        <div className="grid gap-4 sm:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard
              actionLabel={t("viewProject")}
              category={project.category}
              description={project.description}
              key={project.slug}
              preview={project.preview}
              slug={project.slug}
              title={project.title}
              type={project.type}
            />
          ))}
        </div>
      </Section>

      <Section
        title={t("posts")}
        viewAllAriaLabel={t("viewAllOf", { section: t("posts") })}
        viewAllHref="/posts"
        viewAllLabel={t("viewAll")}
      >
        {posts.length === 0 ? (
          <div className="rounded-md border border-border border-dashed p-6">
            <p className="text-sm">{t("postsEmptyTitle")}</p>
            <p className="mt-1 text-muted-foreground text-sm">
              {t("postsEmptyDescription")}
            </p>
          </div>
        ) : (
          <ul className="space-y-1">
            {posts.slice(0, HOME_POSTS_LIMIT).map((post) => (
              <li key={post.slug}>
                <PostRow date={post.date} slug={post.slug} title={post.title} />
              </li>
            ))}
          </ul>
        )}
      </Section>

      <Section title={t("achievements")}>
        {achievements.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            {t("achievementsEmpty")}
          </p>
        ) : (
          <ul className="space-y-3">
            {achievements.map((achievement) => (
              <li key={achievement.slug}>
                <AchievementRow
                  logo={achievement.logo}
                  name={achievement.name}
                  participation={achievement.participation}
                  url={achievement.url}
                  year={achievement.year}
                />
              </li>
            ))}
          </ul>
        )}
      </Section>

      <Section
        title={t("community")}
        viewAllAriaLabel={t("viewAllOf", { section: t("community") })}
        viewAllHref={profile.communityUrl}
        viewAllLabel={t("viewAll")}
      >
        <p className="text-muted-foreground leading-relaxed">
          {profile.communityIntro}
        </p>
        {community.length === 0 ? (
          <p className="mt-6 text-muted-foreground text-sm">
            {t("communityEmpty")}
          </p>
        ) : (
          <div className="mt-6">
            <CommunityGallery entries={community} formatDate={formatDate} />
          </div>
        )}
      </Section>
    </div>
  );
}
