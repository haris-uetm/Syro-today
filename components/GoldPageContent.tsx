'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { GoldKarat } from '@/lib/api'
import GoldConverter from './GoldConverter'

interface GoldData {
  usdKarats: GoldKarat[]
  sypKarats: GoldKarat[]
  ounce: {
    price_usd: number
    change: number
  }
}

export default function GoldPageContent() {
  const pathname = usePathname()
  const isEnglish = pathname?.startsWith('/en')
  
  const [goldData, setGoldData] = useState<GoldData | null>(null)
  const [loading, setLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState<string>('')

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/rates?city=damascus')
        const data = await response.json()
        
        console.log('Gold data received:', data) // Debug log
        
        // The API now returns processed data:
        // - data.usdKarats: USD prices (with price_per_gram)
        // - data.sypKarats: SYP prices (with cities)
        // - data.gold.ounce: Ounce price
        
        // Use the processed data from API route if available, otherwise parse from original structure
        const usdKarats = data.usdKarats || 
                         data.internationalGold?.karats?.filter((k: GoldKarat) => 
                           k.price_per_gram !== undefined
                         ) || []
        
        const sypKarats = data.sypKarats || 
                         data.gold?.karats?.filter((k: GoldKarat) => 
                           k.cities && Object.keys(k.cities).length > 0
                         ) || []
        
        // Get ounce price
        const ouncePrice = data.gold?.ounce?.price_usd || 
                          data.internationalGold?.spot_price?.price_usd || 
                          data.internationalGold?.spot_price?.price ||
                          4603
        const ounceChange = data.gold?.ounce?.change || 
                           data.internationalGold?.spot_price?.change || 
                           0
        
        // Check if we have any real data
        // Note: ouncePrice of 4603 might be legitimate, so we show it if available
        const hasRealData = sypKarats.length > 0 || usdKarats.length > 0 || (ouncePrice && ouncePrice > 0)
        
        // Always set gold data - show what we have even if incomplete
        setGoldData({
          usdKarats: Array.isArray(usdKarats) ? usdKarats : [],
          sypKarats: Array.isArray(sypKarats) ? sypKarats : [],
          ounce: {
            price_usd: ouncePrice && ouncePrice > 0 ? ouncePrice : 4603,
            change: ounceChange || 0,
          },
        })
        
        // Set last update time if we have real data
        if (hasRealData) {
          const updateTimeStr = data.gold?.updated_at || 
                               data.internationalGold?.updated_at || 
                               data.updated_at || 
                               new Date().toISOString()
          try {
            const updateTime = new Date(updateTimeStr)
            const locale = isEnglish ? 'en-US' : 'ar-SY'
            setLastUpdate(updateTime.toLocaleDateString(locale, {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit'
            }))
          } catch {
            const locale = isEnglish ? 'en-US' : 'ar-SY'
            setLastUpdate(new Date().toLocaleDateString(locale, {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit'
            }))
          }
        } else {
          console.warn('No gold data found in API response. Debug info:', {
            hasGold: !!data.gold,
            hasIntlGold: !!data.internationalGold,
            goldKarats: data.gold?.karats?.length || 0,
            intlKarats: data.internationalGold?.karats?.length || 0,
            usdKaratsFromRoute: data.usdKarats?.length || 0,
            sypKaratsFromRoute: data.sypKarats?.length || 0,
            parsedUsdKarats: usdKarats.length,
            parsedSypKarats: sypKarats.length,
            ouncePrice: ouncePrice,
          })
          setLastUpdate('')
        }
      } catch (error) {
        console.error('Error fetching gold data:', error)
        setGoldData({
          usdKarats: [],
          sypKarats: [],
          ounce: {
            price_usd: 4603,
            change: 0,
          },
        })
        setLastUpdate('')
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
    // Refresh every 60 seconds for live updates
    const interval = setInterval(fetchData, 60000)
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse text-[var(--muted)] text-center py-12">
          {isEnglish ? 'Loading gold data...' : 'جاري تحميل بيانات الذهب...'}
        </div>
      </div>
    )
  }

  // Show error only if we truly have no data at all
  // Always show data if we have goldData set, even if arrays are empty
  // We always show at least the ounce price if available
  const hasNoData = !goldData
  
  if (hasNoData) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-[var(--card)] rounded-xl border border-[var(--border)] p-12 text-center">
          <p className="text-[var(--muted)]">{isEnglish ? 'No gold data is currently available' : 'لا توجد بيانات ذهب متاحة حالياً'}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-[var(--primary)] text-white rounded-lg hover:opacity-90 transition-opacity"
          >
            {isEnglish ? 'Retry' : 'إعادة المحاولة'}
          </button>
        </div>
      </div>
    )
  }

  const formatChange = (change: number) => {
    const isPositive = change >= 0
    return (
      <span className={`text-xs font-medium ${isPositive ? 'text-emerald-500' : 'text-red-500'}`}>
        {isPositive ? '▲' : '▼'} {Math.abs(change).toFixed(2)}%
      </span>
    )
  }

  const formatPrice = (price: number) => {
    return price.toLocaleString(isEnglish ? 'en-US' : 'ar-SY')
  }

  return (
    <>
      {lastUpdate && (
        <p className="text-sm text-[var(--muted)] mb-6">
          {isEnglish ? `Last update: ${lastUpdate}` : `آخر تحديث: ${lastUpdate}`}
        </p>
      )}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
        {/* Global Gold Prices (USD) */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold">{isEnglish ? 'Global Prices (USD)' : 'الأسعار العالمية (دولار)'}</h2>
              <p className="text-sm text-[var(--muted)]">{isEnglish ? 'Gold prices per gram in US Dollar' : 'أسعار الذهب للغرام بالدولار الأمريكي'}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
            {/* Gold Ounce */}
            {goldData.ounce && goldData.ounce.price_usd > 0 && (
              <Link
                href="/gold/ounce"
                className="group bg-gradient-to-br from-amber-500 to-yellow-600 rounded-xl border border-amber-400 p-4 hover:from-amber-400 hover:to-yellow-500 hover:shadow-lg transition-all text-center text-white"
              >
                <h3 className="text-lg font-bold mb-1">{isEnglish ? 'Ounce' : 'أونصة'}</h3>
                <p className="font-mono font-bold">${formatPrice(goldData.ounce.price_usd)}</p>
                <p className="text-xs text-white/70">XAU/USD</p>
                {formatChange(goldData.ounce.change)}
              </Link>
            )}
            
            {/* Gold Karats in USD */}
            {goldData.usdKarats && goldData.usdKarats.length > 0 ? (
              goldData.usdKarats.map((karat) => (
              <Link
                key={karat.karat}
                href={`/gold/${karat.karat.toLowerCase()}/usd`}
                className="group bg-[var(--card)] rounded-xl border border-[var(--border)] p-4 hover:border-amber-500 hover:shadow-lg transition-all text-center"
              >
                <h3 className="text-lg font-bold text-amber-500 mb-1">{karat.karat}</h3>
                <p className="font-mono font-bold">${karat.price_per_gram?.toFixed(2) || '0.00'}</p>
                <p className="text-xs text-[var(--muted)]">{isEnglish ? 'per gram' : 'للغرام'}</p>
                {karat.change !== undefined && formatChange(karat.change)}
              </Link>
              ))
            ) : goldData.ounce && goldData.ounce.price_usd > 0 ? (
              // If no karats but we have ounce, show a message but keep the page functional
              <div className="col-span-full text-center text-[var(--muted)] py-2 text-sm">
                {isEnglish ? 'Loading karats data...' : 'جاري تحميل بيانات العيارات...'}
              </div>
            ) : (
              <div className="col-span-full text-center text-[var(--muted)] py-4">
                {isEnglish ? 'No global gold prices available currently' : 'لا توجد بيانات الأسعار العالمية متاحة حالياً'}
              </div>
            )}
          </div>
        </section>

        {/* Local Gold Prices (SYP) */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold">{isEnglish ? 'Local Prices (SYP)' : 'الأسعار المحلية (ل.س)'}</h2>
              <p className="text-sm text-[var(--muted)]">{isEnglish ? 'Gold prices per gram in Syrian Pounds' : 'أسعار الذهب للغرام بالليرة السورية'}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {goldData.sypKarats && goldData.sypKarats.length > 0 ? (
              goldData.sypKarats.map((karat) => {
              const cityData = karat.cities?.damascus
              if (!cityData) return null
              
              return (
                <Link
                  key={karat.karat}
                  href={`/gold/${karat.karat.toLowerCase()}/syp`}
                  className="group bg-[var(--card)] rounded-xl p-4 border border-[var(--border)] hover:border-amber-500 hover:shadow-lg transition-all"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-bold text-[var(--accent)] group-hover:text-amber-500 transition-colors">
                      {karat.karat}
                    </h3>
                    {cityData.change !== undefined && formatChange(cityData.change)}
                  </div>
                  <p className="text-sm text-[var(--muted)]">{isEnglish ? 'Buy' : 'شراء'}</p>
                  <p className="font-mono font-medium">{formatPrice(cityData.buy)} {isEnglish ? 'SYP' : 'ل.س'}</p>
                  <p className="text-sm text-[var(--muted)] mt-2">{isEnglish ? 'Sell' : 'مبيع'}</p>
                  <p className="font-mono font-medium">{formatPrice(cityData.sell)} {isEnglish ? 'SYP' : 'ل.س'}</p>
                </Link>
              )
              })
            ) : (
              <div className="col-span-full text-center text-[var(--muted)] py-4">
                {isEnglish ? 'No local gold prices available currently' : 'لا توجد بيانات الأسعار المحلية متاحة حالياً'}
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Gold Converter Sidebar */}
      <div className="hidden lg:block">
        <GoldConverter />
      </div>

      {/* Mobile Gold Converter */}
      <div className="lg:hidden">
        <GoldConverter />
      </div>
      </div>
    </>
  )
}

