'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export default function LangDirSetter() {
  const pathname = usePathname()
  
  useEffect(() => {
    // Update html lang and dir attributes based on route
    const isEnglish = pathname?.startsWith('/en')
    
    if (typeof document !== 'undefined') {
      const html = document.documentElement
      if (isEnglish) {
        html.setAttribute('lang', 'en')
        html.setAttribute('dir', 'ltr')
      } else {
        html.setAttribute('lang', 'ar')
        html.setAttribute('dir', 'rtl')
      }
    }
  }, [pathname])
  
  return null
}

