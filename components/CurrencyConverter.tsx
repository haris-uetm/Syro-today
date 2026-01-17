'use client'

import { useState, useEffect } from 'react'
import { Currency, CityData } from '@/lib/api'

interface CurrencyConverterProps {
  currency: Currency
}

export default function CurrencyConverter({ currency }: CurrencyConverterProps) {
  const [mode, setMode] = useState<'buy' | 'sell'>('buy')
  const [fromCurrency, setFromCurrency] = useState(currency.code)
  const [toCurrency, setToCurrency] = useState('SYP')
  const [amount, setAmount] = useState(100)
  const [result, setResult] = useState(0)
  const [allCurrencies, setAllCurrencies] = useState<Currency[]>([])

  useEffect(() => {
    async function fetchCurrencies() {
      try {
        const response = await fetch('/api/rates?city=damascus')
        const data = await response.json()
        if (data.rates) {
          setAllCurrencies(data.rates)
        }
      } catch (error) {
        console.error('Error fetching currencies:', error)
      }
    }
    fetchCurrencies()
  }, [])

  useEffect(() => {
    calculateConversion()
  }, [amount, fromCurrency, toCurrency, mode, currency, allCurrencies])

  const calculateConversion = () => {
    const cityData: CityData = currency.cities?.damascus
    
    if (fromCurrency === 'SYP' && toCurrency !== 'SYP') {
      const targetCurrency = allCurrencies.find(c => c.code === toCurrency)
      if (targetCurrency) {
        const targetCityData = targetCurrency.cities?.damascus
        if (targetCityData) {
          const rate = mode === 'buy' ? targetCityData.sell : targetCityData.buy
          setResult(amount / rate)
        }
      }
    } else if (fromCurrency !== 'SYP' && toCurrency === 'SYP') {
      const sourceCurrency = fromCurrency === currency.code ? currency : allCurrencies.find(c => c.code === fromCurrency)
      if (sourceCurrency) {
        const sourceCityData = sourceCurrency.cities?.damascus
        if (sourceCityData) {
          const rate = mode === 'buy' ? sourceCityData.buy : sourceCityData.sell
          setResult(amount * rate)
        }
      }
    } else if (fromCurrency !== 'SYP' && toCurrency !== 'SYP') {
      // Convert between two currencies via SYP
      const sourceCurrency = fromCurrency === currency.code ? currency : allCurrencies.find(c => c.code === fromCurrency)
      const targetCurrency = allCurrencies.find(c => c.code === toCurrency)
      
      if (sourceCurrency && targetCurrency) {
        const sourceCityData = sourceCurrency.cities?.damascus
        const targetCityData = targetCurrency.cities?.damascus
        
        if (sourceCityData && targetCityData) {
          const sourceRate = mode === 'buy' ? sourceCityData.buy : sourceCityData.sell
          const targetRate = mode === 'buy' ? targetCityData.sell : targetCityData.buy
          setResult((amount * sourceRate) / targetRate)
        }
      }
    } else {
      setResult(amount)
    }
  }

  const getCurrencyFlag = (code: string) => {
    if (code === 'SYP') {
      return (
        <svg viewBox="0 0 30 20" className="inline-block" style={{ width: '1.25em', height: '0.85em' }} role="img" aria-label="Syrian Flag">
          <rect width="30" height="6.67" fill="#007A3D"></rect>
          <rect y="6.67" width="30" height="6.67" fill="#FFFFFF"></rect>
          <rect y="13.33" width="30" height="6.67" fill="#000000"></rect>
          <g fill="#CE1126">
            <path d="M0,-1 L0.22,-0.31 L0.95,-0.31 L0.36,0.12 L0.59,0.81 L0,0.38 L-0.59,0.81 L-0.36,0.12 L-0.95,-0.31 L-0.22,-0.31 Z" transform="translate(7.5, 10) scale(1.8)"></path>
            <path d="M0,-1 L0.22,-0.31 L0.95,-0.31 L0.36,0.12 L0.59,0.81 L0,0.38 L-0.59,0.81 L-0.36,0.12 L-0.95,-0.31 L-0.22,-0.31 Z" transform="translate(15, 10) scale(1.8)"></path>
            <path d="M0,-1 L0.22,-0.31 L0.95,-0.31 L0.36,0.12 L0.59,0.81 L0,0.38 L-0.59,0.81 L-0.36,0.12 L-0.95,-0.31 L-0.22,-0.31 Z" transform="translate(22.5, 10) scale(1.8)"></path>
          </g>
        </svg>
      )
    }
    const curr = code === currency.code ? currency : allCurrencies.find(c => c.code === code)
    return curr?.flag || '💱'
  }

  const getCurrencyName = (code: string) => {
    if (code === 'SYP') return 'SYP'
    const curr = code === currency.code ? currency : allCurrencies.find(c => c.code === code)
    return curr?.code || code
  }

  return (
    <div className="bg-[var(--card)] rounded-lg border border-[var(--border)] overflow-hidden">
      <div className="flex border-b border-[var(--border)]">
        <button
          onClick={() => setMode('buy')}
          className={`flex-1 py-3 text-sm font-semibold transition-colors relative ${
            mode === 'buy'
              ? 'text-[var(--primary)] bg-[var(--primary)]/5'
              : 'text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface)]'
          }`}
        >
          شراء
          {mode === 'buy' && <span className="absolute bottom-0 inset-x-0 h-0.5 bg-[var(--primary)]"></span>}
        </button>
        <button
          onClick={() => setMode('sell')}
          className={`flex-1 py-3 text-sm font-semibold transition-colors relative border-s border-[var(--border)] ${
            mode === 'sell'
              ? 'text-[var(--primary)] bg-[var(--primary)]/5'
              : 'text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface)]'
          }`}
        >
          مبيع
          {mode === 'sell' && <span className="absolute bottom-0 inset-x-0 h-0.5 bg-[var(--primary)]"></span>}
        </button>
      </div>
      
      <div className="p-5">
        <h2 className="text-base font-bold mb-4">تحويل العملات</h2>
        
        <div className="space-y-3">
          <div>
            <div className="flex items-stretch border border-[var(--border)] rounded-lg overflow-hidden bg-[var(--background)] focus-within:border-[var(--primary)] transition-colors">
              <input
                type="number"
                min="0"
                step="any"
                value={amount}
                onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                className="flex-1 min-w-0 px-4 py-3 bg-transparent focus:outline-none font-mono text-base tabular-nums"
                placeholder="0.00"
              />
              <div className="flex items-center border-s border-[var(--border)] bg-[var(--surface)] px-4 gap-2">
                <span className="text-lg">{getCurrencyFlag(fromCurrency)}</span>
                <select
                  value={fromCurrency}
                  onChange={(e) => setFromCurrency(e.target.value)}
                  className="appearance-none bg-transparent py-3 ps-2 pe-8 font-semibold text-sm focus:outline-none cursor-pointer"
                >
                  <option value="SYP">SYP</option>
                  {allCurrencies.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.code}
                    </option>
                  ))}
                </select>
                <svg className="w-4 h-4 -ms-6 me-3 pointer-events-none text-[var(--muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
          
          <div>
            <div className="flex items-stretch border border-[var(--border)] rounded-lg overflow-hidden bg-[var(--background)] focus-within:border-[var(--primary)] transition-colors">
              <input
                type="text"
                readOnly
                value={result.toLocaleString('ar-SY', { maximumFractionDigits: 2 })}
                className="flex-1 min-w-0 px-4 py-3 bg-transparent focus:outline-none font-mono text-base tabular-nums"
                placeholder="0.00"
              />
              <div className="flex items-center border-s border-[var(--border)] bg-[var(--surface)] px-4 gap-2">
                <span className="text-lg">{getCurrencyFlag(toCurrency)}</span>
                <select
                  value={toCurrency}
                  onChange={(e) => setToCurrency(e.target.value)}
                  className="appearance-none bg-transparent py-3 ps-2 pe-8 font-semibold text-sm focus:outline-none cursor-pointer"
                >
                  <option value="SYP">SYP</option>
                  {allCurrencies.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.code}
                    </option>
                  ))}
                </select>
                <svg className="w-4 h-4 -ms-6 me-3 pointer-events-none text-[var(--muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

