import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'
import { CartProvider } from '@/lib/cart'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { CartDrawer } from '@/components/CartDrawer'
import { CursorGlow } from '@/components/CursorGlow'

import '../styles.css'

const siteName = 'Afterglow — Gear for the after-hours'
const siteDescription =
  'Neon-lit headphones, sneakers, lighting and techwear for night owls. Shop the Afterglow drop.'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: siteName,
      },
      {
        name: 'description',
        content: siteDescription,
      },
      {
        property: 'og:title',
        content: siteName,
      },
      {
        property: 'og:description',
        content: siteDescription,
      },
      {
        property: 'og:type',
        content: 'website',
      },
      {
        property: 'og:image',
        content: '/.netlify/images?url=/img/hero.png&w=1200&fm=jpg',
      },
      {
        name: 'twitter:card',
        content: 'summary_large_image',
      },
      {
        name: 'theme-color',
        content: '#07060d',
      },
    ],
    links: [
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Unbounded:wght@400;500;600;700;800&display=swap',
      },
    ],
  }),
  notFoundComponent: NotFound,
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <CartProvider>
          <CursorGlow />
          <Header />
          <main className="relative z-10 min-h-[60vh]">{children}</main>
          <Footer />
          <CartDrawer />
        </CartProvider>
        <Scripts />
      </body>
    </html>
  )
}

function NotFound() {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-32 text-center">
      <p className="font-display text-7xl font-bold text-gradient">404</p>
      <h1 className="mt-4 font-display text-2xl font-bold">Lights out here.</h1>
      <p className="mt-2 text-mist">That page slipped into the dark. Let's get you back to the glow.</p>
      <a href="/" className="btn-glow mt-8">
        Back to the shop
      </a>
    </div>
  )
}
