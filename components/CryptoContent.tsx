'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

interface CryptoCoin {
  id: string
  symbol: string
  name: string
  image: string
  current_price: number
  market_cap_rank: number
  price_change_percentage_24h: number
  price_change_percentage_7d: number | null
  market_cap: number
  total_volume: number
  sparkline_in_7d?: {
    price: number[]
  }
}

export default function CryptoContent() {
  const [crypto, setCrypto] = useState<CryptoCoin[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchCrypto() {
      try {
        const response = await fetch('/api/rates?city=damascus')
        const data = await response.json()
        console.log('Crypto data received:', data.crypto?.length, 'coins') // Debug log
        if (data.crypto && Array.isArray(data.crypto) && data.crypto.length > 0) {
          setCrypto(data.crypto.slice(0, 20)) // Top 20
        } else {
          console.warn('No crypto data found in response')
        }
      } catch (error) {
        console.error('Error fetching crypto:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchCrypto()
    // Refresh every 60 seconds for live updates
    const interval = setInterval(fetchCrypto, 60000)
    return () => clearInterval(interval)
  }, [])

  const formatPrice = (price: number) => {
    if (price < 1) return price.toFixed(6)
    if (price < 100) return price.toFixed(2)
    return price.toLocaleString('en-US', { maximumFractionDigits: 2 })
  }

  const formatChange = (change: number | null) => {
    if (change === null || change === undefined) return null
    const isPositive = change >= 0
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-sm font-medium ${
        isPositive ? 'bg-emerald-500/10 text-emerald-600' : 'bg-red-500/10 text-red-600'
      }`}>
        {isPositive ? '▲' : '▼'} {Math.abs(change).toFixed(2)}%
      </span>
    )
  }

  const formatMarketCap = (value: number) => {
    if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`
    if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`
    if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`
    return `$${value.toLocaleString()}`
  }

  const renderSparkline = (prices: number[] | undefined) => {
    if (!prices || prices.length === 0) return null
    
    const max = Math.max(...prices)
    const min = Math.min(...prices)
    const range = max - min || 1
    
    const points = prices.map((price, index) => {
      const x = (index / (prices.length - 1)) * 100
      const y = 100 - ((price - min) / range) * 100
      return `${x},${y}`
    }).join(' ')
    
    const isPositive = prices[prices.length - 1] > prices[0]
    
    return (
      <div className="w-24 h-8 flex items-center justify-center">
        <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
          <polyline
            points={points}
            fill="none"
            stroke={isPositive ? '#10b981' : '#ef4444'}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">العملات الرقمية</h1>
          <p className="text-[var(--muted)]">جار التحميل...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">العملات الرقمية</h1>
        <p className="text-[var(--muted)]">
          أسعار العملات الرقمية الحية - بيتكوين، إيثريوم وأكثر ٢٠ عملة رقمية
        </p>
      </div>

      <div className="bg-[var(--card)] rounded-xl border border-[var(--border)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[var(--border)]">
                <th className="px-4 py-4 text-[var(--muted)]">#</th>
                <th className="px-4 py-4 text-start font-semibold">العملة</th>
                <th className="px-4 py-4 text-end font-semibold">السعر</th>
                <th className="px-4 py-4 text-end font-semibold">24س</th>
                <th className="px-4 py-4 text-end font-semibold hidden md:table-cell">7أيام</th>
                <th className="px-4 py-4 text-end font-semibold hidden lg:table-cell">القيمة السوقية</th>
                <th className="px-4 py-4 text-end font-semibold hidden lg:table-cell">الحجم</th>
                <th className="px-4 py-4 hidden lg:table-cell">الرسم</th>
              </tr>
            </thead>
            <tbody>
              {crypto.length === 0 ? (
        <tr>
          <td colSpan={8} className="px-4 py-12 text-center text-[var(--muted)]">
            <p>لا توجد بيانات عملات رقمية متاحة حالياً</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-[var(--primary)] text-white rounded-lg hover:opacity-90 transition-opacity"
            >
              إعادة المحاولة
            </button>
          </td>
        </tr>
      ) : (
        crypto.map((coin) => (
                <tr
                  key={coin.id}
                  className="border-t border-[var(--border)] hover:bg-[var(--border)]/50 transition-colors"
                >
                  <td className="px-4 py-4 text-[var(--muted)]">{coin.market_cap_rank}</td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={coin.image}
                        alt={coin.name}
                        width={32}
                        height={32}
                        className="rounded-full"
                        loading="lazy"
                      />
                      <div>
                        <p className="font-medium">{coin.name}</p>
                        <p className="text-sm text-[var(--muted)]">{coin.symbol.toUpperCase()}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-end font-mono font-medium">
                    ${formatPrice(coin.current_price)}
                  </td>
                  <td className="px-4 py-4 text-end">
                    {formatChange(coin.price_change_percentage_24h)}
                  </td>
                  <td className="px-4 py-4 text-end hidden md:table-cell">
                    {formatChange(coin.price_change_percentage_7d)}
                  </td>
                  <td className="px-4 py-4 text-end font-mono hidden lg:table-cell">
                    {formatMarketCap(coin.market_cap)}
                  </td>
                  <td className="px-4 py-4 text-end font-mono hidden lg:table-cell">
                    {formatMarketCap(coin.total_volume)}
                  </td>
                  <td className="px-4 py-4 hidden lg:table-cell">
                    {renderSparkline(coin.sparkline_in_7d?.price)}
                  </td>
                </tr>
              ))
      )}
            </tbody>
          </table>
        </div>
      </div>
      <p className="mt-6 text-sm text-[var(--muted)] text-center">
        أسعار العملات الرقمية متقلبة للغاية. البيانات مقدمة لأغراض إعلامية فقط.
      </p>
    </div>
  )
}

