'use client'

import { MainLayout } from '@/src/layouts/MainLayout'
import { ProtectedRoute } from '@/src/components/ProtectedRoute'
import { Checkout } from '@/src/pages/Checkout'

export default function Page() {
  return <MainLayout><ProtectedRoute><Checkout /></ProtectedRoute></MainLayout>
}
