import type { Metadata } from 'next'
import { Suspense } from 'react'
import { MainLayout } from '@/src/layouts/MainLayout'
import { ProtectedRoute } from '@/src/components/ProtectedRoute'
import { Profile } from '@/src/views/Profile'

export const metadata: Metadata = {
  title: 'My Account',
  robots: { index: false, follow: false },
}

export default function Page() {
  return <MainLayout><ProtectedRoute><Suspense fallback={null}><Profile /></Suspense></ProtectedRoute></MainLayout>
}
