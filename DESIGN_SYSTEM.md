# 126 Vehicle Engineering — UI design system

Version 1.0 · September 2026

## Design direction

Build a precise, work-ready storefront: graphite structure, clean silver surfaces, and one high-visibility amber action color. Let product photography, fitment evidence, and repair information carry the authority. Avoid faux carbon fiber, distressed textures, chrome gradients, and decorative gauges.

The interface should help a customer answer three questions quickly: **Does it fit? What failure does it fix? Can I trust this repair?**

## Color system

| Token | Hex | Use |
| --- | --- | --- |
| Ink | `#101820` | Primary text, text on amber CTAs |
| Graphite | `#172733` | Header, dark panels, footer |
| Steel | `#455865` | Secondary text on light surfaces |
| Silver | `#748694` | Input borders and non-text control boundaries |
| Mist | `#F4F6F7` | Alternate sections, cards, image-gallery backdrop |
| White | `#FFFFFF` | Main page surface |
| Amber | `#F5B84B` | Primary CTA and selected purchase actions |
| Amber hover | `#EAA72C` | Primary CTA hover |
| Amber pressed | `#D8961F` | Primary CTA pressed |
| Signal blue | `#006EA6` | Text links, keyboard focus, selected gallery thumbnail |
| Confirmed green | `#145334` on `#DDF4E7` | Verified vehicle fitment only |
| Caution | `#684B00` on `#FFF1C7` | Fitment needs review |
| Error | `#8B2B22` on `#FDE5E2` | Fitment mismatch or form error |

Amber means **take action**, not general decoration. Green means a fitment check actually passed; never use it for a merely selected vehicle or an unverified seller claim. Do not use color alone to convey fitment status.

### WCAG 2.1 AA text pairs

Ratios below use the WCAG relative-luminance formula. All exceed 4.5:1 for normal text and 3:1 for large text.

| Foreground / background | Contrast |
| --- | ---: |
| Ink / White | 17.89:1 |
| Ink / Mist | 16.51:1 |
| Steel / White | 7.40:1 |
| Steel / Mist | 6.83:1 |
| White / Graphite | 15.28:1 |
| Light steel `#C7D3DC` / Graphite | 10.03:1 |
| Ink / Amber | 10.09:1 |
| Ink / Amber hover | 8.57:1 |
| Ink / Amber pressed | 7.07:1 |
| Signal blue / White | 5.55:1 |
| Signal blue / Mist | 5.12:1 |
| Confirmed green / pale green | 7.84:1 |
| Caution text / pale yellow | 7.19:1 |
| Error text / pale red | 7.09:1 |

Use Silver for borders, **not** small body text. Its contrast on White is only 3.76:1. A check badge must include a word and icon, not just green color.

## Typography

- **Display and headings:** Barlow Condensed, weights 600 and 700; fall back to Arial Narrow, then a system sans serif. Use restrained uppercase for short labels only.
- **Body and controls:** Inter, weights 400, 500, 600, and 700; fall back to system sans serif. Self-host font files where possible, with `font-display: swap`.
- **Numbers and part IDs:** Inter with tabular numerals. Preserve the exact casing and punctuation of OE numbers.

| Role | Desktop / mobile size | Line height | Weight | Usage |
| --- | --- | --- | ---: | --- |
| Display | `clamp(3rem, 6vw, 5rem)` | 0.98 | 700 | One hero headline |
| H1 | `clamp(2.5rem, 4vw, 4rem)` | 1.05 | 700 | Page title |
| H2 | `clamp(2rem, 3vw, 3rem)` | 1.1 | 700 | Major section |
| H3 | `clamp(1.5rem, 2vw, 2rem)` | 1.15 | 600 | Card/section heading |
| H4 | `1.25rem` | 1.2 | 600 | Detail group |
| Lead | `1.125rem` | 1.55 | 400 | Intro paragraph |
| Body | `1rem` | 1.5 | 400 | Product explanations |
| Small | `0.875rem` | 1.45 | 500 | Helper text, metadata |
| Eyebrow | `0.75rem` | 1.3 | 700 | Short category label; letter spacing 0.08em |

Do not set essential specifications or warranty language below 14 px. Limit long reading lines to roughly 70 characters.

## Layout, shape, and interaction

- Content width: 76rem maximum; page gutters: 1rem mobile, 1.5rem tablet, 2rem desktop.
- Spacing uses a 4 px base; section gaps are 64–96 px desktop and 40–64 px mobile.
- Corners: 4 px for inputs and small controls, 8 px for cards and primary buttons. Avoid pill-shaped purchase buttons; reserve pills for status badges.
- Borders: 1 px neutral for passive separation; input and selected-state borders must remain visually distinct against adjacent surfaces.
- Tap targets: at least 44 × 44 px. Show a 3 px focus outline with 3 px offset. Never remove focus styling.
- Use Signal blue focus outlines on light surfaces and Amber focus outlines on Graphite. Input labels remain visible after entry; placeholder text never substitutes for a label.
- Motion: 120–180 ms for hover/focus transitions. Disable nonessential motion under `prefers-reduced-motion`.

## E-commerce components

### Add to Cart

- Amber fill, Ink text, 700 weight, 16 px minimum, 52 px height desktop and 48 px mobile, with 16–24 px horizontal padding.
- Label should be **Add to Cart**. Use **Check Fitment** first when fitment is required and not yet confirmed; the purchase action may remain available only if the product policy permits an unverified purchase.
- Hover, pressed, disabled, loading, and focus states are defined in `tokens.css`. Loading keeps the button width stable and announces progress to assistive technology. Disabled styling is accompanied by explanatory text.
- Do not put an Amber button next to another Amber button. Use a dark-outline secondary action such as **Ask a Fitment Question**.
- On mobile product pages, a sticky purchase bar may show price, fitment state, and one purchase action without hiding legal or warranty information.

### Search and fitment forms

- Place labels above fields. Use a 48 px minimum input height, White fill, Ink input text, and Silver border. On focus, show a Signal blue border and outline.
- Validation errors use Error text plus an icon and a sentence that tells the customer what to correct. Preserve entered vehicle details when validation fails.
- Search suggestions must be keyboard reachable and announce their count. Offer an explicit no-results path to support rather than a blank product grid.

### Product image gallery

- Main media sits on Mist in a square frame, with `object-fit: contain` and no cropped kit components.
- Thumbnails are at least 72 × 72 px. The selected thumbnail has a 3 px Signal blue outline; hover alone does not imply selection.
- Supply descriptive alt text for each unique image and label close-ups by purpose, such as “resolver connector detail.” Decorative repeated views can use empty alt text.
- Keyboard users can reach each thumbnail. The gallery must work without hover; do not autoplay video. A zoomed view needs an accessible close button and focus return.
- Mark the selected thumbnail with `aria-current="true"` and keep the main image alt text in sync with selection.
- If media is missing, show a clear placeholder and avoid publishing the product as a featured item until representative photos are available.

### Vehicle Fitment Confirmed badge

- Pale green background, dark green text, check icon, and the exact label **Vehicle Fitment Confirmed**.
- Show it only after the checker validates all required attributes for that SKU: year, make, model, relevant engine/trim, and assembly or OE number where needed.
- Pair it with a visible summary: “Fits {vehicle details} · Verified against {part/assembly number}.” Allow the customer to edit those details.
- Alternative states: **Fitment Needs Review** in caution colors and **Fitment Not Confirmed** in error colors. A mismatch is not the same as a definitive incompatibility unless the catalog data proves it.

## Product page order

1. Breadcrumb and exact part name.
2. Image gallery beside price, stock, fitment check, and Add to Cart.
3. “What this fixes” and “What it does not fix.”
4. Kit contents and install requirements.
5. Fitment table with OE numbers and revision notes.
6. Installation overview, warranty, shipping, returns, and support.
7. Verified reviews and related repair guides, when available.

Keep fitment and repair exclusions adjacent to the purchase action. A trust badge must link to its supporting details; “Engineered in the USA” and warranty terms should appear only on SKUs where they are verified.

## Accessibility and implementation checklist

- Semantic heading order, native form labels, error text linked to its field, and live announcements for fitment results and cart updates.
- Statuses have text and icon as well as color; price and stock changes are announced without moving focus.
- Text contrast uses only approved pairs above. Interactive controls and focus indicators should retain at least 3:1 contrast against adjacent colors.
- Test at 320 px and wider, at 200% zoom, by keyboard, and with a screen reader. WCAG compliance depends on rendered components and behavior as well as token contrast.

