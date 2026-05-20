import type { Metadata } from 'next'
import { MainLayout } from '@/src/layouts/MainLayout'
import { ProtectedRoute } from '@/src/components/ProtectedRoute'
import { Profile } from '@/src/pages/Profile'

export const metadata: Metadata = {
  title: 'My Account',
  robots: { index: false, follow: false },
}

export default function Page() {
  return <MainLayout><ProtectedRoute><Profile /></ProtectedRoute></MainLayout>
}
