'use client'

import { MainLayout } from '@/src/layouts/MainLayout'
import { ProtectedRoute } from '@/src/components/ProtectedRoute'
import { Logistics } from '@/src/pages/Logistics'

export default function Page() {
  return <MainLayout><ProtectedRoute><Logistics /></ProtectedRoute></MainLayout>
}
