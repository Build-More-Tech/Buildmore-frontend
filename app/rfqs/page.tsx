import type { Metadata } from 'next'
import { MainLayout } from '@/src/layouts/MainLayout'
import { ProtectedRoute } from '@/src/components/ProtectedRoute'
import { RFQs } from '@/src/pages/RFQs'

export const metadata: Metadata = {
  title: 'Quote Requests (RFQs)',
  robots: { index: false, follow: false },
}

export default function Page() {
  return <MainLayout><ProtectedRoute><RFQs /></ProtectedRoute></MainLayout>
}
