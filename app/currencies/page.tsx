import Header from '@/components/Header'
import CurrencyTicker from '@/components/CurrencyTicker'
import Footer from '@/components/Footer'
import CurrencyList from '@/components/CurrencyList'
import { fetchRates } from '@/lib/api'

export const metadata = {
  title: 'أسعار العملات مقابل الليرة السورية | سيريو اليوم',
  description: 'أسعار صرف جميع العملات مقابل الليرة السورية مع التحديثات الفورية',
}

export default async function CurrenciesPage() {
  const data = await fetchRates('damascus')
  
  return (
    <>
      <Header />
      <CurrencyTicker />
      <main id="main-content" className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">أسعار العملات مقابل الليرة السورية</h1>
            <p className="text-[var(--muted)]">
              أسعار صرف جميع العملات مقابل الليرة السورية مع التحديثات الفورية
            </p>
            <p className="text-sm text-[var(--muted)] mt-2">
              آخر تحديث: <span className="text-[var(--muted)]">-</span>
            </p>
          </div>
          <CurrencyList currencies={data.rates || []} />
        </div>
      </main>
      <Footer />
    </>
  )
}
