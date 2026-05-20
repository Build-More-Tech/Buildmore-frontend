import type { Metadata } from 'next'
import './globals.css'
import { Providers } from './providers'

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://www.buildmoreinframart.com'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'BuildMore – Building Materials & Hardware Online',
    template: '%s | BuildMore',
  },
  description:
    'BuildMore is your one-stop shop for building materials, electrical, plumbing, hardware and construction supplies. Order online with fast delivery across India.',
  openGraph: {
    siteName: 'BuildMore',
    type: 'website',
    images: [{ url: '/images/buildhero.jpg', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/images/buildhero.jpg'],
  },
  icons: {
    icon: '/images/buildmore-logo-svg.svg',
    apple: '/images/buildmore-logo.jpeg',
  },
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
