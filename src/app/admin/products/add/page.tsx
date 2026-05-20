'use client'

import { AdminProtectedRoute } from '@/src/components/AdminProtectedRoute'
import { AddProduct } from '@/src/views/AddProduct'

export default function Page() {
  return <AdminProtectedRoute><AddProduct /></AdminProtectedRoute>
}
