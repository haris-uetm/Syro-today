import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-[var(--surface)] border-t border-[var(--border)] mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4">سيريو اليوم</h3>
            <p className="text-sm text-[var(--muted)]">
              موقع إلكتروني لتتبع أسعار العملات والذهب في سورية
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">روابط سريعة</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/currencies" className="text-[var(--muted)] hover:text-[var(--primary)]">
                  أسعار الصرف
                </Link>
              </li>
              <li>
                <Link href="/gold" className="text-[var(--muted)] hover:text-[var(--primary)]">
                  أسعار الذهب
                </Link>
              </li>
              <li>
                <Link href="/crypto" className="text-[var(--muted)] hover:text-[var(--primary)]">
                  العملات الرقمية
                </Link>
              </li>
              <li>
                <Link href="/news" className="text-[var(--muted)] hover:text-[var(--primary)]">
                  الأخبار
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">معلومات</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-[var(--muted)] hover:text-[var(--primary)]">
                  عن الموقع
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-[var(--muted)] hover:text-[var(--primary)]">
                  اتصل بنا
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-[var(--muted)] hover:text-[var(--primary)]">
                  الخصوصية
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">تابعنا</h4>
            <div className="flex gap-4">
              <a href="#" className="text-[var(--muted)] hover:text-[var(--primary)]" aria-label="Twitter">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
              <a href="#" className="text-[var(--muted)] hover:text-[var(--primary)]" aria-label="Facebook">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-[var(--border)] text-center text-sm text-[var(--muted)]">
          <p>&copy; {new Date().getFullYear()} سيريو اليوم. جميع الحقوق محفوظة.</p>
        </div>
      </div>
    </footer>
  )
}

