import Header from '@/components/Header'
import CurrencyTicker from '@/components/CurrencyTicker'
import Footer from '@/components/Footer'
import GoldPageContent from '@/components/GoldPageContent'

export const metadata = {
  title: 'Gold Prices vs Syrian Pound | Syrio Today',
  description: 'Live gold prices in Syrian Pounds. Track 24K, 22K, 21K, 18K, and 14K karat prices with daily updates.',
}

export default function EnglishGoldPage() {
  return (
    <>
      <Header />
      <CurrencyTicker />
      <main id="main-content" className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Gold Prices vs Syrian Pound</h1>
            <p className="text-[var(--muted)]">
              Live gold prices in Syrian Pounds. Track 24K, 22K, 21K, 18K, and 14K karat prices with daily updates.
            </p>
          </div>
          <GoldPageContent />
        </div>
      </main>
      <Footer />
    </>
  )
}

