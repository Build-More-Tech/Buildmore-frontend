'use client'

import { MainLayout } from '@/src/layouts/MainLayout'
import { ProtectedRoute } from '@/src/components/ProtectedRoute'
import { RFQs } from '@/src/pages/RFQs'

export default function Page() {
  return <MainLayout><ProtectedRoute><RFQs /></ProtectedRoute></MainLayout>
}
