'use client'

import { useState, useEffect } from 'react'

interface PortfolioItem {
  id: string
  type: 'currency' | 'gold' | 'crypto'
  name: string
  code: string
  amount: number
  buyPrice: number
  currentPrice: number
  value: number
  profit: number
  profitPercent: number
}

export default function PortfolioContent() {
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Load portfolio from localStorage
    const saved = localStorage.getItem('portfolio')
    if (saved) {
      try {
        const items = JSON.parse(saved)
        // Fetch current prices and update
        updatePortfolioPrices(items)
      } catch (error) {
        console.error('Error loading portfolio:', error)
        setLoading(false)
      }
    } else {
      setLoading(false)
    }
  }, [])

  async function updatePortfolioPrices(items: PortfolioItem[]) {
    try {
      const response = await fetch('/api/rates?city=damascus')
      const data = await response.json()

      const updated = items.map((item) => {
        let currentPrice = item.currentPrice

        if (item.type === 'currency') {
          const currency = data.rates?.find((c: any) => c.code === item.code)
          if (currency?.cities?.damascus) {
            currentPrice = currency.cities.damascus.sell // Use sell price
          }
        } else if (item.type === 'gold') {
          const karat = data.gold?.karats?.find((k: any) => k.karat === item.code)
          if (karat?.cities?.damascus) {
            currentPrice = karat.cities.damascus.sell
          }
        } else if (item.type === 'crypto') {
          const crypto = data.crypto?.find((c: any) => c.symbol.toUpperCase() === item.code)
          if (crypto) {
            currentPrice = crypto.current_price
          }
        }

        const value = item.amount * currentPrice
        const profit = value - (item.amount * item.buyPrice)
        const profitPercent = ((currentPrice - item.buyPrice) / item.buyPrice) * 100

        return {
          ...item,
          currentPrice,
          value,
          profit,
          profitPercent
        }
      })

      setPortfolio(updated)
    } catch (error) {
      console.error('Error updating portfolio:', error)
    } finally {
      setLoading(false)
    }
  }

  const totalValue = portfolio.reduce((sum, item) => sum + item.value, 0)
  const totalProfit = portfolio.reduce((sum, item) => sum + item.profit, 0)
  const totalProfitPercent = totalValue > 0 ? (totalProfit / (totalValue - totalProfit)) * 100 : 0

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">محفظتي</h1>
          <p className="text-[var(--muted)]">جار التحميل...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">محفظتي</h1>
        <p className="text-[var(--muted)]">
          تتبع محفظة أصولك - العملات والذهب والعملات الرقمية
        </p>
      </div>

      {portfolio.length === 0 ? (
        <div className="bg-[var(--card)] rounded-xl border border-[var(--border)] p-12 text-center">
          <div className="w-16 h-16 bg-[var(--surface)] rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-[var(--muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <h2 className="text-xl font-bold mb-2">محفظتك فارغة</h2>
          <p className="text-[var(--muted)] mb-6">
            أضف أصولك لتتبع قيمتها وأرباحك
          </p>
          <button className="px-6 py-3 bg-[var(--primary)] text-white rounded-lg font-medium hover:opacity-90 transition-opacity">
            إضافة أصل
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-[var(--card)] rounded-xl border border-[var(--border)] p-6">
              <p className="text-sm text-[var(--muted)] mb-2">القيمة الإجمالية</p>
              <p className="text-3xl font-bold font-mono">
                {totalValue.toLocaleString('ar-SY')} <span className="text-lg">ل.س</span>
              </p>
            </div>
            <div className="bg-[var(--card)] rounded-xl border border-[var(--border)] p-6">
              <p className="text-sm text-[var(--muted)] mb-2">إجمالي الربح/الخسارة</p>
              <p className={`text-3xl font-bold font-mono ${
                totalProfit >= 0 ? 'text-emerald-600' : 'text-red-600'
              }`}>
                {totalProfit >= 0 ? '+' : ''}{totalProfit.toLocaleString('ar-SY')} <span className="text-lg">ل.س</span>
              </p>
            </div>
            <div className="bg-[var(--card)] rounded-xl border border-[var(--border)] p-6">
              <p className="text-sm text-[var(--muted)] mb-2">نسبة الربح</p>
              <p className={`text-3xl font-bold ${
                totalProfitPercent >= 0 ? 'text-emerald-600' : 'text-red-600'
              }`}>
                {totalProfitPercent >= 0 ? '+' : ''}{totalProfitPercent.toFixed(2)}%
              </p>
            </div>
          </div>

          <div className="bg-[var(--card)] rounded-xl border border-[var(--border)] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-[var(--border)]">
                    <th className="px-4 py-4 text-start font-semibold">الأصل</th>
                    <th className="px-4 py-4 text-end font-semibold">الكمية</th>
                    <th className="px-4 py-4 text-end font-semibold">سعر الشراء</th>
                    <th className="px-4 py-4 text-end font-semibold">السعر الحالي</th>
                    <th className="px-4 py-4 text-end font-semibold">القيمة</th>
                    <th className="px-4 py-4 text-end font-semibold">الربح/الخسارة</th>
                  </tr>
                </thead>
                <tbody>
                  {portfolio.map((item) => (
                    <tr
                      key={item.id}
                      className="border-t border-[var(--border)] hover:bg-[var(--border)]/50 transition-colors"
                    >
                      <td className="px-4 py-4">
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-[var(--muted)]">{item.code}</p>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-end font-mono">
                        {item.amount.toLocaleString('ar-SY')}
                      </td>
                      <td className="px-4 py-4 text-end font-mono">
                        {item.buyPrice.toLocaleString('ar-SY')}
                      </td>
                      <td className="px-4 py-4 text-end font-mono font-medium">
                        {item.currentPrice.toLocaleString('ar-SY')}
                      </td>
                      <td className="px-4 py-4 text-end font-mono font-bold">
                        {item.value.toLocaleString('ar-SY')} ل.س
                      </td>
                      <td className="px-4 py-4 text-end">
                        <div className={`flex flex-col items-end ${
                          item.profit >= 0 ? 'text-emerald-600' : 'text-red-600'
                        }`}>
                          <span className="font-bold">
                            {item.profit >= 0 ? '+' : ''}{item.profit.toLocaleString('ar-SY')} ل.س
                          </span>
                          <span className="text-sm">
                            {item.profitPercent >= 0 ? '+' : ''}{item.profitPercent.toFixed(2)}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

