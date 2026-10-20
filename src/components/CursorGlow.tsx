import { useEffect, useRef } from 'react'

/**
 * A soft neon glow that trails the pointer, plus a small cursor dot that
 * expands over interactive elements. Also feeds --mx/--my to any
 * `.spotlight` card under the pointer so its border lights up locally.
 */
export function CursorGlow() {
  const glowRef = useRef<HTMLDivElement>(null)
  const dotRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return
    const glow = glowRef.current
    const dot = dotRef.current
    if (!glow || !dot) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let tx = window.innerWidth / 2
    let ty = window.innerHeight / 2
    let gx = tx
    let gy = ty
    let frame = 0

    const tick = () => {
      // Ease the big glow toward the pointer for a liquid trailing feel
      const ease = reduced ? 1 : 0.14
      gx += (tx - gx) * ease
      gy += (ty - gy) * ease
      glow.style.transform = `translate3d(${gx}px, ${gy}px, 0)`
      if (Math.abs(tx - gx) > 0.1 || Math.abs(ty - gy) > 0.1) {
        frame = requestAnimationFrame(tick)
      } else {
        frame = 0
      }
    }

    const onMove = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return
      tx = e.clientX
      ty = e.clientY
      dot.style.transform = `translate3d(${tx}px, ${ty}px, 0)`
      glow.classList.add('is-active')
      dot.classList.add('is-active')
      if (!frame) frame = requestAnimationFrame(tick)

      const target = e.target as Element | null
      const card = target?.closest?.<HTMLElement>('.spotlight')
      if (card) {
        const r = card.getBoundingClientRect()
        card.style.setProperty('--mx', `${e.clientX - r.left}px`)
        card.style.setProperty('--my', `${e.clientY - r.top}px`)
      }
      const interactive = target?.closest?.('a, button, [role="button"], input, select, label')
      dot.classList.toggle('is-hover', !!interactive)
    }

    const onLeave = () => {
      glow.classList.remove('is-active')
      dot.classList.remove('is-active')
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    document.documentElement.addEventListener('pointerleave', onLeave)
    return () => {
      window.removeEventListener('pointermove', onMove)
      document.documentElement.removeEventListener('pointerleave', onLeave)
      cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <>
      <div ref={glowRef} className="cursor-glow" aria-hidden />
      <div ref={dotRef} className="cursor-dot" aria-hidden />
    </>
  )
}
