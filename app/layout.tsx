import type { Metadata } from 'next'
import './globals.css'
import LangDirSetter from '@/components/LangDirSetter'

export const metadata: Metadata = {
  title: 'سيريو اليوم | أسعار العملات والذهب في سورية',
  description: 'أسعار صرف الليرة السورية وأسعار الذهب والأخبار المالية',
  keywords: 'الليرة السورية, أسعار الصرف, أسعار الذهب, الدولار مقابل الليرة, اليورو, الليرة التركية, دمشق, حلب, تحويل العملات, الاقتصاد السوري',
  authors: [{ name: 'سيريو اليوم' }],
  openGraph: {
    title: 'سيريو اليوم | أسعار العملات والذهب في سورية',
    description: 'أسعار صرف الليرة السورية وأسعار الذهب والأخبار المالية',
    url: 'https://sp-today.com',
    siteName: 'سيريو اليوم',
    locale: 'ar_SY',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Default to Arabic, but pages under /en will be handled by their own structure
  // Note: Next.js doesn't allow dynamic lang/dir based on pathname in layout
  // So we keep Arabic as default for root routes
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col font-arabic" data-theme="dark" suppressHydrationWarning>
        <LangDirSetter />
        <a href="#main-content" className="skip-link">تخطي إلى المحتوى</a>
        {children}
      </body>
    </html>
  )
}

