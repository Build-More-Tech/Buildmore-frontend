'use client'

import { AdminProtectedRoute } from '@/src/components/AdminProtectedRoute'
import { AdminDashboard } from '@/src/pages/AdminDashboard'

export default function Page() {
  return <AdminProtectedRoute><AdminDashboard /></AdminProtectedRoute>
}
