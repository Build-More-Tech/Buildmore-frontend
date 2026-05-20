import type { Metadata } from 'next'
import { MainLayout } from '@/src/layouts/MainLayout'
import { ProtectedRoute } from '@/src/components/ProtectedRoute'
import { Compliance } from '@/src/views/Compliance'

export const metadata: Metadata = {
  title: 'Compliance Documents',
  robots: { index: false, follow: false },
}

export default function Page() {
  return <MainLayout><ProtectedRoute><Compliance /></ProtectedRoute></MainLayout>
}
