'use client'

import { MainLayout } from '@/src/layouts/MainLayout'
import { ProtectedRoute } from '@/src/components/ProtectedRoute'
import { Profile } from '@/src/pages/Profile'

export default function Page() {
  return <MainLayout><ProtectedRoute><Profile /></ProtectedRoute></MainLayout>
}
