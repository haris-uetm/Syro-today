'use client'

import { useState } from 'react'
import { Currency, CityData } from '@/lib/api'
import CurrencyConverter from './CurrencyConverter'

interface CurrencyDetailContentProps {
  currency: Currency
  slug: string
}

export default function CurrencyDetailContent({ currency, slug }: CurrencyDetailContentProps) {
  const [city, setCity] = useState('damascus')
  const [activeCity, setActiveCity] = useState('damascus')
  
  const cityData: CityData = currency.cities[city] || currency.cities.damascus
  const cities = Object.keys(currency.cities || {})
  
  const formatChange = (change: number) => {
    const isPositive = change >= 0
    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
        isPositive 
          ? 'bg-emerald-500/10 text-emerald-600' 
          : 'bg-red-500/10 text-red-600'
      }`}>
        {isPositive ? '▲' : '▼'} {Math.abs(change).toFixed(2)}%
      </span>
    )
  }

  const formatPrice = (price: number) => {
    return price.toLocaleString('ar-SY')
  }

  const conversionAmounts = [1, 10, 100, 500, 1000]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <div className="flex flex-wrap items-center gap-2 text-sm text-[var(--muted)] mb-4">
        <a href="/currencies" className="hover:text-[var(--primary)]">أسعار العملات مقابل الليرة السورية</a>
        <span>/</span>
        <span>{currency.name_ar || currency.name}</span>
      </div>

      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-12 bg-blue-600 rounded-sm flex items-center justify-center text-white font-bold text-xs">
              {currency.code}
            </div>
            <div>
              <h1 className="text-3xl font-bold">
                {currency.name_ar || currency.name} ({currency.code})
              </h1>
              <p className="text-[var(--muted)]">
                سوريا - عام - آخر تحديث: <span className="text-[var(--muted)]">-</span>
              </p>
            </div>
          </div>
          
          <div className="relative inline-block">
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all bg-[var(--card)] border border-[var(--border)] hover:border-[var(--primary)] hover:bg-[var(--surface)]">
              <svg className="w-4 h-4 text-[var(--muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>سوريا - عام</span>
              <svg className="w-4 h-4 transition-transform text-[var(--muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Ad Space */}
      <div className="mb-8">
        <div className="ad-slot-placeholder" style={{ minHeight: '90px' }}></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Price Card */}
          <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-xl overflow-hidden text-white">
            <div className="p-5">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
                <div>
                  <p className="text-white/70 text-xs uppercase tracking-wide mb-1">شراء</p>
                  <p className="text-2xl sm:text-3xl font-bold font-mono">
                    {formatPrice(cityData.buy)}
                    <span className="text-sm text-white/50 ms-1">ل.س</span>
                  </p>
                </div>
                <div>
                  <p className="text-white/70 text-xs uppercase tracking-wide mb-1">بيع</p>
                  <p className="text-2xl sm:text-3xl font-bold font-mono">
                    {formatPrice(cityData.sell)}
                    <span className="text-sm text-white/50 ms-1">ل.س</span>
                  </p>
                </div>
                <div className="col-span-2 sm:col-span-1 sm:text-end">
                  <p className="text-white/70 text-xs uppercase tracking-wide mb-1">التغيير</p>
                  <p className="text-xl sm:text-2xl font-bold font-mono text-emerald-400">
                    {cityData.change >= 0 ? '▲' : '▼'} {Math.abs(cityData.change)}<span className="text-sm ms-1">ل.س</span>
                  </p>
                  <p className="text-base font-bold font-mono text-emerald-400/80">
                    {cityData.change >= 0 ? '+' : ''}{cityData.change.toFixed(2)}%
                  </p>
                </div>
              </div>
            </div>
            <div className="px-5 py-3 bg-black/20 flex items-center gap-4">
              <div className="flex-1">
                <p className="text-white/60 text-xs uppercase tracking-wide mb-2">نطاق اليوم</p>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-white/60 min-w-[50px]">{formatPrice(cityData.day_low)}</span>
                  <div className="flex-1 h-1.5 bg-white/10 rounded-full relative">
                    <div className="absolute h-full rounded-full bg-gradient-to-r from-emerald-500 via-yellow-500 to-red-500" style={{ width: '100%' }}></div>
                    <div className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow border-2 border-slate-700" style={{ right: 'calc(50% - 6px)' }}></div>
                  </div>
                  <span className="text-xs font-mono text-white/60 min-w-[50px] text-end">{formatPrice(cityData.day_high)}</span>
                </div>
              </div>
              <div className="text-end border-s border-white/10 ps-4">
                <p className="text-white/60 text-xs uppercase tracking-wide">الإغلاق السابق</p>
                <p className="text-lg font-mono text-white/90">{formatPrice(cityData.prev_close)}</p>
              </div>
            </div>
          </div>

          {/* Chart Placeholder */}
          <div className="bg-[var(--card)] rounded-xl border border-[var(--border)] p-6 h-[400px] flex items-center justify-center">
            <div className="animate-pulse text-[var(--muted)]">Loading chart...</div>
          </div>

          {/* Conversion Table */}
          <section>
            <h2 className="text-2xl font-bold mb-4">جدول التحويل</h2>
            <div className="bg-[var(--card)] rounded-xl border border-[var(--border)] overflow-hidden">
              <div className="table-container">
                <table className="w-full">
                  <thead>
                    <tr className="bg-[var(--border)]">
                      <th className="px-4 py-3 text-start font-semibold">{currency.code}</th>
                      <th className="px-4 py-3 text-end font-semibold">القيمة بالليرة السورية (شراء)</th>
                      <th className="px-4 py-3 text-end font-semibold">القيمة بالليرة السورية (مبيع)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {conversionAmounts.map((amount) => (
                      <tr key={amount} className="border-t border-[var(--border)] hover:bg-[var(--border)]/50 transition-colors">
                        <td className="px-4 py-3 font-mono">{amount} {currency.code}</td>
                        <td className="px-4 py-3 text-end font-mono">
                          {formatPrice(amount * cityData.buy)} ل.س
                        </td>
                        <td className="px-4 py-3 text-end font-mono">
                          {formatPrice(amount * cityData.sell)} ل.س
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* Ad Space */}
          <div className="ad-slot-placeholder" style={{ minHeight: '90px' }}></div>

          {/* Cities */}
          <section>
            <h2 className="text-2xl font-bold mb-4">الأسعار حسب المدينة</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {cities.map((cityKey) => {
                const data = currency.cities[cityKey]
                const isActive = activeCity === cityKey
                const cityNames: { [key: string]: string } = {
                  damascus: 'سوريا - عام',
                  alhasakah: 'الحسكة',
                }
                
                return (
                  <button
                    key={cityKey}
                    onClick={() => {
                      setCity(cityKey)
                      setActiveCity(cityKey)
                    }}
                    className={`p-4 rounded-xl border transition-colors text-start ${
                      isActive
                        ? 'bg-[var(--primary)] text-white border-[var(--primary)]'
                        : 'bg-[var(--card)] border-[var(--border)] hover:border-[var(--primary)]'
                    }`}
                  >
                    <h3 className={`font-semibold mb-2 ${isActive ? '' : 'text-[var(--muted)]'}`}>
                      {cityNames[cityKey] || cityKey}
                    </h3>
                    <p className="font-mono text-lg">{formatPrice(data.buy)}</p>
                    <p className={`text-sm ${isActive ? 'text-green-200' : 'change-positive'}`}>
                      {data.change >= 0 ? '+' : ''}{data.change.toFixed(2)}%
                    </p>
                  </button>
                )
              })}
            </div>
          </section>

          {/* Performance */}
          <section>
            <h2 className="text-2xl font-bold mb-4">الأداء</h2>
            <div className="bg-[var(--card)] rounded-xl border border-[var(--border)] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-[var(--border)]">
                      <th className="px-6 py-4 text-start font-semibold">الفترة</th>
                      <th className="px-6 py-4 text-end font-semibold">التغيير</th>
                      <th className="px-6 py-4 text-end font-semibold">الاتجاه</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t border-[var(--border)]">
                      <td className="px-6 py-4 font-medium">اليوم</td>
                      <td className="px-6 py-4 text-end">{formatChange(cityData.change)}</td>
                      <td className="px-6 py-4 text-end">
                        <div className="w-20 h-2 bg-[var(--border)] rounded-full overflow-hidden inline-block">
                          <div 
                            className={`h-full ${cityData.change >= 0 ? 'bg-emerald-500' : 'bg-red-500'}`} 
                            style={{ width: `${Math.min(Math.abs(cityData.change) * 10, 100)}%` }}
                          ></div>
                        </div>
                      </td>
                    </tr>
                    <tr className="border-t border-[var(--border)] bg-[var(--background)]/50">
                      <td className="px-6 py-4 font-medium">هذا الأسبوع</td>
                      <td className="px-6 py-4 text-end">{formatChange(cityData.change_week)}</td>
                      <td className="px-6 py-4 text-end">
                        <div className="w-20 h-2 bg-[var(--border)] rounded-full overflow-hidden inline-block">
                          <div 
                            className={`h-full ${cityData.change_week >= 0 ? 'bg-emerald-500' : 'bg-red-500'}`} 
                            style={{ width: `${Math.min(Math.abs(cityData.change_week) * 5, 100)}%` }}
                          ></div>
                        </div>
                      </td>
                    </tr>
                    <tr className="border-t border-[var(--border)]">
                      <td className="px-6 py-4 font-medium">هذا الشهر</td>
                      <td className="px-6 py-4 text-end">{formatChange(cityData.change_month)}</td>
                      <td className="px-6 py-4 text-end">
                        <div className="w-20 h-2 bg-[var(--border)] rounded-full overflow-hidden inline-block">
                          <div 
                            className={`h-full ${cityData.change_month >= 0 ? 'bg-emerald-500' : 'bg-red-500'}`} 
                            style={{ width: `${Math.min(Math.abs(cityData.change_month), 100)}%` }}
                          ></div>
                        </div>
                      </td>
                    </tr>
                    <tr className="border-t border-[var(--border)] bg-[var(--background)]/50">
                      <td className="px-6 py-4 font-medium">هذا العام</td>
                      <td className="px-6 py-4 text-end">{formatChange(cityData.change_year)}</td>
                      <td className="px-6 py-4 text-end">
                        <div className="w-20 h-2 bg-[var(--border)] rounded-full overflow-hidden inline-block">
                          <div 
                            className={`h-full ${cityData.change_year >= 0 ? 'bg-emerald-500' : 'bg-red-500'}`} 
                            style={{ width: `${Math.min(Math.abs(cityData.change_year) / 10, 100)}%` }}
                          ></div>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* FAQs */}
          <section className="bg-[var(--card)] rounded-xl border border-[var(--border)] overflow-hidden">
            <h2 className="text-xl font-bold p-6 pb-4">الأسئلة الشائعة</h2>
            <div className="border-t border-[var(--border)]">
              <FAQItem
                question={`ما هو سعر صرف ${currency.name_ar} الحالي في دمشق؟`}
                answer={`سعر صرف ${currency.name_ar} (${currency.code}) الحالي في دمشق هو ${formatPrice(cityData.buy)} ل.س للشراء و ${formatPrice(cityData.sell)} ل.س للبيع. يتم تحديث الأسعار عدة مرات يومياً خلال ساعات التداول (10 صباحاً - 6 مساءً بتوقيت دمشق).`}
              />
              <FAQItem
                question={`أين يمكنني صرف ${currency.name_ar} في سوريا؟`}
                answer={`يمكنك صرف ${currency.name_ar} في مكاتب الصرافة المرخصة في جميع أنحاء المدن السورية. توجد مكاتب الصرافة الرئيسية عادةً في المناطق التجارية وبالقرب من الأسواق. قارن دائماً الأسعار من عدة مكاتب لأنها قد تختلف.`}
              />
              <FAQItem
                question={`ما الفرق بين سعر الشراء وسعر البيع لـ${currency.name_ar}؟`}
                answer={`سعر "الشراء" هو ما تدفعه لك شركات الصرافة عندما تبيع لها ${currency.name_ar} (التحويل إلى الليرة السورية). سعر "البيع" هو ما تدفعه لها عند شراء ${currency.name_ar} (التحويل من الليرة السورية). يُسمى الفرق بين هذين السعرين "الهامش" ويمثل ربح شركة الصرافة.`}
              />
            </div>
          </section>
        </div>

        {/* Sidebar - Currency Converter */}
        <div className="space-y-6">
          <CurrencyConverter currency={currency} />
        </div>
      </div>
    </div>
  )
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="border-b border-[var(--border)] last:border-b-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center justify-between gap-4 text-start hover:bg-[var(--background)] transition-colors"
        aria-expanded={isOpen}
      >
        <span className="font-medium">{question}</span>
        <svg
          className={`w-5 h-5 flex-shrink-0 text-[var(--muted)] transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div className={`overflow-hidden transition-all duration-200 ${isOpen ? 'max-h-96' : 'max-h-0'}`}>
        <div className="px-6 pb-4 text-[var(--muted)] leading-relaxed">{answer}</div>
      </div>
    </div>
  )
}

