import { Helmet } from 'react-helmet-async';

const BASE_URL = 'https://order-pulse-swaraj.vercel.app';
const OG_IMAGE = `${BASE_URL}/og-image.png`;

const defaultSEO = {
  title:       'OrderPulse - Smart Order Management System',
  description: 'Manage your Amazon orders intelligently with real-time analytics, bulk operations, AI-powered recommendations, and comprehensive shipping tracking.',
  keywords:    'order management, amazon orders, dashboard, analytics, ecommerce, admin panel',
  image:       OG_IMAGE,
  url:         BASE_URL,
  type:        'website',
};

export default function SEO({
  title,
  description,
  keywords,
  image,
  url,
  type       = 'website',
  noIndex    = false,
  structuredData,
}) {
  const seo = {
    title:       title       ? `${title} | OrderPulse` : defaultSEO.title,
    description: description || defaultSEO.description,
    keywords:    keywords    || defaultSEO.keywords,
    image:       image       || defaultSEO.image,
    url:         url         ? `${BASE_URL}${url}` : defaultSEO.url,
    type,
  };

  return (
    <Helmet>
      {/* Primary */}
      <title>{seo.title}</title>
      <meta name="title"       content={seo.title}/>
      <meta name="description" content={seo.description}/>
      <meta name="keywords"    content={seo.keywords}/>
      {noIndex
        ? <meta name="robots" content="noindex, nofollow"/>
        : <meta name="robots" content="index, follow"/>}
      <link rel="canonical" href={seo.url}/>

      {/* Open Graph */}
      <meta property="og:type"        content={seo.type}/>
      <meta property="og:url"         content={seo.url}/>
      <meta property="og:title"       content={seo.title}/>
      <meta property="og:description" content={seo.description}/>
      <meta property="og:image"       content={seo.image}/>
      <meta property="og:image:alt"   content="OrderPulse Dashboard"/>
      <meta property="og:site_name"   content="OrderPulse"/>

      {/* Twitter */}
      <meta name="twitter:card"        content="summary_large_image"/>
      <meta name="twitter:url"         content={seo.url}/>
      <meta name="twitter:title"       content={seo.title}/>
      <meta name="twitter:description" content={seo.description}/>
      <meta name="twitter:image"       content={seo.image}/>

      {/* Structured data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
}
