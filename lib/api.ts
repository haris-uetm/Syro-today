const API_BASE = 'https://api-v2.sp-today.com'

export interface CityData {
  buy: number
  sell: number
  change: number
  prev_close: number
  day_high: number
  day_low: number
  change_week: number
  change_month: number
  change_year: number
}

export interface Currency {
  code: string
  slug: string
  name: string
  name_ar: string
  symbol: string
  flag: string
  cities: {
    [key: string]: CityData
  }
  updated_at: string
}

export interface GoldKarat {
  karat: string
  cities?: {
    [key: string]: {
      buy: number
      sell: number
      change: number
      prev_close: number
      day_high: number
      day_low: number
      change_week: number
      change_month: number
      change_year: number
    }
  }
  price_per_gram?: number
  price_per_ounce?: number
  change?: number
  prev_close?: number
  day_high?: number
  day_low?: number
  updated_at: string
}

export interface CryptoCoin {
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

export interface RatesData {
  rates: Currency[]
  gold: {
    karats: GoldKarat[]
    ounce: {
      price_usd: number
      change: number
      prev_close: number
      day_high: number
      day_low: number
      updated_at: string
    }
    updated_at?: string
  }
  internationalGold?: {
    karats: GoldKarat[]
    spot_price: {
      price_usd: number
      price?: number
      change: number
      prev_close: number
      day_high: number
      day_low: number
      updated_at: string
    }
    updated_at?: string
  }
  crypto?: CryptoCoin[]
  updated_at: string
}

export async function fetchRates(city: string = 'damascus'): Promise<RatesData> {
  try {
    const response = await fetch(`${API_BASE}/api/v2/rates?city=${city}`, {
      next: { revalidate: 60 }, // Revalidate every 60 seconds
    })
    
    if (!response.ok) {
      throw new Error('Failed to fetch rates')
    }
    
    return await response.json()
  } catch (error) {
    console.error('Error fetching rates:', error)
    // Return fallback data
    return getFallbackData()
  }
}

export async function fetchCurrency(slug: string, city: string = 'damascus') {
  try {
    const response = await fetch(`${API_BASE}/api/v2/currency/${slug}?city=${city}`, {
      next: { revalidate: 60 },
    })
    
    if (!response.ok) {
      throw new Error('Failed to fetch currency')
    }
    
    return await response.json()
  } catch (error) {
    console.error('Error fetching currency:', error)
    return null
  }
}

export async function fetchGold(city: string = 'damascus') {
  try {
    const response = await fetch(`${API_BASE}/api/v2/gold?city=${city}`, {
      next: { revalidate: 60 },
    })
    
    if (!response.ok) {
      throw new Error('Failed to fetch gold prices')
    }
    
    return await response.json()
  } catch (error) {
    console.error('Error fetching gold:', error)
    return null
  }
}

function getFallbackData(): RatesData {
  return {
    rates: [
      {
        code: 'USD',
        slug: 'us-dollar',
        name: 'دولار أمريكي',
        name_ar: 'دولار أمريكي',
        symbol: 'USD',
        flag: '🇺🇸',
        cities: {
          damascus: {
            buy: 12220,
            sell: 12300,
            change: 0,
            prev_close: 12220,
            day_high: 12220,
            day_low: 12220,
            change_week: -0.57,
            change_month: 8.67,
            change_year: 4.96,
          },
        },
        updated_at: new Date().toISOString(),
      },
    ],
    gold: {
      karats: [
        {
          karat: '24K',
          cities: {
            damascus: {
              buy: 1806000,
              sell: 1827000,
              change: -0.18,
              prev_close: 1809300,
              day_high: 1815300,
              day_low: 1784400,
              change_week: 2.31,
              change_month: 13.26,
              change_year: 76.39,
            },
          },
          updated_at: new Date().toISOString(),
        },
        {
          karat: '22K',
          cities: {
            damascus: {
              buy: 1655600,
              sell: 1674800,
              change: -0.18,
              prev_close: 1658600,
              day_high: 1664100,
              day_low: 1635700,
              change_week: 2.32,
              change_month: 13,
              change_year: 76,
            },
          },
          updated_at: new Date().toISOString(),
        },
        {
          karat: '21K',
          cities: {
            damascus: {
              buy: 1580300,
              sell: 1598600,
              change: -0.18,
              prev_close: 1583100,
              day_high: 1588400,
              day_low: 1561300,
              change_week: 2.32,
              change_month: 12.8,
              change_year: 75.67,
            },
          },
          updated_at: new Date().toISOString(),
        },
        {
          karat: '18K',
          cities: {
            damascus: {
              buy: 1354500,
              sell: 1370200,
              change: -0.18,
              prev_close: 1357000,
              day_high: 1361500,
              day_low: 1338300,
              change_week: 2.32,
              change_month: 12.75,
              change_year: 75.64,
            },
          },
          updated_at: new Date().toISOString(),
        },
        {
          karat: '14K',
          cities: {
            damascus: {
              buy: 1053500,
              sell: 1065700,
              change: -0.18,
              prev_close: 1055400,
              day_high: 1058800,
              day_low: 1040800,
              change_week: 2.32,
              change_month: 3.6,
              change_year: 61.37,
            },
          },
          updated_at: new Date().toISOString(),
        },
      ],
      ounce: {
        price_usd: 4597,
        change: -0.18,
        prev_close: 4605.17,
        day_high: 4620.39,
        day_low: 4597.06,
        updated_at: new Date().toISOString(),
      },
    },
    internationalGold: {
      karats: [
        {
          karat: '24K',
          price_per_gram: 147.79,
          price_per_ounce: 4596.92,
          change: -0.1791,
          prev_close: 148.06,
          day_high: 148.55,
          day_low: 146.02,
          updated_at: new Date().toISOString(),
        },
        {
          karat: '22K',
          price_per_gram: 135.48,
          price_per_ounce: 4214,
          change: -0.1791,
          prev_close: 135.73,
          day_high: 136.17,
          day_low: 133.86,
          updated_at: new Date().toISOString(),
        },
        {
          karat: '21K',
          price_per_gram: 129.32,
          price_per_ounce: 4022.31,
          change: -0.1791,
          prev_close: 129.55,
          day_high: 129.98,
          day_low: 127.77,
          updated_at: new Date().toISOString(),
        },
        {
          karat: '18K',
          price_per_gram: 110.85,
          price_per_ounce: 3447.69,
          change: -0.1791,
          prev_close: 111.04,
          day_high: 111.41,
          day_low: 109.52,
          updated_at: new Date().toISOString(),
        },
        {
          karat: '14K',
          price_per_gram: 86.21,
          price_per_ounce: 2681.38,
          change: -0.1791,
          prev_close: 86.36,
          day_high: 86.65,
          day_low: 85.17,
          updated_at: new Date().toISOString(),
        },
      ],
      spot_price: {
        price_usd: 4597,
        change: -0.18,
        prev_close: 4605.17,
        day_high: 4620.39,
        day_low: 4597.06,
        updated_at: new Date().toISOString(),
      },
    },
    updated_at: new Date().toISOString(),
  }
}

