import type { Metadata } from 'next'
import { MainLayout } from '@/src/layouts/MainLayout'
import { AllCategories } from '@/src/pages/AllCategories'

export const metadata: Metadata = {
  title: 'Browse All Building Material Categories',
  description:
    'Explore all categories at BuildMore — cement, steel, electrical, plumbing, tiles, paints, hardware and more. Find exactly what your project needs.',
  alternates: { canonical: '/products/categories' },
  openGraph: { title: 'Browse All Building Material Categories | BuildMore', url: '/products/categories' },
}

export default function Page() {
  return <MainLayout noPadding><AllCategories /></MainLayout>
}
