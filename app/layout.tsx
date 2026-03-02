import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import Script from 'next/script'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'OXIVANTE — Pack Femme Premium',
  description:
    'Pack bien-être féminin premium : Ashwagandha, Fer + Vit C, Collagène Marin. Fabriqué au Maroc.',
  generator: 'v0.app',

  // ✅ Facebook Domain Verification meta tag (Next.js will render it in <head>)
  verification: {
    other: {
      'facebook-domain-verification': 'ce13q70xn0r3svke0s20glo6e4ohjd',
    },
  },

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
        {/* Tajawal */}
        <link
          href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800&display=swap"
          rel="stylesheet"
        />

        {/* ✅ Google Analytics GA4 */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-FS3RNY58C9"
          strategy="afterInteractive"
        />
        <Script id="ga4" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-FS3RNY58C9');
          `}
        </Script>
      </head>

      <body className={`${inter.variable} font-sans antialiased`}>
        {children}

        {/* ✅ Vercel Analytics */}
        <Analytics />

        {/* ✅ Facebook Pixel */}
        <Script
          src="https://connect.facebook.net/en_US/fbevents.js"
          strategy="afterInteractive"
        />
        <Script id="facebook-pixel" strategy="afterInteractive">
          {`
            window.fbq = window.fbq || function() {
              window.fbq.callMethod
                ? window.fbq.callMethod.apply(window.fbq, arguments)
                : window.fbq.queue.push(arguments);
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

        {/* Optional: Pixel noscript (يخدم غير إلا كان JS مطفي) */}
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: 'none' }}
            alt=""
            src="https://www.facebook.com/tr?id=2556593138058294&ev=PageView&noscript=1"
          />
        </noscript>
      </body>
    </html>
  )
}