import type { Metadata } from 'next'
import { Montserrat, Nunito } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: '--font-heading',
  display: 'swap',
});

const nunito = Nunito({
  subsets: ["latin"],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'AvangCLI',
  description: 'AvangCLI',
  icons: {
    icon: [
      {
        url: '/avangcli2.svg',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/avangcli2.svg',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/avangcli2.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/avangcli2.svg',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${nunito.variable} ${montserrat.variable} font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
