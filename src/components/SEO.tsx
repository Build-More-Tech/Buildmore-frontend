import React from 'react';
import { Helmet } from 'react-helmet-async';

const SITE_NAME = 'BuildMore';
const SITE_URL = (import.meta.env.VITE_APP_URL as string) || 'https://www.buildmoreinframart.com';
const DEFAULT_DESC =
  'BuildMore is your one-stop shop for building materials, electrical, plumbing, hardware and construction supplies. Order online with fast delivery across India.';
const DEFAULT_IMAGE = `${SITE_URL}/images/buildhero.jpg`;

interface SEOProps {
  title?: string;
  description?: string;
  /** Path only, e.g. "/products/electrical" — SITE_URL is prepended automatically */
  canonical?: string;
  image?: string;
  jsonLd?: object | object[];
  noIndex?: boolean;
}

export const SEO: React.FC<SEOProps> = ({
  title,
  description = DEFAULT_DESC,
  canonical,
  image = DEFAULT_IMAGE,
  jsonLd,
  noIndex = false,
}) => {
  const fullTitle = title
    ? `${title} | ${SITE_NAME}`
    : `${SITE_NAME} – Building Materials & Hardware Online`;
  const canonicalUrl = canonical ? `${SITE_URL}${canonical}` : SITE_URL;
  const ogImage = image.startsWith('http') ? image : `${SITE_URL}${image}`;

  const schemas = jsonLd
    ? Array.isArray(jsonLd)
      ? jsonLd
      : [jsonLd]
    : [];

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />
      {noIndex && <meta name="robots" content="noindex, nofollow" />}

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE_NAME} />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* JSON-LD Structured Data */}
      {schemas.map((schema, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
};
