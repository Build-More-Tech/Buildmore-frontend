import type { Metadata } from 'next'
import { Suspense } from 'react'
import { MainLayout } from '@/src/layouts/MainLayout'
import { Products } from '@/src/views/Products'

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://www.buildmoreinframart.com'

export async function generateMetadata(
  { params }: { params: Promise<{ categorySlug: string }> }
): Promise<Metadata> {
  const { categorySlug } = await params
  const name = categorySlug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
  return {
    title: `${name} – Buy Online`,
    description: `Shop ${name} at BuildMore. Browse our full range with competitive pricing, bulk order discounts and fast delivery across India.`,
    alternates: { canonical: `/products/${categorySlug}` },
    openGraph: {
      title: `${name} – Buy Online | BuildMore`,
      description: `Shop ${name} at BuildMore. Competitive pricing, bulk orders, fast delivery.`,
      url: `/products/${categorySlug}`,
    },
  }
}

export default async function Page(
  { params }: { params: Promise<{ categorySlug: string }> }
) {
  const { categorySlug } = await params
  const name = categorySlug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Products', item: `${SITE_URL}/products` },
      { '@type': 'ListItem', position: 3, name, item: `${SITE_URL}/products/${categorySlug}` },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <MainLayout noPadding><Suspense fallback={null}><Products /></Suspense></MainLayout>
    </>
  )
}
