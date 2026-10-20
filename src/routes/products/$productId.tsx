import { Link, createFileRoute, notFound } from '@tanstack/react-router'
import { Check, ChevronLeft, ChevronRight, Minus, Plus, RotateCcw, ShieldCheck, ShoppingBag, Star, Truck } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import products, { defaultSelection, getProduct, isValidSelection, priceFor, requiresChoice } from '@/data/products'
import type { Product } from '@/data/products'
import { ProductCard } from '@/components/ProductCard'
import { MAX_QTY, useCart } from '@/lib/cart'
import { formatPrice, img } from '@/lib/format'

export const Route = createFileRoute('/products/$productId')({
  loader: ({ params }) => {
    const product = getProduct(params.productId)
    if (!product) throw notFound()
    return product
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.name} — Afterglow` },
          { name: 'description', content: loaderData.tagline },
          { property: 'og:title', content: `${loaderData.name} — Afterglow` },
          { property: 'og:image', content: img(loaderData.images[0], 1200) },
        ]
      : [],
  }),
  component: ProductPage,
})

function ProductPage() {
  const product = Route.useLoaderData()
  // Remount on product change so gallery + selection state resets
  return <ProductDetail key={product.id} product={product} />
}

function ProductDetail({ product }: { product: Product }) {
  const { add } = useCart()
  const [selection, setSelection] = useState(() => defaultSelection(product))
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)
  const [showErrors, setShowErrors] = useState(false)

  const valid = isValidSelection(product, selection)
  const unitPrice = priceFor(product, selection)
  const missing = product.options.find((o) => !selection[o.name])

  useEffect(() => {
    if (!added) return
    const t = setTimeout(() => setAdded(false), 1800)
    return () => clearTimeout(t)
  }, [added])

  const addToBag = () => {
    if (!valid) {
      setShowErrors(true)
      return
    }
    add(product.id, selection, qty)
    setAdded(true)
  }

  const related = products
    .filter((p) => p.id !== product.id && p.category === product.category)
    .concat(products.filter((p) => p.id !== product.id && p.category !== product.category))
    .slice(0, 4)

  return (
    <div className="relative z-10 mx-auto max-w-7xl px-4 pb-28 pt-4 sm:px-6 lg:pb-0">
      <nav className="mb-6 flex items-center gap-2 text-sm text-mist" aria-label="Breadcrumb">
        <Link to="/" hash="shop" className="flex items-center gap-1 transition hover:text-white">
          <ChevronLeft className="h-4 w-4" /> Shop
        </Link>
        <span>/</span>
        <Link to="/" search={{ cat: product.category }} hash="shop" className="capitalize transition hover:text-white">
          {product.category}
        </Link>
        <span>/</span>
        <span className="truncate text-white">{product.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-[1.15fr_1fr] lg:gap-14">
        <Gallery product={product} />

        <div className="lg:sticky lg:top-24 lg:self-start">
          <div className="flex items-center gap-3">
            {product.badge && (
              <span className="rounded-full bg-pink px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-void shadow-[0_0_14px_rgb(255_43_214/0.7)]">
                {product.badge}
              </span>
            )}
            <a href="#reviews" className="flex items-center gap-1.5 text-sm text-mist hover:text-white">
              <span className="flex">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${i < Math.round(product.rating) ? 'fill-lime text-lime' : 'text-line'}`}
                  />
                ))}
              </span>
              {product.rating.toFixed(1)} · {product.reviews.toLocaleString()} reviews
            </a>
          </div>

          <h1 className="mt-4 font-display text-4xl font-bold leading-tight sm:text-5xl">{product.name}</h1>
          <p className="mt-2 text-lg text-mist">{product.tagline}</p>

          <div className="mt-6 flex items-baseline gap-3">
            <span className="font-display text-4xl font-bold" style={{ textShadow: `0 0 24px ${product.accent}80` }}>
              {formatPrice(unitPrice)}
            </span>
            {product.compareAt && unitPrice < product.compareAt && (
              <>
                <span className="text-lg text-mist line-through">{formatPrice(product.compareAt)}</span>
                <span className="rounded-full border border-lime/50 px-2 py-0.5 text-xs font-bold text-lime">
                  Save {formatPrice(product.compareAt - unitPrice)}
                </span>
              </>
            )}
          </div>
          <p className="mt-1 text-xs text-mist">
            or 4 interest-free payments of {formatPrice(Math.ceil((unitPrice / 4) * 100) / 100)}
          </p>

          <div className="mt-8 space-y-6">
            {product.options.map((option) => {
              const current = selection[option.name]
              const errored = showErrors && !current
              return (
                <fieldset key={option.name}>
                  <legend className="mb-3 flex w-full items-center justify-between text-sm">
                    <span className="font-semibold">
                      {option.name}
                      {current && <span className="ml-2 font-normal text-mist">{current}</span>}
                    </span>
                    {errored && <span className="text-pink">Please choose a {option.name.toLowerCase()}</span>}
                    {!errored && requiresChoice(option) && <span className="text-mist">True to size</span>}
                  </legend>
                  <div className="flex flex-wrap gap-2" role="radiogroup" aria-label={option.name}>
                    {option.values.map((v) => {
                      const checked = current === v.value
                      const select = () => {
                        setSelection((s) => ({ ...s, [option.name]: v.value }))
                        setShowErrors(false)
                      }
                      if (option.kind === 'swatch') {
                        return (
                          <button
                            key={v.value}
                            type="button"
                            role="radio"
                            aria-checked={checked}
                            aria-label={`${v.value}${v.soldOut ? ' (sold out)' : ''}`}
                            title={v.soldOut ? `${v.value} — sold out` : v.value}
                            disabled={v.soldOut}
                            onClick={select}
                            className={`relative h-11 w-11 rounded-full p-1 ring-1 transition disabled:cursor-not-allowed disabled:opacity-35 ${
                              checked
                                ? 'ring-2 ring-white shadow-[0_0_20px_rgb(255_255_255/0.45)]'
                                : 'ring-line hover:ring-pink hover:shadow-[0_0_16px_rgb(255_43_214/0.5)]'
                            }`}
                          >
                            <span className="block h-full w-full rounded-full" style={{ background: v.swatch }} />
                            {v.soldOut && (
                              <span className="absolute left-1/2 top-1/2 h-px w-10 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-white" />
                            )}
                          </button>
                        )
                      }
                      return (
                        <button
                          key={v.value}
                          type="button"
                          role="radio"
                          aria-checked={checked}
                          disabled={v.soldOut}
                          onClick={select}
                          className={`chip min-w-12 ${errored ? '!border-pink/70' : ''}`}
                        >
                          {v.value}
                          {v.priceDelta ? (
                            <span className="ml-1 opacity-70">
                              {v.priceDelta > 0 ? '+' : '−'}
                              {formatPrice(Math.abs(v.priceDelta))}
                            </span>
                          ) : null}
                        </button>
                      )
                    })}
                  </div>
                </fieldset>
              )
            })}
          </div>

          <div className="mt-8 hidden gap-3 lg:flex">
            <QtyStepper qty={qty} setQty={setQty} />
            <AddButton onClick={addToBag} added={added} label={missing ? `Select ${missing.name.toLowerCase()}` : undefined} className="flex-1" />
          </div>

          <ul className="mt-8 grid grid-cols-1 gap-3 text-sm text-mist sm:grid-cols-3">
            <li className="flex items-center gap-2"><Truck className="h-4 w-4 text-cyan" /> Free over $150</li>
            <li className="flex items-center gap-2"><RotateCcw className="h-4 w-4 text-cyan" /> 30-day returns</li>
            <li className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-cyan" /> 2-year warranty</li>
          </ul>

          <div className="mt-8 border-t border-line pt-8">
            <h2 className="font-display text-sm font-semibold uppercase tracking-[0.2em]">The details</h2>
            <p className="mt-3 leading-relaxed text-mist">{product.description}</p>
            <ul className="mt-5 grid gap-2 sm:grid-cols-2">
              {product.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm">
                  <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-gradient-to-br from-pink to-cyan">
                    <Check className="h-3 w-3 text-void" strokeWidth={3} />
                  </span>
                  {f}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-8 divide-y divide-line border-y border-line">
            {[
              ['Shipping', 'Orders dispatch within 48 hours from our warehouse. Free carbon-neutral shipping on orders over $150; express options at checkout.'],
              ['Returns', 'Changed your mind? Return unused items within 30 days for a full refund. Return labels are on us.'],
              ['Care', 'Wipe lights and electronics with a dry microfiber cloth. Apparel: cold wash inside-out, hang dry to protect reflective details.'],
            ].map(([title, body]) => (
              <details key={title} className="group py-4">
                <summary className="flex cursor-pointer list-none items-center justify-between font-semibold transition hover:text-cyan">
                  {title}
                  <Plus className="h-4 w-4 transition group-open:rotate-45" />
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-mist">{body}</p>
              </details>
            ))}
          </div>
        </div>
      </div>

      <Reviews product={product} />

      <section className="mt-24">
        <div className="flex items-end justify-between">
          <h2 className="font-display text-2xl font-bold sm:text-3xl">
            Pairs well <span className="text-gradient">after dark</span>
          </h2>
          <Link to="/" hash="shop" className="text-sm font-semibold text-mist transition hover:text-white">
            View all →
          </Link>
        </div>
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {related.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      </section>

      {/* Mobile sticky add-to-bag bar */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-void/90 p-3 backdrop-blur-xl lg:hidden">
        <div className="mx-auto flex max-w-xl items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs text-mist">{product.name}</p>
            <p className="font-display text-lg font-bold">{formatPrice(unitPrice * qty)}</p>
          </div>
          <QtyStepper qty={qty} setQty={setQty} compact />
          <AddButton onClick={addToBag} added={added} label={missing ? `Pick ${missing.name.toLowerCase()}` : undefined} />
        </div>
      </div>
    </div>
  )
}

function QtyStepper({ qty, setQty, compact = false }: { qty: number; setQty: (n: number) => void; compact?: boolean }) {
  return (
    <div className={`flex items-center rounded-full border border-line bg-panel/60 ${compact ? 'h-11' : 'h-[3.25rem]'}`}>
      <button
        type="button"
        onClick={() => setQty(Math.max(1, qty - 1))}
        disabled={qty <= 1}
        className="grid h-full w-10 place-items-center rounded-full transition hover:text-pink disabled:opacity-30"
        aria-label="Decrease quantity"
      >
        <Minus className="h-4 w-4" />
      </button>
      <span className="w-6 text-center font-semibold" aria-live="polite">{qty}</span>
      <button
        type="button"
        onClick={() => setQty(Math.min(MAX_QTY, qty + 1))}
        disabled={qty >= MAX_QTY}
        className="grid h-full w-10 place-items-center rounded-full transition hover:text-cyan disabled:opacity-30"
        aria-label="Increase quantity"
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  )
}

function AddButton({ onClick, added, label, className = '' }: { onClick: () => void; added: boolean; label?: string; className?: string }) {
  return (
    <button type="button" onClick={onClick} className={`btn-glow ${className}`}>
      {added ? (
        <>
          <Check className="h-5 w-5" strokeWidth={3} /> Added
        </>
      ) : (
        <>
          <ShoppingBag className="h-5 w-5" /> {label ?? 'Add to bag'}
        </>
      )}
    </button>
  )
}

function Gallery({ product }: { product: Product }) {
  const [active, setActive] = useState(0)
  const [zoom, setZoom] = useState<{ x: number; y: number } | null>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const count = product.images.length

  const go = (i: number) => {
    const next = (i + count) % count
    setActive(next)
    const track = trackRef.current
    if (track) track.scrollTo({ left: next * track.clientWidth, behavior: 'smooth' })
  }

  // Sync active index when swiping on touch devices
  const onScroll = () => {
    const track = trackRef.current
    if (!track) return
    const i = Math.round(track.scrollLeft / track.clientWidth)
    if (i !== active) setActive(i)
  }

  return (
    <div className="flex flex-col-reverse gap-4 md:flex-row lg:sticky lg:top-24 lg:self-start">
      <div className="flex gap-3 md:flex-col" role="tablist" aria-label="Product images">
        {product.images.map((src, i) => (
          <button
            key={src}
            type="button"
            role="tab"
            aria-selected={active === i}
            aria-label={`Image ${i + 1}`}
            onClick={() => go(i)}
            className={`h-20 w-20 overflow-hidden rounded-2xl border-2 transition sm:h-24 sm:w-24 ${
              active === i
                ? 'border-white shadow-[0_0_22px_rgb(255_43_214/0.55)]'
                : 'border-line opacity-60 hover:opacity-100 hover:border-cyan hover:shadow-[0_0_16px_rgb(34_230_255/0.45)]'
            }`}
          >
            <img src={img(src, 200, 200)} alt="" width={96} height={96} className="h-full w-full object-cover" />
          </button>
        ))}
      </div>

      <div className="relative flex-1">
        <div
          className="pointer-events-none absolute -inset-6 rounded-[3rem] opacity-50 blur-3xl"
          style={{ background: `radial-gradient(circle at 50% 50%, ${product.accent}55, transparent 65%)` }}
        />
        <div className="relative overflow-hidden rounded-[2rem] border border-line bg-night">
          <div
            ref={trackRef}
            onScroll={onScroll}
            className="flex snap-x snap-mandatory overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:overflow-hidden"
          >
            {product.images.map((src, i) => (
              <div
                key={src}
                className="aspect-square w-full shrink-0 snap-center overflow-hidden md:cursor-zoom-in"
                onPointerMove={(e) => {
                  if (e.pointerType !== 'mouse') return
                  const r = e.currentTarget.getBoundingClientRect()
                  setZoom({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 })
                }}
                onPointerLeave={() => setZoom(null)}
              >
                <img
                  src={img(src, 1000, 1000)}
                  srcSet={`${img(src, 600, 600)} 600w, ${img(src, 1000, 1000)} 1000w, ${img(src, 1400, 1400)} 1400w`}
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  alt={i === 0 ? product.name : `${product.name} — view ${i + 1}`}
                  width={1000}
                  height={1000}
                  className="h-full w-full object-cover transition-transform duration-300 ease-out"
                  style={
                    zoom && active === i
                      ? { transform: 'scale(1.8)', transformOrigin: `${zoom.x}% ${zoom.y}%` }
                      : undefined
                  }
                  fetchPriority={i === 0 ? 'high' : undefined}
                  loading={i === 0 ? 'eager' : 'lazy'}
                />
              </div>
            ))}
          </div>

          {count > 1 && (
            <>
              <button type="button" onClick={() => go(active - 1)} className="icon-btn absolute left-4 top-1/2 hidden -translate-y-1/2 bg-void/60 backdrop-blur md:grid" aria-label="Previous image">
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button type="button" onClick={() => go(active + 1)} className="icon-btn absolute right-4 top-1/2 hidden -translate-y-1/2 bg-void/60 backdrop-blur md:grid" aria-label="Next image">
                <ChevronRight className="h-5 w-5" />
              </button>
              <div className="pointer-events-none absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-1.5">
                {product.images.map((src, i) => (
                  <span
                    key={src}
                    className={`h-1.5 rounded-full transition-all ${active === i ? 'w-6 bg-white shadow-[0_0_10px_white]' : 'w-1.5 bg-white/40'}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

const sampleReviews = [
  { name: 'Mika R.', rating: 5, title: 'Looks unreal at night', body: 'Every time I use it someone asks where I got it. Build quality is way better than I expected for the price.' },
  { name: 'Jordan T.', rating: 5, title: 'Instant favorite', body: 'Arrived in two days, packaging was gorgeous, and the glow is just the right amount of extra.' },
  { name: 'Sam K.', rating: 4, title: 'Great, one small nit', body: 'Love it. Wish there were even more color options, but what’s here is excellent.' },
]

function Reviews({ product }: { product: Product }) {
  return (
    <section id="reviews" className="mt-24 scroll-mt-24">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <h2 className="font-display text-2xl font-bold sm:text-3xl">Night owls are saying</h2>
        <p className="text-sm text-mist">
          <span className="font-display text-xl font-bold text-white">{product.rating.toFixed(1)}</span> / 5 from{' '}
          {product.reviews.toLocaleString()} reviews
        </p>
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {sampleReviews.map((r) => (
          <figure key={r.name} className="spotlight p-6">
            <div className="relative z-10">
              <div className="flex">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star key={i} className={`h-4 w-4 ${i < r.rating ? 'fill-lime text-lime' : 'text-line'}`} />
                ))}
              </div>
              <blockquote className="mt-3">
                <p className="font-semibold">{r.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-mist">{r.body}</p>
              </blockquote>
              <figcaption className="mt-4 text-xs text-mist">
                {r.name} · Verified buyer
              </figcaption>
            </div>
          </figure>
        ))}
      </div>
    </section>
  )
}
