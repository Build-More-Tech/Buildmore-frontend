import type { Metadata } from 'next'
import { MainLayout } from '@/src/layouts/MainLayout'
import { Specs } from '@/src/pages/Specs'

export const metadata: Metadata = {
  title: 'Technical Specifications – Building Materials',
  description:
    'Browse technical specifications for building materials and construction supplies at BuildMore. Detailed specs to help you choose the right products for your project.',
  alternates: { canonical: '/specs' },
  openGraph: { title: 'Technical Specifications – Building Materials | BuildMore', url: '/specs' },
}

export default function Page() {
  return <MainLayout><Specs /></MainLayout>
}
