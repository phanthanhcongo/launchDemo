/**
 * Unit Data Types & Constants
 * 
 * Centralized unit data structure for real estate exploration system.
 */

export type UnitStatus = 'available' | 'held' | 'sold';
export type UnitType = '1-bed' | '2-bed' | '3-bed-a' | '3-bed-b';
export type UnitOrientation = 'north' | 'south' | 'east' | 'west' | 'northeast' | 'northwest' | 'southeast' | 'southwest';

export interface Unit {
  id: string;
  code: string; // e.g., "A-101", "B-205"
  type: UnitType;
  floor: number;
  area: number; // sqm
  orientation: UnitOrientation;
  price: number; // USD
  status: UnitStatus;
  heldUntil?: Date; // If status is 'held'
  heldBy?: string; // User ID if held by someone
  vrUrl?: string; // VR tour URL
  images?: string[]; // Gallery images
  features?: string[]; // Unit features
}

export interface UnitFilter {
  type?: UnitType[];
  floor?: number[];
  minPrice?: number;
  maxPrice?: number;
  status?: UnitStatus[];
  orientation?: UnitOrientation[];
}

export interface UnitSort {
  field: 'price' | 'area' | 'floor' | 'code';
  direction: 'asc' | 'desc';
}

/**
 * Mock Unit Data
 * In production, this would come from API
 */
export const MOCK_UNITS: Unit[] = [
  {
    id: 'unit-1',
    code: 'A-101',
    type: '1-bed',
    floor: 1,
    area: 45,
    orientation: 'north',
    price: 359000,
    status: 'available',
    vrUrl: 'https://www.siiastudio.com/Our/VR/NYALA%20VILLAS%201BR/NYALAVILLAS1.htm',
  },
  {
    id: 'unit-2',
    code: 'A-102',
    type: '1-bed',
    floor: 1,
    area: 45,
    orientation: 'south',
    price: 359000,
    status: 'available',
    vrUrl: 'https://www.siiastudio.com/Our/VR/NYALA%20VILLAS%201BR/NYALAVILLAS1.htm',
  },
  {
    id: 'unit-3',
    code: 'B-201',
    type: '2-bed',
    floor: 2,
    area: 75,
    orientation: 'east',
    price: 485000,
    status: 'held',
    heldUntil: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
    vrUrl: 'https://www.siiastudio.com/Our/VR/NYALA%20VILLAS%202BR/NYALAVILLAS2.htm',
  },
  {
    id: 'unit-4',
    code: 'B-202',
    type: '2-bed',
    floor: 2,
    area: 75,
    orientation: 'west',
    price: 485000,
    status: 'available',
    vrUrl: 'https://www.siiastudio.com/Our/VR/NYALA%20VILLAS%202BR/NYALAVILLAS2.htm',
  },
  {
    id: 'unit-5',
    code: 'C-301',
    type: '3-bed-a',
    floor: 3,
    area: 120,
    orientation: 'northeast',
    price: 650000,
    status: 'sold',
    vrUrl: 'https://www.siiastudio.com/Our/VR/NYALA%20VILLAS%203BR/NYALAVILLAS3.htm',
  },
  {
    id: 'unit-6',
    code: 'C-302',
    type: '3-bed-a',
    floor: 3,
    area: 120,
    orientation: 'southwest',
    price: 650000,
    status: 'available',
    vrUrl: 'https://www.siiastudio.com/Our/VR/NYALA%20VILLAS%203BR/NYALAVILLAS3.htm',
  },
  {
    id: 'unit-7',
    code: 'D-401',
    type: '3-bed-b',
    floor: 4,
    area: 135,
    orientation: 'southeast',
    price: 720000,
    status: 'available',
    vrUrl: 'https://www.siiastudio.com/Our/VR/NYALA%20VILLAS%203BR/NYALAVILLAS3.htm',
  },
];

// Functions moved below to avoid duplication

/**
 * Format price
 */
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

/**
 * Format area
 */
export const formatArea = (area: number): string => {
  return `${area} m²`;
};

/**
 * Get unit status background color
 */
export const getUnitStatusColor = (status: UnitStatus): string => {
  const colors = {
    available: 'bg-available', // Green
    held: 'bg-held', // Amber
    sold: 'bg-sold', // Gray
  };
  return colors[status];
};

/**
 * Get unit status text color
 */
export const getUnitStatusTextColor = (status: UnitStatus): string => {
  const colors = {
    available: 'text-white',
    held: 'text-white',
    sold: 'text-white',
  };
  return colors[status];
};

