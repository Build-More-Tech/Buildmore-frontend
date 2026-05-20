import type { Metadata } from 'next'
import './globals.css'
import { Providers } from './providers'

export const metadata: Metadata = {
  title: 'BuildMore – Building Materials & Hardware Online',
  description:
    'BuildMore is your one-stop shop for building materials, electrical, plumbing, hardware and construction supplies. Order online with fast delivery across India.',
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || 'https://www.buildmoreinframart.com'
  ),
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
