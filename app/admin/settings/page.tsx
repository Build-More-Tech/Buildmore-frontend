'use client'

import { AdminProtectedRoute } from '@/src/components/AdminProtectedRoute'
import { AdminSettings } from '@/src/pages/AdminSettings'

export default function Page() {
  return <AdminProtectedRoute><AdminSettings /></AdminProtectedRoute>
}
