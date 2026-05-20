'use client'

import { AdminProtectedRoute } from '@/src/components/AdminProtectedRoute'
import { AdminProducts } from '@/src/pages/AdminProducts'

export default function Page() {
  return <AdminProtectedRoute><AdminProducts /></AdminProtectedRoute>
}
