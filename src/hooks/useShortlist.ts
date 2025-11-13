/**
 * useShortlist Hook
 * 
 * React hook for managing shortlist state with real-time updates
 */

import { useState, useEffect } from 'react';
import { shortlistService, type ShortlistState } from '@/services/shortlistService';

export function useShortlist() {
  const [state, setState] = useState<ShortlistState>(shortlistService.getShortlist());

  useEffect(() => {
    const unsubscribe = shortlistService.subscribe((newState) => {
      setState(newState);
    });

    return unsubscribe;
  }, []);

  return {
    shortlist: state.items,
    shortlistIds: state.unitIds,
    isInShortlist: (unitId: string) => state.unitIds.has(unitId),
    addToShortlist: (unitId: string) => shortlistService.addUnit(unitId),
    removeFromShortlist: (unitId: string) => shortlistService.removeUnit(unitId),
    toggleShortlist: (unitId: string) => shortlistService.toggleUnit(unitId),
    clearShortlist: () => shortlistService.clear(),
    generateShareLink: (baseUrl?: string) => shortlistService.generateShareLink(baseUrl),
  };
}

