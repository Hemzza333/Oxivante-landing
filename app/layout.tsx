import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'OXIVANTE — Pack Femme Premium',
  description: 'Pack bien-être féminin premium : Ashwagandha, Fer + Vit C, Collagène Marin. Fabriqué au Maroc.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#4a9da0',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800&display=swap"
          rel="stylesheet"
        />
      </head>

      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
        <Analytics />
        import Script from "next/script";

<Script
  src="https://connect.facebook.net/en_US/fbevents.js"
  strategy="afterInteractive"
/>

<Script
  id="facebook-pixel"
  strategy="afterInteractive"
>
{`
  window.fbq = window.fbq || function() {
    window.fbq.callMethod ?
    window.fbq.callMethod.apply(window.fbq, arguments) :
    window.fbq.queue.push(arguments)
  };
  if (!window._fbq) window._fbq = window.fbq;
  window.fbq.push = window.fbq;
  window.fbq.loaded = true;
  window.fbq.version = '2.0';
  window.fbq.queue = [];
  fbq('init', '2556593138058294');
  fbq('track', 'PageView');
`}
</Script>
      </body>
    </html>
  )
}
