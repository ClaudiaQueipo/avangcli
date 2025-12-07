import "./globals.css"

import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import type { Metadata } from "next"
import { Montserrat, Nunito } from "next/font/google"

import { constants } from "@/constants/global-constants"

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap"
})

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap"
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://avangcli.vercel.app"),
  title: {
    default: "AvangCLI - Modern CLI Tools for Fullstack Development",
    template: "%s | AvangCLI"
  },
  description:
    "Powerful CLI tools for scaffolding and managing Next.js (Frontend) projects with best practices built-in. Available in English and Spanish.",
  keywords: ["CLI", "Next.js", "Frontend", "TypeScript", "Developer Tools", "Scaffolding", "Screaming Architecture"],
  authors: [{ name: "AvangCLI Team", url: constants.repository_url }],
  creator: "AvangCLI Team",
  publisher: "AvangCLI Team",
  openGraph: {
    type: "website",
    locale: "en_US",
    alternateLocale: ["es_ES"],
    url: "/",
    title: "AvangCLI - Modern CLI Tools for Fullstack Development",
    description: "Powerful CLI tools for scaffolding Next.js projects",
    siteName: "AvangCLI"
  },
  twitter: {
    card: "summary_large_image",
    title: "AvangCLI - Modern CLI Tools",
    description: "Powerful CLI tools for scaffolding Next.js projects",
    creator: "@AvangCLI Team"
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1
    }
  },
  icons: {
    icon: [
      {
        url: "/avangcli2.svg",
        media: "(prefers-color-scheme: light)"
      },
      {
        url: "/avangcli2.svg",
        media: "(prefers-color-scheme: dark)"
      },
      {
        url: "/avangcli2.svg",
        type: "image/svg+xml"
      }
    ],
    apple: "/apple-icon.png"
  },
  manifest: "/manifest.json"
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${nunito.variable} ${montserrat.variable} font-sans antialiased`}>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
