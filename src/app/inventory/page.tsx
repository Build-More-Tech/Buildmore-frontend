import type { Metadata } from 'next'
import { MainLayout } from '@/src/layouts/MainLayout'
import { Inventory } from '@/src/views/Inventory'

export const metadata: Metadata = {
  title: 'Inventory & Stock Availability',
  description:
    'Check real-time stock availability for building materials, hardware and construction supplies at BuildMore. Know what is in stock before you order.',
  alternates: { canonical: '/inventory' },
  openGraph: { title: 'Inventory & Stock Availability | BuildMore', url: '/inventory' },
}

export default function Page() {
  return <MainLayout><Inventory /></MainLayout>
}
