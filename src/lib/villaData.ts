import { VillaImage } from '@/components/molecules/VillaGallery';

/**
 * Villa Data Constants
 * 
 * Contains villa information, images, and VR tour URLs.
 * Separated from components for better maintainability.
 */

export interface VillaData {
  id: string;
  type: '1-bed' | '2-bed' | '3-bed-a' | '3-bed-b';
  name: string;
  subtitle: string;
  vrUrl: string;
  images: VillaImage[];
}

// Base path for villa images
const VILLA_IMAGES_BASE = '/images/Nyala Villas - Visualisation';

/**
 * One-Bedroom Villa Data
 */
export const ONE_BED_VILLA: VillaData = {
  id: '1-bed',
  type: '1-bed',
  name: 'One-Bedroom Villa',
  subtitle: 'Moroccan Infused Chic',
  vrUrl: 'https://www.siiastudio.com/Our/VR/NYALA%20VILLAS%201BR/NYALAVILLAS1.htm',
  images: [
    {
      src: `${VILLA_IMAGES_BASE}/01 Nyala One Bed/NYALA VILLAS_1B_EXT01_STREET VIEW_SWATCH ARCHITECTS.jpg`,
      alt: 'One-Bedroom Villa - Street View',
      category: 'exterior',
      room: 'Street View'
    },
    {
      src: `${VILLA_IMAGES_BASE}/01 Nyala One Bed/NYALA VILLAS_1B_EXT02_FRONT VIEW_SWATCH ARCHITECTS.jpg`,
      alt: 'One-Bedroom Villa - Front View',
      category: 'exterior',
      room: 'Front View'
    },
    {
      src: `${VILLA_IMAGES_BASE}/01 Nyala One Bed/NYALA VILLAS_1B_EXT03_ROOF TERRACE_SWATCH ARCHITECTS.jpg`,
      alt: 'One-Bedroom Villa - Roof Terrace',
      category: 'exterior',
      room: 'Roof Terrace'
    },
    {
      src: `${VILLA_IMAGES_BASE}/01 Nyala One Bed/NYALA VILLAS_1B_INT01_LIVING_SWATCH ARCHITECTS.jpg`,
      alt: 'One-Bedroom Villa - Living Room',
      category: 'interior',
      room: 'Living Room'
    },
    {
      src: `${VILLA_IMAGES_BASE}/01 Nyala One Bed/NYALA VILLAS_1B_INT02_KITCHEN_SWATCH ARCHITECTS.jpg`,
      alt: 'One-Bedroom Villa - Kitchen',
      category: 'interior',
      room: 'Kitchen'
    },
    {
      src: `${VILLA_IMAGES_BASE}/01 Nyala One Bed/NYALA VILLAS_1B_INT03_MASTER BEDROOM_SWATCH ARCHITECTS.jpg`,
      alt: 'One-Bedroom Villa - Master Bedroom',
      category: 'interior',
      room: 'Master Bedroom'
    },
    {
      src: `${VILLA_IMAGES_BASE}/01 Nyala One Bed/NYALA VILLAS_1B_INT04_DRESSING ROOM_SWATCH ARCHITECTS.jpg`,
      alt: 'One-Bedroom Villa - Dressing Room',
      category: 'interior',
      room: 'Dressing Room'
    },
    {
      src: `${VILLA_IMAGES_BASE}/01 Nyala One Bed/NYALA VILLAS_1B_INT05_ENSUITE_SWATCH ARCHITECTS.jpg`,
      alt: 'One-Bedroom Villa - Ensuite',
      category: 'interior',
      room: 'Ensuite'
    }
  ]
};

/**
 * Two-Bedroom Villa Data
 */
export const TWO_BED_VILLA: VillaData = {
  id: '2-bed',
  type: '2-bed',
  name: 'Two-Bedroom Villa',
  subtitle: 'More Space, Same Peace of Mind',
  vrUrl: 'https://www.siiastudio.com/Our/VR/NYALA%20VILLAS%202BR/NYALAVILLAS2.htm',
  images: [
    {
      src: `${VILLA_IMAGES_BASE}/02 Two Bed/NYALA VILLAS_EXT01_FRONT VIEW_SWATCH ARCHITECTS.jpg`,
      alt: 'Two-Bedroom Villa - Front View',
      category: 'exterior',
      room: 'Front View'
    },
    {
      src: `${VILLA_IMAGES_BASE}/02 Two Bed/NYALA VILLAS_EXT02_GARDEN VIEW_SWATCH ARCHITECTS.jpg`,
      alt: 'Two-Bedroom Villa - Garden View',
      category: 'exterior',
      room: 'Garden View'
    },
    {
      src: `${VILLA_IMAGES_BASE}/02 Two Bed/NYALA VILLAS_EXT03_GARDEN SEATING_SWATCH ARCHITECTS.jpg`,
      alt: 'Two-Bedroom Villa - Garden Seating',
      category: 'exterior',
      room: 'Garden Seating'
    },
    {
      src: `${VILLA_IMAGES_BASE}/02 Two Bed/NYALA VILLAS_EXT04_ROOF TERRACE_SWATCH ARCHITECTS.jpg`,
      alt: 'Two-Bedroom Villa - Roof Terrace',
      category: 'exterior',
      room: 'Roof Terrace'
    },
    {
      src: `${VILLA_IMAGES_BASE}/02 Two Bed/NYALA VILLAS_INT01_LIVING ROOM_SWATCH ARCHITECTS.jpg`,
      alt: 'Two-Bedroom Villa - Living Room',
      category: 'interior',
      room: 'Living Room'
    },
    {
      src: `${VILLA_IMAGES_BASE}/02 Two Bed/NYALA VILLAS_INT02_KITCHEN_SWATCH ARCHITECTS.jpg`,
      alt: 'Two-Bedroom Villa - Kitchen',
      category: 'interior',
      room: 'Kitchen'
    },
    {
      src: `${VILLA_IMAGES_BASE}/02 Two Bed/NYALA VILLAS_INT03_STUDY_SWATCH ARCHITECTS.jpg`,
      alt: 'Two-Bedroom Villa - Study',
      category: 'interior',
      room: 'Study'
    },
    {
      src: `${VILLA_IMAGES_BASE}/02 Two Bed/NYALA VILLAS_INT04_MASTER BEDROOM_SWATCH ARCHITECTS.jpg`,
      alt: 'Two-Bedroom Villa - Master Bedroom',
      category: 'interior',
      room: 'Master Bedroom'
    },
    {
      src: `${VILLA_IMAGES_BASE}/02 Two Bed/NYALA VILLAS_INT05_BEDROOM II_SWATCH ARCHITECTS.jpg`,
      alt: 'Two-Bedroom Villa - Bedroom II',
      category: 'interior',
      room: 'Bedroom II'
    },
    {
      src: `${VILLA_IMAGES_BASE}/02 Two Bed/NYALA VILLAS_INT06_ENSUITE_SWATCH ARCHITECTS.jpg`,
      alt: 'Two-Bedroom Villa - Ensuite',
      category: 'interior',
      room: 'Ensuite'
    }
  ]
};

/**
 * Three-Bedroom Villa A Data
 */
export const THREE_BED_A_VILLA: VillaData = {
  id: '3-bed-a',
  type: '3-bed-a',
  name: 'Three-Bedroom Villa A',
  subtitle: 'Premium Layout',
  vrUrl: 'https://www.siiastudio.com/Our/VR/NYALA%20VILLAS%203BR/NYALAVILLAS3.htm',
  images: [
    {
      src: `${VILLA_IMAGES_BASE}/03 Three Bed A/NYALA VILLAS_3A_EXT01_GARDEN ELEVATION_SWATCH ARCHITECTS.jpg`,
      alt: 'Three-Bedroom Villa A - Garden Elevation',
      category: 'exterior',
      room: 'Garden Elevation'
    },
    {
      src: `${VILLA_IMAGES_BASE}/03 Three Bed A/NYALA VILLAS_3A_EXT02_ROOF TERRACE_SWATCH ARCHITECTS.jpg`,
      alt: 'Three-Bedroom Villa A - Roof Terrace',
      category: 'exterior',
      room: 'Roof Terrace'
    },
    {
      src: `${VILLA_IMAGES_BASE}/03 Three Bed A/NYALA VILLAS_3A_INT01_KITCHEN_SWATCH ARCHITECTS.jpg`,
      alt: 'Three-Bedroom Villa A - Kitchen',
      category: 'interior',
      room: 'Kitchen'
    },
    {
      src: `${VILLA_IMAGES_BASE}/03 Three Bed A/NYALA VILLAS_3A_INT02_LIVING ROOM_SWATCH ARCHITECTS.jpg`,
      alt: 'Three-Bedroom Villa A - Living Room',
      category: 'interior',
      room: 'Living Room'
    },
    {
      src: `${VILLA_IMAGES_BASE}/03 Three Bed A/NYALA VILLAS_3A_INT03_MASTER BEDROOM_SWATCH ARCHITECTS.jpg`,
      alt: 'Three-Bedroom Villa A - Master Bedroom',
      category: 'interior',
      room: 'Master Bedroom'
    }
  ]
};

/**
 * Three-Bedroom Villa B Data
 */
export const THREE_BED_B_VILLA: VillaData = {
  id: '3-bed-b',
  type: '3-bed-b',
  name: 'Three-Bedroom Villa B',
  subtitle: 'Garden View',
  vrUrl: 'https://www.siiastudio.com/Our/VR/NYALA%20VILLAS%203BR/NYALAVILLAS3.htm',
  images: [
    {
      src: `${VILLA_IMAGES_BASE}/04 Three Bed B/NYALA VILLAS_3B_EXT01_GARDEN ELEVATION_SWATCH ARCHITECTS.jpg`,
      alt: 'Three-Bedroom Villa B - Garden Elevation',
      category: 'exterior',
      room: 'Garden Elevation'
    },
    {
      src: `${VILLA_IMAGES_BASE}/04 Three Bed B/NYALA VILLAS_3B_EXT03_REAR ELEVATION_SWATCH ARCHITECTS.jpg`,
      alt: 'Three-Bedroom Villa B - Rear Elevation',
      category: 'exterior',
      room: 'Rear Elevation'
    },
    {
      src: `${VILLA_IMAGES_BASE}/04 Three Bed B/NYALA VILLAS_3B_INT01_OPEN PLAN LIVING_SWATCH ARCHITECTS.jpg`,
      alt: 'Three-Bedroom Villa B - Open Plan Living',
      category: 'interior',
      room: 'Open Plan Living'
    },
    {
      src: `${VILLA_IMAGES_BASE}/04 Three Bed B/NYALA VILLAS_3B_INT03_MASTER ENSUITE_SWATCH ARCHITECTS.jpg`,
      alt: 'Three-Bedroom Villa B - Master Ensuite',
      category: 'interior',
      room: 'Master Ensuite'
    },
    {
      src: `${VILLA_IMAGES_BASE}/04 Three Bed B/NYALA VILLAS_3B_INT04_GROUND FLOOR BEDROOM_SWATCH ARCHITECTS.jpg`,
      alt: 'Three-Bedroom Villa B - Ground Floor Bedroom',
      category: 'interior',
      room: 'Ground Floor Bedroom'
    }
  ]
};

/**
 * All Villa Data
 */
export const ALL_VILLAS: VillaData[] = [
  ONE_BED_VILLA,
  TWO_BED_VILLA,
  THREE_BED_A_VILLA,
  THREE_BED_B_VILLA
];

/**
 * Get villa data by type
 */
export const getVillaByType = (type: VillaData['type']): VillaData | undefined => {
  return ALL_VILLAS.find(villa => villa.type === type);
};

/**
 * Get villa data by ID
 */
export const getVillaById = (id: string): VillaData | undefined => {
  return ALL_VILLAS.find(villa => villa.id === id);
};
