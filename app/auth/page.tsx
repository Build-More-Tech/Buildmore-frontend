import type { Metadata } from 'next'
import { MainLayout } from '@/src/layouts/MainLayout'
import { Auth } from '@/src/pages/Auth'

export const metadata: Metadata = {
  title: 'Sign In or Register',
  robots: { index: false, follow: false },
}

export default function Page() {
  return <MainLayout><Auth /></MainLayout>
}
