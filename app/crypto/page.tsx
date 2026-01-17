import Header from '@/components/Header'
import CurrencyTicker from '@/components/CurrencyTicker'
import Footer from '@/components/Footer'
import CryptoContent from '@/components/CryptoContent'

export const metadata = {
  title: 'أسعار العملات الرقمية | سيريو اليوم',
  description: 'أسعار العملات الرقمية الحية - بيتكوين، إيثريوم وأكثر ٢٠ عملة رقمية',
}

export default function CryptoPage() {
  return (
    <>
      <Header />
      <CurrencyTicker />
      <main id="main-content" className="flex-1">
        <CryptoContent />
      </main>
      <Footer />
    </>
  )
}
