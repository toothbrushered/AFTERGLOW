export function formatPrice(usd: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: usd % 1 === 0 ? 0 : 2,
  }).format(usd)
}

/** Serve images through the Netlify Image CDN at a sensible width. */
export function img(src: string, w: number, h?: number) {
  const params = new URLSearchParams({ url: src, w: String(w), fm: 'webp' })
  if (h) {
    params.set('h', String(h))
    params.set('fit', 'cover')
  }
  return `/.netlify/images?${params.toString()}`
}
