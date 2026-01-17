import Header from '@/components/Header'
import CurrencyTicker from '@/components/CurrencyTicker'
import Footer from '@/components/Footer'

export default function NewsPage() {
  return (
    <>
      <Header />
      <CurrencyTicker />
      <main id="main-content" className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          <h1 className="text-3xl font-bold mb-8">الأخبار</h1>
          {/* News articles will go here */}
        </div>
      </main>
      <Footer />
    </>
  )
}

