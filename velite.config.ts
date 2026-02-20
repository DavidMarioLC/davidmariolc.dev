import { defineConfig, s } from "velite";

export default defineConfig({
  collections: {
    projects: {
      name: "Project",
      pattern: "projects/**/*.md",
      schema: s
        .object({
          title: s.string().max(99),
          slug: s.slug("projects"),
          date: s.isodate(),
          cover: s.image(),
          description: s.string().optional(),
          technologies: s.array(s.string()),
          content: s.markdown(),
        })
        .transform((data) => ({
          ...data,
          permalink: `/projects/${data.slug}`,
        })),
    },
  },
});
