import type { MetadataRoute } from 'next'

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://www.buildmoreinframart.com'
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://buildmore-inframart-backend.onrender.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: 'daily', priority: 1.0 },
    { url: `${SITE_URL}/products`, changeFrequency: 'daily', priority: 0.9 },
    { url: `${SITE_URL}/products/categories`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${SITE_URL}/inventory`, changeFrequency: 'weekly', priority: 0.6 },
    { url: `${SITE_URL}/specs`, changeFrequency: 'weekly', priority: 0.5 },
  ]

  try {
    const [catRes, prodRes] = await Promise.all([
      fetch(`${API_URL}/api/categories`, { next: { revalidate: 3600 } }),
      fetch(`${API_URL}/api/products?limit=2000`, { next: { revalidate: 3600 } }),
    ])

    const [{ categories = [] }, { products = [] }] = await Promise.all([
      catRes.json(),
      prodRes.json(),
    ])

    const categoryRoutes: MetadataRoute.Sitemap = categories.map((c: { slug?: string; name: string }) => ({
      url: `${SITE_URL}/products/${c.slug || c.name.toLowerCase().replace(/\s+/g, '-')}`,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))

    const productRoutes: MetadataRoute.Sitemap = products.map((p: { _id: string }) => ({
      url: `${SITE_URL}/product/${p._id}`,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))

    return [...staticRoutes, ...categoryRoutes, ...productRoutes]
  } catch {
    return staticRoutes
  }
}
