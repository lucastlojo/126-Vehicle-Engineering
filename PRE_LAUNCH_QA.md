# 126 Vehicle Engineering — pre-launch QA and technical checklist

**Version:** 1.0 · September 2026  
**Scope:** New homepage, vehicle search, Ram eTorque product page, cart, checkout handoff or replacement checkout, search migration, and launch operations. Extend the product matrix before adding more SKUs.  
**How to use:** Assign an owner and test environment to every line. Attach a screenshot, order ID, log extract, URL report, or test recording as evidence. Mark an item *N/A* only with an explanation. Re-run all **P0** items after the final deployment candidate is built.

**Priority:** **P0** = launch blocker; **P1** = required quality gate; **P2** = post-launch optimization only if explicitly accepted by the launch owner.

## Current implementation: known P0 gaps

These are observations from the frontend in this workspace, not test results for a completed commerce platform.

- [ ] **P0** Replace or formally approve the current one-item `localStorage` cart and legacy product-page handoff in `src/App.jsx`. There is no integrated new-site payment, order, shipping, tax, or inventory service yet.
- [ ] **P0** Connect the hard-coded `$520` price and product fields in `src/data.js` to an authoritative catalog, or establish a controlled release process that keeps the site, checkout, feed, and structured data identical.
- [ ] **P0** Replace the conceptual SVG gallery with clear photographs of the exact kit and contents before a Merchant Center submission or a customer-facing product launch. Google's main product image must show the product, not generic concept art. [Merchant Center image rules](https://support.google.com/merchants/answer/6324350?hl=en)
- [ ] **P0** Obtain product-owner signoff for year range, OE/reference number, bearing dimensions, resolver/bearing scope, exclusions, box contents, installation language, support contact, and final price.
- [ ] **P0** Publish and verify real shipping, returns, and warranty terms before taking payment. Hide any unverified trust badge or promise.
- [ ] **P0** Implement and test the 301 map, `robots.txt`, XML sitemap, product structured data, and analytics. The old site's `/robots.txt` and `/sitemap.xml` returned 404 during the audit; the new build does not yet supply them.

## 1. Checkout and payment gateway testing

**Exit criterion:** A customer can complete each offered payment method exactly once; the paid order, inventory, tax, shipping, confirmation, and analytics agree. A failed or abandoned payment creates no paid order.

### Order and cart fundamentals

- [ ] **P0** Decide whether checkout stays on the existing store or moves to a new provider. Document the exact destination and owner of orders, inventory, refunds, and customer support.
- [ ] **P0** Confirm every visible payment logo/button is enabled for the production merchant account; hide methods that are not available.
- [ ] **P0** Verify product page price, cart subtotal, checkout subtotal, final total, and order record use the same authoritative SKU and price; reject client-side price tampering.
- [ ] **P0** Test one unit, multiple units if supported, remove item, browser refresh, new tab, back navigation, expired cart, and out-of-stock transition.
- [ ] **P0** Confirm checkout cannot sell an unavailable SKU or variant; inventory is reserved/decremented once and restored appropriately after cancellation or refund.
- [ ] **P0** Show shipping, tax, discounts, and total before final payment. Recalculate server-side after address, shipping method, quantity, or coupon changes.
- [ ] **P0** Verify the confirmation page and email show order number, items, quantity, paid total, tax, shipping, contact, and next steps without exposing full card details.
- [ ] **P0** Verify a completed payment produces one order and one fulfillment instruction even after browser refresh, repeated button taps, callback retries, or duplicate webhooks.
- [ ] **P0** Test payment-success redirect failure: server-side payment confirmation still creates/fulfills the order; a success page alone must not be the source of truth.
- [ ] **P0** Test customer support lookup, cancellation, full/partial refund, and refund notification against the same order record.
- [ ] **P1** Test guest checkout, address validation, required-field errors, coupon rejection, and recovery after a network interruption without losing the cart.
- [ ] **P1** Confirm wholesale or mechanic pricing, if offered, cannot be accessed through a public URL or altered client-side.

### Credit and debit cards

- [ ] **P0** Use the processor's test environment to verify successful Visa/Mastercard and any additional card brands actually accepted.
- [ ] **P0** Exercise invalid number, expired card, incorrect security code, insufficient funds, generic decline, processor timeout, and 3-D Secure challenge success/failure; show actionable errors without double charging.
- [ ] **P0** Verify card entry is hosted or tokenized by the payment provider. Never place card number, CVC, or payment token secrets in application logs, analytics, URLs, or browser storage.
- [ ] **P0** Verify webhook signatures, replay/duplicate handling, idempotent order creation, and restricted access to live payment credentials.
- [ ] **P1** Test refund and chargeback/dispute notifications; reconcile the processor report against order totals.

Use the chosen provider's current test cases; [Stripe's testing guide](https://docs.stripe.com/testing) includes successful, declined, and 3-D Secure card scenarios. Confirm the PCI scope and required validation with the payment provider/acquirer; outsourcing payment processing does not automatically remove all merchant responsibilities. [PCI SSC guidance](https://www.pcisecuritystandards.org/faqs/does-pci-dss-apply-to-merchants-who-outsource-all-payment-processing-operations-and-never-store-process-or-transmit-cardholder-data/)

### Apple Pay

- [ ] **P0** If Apple Pay is offered, verify the production domain, merchant setup/certificates or processor-managed equivalents, HTTPS, and Apple Pay eligibility on supported devices.
- [ ] **P0** Complete an Apple Pay sandbox purchase on a real eligible iPhone/Safari configuration and verify the captured amount, shipping address, tax, shipping option, order, and confirmation.
- [ ] **P0** Change the address or shipping option inside the wallet sheet; verify the displayed total updates correctly before authorization.
- [ ] **P0** Cancel the wallet sheet and test a failed authorization; no paid order or inventory decrement remains.
- [ ] **P1** Check that the Apple Pay button appears only when available and uses the provider's current display rules; test fallback to card checkout.

Apple requires web merchant configuration and domain verification for direct Apple Pay on the web; test in its sandbox and keep verification/certificates current. [Apple setup](https://developer.apple.com/documentation/applepayontheweb/configuring-your-environment), [sandbox testing](https://developer.apple.com/apple-pay/sandbox-testing/)

### PayPal

- [ ] **P0** If PayPal is offered, use sandbox business and buyer accounts to test approval, capture, buyer cancellation, declined funding source, and provider/API failure.
- [ ] **P0** Verify amount/currency/shipping/tax passed to PayPal match the cart and the amount captured on return.
- [ ] **P0** Verify an approved but uncaptured order is not marked paid; duplicate capture calls cannot create duplicate orders.
- [ ] **P1** Test guest versus signed-in PayPal flow if both are enabled, return-to-site behavior, refunds, and mobile pop-up/redirect handling.

PayPal's integration distinguishes order creation, payer approval, and capture; sandbox accounts are available for end-to-end tests. [PayPal integration](https://developer.paypal.com/platforms/checkout/standard/integrate), [sandbox guide](https://developer.paypal.com/sandbox-testing/overview/)

### Shipping, tax, and fulfillment

- [ ] **P0** Test shipping to nearby Rochester/NY, another contiguous state, Alaska/Hawaii, and any international destinations actually supported; unsupported destinations must be blocked clearly.
- [ ] **P0** Test every offered shipping speed, free-shipping threshold, local pickup option, and carrier-calculated rate against carrier/account rules.
- [ ] **P0** Confirm packaged weight/dimensions and origin ZIP for each SKU; test dimensional-weight, large-package, multi-item, and split-shipment cases where applicable.
- [ ] **P0** Test invalid ZIP, PO box, apartment/unit, and address correction cases; never silently replace a customer's address.
- [ ] **P0** Verify sales-tax calculation and exemption rules with the configured tax service and business policy across relevant jurisdictions.
- [ ] **P0** Verify fulfillment receives correct SKU, quantity, address, service level, and customer contact; test label generation, tracking email, cancellation, and return initiation.
- [ ] **P1** Match Merchant Center shipping and return settings to what customers actually see at checkout. [Google shipping specification](https://support.google.com/merchants/answer/7052112?hl=en)

## 2. Mobile usability in garage conditions

**Exit criterion:** A user can identify fitment, read limitations, and complete purchase on a phone outdoors or beside a vehicle without accidental taps, hidden controls, or lost progress.

### Device and environment matrix

- [ ] **P0** Test real iPhone Safari and Android Chrome, including a small phone (around 320–360 CSS px), common 390–430 px phones, and landscape orientation.
- [ ] **P0** Test the hero Year/Make/Model dropdowns, product fitment form, gallery thumbnails, cart dialog, and sticky Add to Cart bar by touch, keyboard, and screen reader.
- [ ] **P0** Confirm there is no horizontal scrolling at 320 px, 200% zoom, or with larger system text. The keyboard must not cover the active field or primary action.
- [ ] **P0** Ensure the sticky purchase bar never hides fitment warnings, warranty/return links, consent controls, footer content, or checkout fields; account for device safe-area insets.
- [ ] **P0** Verify tap targets are at least the design-system goal of 44 × 44 CSS px with spacing between adjacent controls. This is a usability target; WCAG 2.1 AA does not mandate 44 px for every target. [WCAG 2.1](https://www.w3.org/TR/WCAG21/)
- [ ] **P0** Check primary text against the approved AA color pairs and non-text boundaries/focus indicators at 3:1. Test under direct sunlight and low brightness; do not rely on amber/green/red alone to communicate meaning.
- [ ] **P0** Test one-handed use: vehicle search and Add to Cart should be reachable without precision tapping or hover; product exclusions must be accessible before purchase.
- [ ] **P1** Test with work gloves or wet/dirty hands as a practical field check; enlarge cramped thumbnail and close controls if mis-taps occur.
- [ ] **P1** Verify portrait/landscape gallery swipes and native select menus; no accidental selection while scrolling.
- [ ] **P1** Test screen reader names and announcements for selected images, fitment outcomes, cart updates, invalid fields, and modal close/focus return.
- [ ] **P1** Test browser back/forward, interrupted call/text, app switch, page reload, and poor connectivity without losing the selected vehicle or adding duplicate items.
- [ ] **P1** Respect reduced-motion and high-contrast/forced-color settings. Verify links have visible focus and adequate affordance beyond color.

### Performance and resilience

- [ ] **P0** Measure real mobile field data after launch and lab data before launch. Target p75 LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1 for mobile and desktop. [LCP](https://web.dev/articles/lcp), [INP](https://web.dev/articles/inp), [CLS](https://web.dev/articles/optimize-cls)
- [ ] **P0** Test cold load on a throttled mobile network and mid-range phone; ensure hero headline and search render before optional media and third-party tags.
- [ ] **P0** Size and compress actual product photos; serve responsive formats, explicit dimensions, and lazy-load below-the-fold images without lazy-loading the main product/hero image.
- [ ] **P0** Test slow and failed requests to the catalog, shipping service, payment provider, and analytics. Show useful retry/error states; prevent duplicate purchases.
- [ ] **P1** Audit font loading and layout stability; verify fallback fonts do not hide buttons or shift the fitment form.
- [ ] **P1** Check critical pages with JavaScript delayed or blocked: prerendered copy, links, phone/email, product identity, and price must remain readable.
- [ ] **P1** Check caching/versioning so a deploy does not mix old JS with new product data or checkout configuration.

## 3. Product data and fitment accuracy

**Exit criterion:** Every visible SKU and variant maps to the correct physical kit, compatible vehicles, price, media, and checkout item; uncertain fitment is never shown as confirmed.

### Catalog source of truth

- [ ] **P0** Establish one canonical product record per sellable SKU: internal SKU, product name, kit revision, price/currency, tax class, inventory, weight/dimensions, images, warranty, and checkout/processor price ID.
- [ ] **P0** Reconcile `src/data.js`, old catalog `price_id`, new product slug, payment provider product/price, warehouse SKU, and Merchant Center `id` in a signed mapping sheet.
- [ ] **P0** Check all product links from homepage, search, menus, featured cards, cart, email, and feed land on the intended SKU; no wrong variant or obsolete price.
- [ ] **P0** Verify the exact Ram kit contents with the current packed unit. The frontend currently states a resolver component and bearing pair; replace any uncertain text before launch.
- [ ] **P0** Verify the `2019–2024` Ram 1500 5.7L eTorque range and reference `68623194AC` against engineering records and actual unit revisions, including exceptions and supersessions.
- [ ] **P0** Define required fitment inputs for this SKU (year, model, engine, MGU/unit number, bearing size, revision) and negative cases. Do not set **Vehicle Fitment Confirmed** from Year/Make/Model alone.
- [ ] **P0** Test boundary years (2018, 2019, 2024, 2025), wrong engine, wrong model, unknown number, previous/revised unit, damaged stator, and controller/inverter failure. Each outcome must show the appropriate match, needs-review, or no-match message.
- [ ] **P0** Test Make changes reset the Model selector; invalid/stale query parameters cannot prefill an impossible combination; empty form fields show native and accessible validation.
- [ ] **P0** Verify bearing-size warning is prominent before Add to Cart and survives the path from homepage to product page.
- [ ] **P0** Confirm product title, vehicle fitment, OE references, diagnostic symptoms, repair scope, exclusions, installation skill/safety note, and box contents with a named engineer or product owner.
- [ ] **P0** Replace technical illustrations with actual, approved kit images showing everything included. Keep diagrams as secondary explanatory media and label them clearly.
- [ ] **P0** Confirm the live product page shows accurate stock, shipping lead time, warranty term and covered components, returns, and contact details; do not show a trust badge without evidence.
- [ ] **P1** Ensure SKU variants such as resolver-only versus resolver-plus-bearings have separate content, price, inventory, media, and fitment logic if sold.
- [ ] **P1** Validate Tesla AWD/RWD parts and any BMW/Audi/Toyota items independently before exposing them through the new navigation or feed.
- [ ] **P1** Keep discontinued items useful: show an alternative or support route, with correct 404/410 or permanent redirect based on whether a direct replacement exists.
- [ ] **P1** Test CSV/API import and update failures, stale cache, wrong currency, duplicate SKU, malformed image URL, and sold-out state.

### Acceptance sample for every SKU

Record one test case each for **positive fit**, **negative fit**, **uncertain fit**, **wrong unit number**, **wrong year**, **out of stock**, and **price change**. For each case, compare the search result, product page, cart, checkout, order record, structured data, and Merchant Center feed.

## 4. SEO, Merchant Center, and analytics

**Exit criterion:** Search engines can discover the new canonical pages, old URLs resolve to the most relevant new pages, feed data matches checkout, and one customer action generates one correct analytics event.

### Crawlability and on-page SEO

- [ ] **P0** Keep homepage and product content in the built HTML, not only client-rendered after JavaScript; verify a raw HTTP fetch contains the title, body copy, and product details.
- [ ] **P0** Publish production `robots.txt` and XML sitemap, remove staging `noindex`/password blocks, and verify the sitemap lists only live canonical 200 URLs.
- [ ] **P0** Verify unique titles/descriptions, one H1, descriptive URLs, canonical URLs, breadcrumbs, meaningful internal links, and mobile/desktop content parity.
- [ ] **P0** Add valid `Product`/`Offer` merchant-listing structured data to purchase pages with accurate price, currency, availability, image, SKU, and shipping/return details where supplied; test with Google's tools. [Google merchant-listing markup](https://developers.google.com/search/docs/appearance/structured-data/merchant-listing)
- [ ] **P0** Use actual product photography for the main image URL. Check image crawlability, alt text, stable URLs, and no generic concept graphic in the feed. [Merchant Center image rules](https://support.google.com/merchants/answer/6324350?hl=en)
- [ ] **P1** Confirm search pages and faceted URLs have an intentional index/canonical policy; avoid large duplicate parameter combinations.
- [ ] **P1** Verify social preview title, description, and image; test share links from iPhone and Android.
- [ ] **P1** Check product FAQ and repair-guide claims against engineering evidence; avoid unsourced “permanent fix” or OEM savings claims.

### 301 redirect migration

- [ ] **P0** Export all known old URLs from a crawl, Search Console, analytics landing pages, backlinks, and server logs. Create an old→new mapping signed off by the site owner.
- [ ] **P0** 301 `/index.html` to `/`; keep `/` a 200 canonical homepage.
- [ ] **P0** 301 `/PartBrowser/php/public/index.html` to the new shop/browse destination once it exists.
- [ ] **P0** Map each `/PartBrowser/php/public/part-detail.html?price_id=...` to its **specific** product slug; test the known Ram `price_1Tu1YBFbOGYu2kpjuTaKGfho` and Tesla `price_1THDaTFbOGYu2kpjFUY8vrCx` examples.
- [ ] **P0** Map `/Home/rental.php` to the retained rental page if offered; decide the treatment of discontinued service pages deliberately.
- [ ] **P0** Test HTTP→HTTPS, `www`→chosen hostname, trailing slash, case, and query behavior in one hop where possible. No redirect loop, 302 on permanent moves, or mass redirect of unrelated products to the homepage.
- [ ] **P0** Replace internal links, canonical tags, feed URLs, paid-ad destinations, and email links with new URLs; fragments such as `#contact` are not sent to the server and cannot receive a server-side 301.
- [ ] **P0** Crawl the staging redirect map and production host for 200/301/404/500 outcomes. Keep permanent redirects at least one year and preferably longer for users and backlinks. [Google site-move guidance](https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes)
- [ ] **P1** Monitor Search Console indexing, coverage, rich-result issues, 404s, and organic landing-page traffic daily after cutover; fix high-traffic errors first.

### Google Merchant Center

- [ ] **P0** Verify and claim the production domain; configure shipping and returns to match checkout and actual service regions.
- [ ] **P0** Feed one stable `id` per sellable SKU, accurate title/description, product URL, approved image URL, brand/identifier handling, condition, price/currency, and availability.
- [ ] **P0** Confirm landing page, structured data, feed, and checkout agree on price, availability, shipping, and return terms. Google explicitly requires availability to match across those surfaces. [Product data specification](https://support.google.com/merchants/answer/7052112?hl=en)
- [ ] **P0** Verify main images meet current dimensions/content rules and show the exact kit; no placeholder or conceptual drawing in `image_link`. [Image requirements](https://support.google.com/merchants/answer/6324350?hl=en)
- [ ] **P0** Submit feed; resolve disapprovals, missing attributes, image fetch errors, shipping mismatches, and price mismatches before enabling Shopping ads.
- [ ] **P1** Check feed update cadence, variant grouping if applicable, and daily diagnostics after launch; use Merchant Center's shipping calculator on representative ZIP codes. [Shipping calculator](https://support.google.com/merchants/answer/15122209?hl=en)

### Analytics and attribution

- [ ] **P0** Choose one GA4 installation path (Google tag or Tag Manager) and prevent duplicate tags on the new page and legacy checkout.
- [ ] **P0** Instrument and validate `view_item_list`, `select_item`, `view_item`, `add_to_cart`, `remove_from_cart`, `begin_checkout`, `add_shipping_info`, `add_payment_info`, `purchase`, and `refund` where each action exists.
- [ ] **P0** Send consistent `item_id`/SKU, item name, quantity, `value`, and `currency`; send `transaction_id` once for the completed purchase, not on button click or the return page alone. [GA4 ecommerce guide](https://developers.google.com/analytics/devguides/collection/ga4/ecommerce)
- [ ] **P0** Test Add to Cart exactly once per intentional add and no purchase event for canceled/declined payments. Validate in DebugView and against a test order. [GA4 validation](https://developers.google.com/analytics/devguides/collection/ga4/validate-ecommerce)
- [ ] **P0** If checkout remains on the old store or another domain, verify session attribution, referral exclusion/cross-domain behavior, and purchase event ownership end to end.
- [ ] **P0** Never send email, phone, VIN, license plate, full address, card data, or free-text diagnostic notes in analytics parameters or page URLs.
- [ ] **P1** Add events for vehicle search submitted, no-match, fitment-needs-review, fitment question, and guide opened; keep event names and allowed values documented.
- [ ] **P1** Compare GA4 purchase totals to processor and order-system totals daily for the first week; investigate differences and duplicates.

## 5. Go-live cutover plan

**Exit criterion:** A named owner approves a tested release, payment is available, legacy URLs preserve access, and the team can restore the previous storefront without losing orders.

### T−14 to T−7 days: prepare

- [ ] **P0** Name a launch lead and owners for engineering, catalog/fitment, payments, fulfillment, SEO, analytics, and customer support. Set a shared issue log and P0/P1 triage channel.
- [ ] **P0** Freeze the URL map and inventory of current pages; capture baseline organic landing pages, rankings/queries, conversion funnel, revenue, and 404 rate.
- [ ] **P0** Complete payment-provider production configuration, live keys, Apple Pay domain verification if offered, PayPal live credentials if offered, and webhook endpoints.
- [ ] **P0** Finalize product photos, approved technical claims, support contact, shipping/return/warranty policies, tax and shipping configuration, and Merchant feed.
- [ ] **P0** Take a restorable backup of the existing site, configuration, redirect rules, catalog, and order database; rehearse restore in a nonproduction environment.
- [ ] **P0** Set up monitoring for uptime, 5xx responses, checkout/payment failures, webhook failures, order creation, and significant 404s.
- [ ] **P1** Lower DNS TTL if a DNS change is planned; document registrar/CDN/hosting access and rollback owner. Keep existing mail DNS records intact.

### T−3 to T−1 days: release candidate and signoff

- [ ] **P0** Build the exact release candidate and run the full P0 matrix in staging with production-like catalog and checkout configuration.
- [ ] **P0** Run an end-to-end test order for each offered payment method; reconcile payment, order, fulfillment, confirmation, analytics, and refund.
- [ ] **P0** Crawl all old→new URL mappings and inspect raw HTML, metadata, canonical, product structured data, sitemap, and `robots.txt`.
- [ ] **P0** Run real-device mobile checks in daylight and a slow-network pass; record screenshots/video for homepage, product, fitment, cart, and checkout.
- [ ] **P0** Confirm no active build points to sandbox payment keys, staging API hosts, or a noindex production page.
- [ ] **P0** Approve rollback trigger thresholds, who can call rollback, and how new orders are preserved if rollback occurs.
- [ ] **P0** Obtain written signoff from product/engineering, payments/finance, fulfillment, support, SEO/analytics, and launch lead. Any open P0 means **no go**.

### T0: deployment and smoke test

- [ ] **P0** Put the catalog in a short change freeze; record the final price, SKU, inventory, and redirect snapshot.
- [ ] **P0** Deploy the new static assets/configuration atomically; update DNS/CDN/hosting routes and 301s; purge only the required caches.
- [ ] **P0** Verify TLS, chosen canonical host, homepage, product page, media, asset hashes, `robots.txt`, sitemap, and top redirects from an external network.
- [ ] **P0** Complete one low-value live transaction per offered payment method where practical, then refund it through the normal workflow. Confirm no duplicate charge/order and correct email/tracking behavior.
- [ ] **P0** Verify live shipping and tax totals for representative ZIP codes, support phone/email links, Merchant landing page fetch, Search Console URL inspection, and GA4 DebugView/Realtime events.
- [ ] **P0** Watch 5xx, payment/webhook failures, order queue, and customer support messages continuously through the initial launch window.

### T+1 to T+30: stabilize

- [ ] **P0** Reconcile daily paid orders against processor captures, fulfillment records, inventory, and GA4 purchase events for the first week.
- [ ] **P0** Review 404s, redirect misses, Search Console indexing, product rich-result warnings, and Merchant Center disapprovals daily; fix high-impact failures first.
- [ ] **P1** Compare mobile conversion, fitment no-match rate, cart abandonment, checkout failure rate, page speed, and support inquiries against the baseline.
- [ ] **P1** Keep the old site backup and rollback procedure available until the new flow is stable; keep 301s in place long term.
- [ ] **P1** Conduct a 7-day and 30-day review of conversion, search traffic, product data quality, returns caused by fitment errors, and customer feedback.

### Rollback triggers and procedure

- [ ] **P0** Trigger rollback for failed live payments, duplicate captures/orders, wrong prices, incorrect fitment confirmation, broken order fulfillment, widespread 5xx, or high-volume old URLs returning 404.
- [ ] **P0** Pause new checkout if payment/order integrity is uncertain; preserve and reconcile all orders placed since cutover before switching traffic.
- [ ] **P0** Restore prior hosting/routing from the rehearsed backup, retain the new order ledger, and verify the old payment flow with a fresh transaction.
- [ ] **P0** Notify support/fulfillment of affected order IDs and customer communication plan; document incident timeline and root cause before a second launch attempt.

## Go / no-go record

| Signoff | Owner | Date | Evidence link | Decision |
| --- | --- | --- | --- | --- |
| Product and fitment |  |  |  |  |
| Checkout and payments |  |  |  |  |
| Shipping and fulfillment |  |  |  |  |
| Mobile and accessibility |  |  |  |  |
| SEO, Merchant Center, analytics |  |  |  |  |
| Launch lead |  |  |  |  |

**Go condition:** Every P0 item is passed or has an explicit, documented exception accepted by the launch lead and the responsible business owner. A pending checkout, false fitment claim, missing actual product image, or inaccurate price is not a minor exception.
