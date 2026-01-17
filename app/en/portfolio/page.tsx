import Header from '@/components/Header'
import CurrencyTicker from '@/components/CurrencyTicker'
import Footer from '@/components/Footer'
import PortfolioContent from '@/components/PortfolioContent'

export const metadata = {
  title: 'My Portfolio | Syrio Today',
  description: 'Track your asset portfolio - Currencies, gold, and cryptocurrencies',
}

export default function EnglishPortfolioPage() {
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

