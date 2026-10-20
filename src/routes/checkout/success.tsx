import { Link, createFileRoute } from '@tanstack/react-router'
import { Check } from 'lucide-react'
import { useEffect } from 'react'
import { useCart } from '@/lib/cart'

export const Route = createFileRoute('/checkout/success')({
  component: CheckoutSuccess,
})

function CheckoutSuccess() {
  const { clear, hydrated } = useCart()

  useEffect(() => {
    if (hydrated) clear()
  }, [hydrated])

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-20">
      <div className="spotlight max-w-lg p-10 text-center sm:p-12">
        <div className="relative z-10">
          <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-gradient-to-br from-lime to-cyan shadow-[0_0_50px_rgb(198_255_61/0.6)]">
            <Check className="h-10 w-10 text-void" strokeWidth={3} />
          </div>
          <h1 className="mt-8 font-display text-3xl font-bold">You're all lit up.</h1>
          <p className="mt-3 text-mist">
            Thanks for your order! A receipt is on its way to your inbox, and
            we'll let you know the moment your gear ships.
          </p>
          <Link to="/" hash="shop" className="btn-glow mt-8">
            Keep shopping
          </Link>
        </div>
      </div>
    </div>
  )
}
