import Header from '@/components/Header'
import CurrencyTicker from '@/components/CurrencyTicker'
import Footer from '@/components/Footer'
import PortfolioContent from '@/components/PortfolioContent'

export const metadata = {
  title: 'محفظتي | سيريو اليوم',
  description: 'تتبع محفظة أصولك - العملات والذهب والعملات الرقمية',
}

export default function PortfolioPage() {
  return (
    <>
      <Header />
      <CurrencyTicker />
      <main id="main-content" className="flex-1">
        <PortfolioContent />
      </main>
      <Footer />
    </>
  )
}

