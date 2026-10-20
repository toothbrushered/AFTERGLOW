import { Link } from '@tanstack/react-router'
import { Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { MAX_QTY, useCart } from '@/lib/cart'
import { formatPrice, img } from '@/lib/format'
import { createCheckoutSession, getStripeEnabled } from '@/lib/stripe'

const FREE_SHIPPING = 150

export function CartDrawer() {
  const { lines, subtotal, isOpen, close, setQuantity, remove } = useCart()
  const [stripeEnabled, setStripeEnabled] = useState<boolean | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getStripeEnabled()
      .then(setStripeEnabled)
      .catch(() => setStripeEnabled(false))
  }, [])

  useEffect(() => {
    if (!isOpen) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [isOpen, close])

  const checkout = async () => {
    setLoading(true)
    setError(null)
    try {
      const url = await createCheckoutSession({
        data: lines.map(({ productId, selection, quantity }) => ({
          productId,
          selection,
          quantity,
        })),
      })
      if (url) window.location.href = url
      else throw new Error('No checkout URL')
    } catch (err) {
      console.error('Checkout error:', err)
      setError('Checkout could not start. Please try again.')
      setLoading(false)
    }
  }

  const remaining = Math.max(0, FREE_SHIPPING - subtotal)
  const progress = Math.min(100, (subtotal / FREE_SHIPPING) * 100)

  return (
    <div
      className={`fixed inset-0 z-50 ${isOpen ? '' : 'pointer-events-none'}`}
      aria-hidden={!isOpen}
    >
      <div
        onClick={close}
        className={`absolute inset-0 bg-void/70 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        className={`absolute right-0 top-0 flex h-full w-full max-w-md flex-col border-l border-line bg-night/95 shadow-[-30px_0_80px_-20px_rgb(255_43_214/0.35)] backdrop-blur-xl transition-transform duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-line px-6 py-5">
          <h2 className="font-display text-lg font-bold">Your bag</h2>
          <button type="button" onClick={close} className="icon-btn" aria-label="Close cart">
            <X className="h-5 w-5" />
          </button>
        </div>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <div className="grid h-20 w-20 place-items-center rounded-full border border-line shadow-[0_0_40px_rgb(139_92_255/0.35)]">
              <ShoppingBag className="h-8 w-8 text-mist" />
            </div>
            <p className="font-display text-lg">Your bag is glowing… empty.</p>
            <p className="text-sm text-mist">Find something that lights you up.</p>
            <Link to="/" hash="shop" onClick={close} className="btn-glow mt-2">
              Start shopping
            </Link>
          </div>
        ) : (
          <>
            <div className="border-b border-line px-6 py-4">
              <p className="text-sm text-mist">
                {remaining > 0 ? (
                  <>
                    You're <span className="font-bold text-white">{formatPrice(remaining)}</span>{' '}
                    away from free shipping
                  </>
                ) : (
                  <span className="font-bold text-lime">You've unlocked free shipping ⚡</span>
                )}
              </p>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-line">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-pink via-violet to-cyan shadow-[0_0_12px_rgb(34_230_255/0.8)] transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <ul className="flex-1 space-y-4 overflow-y-auto px-6 py-5">
              {lines.map((line) => (
                <li key={line.key} className="flex gap-4 rounded-2xl border border-line bg-panel/60 p-3">
                  <Link
                    to="/products/$productId"
                    params={{ productId: line.productId }}
                    onClick={close}
                    className="shrink-0"
                  >
                    <img
                      src={img(line.product.images[0], 160, 160)}
                      alt={line.product.name}
                      className="h-20 w-20 rounded-xl object-cover"
                      width={80}
                      height={80}
                    />
                  </Link>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="truncate font-semibold">{line.product.name}</p>
                        <p className="truncate text-xs text-mist">
                          {Object.values(line.selection).join(' · ')}
                        </p>
                      </div>
                      <p className="font-bold">{formatPrice(line.unitPrice * line.quantity)}</p>
                    </div>
                    <div className="mt-auto flex items-center justify-between pt-2">
                      <div className="flex items-center rounded-full border border-line">
                        <button
                          type="button"
                          onClick={() => setQuantity(line.key, line.quantity - 1)}
                          className="grid h-8 w-8 place-items-center rounded-full transition hover:text-pink"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-6 text-center text-sm font-semibold">{line.quantity}</span>
                        <button
                          type="button"
                          onClick={() => setQuantity(line.key, line.quantity + 1)}
                          disabled={line.quantity >= MAX_QTY}
                          className="grid h-8 w-8 place-items-center rounded-full transition hover:text-cyan disabled:opacity-30"
                          aria-label="Increase quantity"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => remove(line.key)}
                        className="text-mist transition hover:text-pink"
                        aria-label={`Remove ${line.product.name}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="border-t border-line px-6 py-5">
              <div className="flex items-center justify-between text-sm text-mist">
                <span>Shipping</span>
                <span>{remaining > 0 ? 'Calculated at checkout' : 'Free'}</span>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <span className="font-display text-lg">Subtotal</span>
                <span className="font-display text-2xl font-bold">{formatPrice(subtotal)}</span>
              </div>
              {error && <p className="mt-3 text-sm text-pink">{error}</p>}
              <button
                type="button"
                onClick={checkout}
                disabled={loading || !stripeEnabled}
                className="btn-glow mt-4 w-full"
              >
                {loading
                  ? 'Opening checkout…'
                  : stripeEnabled === false
                    ? 'Checkout coming soon'
                    : 'Checkout'}
              </button>
              {stripeEnabled === false && (
                <p className="mt-2 text-center text-xs text-mist">
                  Payments aren't connected yet — your bag is saved on this device.
                </p>
              )}
            </div>
          </>
        )}
      </aside>
    </div>
  )
}
