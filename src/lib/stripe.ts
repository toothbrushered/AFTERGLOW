import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { getProduct, isValidSelection, priceFor } from '@/data/products'

export const getStripeEnabled = createServerFn({ method: 'GET' }).handler(
  () => !!process.env.STRIPE_SECRET_KEY,
)

const cartSchema = z
  .array(
    z.object({
      productId: z.string().max(64),
      selection: z.record(z.string().max(40), z.string().max(40)),
      quantity: z.number().int().min(1).max(10),
    }),
  )
  .min(1)
  .max(30)

export const createCheckoutSession = createServerFn({
  method: 'POST',
})
  .validator((items: z.input<typeof cartSchema>) => cartSchema.parse(items))
  .handler(async ({ data: items }) => {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('Stripe is not configured')
    }

    // Prices always come from the server catalog, never the client.
    const lineItems = items.map((item) => {
      const product = getProduct(item.productId)
      if (!product) throw new Error('Product not found')
      if (!isValidSelection(product, item.selection)) {
        throw new Error(`Invalid options for ${product.name}`)
      }
      const variant = product.options
        .map((o) => item.selection[o.name])
        .join(' / ')
      return {
        price_data: {
          currency: 'usd',
          product_data: {
            name: variant ? `${product.name} — ${variant}` : product.name,
            description: product.tagline,
          },
          unit_amount: Math.round(priceFor(product, item.selection) * 100),
        },
        quantity: item.quantity,
      }
    })

    const { default: Stripe } = await import('stripe')
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
    const origin = process.env.SITE_URL ?? process.env.URL ?? 'http://localhost:8888'

    const session = await stripe.checkout.sessions.create({
      line_items: lineItems,
      mode: 'payment',
      success_url: `${origin}/checkout/success`,
      cancel_url: `${origin}/checkout/cancel`,
    })

    return session.url
  })
