'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'

export default function GoldConverter() {
  const pathname = usePathname()
  const isEnglish = pathname?.startsWith('/en')
  
  const [activeTab, setActiveTab] = useState<'gold' | 'currency'>('gold')
  const [karat, setKarat] = useState('21K')
  const [gramAmount, setGramAmount] = useState(1)
  const [sypAmount, setSypAmount] = useState('')
  const [usdAmount, setUsdAmount] = useState('')
  
  // Currency conversion state
  const [fromCurrency, setFromCurrency] = useState('USD')
  const [toCurrency, setToCurrency] = useState('SYP')
  const [currencyAmount, setCurrencyAmount] = useState(100)
  const [currencyResult, setCurrencyResult] = useState('')
  
  const [rates, setRates] = useState<any>(null)

  useEffect(() => {
    async function fetchRates() {
      try {
        const response = await fetch('/api/rates?city=damascus')
        const data = await response.json()
        setRates(data)
      } catch (error) {
        console.error('Error fetching rates:', error)
      }
    }
    fetchRates()
  }, [])

  useEffect(() => {
    if (!rates) return

    if (activeTab === 'gold') {
      // Gold conversion logic
      const sypKaratData = rates.gold?.karats?.find((k: any) => k.karat === karat)
      const buyPrice = sypKaratData?.cities?.damascus?.buy || 0
      
      let usdGramPrice = 0
      if (rates.usdKarats && rates.usdKarats.length > 0) {
        const usdKaratData = rates.usdKarats.find((k: any) => k.karat === karat)
        usdGramPrice = usdKaratData?.price_per_gram || 0
      } else if (rates.internationalGold?.karats) {
        const intlKaratData = rates.internationalGold.karats.find((k: any) => k.karat === karat)
        usdGramPrice = intlKaratData?.price_per_gram || 0
      }
      
      const locale = isEnglish ? 'en-US' : 'ar-SY'
      setSypAmount((gramAmount * buyPrice).toLocaleString(locale))
      setUsdAmount((gramAmount * usdGramPrice).toFixed(2))
    } else {
      // Currency conversion logic
      if (fromCurrency === 'SYP' && toCurrency !== 'SYP') {
        const targetCurrency = rates.rates?.find((c: any) => c.code === toCurrency)
        if (targetCurrency?.cities?.damascus) {
          const sellRate = targetCurrency.cities.damascus.sell
          const locale = isEnglish ? 'en-US' : 'ar-SY'
          setCurrencyResult((currencyAmount / sellRate).toFixed(2))
        }
      } else if (fromCurrency !== 'SYP' && toCurrency === 'SYP') {
        const sourceCurrency = rates.rates?.find((c: any) => c.code === fromCurrency)
        if (sourceCurrency?.cities?.damascus) {
          const buyRate = sourceCurrency.cities.damascus.buy
          const locale = isEnglish ? 'en-US' : 'ar-SY'
          setCurrencyResult((currencyAmount * buyRate).toLocaleString(locale))
        }
      } else if (fromCurrency !== 'SYP' && toCurrency !== 'SYP') {
        // Convert between two currencies via SYP
        const sourceCurrency = rates.rates?.find((c: any) => c.code === fromCurrency)
        const targetCurrency = rates.rates?.find((c: any) => c.code === toCurrency)
        if (sourceCurrency?.cities?.damascus && targetCurrency?.cities?.damascus) {
          const sourceRate = sourceCurrency.cities.damascus.buy
          const targetRate = targetCurrency.cities.damascus.sell
          setCurrencyResult((currencyAmount * sourceRate / targetRate).toFixed(2))
        }
      } else {
        setCurrencyResult(currencyAmount.toString())
      }
    }
  }, [gramAmount, karat, rates, isEnglish, activeTab, fromCurrency, toCurrency, currencyAmount])

  return (
    <div className="bg-[var(--card)] rounded-lg border border-[var(--border)] overflow-hidden">
      <div className="flex border-b border-[var(--border)]">
        <button 
          onClick={() => setActiveTab('currency')}
          className={`flex-1 py-3 text-sm font-semibold transition-colors relative ${
            activeTab === 'currency'
              ? 'text-[var(--gold)] bg-[var(--gold)]/5'
              : 'text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface)]'
          }`}
        >
          {isEnglish ? 'Currencies' : 'العملات'}
          {activeTab === 'currency' && (
            <span className="absolute bottom-0 inset-x-0 h-0.5 bg-[var(--gold)]"></span>
          )}
        </button>
        <button 
          onClick={() => setActiveTab('gold')}
          className={`flex-1 py-3 text-sm font-semibold transition-colors relative border-s border-[var(--border)] ${
            activeTab === 'gold'
              ? 'text-[var(--gold)] bg-[var(--gold)]/5'
              : 'text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface)]'
          }`}
        >
          {isEnglish ? 'Gold' : 'الذهب'}
          {activeTab === 'gold' && (
            <span className="absolute bottom-0 inset-x-0 h-0.5 bg-[var(--gold)]"></span>
          )}
        </button>
      </div>
      
      <div className="p-5">
        <h2 className="text-base font-bold mb-4">
          {activeTab === 'gold' 
            ? (isEnglish ? 'Gold Converter' : 'محول الذهب')
            : (isEnglish ? 'Currency Converter' : 'محول العملات')
          }
        </h2>
        
        {activeTab === 'gold' ? (
          <>
            <div className="flex gap-3 mb-5">
              {['24K', '22K', '21K', '18K'].map((k) => (
                <button
                  key={k}
                  onClick={() => setKarat(k)}
                  className={`text-sm font-medium transition-colors ${
                    karat === k
                      ? 'text-[var(--gold)]'
                      : 'text-[var(--muted)] hover:text-[var(--foreground)]'
                  }`}
                >
                  {k}
                  {karat === k && (
                    <span className="block h-0.5 bg-[var(--gold)] mt-1 rounded-full"></span>
                  )}
                </button>
              ))}
            </div>
            
            <div className="space-y-3">
          <div>
            <div className="flex items-stretch border border-[var(--border)] rounded-lg overflow-hidden bg-[var(--background)] focus-within:border-[var(--gold)] transition-colors">
              <input
                type="number"
                min="0"
                step="any"
                value={gramAmount}
                onChange={(e) => setGramAmount(parseFloat(e.target.value) || 0)}
                className="flex-1 min-w-0 px-4 py-3 bg-transparent focus:outline-none font-mono text-base tabular-nums"
                placeholder="0.00"
              />
              <div className="flex items-center border-s border-[var(--border)] bg-[var(--surface)] px-4 gap-2">
                <span className="text-lg">🪙</span>
                <span className="font-semibold text-sm">{karat}</span>
              </div>
            </div>
            <p className="text-xs text-[var(--muted)] mt-1.5 ps-1">{isEnglish ? 'gram of gold' : 'غرام ذهب'}</p>
          </div>
          
          <div>
            <div className="flex items-stretch border border-[var(--border)] rounded-lg overflow-hidden bg-[var(--background)] focus-within:border-[var(--gold)] transition-colors">
              <input
                type="text"
                readOnly
                value={sypAmount}
                className="flex-1 min-w-0 px-4 py-3 bg-transparent focus:outline-none font-mono text-base tabular-nums"
                placeholder="0.00"
              />
              <div className="flex items-center border-s border-[var(--border)] bg-[var(--surface)] px-4 gap-2">
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
                <span className="font-semibold text-sm">SYP</span>
              </div>
            </div>
            <p className="text-xs text-[var(--muted)] mt-1.5 ps-1">{isEnglish ? 'Syrian Pound' : 'الليرة السورية'}</p>
          </div>
          
          <div>
            <div className="flex items-stretch border border-[var(--border)] rounded-lg overflow-hidden bg-[var(--background)] focus-within:border-[var(--gold)] transition-colors">
              <input
                type="text"
                readOnly
                value={usdAmount}
                className="flex-1 min-w-0 px-4 py-3 bg-transparent focus:outline-none font-mono text-base tabular-nums"
                placeholder="0.00"
              />
              <div className="flex items-center border-s border-[var(--border)] bg-[var(--surface)] px-4 gap-2">
                <span className="text-lg">$</span>
                <span className="font-semibold text-sm">USD</span>
              </div>
            </div>
            <p className="text-xs text-[var(--muted)] mt-1.5 ps-1">{isEnglish ? 'US Dollar' : 'الدولار الأمريكي'}</p>
          </div>
        </div>
          </>
        ) : (
          <div className="space-y-3">
            <div>
              <div className="flex items-stretch border border-[var(--border)] rounded-lg overflow-hidden bg-[var(--background)] focus-within:border-[var(--gold)] transition-colors">
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={currencyAmount}
                  onChange={(e) => setCurrencyAmount(parseFloat(e.target.value) || 0)}
                  className="flex-1 min-w-0 px-4 py-3 bg-transparent focus:outline-none font-mono text-base tabular-nums"
                  placeholder="0.00"
                />
                <div className="flex items-center border-s border-[var(--border)] bg-[var(--surface)] px-4 gap-2">
                  {fromCurrency === 'SYP' ? (
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
                  ) : (
                    <span className="text-lg">{rates?.rates?.find((c: any) => c.code === fromCurrency)?.flag || '💱'}</span>
                  )}
                  <select
                    value={fromCurrency}
                    onChange={(e) => setFromCurrency(e.target.value)}
                    className="appearance-none bg-transparent py-1 ps-2 pe-6 font-semibold text-sm focus:outline-none cursor-pointer"
                  >
                    <option value="SYP">SYP</option>
                    {rates?.rates?.slice(0, 10).map((c: any) => (
                      <option key={c.code} value={c.code}>{c.code}</option>
                    ))}
                  </select>
                  <svg className="w-4 h-4 -ms-4 me-1 pointer-events-none text-[var(--muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
            
            <div>
              <div className="flex items-stretch border border-[var(--border)] rounded-lg overflow-hidden bg-[var(--background)] focus-within:border-[var(--gold)] transition-colors">
                <input
                  type="text"
                  readOnly
                  value={currencyResult}
                  className="flex-1 min-w-0 px-4 py-3 bg-transparent focus:outline-none font-mono text-base tabular-nums"
                  placeholder="0.00"
                />
                <div className="flex items-center border-s border-[var(--border)] bg-[var(--surface)] px-4 gap-2">
                  {toCurrency === 'SYP' ? (
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
                  ) : (
                    <span className="text-lg">{rates?.rates?.find((c: any) => c.code === toCurrency)?.flag || '💱'}</span>
                  )}
                  <select
                    value={toCurrency}
                    onChange={(e) => setToCurrency(e.target.value)}
                    className="appearance-none bg-transparent py-1 ps-2 pe-6 font-semibold text-sm focus:outline-none cursor-pointer"
                  >
                    <option value="SYP">SYP</option>
                    {rates?.rates?.slice(0, 10).map((c: any) => (
                      <option key={c.code} value={c.code}>{c.code}</option>
                    ))}
                  </select>
                  <svg className="w-4 h-4 -ms-4 me-1 pointer-events-none text-[var(--muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

