import Image from "next/image";
import { notFound } from "next/navigation";
import { projects } from "#site/content";

interface ProjectProps {
  params: Promise<{ slug: string }>;
}

function getProjectBySlug(slug: string) {
  return projects.find((project) => project.slug === slug);
}

export function generateStaticParams() {
  return projects.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: ProjectProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (project == null) return {};

  return {
    title: project.title,
    description: project.description,
    openGraph: {
      title: project.title,
      description: project.description,
      type: "article",
      url: project.permalink,
      images: [
        {
          url: project.cover.src,
          width: project.cover.width,
          height: project.cover.height,
          alt: project.title,
        },
      ],
      publishedTime: project.date,
    },
    twitter: {
      card: "summary_large_image",
      title: project.title,
      description: project.description,
      images: [project.cover.src],
    },
  };
}

export default async function ProjectPage({ params }: ProjectProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (project == null) notFound();

  return (
    <article className="prose mx-auto pb-8 px-4 pt-40">
      <Image
        src={project.cover}
        alt={project.title}
        width={800}
        height={400}
        className="rounded-lg"
      />
      <h1 className="text-white">{project.title}</h1>
      {project.description && (
        <p className="text-muted-foreground">{project.description}</p>
      )}

      <div
        className="prose lg:prose-xl dark:prose-invert"
        dangerouslySetInnerHTML={{ __html: project.content }}
      ></div>
    </article>
  );
}
