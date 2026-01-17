import Header from '@/components/Header'
import CurrencyTicker from '@/components/CurrencyTicker'
import Footer from '@/components/Footer'
import CurrencyList from '@/components/CurrencyList'
import { fetchRates } from '@/lib/api'

export const metadata = {
  title: 'Currency Exchange Rates vs Syrian Pound | Syrio Today',
  description: 'Real-time exchange rates for all currencies vs the Syrian Pound',
}

export default async function EnglishCurrenciesPage() {
  const data = await fetchRates('damascus')
  
  return (
    <>
      <Header />
      <CurrencyTicker />
      <main id="main-content" className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Currency Exchange Rates vs Syrian Pound</h1>
            <p className="text-[var(--muted)]">
              Real-time exchange rates for all currencies vs the Syrian Pound
            </p>
            <p className="text-sm text-[var(--muted)] mt-2">
              Last updated: <span className="text-[var(--muted)]">-</span>
            </p>
          </div>
          <CurrencyList currencies={data.rates || []} />
        </div>
      </main>
      <Footer />
    </>
  )
}

