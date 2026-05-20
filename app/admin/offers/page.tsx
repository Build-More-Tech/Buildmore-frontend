'use client'

import { AdminProtectedRoute } from '@/src/components/AdminProtectedRoute'
import { AdminOffers } from '@/src/pages/AdminOffers'

export default function Page() {
  return <AdminProtectedRoute><AdminOffers /></AdminProtectedRoute>
}
