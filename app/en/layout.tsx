import type { Metadata } from 'next'
import '../globals.css'

export const metadata: Metadata = {
  title: 'Syrio Today | Syrian Pound Exchange Rates and Gold Prices',
  description: 'Syrian Pound exchange rates, gold prices, and financial news',
  keywords: 'Syrian Pound, exchange rates, gold prices, USD to SYP, EUR to SYP, Turkish Lira, Damascus, Aleppo, currency converter, Syria economy',
  authors: [{ name: 'Syrio Today' }],
  openGraph: {
    title: 'Syrio Today | Syrian Pound Exchange Rates and Gold Prices',
    description: 'Syrian Pound exchange rates, gold prices, and financial news',
    url: 'https://sp-today.com/en',
    siteName: 'Syrio Today',
    locale: 'en_US',
    type: 'website',
  },
}

export default function EnglishLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // In Next.js App Router, nested layouts cannot have html/body tags
  // They just wrap the children
  return <>{children}</>
}

