'use client'

import { AdminProtectedRoute } from '@/src/components/AdminProtectedRoute'
import { AdminRFQs } from '@/src/views/AdminRFQs'

export default function Page() {
  return <AdminProtectedRoute><AdminRFQs /></AdminProtectedRoute>
}
