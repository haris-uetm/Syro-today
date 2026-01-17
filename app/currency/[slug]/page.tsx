import Header from '@/components/Header'
import CurrencyTicker from '@/components/CurrencyTicker'
import Footer from '@/components/Footer'
import CurrencyDetailContent from '@/components/CurrencyDetailContent'
import { fetchCurrency } from '@/lib/api'

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const currency = await fetchCurrency(params.slug)
  
  return {
    title: currency?.name_ar 
      ? `سعر ${currency.name_ar} لحظة بلحظة في سوريا | سيريو اليوم`
      : 'سعر العملة | سيريو اليوم',
    description: currency?.name_ar 
      ? `أسعار صرف ${currency.name_ar} في سوريا`
      : 'أسعار صرف العملات',
  }
}

export default async function CurrencyDetailPage({ params }: { params: { slug: string } }) {
  const currency = await fetchCurrency(params.slug, 'damascus')
  
  if (!currency) {
    return (
      <>
        <Header />
        <CurrencyTicker />
        <main id="main-content" className="flex-1">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
            <h1 className="text-3xl font-bold mb-8">العملة غير موجودة</h1>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Header />
      <CurrencyTicker />
      <main id="main-content" className="flex-1">
        <CurrencyDetailContent currency={currency} slug={params.slug} />
      </main>
      <Footer />
    </>
  )
}
