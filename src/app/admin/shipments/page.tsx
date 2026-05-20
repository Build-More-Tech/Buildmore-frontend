'use client'

import { AdminProtectedRoute } from '@/src/components/AdminProtectedRoute'
import { AdminShipments } from '@/src/pages/AdminShipments'

export default function Page() {
  return <AdminProtectedRoute><AdminShipments /></AdminProtectedRoute>
}
