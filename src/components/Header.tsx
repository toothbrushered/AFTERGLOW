import { Link } from '@tanstack/react-router'
import { ShoppingBag, Zap } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useCart } from '@/lib/cart'

export function Logo() {
  return (
    <Link to="/" className="group flex items-center gap-2" aria-label="Afterglow home">
      <span className="relative grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-pink via-violet to-cyan shadow-[0_0_20px_rgb(255_43_214/0.5)] transition-shadow group-hover:shadow-[0_0_32px_rgb(34_230_255/0.7)]">
        <Zap className="h-5 w-5 fill-void text-void" />
      </span>
      <span className="font-display text-lg font-bold tracking-tight">
        AFTER<span className="text-gradient">GLOW</span>
      </span>
    </Link>
  )
}

export function Header() {
  const { count, open } = useCart()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'border-b border-line/70 bg-void/75 backdrop-blur-xl'
          : 'border-b border-transparent'
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:h-20 sm:px-6">
        <Logo />
        <nav className="hidden items-center gap-8 text-sm font-semibold text-mist md:flex">
          <Link to="/" hash="shop" className="transition hover:text-white">
            Shop
          </Link>
          <Link
            to="/"
            search={{ cat: 'audio' }}
            hash="shop"
            className="transition hover:text-white"
          >
            Audio
          </Link>
          <Link
            to="/"
            search={{ cat: 'apparel' }}
            hash="shop"
            className="transition hover:text-white"
          >
            Apparel
          </Link>
          <Link
            to="/"
            search={{ cat: 'light' }}
            hash="shop"
            className="transition hover:text-white"
          >
            Light
          </Link>
        </nav>
        <button
          type="button"
          onClick={open}
          className="icon-btn relative"
          aria-label={`Open cart, ${count} item${count === 1 ? '' : 's'}`}
        >
          <ShoppingBag className="h-5 w-5" />
          {count > 0 && (
            <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-pink px-1 text-[11px] font-bold text-void shadow-[0_0_12px_rgb(255_43_214/0.8)]">
              {count}
            </span>
          )}
        </button>
      </div>
    </header>
  )
}
