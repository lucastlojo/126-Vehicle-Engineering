import React, { useEffect, useId, useRef, useState } from 'react';
import { ABOUT_PATH, CUSTOMER_SERVICE_PHONE, EBAY_STORE_URL, LEGACY_CATALOG_URL, MOBILE_PHONE, PRODUCT_PATH, RENTAL_URL, SUPPORT_EMAIL, currency, ramKit, sitePath } from './data.js';
import { AlertIcon, ArrowIcon, CartIcon, CheckIcon, CloseIcon, MenuIcon, SearchIcon, ShieldIcon, WrenchIcon } from './icons.jsx';

const modelsByMake = { Ram: ['1500 eTorque 5.7L'], Tesla: ['Model S'], BMW: ['E34'], Audi: ['A4'], Toyota: ['Tacoma', 'Tundra'] };
const years = Array.from({ length: 38 }, (_, i) => 2026 - i);
const mail = (subject) => `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(subject)}`;
const nextPaint = () => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));

function TechIcon({ type = 'target' }) {
  const paths = {
    target: <><circle cx="12" cy="12" r="7" /><circle cx="12" cy="12" r="2" /><path d="M12 2v3m0 14v3M2 12h3m14 0h3" /></>,
    layers: <><path d="m12 3 10 5-10 5L2 8l10-5Zm-9 9 9 5 9-5M3 17l9 5 9-5" /></>,
    book: <><path d="M12 5c-3-2-6-2-10-1v15c4-1 7-1 10 1 3-2 6-2 10-1V4c-4-1-7-1-10 1v15" /></>,
    pin: <><path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z" /><circle cx="12" cy="10" r="2" /></>,
    chat: <><path d="M21 11a9 9 0 0 1-9 9c-2 0-3-.4-4-1l-5 2 1-5a9 9 0 1 1 17-5Z" /><path d="M8 11h8m-8 4h5" /></>,
    expand: <><path d="M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5" /></>,
  };
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[type] || paths.target}</svg>;
}
function Spinner() { return <span className="spinner" aria-hidden="true" />; }
function Brand() {
  return <a className="brand" href={sitePath()} aria-label="126 Vehicle Engineering home"><span className="brand__mark">126<span>.</span></span><span className="brand__name">VEHICLE<br />ENGINEERING</span></a>;
}
function ButtonLink({ href, children, secondary = false, className = '' }) {
  return <a className={`ve-button ${secondary ? 've-button--secondary' : 've-button--cart'} ${className}`} href={href}>{children}<ArrowIcon /></a>;
}
function SectionTitle({ label, title, children, link, href }) {
  return <div className="section-heading"><div><span className="eyebrow">{label}</span><h2>{title}</h2>{children && <p>{children}</p>}</div>{link && <a href={href} className="text-link">{link}<ArrowIcon /></a>}</div>;
}
function SiteHeader({ cartCount, onCartOpen }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const header = useRef(null);
  useEffect(() => {
    const close = (event) => {
      if (event.type === 'keydown' && event.key !== 'Escape') return;
      if (event.type === 'pointerdown' && header.current?.contains(event.target)) return;
      header.current?.querySelectorAll('details[open]').forEach((el) => { el.open = false; });
      setMenuOpen(false);
    };
    document.addEventListener('pointerdown', close); document.addEventListener('keydown', close);
    return () => { document.removeEventListener('pointerdown', close); document.removeEventListener('keydown', close); };
  }, []);
  return <>
    <div className="utility-bar"><div className="container"><span><span className="status-dot" />Independent thinking. Practical repairs.</span><a href={ABOUT_PATH}>Rochester, New York<ArrowIcon diagonal /></a></div></div>
    <header className="site-header" ref={header}><div className="container site-header__inner"><Brand />
      <nav className="desktop-nav" aria-label="Primary navigation">
        <details className="nav-dropdown"><summary>Shop by vehicle</summary><div className="nav-dropdown__panel"><span className="eyebrow">Find your platform</span><a href={PRODUCT_PATH}>Ram 1500 eTorque<ArrowIcon /></a><a href={LEGACY_CATALOG_URL}>Tesla, BMW, Audi & Toyota<ArrowIcon /></a><a href={sitePath('#find-fix')}>Vehicle finder<ArrowIcon /></a></div></details>
        <details className="nav-dropdown"><summary>Shop by problem</summary><div className="nav-dropdown__panel"><span className="eyebrow">Find your repair</span><a href={PRODUCT_PATH}>Ram MGU bearings & resolver<ArrowIcon /></a><a href={LEGACY_CATALOG_URL}>Tesla Model S suspension<ArrowIcon /></a><a href={EBAY_STORE_URL}>Tesla climate components<ArrowIcon /></a></div></details>
        <a href={sitePath('#guides')}>Repair resources</a><a href={ABOUT_PATH}>Our approach</a>
      </nav>
      <div className="site-header__actions"><a className="header-support" href={mail('Parts and fitment help')}>Get help<ArrowIcon diagonal /></a><button className="header-cart" onClick={onCartOpen} aria-label={`Open cart, ${cartCount} items`}><CartIcon /><span>{cartCount}</span></button><button className="menu-toggle" aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen} aria-controls="mobile-navigation" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <CloseIcon /> : <MenuIcon />}</button></div>
    </div>{menuOpen && <nav id="mobile-navigation" className="mobile-nav" aria-label="Mobile navigation" onClick={(event) => { if (event.target.closest('a')) setMenuOpen(false); }}><span className="eyebrow">Find your next repair</span><a href={PRODUCT_PATH}>Ram eTorque rebuild kit<ArrowIcon /></a><a href={LEGACY_CATALOG_URL}>Full parts catalog<ArrowIcon /></a><a href={EBAY_STORE_URL}>Tesla climate components<ArrowIcon /></a><a href={sitePath('#guides')}>Repair resources<ArrowIcon /></a><a href={ABOUT_PATH}>Our approach<ArrowIcon /></a><a href={mail('Parts and fitment help')}>Talk to 126<ArrowIcon /></a></nav>}</header>
  </>;
}
function SiteFooter() {
  return <footer className="site-footer"><div className="container footer-grid">
    <div className="footer-brand"><Brand /><p>Practical engineering.<br />More possibilities for repair.</p><a className="location-link" href={ABOUT_PATH}><TechIcon type="pin" />Rochester, New York</a></div>
    <div className="footer-links"><h2>Explore</h2><a href={PRODUCT_PATH}>Ram eTorque kit</a><a href={LEGACY_CATALOG_URL}>Parts catalog</a><a href={EBAY_STORE_URL}>Our eBay store</a><a href={ABOUT_PATH}>About 126</a></div>
    <div className="footer-links"><h2>Repair support</h2><a href={`${PRODUCT_PATH}#installation`}>Repair overview</a><a href={`${PRODUCT_PATH}#details`}>Technical specifications</a><a href={`${PRODUCT_PATH}#fitment`}>Check your vehicle</a><a href={mail('Warranty and order question')}>Warranty & order questions</a></div>
    <div className="footer-links"><h2>Talk to a real person</h2><a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a><a href={`tel:${CUSTOMER_SERVICE_PHONE}`}>845 532 3106 <span>Support</span></a><a href={`tel:${MOBILE_PHONE}`}>585 509 2950 <span>Mobile</span></a><p>Send your year, model, and unit number. We’ll help with the next step.</p></div>
  </div><div className="container footer-bottom"><span>© {new Date().getFullYear()} 126 Vehicle Engineering</span><span>126 Vehicle Operation LLC <span aria-hidden="true">/</span> Rochester, NY</span></div></footer>;
}
function VehicleFitmentSearch({ compact = false, onResult, onEdit }) {
  const formId = useId();
  const [vehicle, setVehicle] = useState({ year: '', make: '', model: '', partNumber: '' });
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    if (!compact) return;
    const params = new URLSearchParams(window.location.search);
    const year = params.get('year') || '', make = params.get('make') || '', model = params.get('model') || '';
    if (years.includes(Number(year)) && modelsByMake[make]?.includes(model)) setVehicle({ year, make, model, partNumber: '' });
  }, [compact]);
  useEffect(() => { const reset = () => setBusy(false); window.addEventListener('pageshow', reset); return () => window.removeEventListener('pageshow', reset); }, []);
  function update(field, value) {
    setVehicle((old) => ({ ...old, [field]: value, ...(field === 'make' ? { model: '' } : {}) })); setMessage(''); onEdit?.();
  }
  async function submit(event) {
    event.preventDefault(); if (busy) return; setBusy(true); await nextPaint();
    const match = vehicle.make === ramKit.make && vehicle.model === ramKit.model && ramKit.years.includes(Number(vehicle.year));
    if (onResult) { onResult({ ...vehicle, partNumber: vehicle.partNumber.trim().toUpperCase(), match }); setBusy(false); }
    else if (match) { const search = new URLSearchParams({ year: vehicle.year, make: vehicle.make, model: vehicle.model }); window.location.assign(`${PRODUCT_PATH}?${search}#fitment`); }
    else { setMessage(vehicle.make === 'Ram' ? 'This kit is listed for 2019–2024 Ram 1500 5.7L eTorque. Contact us to check a different vehicle.' : 'Explore the current catalog for this vehicle. Match the year, configuration, and part number before ordering.'); setBusy(false); }
  }
  return <form className={`fitment-search${compact ? ' fitment-search--compact' : ''}`} onSubmit={submit} aria-label="Vehicle fitment search"><div className="fitment-search__fields">
    <label><span id={`${formId}-year`}>Year</span><select aria-labelledby={`${formId}-year`} className="ve-field" value={vehicle.year} onChange={(e) => update('year', e.target.value)} required><option value="">Select year</option>{years.map((y) => <option key={y} value={y}>{y}</option>)}</select></label>
    <label><span id={`${formId}-make`}>Make</span><select aria-labelledby={`${formId}-make`} className="ve-field" value={vehicle.make} onChange={(e) => update('make', e.target.value)} required><option value="">Select make</option>{Object.keys(modelsByMake).map((make) => <option key={make}>{make}</option>)}</select></label>
    <label><span id={`${formId}-model`}>Model / engine</span><select aria-labelledby={`${formId}-model`} className="ve-field" value={vehicle.model} onChange={(e) => update('model', e.target.value)} disabled={!vehicle.make} required><option value="">Select model</option>{(modelsByMake[vehicle.make] || []).map((model) => <option key={model}>{model}</option>)}</select></label>
    {compact && <label className="fitment-search__part"><span>Unit number <em>optional</em></span><input className="ve-field mono" placeholder="68623194AC" autoComplete="off" value={vehicle.partNumber} onChange={(e) => update('partNumber', e.target.value)} /></label>}
    <button className="ve-button ve-button--cart fitment-search__submit" type="submit" disabled={busy} aria-busy={busy}>{busy ? <Spinner /> : <SearchIcon />}{busy ? 'Checking…' : compact ? 'Check fitment' : 'Find your fix'}</button>
  </div>{message && <div className="fitment-search__message" role="status"><AlertIcon /><p>{message} <a href={vehicle.make === 'Ram' ? mail('Vehicle fitment question') : LEGACY_CATALOG_URL}>{vehicle.make === 'Ram' ? 'Ask a fitment question' : 'Open parts catalog'}<ArrowIcon /></a></p></div>}</form>;
}


function Comparison() {
  return <div className="comparison-wrap"><table className="comparison-table"><caption className="sr-only">Repair conditions and the scope of the 126 MGU kit</caption><thead><tr><th scope="col">The condition</th><th scope="col">Assembly replacement</th><th scope="col"><span className="mini-brand">126.</span> Focused repair</th></tr></thead><tbody>
    <tr><th scope="row">Diagnosed bearing failure</th><td>Replace the complete MGU</td><td><CheckIcon />Replace the worn bearings in a serviceable unit</td></tr>
    <tr><th scope="row">Diagnosed resolver failure</th><td>Replace the complete MGU</td><td><CheckIcon />Replace the resolver after inspection</td></tr>
    <tr><th scope="row">Stator or inverter damage</th><td>Assess the assembly for replacement</td><td><AlertIcon />Requires a different repair; this kit does not cover it</td></tr>
    <tr><th scope="row">Before you decide</th><td>Confirm the replacement assembly number</td><td><CheckIcon />Confirm vehicle, unit number, and bearing dimensions</td></tr>
  </tbody></table><p className="small-note">A component repair depends on the condition of the original unit. Diagnosis and inspection come first.</p></div>;
}
function RepairResources() {
  const guides = [
    { number: '01', title: 'Is your MGU a rebuild candidate?', body: 'Understand the repair scope and the damage this kit does not address.', href: `${PRODUCT_PATH}#repair-scope`, tag: 'Repair scope' },
    { number: '02', title: 'Check the details before you order.', body: 'Compare the vehicle, reference unit, and bearing dimensions.', href: `${PRODUCT_PATH}#details`, tag: 'Fitment checklist' },
    { number: '03', title: 'Know the work ahead.', body: 'From diagnosis to post-repair checks: a four-stage job overview.', href: `${PRODUCT_PATH}#installation`, tag: 'Installation overview' },
  ];
  return <section className="section" id="guides"><div className="container"><SectionTitle label="The repair library" title="A little clarity goes a long way." /><div className="guides-grid">{guides.map((g) => <a className="guide-card interactive-card" href={g.href} key={g.number}><div className="guide-card__top"><TechIcon type="book" /><span>{g.number}</span></div><span className="eyebrow">{g.tag}</span><h3>{g.title}</h3><p>{g.body}</p><span className="text-link">Read the overview<ArrowIcon /></span></a>)}</div></div></section>;
}
function HomePage() {
  return <main id="main-content">
    <section className="hero" aria-labelledby="home-title"><div className="hero-grid" aria-hidden="true" /><div className="container hero__grid">
      <div className="hero__copy"><span className="eyebrow"><span className="accent-line" />Purposeful parts. Practical engineering.</span><h1 id="home-title">Small part.<br /><span>Big comeback.</span></h1><p>Focused repair kits for the failures that stop you in your tracks. Keep what works. Repair what doesn’t. Get back to what matters.</p><div className="hero__actions"><ButtonLink href="#find-fix">Find your fix</ButtonLink><a className="text-link" href={PRODUCT_PATH}>Explore the eTorque kit<ArrowIcon /></a></div><div className="hero__footnote"><TechIcon type="pin" /><span>Based in Rochester, New York</span><span className="hero__footnote-line" /><span>Built around the repair</span></div></div>
      <div className="hero__visual"><div className="hero__orbit" aria-hidden="true" /><div className="hero__art-label"><span className="status-dot" />Component-level thinking</div><img src={sitePath('media/mgu-exploded.svg')} width="800" height="640" alt="Exploded concept illustration of a resolver and two bearings; not a product photograph" fetchPriority="high" /><div className="floating-spec"><span className="floating-spec__icon"><TechIcon /></span><div><span className="eyebrow">Targeted repair</span><strong>Resolver + bearings</strong><span className="mono">RAM 1500 / 5.7L eTORQUE</span></div><CheckIcon /></div><span className="art-caption">MGU COMPONENT STUDY<span>CONCEPT ILLUSTRATION / 01</span></span></div>
    </div><div className="container"><div className="search-dock" id="find-fix"><div className="search-dock__heading"><span><SearchIcon /><strong>Find your vehicle. Find your fix.</strong></span><p>Start with year, make, and model.</p></div><VehicleFitmentSearch /><div className="search-dock__note"><ShieldIcon />Vehicle match first. Unit and repair checks before ordering.<a href={mail('Help identifying a part')}>Need a hand?<ArrowIcon /></a></div></div></div></section>
    <div className="platforms container"><span className="eyebrow">Solutions for selected models</span><div>{['RAM', 'TESLA', 'BMW', 'AUDI', 'TOYOTA'].map((brand) => <a href={brand === 'RAM' ? PRODUCT_PATH : LEGACY_CATALOG_URL} key={brand}>{brand}</a>)}</div></div>
    <section className="section" id="approach"><div className="container"><SectionTitle label="A more considered repair" title={<>The right part.<br />A clear path forward.</>} link="Meet 126" href={ABOUT_PATH}>An entire assembly isn’t always the only answer. Start by understanding the component that failed.</SectionTitle><div className="value-grid">
      <a className="value-card interactive-card" href={`${PRODUCT_PATH}#repair-scope`}><span className="card-icon"><TechIcon /></span><span className="card-index">01 / DIAGNOSE</span><h3>Get to the failure point.</h3><p>Know what the kit addresses, what it doesn’t, and when another repair is needed.</p><ArrowIcon diagonal /></a>
      <a className="value-card interactive-card" href={`${PRODUCT_PATH}#fitment`}><span className="card-icon"><ShieldIcon /></span><span className="card-index">02 / VERIFY</span><h3>Confidence starts with fit.</h3><p>Check your vehicle and unit number. Get help with the details before you order.</p><ArrowIcon diagonal /></a>
      <a className="value-card interactive-card" href={`${PRODUCT_PATH}#installation`}><span className="card-icon"><WrenchIcon /></span><span className="card-index">03 / REPAIR</span><h3>Keep the serviceable parts.</h3><p>A focused rebuild can preserve the usable assembly. Give your next repair a closer look.</p><ArrowIcon diagonal /></a>
    </div></div></section>
    <section className="section section--feature"><div className="container featured-kit"><a className="featured-kit__art" href={PRODUCT_PATH} aria-label="Explore the Ram eTorque kit"><div className="media-overline"><span className="eyebrow">The featured fix</span><span className="mono">126 / MGU</span></div><img src={sitePath('media/mgu-exploded.svg')} alt="Concept illustration of the resolver and bearings covered by the rebuild kit" width="800" height="640" loading="lazy" /><div className="media-caption"><span>Resolver + bearing rebuild</span><span>Concept illustration</span></div></a><div className="featured-kit__copy"><span className="eyebrow">2019–2024 · RAM 1500 · 5.7L</span><h2>Your truck has work to do.<br /><span>Give it a repair path.</span></h2><p>The eTorque MGU rebuild kit targets diagnosed resolver and bearing failures in an otherwise serviceable unit.</p><ul className="check-list"><li><CheckIcon />Resolver and bearings for the targeted rebuild</li><li><CheckIcon />Reference unit 68623194AC</li><li><CheckIcon />Direct help with fitment questions</li></ul><div className="featured-kit__action"><div><span className="label-muted">Kit price</span><strong>{currency(ramKit.price)}<small> USD</small></strong></div><ButtonLink href={PRODUCT_PATH}>Explore the kit</ButtonLink></div><p className="small-note">Inspect the stator and inverter first. This kit does not repair every MGU fault.</p></div></div></section>
    <section className="section" id="problem"><div className="container"><SectionTitle label="Repair with the full picture" title={<>One failed component.<br />More than one way forward.</>}>Compare the repair scope before committing to a complete replacement.</SectionTitle><Comparison /></div></section>
    <section className="section section--trust"><div className="container"><SectionTitle label="From people doing the work" title="Real repairs. Real feedback." link="Read feedback on eBay" href={EBAY_STORE_URL} /><div className="reviews-grid"><figure className="review-card"><div className="review-card__label"><CheckIcon />Verified purchase · eBay</div><blockquote>“Glad I repaired the one I had.”</blockquote><figcaption><span className="review-avatar">i</span><div><strong>i***i</strong><span>eBay buyer feedback excerpt</span></div></figcaption></figure><figure className="review-card"><div className="review-card__label"><CheckIcon />Verified purchase · eBay</div><blockquote>“very professional, knowledgeable, and helpful.”</blockquote><figcaption><span className="review-avatar">v</span><div><strong>v***a</strong><span>eBay buyer feedback excerpt</span></div></figcaption></figure><article className="support-card" id="for-shops"><TechIcon type="chat" /><h3>There’s a real person behind your repair.</h3><p>Owner or independent shop, send us the details. Start with the vehicle, symptoms, and part number.</p><a href={mail('Parts and fitment support')} className="text-link">Talk to 126<ArrowIcon /></a></article></div><p className="small-note">Excerpts from the company’s eBay feedback, reviewed September 2026. Individual purchase experiences; results depend on the repair.</p></div></section>
    <RepairResources />
    <section className="section section--faq"><div className="container faq-grid"><div><span className="eyebrow">Before you turn a wrench</span><h2>Good questions.<br />Straight answers.</h2><a className="text-link" href={mail('Question before ordering')}>Ask us about your part<ArrowIcon /></a></div><div>{[
      ['Does a matching vehicle mean the kit will fix my MGU?', 'A vehicle match is the first check. Confirm the unit number, bearing dimensions, and the diagnosed fault. Stator or inverter damage requires a different repair.'],
      ['Can my mechanic install the kit?', 'Share the product details and repair overview with your mechanic. They can assess the unit, tools, and applicable service procedures before accepting the job.'],
      ['Do you supply parts for other vehicles?', 'Yes. Our current catalog includes Tesla Model S suspension components and selected Audi, BMW, and Toyota exterior parts. Our eBay store also lists Tesla climate components.'],
    ].map(([q,a]) => <details key={q}><summary>{q}<span aria-hidden="true">+</span></summary><p>{a}</p></details>)}</div></div></section><ClosingCTA />
  </main>;
}
function ClosingCTA() { return <section className="closing-cta"><div className="container"><span className="eyebrow">The next step is a better question</span><h2>What actually<br /><span>needs replacing?</span></h2><p>Find the failure. Check the fit. Get a plan for the repair.</p><ButtonLink href={sitePath('#find-fix')}>Find your fix</ButtonLink><span className="closing-cta__watermark" aria-hidden="true">126.</span></div></section>; }


function Modal({ open, onClose, className = '', label, children }) {
  const ref = useRef(null);
  useEffect(() => {
    const dialog = ref.current;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
    if (!open) return;
    const previous = document.body.style.overflow; document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previous; };
  }, [open]);
  return <dialog ref={ref} className={className} aria-label={label} onCancel={onClose} onClose={onClose} onClick={(event) => { if (event.target === ref.current) onClose(); }}>{children}</dialog>;
}
function ProductGallery() {
  const [selected, setSelected] = useState(0), [zoom, setZoom] = useState(false);
  const item = ramKit.media[selected];
  return <div className="product-gallery" aria-label="Product media gallery">
    <div className="product-gallery__stage"><div className="media-overline"><span className="eyebrow">Component study</span><span className="mono">0{selected + 1} / 0{ramKit.media.length}</span></div><img key={item.src} src={item.src} alt={item.alt} width="800" height="640" /><button className="gallery-zoom icon-button" aria-label="Enlarge technical illustration" onClick={() => setZoom(true)}><TechIcon type="expand" /></button><span className="gallery-caption">Concept illustration · not a product photograph</span></div>
    <div className="product-gallery__thumbs" role="group" aria-label="Choose product media">{ramKit.media.map((media, index) => <button key={media.src} aria-label={`Show ${media.label}`} aria-current={selected === index ? 'true' : undefined} onClick={() => setSelected(index)}><img src={media.src} alt="" width="100" height="80" /><span>{media.label}</span></button>)}</div>
    <div className="gallery-context"><TechIcon type="layers" /><span>Component concept, unit check, and repair sequence.</span></div>
    <Modal open={zoom} onClose={() => setZoom(false)} className="gallery-dialog" label="Enlarged technical illustration"><button className="icon-button" onClick={() => setZoom(false)} aria-label="Close enlarged image" autoFocus><CloseIcon /></button><img src={item.src} alt={item.alt} width="800" height="640" /><p>{item.label} · Concept illustration, not a product photograph</p></Modal>
  </div>;
}
const initialFitment = { type: 'review', label: 'Check your vehicle', text: 'Match the vehicle first, then verify the unit and its condition.' };
function ProductPage({ onAdd, inCart, cartPending }) {
  const [fitment, setFitment] = useState(initialFitment);
  function handleFitment(result) {
    if (!result.match) setFitment({ type: 'unconfirmed', label: 'Vehicle match not confirmed', text: 'This kit is listed for 2019–2024 Ram 1500 5.7L eTorque. Contact us before ordering for another vehicle.' });
    else if (result.partNumber && result.partNumber !== ramKit.referenceNumber) setFitment({ type: 'review', label: 'Unit number needs review', text: `Your ${result.year} vehicle matches the listed range, but unit ${result.partNumber} needs a manual fitment check. Contact us before ordering.` });
    else setFitment({ type: 'confirmed', label: result.partNumber ? 'Vehicle + unit number match' : 'Vehicle match confirmed', text: `${result.year} Ram 1500 5.7L eTorque${result.partNumber ? ' · ' + result.partNumber : ''}. ${result.partNumber ? 'Inspect bearing dimensions, stator, and inverter before ordering.' : 'Next: verify the unit number, bearing dimensions, and actual fault.'}` });
  }
  const buttonLabel = cartPending ? 'Adding…' : inCart ? 'View cart' : 'Add to cart';
  return <main id="main-content" className="product-page"><div className="container">
    <nav className="breadcrumbs" aria-label="Breadcrumb"><a href={sitePath()}>Home</a><span>/</span><a href={sitePath('#find-fix')}>Ram 1500</a><span>/</span><span aria-current="page">eTorque MGU kit</span></nav>
    <div className="product-heading"><span className="eyebrow"><span className="accent-line" />Targeted repair / 2019–2024</span><h1>Ram 1500 eTorque<br /><span>MGU rebuild kit.</span></h1><p>Resolver and bearing repair for a serviceable 5.7L eTorque motor-generator unit.</p></div>
    <div className="product-layout"><div className="product-layout__main"><ProductGallery /><div className="product-quick-specs"><div><span>Platform</span><strong>RAM 1500 5.7L</strong></div><div><span>System</span><strong>48V eTORQUE</strong></div><div><span>Reference unit</span><strong>{ramKit.referenceNumber}</strong></div></div></div>
      <aside className="purchase-column" aria-label="Product purchase details"><div className="purchase-card"><div className="purchase-card__top"><span className="eyebrow">The focused rebuild</span><div className="price-line"><p className="purchase-card__price">{currency(ramKit.price)}<small> USD</small></p><span className="price-label">KIT PRICE</span></div><p className="purchase-card__price-note">Shipping and final total confirmed before payment.</p></div>
        <div className="purchase-card__fitment" id="fitment"><div className="purchase-card__fitment-title"><ShieldIcon /><h2>Start with the fit.</h2></div><VehicleFitmentSearch compact onResult={handleFitment} onEdit={() => setFitment(initialFitment)} /><div className={`fitment-result fitment-result--${fitment.type}`} role="status"><span className={`ve-fitment-badge ve-fitment-badge--${fitment.type}`}>{fitment.type === 'confirmed' ? <CheckIcon /> : <AlertIcon />}{fitment.label}</span><p>{fitment.text}</p></div></div>
        <button className="ve-button ve-button--cart purchase-card__add" disabled={cartPending} aria-busy={cartPending} onClick={onAdd}>{cartPending ? <Spinner /> : <CartIcon />}{buttonLabel}<ArrowIcon /></button><p className="purchase-card__help">Not sure? <a href={mail('Ram eTorque MGU fitment question')}>Check with us first.</a></p><div className="purchase-card__trust"><span><ShieldIcon />Clear repair limits</span><span><TechIcon type="chat" />Direct support</span></div>
      </div></aside>
    </div>
    <nav className="product-anchor-nav" aria-label="Product details"><a href="#repair-scope">Repair scope</a><a href="#contents">What’s included</a><a href="#installation">Repair overview</a><a href="#details">Specifications</a></nav>
    <section className="section product-details" id="repair-scope"><SectionTitle label="Know the repair" title="Preserve what still works.">This kit addresses specific component failures. Diagnose the fault and inspect the rest of the MGU before deciding to rebuild.</SectionTitle><div className="scope-grid"><article className="scope-card scope-card--yes"><span className="card-icon"><CheckIcon /></span><h3>A rebuild may be suitable for</h3><ul><li>Diagnosed resolver failure</li><li>Diagnosed bearing failure</li><li>An otherwise serviceable MGU</li></ul></article><article className="scope-card scope-card--no"><span className="card-icon"><AlertIcon /></span><h3>A different repair is needed for</h3><ul><li>Damaged stator windings</li><li>Damaged inverter or controller electronics</li><li>Faults outside the kit’s components</li></ul></article></div><Comparison /></section>
    <section className="section details-split" id="contents"><div><span className="eyebrow">What’s included</span><h2>Parts with<br />a purpose.</h2><p>The resolver and bearings cover the targeted rebuild. Confirm the current kit revision and bearing dimensions for your unit.</p></div><div className="contents-list"><div><span className="mono">01</span><div><h3>Resolver component</h3><p>For a diagnosed resolver fault in the listed MGU.</p></div><TechIcon /></div><div><span className="mono">02</span><div><h3>Bearing pair</h3><p>Match the bearing dimensions before ordering.</p></div><TechIcon type="layers" /></div></div></section>
    <section className="section" id="installation"><SectionTitle label="The repair overview" title="A plan from start to finish.">Review the work with your mechanic. This is an overview; use the applicable manufacturer service procedure and kit instructions for the job.</SectionTitle><ol className="installation-list">{[
      ['Confirm the fault.', 'Diagnose the MGU using the applicable vehicle service procedure. A noise or warning alone does not establish the cause.'],
      ['Inspect the unit.', 'Match the unit number and bearing dimensions. Check the stator and inverter for damage outside this kit’s scope.'],
      ['Rebuild the serviceable assembly.', 'Replace the covered components using the correct tools, service procedure, and instructions supplied with the kit.'],
      ['Verify before returning to service.', 'Complete the required electrical and mechanical checks before putting the vehicle back on the road.'],
    ].map(([title,body],i) => <li key={title}><span className="step-number">0{i+1}</span><h3>{title}</h3><p>{body}</p></li>)}</ol><div className="safety-note"><ShieldIcon /><p><strong>48-volt system.</strong> Follow the manufacturer’s service and electrical safety procedures. Use a qualified repair professional if you are unsure.</p></div></section>
    <section className="section details-split" id="details"><div><span className="eyebrow">Technical data</span><h2>The details<br />that decide the fit.</h2><p>A vehicle match narrows the search. Confirm the specific unit and repair conditions before ordering.</p><a className="text-link" href={mail('MGU unit identification help')}>Get help identifying your unit<ArrowIcon /></a></div><dl className="spec-table">{[['Vehicle', 'Ram 1500'], ['Engine / system', '5.7L / 48V eTorque'], ['Listed model years', '2019–2024'], ['Reference unit', ramKit.referenceNumber], ['Repair components', 'Resolver + bearings'], ['Required checks', 'Unit revision, bearing size, damage inspection']].map(([term,value]) => <div key={term}><dt>{term}</dt><dd>{value}</dd></div>)}</dl></section>
    <section className="product-help"><div><TechIcon type="chat" /><div><h2>One detail doesn’t match?</h2><p>Send the year, unit number, symptoms, and photos. Let’s check it.</p></div></div><ButtonLink href={mail('Ram eTorque MGU fitment question')} secondary>Ask a fitment question</ButtonLink></section>
  </div><div className="mobile-purchase-bar"><div><span>Ram eTorque MGU kit</span><strong>{currency(ramKit.price)}<small> USD</small></strong></div><button className="ve-button ve-button--cart" disabled={cartPending} aria-busy={cartPending} onClick={onAdd}>{cartPending ? <Spinner /> : <CartIcon />}{buttonLabel}</button></div></main>;
}


function AboutPage() {
  return <main id="main-content" className="about-page"><div className="container"><nav className="breadcrumbs" aria-label="Breadcrumb"><a href={sitePath()}>Home</a><span>/</span><span aria-current="page">Our approach</span></nav></div>
    <section className="about-page__hero"><div className="container"><span className="eyebrow"><span className="accent-line" />Rochester, New York</span><h1>Good engineering<br />looks a little <span>closer.</span></h1><p>126 Vehicle Engineering is the storefront of Rochester-based 126 Vehicle Operation LLC. We help owners and independent shops find practical parts for the repair in front of them.</p></div></section>
    <section className="section"><div className="container details-split"><div><span className="eyebrow">Our approach</span><h2>Start with the failure.<br />Understand the limits.</h2></div><div className="prose"><p>The Ram 1500 eTorque MGU rebuild kit shows what that means. When testing points to a resolver or bearing fault and the unit is otherwise serviceable, a focused rebuild may be an option.</p><p>Stator or inverter damage calls for a different repair. We put those limits up front so you can make an informed decision with your mechanic.</p><a className="text-link" href={PRODUCT_PATH}>Explore the Ram rebuild kit<ArrowIcon /></a></div></div></section>
    <section className="section section--trust"><div className="container"><SectionTitle label="Beyond one repair" title="A focused kit. A wider catalog." /><div className="value-grid"><article className="value-card"><span className="card-icon"><TechIcon /></span><h3>Ram eTorque repair</h3><p>A resolver-and-bearing kit for listed 2019–2024 Ram 1500 5.7L eTorque units that pass inspection.</p><a className="text-link" href={PRODUCT_PATH}>Check the kit<ArrowIcon /></a></article><article className="value-card"><span className="card-icon"><TechIcon type="layers" /></span><h3>Specialty components</h3><p>Tesla Model S suspension, Model 3/Y climate parts, and selected Audi, BMW, and Toyota exterior components.</p><a className="text-link" href={LEGACY_CATALOG_URL}>Browse the catalog<ArrowIcon /></a><a className="text-link" href={EBAY_STORE_URL}>View eBay listings<ArrowIcon /></a></article><article className="value-card"><span className="card-icon"><WrenchIcon /></span><h3>Rochester services</h3><p>Our current site advertises ICE and EV/Tesla repair, specialty parts supply, and classic Mercedes rentals. Contact us for availability.</p><a className="text-link" href={RENTAL_URL}>Rental details<ArrowIcon /></a></article></div></div></section>
    <section className="section"><div className="container details-split"><div><span className="eyebrow">A real conversation</span><h2>Bring us the details.</h2><p>The vehicle. The unit number. The symptom. Give us a clear starting point and we can help with the next step.</p></div><div className="contact-card"><TechIcon type="pin" /><h3>126 Vehicle Engineering</h3><p>Warehouse listed on our current site:<br />920 Exchange St<br />Rochester, NY 14608</p><p className="small-note">Contact us before visiting.</p><a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a><a href={`tel:${CUSTOMER_SERVICE_PHONE}`}>845 532 3106 · Customer service</a><a href={`tel:${MOBILE_PHONE}`}>585 509 2950 · Mobile</a></div></div></section><ClosingCTA /></main>;
}
function CartDialog({ open, onClose, inCart, onRemove }) {
  const [leaving, setLeaving] = useState(false);
  useEffect(() => { if (open) setLeaving(false); }, [open]);
  useEffect(() => { const reset = () => setLeaving(false); window.addEventListener('pageshow', reset); return () => window.removeEventListener('pageshow', reset); }, []);
  return <Modal open={open} onClose={onClose} className="cart-dialog" label="Your cart"><div className="cart-dialog__panel"><div className="cart-dialog__head"><div><span className="eyebrow">Your next repair</span><h2>Your cart.</h2></div><button className="icon-button" aria-label="Close cart" onClick={onClose} autoFocus><CloseIcon /></button></div>{inCart ? <>
    <div className="cart-line"><img src={sitePath('media/mgu-exploded.svg')} alt="Concept illustration of the MGU repair components" width="112" height="100" /><div><strong>{ramKit.shortName}</strong><span>5.7L · 2019–2024 · Qty 1</span><button onClick={onRemove}>Remove</button></div><b>{currency(ramKit.price)}</b></div><div className="cart-total"><span>Subtotal</span><strong>{currency(ramKit.price)} USD</strong></div><div className="cart-notice"><ShieldIcon /><p>Complete your purchase on our current product page. Review fitment, availability, shipping, and the final total there.</p></div><a className="ve-button ve-button--cart cart-dialog__checkout" href={ramKit.legacyPurchaseUrl} onClick={() => setLeaving(true)} aria-busy={leaving}>{leaving ? <Spinner /> : <CartIcon />}{leaving ? 'Opening product page…' : 'Continue to purchase'}<ArrowIcon /></a><button className="cart-dialog__continue" onClick={onClose}>Continue exploring</button>
    </> : <div className="cart-empty"><CartIcon /><h3>A better repair starts here.</h3><p>Your cart is empty. Explore the kit and check the fit for your vehicle.</p><ButtonLink href={PRODUCT_PATH}>Explore the Ram kit</ButtonLink></div>}</div></Modal>;
}
export default function App({ page = 'home' }) {
  const [inCart, setInCart] = useState(false), [cartOpen, setCartOpen] = useState(false), [cartPending, setCartPending] = useState(false);
  useEffect(() => { try { setInCart(localStorage.getItem('ve-cart-ram-kit') === '1'); } catch { /* Cart remains available for this session. */ } }, []);
  async function addToCart() {
    if (inCart) { setCartOpen(true); return; }
    if (cartPending) return;
    setCartPending(true); await nextPaint();
    try { localStorage.setItem('ve-cart-ram-kit', '1'); } catch { /* Storage is optional. */ }
    setInCart(true); setCartPending(false); setCartOpen(true);
  }
  function removeFromCart() { setInCart(false); try { localStorage.removeItem('ve-cart-ram-kit'); } catch { /* Storage is optional. */ } }
  return <><a className="skip-link" href="#main-content">Skip to main content</a><SiteHeader cartCount={inCart ? 1 : 0} onCartOpen={() => setCartOpen(true)} />{page === 'product' ? <ProductPage onAdd={addToCart} inCart={inCart} cartPending={cartPending} /> : page === 'about' ? <AboutPage /> : <HomePage />}<SiteFooter /><CartDialog open={cartOpen} onClose={() => setCartOpen(false)} inCart={inCart} onRemove={removeFromCart} /></>;
}
