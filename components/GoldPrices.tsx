'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { GoldKarat } from '@/lib/api'

export default function GoldPrices() {
  const [goldData, setGoldData] = useState<{
    ounce: { price_usd: number; change: number }
    karats: GoldKarat[]
  } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/rates?city=damascus')
        const data = await response.json()
        
        if (data.gold) {
          setGoldData({
            ounce: data.gold.ounce || { price_usd: 4603, change: 0 },
            karats: data.gold.karats?.filter((k: GoldKarat) => k.cities) || [],
          })
        }
      } catch (error) {
        console.error('Error fetching gold prices:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
    const interval = setInterval(fetchData, 60000)
    return () => clearInterval(interval)
  }, [])

  if (loading || !goldData) {
    return (
      <section>
        <div className="animate-pulse text-[var(--muted)]">جاري التحميل...</div>
      </section>
    )
  }

  const formatPrice = (price: number) => {
    return price.toLocaleString('ar-SY')
  }

  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl lg:text-2xl font-bold">أسعار الذهب</h2>
        <Link href="/gold" className="text-[var(--primary)] hover:underline text-sm font-medium">
          عرض الكل ←
        </Link>
      </div>
      
      <Link
        href="/gold/ounce"
        className="block bg-gradient-to-r from-amber-600 to-yellow-500 rounded-lg p-5 mb-4 text-white hover:from-amber-500 hover:to-yellow-400 transition-all"
      >
        <div className="flex items-center justify-between">
          <div>
            <span className="text-sm text-white/80">أونصة الذهب</span>
            <div className="text-3xl lg:text-4xl font-bold tabular-nums mt-1">
              <span className="transition-colors inline-block">${formatPrice(goldData.ounce.price_usd)}</span>
            </div>
          </div>
          <div className="text-end">
            <span className={`text-2xl font-bold ${
              goldData.ounce.change >= 0 ? 'text-emerald-200' : 'text-red-200'
            }`}>
              {goldData.ounce.change >= 0 ? '↑' : '↓'} {Math.abs(goldData.ounce.change).toFixed(2)}%
            </span>
            <span className="block text-sm text-white/70 mt-1">تغير 24 ساعة</span>
          </div>
        </div>
      </Link>
      
      <div className="bg-[var(--card)] rounded-lg border border-[var(--border)] overflow-hidden">
        <div className="grid grid-cols-4 gap-4 px-4 py-3 bg-[var(--surface)] text-sm font-semibold text-[var(--muted)]">
          <div>العيار</div>
          <div className="text-end">شراء (ل.س)</div>
          <div className="text-end">بيع (ل.س)</div>
          <div className="text-end">التغير</div>
        </div>
        
        {goldData.karats.slice(0, 4).map((gold) => {
          const cityData = gold.cities?.damascus
          if (!cityData) return null
          
          return (
            <Link
              key={gold.karat}
              href={`/gold/${gold.karat.toLowerCase()}/syp`}
              className="grid grid-cols-4 gap-4 px-4 py-3 border-t border-[var(--border)] hover:bg-[var(--surface)] transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-yellow-400 flex items-center justify-center text-xs font-bold text-white">
                  {gold.karat.replace('K', '')}
                </span>
                <span className="font-semibold">{gold.karat}</span>
              </div>
              <div className="text-end font-mono font-bold tabular-nums">
                <span className="transition-colors inline-block">{formatPrice(cityData.buy)}</span>
              </div>
              <div className="text-end font-mono font-bold tabular-nums">
                <span className="transition-colors inline-block">{formatPrice(cityData.sell)}</span>
              </div>
              <div className="text-end">
                <span className={`text-xs ${
                  cityData.change >= 0 ? 'text-emerald-600' : 'text-red-600'
                }`}>
                  {cityData.change >= 0 ? '+' : ''}{cityData.change.toFixed(2)}%
                </span>
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
