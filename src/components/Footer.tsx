import { Logo } from './Header'

export function Footer() {
  return (
    <footer className="relative z-10 mt-24 border-t border-line/70">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
        <div>
          <Logo />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-mist">
            Gear for the after-hours. Designed in the glow of a thousand city
            lights, shipped to wherever you stay up late.
          </p>
        </div>
        {[
          ['Shop', ['Audio', 'Apparel', 'Footwear', 'Desk', 'Light']],
          ['Help', ['Shipping', 'Returns', 'Warranty', 'Contact']],
          ['Afterglow', ['Our story', 'Journal', 'Careers', 'Press']],
        ].map(([title, links]) => (
          <div key={title as string}>
            <h3 className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-white">
              {title}
            </h3>
            <ul className="mt-4 space-y-2 text-sm text-mist">
              {(links as Array<string>).map((l) => (
                <li key={l}>{l}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-line/50 py-6 text-center text-xs text-mist">
        © {new Date().getFullYear()} Afterglow Supply Co. Stay luminous.
      </div>
    </footer>
  )
}
