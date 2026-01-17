import Header from '@/components/Header'
import CurrencyTicker from '@/components/CurrencyTicker'
import Footer from '@/components/Footer'
import { fetchRates } from '@/lib/api'
import Link from 'next/link'

const energyData: Record<string, { name_ar: string; name_en: string; type: 'fuel' | 'electricity'; icon: string }> = {
  benzin: {
    name_ar: 'بنزين',
    name_en: 'Gasoline',
    type: 'fuel',
    icon: '⛽',
  },
  diesel: {
    name_ar: 'مازوت',
    name_en: 'Diesel',
    type: 'fuel',
    icon: '🛢️',
  },
  gas: {
    name_ar: 'غاز',
    name_en: 'LPG Gas',
    type: 'fuel',
    icon: '🔥',
  },
  'houses-under-300kwh': {
    name_ar: 'منازل (أقل من 300 ك.و.س)',
    name_en: 'Houses (< 300 kWh)',
    type: 'electricity',
    icon: '🏠',
  },
  'houses-above-300kwh': {
    name_ar: 'منازل (أكثر من 300 ك.و.س)',
    name_en: 'Houses (> 300 kWh)',
    type: 'electricity',
    icon: '🏘️',
  },
  industrial: {
    name_ar: 'صناعي',
    name_en: 'Industrial',
    type: 'electricity',
    icon: '🏭',
  },
}

const fuelPrices: Record<string, { usd: number; unit: string }> = {
  benzin: { usd: 0.85, unit: 'لتر' },
  diesel: { usd: 0.75, unit: 'لتر' },
  gas: { usd: 10.5, unit: 'أسطوانة (10 كيلو)' },
}

const electricityPrices: Record<string, { syp: number }> = {
  'houses-under-300kwh': { syp: 600 },
  'houses-above-300kwh': { syp: 1400 },
  industrial: { syp: 1400 },
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const energy = energyData[params.slug]
  
  return {
    title: energy 
      ? `سعر ${energy.name_ar} | سيريو اليوم`
      : 'أسعار الطاقة | سيريو اليوم',
    description: energy 
      ? `أسعار ${energy.name_ar} في سوريا`
      : 'أسعار الطاقة في سوريا',
  }
}

export default async function EnergyDetailPage({ params }: { params: { slug: string } }) {
  const energy = energyData[params.slug]
  const ratesData = await fetchRates('damascus')
  const usd = ratesData.rates?.find(c => c.code === 'USD')
  const usdRate = usd?.cities?.damascus ? (usd.cities.damascus.buy + usd.cities.damascus.sell) / 2 : 12260

  if (!energy) {
    return (
      <>
        <Header />
        <CurrencyTicker />
        <main id="main-content" className="flex-1">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
            <h1 className="text-3xl font-bold mb-8">نوع الطاقة غير موجود</h1>
            <Link href="/energy" className="text-[var(--primary)] hover:underline">
              ← العودة إلى صفحة الطاقة
            </Link>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  const isFuel = energy.type === 'fuel'
  const price = isFuel ? fuelPrices[params.slug] : electricityPrices[params.slug]

  return (
    <>
      <Header />
      <CurrencyTicker />
      <main id="main-content" className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          <div className="mb-6">
            <Link href="/energy" className="text-[var(--primary)] hover:underline mb-4 inline-block">
              ← العودة إلى صفحة الطاقة
            </Link>
          </div>

          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-600 to-teal-500 rounded-xl flex items-center justify-center text-3xl">
                {energy.icon}
              </div>
              <div>
                <h1 className="text-3xl font-bold">{energy.name_ar}</h1>
                <p className="text-[var(--muted)]">السعر الرسمي في سوريا</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-[var(--card)] rounded-xl border border-[var(--border)] p-8">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold mb-4">السعر الحالي</h2>
                  {isFuel && price && 'usd' in price ? (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between p-6 bg-[var(--surface)] rounded-lg">
                        <div>
                          <p className="text-[var(--muted)] mb-1">السعر بالدولار الأمريكي</p>
                          <p className="text-sm text-[var(--muted)]">لكل {price.unit}</p>
                        </div>
                        <div className="text-4xl font-bold font-mono">${price.usd}</div>
                      </div>
                      <div className="flex items-center justify-between p-6 bg-[var(--surface)] rounded-lg">
                        <div>
                          <p className="text-[var(--muted)] mb-1">السعر بالليرة السورية</p>
                          <p className="text-sm text-[var(--muted)]">تقريبي (لكل {price.unit})</p>
                        </div>
                        <div className="text-4xl font-bold font-mono">{(price.usd * usdRate).toLocaleString('ar-SY')}</div>
                      </div>
                    </div>
                  ) : price && 'syp' in price ? (
                    <div className="flex items-center justify-between p-6 bg-[var(--surface)] rounded-lg">
                      <div>
                        <p className="text-[var(--muted)] mb-1">السعر بالليرة السورية</p>
                        <p className="text-sm text-[var(--muted)]">لكل كيلوواط ساعة</p>
                      </div>
                      <div className="text-4xl font-bold font-mono">{price.syp.toLocaleString('ar-SY')}</div>
                    </div>
                  ) : null}
                </div>

                <div className="border-t border-[var(--border)] pt-6">
                  <h3 className="font-bold mb-3">معلومات إضافية</h3>
                  <ul className="space-y-2 text-[var(--muted)]">
                    <li>• الأسعار المذكورة هي الأسعار الحكومية الرسمية</li>
                    <li>• الأسعار قابلة للتغيير بناءً على قرارات الحكومة</li>
                    {isFuel && <li>• يتم تحديد أسعار الوقود بالدولار الأمريكي ثم تحويلها لليرة السورية</li>}
                    {!isFuel && <li>• تختلف أسعار الكهرباء حسب فئة الاستهلاك</li>}
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <div className="bg-[var(--card)] rounded-xl border border-[var(--border)] p-6 sticky top-20">
                <h3 className="font-bold mb-4">أنواع الطاقة الأخرى</h3>
                <div className="space-y-3">
                  {Object.entries(energyData)
                    .filter(([slug]) => slug !== params.slug)
                    .slice(0, 3)
                    .map(([slug, item]) => (
                      <Link
                        key={slug}
                        href={`/energy/${slug}`}
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-[var(--surface)] transition-colors border border-[var(--border)]"
                      >
                        <span className="text-2xl">{item.icon}</span>
                        <span className="font-medium">{item.name_ar}</span>
                      </Link>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

