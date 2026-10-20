# Afterglow

A neon-styled online store built with TanStack Start (React 19), Tailwind CSS v4 and Stripe Checkout, deployed on Netlify. It includes a searchable and filterable product grid, product pages with galleries and variants, a bag saved in the browser, and glow effects on hover and around the cursor.

## Run locally
```bash
pnpm install
netlify dev   # http://localhost:8888
```
Set `STRIPE_SECRET_KEY` (and optionally `SITE_URL`) to turn on checkout.

## Features
- Real customer reviews
- Inventory and stock tracking
- Order history and Stripe webhooks
