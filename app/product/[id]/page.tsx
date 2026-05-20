import type { Metadata } from 'next'
import { MainLayout } from '@/src/layouts/MainLayout'
import { ProductDetail } from '@/src/pages/ProductDetail'

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://www.buildmoreinframart.com'
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://buildmore-inframart-backend.onrender.com'

async function getProduct(id: string) {
  try {
    const res = await fetch(`${API_URL}/api/products/${id}`, { next: { revalidate: 3600 } })
    if (!res.ok) return null
    const data = await res.json()
    return data.product ?? null
  } catch {
    return null
  }
}

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  const { id } = await params
  const product = await getProduct(id)
  if (!product) return { title: 'Product Not Found' }

  const name = product.name
  const desc = product.description || `Buy ${name} online at BuildMore. Fast delivery, competitive prices.`
  const image = product.images?.[0] || product.image || '/images/buildhero.jpg'

  return {
    title: name,
    description: desc,
    alternates: { canonical: `/product/${id}` },
    openGraph: {
      title: `${name} | BuildMore`,
      description: desc,
      url: `/product/${id}`,
      type: 'website',
      images: [{ url: image }],
    },
  }
}

export default async function Page(
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const product = await getProduct(id)

  const productSchema = product
    ? {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.name,
        image: product.images?.[0] || product.image,
        description: product.description || `${product.name} available at BuildMore.`,
        sku: `BM-${String(id).slice(-6).toUpperCase()}`,
        brand: { '@type': 'Brand', name: 'BuildMore' },
        offers: {
          '@type': 'Offer',
          priceCurrency: 'INR',
          price: product.price,
          availability:
            product.stock > 0
              ? 'https://schema.org/InStock'
              : 'https://schema.org/OutOfStock',
          url: `${SITE_URL}/product/${id}`,
        },
      }
    : null

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Products', item: `${SITE_URL}/products` },
      ...(product
        ? [{ '@type': 'ListItem', position: 3, name: product.name, item: `${SITE_URL}/product/${id}` }]
        : []),
    ],
  }

  return (
    <>
      {productSchema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />
      )}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <MainLayout><ProductDetail /></MainLayout>
    </>
  )
}
