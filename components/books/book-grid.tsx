import {
  CloudImage,
  type CloudImageSource,
} from "@/components/site/cloud-image";

interface Book {
  cover: CloudImageSource;
  slug: string;
}

/**
 * A book is its cover and nothing else: no title, no author, no note. Both of
 * those live in the cover's alternative text, which the content builds, so the
 * information is there for anyone who cannot see the image.
 *
 * The card keeps a fixed ratio and the cover is contained inside it, so a row
 * stays even however tall or square the individual covers are.
 */
export function BookGrid({ books }: { books: Book[] }) {
  return (
    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
      {books.map((book) => (
        <li
          className="flex aspect-3/4 items-center justify-center rounded-md border border-border p-3"
          key={book.slug}
        >
          <CloudImage
            className="max-h-full w-auto object-contain"
            image={book.cover}
            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 128px"
          />
        </li>
      ))}
    </ul>
  );
}
