'use client'

import { MainLayout } from '@/src/layouts/MainLayout'
import { ProtectedRoute } from '@/src/components/ProtectedRoute'
import { Compliance } from '@/src/pages/Compliance'

export default function Page() {
  return <MainLayout><ProtectedRoute><Compliance /></ProtectedRoute></MainLayout>
}
