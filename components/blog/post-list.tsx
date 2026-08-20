import { PostMeta } from "@/components/blog/post-meta";
import { Link } from "@/i18n/routing";

interface PostSummary {
  date: string;
  description: string;
  metadata: { readingTime: number };
  slug: string;
  title: string;
}

export function PostList({ posts }: { posts: PostSummary[] }) {
  return (
    <ul className="space-y-8">
      {posts.map((post) => (
        <li key={post.slug}>
          <article className="space-y-2">
            <h2 className="font-mono text-lg">
              <Link
                className="transition-colors hover:text-brand"
                href={`/posts/${post.slug}`}
              >
                {post.title}
              </Link>
            </h2>
            <PostMeta
              date={post.date}
              readingTime={post.metadata.readingTime}
            />
            <p className="text-muted-foreground leading-relaxed">
              {post.description}
            </p>
          </article>
        </li>
      ))}
    </ul>
  );
}
