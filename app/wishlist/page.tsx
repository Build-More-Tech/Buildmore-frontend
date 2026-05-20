'use client'

import { MainLayout } from '@/src/layouts/MainLayout'
import { ProtectedRoute } from '@/src/components/ProtectedRoute'
import { Wishlist } from '@/src/pages/Wishlist'

export default function Page() {
  return <MainLayout><ProtectedRoute><Wishlist /></ProtectedRoute></MainLayout>
}
