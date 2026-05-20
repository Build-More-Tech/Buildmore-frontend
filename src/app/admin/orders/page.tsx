'use client'

import { AdminProtectedRoute } from '@/src/components/AdminProtectedRoute'
import { AdminOrders } from '@/src/views/AdminOrders'

export default function Page() {
  return <AdminProtectedRoute><AdminOrders /></AdminProtectedRoute>
}
