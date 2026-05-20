import type { Metadata } from 'next'
import { Suspense } from 'react'
import { MainLayout } from '@/src/layouts/MainLayout'
import { Auth } from '@/src/views/Auth'

export const metadata: Metadata = {
  title: 'Sign In or Register',
  robots: { index: false, follow: false },
}

export default function Page() {
  return <MainLayout><Suspense fallback={null}><Auth /></Suspense></MainLayout>
}
