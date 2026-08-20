/**
 * Fails at module load rather than rendering a page full of broken images or a
 * sitemap full of relative URLs.
 */
function required(name: string) {
  const value = process.env[name];

  if (!value) {
    throw new Error(
      `Missing required environment variable ${name}. Copy .env.example to .env.local and fill it in.`
    );
  }

  return value;
}

export const env = {
  cloudinaryCloudName: required("NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME"),
  siteUrl: required("NEXT_PUBLIC_SITE_URL"),
};
