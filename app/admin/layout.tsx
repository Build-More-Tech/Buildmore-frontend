'use client'

import { AdminLayout } from '@/src/layouts/AdminLayout'

export default function Layout({ children }: { children: React.ReactNode }) {
  return <AdminLayout>{children}</AdminLayout>
}
