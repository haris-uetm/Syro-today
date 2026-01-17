'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  
  const isEnglish = pathname?.startsWith('/en')
  const langPrefix = isEnglish ? '/en' : ''
  
  const navLinks = isEnglish ? [
    { href: '/en/currencies', label: 'Exchange Rates' },
    { href: '/en/gold', label: 'Gold' },
    { href: '/en/crypto', label: 'Crypto' },
    { href: '/en/energy', label: 'Energy' },
    { href: '/en/portfolio', label: 'Portfolio' },
    { href: '/en/news', label: 'News' },
  ] : [
    { href: '/currencies', label: 'أسعار الصرف' },
    { href: '/gold', label: 'الذهب' },
    { href: '/crypto', label: 'العملات الرقمية' },
    { href: '/energy', label: 'الطاقة' },
    { href: '/portfolio', label: 'المحفظة' },
    { href: '/news', label: 'الأخبار' },
  ]
  
  const isActive = (path: string) => {
    return pathname === path || pathname?.startsWith(path + '/')
  }

  return (
    <header className="text-white sticky top-0 z-50 transition-[background] duration-300 bg-[#1d4e89]">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href={langPrefix || "/"} className="flex items-center gap-2">
            <img 
              src="/images/logo.svg" 
              alt={isEnglish ? "Syrio Today" : "سيريو اليوم"} 
              className="h-10 w-auto" 
              width={40} 
              height={40}
              onError={(e) => {
                // Fallback if logo doesn't exist
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
            <span className="text-xl font-bold">{isEnglish ? 'Syrio Today' : 'سيريو اليوم'}</span>
          </Link>
          
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link 
                key={link.href}
                href={link.href} 
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive(link.href) || (link.href === `${langPrefix}/currencies` && pathname === langPrefix || pathname === '/')
                    ? 'bg-white/25 text-white' 
                    : 'text-white/80 hover:bg-white/10 hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
          
          <div className="flex items-center gap-2">
            {isEnglish ? (
              <Link 
                href={pathname?.replace('/en', '') || '/'} 
                className="px-3 py-1.5 rounded-md text-sm font-medium border border-white/30 hover:bg-white/10 transition-colors"
                aria-label="Switch to Arabic"
              >
                عربي
              </Link>
            ) : (
              <Link 
                href={`/en${pathname === '/' ? '' : pathname}`}
                className="px-3 py-1.5 rounded-md text-sm font-medium border border-white/30 hover:bg-white/10 transition-colors"
                aria-label="Switch to English"
              >
                EN
              </Link>
            )}
            <button 
              className="md:hidden p-2 rounded-md hover:bg-white/10" 
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle menu"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
        
        {mobileMenuOpen && (
          <div className="md:hidden pb-4">
            {navLinks.map((link) => (
              <Link 
                key={link.href}
                href={link.href} 
                className="block px-3 py-2 rounded-md text-sm text-white/80 hover:bg-white/10"
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </nav>
    </header>
  )
}

