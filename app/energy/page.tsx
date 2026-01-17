import Header from '@/components/Header'
import CurrencyTicker from '@/components/CurrencyTicker'
import Footer from '@/components/Footer'
import EnergyContent from '@/components/EnergyContent'

export const metadata = {
  title: 'أسعار الطاقة | سيريو اليوم',
  description: 'أسعار الطاقة الرسمية في سوريا - الوقود والكهرباء',
}

export default function EnergyPage() {
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
