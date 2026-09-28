export const sitePath = (path = '') => `${import.meta.env.BASE_URL}${path.replace(/^\/+/, '')}`;
export const PRODUCT_PATH = sitePath('products/ram-1500-etorque-mgu-rebuild-kit/');
export const ABOUT_PATH = sitePath('about/');
export const LEGACY_CATALOG_URL = 'https://126veng.com/PartBrowser/php/public/index.html';
export const RENTAL_URL = 'https://126veng.com/Home/rental.php';
export const EBAY_STORE_URL = 'https://www.ebay.ca/usr/126_vehicle_engineering_ev_classic';
export const SUPPORT_EMAIL = 'sirbob1002@gmail.com';
export const CUSTOMER_SERVICE_PHONE = '+18455323106';
export const MOBILE_PHONE = '+15855092950';

export const ramKit = {
  id: 'ram-etorque-mgu-kit',
  name: 'Ram 1500 eTorque 5.7L MGU Rebuild Kit',
  shortName: 'Ram eTorque MGU Rebuild Kit',
  price: 520,
  years: [2019, 2020, 2021, 2022, 2023, 2024],
  make: 'Ram',
  model: '1500 eTorque 5.7L',
  referenceNumber: '68623194AC',
  legacyPurchaseUrl: 'https://126veng.com/PartBrowser/php/public/part-detail.html?price_id=price_1Tu1YBFbOGYu2kpjuTaKGfho',
  media: [
    { src: sitePath('media/mgu-diagram.svg'), alt: 'Conceptual eTorque motor-generator diagram; not a product photograph', label: 'Technical overview' },
    { src: sitePath('media/fitment-diagram.svg'), alt: 'Illustration showing where to find and compare an assembly number', label: 'Check fitment' },
    { src: sitePath('media/repair-diagram.svg'), alt: 'Illustration of inspect, repair, and verify stages', label: 'Repair approach' },
  ],
};

export const currency = (amount) => new Intl.NumberFormat('en-US', {
  style: 'currency', currency: 'USD', maximumFractionDigits: 0,
}).format(amount);
