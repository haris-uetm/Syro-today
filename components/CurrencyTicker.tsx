'use client'

import { useEffect, useState } from 'react'
import { Currency } from '@/lib/api'

export default function CurrencyTicker() {
  const [currencies, setCurrencies] = useState<Currency[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/rates?city=damascus')
        const data = await response.json()
        
        if (data.rates) {
          // Get first 6 currencies for ticker
          setCurrencies(data.rates.slice(0, 6))
        }
      } catch (error) {
        console.error('Error fetching ticker data:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
    // Refresh every 60 seconds
    const interval = setInterval(fetchData, 60000)
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div className="bg-[#0f172a] border-b border-white/10 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-6 py-2 overflow-x-auto">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="flex items-center gap-3 animate-pulse flex-shrink-0">
                <div className="w-16 h-4 bg-white/10 rounded"></div>
                <div className="w-20 h-5 bg-white/10 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (currencies.length === 0) {
    return null
  }

  return (
    <div className="bg-[#0f172a] border-b border-white/10 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-6 py-2 overflow-x-auto">
          {currencies.map((currency) => {
            const cityData = currency.cities?.damascus
            if (!cityData) return null
            
            return (
              <div key={currency.code} className="flex items-center gap-3 flex-shrink-0">
                <span className="text-sm text-white/70">{currency.name_ar || currency.name}</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-lg font-bold text-white tabular-nums">
                    {cityData.buy.toLocaleString()}
                  </span>
                  <span className="text-white/40 mx-1">-</span>
                  <span className="text-lg font-bold text-white tabular-nums">
                    {cityData.sell.toLocaleString()}
                  </span>
                </div>
                <span className="text-sm text-white/60">ل.س</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

