'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Currency } from '@/lib/api'

interface CurrencyListProps {
  currencies: Currency[]
  city?: string
}

export default function CurrencyList({ currencies, city = 'damascus' }: CurrencyListProps) {
  const [searchQuery, setSearchQuery] = useState('')

  const formatChange = (change: number) => {
    const isPositive = change >= 0
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded font-medium text-sm ${
        isPositive ? 'bg-emerald-500/10 text-emerald-600' : 'bg-red-500/10 text-red-600'
      }`}>
        {isPositive ? '▲' : '▼'} {Math.abs(change).toFixed(2)}%
      </span>
    )
  }

  const filteredCurrencies = currencies.filter((currency) => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return (
      currency.code.toLowerCase().includes(query) ||
      currency.name_ar?.toLowerCase().includes(query) ||
      currency.name?.toLowerCase().includes(query)
    )
  })

  return (
    <>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="relative inline-block">
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all bg-[var(--card)] border border-[var(--border)] hover:border-[var(--primary)] hover:bg-[var(--surface)]">
            <svg className="w-4 h-4 text-[var(--muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </svg>
            <span>سوريا - عام</span>
            <svg className="w-4 h-4 transition-transform text-[var(--muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </button>
        </div>
        <div className="relative w-full sm:w-64">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <svg className="w-4 h-4 text-[var(--muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
          <input
            type="text"
            placeholder="ابحث عن عملة..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full ps-10 pe-4 py-2 rounded-lg bg-[var(--card)] border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent placeholder:text-[var(--muted)]"
          />
        </div>
      </div>

      <div className="bg-[var(--card)] rounded-xl border border-[var(--border)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[var(--border)]">
                <th className="px-4 py-4 text-start font-semibold">العملة</th>
                <th className="px-4 py-4 text-end font-semibold">شراء</th>
                <th className="px-4 py-4 text-end font-semibold">مبيع</th>
                <th className="px-4 py-4 text-end font-semibold">التغير</th>
                <th className="px-4 py-4 text-end font-semibold hidden md:table-cell">أعلى</th>
                <th className="px-4 py-4 text-end font-semibold hidden md:table-cell">أدنى</th>
                <th className="px-4 py-4 w-20"></th>
              </tr>
            </thead>
            <tbody>
              {filteredCurrencies.map((currency, index) => {
                const cityData = currency.cities?.[city] || currency.cities?.damascus
                if (!cityData) return null
                
                return (
                  <tr
                    key={currency.code}
                    className={`border-t border-[var(--border)] hover:bg-[var(--primary)]/5 transition-colors ${
                      index % 2 === 1 ? 'bg-[var(--background)]/50' : ''
                    }`}
                  >
                    <td className="px-4 py-4">
                      <Link
                        href={`/currency/${currency.slug}`}
                        className="flex items-center gap-3 hover:text-[var(--primary)] transition-colors"
                      >
                        <span className="text-2xl">{currency.flag}</span>
                        <div>
                          <span className="font-bold block">{currency.code}</span>
                          <span className="text-xs text-[var(--muted)]">
                            {currency.name_ar || currency.name}
                          </span>
                        </div>
                      </Link>
                    </td>
                    <td className="px-4 py-4 text-end">
                      <span className="transition-colors inline-block font-mono font-bold text-lg">
                        {cityData.buy.toLocaleString('ar-SY')}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-end">
                      <span className="transition-colors inline-block font-mono font-bold text-lg">
                        {cityData.sell.toLocaleString('ar-SY')}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-end">
                      {formatChange(cityData.change)}
                    </td>
                    <td className="px-4 py-4 text-end hidden md:table-cell">
                      <span className="font-mono text-emerald-600">{cityData.day_high.toLocaleString('ar-SY')}</span>
                    </td>
                    <td className="px-4 py-4 text-end hidden md:table-cell">
                      <span className="font-mono text-red-500">{cityData.day_low.toLocaleString('ar-SY')}</span>
                    </td>
                    <td className="px-4 py-4 text-end">
                      <Link
                        href={`/currency/${currency.slug}`}
                        className="text-[var(--primary)] hover:underline text-sm font-medium"
                      >
                        عرض
                      </Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}

