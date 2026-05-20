'use client'

import { AdminProtectedRoute } from '@/src/components/AdminProtectedRoute'
import { AdminCategories } from '@/src/views/AdminCategories'

export default function Page() {
  return <AdminProtectedRoute><AdminCategories /></AdminProtectedRoute>
}
