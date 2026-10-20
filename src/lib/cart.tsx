import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { getProduct, priceFor } from '@/data/products'
import type { Product } from '@/data/products'

export interface CartLine {
  key: string
  productId: string
  selection: Record<string, string>
  quantity: number
}

export interface ResolvedLine extends CartLine {
  product: Product
  unitPrice: number
}

interface CartContextValue {
  lines: Array<ResolvedLine>
  count: number
  subtotal: number
  isOpen: boolean
  /** True once the saved bag has been loaded from this device */
  hydrated: boolean
  open: () => void
  close: () => void
  add: (productId: string, selection: Record<string, string>, qty?: number) => void
  setQuantity: (key: string, quantity: number) => void
  remove: (key: string) => void
  clear: () => void
}

const STORAGE_KEY = 'afterglow-cart-v1'
const MAX_QTY = 10

const CartContext = createContext<CartContextValue | null>(null)

function lineKey(productId: string, selection: Record<string, string>) {
  const parts = Object.keys(selection)
    .sort()
    .map((k) => `${k}=${selection[k]}`)
  return [productId, ...parts].join('|')
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [raw, setRaw] = useState<Array<CartLine>>([])
  const [hydrated, setHydrated] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) setRaw(JSON.parse(stored))
    } catch {
      // ignore corrupt storage
    }
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (hydrated) localStorage.setItem(STORAGE_KEY, JSON.stringify(raw))
  }, [raw, hydrated])

  const add = useCallback(
    (productId: string, selection: Record<string, string>, qty = 1) => {
      const key = lineKey(productId, selection)
      setRaw((prev) => {
        const existing = prev.find((l) => l.key === key)
        if (existing) {
          return prev.map((l) =>
            l.key === key
              ? { ...l, quantity: Math.min(MAX_QTY, l.quantity + qty) }
              : l,
          )
        }
        return [...prev, { key, productId, selection, quantity: qty }]
      })
      setIsOpen(true)
    },
    [],
  )

  const setQuantity = useCallback((key: string, quantity: number) => {
    setRaw((prev) =>
      quantity <= 0
        ? prev.filter((l) => l.key !== key)
        : prev.map((l) =>
            l.key === key ? { ...l, quantity: Math.min(MAX_QTY, quantity) } : l,
          ),
    )
  }, [])

  const remove = useCallback((key: string) => {
    setRaw((prev) => prev.filter((l) => l.key !== key))
  }, [])

  const value = useMemo<CartContextValue>(() => {
    const lines: Array<ResolvedLine> = []
    for (const line of raw) {
      const product = getProduct(line.productId)
      if (!product) continue
      lines.push({ ...line, product, unitPrice: priceFor(product, line.selection) })
    }
    return {
      lines,
      count: lines.reduce((n, l) => n + l.quantity, 0),
      subtotal: lines.reduce((n, l) => n + l.quantity * l.unitPrice, 0),
      isOpen,
      hydrated,
      open: () => setIsOpen(true),
      close: () => setIsOpen(false),
      add,
      setQuantity,
      remove,
      clear: () => setRaw([]),
    }
  }, [raw, isOpen, hydrated, add, setQuantity, remove])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}

export { MAX_QTY }
