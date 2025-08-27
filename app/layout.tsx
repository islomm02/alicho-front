import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Toaster } from "@/components/ui/toaster"
import { LanguageProvider } from "@/contexts/LanguageContext"
import "./globals.css"

const inter = Inter({ 
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
  display: "swap"
})

export const metadata: Metadata = {
  title: {
    default: "AliCho - AI-quvvatli biznes avtomatlashtirish platformasi",
    template: "%s | AliCho"
  },
  description:
    "Instagram, AmoCRM va Telegram bilan integratsiya qiluvchi va kundalik vazifalaringizni avtomatlashtirishga yordam beruvchi aqlli AI agentlar bilan biznesingizni o'zgartiring.",
  keywords: ["AI automation", "business automation", "Instagram integration", "AmoCRM", "Telegram bot", "biznes avtomatlashtirish"],
  authors: [{ name: "AliCho Team" }],
  creator: "AliCho",
  openGraph: {
    type: "website",
    locale: "uz_UZ",
    url: "https://alicho.uz",
    title: "AliCho - AI-quvvatli biznes avtomatlashtirish platformasi",
    description: "Instagram, AmoCRM va Telegram bilan integratsiya qiluvchi AI platformasi",
    siteName: "AliCho"
  },
  twitter: {
    card: "summary_large_image",
    title: "AliCho - AI-quvvatli biznes avtomatlashtirish platformasi",
    description: "Instagram, AmoCRM va Telegram bilan integratsiya qiluvchi AI platformasi"
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="uz" className={inter.variable}>
      <body className={`${inter.className} antialiased`}>
        <LanguageProvider>
          {children}
          <Toaster />
        </LanguageProvider>
      </body>
    </html>
  )
}
