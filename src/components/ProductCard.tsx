import { Link, useNavigate } from '@tanstack/react-router'
import { Plus, Star } from 'lucide-react'
import { defaultSelection, isValidSelection } from '@/data/products'
import type { Product } from '@/data/products'
import { useCart } from '@/lib/cart'
import { formatPrice, img } from '@/lib/format'

const badgeStyles: Record<NonNullable<Product['badge']>, string> = {
  New: 'bg-cyan text-void shadow-[0_0_14px_rgb(34_230_255/0.7)]',
  Bestseller: 'bg-pink text-void shadow-[0_0_14px_rgb(255_43_214/0.7)]',
  Limited: 'bg-lime text-void shadow-[0_0_14px_rgb(198_255_61/0.7)]',
  Sale: 'bg-white text-void shadow-[0_0_14px_rgb(255_255_255/0.6)]',
}

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const { add } = useCart()
  const navigate = useNavigate()
  const swatches = product.options.find((o) => o.kind === 'swatch')

  const quickAdd = () => {
    const selection = defaultSelection(product)
    // Products that need a size pick go to the detail page instead
    if (!isValidSelection(product, selection)) {
      navigate({ to: '/products/$productId', params: { productId: product.id } })
      return
    }
    add(product.id, selection)
  }

  return (
    <article
      className="spotlight group animate-rise flex flex-col overflow-hidden"
      style={{ animationDelay: `${Math.min(index, 8) * 60}ms` }}
    >
      <Link
        to="/products/$productId"
        params={{ productId: product.id }}
        className="relative block aspect-square overflow-hidden rounded-t-[1.45rem]"
      >
        <img
          src={img(product.images[0], 640, 640)}
          alt={product.name}
          loading="lazy"
          width={640}
          height={640}
          className="h-full w-full object-cover transition duration-700 group-hover:scale-105 group-hover:opacity-0"
        />
        <img
          src={img(product.images[1] ?? product.images[0], 640, 640)}
          alt=""
          loading="lazy"
          width={640}
          height={640}
          className="absolute inset-0 h-full w-full scale-105 object-cover opacity-0 transition duration-700 group-hover:scale-100 group-hover:opacity-100"
        />
        {product.badge && (
          <span
            className={`absolute left-4 top-4 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider ${badgeStyles[product.badge]}`}
          >
            {product.badge}
          </span>
        )}
      </Link>

      <div className="relative z-10 flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-center justify-between text-xs text-mist">
          <span className="uppercase tracking-[0.18em]">{product.category}</span>
          <span className="flex items-center gap-1">
            <Star className="h-3.5 w-3.5 fill-lime text-lime" />
            {product.rating.toFixed(1)}
            <span className="opacity-60">({product.reviews.toLocaleString()})</span>
          </span>
        </div>
        <div>
          <Link
            to="/products/$productId"
            params={{ productId: product.id }}
            className="font-display text-lg font-semibold leading-tight transition hover:text-cyan"
          >
            {product.name}
          </Link>
          <p className="mt-1 line-clamp-2 text-sm text-mist">{product.tagline}</p>
        </div>

        <div className="mt-auto flex items-end justify-between gap-3 pt-2">
          <div>
            {swatches && (
              <div className="mb-2 flex gap-1.5">
                {swatches.values.map((v) => (
                  <span
                    key={v.value}
                    title={v.value}
                    className="h-3.5 w-3.5 rounded-full ring-1 ring-white/20"
                    style={{ background: v.swatch }}
                  />
                ))}
              </div>
            )}
            <div className="flex items-baseline gap-2">
              <span className="font-display text-xl font-bold">{formatPrice(product.price)}</span>
              {product.compareAt && (
                <span className="text-sm text-mist line-through">{formatPrice(product.compareAt)}</span>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={quickAdd}
            className="btn-glow !px-4 !py-2.5 text-sm"
            aria-label={`Add ${product.name} to bag`}
          >
            <Plus className="h-4 w-4" />
            Add
          </button>
        </div>
      </div>
    </article>
  )
}
