import type { Metadata } from 'next'
import { MainLayout } from '@/src/layouts/MainLayout'
import { Landing } from '@/src/views/Landing'

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://www.buildmoreinframart.com'

export const metadata: Metadata = {
  title: 'BuildMore – Buy Building Materials & Hardware Online in India',
  description:
    'BuildMore is your one-stop shop for building materials, electrical, plumbing, hardware and construction supplies. Bulk pricing, fast delivery across India.',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'BuildMore – Buy Building Materials & Hardware Online in India',
    description:
      'Shop building materials, electrical, plumbing and hardware online. Bulk pricing and fast delivery across India.',
    url: '/',
    type: 'website',
  },
}

const orgSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'BuildMore',
  url: SITE_URL,
  logo: `${SITE_URL}/images/buildmore-logo.jpeg`,
  description: 'BuildMore is your one-stop shop for building materials, electrical, plumbing, hardware and construction supplies.',
  sameAs: ['https://www.instagram.com/buildmore.inframart'],
}

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'BuildMore',
  url: SITE_URL,
  potentialAction: {
    '@type': 'SearchAction',
    target: { '@type': 'EntryPoint', urlTemplate: `${SITE_URL}/products?search={search_term_string}` },
    'query-input': 'required name=search_term_string',
  },
}

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />
      <MainLayout isHome><Landing /></MainLayout>
    </>
  )
}
