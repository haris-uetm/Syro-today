'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Currency } from '@/lib/api'

export default function HeroSection() {
  const [usdCurrency, setUsdCurrency] = useState<Currency | null>(null)
  const [currencies, setCurrencies] = useState<Currency[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/rates?city=damascus')
        const data = await response.json()
        
        if (data.rates) {
          const usd = data.rates.find((c: Currency) => c.code === 'USD')
          if (usd) setUsdCurrency(usd)
          setCurrencies(data.rates.slice(1, 5)) // Get EUR, TRY, SAR, EGP
        }
      } catch (error) {
        console.error('Error fetching hero data:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
    const interval = setInterval(fetchData, 60000)
    return () => clearInterval(interval)
  }, [])

  if (loading || !usdCurrency) {
    return (
      <section className="hero-gradient text-white -mt-16 pt-20 pb-8 lg:pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">جاري التحميل...</div>
        </div>
      </section>
    )
  }

  const cityData = usdCurrency.cities?.damascus

  return (
    <section className="hero-gradient text-white -mt-16 pt-20 pb-8 lg:pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <div className="relative inline-block">
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all bg-white/15 text-white hover:bg-white/25 backdrop-blur-sm border border-white/20">
              <svg className="w-4 h-4 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>سوريا - عام</span>
              <svg className="w-4 h-4 transition-transform text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          <Link href={`/currency/${usdCurrency.slug}`} className="block group">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-14 h-10 bg-blue-600 rounded-sm flex items-center justify-center text-white font-bold text-xs">
                {usdCurrency.code}
              </div>
              <div>
                <h1 className="text-lg font-medium text-white/80 group-hover:text-white transition-colors">
                  سعر {usdCurrency.name_ar || usdCurrency.name}
                </h1>
                <p className="text-sm text-white/60">سوريا - عام</p>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-baseline gap-2 sm:gap-3 flex-wrap">
                <span className="text-3xl sm:text-4xl lg:text-5xl font-bold tabular-nums whitespace-nowrap">
                  <span className="transition-colors inline-block">{cityData.buy.toLocaleString('ar-SY')}</span>
                  <span className="text-white/40 mx-1 sm:mx-2">-</span>
                  <span className="transition-colors inline-block">{cityData.sell.toLocaleString('ar-SY')}</span>
                </span>
                <span className="text-lg sm:text-xl text-white/60">ل.س</span>
              </div>
              <p className="text-xs sm:text-sm text-white/50 mt-2">شراء - مبيع</p>
            </div>
            <div className="flex items-center gap-4 mt-4">
              <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
                cityData.change >= 0 ? 'bg-emerald-500/20' : 'bg-red-500/20'
              }`}>
                <span className={cityData.change >= 0 ? 'text-emerald-300' : 'text-red-300'}>
                  {cityData.change >= 0 ? '↑' : '↓'} {cityData.change >= 0 ? '+' : ''}{cityData.change.toFixed(2)}%
                </span>
              </span>
              <span className="text-sm text-white/60">-</span>
            </div>
          </Link>
          
          <div className="grid grid-cols-2 gap-3">
            {currencies.map((currency) => {
              const cityData = currency.cities?.damascus
              if (!cityData) return null
              
              return (
                <Link
                  key={currency.code}
                  href={`/currency/${currency.slug}`}
                  className="bg-white/10 backdrop-blur-sm rounded-lg p-4 hover:bg-white/15 transition-colors"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-6 bg-blue-600 rounded-sm flex items-center justify-center text-white font-bold text-xs">
                      {currency.code}
                    </div>
                    <span className="font-medium">{currency.code}</span>
                  </div>
                  <div className="text-2xl font-bold tabular-nums">
                    <span className="transition-colors inline-block">{cityData.buy.toLocaleString('ar-SY')}</span>
                  </div>
                  <span className={`text-xs ${
                    cityData.change >= 0 ? 'text-emerald-300' : 'text-red-300'
                  }`}>
                    {cityData.change >= 0 ? '+' : ''}{cityData.change.toFixed(2)}%
                  </span>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
