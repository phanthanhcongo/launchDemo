/**
 * VR Service
 * 
 * Centralized service for handling VR URLs and external navigation.
 * Ensures consistent VR experience across all components.
 */

export type VillaType = '1-bed' | '2-bed' | '3-bed-a' | '3-bed-b';

/**
 * VR URL Configuration
 */
export const VR_URLS = {
  '1-bed': 'https://www.siiastudio.com/Our/VR/NYALA%20VILLAS%201BR/NYALAVILLAS1.htm',
  '2-bed': 'https://www.siiastudio.com/Our/VR/NYALA%20VILLAS%202BR/NYALAVILLAS2.htm',
  '3-bed-a': 'https://www.siiastudio.com/Our/VR/NYALA%20VILLAS%203BR/NYALAVILLAS3.htm',
  '3-bed-b': 'https://www.siiastudio.com/Our/VR/NYALA%20VILLAS%203BR/NYALAVILLAS3.htm',
} as const;

/**
 * External URLs Configuration
 */
export const EXTERNAL_URLS = {
  vr: 'http://explore.nyalavillas.com/vr',
  floorplans: 'http://explore.nyalavillas.com/floorplans',
  visualisation: 'http://explore.nyalavillas.com/visualisation',
} as const;

/**
 * Villa Display Names
 */
export const VILLA_DISPLAY_NAMES = {
  '1-bed': 'One-Bedroom Villa',
  '2-bed': 'Two-Bedroom Villa',
  '3-bed-a': 'Three-Bedroom Villa A',
  '3-bed-b': 'Three-Bedroom Villa B',
} as const;

/**
 * Get VR URL for a specific villa type
 */
export function getVRUrl(villaType: VillaType): string {
  return VR_URLS[villaType] || EXTERNAL_URLS.vr;
}

/**
 * Get villa display name
 */
export function getVillaDisplayName(villaType: VillaType): string {
  return VILLA_DISPLAY_NAMES[villaType] || villaType;
}

/**
 * Open VR tour in new tab with consistent parameters
 */
export function openVRTour(villaType: VillaType): void {
  const vrUrl = getVRUrl(villaType);
  window.open(vrUrl, '_blank', 'noopener,noreferrer');
}

/**
 * Open external URL in new tab
 */
export function openExternalUrl(url: keyof typeof EXTERNAL_URLS): void {
  window.open(EXTERNAL_URLS[url], '_blank', 'noopener,noreferrer');
}

/**
 * Navigate to internal page
 */
export function navigateToPage(path: string): void {
  window.location.href = path;
}

/**
 * Scroll to element with smooth behavior
 */
export function scrollToElement(elementId: string): void {
  const element = document.getElementById(elementId);
  if (element) {
    element.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start',
      inline: 'nearest'
    });
  }
}

/**
 * VR Service Interface
 */
export const vrService = {
  getVRUrl,
  getVillaDisplayName,
  openVRTour,
  openExternalUrl,
  navigateToPage,
  scrollToElement,
  urls: {
    vr: VR_URLS,
    external: EXTERNAL_URLS,
  },
  displayNames: VILLA_DISPLAY_NAMES,
};
