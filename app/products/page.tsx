import type { Metadata } from 'next'
import { MainLayout } from '@/src/layouts/MainLayout'
import { Products } from '@/src/pages/Products'

export const metadata: Metadata = {
  title: 'All Building Materials & Hardware',
  description:
    "Browse BuildMore's full catalog of building materials, electrical, plumbing, hardware and construction supplies. Competitive prices, bulk orders, fast delivery across India.",
  alternates: { canonical: '/products' },
  openGraph: { title: 'All Building Materials & Hardware | BuildMore', url: '/products' },
}

export default function Page() {
  return <MainLayout noPadding><Products /></MainLayout>
}
