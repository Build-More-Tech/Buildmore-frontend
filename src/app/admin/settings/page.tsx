'use client'

import { AdminProtectedRoute } from '@/src/components/AdminProtectedRoute'
import { AdminSettings } from '@/src/views/AdminSettings'

export default function Page() {
  return <AdminProtectedRoute><AdminSettings /></AdminProtectedRoute>
}
