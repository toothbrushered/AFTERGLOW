import { Link, createFileRoute, useNavigate } from '@tanstack/react-router'
import { ArrowRight, Search, SlidersHorizontal, Sparkles, Truck, X, Zap, RotateCcw } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import products, { categories } from '@/data/products'
import type { Category } from '@/data/products'
import { ProductCard } from '@/components/ProductCard'
import { img } from '@/lib/format'

const sorts = {
  featured: 'Featured',
  'price-asc': 'Price: low to high',
  'price-desc': 'Price: high to low',
  rating: 'Top rated',
} as const
type Sort = keyof typeof sorts

const priceBands = {
  u100: { label: 'Under $100', min: 0, max: 99.99 },
  '100-200': { label: '$100–$200', min: 100, max: 200 },
  '200p': { label: '$200+', min: 200.01, max: Infinity },
} as const
type PriceBand = keyof typeof priceBands

interface ShopSearch {
  q?: string
  cat?: Category
  price?: PriceBand
  sort?: Sort
}

export const Route = createFileRoute('/')({
  validateSearch: (search: Record<string, unknown>): ShopSearch => {
    const out: ShopSearch = {}
    if (typeof search.q === 'string' && search.q.trim()) out.q = search.q.slice(0, 80)
    if (categories.some((c) => c.id === search.cat)) out.cat = search.cat as Category
    if (typeof search.price === 'string' && search.price in priceBands)
      out.price = search.price as PriceBand
    if (typeof search.sort === 'string' && search.sort in sorts && search.sort !== 'featured')
      out.sort = search.sort as Sort
    return out
  },
  component: Home,
})

function Home() {
  return (
    <>
      <Hero />
      <Marquee />
      <Shop />
      <Perks />
    </>
  )
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="bg-grid pointer-events-none absolute inset-0" />
      <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 pb-16 pt-10 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:pb-24 lg:pt-16">
        <div className="animate-rise">
          <span className="inline-flex items-center gap-2 rounded-full border border-line bg-panel/70 px-3 py-1.5 text-xs font-semibold text-mist">
            <Sparkles className="h-3.5 w-3.5 text-lime" />
            Drop 07 — The Night Shift Collection
          </span>
          <h1 className="mt-6 font-display text-[2.6rem] font-bold leading-[1.02] tracking-tight sm:text-6xl lg:text-7xl">
            Gear that
            <br />
            <span className="text-gradient">glows after</span>
            <br />
            dark.
          </h1>
          <p className="mt-6 max-w-md text-base leading-relaxed text-mist sm:text-lg">
            Headphones, sneakers, lighting and techwear engineered for night owls,
            city wanderers and anyone who does their best work after midnight.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/" hash="shop" className="btn-glow">
              Shop the drop <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/products/$productId" params={{ productId: 'pulse-x1' }} className="btn-ghost">
              Meet Pulse X1
            </Link>
          </div>
          <dl className="mt-10 flex gap-8 text-sm">
            {[
              ['12', 'glowing essentials'],
              ['4.8★', 'avg. rating'],
              ['48h', 'dispatch'],
            ].map(([n, l]) => (
              <div key={l}>
                <dt className="font-display text-2xl font-bold text-white">{n}</dt>
                <dd className="text-mist">{l}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative">
          <div className="absolute -inset-8 rounded-[3rem] bg-gradient-to-tr from-pink/30 via-violet/20 to-cyan/30 blur-3xl" />
          <div className="animate-float relative overflow-hidden rounded-[2rem] border border-line shadow-[0_0_80px_-10px_rgb(255_43_214/0.5)]">
            <img
              src={img('/img/hero.png', 1100)}
              srcSet={`${img('/img/hero.png', 700)} 700w, ${img('/img/hero.png', 1100)} 1100w, ${img('/img/hero.png', 1600)} 1600w`}
              sizes="(min-width: 1024px) 50vw, 100vw"
              alt="Afterglow headphones, sneakers, ring lamp and keyboard floating in neon light trails"
              width={1376}
              height={768}
              className="aspect-[16/11] w-full object-cover"
              fetchPriority="high"
            />
            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-void/90 to-transparent p-5">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-mist">Featured</p>
                <p className="font-display text-lg font-semibold">The Night Shift Kit</p>
              </div>
              <span className="rounded-full bg-lime px-3 py-1 text-xs font-bold text-void shadow-[0_0_16px_rgb(198_255_61/0.7)]">
                New in
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Marquee() {
  const words = ['Free shipping over $150', 'Beat-reactive light', '30-day returns', 'Designed for after-hours', '2-year warranty', 'Carbon-neutral delivery']
  return (
    <div className="relative z-10 -rotate-1 border-y border-line bg-gradient-to-r from-pink via-violet to-cyan py-3 text-void">
      <div className="flex overflow-hidden">
        <div className="animate-marquee flex shrink-0 gap-10 whitespace-nowrap pr-10 font-display text-sm font-bold uppercase tracking-wider">
          {[...words, ...words].map((w, i) => (
            <span key={i} className="flex items-center gap-10">
              {w} <Zap className="h-4 w-4 fill-void" />
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

function Shop() {
  const search = Route.useSearch()
  const navigate = useNavigate({ from: '/' })
  const [query, setQuery] = useState(search.q ?? '')

  // Keep the input in sync if the URL changes from elsewhere (e.g. nav links)
  useEffect(() => setQuery(search.q ?? ''), [search.q])

  // Debounce typing into the URL
  useEffect(() => {
    const trimmed = query.trim()
    if (trimmed === (search.q ?? '')) return
    const t = setTimeout(() => {
      navigate({
        search: (prev) => ({ ...prev, q: trimmed || undefined }),
        replace: true,
        resetScroll: false,
      })
    }, 200)
    return () => clearTimeout(t)
  }, [query, search.q, navigate])

  const update = (patch: Partial<ShopSearch>) =>
    navigate({ search: (prev) => ({ ...prev, ...patch }), replace: true, resetScroll: false })

  const results = useMemo(() => {
    const q = (search.q ?? '').toLowerCase()
    const band = search.price ? priceBands[search.price] : null
    const list = products.filter((p) => {
      if (search.cat && p.category !== search.cat) return false
      if (band && (p.price < band.min || p.price > band.max)) return false
      if (q) {
        const haystack = [p.name, p.tagline, p.category, p.description, ...p.features, ...p.options.flatMap((o) => o.values.map((v) => v.value))]
          .join(' ')
          .toLowerCase()
        return q.split(/\s+/).every((term) => haystack.includes(term))
      }
      return true
    })
    switch (search.sort) {
      case 'price-asc':
        return [...list].sort((a, b) => a.price - b.price)
      case 'price-desc':
        return [...list].sort((a, b) => b.price - a.price)
      case 'rating':
        return [...list].sort((a, b) => b.rating - a.rating)
      default:
        return list
    }
  }, [search])

  const activeFilters = [search.q, search.cat, search.price].filter(Boolean).length
  const clearAll = () => {
    setQuery('')
    navigate({ search: {}, replace: true, resetScroll: false })
  }

  return (
    <section id="shop" className="relative z-10 mx-auto max-w-7xl scroll-mt-20 px-4 pt-20 sm:px-6">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan">The shop</p>
          <h2 className="mt-2 font-display text-3xl font-bold sm:text-4xl">
            Everything <span className="text-gradient">luminous</span>
          </h2>
        </div>
        <div className="relative w-full md:max-w-sm">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-mist" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search headphones, neon, hoodie…"
            aria-label="Search products"
            className="w-full rounded-full border border-line bg-panel/70 py-3 pl-11 pr-10 text-sm text-white placeholder:text-mist/70 outline-none transition focus:border-pink focus:shadow-[0_0_24px_rgb(255_43_214/0.35)]"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="absolute right-3 top-1/2 grid h-6 w-6 -translate-y-1/2 place-items-center rounded-full text-mist hover:text-white"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-4 rounded-3xl border border-line bg-night/60 p-4 backdrop-blur lg:flex-row lg:items-center lg:justify-between">
        <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 lg:pb-0" role="group" aria-label="Category">
          <button type="button" className="chip" aria-pressed={!search.cat} onClick={() => update({ cat: undefined })}>
            All
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              type="button"
              className="chip"
              aria-pressed={search.cat === c.id}
              onClick={() => update({ cat: search.cat === c.id ? undefined : c.id })}
            >
              {c.label}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="-mx-1 flex gap-2 overflow-x-auto px-1" role="group" aria-label="Price">
            {(Object.keys(priceBands) as Array<PriceBand>).map((k) => (
              <button
                key={k}
                type="button"
                className="chip"
                aria-pressed={search.price === k}
                onClick={() => update({ price: search.price === k ? undefined : k })}
              >
                {priceBands[k].label}
              </button>
            ))}
          </div>
          <label className="relative ml-auto flex items-center">
            <SlidersHorizontal className="pointer-events-none absolute left-3 h-4 w-4 text-mist" />
            <span className="sr-only">Sort by</span>
            <select
              value={search.sort ?? 'featured'}
              onChange={(e) => update({ sort: e.target.value === 'featured' ? undefined : (e.target.value as Sort) })}
              className="appearance-none rounded-full border border-line bg-panel py-2 pl-9 pr-4 text-sm font-semibold text-white outline-none transition hover:border-cyan focus:border-cyan focus:shadow-[0_0_18px_rgb(34_230_255/0.35)]"
            >
              {(Object.keys(sorts) as Array<Sort>).map((k) => (
                <option key={k} value={k}>
                  {sorts[k]}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between text-sm text-mist">
        <p aria-live="polite">
          {results.length} {results.length === 1 ? 'product' : 'products'}
          {search.q && (
            <>
              {' '}for “<span className="text-white">{search.q}</span>”
            </>
          )}
        </p>
        {activeFilters > 0 && (
          <button type="button" onClick={clearAll} className="flex items-center gap-1 font-semibold text-pink transition hover:text-white">
            <RotateCcw className="h-3.5 w-3.5" /> Clear filters
          </button>
        )}
      </div>

      {results.length > 0 ? (
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {results.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      ) : (
        <div className="mt-6 flex flex-col items-center rounded-3xl border border-dashed border-line px-6 py-20 text-center">
          <p className="font-display text-xl font-bold">Nothing glowing here.</p>
          <p className="mt-2 max-w-sm text-mist">No products match those filters. Try a different search or clear everything.</p>
          <button type="button" onClick={clearAll} className="btn-glow mt-6">
            Reset the shop
          </button>
        </div>
      )}
    </section>
  )
}

function Perks() {
  const perks = [
    { icon: Truck, title: 'Free shipping over $150', body: 'Carbon-neutral delivery, dispatched within 48 hours.' },
    { icon: RotateCcw, title: '30-day returns', body: 'Not feeling the glow? Send it back, no questions.' },
    { icon: Zap, title: '2-year warranty', body: 'Every light, driver and battery covered, end to end.' },
  ]
  return (
    <section className="relative z-10 mx-auto mt-24 grid max-w-7xl gap-4 px-4 sm:px-6 md:grid-cols-3">
      {perks.map(({ icon: Icon, title, body }) => (
        <div key={title} className="spotlight p-6">
          <div className="relative z-10">
            <span className="grid h-11 w-11 place-items-center rounded-xl border border-line bg-panel text-cyan shadow-[0_0_20px_rgb(34_230_255/0.25)]">
              <Icon className="h-5 w-5" />
            </span>
            <h3 className="mt-4 font-display font-semibold">{title}</h3>
            <p className="mt-1 text-sm text-mist">{body}</p>
          </div>
        </div>
      ))}
    </section>
  )
}
