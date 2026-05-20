'use client'

import { AdminProtectedRoute } from '@/src/components/AdminProtectedRoute'
import { AdminBanners } from '@/src/pages/AdminBanners'

export default function Page() {
  return <AdminProtectedRoute><AdminBanners /></AdminProtectedRoute>
}
