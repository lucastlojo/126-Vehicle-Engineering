# 126 Vehicle Engineering storefront frontend

Three responsive, prerendered React pages built with Vite and the tokens in `tokens.css`:

- `/` — homepage with Year / Make / Model search
- `/about/` — company approach and verified contact details
- `/products/ram-1500-etorque-mgu-rebuild-kit/` — product page with gallery, fitment check, sticky desktop purchase card, and mobile purchase bar

## Run

```sh
pnpm install
pnpm dev
```

For a deployable static build:

```sh
pnpm build
pnpm preview
```

Deploy the contents of `dist/`. The build prerenders all three page bodies into their HTML files so navigation and page copy are available before hydration. Serve directory index files for the product URL. GitHub Pages staging setup and verification are in `STAGING_DEPLOY.md`.

## Integration points before launch

- `src/data.js` is the product catalog source for this frontend. Connect price, availability, product media, and kit contents to the authoritative commerce catalog. The displayed $520 price reflects the product page inspected during this project and should be checked against live pricing.
- The gallery currently contains **clearly labeled conceptual SVGs**, not product photos. Replace the `media` entries with approved photos of the actual kit, retaining descriptive alt text.
- The fitment form distinguishes a vehicle match, a vehicle plus unit-number match, a unit needing review, and a vehicle mismatch. Green matches retain explicit requirements to inspect bearing dimensions and the actual fault. Editing a field resets the result. See `DESIGN_SYSTEM.md` for the fitment contract.
- The cart stores this one product locally and sends buyers to the existing 126 product page to complete purchase. Replace `legacyPurchaseUrl` with an integrated checkout endpoint when the commerce backend is ready; confirm final pricing, shipping, taxes, warranty, and returns there.
- Verify every product-specific technical claim, contact detail, and installation instruction against the current kit and service documentation before publishing.

## Accessibility and responsive behavior

The pages use semantic landmarks, labeled native selects, keyboard-operable menus and gallery buttons, visible focus states, a native modal dialog, live fitment feedback, and reduced-motion handling. Layouts were checked at 320, 390, 719, 721, 879, 881, and 1280 px widths. `DESIGN_SYSTEM.md` contains the color contrast and component rules.

## Regression checks

Run `pnpm verify:staging -- <preview-url>` for assets and responsive layouts, and `pnpm verify:interactions -- <preview-url>` for fitment, gallery, cart, and navigation. Both accept local or GitHub Pages URLs. No orders are placed.
