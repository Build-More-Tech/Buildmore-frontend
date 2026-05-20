'use client'

import { AdminProtectedRoute } from '@/src/components/AdminProtectedRoute'
import { AdminRFQs } from '@/src/pages/AdminRFQs'

export default function Page() {
  return <AdminProtectedRoute><AdminRFQs /></AdminProtectedRoute>
}
