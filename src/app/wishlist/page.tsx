import type { Metadata } from 'next'
import { MainLayout } from '@/src/layouts/MainLayout'
import { ProtectedRoute } from '@/src/components/ProtectedRoute'
import { Wishlist } from '@/src/views/Wishlist'

export const metadata: Metadata = {
  title: 'My Wishlist',
  robots: { index: false, follow: false },
}

export default function Page() {
  return <MainLayout><ProtectedRoute><Wishlist /></ProtectedRoute></MainLayout>
}
