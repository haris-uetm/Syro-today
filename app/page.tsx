import Header from '@/components/Header'
import CurrencyTicker from '@/components/CurrencyTicker'
import HeroSection from '@/components/HeroSection'
import CurrencyRates from '@/components/CurrencyRates'
import GoldPrices from '@/components/GoldPrices'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <>
      <Header />
      <CurrencyTicker />
      <main id="main-content" className="flex-1">
        <div className="min-h-screen">
          <HeroSection />
          <div className="bg-[var(--surface)] py-4">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="ad-slot-placeholder" style={{ minHeight: '90px' }}></div>
            </div>
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
              <div className="lg:col-span-8 space-y-12">
                <CurrencyRates />
                <GoldPrices />
              </div>
              <div className="lg:col-span-4">
                {/* Sidebar content */}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

