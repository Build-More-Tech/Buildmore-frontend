import type { Metadata } from 'next'
import { MainLayout } from '@/src/layouts/MainLayout'
import { ProtectedRoute } from '@/src/components/ProtectedRoute'
import { Logistics } from '@/src/views/Logistics'

export const metadata: Metadata = {
  title: 'Logistics & Delivery Tracking',
  robots: { index: false, follow: false },
}

export default function Page() {
  return <MainLayout><ProtectedRoute><Logistics /></ProtectedRoute></MainLayout>
}
