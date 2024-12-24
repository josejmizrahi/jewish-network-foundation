import { Helmet } from "react-helmet-async";

interface EventMetaTagsProps {
  title: string;
  description: string | null;
  coverImage: string | null;
  url: string;
}

export function EventMetaTags({ title, description, coverImage, url }: EventMetaTagsProps) {
  const formattedTitle = `Join me at ${title}`;
  
  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{formattedTitle}</title>
      <meta name="title" content={formattedTitle} />
      <meta name="description" content={description || ''} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={formattedTitle} />
      <meta property="og:description" content={description || ''} />
      {coverImage && <meta property="og:image" content={coverImage} />}

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={formattedTitle} />
      <meta property="twitter:description" content={description || ''} />
      {coverImage && <meta property="twitter:image" content={coverImage} />}
    </Helmet>
  );
}