import Header from '@/components/Header'
import CurrencyTicker from '@/components/CurrencyTicker'
import Footer from '@/components/Footer'
import CryptoContent from '@/components/CryptoContent'

export const metadata = {
  title: 'Cryptocurrency Prices | Syrio Today',
  description: 'Live cryptocurrency prices - Bitcoin, Ethereum and top 20 cryptocurrencies',
}

export default function EnglishCryptoPage() {
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

