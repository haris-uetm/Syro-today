import Header from '@/components/Header'
import CurrencyTicker from '@/components/CurrencyTicker'
import Footer from '@/components/Footer'
import CurrencyDetailContent from '@/components/CurrencyDetailContent'
import { fetchCurrency } from '@/lib/api'

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const currency = await fetchCurrency(params.slug)
  
  return {
    title: currency?.name 
      ? `${currency.name} Exchange Rate Live in Syria | Syrio Today`
      : 'Currency Rate | Syrio Today',
    description: currency?.name 
      ? `${currency.name} exchange rates in Syria`
      : 'Currency exchange rates',
  }
}

export default async function EnglishCurrencyDetailPage({ params }: { params: { slug: string } }) {
  const currency = await fetchCurrency(params.slug, 'damascus')
  
  if (!currency) {
    return (
      <>
        <Header />
        <CurrencyTicker />
        <main id="main-content" className="flex-1">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
            <h1 className="text-3xl font-bold mb-8">Currency not found</h1>
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

