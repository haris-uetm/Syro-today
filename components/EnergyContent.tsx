'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useEffect } from 'react'

export default function EnergyContent() {
  const [lastUpdate, setLastUpdate] = useState('')
  const [usdRate, setUsdRate] = useState(12260) // Average USD rate for conversion

  useEffect(() => {
    // Fetch USD rate for conversion
    fetch('/api/rates?city=damascus')
      .then(res => res.json())
      .then(data => {
        if (data.rates) {
          const usd = data.rates.find((c: any) => c.code === 'USD')
          if (usd?.cities?.damascus) {
            setUsdRate((usd.cities.damascus.buy + usd.cities.damascus.sell) / 2)
          }
        }
      })
      .catch(() => {})
    
    // Set last update time
    const now = new Date()
    setLastUpdate(now.toLocaleDateString('ar-SY', { 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }))
  }, [])

  const [expandedFAQ, setExpandedFAQ] = useState(0)

  const faqs = [
    {
      question: 'كيف يتم تحديد أسعار الطاقة في سوريا؟',
      answer: 'يتم تحديد أسعار الطاقة في سوريا من قبل الحكومة عبر وزارة النفط والثروة المعدنية للوقود، ووزارة الكهرباء للطاقة الكهربائية. تُنشر الأسعار بالدولار الأمريكي وتُحوَّل إلى الليرة السورية بالأسعار الرسمية. هذه الأسعار قابلة للتغيير بناءً على ظروف السوق العالمية والسياسة الحكومية.'
    },
    {
      question: 'لماذا تُعرض أسعار الوقود بالدولار الأمريكي؟',
      answer: 'يتم تحديد أسعار الوقود رسمياً بالدولار الأمريكي لأن سوريا تستورد المنتجات النفطية المكررة، وتجارة النفط الدولية تتم بالدولار. يُحسب المعادل بالليرة السورية باستخدام سعر الصرف الحالي، ولهذا قد يتغير سعر الليرة حتى عندما يبقى سعر الدولار ثابتاً.'
    },
    {
      question: 'ما الفرق بين فئات الكهرباء؟',
      answer: 'تستخدم الكهرباء في سوريا نظام تسعير متدرج حسب الاستهلاك. تدفع الأسر السكنية التي تستهلك أقل من 300 كيلوواط ساعة شهرياً سعراً أقل، بينما تدفع التي تتجاوز 300 كيلوواط ساعة سعراً أعلى. المستهلكون الصناعيون لديهم فئة تسعير منفصلة تعكس متطلبات الطاقة الأعلى للتصنيع والعمليات التجارية.'
    },
    {
      question: 'كم مرة تتغير أسعار الطاقة؟',
      answer: 'يتم تعديل أسعار الطاقة في سوريا بشكل دوري من قبل الحكومة، عادةً استجابةً للتغيرات في أسعار النفط العالمية أو تحركات سعر الصرف أو قرارات السياسة الاقتصادية. على عكس أسعار صرف العملات التي تتقلب يومياً، تميل أسعار الطاقة إلى البقاء مستقرة لفترات أطول حتى يصدر إعلان رسمي.'
    },
    {
      question: 'هل هذه الأسعار موحدة في جميع أنحاء سوريا؟',
      answer: 'الأسعار الحكومية الرسمية للوقود والكهرباء موحدة في جميع المناطق الخاضعة لسيطرة الحكومة في سوريا. ومع ذلك، قد يختلف التوفر حسب المنطقة، وفي بعض المناطق قد تختلف أسعار السوق غير الرسمية عن الأسعار الرسمية بسبب قيود العرض أو تكاليف النقل.'
    }
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 bg-gradient-to-br from-emerald-600 to-teal-500 rounded-xl flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path>
            </svg>
          </div>
          <div>
            <h1 className="text-3xl font-bold">أسعار الطاقة</h1>
            <p className="text-[var(--muted)]">الأسعار الرسمية في سوريا</p>
          </div>
        </div>
        <p className="text-sm text-[var(--muted)]">آخر تحديث: {lastUpdate || '-'}</p>
      </div>

      <section className="mb-12">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <span>⛽</span>
          أسعار الوقود
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <Link
            href="/energy/benzin"
            className="group bg-[var(--card)] rounded-xl border border-[var(--border)] p-5 hover:border-orange-500 hover:shadow-lg transition-all block"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg flex items-center justify-center text-2xl">⛽</div>
              <div>
                <h3 className="font-bold text-lg">بنزين</h3>
                <p className="text-sm text-[var(--muted)]">لكل لتر</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[var(--muted)]">USD</span>
                <span className="text-2xl font-bold font-mono">$0.85</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[var(--muted)]">SYP</span>
                <span className="text-lg font-mono text-[var(--muted)]">≈ {(0.85 * usdRate).toLocaleString('ar-SY')}</span>
              </div>
            </div>
          </Link>

          <Link
            href="/energy/diesel"
            className="group bg-[var(--card)] rounded-xl border border-[var(--border)] p-5 hover:border-orange-500 hover:shadow-lg transition-all block"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-slate-500 to-gray-600 rounded-lg flex items-center justify-center text-2xl">🛢️</div>
              <div>
                <h3 className="font-bold text-lg">مازوت</h3>
                <p className="text-sm text-[var(--muted)]">لكل لتر</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[var(--muted)]">USD</span>
                <span className="text-2xl font-bold font-mono">$0.75</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[var(--muted)]">SYP</span>
                <span className="text-lg font-mono text-[var(--muted)]">≈ {(0.75 * usdRate).toLocaleString('ar-SY')}</span>
              </div>
            </div>
          </Link>

          <Link
            href="/energy/gas"
            className="group bg-[var(--card)] rounded-xl border border-[var(--border)] p-5 hover:border-orange-500 hover:shadow-lg transition-all block"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center text-2xl">🔥</div>
              <div>
                <h3 className="font-bold text-lg">غاز</h3>
                <p className="text-sm text-[var(--muted)]">لكل أسطوانة (10 كيلو)</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[var(--muted)]">USD</span>
                <span className="text-2xl font-bold font-mono">$10.50</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[var(--muted)]">SYP</span>
                <span className="text-lg font-mono text-[var(--muted)]">≈ {(10.5 * usdRate).toLocaleString('ar-SY')}</span>
              </div>
            </div>
          </Link>
        </div>
        <p className="text-sm text-[var(--muted)]">* أسعار الوقود المعروضة هي الأسعار الحكومية الرسمية.</p>
      </section>

      <section>
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <span>⚡</span>
          أسعار الكهرباء
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <Link
            href="/energy/houses-under-300kwh"
            className="group bg-[var(--card)] rounded-xl border border-[var(--border)] p-5 hover:border-yellow-500 hover:shadow-lg transition-all block"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-lg flex items-center justify-center text-2xl">🏠</div>
              <div>
                <h3 className="font-bold text-lg">منازل (أقل من 300 ك.و.س)</h3>
                <p className="text-sm text-[var(--muted)]">لكل ك.و.س</p>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[var(--muted)]">SYP</span>
              <span className="text-2xl font-bold font-mono">600</span>
            </div>
          </Link>

          <Link
            href="/energy/houses-above-300kwh"
            className="group bg-[var(--card)] rounded-xl border border-[var(--border)] p-5 hover:border-yellow-500 hover:shadow-lg transition-all block"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-lg flex items-center justify-center text-2xl">🏘️</div>
              <div>
                <h3 className="font-bold text-lg">منازل (أكثر من 300 ك.و.س)</h3>
                <p className="text-sm text-[var(--muted)]">لكل ك.و.س</p>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[var(--muted)]">SYP</span>
              <span className="text-2xl font-bold font-mono">1,400</span>
            </div>
          </Link>

          <Link
            href="/energy/industrial"
            className="group bg-[var(--card)] rounded-xl border border-[var(--border)] p-5 hover:border-yellow-500 hover:shadow-lg transition-all block"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-lg flex items-center justify-center text-2xl">🏭</div>
              <div>
                <h3 className="font-bold text-lg">صناعي</h3>
                <p className="text-sm text-[var(--muted)]">لكل ك.و.س</p>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[var(--muted)]">SYP</span>
              <span className="text-2xl font-bold font-mono">1,400</span>
            </div>
          </Link>
        </div>
        <p className="text-sm text-[var(--muted)]">* أسعار الكهرباء لكل كيلوواط ساعة كما حددتها وزارة الكهرباء.</p>
      </section>

      <section className="mt-12">
        <div className="bg-[var(--card)] rounded-xl border border-[var(--border)] overflow-hidden">
          <h2 className="text-xl font-bold p-6 pb-4">الأسئلة الشائعة</h2>
          <div className="border-t border-[var(--border)]">
            {faqs.map((faq, index) => (
              <div key={index} className="border-b border-[var(--border)] last:border-b-0">
                <button
                  className="w-full px-6 py-4 flex items-center justify-between gap-4 text-start hover:bg-[var(--background)] transition-colors"
                  onClick={() => setExpandedFAQ(expandedFAQ === index ? -1 : index)}
                  aria-expanded={expandedFAQ === index}
                >
                  <span className="font-medium">{faq.question}</span>
                  <svg
                    className={`w-5 h-5 flex-shrink-0 text-[var(--muted)] transition-transform duration-200 ${
                      expandedFAQ === index ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </button>
                <div
                  className={`overflow-hidden transition-all duration-200 ${
                    expandedFAQ === index ? 'max-h-96' : 'max-h-0'
                  }`}
                >
                  <div className="px-6 pb-4 text-[var(--muted)] leading-relaxed">
                    {faq.answer}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

