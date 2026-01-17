import Header from '@/components/Header'
import CurrencyTicker from '@/components/CurrencyTicker'
import Footer from '@/components/Footer'
import EnergyContent from '@/components/EnergyContent'

export const metadata = {
  title: 'Energy Prices | Syrio Today',
  description: 'Official energy prices in Syria - Fuel and electricity',
}

export default function EnglishEnergyPage() {
  return (
    <>
      <Header />
      <CurrencyTicker />
      <main id="main-content" className="flex-1">
        <EnergyContent />
      </main>
      <Footer />
    </>
  )
}

