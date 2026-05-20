'use client'

import { MainLayout } from '@/src/layouts/MainLayout'
import { ProtectedRoute } from '@/src/components/ProtectedRoute'
import { Cart } from '@/src/pages/Cart'

export default function Page() {
  return <MainLayout><ProtectedRoute><Cart /></ProtectedRoute></MainLayout>
}
