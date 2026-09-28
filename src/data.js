export const sitePath = (path = '') => `${import.meta.env.BASE_URL}${path.replace(/^\/+/, '')}`;
export const PRODUCT_PATH = sitePath('products/ram-1500-etorque-mgu-rebuild-kit/');

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
