/**
 * Application Constants
 * Centralized configuration and constant values
 */

export const APP_CONFIG = {
  name: 'Nyala Villas',
  description: 'A Tulum-inspired haven in Bali',
  url: 'https://www.nyalavillas.com',
  email: 'sales@swatchdevelopments.com',
  phone: '+62 8195 9600 007',
  whatsapp: '+6281959600007',
} as const;

export const VILLA_TYPES = {
  ONE_BEDROOM: '1-bed',
  TWO_BEDROOM: '2-bed',
  THREE_BEDROOM: '3-bed',
} as const;

export const VILLA_INFO = {
  [VILLA_TYPES.ONE_BEDROOM]: {
    title: 'One-Bedroom Villa',
    subtitle: 'Moroccan Infused Chic',
    available: true,
  },
  [VILLA_TYPES.TWO_BEDROOM]: {
    title: 'Two-Bedroom Villa',
    subtitle: 'More Space, Same Peace of Mind',
    available: true,
  },
  [VILLA_TYPES.THREE_BEDROOM]: {
    title: 'Three-Bedroom Villa',
    subtitle: 'Coming Soon',
    available: false,
  },
} as const;

export const INVESTMENT_STATS = {
  rentalROI: '16%',
  capitalGrowth: '30%',
  startingPrice: '$359K',
  priceIncrement: '$20,000',
  paymentPlan: '12 months interest-free',
  unitsRemaining: 3,
  totalUnits: 6,
} as const;

export const NAVIGATION_ITEMS = [
  { label: 'HOME', href: '#home' },
  { label: 'LIFESTYLE', href: '#lifestyle' },
  { label: 'VILLAS', href: '#villas' },
  { label: 'INVESTMENT', href: '#investment' },
  { label: 'WHY BALI', href: '#why-bali' },
  { label: 'GALLERY', href: '#gallery' },
  { label: 'OFFERS', href: '#offers' },
  { label: 'CONTACT US', href: '#contact' },
] as const;

export const FOOTER_LINKS = [
  { label: 'About Swatch Developments', href: '#about' },
  { label: 'Privacy Policy', href: '#privacy' },
  { label: 'Terms of Service', href: '#terms' },
  { label: 'BOOK A DISCOVERY CALL', href: '#contact' },
  { label: 'WWW.NYALAVILLAS.COM', href: 'https://www.nyalavillas.com' },
] as const;

export const WHY_BALI_POINTS = [
  {
    title: 'Transparent Pricing with Built-In Appreciation',
    description:
      'Secure your villa off-plan to maximize capital gain as prices increase by $20,000 at each construction milestone.',
  },
  {
    title: 'Flexible Payment Options',
    description:
      'Enjoy peace of mind with our 12-month interest-free payment plan designed to boost your ROI and simplify your investment journey.',
  },
  {
    title: 'Global Expertise & Local Knowledge',
    description:
      "Swatch Developments brings a decade of global experience to Bali's vibrant real estate market, ensuring value, transparency, and quality.",
  },
] as const;

export const CONTACT_FORM_FIELDS = [
  { name: 'firstName', label: 'first name', type: 'text', required: true },
  { name: 'lastName', label: 'last name', type: 'text', required: true },
  { name: 'email', label: 'Email', type: 'email', required: true },
  { name: 'phoneNumber', label: 'Phone Number', type: 'tel', required: true },
  {
    name: 'preferredContact',
    label: 'Preferred Method of Contact',
    type: 'text',
    required: false,
  },
] as const;

