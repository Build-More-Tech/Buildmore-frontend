import type { Metadata } from 'next'
import { MainLayout } from '@/src/layouts/MainLayout'
import { ProtectedRoute } from '@/src/components/ProtectedRoute'
import { Cart } from '@/src/pages/Cart'

export const metadata: Metadata = {
  title: 'Your Cart',
  robots: { index: false, follow: false },
}

export default function Page() {
  return <MainLayout><ProtectedRoute><Cart /></ProtectedRoute></MainLayout>
}
