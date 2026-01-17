import { NextResponse } from 'next/server'
import { fetchRates, CryptoCoin } from '@/lib/api'

async function fetchCrypto(): Promise<CryptoCoin[]> {
  try {
    const response = await fetch(
      'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1&sparkline=true&price_change_percentage=7d',
      {
        headers: {
          'Accept': 'application/json',
        },
        next: { revalidate: 60 }, // Revalidate every 60 seconds
      }
    )
    
    if (!response.ok) {
      throw new Error('Failed to fetch crypto')
    }
    
    const data = await response.json()
    return data.map((coin: any) => ({
      id: coin.id,
      symbol: coin.symbol,
      name: coin.name,
      image: coin.image,
      current_price: coin.current_price,
      market_cap_rank: coin.market_cap_rank,
      price_change_percentage_24h: coin.price_change_percentage_24h || 0,
      price_change_percentage_7d: coin.price_change_percentage_7d || null,
      market_cap: coin.market_cap,
      total_volume: coin.total_volume,
      sparkline_in_7d: coin.sparkline_in_7d ? {
        price: coin.sparkline_in_7d.price || []
      } : undefined,
    }))
  } catch (error) {
    console.error('Error fetching crypto:', error)
    return []
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const city = searchParams.get('city') || 'damascus'
    
    const [ratesData, cryptoData] = await Promise.all([
      fetchRates(city),
      fetchCrypto(),
    ])
    
    // Process gold data to match original site structure
    // The API returns gold data in different possible structures
    const allGoldKarats = ratesData.gold?.karats || []
    const allIntlKarats = ratesData.internationalGold?.karats || []
    
    // SYP karats: from gold.karats with cities (for local SYP prices)
    const sypKarats = allGoldKarats.filter((k: any) => {
      if (!k || !k.cities) return false
      const cityKeys = Object.keys(k.cities)
      return cityKeys.length > 0 && k.cities[cityKeys[0]]?.buy !== undefined
    })
    
    // USD karats: from internationalGold.karats with price_per_gram (for global USD prices)
    let usdKarats: any[] = []
    
    if (allIntlKarats.length > 0) {
      usdKarats = allIntlKarats
        .filter((k: any) => k && k.price_per_gram !== undefined && k.price_per_gram !== null)
        .map((k: any) => ({
          karat: k.karat,
          price_per_gram: k.price_per_gram,
          price_per_ounce: k.price_per_ounce,
          change: k.change,
          prev_close: k.prev_close,
          day_high: k.day_high,
          day_low: k.day_low,
          updated_at: k.updated_at,
        }))
    }
    
    // If no usdKarats from internationalGold, try from gold.karats that have price_per_gram
    if (usdKarats.length === 0 && allGoldKarats.length > 0) {
      allGoldKarats.forEach((k: any) => {
        if (k && k.price_per_gram !== undefined && k.price_per_gram !== null) {
          usdKarats.push({
            karat: k.karat,
            price_per_gram: k.price_per_gram,
            price_per_ounce: k.price_per_ounce,
            change: k.change,
            prev_close: k.prev_close,
            day_high: k.day_high,
            day_low: k.day_low,
            updated_at: k.updated_at,
          })
        }
      })
    }
    
    // Get ounce price - try multiple sources
    let ouncePrice = ratesData.gold?.ounce?.price_usd || 
                     (ratesData.internationalGold?.spot_price as any)?.price_usd || 
                     (ratesData.internationalGold?.spot_price as any)?.price
    
    // If still no ounce price, calculate from 24K price if available
    if (!ouncePrice && usdKarats.length > 0) {
      const karat24 = usdKarats.find((k: any) => k.karat === '24K')
      if (karat24?.price_per_ounce) {
        ouncePrice = karat24.price_per_ounce
      } else if (karat24?.price_per_gram) {
        ouncePrice = karat24.price_per_gram * 31.1035 // Convert gram to ounce
      }
    }
    
    const ounceChange = ratesData.gold?.ounce?.change ?? 
                       ratesData.internationalGold?.spot_price?.change ?? 
                       0
    
    // Ensure we have valid ounce price
    if (!ouncePrice || ouncePrice <= 0) {
      ouncePrice = 4603 // Fallback
    }
    
    return NextResponse.json({
      ...ratesData,
      crypto: cryptoData,
      // Add processed gold data matching original site structure
      usdKarats: usdKarats || [],
      sypKarats: sypKarats || [],
      gold: {
        ...ratesData.gold,
        karats: ratesData.gold?.karats || [],
        ounce: {
          price_usd: ouncePrice,
          change: ounceChange,
          prev_close: ratesData.gold?.ounce?.prev_close || ratesData.internationalGold?.spot_price?.prev_close || ouncePrice,
          day_high: ratesData.gold?.ounce?.day_high || ratesData.internationalGold?.spot_price?.day_high || ouncePrice,
          day_low: ratesData.gold?.ounce?.day_low || ratesData.internationalGold?.spot_price?.day_low || ouncePrice,
          updated_at: ratesData.gold?.ounce?.updated_at || ratesData.internationalGold?.spot_price?.updated_at || new Date().toISOString(),
        },
        updated_at: ratesData.gold?.updated_at || ratesData.internationalGold?.updated_at || ratesData.updated_at,
      },
    })
  } catch (error) {
    console.error('Error in rates API:', error)
    return NextResponse.json(
      { error: 'Failed to fetch rates' },
      { status: 500 }
    )
  }
}
