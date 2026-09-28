import React, { useEffect, useRef, useState } from 'react';
import { ABOUT_PATH, CUSTOMER_SERVICE_PHONE, EBAY_STORE_URL, LEGACY_CATALOG_URL, MOBILE_PHONE, PRODUCT_PATH, RENTAL_URL, SUPPORT_EMAIL, currency, ramKit, sitePath } from './data.js';
import { AlertIcon, ArrowIcon, CartIcon, CheckIcon, CloseIcon, MenuIcon, SearchIcon, ShieldIcon, WrenchIcon } from './icons.jsx';

const modelsByMake = {
  Ram: ['1500 eTorque 5.7L'],
  Tesla: ['Model S'],
  BMW: ['E34'],
  Audi: ['A4'],
  Toyota: ['Tacoma', 'Tundra'],
};
const years = Array.from({ length: 38 }, (_, index) => 2026 - index);

function Brand({ light = false }) {
  return <a className={`brand${light ? ' brand--light' : ''}`} href={sitePath()} aria-label="126 Vehicle Engineering home">
    <span className="brand__mark">126<span>.</span></span>
    <span className="brand__name">VEHICLE<br />ENGINEERING</span>
  </a>;
}

function ButtonLink({ href, children, secondary = false, className = '' }) {
  return <a className={`ve-button ${secondary ? 've-button--secondary' : 've-button--cart'} ${className}`} href={href}>
    {children}<ArrowIcon />
  </a>;
}

function SiteHeader({ cartCount, onCartOpen }) {
  const [menuOpen, setMenuOpen] = useState(false);
  return <>
    <div className="utility-bar"><div className="container utility-bar__inner"><span>ENGINEERED FOR THE FAILURE POINT</span><span className="utility-bar__right">Rochester, New York <span aria-hidden="true">/</span> <a href="mailto:sirbob1002@gmail.com">Talk to a real person</a></span></div></div>
    <header className="site-header">
      <div className="container site-header__inner">
        <Brand />
        <nav className="desktop-nav" aria-label="Primary navigation">
          <details className="nav-dropdown"><summary>Shop by Vehicle</summary><div className="nav-dropdown__panel"><span className="menu-eyebrow">FIND YOUR VEHICLE</span><a href={PRODUCT_PATH}>Ram 1500 eTorque 5.7L <ArrowIcon /></a><a href={LEGACY_CATALOG_URL}>Tesla, BMW, Audi & Toyota parts <ArrowIcon /></a><a href={sitePath('#find-fix')}>Use vehicle search <ArrowIcon /></a></div></details>
          <details className="nav-dropdown"><summary>Shop by Problem</summary><div className="nav-dropdown__panel"><span className="menu-eyebrow">START WITH THE FAILURE</span><a href={PRODUCT_PATH}>Ram eTorque MGU issues <ArrowIcon /></a><a href={LEGACY_CATALOG_URL}>Tesla Model S suspension <ArrowIcon /></a><a href={EBAY_STORE_URL}>Tesla Model 3/Y climate parts <ArrowIcon /></a></div></details>
          <a href={`${PRODUCT_PATH}#installation`}>Repair Overview</a>
          <a href={sitePath('#for-shops')}>For Mechanics</a>
          <a href={ABOUT_PATH}>About</a>
        </nav>
        <div className="site-header__actions">
          <button type="button" className="header-cart" onClick={onCartOpen} aria-label={`Open cart, ${cartCount} items`}><CartIcon /><span className="header-cart__count">{cartCount}</span></button>
          <button type="button" className="menu-toggle" aria-expanded={menuOpen} aria-controls="mobile-navigation" aria-label={menuOpen ? 'Close menu' : 'Open menu'} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <CloseIcon /> : <MenuIcon />}</button>
        </div>
      </div>
      {menuOpen && <nav id="mobile-navigation" className="mobile-nav" aria-label="Mobile navigation">
        <details><summary>Shop by Vehicle</summary><a href={PRODUCT_PATH}>Ram 1500 eTorque 5.7L</a><a href={LEGACY_CATALOG_URL}>Tesla, BMW, Audi & Toyota parts</a><a href={sitePath('#find-fix')}>Use vehicle search</a></details>
        <details><summary>Shop by Problem</summary><a href={PRODUCT_PATH}>Ram eTorque MGU issues</a><a href={LEGACY_CATALOG_URL}>Tesla Model S suspension</a><a href={EBAY_STORE_URL}>Tesla Model 3/Y climate parts</a></details>
        <a href={`${PRODUCT_PATH}#installation`}>Repair Overview</a><a href={sitePath('#for-shops')}>For Mechanics</a><a href={ABOUT_PATH}>About</a>
      </nav>}
    </header>
  </>;
}

function SiteFooter() {
  return <footer className="site-footer ve-on-dark">
    <div className="container footer-grid">
      <div><Brand light /><p>Rochester-based repair kits, specialty parts, and practical answers for the job in front of you.</p></div>
      <div><h2>Explore</h2><a href={sitePath('#find-fix')}>Find your fix</a><a href={PRODUCT_PATH}>Ram eTorque MGU kit</a><a href={LEGACY_CATALOG_URL}>Full parts catalog</a><a href={EBAY_STORE_URL}>eBay store</a><a href={ABOUT_PATH}>About us</a></div>
      <div><h2>Get help</h2><a href={`mailto:${SUPPORT_EMAIL}`}>Ask a fitment question</a><a href={`tel:${CUSTOMER_SERVICE_PHONE}`}>Customer service: 845 532 3106</a><a href={`tel:${MOBILE_PHONE}`}>Mobile: 585 509 2950</a><span>Rochester, New York</span></div>
    </div>
    <div className="container footer-bottom"><span>© {new Date().getFullYear()} 126 Vehicle Engineering</span><span>Fix the failure. Keep moving.</span></div>
  </footer>;
}

function VehicleFitmentSearch({ compact = false, onResult, defaultYear = '' }) {
  const [year, setYear] = useState(defaultYear);
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [partNumber, setPartNumber] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!compact) return;
    const params = new URLSearchParams(window.location.search);
    const fromUrl = params.get('year');
    const savedMake = params.get('make');
    const savedModel = params.get('model');
    if (fromUrl && years.includes(Number(fromUrl))) setYear(fromUrl);
    if (savedMake && modelsByMake[savedMake]) {
      setMake(savedMake);
      if (savedModel && modelsByMake[savedMake].includes(savedModel)) setModel(savedModel);
    }
  }, [compact]);

  function submit(event) {
    event.preventDefault();
    const match = make === ramKit.make && model === ramKit.model && ramKit.years.includes(Number(year));
    if (onResult) {
      onResult({ match, year, make, model, partNumber: partNumber.trim() });
      setMessage('');
    } else if (match) {
      const search = new URLSearchParams({ year, make, model });
      window.location.assign(`${PRODUCT_PATH}?${search.toString()}#fitment`);
    } else {
      setMessage('This preview has a dedicated fitment page for the Ram kit. Other listed parts are in our current catalog; confirm the vehicle and part number there.');
    }
  }

  return <form className={`fitment-search${compact ? ' fitment-search--compact' : ''}`} onSubmit={submit} aria-label="Vehicle fitment search">
    <div className="fitment-search__fields">
      <label><span>Year</span><select className="ve-field" value={year} onChange={(event) => setYear(event.target.value)} required><option value="">Select year</option>{years.map((value) => <option key={value} value={value}>{value}</option>)}</select></label>
      <label><span>Make</span><select className="ve-field" value={make} onChange={(event) => { setMake(event.target.value); setModel(''); }} required><option value="">Select make</option>{Object.keys(modelsByMake).map((value) => <option key={value} value={value}>{value}</option>)}</select></label>
      <label><span>Model</span><select className="ve-field" value={model} onChange={(event) => setModel(event.target.value)} required disabled={!make}><option value="">Select model</option>{(modelsByMake[make] || []).map((value) => <option key={value} value={value}>{value}</option>)}</select></label>
      {compact && <label className="fitment-search__part"><span>Unit / OE number <em>(optional)</em></span><input className="ve-field" value={partNumber} onChange={(event) => setPartNumber(event.target.value)} placeholder="e.g. 68623194AC" autoComplete="off" /></label>}
      <button className="ve-button ve-button--cart fitment-search__submit" type="submit"><SearchIcon />{compact ? 'Check Fitment' : 'Find Your Fix'}</button>
    </div>
    {message && <p className="fitment-search__message" role="status">{message} <a href={LEGACY_CATALOG_URL}>Browse the current catalog</a> or <a href="mailto:sirbob1002@gmail.com?subject=Vehicle%20fitment%20question">ask us.</a></p>}
  </form>;
}

function HomePage() {
  return <main id="main-content">
    <section className="hero ve-on-dark" aria-labelledby="home-title">
      <div className="hero__grid container">
        <div className="hero__copy"><span className="eyebrow eyebrow--amber"><span className="eyebrow__line" /> TARGETED REPAIRS. REAL ANSWERS.</span><h1 id="home-title">REPAIR THE FAILED PART.<br /><span>KEEP YOUR TRUCK MOVING.</span></h1><p>For a serviceable Ram 1500 eTorque MGU, our resolver-and-bearing kit offers a focused repair path. We also source Tesla suspension and climate parts and vehicle-specific exterior components.</p><div className="hero__actions"><ButtonLink href="#find-fix">Find Your Fix</ButtonLink><a href="#approach" className="text-link text-link--light">See how we work <ArrowIcon /></a></div></div>
        <div className="hero__visual" aria-hidden="true"><img src={sitePath('media/hero-blueprint.svg')} alt="" /><div className="hero__visual-label"><span>126 / ENGINEERING NOTE 001</span><strong>REPAIR THE PART<br />THAT FAILED.</strong></div></div>
      </div>
      <div className="container hero__search-wrap" id="find-fix"><div className="hero__search-title"><div><span className="eyebrow">START HERE</span><h2>What are you working on?</h2></div><p>Check the Ram kit here, or browse our wider parts catalog.</p></div><VehicleFitmentSearch /></div>
    </section>

    <div className="proof-strip"><div className="container proof-strip__inner"><div><WrenchIcon /><span>BUILT AROUND THE FAILURE POINT</span></div><div><ShieldIcon /><span>CLEAR FITMENT GUIDANCE</span></div><div><CheckIcon /><span>STRAIGHT REPAIR LIMITS</span></div></div></div>

    <section className="section section--problem" id="problem"><div className="container split-intro"><div><span className="eyebrow">THE PROBLEM</span><h2>WHEN THE MGU BEARING HOWLS, YOU NEED A PRACTICAL NEXT STEP.</h2></div><p>Ram owners report whining bearings, long replacement waits, and trucks stuck in the bay. A diagnosed resolver or bearing fault may leave the rest of the MGU serviceable. The right repair starts with confirming exactly what failed.</p></div><div className="container comparison"><div className="comparison__factory"><span className="comparison__number">01 / THE DEFAULT</span><h3>Replace the whole thing.</h3><p>Pay for an entire assembly, even when the failure may be limited to a repairable part.</p><div className="comparison__symbol" aria-hidden="true">×</div></div><div className="comparison__answer"><span className="comparison__number">02 / THE 126 APPROACH</span><h3>Repair what failed.</h3><p>Identify the weak point, confirm the unit is serviceable, and use a focused kit when the repair fits.</p><div className="comparison__symbol" aria-hidden="true">↗</div></div></div></section>

    <section className="section section--approach" id="approach"><div className="container"><div className="section-heading"><span className="eyebrow">A CLEAR PATH TO REPAIR</span><h2>THREE STEPS. NO GUESSWORK.</h2><p>The right kit starts with the right diagnosis.</p></div><div className="steps-grid"><article><span className="step-number">01</span><h3>Start with your vehicle or symptom.</h3><p>Choose your make and model, describe the problem, or search the part number on your bench.</p></article><article><span className="step-number">02</span><h3>Confirm the repair.</h3><p>Review fitment, kit contents, covered failure modes, and conditions that call for a different repair.</p></article><article><span className="step-number">03</span><h3>Repair with a plan.</h3><p>Prepare for the work yourself or bring the kit details to your mechanic.</p></article></div></div></section>

    <section className="section section--feature"><div className="container feature-grid"><div className="feature-art"><img src={sitePath('media/mgu-diagram.svg')} alt="Conceptual eTorque MGU technical illustration; not a product photograph" /><span>TECHNICAL ILLUSTRATION / NOT PRODUCT PHOTO</span></div><div className="feature-copy"><span className="eyebrow">FEATURED REPAIR KIT</span><h2>RAM 1500 ETORQUE MGU REBUILD KIT</h2><p>A targeted rebuild option for a repairable Ram 1500 5.7L eTorque MGU. Check the vehicle, unit, and failure details before ordering so you know the kit is right for the job.</p><ul className="check-list"><li><CheckIcon />2019–2024 Ram 1500 5.7L eTorque vehicle path</li><li><CheckIcon />Resolver and bearing repair scope</li><li><CheckIcon />Clear exclusions for other unit damage</li></ul><div className="feature-copy__action"><ButtonLink href={PRODUCT_PATH}>Explore the Kit</ButtonLink><span>From {currency(ramKit.price)}</span></div></div></div></section>

    <section className="section section--people" id="for-shops"><div className="container"><div className="section-heading"><span className="eyebrow">BUILT FOR THE PEOPLE DOING THE WORK</span><h2>THE RIGHT ANSWER FOR THE JOB IN FRONT OF YOU.</h2></div><div className="people-grid"><article><div className="people-icon"><WrenchIcon /></div><span className="eyebrow">FOR VEHICLE OWNERS</span><h3>You need a straight answer.</h3><p>Understand the problem, check the fit, and choose a repair with more confidence before you spend another dollar.</p><a className="text-link" href="#find-fix">Find your fix <ArrowIcon /></a></article><article><div className="people-icon"><ShieldIcon /></div><span className="eyebrow">FOR INDEPENDENT MECHANICS</span><h3>Your bay can’t wait.</h3><p>Find the kit, confirm its scope, and give your customer a practical repair option without wasting time on vague parts listings.</p><a className="text-link" href={PRODUCT_PATH}>See kit details <ArrowIcon /></a></article></div></div></section>

    <section className="section section--about" id="about"><div className="container about-grid"><div><span className="eyebrow eyebrow--amber">WHY 126 EXISTS</span><h2>WE PAY ATTENTION TO THE FAILURES OTHERS PASS OVER.</h2></div><div><p>Based in Rochester, 126 Vehicle Operation LLC offers targeted Ram eTorque repair parts, Tesla suspension and climate components, and selected exterior parts for Audi, BMW, and Toyota vehicles.</p><p>Our approach is specific: identify the component, confirm the fit, and state when a repair kit is not the answer.</p><a className="text-link text-link--light" href={ABOUT_PATH}>Read our story <ArrowIcon /></a></div></div></section>

    <section className="section section--faq"><div className="container faq-grid"><div><span className="eyebrow">GOOD QUESTIONS</span><h2>KNOW BEFORE YOU ORDER.</h2></div><div><details><summary>Will a repair kit fix every symptom?</summary><p>No. Similar symptoms can have different causes. Confirm the failure and review the product page’s repair scope and exclusions before ordering.</p></details><details><summary>How do I know a kit fits my vehicle?</summary><p>Start with year, make, and model. Then compare the unit or OE number and any product-specific measurements. Contact us if a detail does not match.</p></details><details><summary>Can my mechanic install the kit?</summary><p>Yes. Share the product page with your mechanic so they can review the fitment, kit contents, and job requirements before beginning work.</p></details></div></div></section>

    <section className="closing-cta ve-on-dark"><div className="container"><span className="eyebrow eyebrow--amber">READY TO GET MOVING?</span><h2>YOUR VEHICLE HAS A PROBLEM.<br />FIND THE PART THAT SOLVES IT.</h2><p>Search by vehicle. Check the repair. Get a clear path forward.</p><ButtonLink href="#find-fix">Find Your Fix</ButtonLink></div></section>
  </main>;
}

function AboutPage() {
  return <main id="main-content" className="about-page">
    <div className="container"><nav className="breadcrumbs" aria-label="Breadcrumb"><a href={sitePath()}>Home</a><span aria-hidden="true">/</span><span aria-current="page">About</span></nav></div>
    <section className="about-page__hero ve-on-dark"><div className="container"><span className="eyebrow eyebrow--amber">ROCHESTER, NEW YORK</span><h1>BUILT AROUND THE <span>REPAIRABLE PART.</span></h1><p>126 Vehicle Engineering helps owners and independent shops find practical, vehicle-specific parts when an entire replacement assembly is not the only sensible answer.</p></div></section>
    <section className="section"><div className="container about-page__intro"><div><span className="eyebrow">OUR APPROACH</span><h2>START WITH THE FAILURE. CHECK THE LIMITS.</h2></div><div><p>126 Vehicle Engineering is the storefront of Rochester-based 126 Vehicle Operation LLC. We focus on clear repair scope, part identification, and a useful next step for the person doing the work.</p><p>The Ram 1500 eTorque MGU rebuild kit shows what that means. When testing points to a resolver or bearing fault and the unit is otherwise serviceable, a focused rebuild may be an option. Stator or inverter damage calls for a different repair. We put those limits up front so you can decide before you spend.</p></div></div></section>
    <section className="section section--approach"><div className="container"><div className="section-heading"><span className="eyebrow">WHAT WE OFFER</span><h2>PARTS AND SERVICES WITH A CLEAR PURPOSE.</h2></div><div className="about-page__offerings"><article><span>01 / REPAIR KIT</span><h3>Ram eTorque MGU</h3><p>A resolver-and-bearing rebuild path for listed 2019–2024 Ram 1500 5.7L eTorque units that pass inspection.</p><a className="text-link" href={PRODUCT_PATH}>Check the kit <ArrowIcon /></a></article><article><span>02 / SPECIALTY PARTS</span><h3>Tesla and vehicle-specific parts</h3><p>Tesla Model S air-suspension parts, Tesla Model 3/Y climate components, and selected Audi, BMW, and Toyota exterior parts. Check the exact vehicle and part number before ordering.</p><a className="text-link" href={LEGACY_CATALOG_URL}>Browse current catalog <ArrowIcon /></a><a className="text-link" href={EBAY_STORE_URL}>See eBay listings <ArrowIcon /></a></article><article><span>03 / LOCAL SERVICES</span><h3>Repair and rentals</h3><p>Our existing Rochester site advertises ICE and EV/Tesla auto repair, specialty parts supply, and classic Mercedes vehicle rentals. Contact us for current availability and service details.</p><a className="text-link" href={RENTAL_URL}>See rental details <ArrowIcon /></a></article></div></div></section>
    <section className="section"><div className="container about-page__contact"><div><span className="eyebrow">WORK WITH US</span><h2>BRING US THE VEHICLE, PART NUMBER, AND SYMPTOM.</h2><p>Tell us what failed or what you are trying to source. Include photos and the unit number when you have them, and we can help you check the next step.</p></div><div className="about-page__contact-card"><h3>Contact 126 Vehicle Engineering</h3><p>Warehouse listed on our current site: 920 Exchange St, Rochester, NY 14608. Contact us before visiting.</p><a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a><a href={`tel:${CUSTOMER_SERVICE_PHONE}`}>Customer service: 845 532 3106</a><a href={`tel:${MOBILE_PHONE}`}>Mobile: 585 509 2950</a></div></div></section>
    <section className="closing-cta ve-on-dark"><div className="container"><span className="eyebrow eyebrow--amber">READY TO START?</span><h2>FIND THE PART THAT FITS THE PROBLEM.</h2><p>Check the repair scope, then talk to us if the details do not match.</p><ButtonLink href={PRODUCT_PATH}>Explore the Ram Kit</ButtonLink></div></section>
  </main>;
}

function FitmentBadge({ type = 'review' }) {
  const labels = { confirmed: 'Vehicle Fitment Confirmed', review: 'Fitment Needs Review', unconfirmed: 'Fitment Not Confirmed' };
  return <span className={`ve-fitment-badge ve-fitment-badge--${type}`}>{type === 'confirmed' ? <CheckIcon /> : <AlertIcon />}{labels[type]}</span>;
}

function ProductGallery() {
  const [selected, setSelected] = useState(0);
  const item = ramKit.media[selected];
  return <div className="product-gallery" aria-label="Product media gallery">
    <div className="product-gallery__stage">
      <img src={item.src} alt={item.alt} width="800" height="800" />
      <span className="product-gallery__label">TECHNICAL ILLUSTRATION</span>
      <span className="product-gallery__counter">{selected + 1} / {ramKit.media.length}</span>
    </div>
    <div className="product-gallery__thumbs" role="group" aria-label="Choose product media">
      {ramKit.media.map((media, index) => <button type="button" key={media.src} onClick={() => setSelected(index)} aria-label={`Show ${media.label}`} aria-current={selected === index ? 'true' : undefined}><img src={media.src} alt="" width="80" height="80" /><span>{media.label}</span></button>)}
    </div>
    <p className="product-gallery__note">Technical illustrations show the repair concept. Confirm kit contents below before ordering.</p>
  </div>;
}

function ProductPage({ onAdd, inCart }) {
  const [fitment, setFitment] = useState({ type: 'review', text: 'Select your vehicle. The unit number and bearing size still need to be checked before installation.' });
  function handleFitment(result) {
    if (!result.match) {
      setFitment({ type: 'unconfirmed', text: 'We cannot confirm this kit for the vehicle selected. Contact us before ordering.' });
      return;
    }
    const numberMessage = result.partNumber.toUpperCase() === ramKit.referenceNumber
      ? `Your entered unit number matches reference ${ramKit.referenceNumber}. Verify the bearing size and inspect the unit before installation.`
      : 'This vehicle is in the listed range. Confirm your unit number, bearing size, and the actual failure before ordering.';
    setFitment({ type: 'review', text: numberMessage });
  }

  return <main id="main-content" className="product-page">
    <div className="container"><nav className="breadcrumbs" aria-label="Breadcrumb"><a href={sitePath()}>Home</a><span aria-hidden="true">/</span><a href={sitePath('#find-fix')}>Ram 1500</a><span aria-hidden="true">/</span><span aria-current="page">MGU Rebuild Kit</span></nav></div>
    <section className="container product-heading"><span className="eyebrow">TARGETED REPAIR / RAM ETORQUE</span><h1>{ramKit.name}</h1><p>A focused repair option for identified resolver or bearing failures in a serviceable eTorque motor-generator unit.</p></section>
    <div className="container product-layout"><div className="product-layout__main"><ProductGallery /><div className="product-content"><section className="product-intro"><span className="eyebrow">KNOW THE REPAIR</span><h2>REPAIR THE FAILED COMPONENT. KEEP THE SERVICEABLE UNIT.</h2><p>This kit is intended for a repairable Ram 1500 5.7L eTorque MGU. The unit must be diagnosed and inspected first. Similar symptoms can come from other damage that this kit does not cover.</p></section><section className="scope-grid" aria-label="Repair scope"><div className="scope-card scope-card--yes"><span className="scope-card__icon"><CheckIcon /></span><h3>What this kit addresses</h3><ul><li>Identified resolver failure</li><li>Identified bearing failure</li><li>A serviceable MGU that meets the repair criteria</li></ul></div><div className="scope-card scope-card--no"><span className="scope-card__icon"><AlertIcon /></span><h3>What it does not repair</h3><ul><li>Damaged stator windings</li><li>Damaged inverter or controller electronics</li><li>Other faults outside the covered components</li></ul></div></section><section className="detail-section" id="contents"><span className="eyebrow">IN THE BOX</span><h2>THE PARTS FOR THE TARGETED REPAIR.</h2><div className="contents-list"><div><span>01</span><strong>Resolver component</strong></div><div><span>02</span><strong>Bearing pair</strong></div></div><p className="small-note">Verify the bearing dimensions on your unit before ordering. Exact supplied components and revisions should be confirmed against current product inventory.</p></section><section className="detail-section" id="installation"><span className="eyebrow">REPAIR OVERVIEW</span><h2>A CLEAR PATH FROM DIAGNOSIS TO VERIFICATION.</h2><ol className="installation-list"><li><span>01</span><div><h3>Confirm the failure.</h3><p>Use the applicable vehicle service procedure to identify the fault. Do not order by symptom alone.</p></div></li><li><span>02</span><div><h3>Inspect the original unit.</h3><p>Check for damage outside this kit’s scope and compare the unit number and bearing dimensions.</p></div></li><li><span>03</span><div><h3>Replace the covered components.</h3><p>Install according to the service procedure and the instructions supplied with the kit.</p></div></li><li><span>04</span><div><h3>Verify the repair.</h3><p>Complete the required post-repair checks before returning the vehicle to service.</p></div></li></ol><div className="safety-note"><ShieldIcon /><p>The eTorque system uses 48-volt components. Follow the manufacturer’s service and electrical safety procedures. If you are unsure, use a qualified repair professional.</p></div></section><section className="detail-section" id="details"><span className="eyebrow">PRODUCT DETAILS</span><h2>THE NUMBERS THAT MATTER.</h2><dl className="spec-table"><div><dt>Listed vehicle</dt><dd>Ram 1500 5.7L eTorque</dd></div><div><dt>Listed years</dt><dd>2019–2024</dd></div><div><dt>Reference unit number</dt><dd>{ramKit.referenceNumber}</dd></div><div><dt>Repair focus</dt><dd>Resolver and bearings</dd></div><div><dt>Fitment check</dt><dd>Confirm unit revision and bearing size</dd></div></dl></section><section className="detail-section product-help"><h2>NOT SURE WHAT FAILED?</h2><p>Send us the vehicle year, unit number, symptoms, and clear photos of the removed assembly. We’ll help you decide whether this kit is the right next step.</p><a className="text-link" href="mailto:sirbob1002@gmail.com?subject=Ram%20eTorque%20MGU%20fitment%20question">Ask a fitment question <ArrowIcon /></a></section></div></div>
      <aside className="purchase-column" aria-label="Product purchase details"><div className="purchase-card"><div className="purchase-card__top"><span className="eyebrow">RAM 1500 / ETORQUE 5.7L</span><p className="purchase-card__price">{currency(ramKit.price)}</p><p className="purchase-card__price-note">Price in USD. Final total is shown before payment.</p></div><div className="purchase-card__fitment" id="fitment"><h2>CHECK BEFORE YOU ORDER</h2><VehicleFitmentSearch compact onResult={handleFitment} /><div className="fitment-result" role="status"><FitmentBadge type={fitment.type} /><p>{fitment.text}</p></div></div><button type="button" className="ve-button ve-button--cart purchase-card__add" onClick={onAdd}><CartIcon />{inCart ? 'View Cart' : 'Add to Cart'}</button><p className="purchase-card__help">Fitment question? <a href="mailto:sirbob1002@gmail.com?subject=Ram%20eTorque%20MGU%20fitment%20question">Talk to us before you buy.</a></p><div className="purchase-card__trust"><div><WrenchIcon /><span>Focused repair scope</span></div><div><ShieldIcon /><span>Clear fitment limits</span></div><div><CheckIcon /><span>Direct support</span></div></div></div></aside></div>
    <div className="mobile-purchase-bar"><div><span>Ram eTorque MGU Kit</span><strong>{currency(ramKit.price)}</strong></div><button type="button" className="ve-button ve-button--cart" onClick={onAdd}><CartIcon />{inCart ? 'View Cart' : 'Add to Cart'}</button></div>
  </main>;
}

function CartDialog({ open, onClose, inCart, onRemove }) {
  const ref = useRef(null);
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);
  return <dialog ref={ref} className="cart-dialog" aria-labelledby="cart-title" onCancel={onClose} onClick={(event) => { if (event.target === ref.current) onClose(); }}>
    <div className="cart-dialog__panel"><div className="cart-dialog__head"><div><span className="eyebrow">YOUR CART</span><h2 id="cart-title">Ready for the repair?</h2></div><button type="button" className="icon-button" onClick={onClose} aria-label="Close cart"><CloseIcon /></button></div>
      {inCart ? <>
        <div className="cart-line"><img src={sitePath('media/mgu-diagram.svg')} alt="" width="96" height="96" /><div><strong>{ramKit.shortName}</strong><span>Qty 1</span><button type="button" onClick={onRemove}>Remove</button></div><b>{currency(ramKit.price)}</b></div>
        <div className="cart-total"><span>Subtotal</span><strong>{currency(ramKit.price)}</strong></div>
        <p className="cart-dialog__note">You will complete this purchase on our existing product page. Review fitment and the final total before payment.</p>
        <a className="ve-button ve-button--cart cart-dialog__checkout" href={ramKit.legacyPurchaseUrl}>Continue to purchase <ArrowIcon /></a>
        <button type="button" className="cart-dialog__continue" onClick={onClose}>Keep exploring</button>
      </> : <><p className="cart-dialog__empty">Your cart is empty. Find the repair that fits your vehicle.</p><button type="button" className="ve-button ve-button--secondary" onClick={onClose}>Continue browsing</button></>}
    </div>
  </dialog>;
}

export default function App({ page = 'home' }) {
  const [inCart, setInCart] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  useEffect(() => { try { setInCart(localStorage.getItem('ve-cart-ram-kit') === '1'); } catch { /* storage may be unavailable */ } }, []);
  function addToCart() { setInCart(true); try { localStorage.setItem('ve-cart-ram-kit', '1'); } catch { /* session-only cart */ } setCartOpen(true); }
  function removeFromCart() { setInCart(false); try { localStorage.removeItem('ve-cart-ram-kit'); } catch { /* session-only cart */ } }
  return <><a className="skip-link" href="#main-content">Skip to main content</a><SiteHeader cartCount={inCart ? 1 : 0} onCartOpen={() => setCartOpen(true)} />{page === 'product' ? <ProductPage onAdd={addToCart} inCart={inCart} /> : page === 'about' ? <AboutPage /> : <HomePage />}<SiteFooter /><CartDialog open={cartOpen} onClose={() => setCartOpen(false)} inCart={inCart} onRemove={removeFromCart} /></>;
}
