import Header from '@/components/Header'
import CurrencyTicker from '@/components/CurrencyTicker'
import Footer from '@/components/Footer'
import GoldPageContent from '@/components/GoldPageContent'

export const metadata = {
  title: 'أسعار الذهب مقابل الليرة السورية | سيريو اليوم',
  description: 'أسعار الذهب المباشرة بالليرة السورية. تابع أسعار عيار 24 و22 و21 و18 و14 مع التحديثات اليومية.',
}

export default function GoldPage() {
  return (
    <>
      <Header />
      <CurrencyTicker />
      <main id="main-content" className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">أسعار الذهب مقابل الليرة السورية</h1>
            <p className="text-[var(--muted)]">
              أسعار الذهب المباشرة بالليرة السورية. تابع أسعار عيار 24 و22 و21 و18 و14 مع التحديثات اليومية.
            </p>
          </div>
          <GoldPageContent />
        </div>
      </main>
      <Footer />
    </>
  )
}
