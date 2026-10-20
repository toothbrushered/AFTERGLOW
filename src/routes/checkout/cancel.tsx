import { Link, createFileRoute } from '@tanstack/react-router'
import { X } from 'lucide-react'
import { useCart } from '@/lib/cart'

export const Route = createFileRoute('/checkout/cancel')({
  component: CheckoutCancel,
})

function CheckoutCancel() {
  const { open } = useCart()

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-20">
      <div className="spotlight max-w-lg p-10 text-center sm:p-12">
        <div className="relative z-10">
          <div className="mx-auto grid h-20 w-20 place-items-center rounded-full border border-line bg-panel shadow-[0_0_40px_rgb(255_43_214/0.4)]">
            <X className="h-9 w-9 text-pink" />
          </div>
          <h1 className="mt-8 font-display text-3xl font-bold">Checkout paused</h1>
          <p className="mt-3 text-mist">
            No worries — nothing was charged and your bag is still saved right
            where you left it.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <button type="button" onClick={open} className="btn-glow">
              Return to bag
            </button>
            <Link to="/" hash="shop" className="btn-ghost">
              Keep browsing
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
