'use client'

import { AdminProtectedRoute } from '@/src/components/AdminProtectedRoute'
import { AdminBanners } from '@/src/views/AdminBanners'

export default function Page() {
  return <AdminProtectedRoute><AdminBanners /></AdminProtectedRoute>
}
