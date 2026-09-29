# 126 Vehicle Engineering — design system
Version 2.0 · September 2026

## Direction
Dark industrial surfaces, electric orange actions, spacious technical typography, and clear repair limits. Component diagrams support the engineering story. One shared Brand component keeps the header and footer wordmark identical.

## Implementation
- `tokens.css`: full CSS custom properties, buttons, fields, status badges, focus and reduced-motion rules.
- `src/styles.css`: responsive page layouts and component styling.
- `src/App.jsx`: React homepage, product page, About, navigation, gallery, fitment, and cart.
- `tailwind.config.cjs`: optional Tailwind v3 token adapter. The Vite build uses ordinary CSS and does not require Tailwind.
- `src/data.js`: product, price, contact, and media source data.

## Palette
| Role | Value |
| --- | --- |
| Canvas | #090D16 |
| Surface | #101722 |
| Raised surface | #17212E |
| Hover surface | #202D3D |
| Primary text | #F3F5F7 |
| Secondary text | #A6B2C2 |
| Quiet text | #8392A5 |
| Action / hover / pressed | #FF8347 / #FF9B6B / #ED7033 |
| Text on action | #131820 |
| Decorative border | white at 10% |
| Control boundary | #68798D |
| Focus outline | #9CCAFF |
| Success | #77E5AE on #102C24 |
| Review | #F5CF82 on #302819 |
| Mismatch | #FFABA9 on #342023 |

Use decorative low-contrast borders only for grouping. Inputs and secondary buttons have stronger boundaries. Status always includes explanatory words and an icon.

### WCAG text contrast
Calculated with WCAG relative luminance on the specified opaque surfaces:
| Pair | Ratio |
| --- | ---: |
| Primary / canvas | 17.78:1 |
| Secondary / raised | 7.55:1 |
| Quiet / raised | 5.12:1 |
| Action text / default | 7.28:1 |
| Action text / hover | 8.61:1 |
| Action text / pressed | 5.91:1 |
| Success pair | 9.66:1 |
| Review pair | 9.79:1 |
| Mismatch pair | 8.46:1 |

These text pairs exceed 4.5:1 for normal text. Control boundary against raised surface is 3.64:1. Gradients and images must not sit behind essential text without a sufficiently opaque surface. This is a token contrast specification, not a certification of every rendered page.

## Typography
- Space Grotesk: headings, price, wordmark numerals.
- Inter: body, links, buttons, form fields.
- JetBrains Mono: unit numbers, technical labels, diagram identifiers.
- System and monospace fallbacks are provided; Google Fonts requests use display=swap.

| Role | Scale |
| --- | --- |
| Hero | clamp(3.1rem, 6.2vw, 5.65rem) |
| Page title | clamp(2.2rem, 4.3vw, 4rem) |
| Section title | clamp(2rem, 3.4vw, 3.15rem) |
| Card title | clamp(1.2rem, 1.8vw, 1.5rem) |
| Body / fields | 1rem |
| Small body / fitment explanations | .875rem |
| Technical labels | .75rem |

Use sentence case. Keep uppercase to short technical eyebrows. Preserve exact unit numbers and readable line lengths.

## Spacing, surface, and motion
- Content width: 78rem. Section spacing: clamp(4rem, 8vw, 7rem).
- Spacing foundation: .25, .5, .75, 1, 1.5, 2, 3rem.
- Control/card/panel radii: .6 / 1.1 / 1.5rem.
- Glass effects are restrained to navigation, floating labels, and search surfaces, with solid color fallbacks.
- Subtle inset highlights and dark shadows distinguish elevated cards.
- Interactive cards lift on hover. Buttons depress on activation.
- Transitions: 160ms controls / 280ms panels. Gallery reveal and cart entrance use CSS keyframes.
- All animation, transitions, and smooth scrolling stop under prefers-reduced-motion.
- Processing controls expose aria-busy and disabled states. Local actions yield a render frame rather than inventing a network delay.

## Homepage
1. Compact location bar and navigation.
2. Oversized two-line value proposition plus conceptual component artwork.
3. Year/make/model search dock. On phones, the search appears before artwork.
4. Shop-by-platform shortcuts.
5. Three linked value cards: targeted repair, fitment, direct support.
6. Featured kit with price and repair exclusions.
7. Assembly-replacement versus targeted-repair comparison.
8. Sourced feedback excerpts and contact card.
9. Repair resources, FAQ, final CTA, consistent footer.

Trust statements use verified Rochester location, repair scope, and sourced eBay feedback. No unverified guarantee, manufacture-origin badge, aggregate rating, or permanent-fix claim is displayed. Sources and business facts are recorded in BRAND_RESEARCH.md.

## Product and fitment
- Desktop: gallery left; price, fitment, and purchase panel right. The panel is sticky and scrollable on shorter screens so no controls become unreachable.
- <=720px: gallery, then purchase details; fixed safe-area-aware bottom purchase bar. Main content has bottom clearance.
- Gallery provides three selectable diagrams, active thumbnail border, enlarged native dialog, Escape dismissal, and focus restoration.
- Diagrams are explicitly labeled conceptual, not product photographs or dimensionally accurate service drawings. Replace them with approved product photos when available.
- Comparison is a semantic table that becomes labeled stacked rows on mobile.
- Repair guidance describes preparation and scope; it does not replace the applicable 48V service procedure.

### Fitment contract
1. Empty or edited selection: neutral/review prompt; no retained success state.
2. 2019–2024 Ram 1500 5.7L eTorque: green **Vehicle match confirmed**, with unit number, bearing dimensions, and fault still to verify.
3. Matching vehicle plus 68623194AC (case normalized): green **Vehicle + unit number match**; inspection still required.
4. Other unit number: amber **Unit number needs review**.
5. Outside listed vehicle range: red **Vehicle match not confirmed**.
6. Changing make clears the model.
A vehicle match is not a diagnosis or unconditional fitment warranty.

## Accessibility and mobile
- Native select fields stay at 16px to avoid mobile form zoom.
- Primary controls are at least 44px tall; purchase buttons are 52px.
- Visible keyboard focus, skip link, associated form labels, expanded navigation states, live fitment status, native modal semantics.
- Touch navigation has explicit open/close controls and closes after selection.
- 720px controls product/search layout; 880px controls desktop/mobile navigation.
- No horizontal page overflow at the tested widths; the product section navigation may scroll within its own region.
- Footer/header use the same component and accessible brand name.

## Commerce and release boundaries
Cart state persists locally and purchase continues on the existing official product page. This redesign does not introduce a payment backend or claim confirmed inventory. Existing price and catalog facts must be maintained in src/data.js. Staging retains noindex metadata.

## Verification
```powershell
pnpm build
pnpm preview
pnpm verify:staging -- http://127.0.0.1:4173/
pnpm verify:interactions -- http://127.0.0.1:4173/
```
Both verifiers also accept the GitHub Pages repository URL. The viewport suite covers home, About, and product at 320, 390, 719, 721, 879, 881, and 1280px. Interaction checks cover fitment, gallery, keyboard dismissal/focus, cart persistence/removal, navigation, and reduced motion. No orders are placed.
