export type Category = 'audio' | 'apparel' | 'footwear' | 'desk' | 'light'

export const categories: Array<{ id: Category; label: string }> = [
  { id: 'audio', label: 'Audio' },
  { id: 'apparel', label: 'Apparel' },
  { id: 'footwear', label: 'Footwear' },
  { id: 'desk', label: 'Desk' },
  { id: 'light', label: 'Light' },
]

export interface OptionValue {
  value: string
  /** CSS color for swatch-style options */
  swatch?: string
  /** Added to the base price, in USD */
  priceDelta?: number
  soldOut?: boolean
}

export interface ProductOption {
  name: string
  kind: 'swatch' | 'chip'
  values: Array<OptionValue>
}

export interface Product {
  id: string
  name: string
  tagline: string
  category: Category
  /** Base price in USD */
  price: number
  compareAt?: number
  badge?: 'New' | 'Bestseller' | 'Limited' | 'Sale'
  rating: number
  reviews: number
  images: Array<string>
  description: string
  features: Array<string>
  options: Array<ProductOption>
  /** Accent glow color for the product */
  accent: string
}

const colors = {
  pink: '#ff2bd6',
  cyan: '#22e6ff',
  lime: '#c6ff3d',
  violet: '#8b5cff',
  void: '#16131f',
  white: '#f3f1ff',
}

const apparelSizes: Array<OptionValue> = [
  { value: 'XS' },
  { value: 'S' },
  { value: 'M' },
  { value: 'L' },
  { value: 'XL' },
  { value: 'XXL', soldOut: true },
]

const products: Array<Product> = [
  {
    id: 'pulse-x1',
    name: 'Pulse X1',
    tagline: 'Wireless ANC headphones with a heartbeat of light',
    category: 'audio',
    price: 249,
    compareAt: 299,
    badge: 'Bestseller',
    rating: 4.8,
    reviews: 1284,
    images: ['/img/pulse-1.png', '/img/pulse-2.png'],
    description:
      'Pulse X1 wraps you in 40mm graphene drivers and adaptive noise cancelling, then lets the earcup rings breathe in time with the bass. Memory foam cushions, 60-hour battery and a fold-flat frame built for red-eye flights and late-night sessions.',
    features: [
      'Adaptive hybrid ANC',
      '60-hour battery, 10 min = 8 hrs',
      'Beat-reactive LED rings',
      'Multipoint Bluetooth 5.4',
    ],
    options: [
      {
        name: 'Color',
        kind: 'swatch',
        values: [
          { value: 'Cyber Pink', swatch: colors.pink },
          { value: 'Ice Cyan', swatch: colors.cyan },
          { value: 'Void Black', swatch: colors.void },
        ],
      },
    ],
    accent: colors.pink,
  },
  {
    id: 'neon-runner',
    name: 'Neon Runner',
    tagline: 'Light-strip trainers that own the night run',
    category: 'footwear',
    price: 189,
    badge: 'New',
    rating: 4.7,
    reviews: 642,
    images: ['/img/runner-1.png', '/img/runner-2.png'],
    description:
      'A translucent supercritical-foam midsole with embedded light strips that pulse with every stride. Neon Runner is engineered knit up top, grippy rubber below, and impossible to miss after dark.',
    features: [
      'Rechargeable sole lighting, 12 hr',
      'Supercritical foam midsole',
      'Reflective engineered knit',
      'Water-resistant to IPX4',
    ],
    options: [
      {
        name: 'Color',
        kind: 'swatch',
        values: [
          { value: 'Glacier', swatch: colors.white },
          { value: 'Cyan Rush', swatch: colors.cyan },
          { value: 'Acid', swatch: colors.lime, soldOut: true },
        ],
      },
      {
        name: 'Size',
        kind: 'chip',
        values: ['7', '8', '9', '10', '11', '12', '13'].map((value) => ({
          value,
          soldOut: value === '13',
        })),
      },
    ],
    accent: colors.cyan,
  },
  {
    id: 'orbit-lamp',
    name: 'Orbit Lamp',
    tagline: 'A halo of gradient light for any corner',
    category: 'light',
    price: 129,
    rating: 4.9,
    reviews: 538,
    images: ['/img/orbit-1.png', '/img/orbit-2.png'],
    description:
      'Orbit is a single ring of diffused LED that fades between 16 million colors. Set a slow sunset drift, sync it to music, or lock it to one soft glow for reading. Brushed aluminum stand, app and touch control.',
    features: [
      '16M color gradient engine',
      'Music sync mode',
      'App + capacitive touch control',
      'Brushed aluminum stand',
    ],
    options: [
      {
        name: 'Size',
        kind: 'chip',
        values: [
          { value: '40 cm desk' },
          { value: '80 cm floor', priceDelta: 70 },
        ],
      },
    ],
    accent: colors.violet,
  },
  {
    id: 'glitch-75',
    name: 'Glitch 75',
    tagline: 'Hot-swap mechanical keyboard in smoked glass',
    category: 'desk',
    price: 179,
    badge: 'Limited',
    rating: 4.8,
    reviews: 911,
    images: ['/img/glitch-1.png', '/img/glitch-2.png'],
    description:
      'A gasket-mounted 75% board with translucent smoked keycaps that let per-key RGB bleed through like a city skyline. Hot-swap sockets, tri-mode connection and a knob for volume or anything you map.',
    features: [
      'Gasket mount, 5-layer dampening',
      'Hot-swap 3/5-pin sockets',
      'Tri-mode: 2.4 GHz, BT, USB-C',
      'Per-key south-facing RGB',
    ],
    options: [
      {
        name: 'Switches',
        kind: 'chip',
        values: [
          { value: 'Linear' },
          { value: 'Tactile' },
          { value: 'Clicky' },
          { value: 'Silent', priceDelta: 15 },
        ],
      },
      {
        name: 'Layout',
        kind: 'chip',
        values: [{ value: 'ANSI' }, { value: 'ISO' }],
      },
    ],
    accent: colors.cyan,
  },
  {
    id: 'nightshift-shell',
    name: 'Nightshift Shell',
    tagline: 'Waterproof techwear with reflective circuitry',
    category: 'apparel',
    price: 229,
    rating: 4.6,
    reviews: 317,
    images: ['/img/nightshift-1.png', '/img/nightshift-2.png'],
    description:
      'A 3-layer waterproof shell traced with reflective cyan piping that lights up in headlights. Taped seams, pit zips, a stowaway hood and eight pockets for all your after-hours gear.',
    features: [
      '3L waterproof, 20k/20k',
      '360° reflective piping',
      'Stowaway storm hood',
      '8 pockets incl. hidden chest',
    ],
    options: [
      {
        name: 'Color',
        kind: 'swatch',
        values: [
          { value: 'Void Black', swatch: colors.void },
          { value: 'Ultraviolet', swatch: colors.violet },
        ],
      },
      { name: 'Size', kind: 'chip', values: apparelSizes },
    ],
    accent: colors.cyan,
  },
  {
    id: 'prism-buds',
    name: 'Prism Buds',
    tagline: 'Holographic earbuds that shift with the light',
    category: 'audio',
    price: 149,
    compareAt: 179,
    badge: 'Sale',
    rating: 4.5,
    reviews: 1520,
    images: ['/img/prism-1.png', '/img/prism-2.png'],
    description:
      'Prism Buds are coated in a multi-layer iridescent finish that shifts from violet to teal as you move. Inside: 11mm dynamic drivers, ANC, spatial audio and a glowing pocket case.',
    features: [
      'Iridescent multi-layer finish',
      'ANC + transparency mode',
      'Spatial audio with head tracking',
      '32 hrs with case',
    ],
    options: [
      {
        name: 'Finish',
        kind: 'swatch',
        values: [
          {
            value: 'Holo',
            swatch: 'linear-gradient(135deg,#ff2bd6,#8b5cff,#22e6ff,#c6ff3d)',
          },
          { value: 'Onyx', swatch: colors.void },
        ],
      },
    ],
    accent: colors.violet,
  },
  {
    id: 'volt-pack',
    name: 'Volt Pack',
    tagline: 'Rolltop backpack with acid-lime reflectives',
    category: 'apparel',
    price: 139,
    rating: 4.7,
    reviews: 402,
    images: ['/img/volt-1.png', '/img/volt-2.png'],
    description:
      'A weatherproof rolltop that expands from 22 to 30 litres, with a padded 16" laptop sleeve, magnetic sternum strap and glow-reactive lime webbing that charges in daylight and glows after dark.',
    features: [
      '22–30 L expandable rolltop',
      'Glow-in-the-dark webbing',
      'Padded 16" laptop sleeve',
      'Weatherproof TPU-coated shell',
    ],
    options: [
      {
        name: 'Color',
        kind: 'swatch',
        values: [
          { value: 'Acid / Black', swatch: colors.lime },
          { value: 'Cyan / Black', swatch: colors.cyan },
        ],
      },
    ],
    accent: colors.lime,
  },
  {
    id: 'synthwave-hoodie',
    name: 'Synthwave Hoodie',
    tagline: 'Heavyweight comfort with a neon wave',
    category: 'apparel',
    price: 89,
    badge: 'New',
    rating: 4.9,
    reviews: 776,
    images: ['/img/synth-1.png', '/img/synth-2.png'],
    description:
      'A 480 gsm brushed-back cotton hoodie in a boxy, dropped-shoulder cut, printed with a subtle gradient wave that glows under UV. Double-layer hood and kangaroo pocket included, obviously.',
    features: [
      '480 gsm organic cotton',
      'UV-reactive gradient print',
      'Boxy, dropped-shoulder fit',
      'Garment dyed, pre-shrunk',
    ],
    options: [
      {
        name: 'Color',
        kind: 'swatch',
        values: [
          { value: 'Deep Violet', swatch: '#3b1d6e' },
          { value: 'Midnight', swatch: '#101028' },
        ],
      },
      { name: 'Size', kind: 'chip', values: apparelSizes },
    ],
    accent: colors.violet,
  },
  {
    id: 'aurora-speaker',
    name: 'Aurora Speaker',
    tagline: '360° sound under a crown of northern lights',
    category: 'audio',
    price: 199,
    rating: 4.7,
    reviews: 489,
    images: ['/img/aurora-1.png', '/img/aurora-2.png'],
    description:
      'Aurora fills a room with 360° sound from a down-firing woofer and three tweeters, while its top ring drifts through aurora colors that follow the music. Pair two for stereo.',
    features: [
      '360° sound, 50 W peak',
      'Aurora light crown',
      'Wi-Fi + Bluetooth streaming',
      'Stereo pairing',
    ],
    options: [
      {
        name: 'Color',
        kind: 'swatch',
        values: [
          { value: 'Graphite', swatch: '#2a2a33' },
          { value: 'Frost', swatch: colors.white },
        ],
      },
    ],
    accent: colors.lime,
  },
  {
    id: 'flux-mat',
    name: 'Flux Desk Mat',
    tagline: 'Synthwave grid desk mat with a lit edge',
    category: 'desk',
    price: 39,
    rating: 4.6,
    reviews: 1033,
    images: ['/img/flux-1.png', '/img/flux-2.png'],
    description:
      'Micro-woven glide surface, a natural rubber base and an LED-stitched edge in 12 modes, all powered over a single USB-C. The synthwave grid makes every desk look like the opening credits.',
    features: [
      'Micro-woven speed surface',
      'LED edge, 12 modes',
      'Non-slip natural rubber',
      'Spill-resistant coating',
    ],
    options: [
      {
        name: 'Size',
        kind: 'chip',
        values: [
          { value: '80 × 30 cm' },
          { value: '90 × 40 cm', priceDelta: 10 },
          { value: '120 × 60 cm', priceDelta: 25 },
        ],
      },
    ],
    accent: colors.pink,
  },
  {
    id: 'holo-shades',
    name: 'Holo Shades',
    tagline: 'Wraparound UV400 shades with iridescent lenses',
    category: 'apparel',
    price: 119,
    badge: 'Limited',
    rating: 4.4,
    reviews: 208,
    images: ['/img/holo-1.png', '/img/holo-2.png'],
    description:
      'A single-shield wraparound lens with a holographic mirror coating, polarized and rated UV400. Ultralight TR90 frame with grippy temple tips — built for festival sunrises.',
    features: [
      'Polarized UV400 shield lens',
      'Holographic mirror coating',
      '24 g TR90 frame',
      'Includes glow travel case',
    ],
    options: [
      {
        name: 'Lens',
        kind: 'swatch',
        values: [
          {
            value: 'Holo Mirror',
            swatch: 'linear-gradient(135deg,#22e6ff,#8b5cff,#ff2bd6)',
          },
          { value: 'Smoke', swatch: '#3a3a44', priceDelta: -20 },
        ],
      },
    ],
    accent: colors.cyan,
  },
  {
    id: 'bolt-sign',
    name: 'Bolt Neon Sign',
    tagline: 'Hand-bent LED neon, zero fragile glass',
    category: 'light',
    price: 159,
    rating: 4.9,
    reviews: 355,
    images: ['/img/sign-1.png', '/img/sign-2.png'],
    description:
      'A lightning bolt in flexible LED neon, mounted on a clear acrylic backplate. Dimmable, low-heat and ready to hang above your desk, bar or bed in under five minutes.',
    features: [
      'Flexible LED neon tube',
      'Dimmable with remote',
      'Clear acrylic backplate',
      'Low heat, 50,000 hr life',
    ],
    options: [
      {
        name: 'Color',
        kind: 'swatch',
        values: [
          { value: 'Hot Pink', swatch: colors.pink },
          { value: 'Electric Cyan', swatch: colors.cyan },
          { value: 'Acid Lime', swatch: colors.lime },
        ],
      },
      {
        name: 'Size',
        kind: 'chip',
        values: [{ value: '40 cm' }, { value: '60 cm', priceDelta: 50 }],
      },
    ],
    accent: colors.pink,
  },
]

export default products

export function getProduct(id: string) {
  return products.find((p) => p.id === id)
}

/** Price for a product given selected option values. */
export function priceFor(product: Product, selection: Record<string, string>) {
  let price = product.price
  for (const option of product.options) {
    const picked = option.values.find((v) => v.value === selection[option.name])
    price += picked?.priceDelta ?? 0
  }
  return price
}

/** Validates a selection: every option must be set to an existing, in-stock value. */
export function isValidSelection(
  product: Product,
  selection: Record<string, string>,
) {
  return product.options.every((option) =>
    option.values.some(
      (v) => v.value === selection[option.name] && !v.soldOut,
    ),
  )
}

/** Pre-selects the first in-stock value; long size runs are left for the shopper to pick. */
export function defaultSelection(product: Product) {
  const selection: Record<string, string> = {}
  for (const option of product.options) {
    if (requiresChoice(option)) continue
    const first = option.values.find((v) => !v.soldOut) ?? option.values[0]
    selection[option.name] = first.value
  }
  return selection
}

export function requiresChoice(option: ProductOption) {
  return option.name === 'Size' && option.values.length > 3
}
