'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Currency } from '@/lib/api'

export default function CurrencyRates() {
  const [currencies, setCurrencies] = useState<Currency[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/rates?city=damascus')
        const data = await response.json()
        
        if (data.rates) {
          // Get first 6 currencies
          setCurrencies(data.rates.slice(0, 6))
        }
      } catch (error) {
        console.error('Error fetching currency rates:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
    const interval = setInterval(fetchData, 60000)
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl lg:text-2xl font-bold">الأسعار الحالية</h2>
        </div>
        <div className="bg-[var(--card)] rounded-lg border border-[var(--border)] p-8 animate-pulse">
          <div className="text-[var(--muted)]">جاري التحميل...</div>
        </div>
      </section>
    )
  }

  const formatChange = (change: number) => {
    const isPositive = change >= 0
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-sm font-medium bg-[var(--surface)] ${
        isPositive ? 'text-emerald-600' : 'text-red-600'
      }`}>
        {isPositive ? '▲' : '▼'} {Math.abs(change).toFixed(2)}%
      </span>
    )
  }

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl lg:text-2xl font-bold">الأسعار الحالية</h2>
        <span className="text-sm text-[var(--muted)]">-</span>
      </div>
      
      <div className="bg-[var(--card)] rounded-lg border border-[var(--border)] overflow-hidden">
        <div className="rate-row bg-[var(--surface)] font-semibold text-sm text-[var(--muted)]">
          <div>العملة</div>
          <div className="text-end">شراء</div>
          <div className="text-end">مبيع</div>
          <div className="text-end">التغير</div>
        </div>
        
        {currencies.map((currency) => {
          const cityData = currency.cities?.damascus
          if (!cityData) return null
          
          return (
            <Link
              key={currency.code}
              href={`/currency/${currency.slug}`}
              className="rate-row group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-7 bg-blue-600 rounded-sm flex items-center justify-center text-white font-bold text-xs">
                  {currency.code}
                </div>
                <div>
                  <span className="font-semibold group-hover:text-[var(--primary)] transition-colors">
                    {currency.code}
                  </span>
                  <span className="block text-sm text-[var(--muted)]">
                    {currency.name_ar || currency.name}
                  </span>
                </div>
              </div>
              <div className="text-end font-mono font-bold tabular-nums text-lg">
                <span className="transition-colors inline-block">
                  {cityData.buy.toLocaleString('ar-SY')}
                </span>
              </div>
              <div className="text-end font-mono font-bold tabular-nums text-lg">
                <span className="transition-colors inline-block">
                  {cityData.sell.toLocaleString('ar-SY')}
                </span>
              </div>
              <div className="text-end">
                {formatChange(cityData.change)}
              </div>
            </Link>
          )
        })}
        
        <div className="px-5 py-3 bg-[var(--surface)] border-t border-[var(--border)]">
          <Link href="/currencies" className="text-[var(--primary)] hover:underline font-medium text-sm">
            عرض جميع العملات ←
          </Link>
        </div>
      </div>
    </section>
  )
}
